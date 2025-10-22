"use client";

import Link from "next/link";

import { usePlayerStore } from "@/app/providers";
import { formatDuration } from "@/lib/formatDuration";

export function Sidebar({ className = "" }: { className?: string }) {
  const queue = usePlayerStore((state) => state.queue);
  const currentTrackIndex = usePlayerStore((state) => state.currentTrackIndex);

  return (
    <aside
      className={`${className} w-full border-b border-white/10 bg-white/5 px-6 py-6 backdrop-blur md:w-80 md:border-r md:border-b-0 md:px-6 lg:px-8`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Playlist</h2>
          <p className="text-xs text-slate-400">Curated demo tracks</p>
        </div>
        <Link href="/player" className="text-xs font-medium text-brand-300 hover:text-brand-200">
          Open player
        </Link>
      </div>
      <div className="mt-5 space-y-3 text-sm">
        {queue.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center justify-between rounded-xl border border-white/5 px-4 py-3 transition ${
              index === currentTrackIndex ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <div>
              <p className="font-medium text-white">{track.title}</p>
              <p className="text-xs text-slate-300">{track.artist}</p>
            </div>
            <span className="text-xs text-slate-400">{formatDuration(track.duration)}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
