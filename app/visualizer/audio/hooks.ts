import { Clock } from 'three';

export interface AudioAnalyserConfig {
  /** FFT size used by the analyser; must be a power of two. */
  fftSize?: number;
  /** Minimum decibels for frequency domain analysis. */
  minDecibels?: number;
  /** Maximum decibels for frequency domain analysis. */
  maxDecibels?: number;
  /** Smoothing constant between frames (0.0 - 1.0). */
  smoothingTimeConstant?: number;
}

export interface AudioAnalyserHooks {
  analyser: AnalyserNode;
  /** Mutable buffer filled with frequency magnitudes (0-255). */
  frequencyData: Uint8Array;
  /** Mutable buffer filled with waveform samples (-1 to 1). */
  timeDomainData: Float32Array;
  /** Update analyser data. */
  update(): void;
  /** Returns RMS level of the latest time-domain data. */
  getRmsLevel(): number;
  /** Dispose analyser resources created internally. */
  dispose(): void;
}

export interface AudioBeatState {
  isBeat: boolean;
  strength: number;
  instantEnergy: number;
  averageEnergy: number;
}

export interface BeatDetector {
  update(deltaTime?: number): AudioBeatState;
  reset(): void;
}

export interface BeatDetectorConfig {
  /** Number of rolling history windows to keep for energy averaging. */
  historySize?: number;
  /** Multiplier applied to rolling average to determine beat threshold. */
  sensitivity?: number;
  /** Minimum time between beats in seconds. */
  minimumInterval?: number;
}

export interface CreateAnalyserFromElementOptions extends AudioAnalyserConfig {
  context?: AudioContext;
}

/**
 * Create a reusable analyser hooked up to a media element or media stream.
 */
export function createAudioAnalyser(
  context: AudioContext,
  source: AudioNode,
  config: AudioAnalyserConfig = {}
): AudioAnalyserHooks {
  const analyser = context.createAnalyser();
  analyser.fftSize = config.fftSize ?? 2048;
  analyser.minDecibels = config.minDecibels ?? -100;
  analyser.maxDecibels = config.maxDecibels ?? -10;
  analyser.smoothingTimeConstant = config.smoothingTimeConstant ?? 0.85;

  source.connect(analyser);
  analyser.connect(context.destination);

  const timeDomainData = new Float32Array(analyser.fftSize);
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);

  let disposed = false;

  return {
    analyser,
    timeDomainData,
    frequencyData,
    update() {
      if (disposed) return;
      analyser.getFloatTimeDomainData(timeDomainData);
      analyser.getByteFrequencyData(frequencyData);
    },
    getRmsLevel() {
      let sumSquares = 0;
      for (let i = 0; i < timeDomainData.length; i += 1) {
        const value = timeDomainData[i];
        sumSquares += value * value;
      }
      return Math.sqrt(sumSquares / timeDomainData.length);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      try {
        source.disconnect(analyser);
      } catch (error) {
        // Ignore disconnect errors triggered by already disconnected nodes.
      }
      try {
        analyser.disconnect();
      } catch (error) {
        // Ignore disconnect errors triggered by already disconnected nodes.
      }
    },
  };
}

/**
 * Utility that creates an analyser from a media element and ensures the context
 * is resumed when necessary.
 */
export async function createAnalyserFromMediaElement(
  element: HTMLMediaElement,
  options: CreateAnalyserFromElementOptions = {}
): Promise<AudioAnalyserHooks & { context: AudioContext; source: MediaElementAudioSourceNode }> {
  const context = options.context ?? new AudioContext();
  if (context.state === 'suspended') {
    await context.resume();
  }

  const source = context.createMediaElementSource(element);
  const analyserHooks = createAudioAnalyser(context, source, options);

  return {
    ...analyserHooks,
    context,
    source,
  };
}

/**
 * Beat detector using an energy-based algorithm inspired by
 * https://archive.gamedev.net/archive/reference/programming/features/beatdetection/index.html
 */
export function createBeatDetector(
  analyserHooks: AudioAnalyserHooks,
  config: BeatDetectorConfig = {}
): BeatDetector {
  const historySize = config.historySize ?? 43;
  const sensitivity = config.sensitivity ?? 1.35;
  const minInterval = config.minimumInterval ?? 0.2;

  const history: number[] = new Array(historySize).fill(0);
  let historyIndex = 0;
  let elapsedSinceBeat = minInterval;

  const clock = new Clock();

  function averageEnergy(): number {
    let total = 0;
    for (let i = 0; i < history.length; i += 1) {
      total += history[i];
    }
    return total / history.length;
  }

  return {
    reset() {
      history.fill(0);
      historyIndex = 0;
      elapsedSinceBeat = minInterval;
      clock.getDelta();
    },
    update(deltaTime) {
      const delta = deltaTime ?? clock.getDelta();
      elapsedSinceBeat += delta;

      const waveform = analyserHooks.timeDomainData;
      let energy = 0;
      for (let i = 0; i < waveform.length; i += 1) {
        const value = waveform[i];
        energy += value * value;
      }
      energy /= waveform.length;

      const avgEnergy = averageEnergy();
      const threshold = avgEnergy * sensitivity;
      const isBeat = energy > threshold && elapsedSinceBeat >= minInterval;

      history[historyIndex] = energy;
      historyIndex = (historyIndex + 1) % history.length;

      if (isBeat) {
        elapsedSinceBeat = 0;
      }

      return {
        isBeat,
        strength: isBeat ? Math.min(1, (energy - avgEnergy) / Math.max(avgEnergy, 1e-5)) : 0,
        instantEnergy: energy,
        averageEnergy: avgEnergy,
      };
    },
  };
}

export type FrequencySampler = (frequencyBin: number) => number;
export type WaveformSampler = (sampleIndex: number) => number;

/** Create a function for sampling normalised frequency magnitudes (0.0 - 1.0). */
export function createFrequencySampler(analyserHooks: AudioAnalyserHooks): FrequencySampler {
  const { frequencyData } = analyserHooks;
  return (frequencyBin: number) => {
    if (frequencyData.length === 0) return 0;
    const clampedIndex = Math.min(frequencyData.length - 1, Math.max(0, frequencyBin));
    return frequencyData[clampedIndex] / 255;
  };
}

/** Create a function for sampling time-domain waveform values (-1.0 - 1.0). */
export function createWaveformSampler(analyserHooks: AudioAnalyserHooks): WaveformSampler {
  const { timeDomainData } = analyserHooks;
  return (sampleIndex: number) => {
    if (timeDomainData.length === 0) return 0;
    const clampedIndex = Math.min(timeDomainData.length - 1, Math.max(0, sampleIndex));
    return timeDomainData[clampedIndex];
  };
}
