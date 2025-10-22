# Music Visualizer

This project provides a Three.js-powered music visualizer with reusable audio analysis hooks and a richly layered scene. The visualizer is exposed via `createVisualizerScene` in `app/visualizer/index.ts` and can be embedded in any web application that supplies a canvas and audio source.

## Features

- **Audio hooks** – Utilities for creating analysers, sampling frequency/time-domain data, and detecting beats (`app/visualizer/audio/hooks.ts`).
- **Waveform membrane** – A polar grid surface that displaces in the Z axis using the current waveform (`app/visualizer/geometry/waveformMembrane.ts`).
- **Fourier lattice & ribbons** – Instanced helical bars and spline ribbons animated from frequency magnitudes (`app/visualizer/geometry/fourierStructures.ts`).
- **Lissajous tracer particles** – Shader-driven particle system with gradient bloom reacting to beat strength (`app/visualizer/geometry/lissajousParticles.ts`).
- **Camera presets** – Auto-orbit, free-fly, and orthographic rigs with level-of-detail safeguards (`app/visualizer/controls/cameraPresets.ts`, `app/visualizer/utils/lod.ts`).
- **Post-processing** – Bloom and exponential fog pipeline (`app/visualizer/effects/postProcessing.ts`).

## Usage

```ts
import { createVisualizerScene } from './app/visualizer/index';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const audio = document.querySelector('audio') as HTMLAudioElement;

const visualizer = await createVisualizerScene({
  canvas,
  audioElement: audio,
  cameraPreset: 'autoOrbit',
});

// Switch camera presets on demand
visualizer.setCameraPreset('freeFly');

// Stop or dispose when no longer needed
visualizer.stop();
visualizer.dispose();
```

The visualizer automatically starts rendering unless `autoStart` is set to `false`. To customise bloom, fog, or camera settings, supply the respective option objects to `createVisualizerScene`.

## Development

Install dependencies and type-check the project:

```bash
npm install
npm run check
```

> **Note:** In network-restricted environments you may need to supply an alternate npm registry to fetch `three` and `typescript`.
