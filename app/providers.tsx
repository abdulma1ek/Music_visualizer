'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

import { useAudioController, type AudioController } from '@/lib/audio/useAudioController';
import { usePlayerStore, type TrackMeta } from '@/lib/store/playerStore';

const AudioEngineContext = createContext<AudioController | null>(null);

const DEFAULT_ACCENT = '#4cc9f0';
const AUDIO_FILE_EXT_PATTERN = /\.(mp3|m4a|aac|wav|ogg|flac)$/i;

const DEMO_TRACKS: TrackMeta[] = [
  {
    id: 'celestial-echoes',
    title: 'Celestial Echoes',
    artist: 'Nova Pulse',
    src: 'https://cdn.pixabay.com/audio/2024/02/26/audio_5d3a0285be.mp3',
    coverImage:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=640&q=80',
    description: 'Glassy synth arpeggios cascading over deep pads and polyrhythms.',
    accent: '#f72585'
  },
  {
    id: 'luminous-orbit',
    title: 'Luminous Orbit',
    artist: 'Spectrum Flux',
    src: 'https://cdn.pixabay.com/audio/2023/02/24/audio_d90f443b67.mp3',
    coverImage:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=640&q=80',
    description: 'Driving percussive groove with shimmering keys and cosmic swells.',
    accent: '#4cc9f0'
  },
  {
    id: 'quantum-drift',
    title: 'Quantum Drift',
    artist: 'Vector Fields',
    src: 'https://cdn.pixabay.com/audio/2021/09/24/audio_45c7e99c56.mp3',
    coverImage:
      'https://images.unsplash.com/photo-1487253096619-3e08403f01f4?auto=format&fit=crop&w=640&q=80',
    description: 'Slow-blooming ambient textures with evolving harmonic clusters.',
    accent: '#f4a261'
  }
];

const SINGLE_TRACK_ENV = {
  src: process.env.NEXT_PUBLIC_DEMO_AUDIO_TRACK_SRC?.trim() || null,
  title: process.env.NEXT_PUBLIC_DEMO_AUDIO_TRACK_TITLE?.trim() || null,
  artist: process.env.NEXT_PUBLIC_DEMO_AUDIO_TRACK_ARTIST?.trim() || null,
  coverImage: process.env.NEXT_PUBLIC_DEMO_AUDIO_TRACK_COVER?.trim() || null,
  accent: process.env.NEXT_PUBLIC_DEMO_AUDIO_TRACK_ACCENT?.trim() || null,
  description: process.env.NEXT_PUBLIC_DEMO_AUDIO_TRACK_DESCRIPTION?.trim() || null,
  duration: process.env.NEXT_PUBLIC_DEMO_AUDIO_TRACK_DURATION
    ? Number(process.env.NEXT_PUBLIC_DEMO_AUDIO_TRACK_DURATION)
    : undefined
};

