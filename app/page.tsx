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
    </main>
  );
}
