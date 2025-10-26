'use client';

import { HarmonicObservatory } from '@/components/visualizer/HarmonicObservatory';
import { NowPlayingCard } from '@/components/player/NowPlayingCard';
import { TransportControls } from '@/components/player/TransportControls';
import { VisualizationModeToggle } from '@/components/player/VisualizationModeToggle';
import { Playlist } from '@/components/player/Playlist';
import { usePlayerStore } from '@/lib/store/playerStore';

export function PlayerScreen() {
  const playlist = usePlayerStore((state) => state.playlist);
  const currentIndex = usePlayerStore((state) => state.currentIndex);

  return (
    <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
      <section className="flex flex-col gap-6">
        <NowPlayingCard />
        <TransportControls />
        <VisualizationModeToggle />
        <article className="glass-panel rounded-2xl border border-white/10 p-5 text-sm text-white/70">
          <header className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/40">
            <span>Session metrics</span>
            <span>Playlist · {playlist.length} tracks</span>
          </header>
          <p className="mt-3">
            Currently highlighting track <span className="text-white">{currentIndex + 1}</span>. Drop new audio on the
            Upload panel to expand this queue without leaving the Observatory.
          </p>
        </article>
        <Playlist className="overflow-hidden" />
      </section>
      <section className="flex h-full flex-1 flex-col">
        <div className="glass-panel relative flex min-h-[660px] flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 p-6 shadow-glow">
          <div className="absolute inset-x-12 top-6 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />
          <header className="mb-6 flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Immersive player mode</p>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Harmonic Observatory</h1>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                Dive deeper into the realtime Three.js visualizer with advanced transport controls and playlist
                management.
              </p>
            </div>
            <div className="text-right text-[10px] uppercase tracking-[0.4em] text-white/40">
              <p>Realtime FFT · Adaptive geometry</p>
              <p>Web Audio · Zustand orchestration</p>
            </div>
          </header>
          <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/60">
            <HarmonicObservatory />
            <div className="pointer-events-none absolute inset-0 border border-teal-400/10" />
          </div>
        </div>
      </section>
    </div>
  );
}
