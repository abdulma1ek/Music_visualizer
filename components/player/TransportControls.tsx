'use client';

import { useCallback, useMemo, type ChangeEvent } from 'react';
import { useAudioEngine } from '@/app/providers';
import { usePlayerStore } from '@/lib/store/playerStore';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function TransportControls() {
  const engine = useAudioEngine();
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const playNext = usePlayerStore((state) => state.playNext);
  const playPrevious = usePlayerStore((state) => state.playPrevious);
  const progress = usePlayerStore((state) => state.progress);
  const duration = usePlayerStore((state) => state.duration);
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);

  const progressPercent = useMemo(() => {
    if (!duration) return 0;
    return (progress / duration) * 100;
  }, [progress, duration]);

  const onSeek = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      engine.seek(value);
    },
    [engine]
  );

  const onVolumeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value) / 100;
      setVolume(value);
    },
    [setVolume]
  );

  const handlePlayPause = useCallback(async () => {
    await engine.resume();
    setIsPlaying(!isPlaying);
  }, [engine, isPlaying, setIsPlaying]);

  return (
    <div className="glass-panel flex flex-col gap-4 rounded-2xl p-6">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={playPrevious}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-white/70 transition hover:bg-white/20"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={handlePlayPause}
          className="rounded-full bg-magenta px-6 py-2 font-display text-lg font-semibold uppercase tracking-widest text-white shadow-lg transition hover:bg-magenta/90"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          onClick={playNext}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-white/70 transition hover:bg-white/20"
        >
          Next
        </button>
      </div>
      <div>
        <label htmlFor="progress" className="flex items-center justify-between text-xs uppercase tracking-widest text-white/60">
          <span>Timeline</span>
          <span>
            {formatTime(progress)} / {formatTime(duration)}
          </span>
        </label>
        <input
          id="progress"
          type="range"
          min={0}
          max={duration || 0}
          value={Math.min(progress, duration || 0)}
          onChange={onSeek}
          className="mt-2 w-full accent-magenta"
        />
        <div className="mt-1 h-1 rounded-full bg-white/10">
          <div className="h-1 rounded-full bg-gradient-to-r from-magenta via-nebula to-aurora" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      <div>
        <label htmlFor="volume" className="flex items-center justify-between text-xs uppercase tracking-widest text-white/60">
          <span>Volume</span>
          <span>{Math.round(volume * 100)}%</span>
        </label>
        <input
          id="volume"
          type="range"
          min={0}
          max={100}
          value={Math.round(volume * 100)}
          onChange={onVolumeChange}
          className="mt-2 w-full accent-aurora"
        />
      </div>
    </div>
  );
}
