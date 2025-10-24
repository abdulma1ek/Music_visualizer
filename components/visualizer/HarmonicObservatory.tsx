'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAudioEngine } from '@/app/providers';
import { usePlayerStore, type VisualizationMode } from '@/lib/store/playerStore';

const MODE_STYLES: Record<VisualizationMode, { membrane: string; bars: string; tracer: string; particles: string }> = {
  'harmonic-membrane': {
    membrane: '#4cc9f0',
    bars: '#f72585',
    tracer: '#b5179e',
    particles: '#4cc9f0'
  },
  'fourier-lattice': {
    membrane: '#4895ef',
    bars: '#f4a261',
    tracer: '#e9c46a',
    particles: '#90e0ef'
  },
  'lissajous-orbits': {
    membrane: '#90e0ef',
    bars: '#7209b7',
    tracer: '#f72585',
    particles: '#fde4ff'
  }
};

export function HarmonicObservatory() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engine = useAudioEngine();
  const mode = usePlayerStore((state) => state.visualizationMode);
  const modeRef = useRef(mode);
  const paletteApplierRef = useRef<(next: VisualizationMode) => void>();

  useEffect(() => {
    modeRef.current = mode;
    paletteApplierRef.current?.(mode);
  }, [mode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06081f, 0.045);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2.8, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color('#03010f'), 0);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    const directional = new THREE.DirectionalLight(0xffffff, 1.2);
    directional.position.set(4, 6, 8);
    scene.add(ambient, directional);

    const membraneGeometry = new THREE.PlaneGeometry(12, 12, 160, 160);
    membraneGeometry.rotateX(-Math.PI / 2);
    const membraneMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4cc9f0'),
      emissive: new THREE.Color('#7209b7'),
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.95,
      metalness: 0.4,
      roughness: 0.2,
      side: THREE.DoubleSide
    });
    const membraneMesh = new THREE.Mesh(membraneGeometry, membraneMaterial);
    membraneMesh.position.y = -0.25;
    scene.add(membraneMesh);

    const membraneWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(membraneGeometry),
      new THREE.LineBasicMaterial({ color: new THREE.Color('#ffffff'), transparent: true, opacity: 0.08 })
    );
    membraneMesh.add(membraneWire);

    const baseMembranePositions = (membraneGeometry.attributes.position.array as Float32Array).slice();

    const barCount = 180;
    const barGeometry = new THREE.CylinderGeometry(0.05, 0.08, 1, 8, 1, true);
    const barMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f72585'),
      emissive: new THREE.Color('#b5179e'),
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const bars = new THREE.InstancedMesh(barGeometry, barMaterial, barCount);
    const dummy = new THREE.Object3D();
    scene.add(bars);

    const lissajousSegments = 420;
    const lissajousPositions = new Float32Array(lissajousSegments * 3);
    const lissajousGeometry = new THREE.BufferGeometry();
    lissajousGeometry.setAttribute('position', new THREE.BufferAttribute(lissajousPositions, 3));
    const lissajousMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color('#b5179e'),
      transparent: true,
      opacity: 0.7,
      linewidth: 2
    });
    const lissajousLine = new THREE.Line(lissajousGeometry, lissajousMaterial);
    scene.add(lissajousLine);

    const particleCount = 600;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 6 + Math.random() * 6;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 6;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = height;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: new THREE.Color('#4cc9f0'),
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const paletteApplier = (nextMode: VisualizationMode) => {
      const palette = MODE_STYLES[nextMode];
      membraneMaterial.color.set(palette.membrane);
      membraneMaterial.emissive.set(palette.bars);
      barMaterial.color.set(palette.bars);
      barMaterial.emissive.set(palette.tracer);
      lissajousMaterial.color.set(palette.tracer);
      particlesMaterial.color.set(palette.particles);
    };

    paletteApplierRef.current = paletteApplier;
    paletteApplier(modeRef.current);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const waveform = engine.waveformData ?? engine.getWaveformSnapshot();
      const spectrum = engine.frequencyData ?? engine.getFrequencySnapshot();

      // Update membrane vertices based on waveform data
      if (waveform) {
        const attribute = membraneGeometry.attributes.position as THREE.BufferAttribute;
        const maxRadius = 6;
        for (let i = 0; i < attribute.count; i += 1) {
          const baseX = baseMembranePositions[i * 3];
          const baseY = baseMembranePositions[i * 3 + 1];
          const baseZ = baseMembranePositions[i * 3 + 2];
          const radius = Math.sqrt(baseX * baseX + baseZ * baseZ);
          const waveformIndex = Math.min(waveform.length - 1, Math.floor((radius / maxRadius) * waveform.length));
          const normalized = (waveform[waveformIndex] - 128) / 128;
          const falloff = Math.max(0, 1 - radius / maxRadius);
          const amplitude = 1.2 + Math.sin(elapsed * 0.6 + radius * 1.5) * 0.2;
          const displacement = normalized * falloff * amplitude;
          attribute.setXYZ(i, baseX, baseY + displacement, baseZ);
        }
        attribute.needsUpdate = true;
        membraneMaterial.emissiveIntensity = 0.45 + Math.abs(Math.sin(elapsed * 0.8)) * 0.25;
        membraneMaterial.opacity = 0.85 + Math.abs(Math.cos(elapsed * 0.4)) * 0.1;
      }

      // Fourier helix bars
      if (spectrum) {
        const freqLength = spectrum.length;
        const peak = spectrum.reduce((max, value) => Math.max(max, value), 0);
        const energy = peak / 255;
        const spiralTurns = 3.5 + energy * 2;
        for (let i = 0; i < barCount; i += 1) {
          const t = i / barCount;
          const angle = t * Math.PI * 2 * spiralTurns + elapsed * 0.25;
          const radius = 2.2 + t * 2.2;
          const freqIndex = Math.min(freqLength - 1, Math.floor(t * freqLength));
          const magnitude = spectrum[freqIndex] / 255;
          const height = 0.6 + magnitude * 4;
          dummy.position.set(Math.cos(angle) * radius, magnitude * 3 - 0.5, Math.sin(angle) * radius);
          dummy.scale.set(1, height, 1);
          dummy.rotation.set(Math.PI / 2, angle, 0);
          dummy.updateMatrix();
          bars.setMatrixAt(i, dummy.matrix);
        }
        bars.instanceMatrix.needsUpdate = true;
        barMaterial.emissiveIntensity = 0.4 + energy * 0.9;
        barMaterial.opacity = 0.75 + energy * 0.2;
      }

      // Lissajous tracer update
      const tracerPositions = lissajousGeometry.attributes.position as THREE.BufferAttribute;
      const tracerEnergy = spectrum ? spectrum[64] / 255 : 0.2;
      for (let i = 0; i < lissajousSegments; i += 1) {
        const t = i / lissajousSegments;
        const phi = elapsed * 0.9 + t * Math.PI * 2;
        const scale = 1.8 + tracerEnergy * 2.4;
        tracerPositions.setXYZ(
          i,
          Math.sin((2 + tracerEnergy) * phi) * scale,
          Math.cos((3 + tracerEnergy * 1.5) * phi) * (1.2 + tracerEnergy),
          Math.sin((4 + tracerEnergy * 1.2) * phi + Math.PI / 4) * (1.6 + tracerEnergy * 1.8)
        );
      }
      tracerPositions.needsUpdate = true;
      lissajousLine.rotation.y += 0.0035;
      lissajousLine.rotation.x = Math.sin(elapsed * 0.3) * 0.1;

      // Particle shimmer
      particles.rotation.y += 0.0008;
      particlesMaterial.opacity = 0.45 + Math.abs(Math.sin(elapsed * 0.5)) * 0.35;

      camera.position.x = Math.sin(elapsed * 0.18) * 7;
      camera.position.z = Math.cos(elapsed * 0.18) * 7;
      camera.position.y = 3 + Math.sin(elapsed * 0.3);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      renderer.dispose();
      membraneGeometry.dispose();
      membraneMaterial.dispose();
      barGeometry.dispose();
      barMaterial.dispose();
      lissajousGeometry.dispose();
      lissajousMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.domElement.remove();
    };
  }, [engine]);

  return <div ref={containerRef} className="h-full w-full rounded-3xl border border-white/10 bg-black/20" />;
}
