import { HarmonicObservatory } from '@/components/visualizer/HarmonicObservatory';
import { NowPlayingCard } from '@/components/player/NowPlayingCard';
import { TransportControls } from '@/components/player/TransportControls';
import { VisualizationModeToggle } from '@/components/player/VisualizationModeToggle';
import { Playlist } from '@/components/player/Playlist';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row lg:py-16">
      <section className="flex w-full flex-col gap-5 lg:max-w-sm">
        <NowPlayingCard />
        <TransportControls />
        <VisualizationModeToggle />
        <Playlist />
      </section>
      <section className="flex flex-1 flex-col">
        <div className="glass-panel relative flex h-[600px] flex-1 flex-col overflow-hidden rounded-3xl p-6 shadow-glow lg:h-[720px]">
          <header className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Harmonic Observatory</h1>
              <p className="mt-1 max-w-xl text-sm text-white/60">
                Explore multi-mode mathematical visualizations reacting in real time to curated audio tracks.
              </p>
            </div>
            <div className="hidden text-right text-xs uppercase tracking-widest text-white/40 lg:block">
              <p>Modes: Membrane · Fourier Helix · Lissajous</p>
              <p>Powered by Web Audio + Three.js</p>
            </div>
          </header>
          <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/40">
            <HarmonicObservatory />
          </div>
        </div>
      </section>
    </main>
  );
}
