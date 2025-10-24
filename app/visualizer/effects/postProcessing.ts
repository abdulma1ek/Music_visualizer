import { Camera, Color, ColorRepresentation, FogExp2, Scene, Vector2, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export interface BloomFogOptions {
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  fogColor?: ColorRepresentation;
  fogDensity?: number;
  clearColor?: ColorRepresentation;
}

export interface PostProcessingBundle {
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
  renderPass: RenderPass;
  resize(): void;
}

export function createBloomFogPipeline(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  options: BloomFogOptions = {}
): PostProcessingBundle {
  const size = new Vector2();
  renderer.getSize(size);

  if (options.clearColor) {
    renderer.setClearColor(new Color(options.clearColor));
  }

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(size.clone(), options.bloomStrength ?? 1.1, options.bloomRadius ?? 0.65, options.bloomThreshold ?? 0.2);
  composer.addPass(bloomPass);

  if (options.fogColor || options.fogDensity) {
    const fogColor = new Color(options.fogColor ?? '#050513');
    scene.fog = new FogExp2(fogColor, options.fogDensity ?? 0.04);
  }

  function resize() {
    renderer.getSize(size);
    composer.setSize(size.x, size.y);
    bloomPass.setSize(size.x, size.y);
  }

  return {
    composer,
    bloomPass,
    renderPass,
    resize,
  };
}
