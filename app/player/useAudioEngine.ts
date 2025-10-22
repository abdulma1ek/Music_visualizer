"use client";

import { useCallback, useEffect, useRef } from "react";

import { usePlayerStore } from "@/app/providers";

export function useAudioEngine() {
  const {
    queue,
    currentTrackIndex,
    isPlaying,
    playbackRate,
    volume,
    visualizerMode,
    setIsPlaying,
    setIsLoading,
    setCurrentTime,
    setDuration,
    setPlaybackRate,
    setVolume,
    nextTrack
  } = usePlayerStore((state) => ({
    queue: state.queue,
    currentTrackIndex: state.currentTrackIndex,
    isPlaying: state.isPlaying,
    playbackRate: state.playbackRate,
    volume: state.volume,
    visualizerMode: state.visualizerMode,
    setIsPlaying: state.setIsPlaying,
    setIsLoading: state.setIsLoading,
    setCurrentTime: state.setCurrentTime,
    setDuration: state.setDuration,
    setPlaybackRate: state.setPlaybackRate,
    setVolume: state.setVolume,
    nextTrack: state.nextTrack
  }));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);

  const currentTrack = queue[currentTrackIndex];

  const ensureAudioGraph = useCallback(async () => {
    if (typeof window === "undefined") return;
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const context = audioContextRef.current;
    if (context.state === "suspended") {
      await context.resume();
    }

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = context.createMediaElementSource(audio);
    }
    if (!gainNodeRef.current) {
      gainNodeRef.current = context.createGain();
    }
    if (!analyserNodeRef.current) {
      analyserNodeRef.current = context.createAnalyser();
      analyserNodeRef.current.smoothingTimeConstant = 0.85;
    }

    sourceNodeRef.current.disconnect();
    sourceNodeRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(analyserNodeRef.current);
    analyserNodeRef.current.connect(context.destination);

    gainNodeRef.current.gain.setTargetAtTime(volume, context.currentTime, 0.02);

    const fftSize = visualizerMode === "waveform" ? 2048 : visualizerMode === "sphere" ? 512 : 1024;
    analyserNodeRef.current.fftSize = fftSize;
  }, [visualizerMode, volume]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      setIsLoading(true);
      await ensureAudioGraph();
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Unable to start playback", error);
    } finally {
      setIsLoading(false);
    }
  }, [ensureAudioGraph, setIsLoading, setIsPlaying]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, [setIsPlaying]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      void play();
    }
  }, [isPlaying, pause, play]);

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = time;
      setCurrentTime(time);
    },
    [setCurrentTime]
  );

  const updatePlaybackRate = useCallback(
    (value: number) => {
      const audio = audioRef.current;
      if (audio) {
        audio.playbackRate = value;
      }
      setPlaybackRate(value);
    },
    [setPlaybackRate]
  );

  const updateVolume = useCallback(
    (value: number) => {
      const clamped = Math.max(0, Math.min(1, value));
      const audio = audioRef.current;
      if (audio) {
        audio.volume = clamped;
      }
      const context = audioContextRef.current;
      if (gainNodeRef.current && context) {
        gainNodeRef.current.gain.setTargetAtTime(clamped, context.currentTime, 0.015);
      }
      setVolume(clamped);
    },
    [setVolume]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    const context = audioContextRef.current;
    if (gainNodeRef.current && context) {
      gainNodeRef.current.gain.setTargetAtTime(volume, context.currentTime, 0.015);
    }
  }, [volume]);

  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = currentTrack.src;
    audio.load();
    if (isPlaying) {
      void play();
    }
  }, [currentTrackIndex, currentTrack?.src, isPlaying, play]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (!Number.isFinite(audio.duration)) return;
      setDuration(audio.duration);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleEnded = () => {
      nextTrack();
      void play();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [nextTrack, play, setCurrentTime, setDuration]);

  useEffect(() => {
    const analyser = analyserNodeRef.current;
    if (!analyser || !audioContextRef.current) return;
    const fftSize = visualizerMode === "waveform" ? 2048 : visualizerMode === "sphere" ? 512 : 1024;
    analyser.fftSize = fftSize;
  }, [visualizerMode]);

  return {
    audioRef,
    analyserNodeRef,
    isPlaying,
    currentTrack,
    play,
    pause,
    togglePlayback,
    seek,
    updateVolume,
    updatePlaybackRate
  };
}
