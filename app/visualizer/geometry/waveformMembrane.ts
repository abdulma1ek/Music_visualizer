import {
  BufferAttribute,
  BufferGeometry,
  ColorRepresentation,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
} from 'three';

export interface WaveformMembraneOptions {
  radius?: number;
  radialSegments?: number;
  angularSegments?: number;
  amplitude?: number;
  color?: ColorRepresentation;
  emissive?: ColorRepresentation;
  metalness?: number;
  roughness?: number;
}

export interface WaveformMembrane {
  mesh: Mesh;
  update(waveform: Float32Array): void;
  dispose(): void;
}

/**
 * Construct a polar grid surface whose vertices displace in the Z axis based on
 * time-domain audio amplitudes.
 */
export function createWaveformMembrane(options: WaveformMembraneOptions = {}): WaveformMembrane {
  const radius = options.radius ?? 6;
  const radialSegments = Math.max(2, Math.floor(options.radialSegments ?? 72));
  const angularSegments = Math.max(6, Math.floor(options.angularSegments ?? 160));
  const amplitude = options.amplitude ?? 4;

  const vertexCount = (radialSegments + 1) * (angularSegments + 1);
  const positions = new Float32Array(vertexCount * 3);
  const radialFactors = new Float32Array(vertexCount);
  const baseZ = new Float32Array(vertexCount);

  let index = 0;
  for (let r = 0; r <= radialSegments; r += 1) {
    const radialNorm = r / radialSegments;
    const radialLength = radialNorm * radius;
    for (let a = 0; a <= angularSegments; a += 1) {
      const angle = (a / angularSegments) * Math.PI * 2;
      positions[index * 3] = Math.cos(angle) * radialLength;
      positions[index * 3 + 1] = Math.sin(angle) * radialLength;
      positions[index * 3 + 2] = 0;
      radialFactors[index] = radialNorm;
      baseZ[index] = 0;
      index += 1;
    }
  }

  const indices: number[] = [];
  for (let r = 0; r < radialSegments; r += 1) {
    for (let a = 0; a < angularSegments; a += 1) {
      const stride = angularSegments + 1;
      const current = r * stride + a;
      const next = (r + 1) * stride + a;

      indices.push(current, next, current + 1);
      indices.push(current + 1, next, next + 1);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new MeshStandardMaterial({
    color: options.color ?? '#3cf9ff',
    emissive: options.emissive ?? '#0d2040',
    metalness: options.metalness ?? 0.4,
    roughness: options.roughness ?? 0.3,
    side: DoubleSide,
    wireframe: false,
  });

  const mesh = new Mesh(geometry, material);
  mesh.castShadow = false;
  mesh.receiveShadow = true;

  return {
    mesh,
    update(waveform) {
      const positionAttr = geometry.getAttribute('position') as BufferAttribute;
      const array = positionAttr.array as Float32Array;
      const sampleCount = waveform.length;

      for (let i = 0; i < radialFactors.length; i += 1) {
        const radialNorm = radialFactors[i];
        const sampleIndex = Math.min(sampleCount - 1, Math.floor(radialNorm * (sampleCount - 1)));
        const displacement = waveform[sampleIndex] * amplitude * Math.pow(1 - radialNorm, 1.5);
        array[i * 3 + 2] = baseZ[i] + displacement;
      }

      positionAttr.needsUpdate = true;
      geometry.computeVertexNormals();
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
