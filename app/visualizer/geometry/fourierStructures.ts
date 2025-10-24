import {
  BufferAttribute,
  BufferGeometry,
  ColorRepresentation,
  CylinderGeometry,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  Matrix4,
  MeshStandardMaterial,
  Object3D,
} from 'three';

export interface FourierLatticeOptions {
  radialCount?: number;
  axialCount?: number;
  radius?: number;
  height?: number;
  barRadius?: number;
  twist?: number;
  barColor?: ColorRepresentation;
  emissive?: ColorRepresentation;
}

export interface FourierLattice {
  group: Group;
  update(frequencyData: Uint8Array, deltaTime: number): void;
  dispose(): void;
}

/**
 * Create a helical bar lattice (instanced cylinders) animated by Fourier bins
 * alongside spline ribbons that react to frequency magnitudes.
 */
export function createFourierLattice(options: FourierLatticeOptions = {}): FourierLattice {
  const radialCount = Math.max(3, Math.floor(options.radialCount ?? 12));
  const axialCount = Math.max(4, Math.floor(options.axialCount ?? 48));
  const radius = options.radius ?? 5;
  const height = options.height ?? 12;
  const barRadius = options.barRadius ?? 0.08;
  const twist = options.twist ?? Math.PI * 1.5;

  const group = new Group();

  const barGeometry = new CylinderGeometry(barRadius, barRadius, 1, 12, 1, true);
  const barMaterial = new MeshStandardMaterial({
    color: options.barColor ?? '#fff7e6',
    emissive: options.emissive ?? '#40220d',
    metalness: 0.2,
    roughness: 0.6,
  });

  const instanceCount = radialCount * axialCount;
  const instancedBars = new InstancedMesh(barGeometry, barMaterial, instanceCount);
  instancedBars.instanceMatrix.setUsage(DynamicDrawUsage);
  group.add(instancedBars);

  const dummy = new Object3D();

  let instanceIndex = 0;
  for (let axial = 0; axial < axialCount; axial += 1) {
    const v = axial / axialCount;
    const y = (v - 0.5) * height;
    const axialAngle = axial * twist;

    for (let radial = 0; radial < radialCount; radial += 1) {
      const u = radial / radialCount;
      const angle = u * Math.PI * 2 + axialAngle;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      dummy.position.set(x, y, z);
      dummy.scale.set(1, 1, 1);
      dummy.lookAt(0, y, 0);
      dummy.updateMatrix();
      instancedBars.setMatrixAt(instanceIndex, dummy.matrix);
      instanceIndex += 1;
    }
  }

  instancedBars.instanceMatrix.needsUpdate = true;

  const ribbonCount = 3;
  const ribbonSegments = 240;
  const ribbons: { line: Line; geometry: BufferGeometry; material: LineBasicMaterial }[] = [];

  for (let i = 0; i < ribbonCount; i += 1) {
    const geometry = new BufferGeometry();
    const positions = new Float32Array((ribbonSegments + 1) * 3);
    geometry.setAttribute('position', new BufferAttribute(positions, 3));

    const material = new LineBasicMaterial({
      color: 0xff99ff,
      linewidth: 2,
      transparent: true,
      opacity: 0.75,
    });

    const line = new Line(geometry, material);
    line.frustumCulled = false;
    group.add(line);
    ribbons.push({ line, geometry, material });
  }

  let time = 0;
  const tempMatrix = new Matrix4();

  function updateBars(frequencyData: Uint8Array) {
    let idx = 0;
    for (let axial = 0; axial < axialCount; axial += 1) {
      for (let radial = 0; radial < radialCount; radial += 1) {
        const bin = Math.min(
          frequencyData.length - 1,
          Math.floor((idx / instanceCount) * frequencyData.length)
        );
        const magnitude = frequencyData.length > 0 ? frequencyData[bin] / 255 : 0;
        const heightScale = 0.6 + magnitude * 2.4;
        const thickness = 1 + magnitude * 0.8;

        instancedBars.getMatrixAt(idx, tempMatrix);
        tempMatrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.scale.set(thickness, heightScale, thickness);
        dummy.updateMatrix();
        instancedBars.setMatrixAt(idx, dummy.matrix);
        idx += 1;
      }
    }
    instancedBars.instanceMatrix.needsUpdate = true;
  }

  function updateRibbons(frequencyData: Uint8Array, deltaTime: number) {
    time += deltaTime;
    ribbons.forEach((ribbon, index) => {
      const positions = ribbon.geometry.getAttribute('position') as BufferAttribute;
      const array = positions.array as Float32Array;
      const phase = index * (Math.PI / ribbons.length);

      for (let i = 0; i <= ribbonSegments; i += 1) {
        const t = i / ribbonSegments;
        const angle = t * Math.PI * 4 + phase + time * 0.6;
        const bin = Math.min(
          frequencyData.length - 1,
          Math.floor(t * (frequencyData.length - 1))
        );
        const magnitude = frequencyData.length > 0 ? frequencyData[bin] / 255 : 0;
        const radialOffset = radius * (1.1 + magnitude * 0.45 * Math.sin(angle * 2));
        const x = Math.cos(angle) * radialOffset;
        const y = (t - 0.5) * height + Math.sin(time + phase) * magnitude * 1.5;
        const z = Math.sin(angle) * radialOffset;

        array[i * 3] = x;
        array[i * 3 + 1] = y;
        array[i * 3 + 2] = z;
      }

      positions.needsUpdate = true;
      ribbon.geometry.computeBoundingSphere();
    });
  }

  return {
    group,
    update(frequencyData, deltaTime) {
      updateBars(frequencyData);
      updateRibbons(frequencyData, deltaTime);
    },
    dispose() {
      barGeometry.dispose();
      barMaterial.dispose();
      ribbons.forEach((ribbon) => {
        ribbon.geometry.dispose();
        ribbon.material.dispose();
      });
    },
  };
}
