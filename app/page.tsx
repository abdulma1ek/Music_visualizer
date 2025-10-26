import Link from 'next/link';

import { HarmonicObservatory } from '@/components/visualizer/HarmonicObservatory';
import { NowPlayingCard } from '@/components/player/NowPlayingCard';
import { TransportControls } from '@/components/player/TransportControls';
import { VisualizationModeToggle } from '@/components/player/VisualizationModeToggle';
import { Playlist } from '@/components/player/Playlist';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

const featureCards = [
  {
    title: 'Adaptive transport',
    body: 'Seamless seek, tempo, and state syncing powered by a centralized Zustand graph.'
  },
  {
    title: 'Matrix-grade visuals',
    body: 'Three.js membranes, lattices, and particle systems infused with Web Audio FFT data.'
  },
  {
    title: 'Bring your own audio',
    body: 'Upload to Vercel Blob or point us at a playlist manifest—tracks appear instantly.'
  }
] as const;

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-teal-200">
              Immersive Audio Architecture
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Harmonic Observatory Visualizer
            </h1>
            <p className="max-w-xl text-sm text-white/70">
              Navigate a glass-surfaced command deck where audio engineering meets luminous geometry.
              Harmonic Observatory syncs Web Audio, Three.js, and tactile transport controls in a cohesive,
              dark-matter interface.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <PrimaryButton asChild>
              <Link href="/player">Launch the player</Link>
            </PrimaryButton>
            <Link
              href="/upload"
              className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-teal-400/60 hover:text-white"
            >
              Upload your track
            </Link>
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              <dt className="uppercase tracking-[0.35em] text-xs text-white/40">Visualizer modes</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">Bars · Waveform · Aurora</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              <dt className="uppercase tracking-[0.35em] text-xs text-white/40">Latency budget</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">&lt; 12ms analyser pass</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              <dt className="uppercase tracking-[0.35em] text-xs text-white/40">Upload ready</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">Vercel Blob integration</dd>
            </div>
          </dl>
        </div>
        <div className="glass-panel relative flex h-[540px] flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 shadow-glow lg:h-[620px]">
          <div className="absolute inset-x-10 top-6 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
          <header className="mb-6 flex items-start justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Real-time render core</p>
              <p className="font-display text-2xl font-semibold tracking-tight text-white">
                Observatory viewport
              </p>
            </div>
            <div className="hidden text-right text-[10px] uppercase tracking-[0.4em] text-white/40 sm:block">
              <p>FFT ↔ Geometry</p>
              <p>Web Audio · Three.js</p>
            </div>
          </header>
          <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/60">
            <HarmonicObservatory />
            <div className="pointer-events-none absolute inset-0 border border-teal-400/10" />
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Command your soundscape
          </h2>
          <p className="max-w-lg text-sm text-white/70">
            The player route hosts the full transport console, playlist intelligence, and visualization toggles.
            Uploads appear instantly—just feed the Observatory a new signal and watch the geometry morph.
          </p>
          <div className="space-y-4">
            {featureCards.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-teal-400/40 hover:bg-white/10"
              >
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/70">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <NowPlayingCard />
          <TransportControls />
          <VisualizationModeToggle />
          <Playlist />
        </div>
      </section>
    </div>
  );
}
