'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { usePlayerStore } from '@/lib/store/playerStore';

export function NowPlayingCard() {
  const playlist = usePlayerStore((state) => state.playlist);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const track = playlist[currentIndex];

  const gradient = useMemo(() => {
    const accent = track?.accent ?? '#4cc9f0';
    return `linear-gradient(135deg, ${accent}33, rgba(8, 12, 42, 0.85))`;
  }, [track]);

  if (!track) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-sm text-white/70">
        Select a track to begin exploring the harmonic observatory.
      </div>
    );
  }

  return (
    <article
      className="glass-panel gradient-border relative overflow-hidden rounded-2xl p-6 shadow-glow"
      style={{ backgroundImage: gradient }}
    >
      <div className="relative z-10 flex items-center gap-5">
        <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-white/20 shadow-lg">
          <Image src={track.coverImage} alt={track.title} fill className="object-cover" sizes="112px" />
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-white/60">Now Playing</p>
          <h2 className="font-display text-2xl font-semibold leading-tight">{track.title}</h2>
          <p className="text-sm text-white/70">{track.artist}</p>
        </div>
      </div>
      {track.description ? (
        <p className="relative z-10 mt-4 text-sm text-white/70">{track.description}</p>
      ) : null}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl" />
      </div>
    </article>
  );
}
