'use client';

import clsx from 'clsx';
import { VISUALIZATION_MODES } from '@/lib/visualization/constants';
import { usePlayerStore } from '@/lib/store/playerStore';

export function VisualizationModeToggle() {
  const currentMode = usePlayerStore((state) => state.visualizationMode);
  const setVisualizationMode = usePlayerStore((state) => state.setVisualizationMode);

  return (
    <div className="glass-panel rounded-2xl p-4">
      <p className="text-xs uppercase tracking-widest text-white/60">Visualization Mode</p>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {VISUALIZATION_MODES.map((mode) => (
          <button
            key={mode.value}
            type="button"
            onClick={() => setVisualizationMode(mode.value)}
            className={clsx(
              'rounded-xl border border-white/10 px-4 py-3 text-left transition hover:border-white/30',
              currentMode === mode.value ? 'bg-white/10 shadow-glow' : 'bg-white/5'
            )}
          >
            <p className="font-semibold text-white/90">{mode.label}</p>
            <p className="text-xs text-white/60">{mode.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
