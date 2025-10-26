import {
  AmbientLight,
  Camera,
  Clock,
  Color,
  DirectionalLight,
  Scene,
  WebGLRenderer,
} from 'three';
import {
  AudioAnalyserConfig,
  AudioAnalyserHooks,
  createAnalyserFromMediaElement,
  createBeatDetector,
  createFrequencySampler,
} from './audio/hooks';
import { createWaveformMembrane } from './geometry/waveformMembrane';
import { createFourierLattice } from './geometry/fourierStructures';
import { createLissajousParticles } from './geometry/lissajousParticles';
import {
  CameraControllerManager,
  CameraPresetName,
  CameraPresetOptions,
  createCameraController,
} from './controls/cameraPresets';
import { BloomFogOptions, createBloomFogPipeline } from './effects/postProcessing';
import { determineLod, pickLodValue } from './utils/lod';

export interface VisualizerOptions {
  canvas: HTMLCanvasElement;
  analyser?: AudioAnalyserHooks;
  audioElement?: HTMLMediaElement;
  audioContext?: AudioContext;
  analyserConfig?: AudioAnalyserConfig;
  cameraPreset?: CameraPresetName;
  cameraOptions?: CameraPresetOptions;
  bloom?: BloomFogOptions;
  dpr?: number;
  autoStart?: boolean;
}

export interface VisualizerInstance {
  scene: Scene;
  renderer: WebGLRenderer;
  cameraController: CameraControllerManager;
  audio: AudioAnalyserHooks;
  start(): void;
  stop(): void;
  dispose(): void;
  setCameraPreset(preset: CameraPresetName): void;
  getCameraPreset(): CameraPresetName;
}

async function prepareAnalyser(options: VisualizerOptions): Promise<AudioAnalyserHooks> {
  if (options.analyser) {
    return options.analyser;
  }

  if (options.audioElement) {
    return createAnalyserFromMediaElement(options.audioElement, {
      context: options.audioContext,
      ...options.analyserConfig,
    });
  }

  throw new Error('Visualizer requires either an analyser or audioElement source.');
}

function resolveCanvasSize(canvas: HTMLCanvasElement): { width: number; height: number } {
  const width = canvas.clientWidth || canvas.width || 1280;
  const height = canvas.clientHeight || canvas.height || 720;
  return { width, height };
}

export async function createVisualizerScene(options: VisualizerOptions): Promise<VisualizerInstance> {
  const { canvas } = options;
  if (!canvas) {
    throw new Error('Visualizer requires a canvas element.');
  }

  const analyser = await prepareAnalyser(options);
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;

  const { width, height } = resolveCanvasSize(canvas);
  const devicePixelRatio = Math.min(options.dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio : 1), 2.5);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(width, height, false);

  const scene = new Scene();
  scene.background = new Color('#04030a');

  const ambient = new AmbientLight('#4f5b9f', 0.6);
  const keyLight = new DirectionalLight('#c6d7ff', 1.2);
  keyLight.position.set(6, 10, 8);
  keyLight.castShadow = true;
  scene.add(ambient, keyLight);

  const lodMetrics = determineLod(width, height, renderer.getPixelRatio());

  const cameraController = createCameraController(
    renderer,
    options.cameraPreset ?? 'autoOrbit',
    options.cameraOptions ?? {}
  );
  let activeCamera: Camera = cameraController.getCamera();

  const bloomPipeline = createBloomFogPipeline(renderer, scene, activeCamera, {
    fogColor: options.bloom?.fogColor ?? '#050312',
    fogDensity: options.bloom?.fogDensity ?? 0.045,
    bloomStrength: options.bloom?.bloomStrength ?? 1.2,
    bloomRadius: options.bloom?.bloomRadius ?? 0.85,
    bloomThreshold: options.bloom?.bloomThreshold ?? 0.2,
    clearColor: options.bloom?.clearColor ?? '#010104',
  });

  const membrane = createWaveformMembrane({
    radialSegments: Math.round(pickLodValue({ high: 140, medium: 96, low: 64 }, lodMetrics.lod)),
    angularSegments: Math.round(pickLodValue({ high: 260, medium: 180, low: 120 }, lodMetrics.lod)),
    amplitude: 4 * lodMetrics.vertexMultiplier,
  });
  membrane.mesh.rotation.x = -Math.PI / 2;
  scene.add(membrane.mesh);

  const fourierLattice = createFourierLattice({
    radialCount: Math.round(pickLodValue({ high: 18, medium: 14, low: 10 }, lodMetrics.lod)),
    axialCount: Math.round(pickLodValue({ high: 64, medium: 48, low: 32 }, lodMetrics.lod)),
    radius: 5.5,
    height: 14,
  });
  scene.add(fourierLattice.group);

  const particles = createLissajousParticles({
    count: Math.round(pickLodValue({ high: 1400, medium: 950, low: 650 }, lodMetrics.lod)),
    baseAmplitude: 5 * lodMetrics.vertexMultiplier,
  });
  scene.add(particles.points);

  const frequencySampler = createFrequencySampler(analyser);
  const beatDetector = createBeatDetector(analyser);

  const clock = new Clock();
  let animationHandle: number | null = null;
  let running = false;

  function handleResize() {
    const canvasWidth = canvas.clientWidth || canvas.width || width;
    const canvasHeight = canvas.clientHeight || canvas.height || height;
    renderer.setSize(canvasWidth, canvasHeight, false);
    cameraController.resize(canvasWidth, canvasHeight);
    bloomPipeline.resize();
    activeCamera = cameraController.getCamera();
    bloomPipeline.renderPass.camera = activeCamera;
  }

  const handleResizeBound = () => handleResize();
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResizeBound);
  }

  handleResize();

  function renderFrame() {
    if (!running) return;
    const delta = clock.getDelta();

    analyser.update();
    const beatState = beatDetector.update(delta);

    membrane.update(analyser.timeDomainData);
    fourierLattice.update(analyser.frequencyData, delta);
    particles.update(delta, frequencySampler, beatState.strength);

    cameraController.update(delta);

    bloomPipeline.renderPass.camera = cameraController.getCamera();
    bloomPipeline.composer.render();

    animationHandle = requestAnimationFrame(renderFrame);
  }

  const instance: VisualizerInstance = {
    scene,
    renderer,
    cameraController,
    audio: analyser,
    start() {
      if (running) return;
      running = true;
      clock.start();
      clock.getDelta();
      renderFrame();
    },
    stop() {
      running = false;
      if (animationHandle !== null) {
        cancelAnimationFrame(animationHandle);
        animationHandle = null;
      }
    },
    dispose() {
      this.stop();
      membrane.dispose();
      fourierLattice.dispose();
      particles.dispose();
      analyser.dispose();
      bloomPipeline.composer.dispose();
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResizeBound);
      }
      renderer.dispose();
    },
    setCameraPreset(preset: CameraPresetName) {
      cameraController.setPreset(preset);
      activeCamera = cameraController.getCamera();
      bloomPipeline.renderPass.camera = activeCamera;
    },
    getCameraPreset() {
      return cameraController.getPreset();
    },
  };

  if (options.autoStart ?? true) {
    instance.start();
  }

  return instance;
}
