'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { usePlayerStore } from '../store/playerStore';

export interface AudioController {
  audioElement: HTMLAudioElement | null;
  analyser: AnalyserNode | null;
  context: AudioContext | null;
  waveformData: Uint8Array | null;
  frequencyData: Uint8Array | null;
  ready: boolean;
  resume: () => Promise<void>;
  seek: (seconds: number) => void;
  getWaveformSnapshot: () => Uint8Array | null;
  getFrequencySnapshot: () => Uint8Array | null;
}

export function useAudioController(): AudioController {
  const playlist = usePlayerStore((state) => state.playlist);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const volume = usePlayerStore((state) => state.volume);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const setDuration = usePlayerStore((state) => state.setDuration);
  const setProgress = usePlayerStore((state) => state.setProgress);
  const playNext = usePlayerStore((state) => state.playNext);
  const setReady = usePlayerStore((state) => state.setReady);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const freqArrayRef = useRef<Uint8Array | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>();
  const [ready, setInternalReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audioRef.current = audio;

    const context = new AudioContext();
    contextRef.current = context;
    const source = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    const timeDomainArray = new Uint8Array(analyser.fftSize);
    const frequencyArray = new Uint8Array(analyser.frequencyBinCount);
    dataArrayRef.current = timeDomainArray;
    freqArrayRef.current = frequencyArray;

    source.connect(analyser);
    analyser.connect(context.destination);

    const handleEnded = () => {
      playNext();
    };

    const handleLoaded = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    setInternalReady(true);
    setReady(true);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.pause();
      analyser.disconnect();
      source.disconnect();
      context.close();
    };
  }, [playNext, setDuration, setProgress, setReady]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    const context = contextRef.current;
    if (!audio || !context) return;
    const track = playlist[currentIndex];
    if (!track) return;
    audio.src = track.src;
    audio.load();
    audio.currentTime = 0;
    setProgress(0);
    setDuration(audio.duration || 0);
    if (isPlaying) {
      context.resume().catch(() => undefined);
      audio
        .play()
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [playlist, currentIndex, isPlaying, setIsPlaying, setDuration, setProgress]);

  useEffect(() => {
    const audio = audioRef.current;
    const context = contextRef.current;
    if (!audio || !context) return;

    if (isPlaying) {
      context.resume().catch(() => undefined);
      audio
        .play()
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      audio.pause();
    }
  }, [isPlaying, setIsPlaying]);

  useEffect(() => {
    const updateLoop = () => {
      const analyser = analyserRef.current;
      if (analyser && dataArrayRef.current && freqArrayRef.current) {
        analyser.getByteTimeDomainData(dataArrayRef.current);
        analyser.getByteFrequencyData(freqArrayRef.current);
      }
      rafRef.current = requestAnimationFrame(updateLoop);
    };

    rafRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const resume = useCallback(async () => {
    const context = contextRef.current;
    if (context && context.state === 'suspended') {
      await context.resume();
    }
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (audio && !Number.isNaN(seconds)) {
      audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || 0));
      setProgress(audio.currentTime);
    }
  }, [setProgress]);

  const getWaveformSnapshot = useCallback(() => {
    if (!dataArrayRef.current) return null;
    return new Uint8Array(dataArrayRef.current);
  }, []);

  const getFrequencySnapshot = useCallback(() => {
    if (!freqArrayRef.current) return null;
    return new Uint8Array(freqArrayRef.current);
  }, []);

  return useMemo(
    () => ({
      audioElement: audioRef.current,
      analyser: analyserRef.current,
      context: contextRef.current,
      waveformData: dataArrayRef.current,
      frequencyData: freqArrayRef.current,
      ready,
      resume,
      seek,
      getWaveformSnapshot,
      getFrequencySnapshot
    }),
    [ready, resume, seek, getWaveformSnapshot, getFrequencySnapshot]
  );
}
