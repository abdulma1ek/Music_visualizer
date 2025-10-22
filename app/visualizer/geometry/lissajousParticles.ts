import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  ColorRepresentation,
  Points,
  ShaderMaterial,
} from 'three';
import { FrequencySampler } from '../audio/hooks';

export interface LissajousParticleOptions {
  count?: number;
  baseAmplitude?: number;
  size?: number;
  colorA?: ColorRepresentation;
  colorB?: ColorRepresentation;
}

export interface LissajousParticles {
  points: Points;
  update(deltaTime: number, frequencySampler: FrequencySampler, beatStrength: number): void;
  dispose(): void;
}

/** Lissajous curve-based tracer particles that bloom on beat events. */
export function createLissajousParticles(options: LissajousParticleOptions = {}): LissajousParticles {
  const count = Math.max(32, Math.floor(options.count ?? 800));
  const baseAmplitude = options.baseAmplitude ?? 4;
  const size = options.size ?? 28;

  const geometry = new BufferGeometry();
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count * 3);
  const gradientFactors = new Float32Array(count);
  const frequencyWeights = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    phases[i * 3] = Math.random() * Math.PI * 2;
    phases[i * 3 + 1] = Math.random() * Math.PI * 2;
    phases[i * 3 + 2] = Math.random() * Math.PI * 2;
    gradientFactors[i] = Math.random();
    frequencyWeights[i] = Math.random();
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('phase', new BufferAttribute(phases, 3));
  geometry.setAttribute('gradient', new BufferAttribute(gradientFactors, 1));
  geometry.setAttribute('frequencyWeight', new BufferAttribute(frequencyWeights, 1));

  const colorA = new Color(options.colorA ?? '#ffd6ff');
  const colorB = new Color(options.colorB ?? '#80c2ff');

  const material = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: size },
      uBeatIntensity: { value: 0 },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
    },
    vertexShader: /* glsl */ `
      uniform float uSize;
      uniform float uBeatIntensity;
      attribute vec3 phase;
      attribute float gradient;
      varying float vGradient;

      void main() {
        vGradient = gradient;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float beatScale = 1.0 + uBeatIntensity * 1.8;
        float jitter = 1.0 + 0.25 * sin(phase.x + phase.y + phase.z);
        gl_PointSize = uSize * beatScale * jitter * (1.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uBeatIntensity;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying float vGradient;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        if (dist > 0.5) discard;
        float falloff = smoothstep(0.5, 0.0, dist);
        vec3 color = mix(uColorA, uColorB, vGradient);
        float alpha = falloff * (0.35 + uBeatIntensity * 0.65);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    blending: AdditiveBlending,
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;

  let time = 0;
  let beat = 0;

  const frequencyOffsets = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    frequencyOffsets[i * 3] = 1 + Math.random() * 2;
    frequencyOffsets[i * 3 + 1] = 2 + Math.random() * 3;
    frequencyOffsets[i * 3 + 2] = 3 + Math.random() * 3;
  }

  return {
    points,
    update(deltaTime, frequencySampler, beatStrength) {
      time += deltaTime;
      beat = beat * 0.92 + beatStrength * 0.08;

      const positionAttr = geometry.getAttribute('position') as BufferAttribute;
      const phaseAttr = geometry.getAttribute('phase') as BufferAttribute;
      const gradientAttr = geometry.getAttribute('gradient') as BufferAttribute;
      const frequencyAttr = geometry.getAttribute('frequencyWeight') as BufferAttribute;

      const posArray = positionAttr.array as Float32Array;
      const phaseArray = phaseAttr.array as Float32Array;
      const gradArray = gradientAttr.array as Float32Array;
      const freqArray = frequencyAttr.array as Float32Array;

      for (let i = 0; i < count; i += 1) {
        const fx = frequencyOffsets[i * 3];
        const fy = frequencyOffsets[i * 3 + 1];
        const fz = frequencyOffsets[i * 3 + 2];
        const phaseX = phaseArray[i * 3] + time * fx;
        const phaseY = phaseArray[i * 3 + 1] + time * fy;
        const phaseZ = phaseArray[i * 3 + 2] + time * fz;

        const weight = freqArray[i];
        const frequencyBin = Math.floor(weight * 512);
        const magnitude = frequencySampler(frequencyBin);
        const amplitude = baseAmplitude * (0.75 + magnitude * 1.5 + beat * 0.6);

        posArray[i * 3] = Math.sin(phaseX) * amplitude;
        posArray[i * 3 + 1] = Math.sin(phaseY * 0.5 + beat * 2.0) * amplitude * 0.8;
        posArray[i * 3 + 2] = Math.cos(phaseZ) * amplitude;

        const gradientValue = Math.min(1, 0.2 + magnitude * 0.6 + beat * 0.2);
        gradArray[i] = gradientValue;
      }

      material.uniforms.uTime.value = time;
      material.uniforms.uBeatIntensity.value = beat;

      positionAttr.needsUpdate = true;
      gradientAttr.needsUpdate = true;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
