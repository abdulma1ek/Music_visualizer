'use client';

import { create } from 'zustand';

export type VisualizationMode = 'harmonic-membrane' | 'fourier-lattice' | 'lissajous-orbits';

export interface TrackMeta {
  id: string;
  title: string;
  artist: string;
  src: string;
  coverImage: string;
  description?: string;
  accent: string;
}

interface PlayerState {
  playlist: TrackMeta[];
  currentIndex: number;
  isPlaying: boolean;
  isReady: boolean;
  volume: number; // 0 - 1
  duration: number;
  progress: number;
  visualizationMode: VisualizationMode;
  setPlaylist: (tracks: TrackMeta[]) => void;
  setCurrentIndex: (index: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setReady: (ready: boolean) => void;
  setVolume: (volume: number) => void;
  setDuration: (duration: number) => void;
  setProgress: (progress: number) => void;
  setVisualizationMode: (mode: VisualizationMode) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  isReady: false,
  volume: 0.8,
  duration: 0,
  progress: 0,
  visualizationMode: 'harmonic-membrane',
  setPlaylist: (tracks) => set({ playlist: tracks, currentIndex: 0 }),
  setCurrentIndex: (index) => {
    const { playlist } = get();
    const boundedIndex = Math.max(0, Math.min(index, Math.max(playlist.length - 1, 0)));
    set({ currentIndex: boundedIndex, progress: 0, duration: 0 });
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setReady: (ready) => set({ isReady: ready }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(volume, 1)) }),
  setDuration: (duration) => set({ duration }),
  setProgress: (progress) => set({ progress }),
  setVisualizationMode: (mode) => set({ visualizationMode: mode }),
  playNext: () => {
    const { currentIndex, playlist } = get();
    if (!playlist.length) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    set({ currentIndex: nextIndex, progress: 0, duration: 0 });
  },
  playPrevious: () => {
    const { currentIndex, playlist } = get();
    if (!playlist.length) return;
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    set({ currentIndex: prevIndex, progress: 0, duration: 0 });
  }
}));
