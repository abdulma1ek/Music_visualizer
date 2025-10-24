'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { useAudioController, type AudioController } from '@/lib/audio/useAudioController';
import { TrackMeta, usePlayerStore } from '@/lib/store/playerStore';

const AudioEngineContext = createContext<AudioController | null>(null);

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

export function AppProviders({ children }: { children: React.ReactNode }) {
  const setPlaylist = usePlayerStore((state) => state.setPlaylist);
  const controller = useAudioController();

  useEffect(() => {
    setPlaylist(DEMO_TRACKS);
  }, [setPlaylist]);

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
