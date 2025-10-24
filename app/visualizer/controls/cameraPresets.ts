import {
  Camera,
  OrthographicCamera,
  PerspectiveCamera,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

export type CameraPresetName = 'autoOrbit' | 'freeFly' | 'orthographic';

export interface CameraRig {
  camera: Camera;
  update(deltaTime: number): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

export interface CameraPresetOptions {
  target?: Vector3;
  initialPosition?: Vector3;
  orbitDistance?: number;
  movementSpeed?: number;
  orthographicSize?: number;
}

export interface CameraControllerManager {
  getCamera(): Camera;
  getPreset(): CameraPresetName;
  setPreset(preset: CameraPresetName): void;
  update(deltaTime: number): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

interface CameraRigFactoryContext {
  renderer: WebGLRenderer;
  width: number;
  height: number;
  options: CameraPresetOptions;
}

function createAutoOrbitRig({ renderer, width, height, options }: CameraRigFactoryContext): CameraRig {
  const camera = new PerspectiveCamera(60, width / height, 0.1, 200);
  const orbitDistance = options.orbitDistance ?? 18;
  const target = options.target ?? new Vector3(0, 0, 0);
  const initialPosition = options.initialPosition ?? new Vector3(orbitDistance, orbitDistance * 0.35, orbitDistance);

  camera.position.copy(initialPosition);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;
  controls.target.copy(target);
  controls.maxDistance = orbitDistance * 2.5;
  controls.minDistance = orbitDistance * 0.5;

  return {
    camera,
    update() {
      controls.update();
    },
    resize(newWidth, newHeight) {
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    },
    dispose() {
      controls.dispose();
    },
  };
}

function createFreeFlyRig({ renderer, width, height, options }: CameraRigFactoryContext): CameraRig {
  const camera = new PerspectiveCamera(65, width / height, 0.05, 400);
  camera.position.copy(options.initialPosition ?? new Vector3(0, 8, 24));

  const controls = new FlyControls(camera, renderer.domElement);
  controls.movementSpeed = options.movementSpeed ?? 20;
  controls.rollSpeed = Math.PI / 12;
  controls.autoForward = false;
  controls.dragToLook = true;

  return {
    camera,
    update(deltaTime) {
      controls.update(deltaTime);
    },
    resize(newWidth, newHeight) {
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    },
    dispose() {
      controls.dispose();
    },
  };
}

function createOrthographicRig({ renderer, width, height, options }: CameraRigFactoryContext): CameraRig {
  const aspect = width / height;
  const size = options.orthographicSize ?? 18;
  const camera = new OrthographicCamera(
    (-size * aspect) / 2,
    (size * aspect) / 2,
    size / 2,
    -size / 2,
    -200,
    400
  );
  camera.position.copy(options.initialPosition ?? new Vector3(0, 12, 24));
  camera.lookAt(options.target ?? new Vector3(0, 0, 0));

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false;
  controls.enablePan = true;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.zoomSpeed = 1.2;
  controls.minZoom = 0.5;
  controls.maxZoom = 6;
  controls.target.copy(options.target ?? new Vector3(0, 0, 0));

  return {
    camera,
    update() {
      controls.update();
    },
    resize(newWidth, newHeight) {
      const newAspect = newWidth / newHeight;
      camera.left = (-size * newAspect) / 2;
      camera.right = (size * newAspect) / 2;
      camera.top = size / 2;
      camera.bottom = -size / 2;
      camera.updateProjectionMatrix();
    },
    dispose() {
      controls.dispose();
    },
  };
}

function buildRig(
  preset: CameraPresetName,
  context: CameraRigFactoryContext
): CameraRig {
  switch (preset) {
    case 'autoOrbit':
      return createAutoOrbitRig(context);
    case 'freeFly':
      return createFreeFlyRig(context);
    case 'orthographic':
      return createOrthographicRig(context);
    default:
      return createAutoOrbitRig(context);
  }
}

export function createCameraController(
  renderer: WebGLRenderer,
  initialPreset: CameraPresetName,
  options: CameraPresetOptions = {}
): CameraControllerManager {
  const size = renderer.getSize(new Vector2());
  let width = size.x;
  let height = size.y;
  let preset = initialPreset;
  let rig: CameraRig = buildRig(preset, { renderer, width, height, options });

  return {
    getCamera() {
      return rig.camera;
    },
    getPreset() {
      return preset;
    },
    setPreset(nextPreset) {
      if (preset === nextPreset) return;
      rig.dispose();
      preset = nextPreset;
      rig = buildRig(preset, { renderer, width, height, options });
    },
    update(deltaTime) {
      rig.update(deltaTime);
    },
    resize(newWidth, newHeight) {
      width = newWidth;
      height = newHeight;
      rig.resize(newWidth, newHeight);
    },
    dispose() {
      rig.dispose();
    },
  };
}
