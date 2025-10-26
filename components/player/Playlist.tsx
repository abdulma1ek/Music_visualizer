'use client';

import clsx from 'clsx';
import { useMemo } from 'react';
import { usePlayerStore } from '@/lib/store/playerStore';

export function Playlist({ className = '' }: { className?: string }) {
  const playlist = usePlayerStore((state) => state.playlist);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const setCurrentIndex = usePlayerStore((state) => state.setCurrentIndex);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

  const hasTracks = useMemo(() => playlist.length > 0, [playlist.length]);

  if (!hasTracks) {
    return (
      <div className={`glass-panel rounded-2xl p-6 text-sm text-white/60 ${className}`}>
        Loading curated tracks for the demo showcase...
      </div>
    );
  }

  return (
    <div className={`glass-panel rounded-2xl p-2 ${className}`}>
      <ul className="max-h-72 space-y-1 overflow-y-auto p-2 pr-1 scrollbar-thin">
        {playlist.map((track, index) => {
          const isActive = index === currentIndex;
          const accent = track.accent ?? '#4cc9f0';
          return (
            <li key={track.id}>
              <button
                type="button"
                onClick={() => {
                  setCurrentIndex(index);
                  setIsPlaying(true);
                }}
                className={clsx(
                  'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-white/5',
                  isActive ? 'bg-white/10 shadow-glow' : 'bg-transparent'
                )}
              >
                <div>
                  <p className="font-medium text-white/90">{track.title ?? track.id}</p>
                  <p className="text-xs text-white/60">{track.artist ?? 'Unknown Artist'}</p>
                </div>
                <span
                  className="ml-4 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold uppercase"
                  style={{ background: `${accent}33`, color: accent }}
                >
                  {index + 1}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
