export type LodLevel = 'low' | 'medium' | 'high';

export interface LodDetailOptions {
  high: number;
  medium: number;
  low: number;
}

export interface LodMetrics {
  lod: LodLevel;
  vertexMultiplier: number;
}

export function determineLod(
  width: number,
  height: number,
  devicePixelRatio: number
): LodMetrics {
  const pixelCount = width * height * Math.max(1, devicePixelRatio);
  if (pixelCount > 4_000_000) {
    return { lod: 'low', vertexMultiplier: 0.35 };
  }
  if (pixelCount > 2_000_000) {
    return { lod: 'medium', vertexMultiplier: 0.6 };
  }
  return { lod: 'high', vertexMultiplier: 1 };
}

export function pickLodValue(options: LodDetailOptions, level: LodLevel): number {
  switch (level) {
    case 'high':
      return options.high;
    case 'medium':
      return options.medium;
    case 'low':
    default:
      return options.low;
  }
}
