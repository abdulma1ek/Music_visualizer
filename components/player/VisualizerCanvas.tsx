"use client";

import { useEffect, useRef } from "react";

import { usePlayerStore } from "@/app/providers";

export function VisualizerCanvas({
  analyserNodeRef
}: {
  analyserNodeRef: React.MutableRefObject<AnalyserNode | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualizerMode = usePlayerStore((state) => state.visualizerMode);
  const intensity = usePlayerStore((state) => state.visualizerIntensity);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame: number;
    const devicePixelRatio = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const render = () => {
      const analyser = analyserNodeRef.current;
      const width = canvas.width / devicePixelRatio;
      const height = canvas.height / devicePixelRatio;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(15, 23, 42, 0.92)";
      context.fillRect(0, 0, width, height);

      if (analyser) {
        if (visualizerMode === "waveform") {
          const bufferLength = analyser.fftSize;
          const dataArray = new Float32Array(bufferLength);
          analyser.getFloatTimeDomainData(dataArray);
          context.lineWidth = 2;
          context.strokeStyle = "rgba(99, 102, 241, 0.9)";
          context.beginPath();
          const sliceWidth = width / bufferLength;
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const v = (dataArray[i] + 1) / 2;
            const y = v * height;
            if (i === 0) {
              context.moveTo(x, y);
            } else {
              context.lineTo(x, y);
            }
            x += sliceWidth;
          }
          context.stroke();
        } else {
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);
          const barCount = Math.floor(bufferLength / 3);
          const barWidth = width / barCount;
          for (let i = 0; i < barCount; i++) {
            const value = dataArray[i] / 255;
            const scaled = value * height * (0.35 + intensity * 0.65);
            const x = i * barWidth;
            const gradient = context.createLinearGradient(x, height - scaled, x, height);
            gradient.addColorStop(0, "rgba(96, 165, 250, 0.9)");
            gradient.addColorStop(1, "rgba(168, 85, 247, 0.75)");
            context.fillStyle = gradient;
            context.fillRect(x, height - scaled, barWidth * 0.8, scaled);
          }
          if (visualizerMode === "sphere") {
            const radius = Math.max(height * 0.25, 120 * intensity + 40);
            const radial = context.createRadialGradient(width / 2, height / 2, radius * 0.2, width / 2, height / 2, radius);
            radial.addColorStop(0, "rgba(56, 189, 248, 0.45)");
            radial.addColorStop(1, "rgba(14, 165, 233, 0)");
            context.fillStyle = radial;
            context.beginPath();
            context.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
            context.fill();
          }
        }
      } else {
        context.font = "500 14px Inter, sans-serif";
        context.fillStyle = "rgba(148, 163, 184, 0.7)";
        context.fillText("Press play to initialize the visualizer", 24, height / 2);
      }

      animationFrame = requestAnimationFrame(render);
    };

    resizeCanvas();
    render();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [analyserNodeRef, intensity, visualizerMode]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
