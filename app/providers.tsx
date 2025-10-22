"use client";

import { createContext, useContext, useRef } from "react";
import type { ReactNode } from "react";
import { createStore, useStore } from "zustand";
import type { StoreApi } from "zustand";

export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
  coverColor: string;
  duration: number;
};

export type VisualizerMode = "bars" | "waveform" | "sphere";

export interface PlayerStoreState {
  queue: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  playbackRate: number;
  volume: number;
  currentTime: number;
  duration: number;
  visualizerMode: VisualizerMode;
  visualizerIntensity: number;
  setQueue: (tracks: Track[]) => void;
  setCurrentTrackIndex: (index: number) => void;
  setIsPlaying: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setPlaybackRate: (value: number) => void;
  setVolume: (value: number) => void;
  setCurrentTime: (value: number) => void;
  setDuration: (value: number) => void;
  setVisualizerMode: (mode: VisualizerMode) => void;
  setVisualizerIntensity: (value: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

const defaultQueue: Track[] = [
  {
    id: "dreamscape",
    title: "Dreamscape",
    artist: "Aether Fields",
    src: "https://cdn.pixabay.com/download/audio/2021/11/16/audio_c0608e0cb4.mp3?filename=dreams-110997.mp3",
    coverColor: "from-brand-400 via-purple-400 to-fuchsia-500",
    duration: 244
  },
  {
    id: "pulse",
    title: "Neon Pulse",
    artist: "Citylight",
    src: "https://cdn.pixabay.com/download/audio/2022/03/22/audio_3b1be3294a.mp3?filename=neon-lights-140532.mp3",
    coverColor: "from-emerald-400 via-cyan-400 to-blue-500",
    duration: 212
  },
  {
    id: "embers",
    title: "Rising Embers",
    artist: "Ember Collective",
    src: "https://cdn.pixabay.com/download/audio/2022/10/23/audio_963a3be685.mp3?filename=epic-ambient-123636.mp3",
    coverColor: "from-amber-400 via-orange-400 to-rose-500",
    duration: 265
  }
];

export const createPlayerStore = (
  initState: Partial<PlayerStoreState> = {}
): StoreApi<PlayerStoreState> =>
  createStore<PlayerStoreState>((set, get) => ({
    queue: initState.queue ?? defaultQueue,
    currentTrackIndex: initState.currentTrackIndex ?? 0,
    isPlaying: initState.isPlaying ?? false,
    isLoading: initState.isLoading ?? false,
    playbackRate: initState.playbackRate ?? 1,
    volume: initState.volume ?? 0.8,
    currentTime: initState.currentTime ?? 0,
    duration: initState.duration ?? defaultQueue[0]?.duration ?? 0,
    visualizerMode: initState.visualizerMode ?? "bars",
    visualizerIntensity: initState.visualizerIntensity ?? 0.6,
    setQueue: (tracks) => set({ queue: tracks }),
    setCurrentTrackIndex: (index) =>
      set({
        currentTrackIndex: Math.max(0, Math.min(index, get().queue.length - 1)),
        currentTime: 0,
        duration: get().queue[index]?.duration ?? get().duration
      }),
    setIsPlaying: (value) => set({ isPlaying: value }),
    setIsLoading: (value) => set({ isLoading: value }),
    setPlaybackRate: (value) => set({ playbackRate: value }),
    setVolume: (value) => set({ volume: Math.max(0, Math.min(1, value)) }),
    setCurrentTime: (value) => set({ currentTime: Math.max(0, value) }),
    setDuration: (value) => set({ duration: Math.max(0, value) }),
    setVisualizerMode: (mode) => set({ visualizerMode: mode }),
    setVisualizerIntensity: (value) => set({ visualizerIntensity: Math.max(0, Math.min(1, value)) }),
    nextTrack: () => {
      const nextIndex = get().currentTrackIndex + 1;
      if (nextIndex < get().queue.length) {
        set({ currentTrackIndex: nextIndex, currentTime: 0 });
      } else {
        set({ currentTrackIndex: 0, currentTime: 0 });
      }
    },
    previousTrack: () => {
      const prevIndex = get().currentTrackIndex - 1;
      if (prevIndex >= 0) {
        set({ currentTrackIndex: prevIndex, currentTime: 0 });
      } else {
        set({ currentTrackIndex: get().queue.length - 1, currentTime: 0 });
      }
    }
  }));

const PlayerStoreContext = createContext<StoreApi<PlayerStoreState> | null>(null);

export const PlayerStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StoreApi<PlayerStoreState>>();
  if (!storeRef.current) {
    storeRef.current = createPlayerStore();
  }

  return <PlayerStoreContext.Provider value={storeRef.current}>{children}</PlayerStoreContext.Provider>;
};

export const usePlayerStore = <T,>(selector: (state: PlayerStoreState) => T): T => {
  const store = useContext(PlayerStoreContext);
  if (!store) {
    throw new Error("usePlayerStore must be used within PlayerStoreProvider");
  }

  return useStore(store, selector);
};

export const Providers = ({ children }: { children: ReactNode }) => {
  return <PlayerStoreProvider>{children}</PlayerStoreProvider>;
};
