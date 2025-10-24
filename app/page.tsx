import Link from "next/link";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Section } from "@/components/layout/Section";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-12 py-10">
      <Section
        title="Realtime music visualizer"
        subtitle="Experience a curated set of tracks with dynamic visual feedback and granular playback controls."
      >
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <PrimaryButton asChild>
            <Link href="/player">Launch player</Link>
          </PrimaryButton>
          <p className="max-w-xl text-sm text-slate-300">
            Built with Next.js App Router, Tailwind CSS, Web Audio API, and Zustand for responsive, immersive playback
            exploration.
          </p>
        </div>
      </Section>
      <Section title="Features">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Granular control",
              body: "Adjust playback rate, seek positions, and gain with millisecond accuracy backed by a synchronized audio graph."
            },
            {
              title: "Visual fidelity",
              body: "Optimized layout primitives maintain clarity on tablets and wide displays with adaptive scaling."
            },
            {
              title: "Extensible stack",
              body: "Composable hooks, stores, and audio nodes make it easy to plug in new visualizers and gestures."
            }
          ].map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{feature.body}</p>
            </div>
          ))}
        </div>
      </Section>
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