export function AppProviders({ children }: { children: ReactNode }) {
  const setPlaylist = usePlayerStore((state) => state.setPlaylist);
  const controller = useAudioController();
  const demoAudioBaseUrl = process.env.NEXT_PUBLIC_DEMO_AUDIO_BASE_URL?.trim() || null;

  useEffect(() => {
    let cancelled = false;
    const normalized = demoAudioBaseUrl ? demoAudioBaseUrl.replace(/\/$/, '') : null;
    const baseIsAudioFile = normalized ? AUDIO_FILE_EXT_PATTERN.test(normalized) : false;
    const playlistBase = baseIsAudioFile ? null : normalized;
    const directAudioSrc = baseIsAudioFile ? normalized : null;

    const resolveAsset = (value: string | undefined) => {
      if (!value) return undefined;
      if (!playlistBase) return value;
      if (/^https?:\/\//i.test(value)) return value;
      if (/^\//.test(value)) {
        return `${playlistBase}${value}`;
      }
      return `${playlistBase}/${value}`;
    };

    const buildSingleTrack = (): TrackMeta | null => {
      const candidateSrc = SINGLE_TRACK_ENV.src || directAudioSrc;
      if (!candidateSrc) return null;

      if (
        SINGLE_TRACK_ENV.src &&
        !/^https?:\/\//i.test(SINGLE_TRACK_ENV.src) &&
        !playlistBase
      ) {
        console.warn(
          '[AppProviders] Skipping single-track override. Provide an absolute URL or set DEMO_AUDIO_BASE_URL to a folder.'
        );
        return null;
      }

      const src = SINGLE_TRACK_ENV.src ? resolveAsset(SINGLE_TRACK_ENV.src) : candidateSrc;
      if (!src) {
        console.warn('[AppProviders] Skipping single-track override. Could not resolve "src".');
        return null;
      }

      const cover = SINGLE_TRACK_ENV.coverImage ? resolveAsset(SINGLE_TRACK_ENV.coverImage) : undefined;

      return {
        id: SINGLE_TRACK_ENV.title ?? SINGLE_TRACK_ENV.artist ?? 'custom-track',
        title: SINGLE_TRACK_ENV.title ?? 'Custom Track',
        artist: SINGLE_TRACK_ENV.artist ?? 'Unknown Artist',
        src,
        coverImage: cover,
        description: SINGLE_TRACK_ENV.description ?? undefined,
        accent: SINGLE_TRACK_ENV.accent ?? DEFAULT_ACCENT,
        duration:
          Number.isFinite(SINGLE_TRACK_ENV.duration) && SINGLE_TRACK_ENV.duration
            ? SINGLE_TRACK_ENV.duration
            : undefined
      };
    };

    const fallbackToLocalTracks = (reason?: unknown) => {
      if (reason instanceof Error) {
        console.warn('[AppProviders] Falling back to local tracks:', reason.message);
      } else if (typeof reason === 'string') {
        console.warn('[AppProviders] Falling back to local tracks:', reason);
      }

      const singleTrack = buildSingleTrack();
      const nextPlaylist = singleTrack ? [singleTrack] : DEMO_TRACKS;

      if (!cancelled) {
        setPlaylist(nextPlaylist);
      }
    };

    fallbackToLocalTracks();

    if (!playlistBase) {
      return () => {
        cancelled = true;
      };
    }

    const hydrateFromRemote = async () => {
      try {
        const response = await fetch(`${playlistBase}/playlist.json`, {
          cache: 'no-store'
        });
        if (!response.ok) {
          throw new Error(`Failed to load playlist.json (${response.status})`);
        }

        const payload = (await response.json()) as {
          tracks?: Array<Partial<TrackMeta> & { id?: string; src?: string }>;
        };

        if (!Array.isArray(payload.tracks)) {
          throw new Error('playlist.json must contain a "tracks" array.');
        }

        const remoteTracks = payload.tracks
          .map((track, index): TrackMeta | null => {
            if (!track?.id || !track.src) {
              console.warn(
                `Skipping track at index ${index} in playlist.json. "id" and "src" are required`
              );
              return null;
            }

            const resolvedSrc = resolveAsset(track.src);
            if (!resolvedSrc) {
              console.warn(
                `Skipping track "${track.id}". Could not resolve "src" using DEMO_AUDIO_BASE_URL`
              );
              return null;
            }

            const accent = track.accent ?? DEFAULT_ACCENT;
            return {
              id: track.id,
              title: track.title ?? track.id,
              artist: track.artist ?? 'Unknown Artist',
              src: resolvedSrc,
              coverImage: resolveAsset(track.coverImage),
              description: track.description,
              accent,
              duration: track.duration
            };
          })
          .filter((track): track is TrackMeta => track !== null);

        if (remoteTracks.length === 0) {
          throw new Error('No valid tracks were found in playlist.json.');
        }

        if (!cancelled) {
          setPlaylist(remoteTracks);
        }
      } catch (error) {
        fallbackToLocalTracks(error);
      }
    };

    void hydrateFromRemote();

    return () => {
      cancelled = true;
    };
  }, [demoAudioBaseUrl, setPlaylist]);

  const value = useMemo(() => controller, [controller]);

  return <AudioEngineContext.Provider value={value}>{children}</AudioEngineContext.Provider>;
}

export function useAudioEngine() {
  const context = useContext(AudioEngineContext);
  if (!context) {
    throw new Error('useAudioEngine must be used within the <AppProviders> tree.');
  }
  return context;
}
