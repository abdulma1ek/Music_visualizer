import type { VisualizationMode } from '@/lib/store/playerStore';

export const VISUALIZATION_MODES: Array<{
  value: VisualizationMode;
  label: string;
  description: string;
}> = [
  {
    value: 'harmonic-membrane',
    label: 'Waveform Membrane',
    description: 'Deforms a polar surface directly from the time-domain waveform.'
  },
  {
    value: 'fourier-lattice',
    label: 'Fourier Helix',
    description: 'Transforms the frequency spectrum into helical bar lattices and ribbons.'
  },
  {
    value: 'lissajous-orbits',
    label: 'Lissajous Orbits',
    description: 'Projects harmonic ratios into glowing tracer paths through 3D space.'
  }
];
