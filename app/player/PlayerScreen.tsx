"use client";

import { Fragment, useMemo } from "react";

import { usePlayerStore } from "@/app/providers";
import { VisualizerCanvas } from "@/components/player/VisualizerCanvas";
import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon, VolumeIcon } from "@/components/ui/Icons";
import { classNames } from "@/lib/classNames";
import { formatDuration } from "@/lib/formatDuration";

import { useAudioEngine } from "./useAudioEngine";

const visualizationModes = [
  { id: "bars", label: "Bars" },
  { id: "waveform", label: "Waveform" },
  { id: "sphere", label: "Aurora" }
] as const;

export function PlayerScreen() {
  const {
    isPlaying,
    currentTrack,
    togglePlayback,
    seek,
    updateVolume,
    updatePlaybackRate,
    analyserNodeRef,
    audioRef
  } = useAudioEngine();

  const {
    currentTime,
    duration,
    playbackRate,
    volume,
    queue,
    currentTrackIndex,
    setVisualizerMode,
    setVisualizerIntensity,
    setCurrentTrackIndex,
    setIsPlaying,
    visualizerMode,
    visualizerIntensity,
    nextTrack,
    previousTrack
  } = usePlayerStore((state) => ({
    currentTime: state.currentTime,
    duration: state.duration,
    playbackRate: state.playbackRate,
    volume: state.volume,
    queue: state.queue,
    currentTrackIndex: state.currentTrackIndex,
    setVisualizerMode: state.setVisualizerMode,
    setVisualizerIntensity: state.setVisualizerIntensity,
    setCurrentTrackIndex: state.setCurrentTrackIndex,
    setIsPlaying: state.setIsPlaying,
    visualizerMode: state.visualizerMode,
    visualizerIntensity: state.visualizerIntensity,
    nextTrack: state.nextTrack,
    previousTrack: state.previousTrack
  }));

  const progress = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, (currentTime / duration) * 100);
  }, [currentTime, duration]);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Now playing</p>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">
              {currentTrack?.title ?? "Select a track"}
            </h1>
            <p className="text-sm text-slate-300">{currentTrack?.artist ?? "Curated playlist"}</p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={duration ? currentTime : 0}
              onChange={(event) => seek(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-brand-500"
            />
            <div className="mt-2 h-1 w-full rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => previousTrack()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10"
              aria-label="Previous track"
            >
              <SkipBackIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={togglePlayback}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-slate-950 shadow-lg shadow-brand-600/50 transition hover:from-brand-300 hover:to-brand-500"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="ml-1 h-6 w-6" />}
            </button>
            <button
              type="button"
              onClick={() => nextTrack()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10"
              aria-label="Next track"
            >
              <SkipForwardIcon className="h-5 w-5" />
            </button>
            <div className="ml-auto flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <VolumeIcon className="h-4 w-4" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => updateVolume(Number(event.target.value))}
                className="h-1 w-28 cursor-pointer appearance-none rounded-full bg-white/20 accent-brand-500"
                aria-label="Volume"
              />
              <span className="w-10 text-right text-xs text-slate-400">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          <div className="grid gap-5 rounded-2xl border border-white/5 bg-slate-950/40 p-5 text-sm text-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Playback rate</span>
              <div className="flex items-center gap-2">
                {[0.75, 1, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => updatePlaybackRate(rate)}
                    className={classNames(
                      "rounded-full px-3 py-1 text-xs transition",
                      playbackRate === rate
                        ? "bg-white text-slate-900"
                        : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Visualizer mode</span>
              <div className="flex items-center gap-2">
                {visualizationModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setVisualizerMode(mode.id)}
                    className={classNames(
                      "rounded-full px-3 py-1 text-xs transition",
                      visualizerMode === mode.id
                        ? "bg-gradient-to-br from-brand-400 to-brand-600 text-slate-950"
                        : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Intensity</span>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={visualizerIntensity}
                  onChange={(event) => setVisualizerIntensity(Number(event.target.value))}
                  className="h-1 w-40 cursor-pointer appearance-none rounded-full bg-white/20 accent-brand-500"
                  aria-label="Visualizer intensity"
                />
                <span className="text-xs text-slate-400">{Math.round(visualizerIntensity * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex h-[320px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-950 to-black shadow-xl shadow-brand-900/30 backdrop-blur-sm md:h-[360px] lg:h-[420px]">
          <div className="absolute inset-x-0 top-0 z-10 flex justify-between p-6 text-xs text-slate-400">
            <span>Visualizer</span>
            <span>{visualizationModes.find((mode) => mode.id === visualizerMode)?.label}</span>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.2),_transparent_60%)]" />
          <VisualizerCanvas analyserNodeRef={analyserNodeRef} />
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Queue</h2>
        <div className="mt-4 grid gap-3 text-sm">
          {queue.map((track, index) => (
            <Fragment key={track.id}>
              <div
                className={classNames(
                  "flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 md:flex-row md:items-center md:gap-6",
                  index === currentTrackIndex ? "ring-2 ring-brand-400/80" : "hover:bg-white/10"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs text-slate-300 md:flex">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-medium text-white">{track.title}</p>
                    <p className="text-xs text-slate-400">{track.artist}</p>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-between gap-4">
                  <div className="hidden flex-1 items-center gap-2 text-xs text-slate-400 md:flex">
                    <span>Visualization palette</span>
                    <span className="flex h-2 w-28 overflow-hidden rounded-full bg-slate-800">
                      <span className={classNames("h-full w-1/3", track.coverColor.replace("from-", "bg-").split(" ")[0] ?? "bg-brand-400")} />
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTrackIndex(index);
                      setIsPlaying(true);
                    }}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/20"
                  >
                    Play
                  </button>
                  <span className="text-xs text-slate-400">{formatDuration(track.duration)}</span>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />
    </div>
  );
}
