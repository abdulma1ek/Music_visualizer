# Harmonic Observatory Music Visualizer

A universal Next.js experience ready for Vercel that fuses curated audio playback with real-time mathematical 3D visuals. The application ships with a demo playlist, synchronized transport controls, and a Three.js-driven observatory scene that blends waveform membranes, Fourier lattices, and Lissajous tracer paths.

## Features

- **Curated demo playlist** – three royalty-free tracks with descriptive artwork preloaded for instant exploration.
- **Global playback controls** – play/pause, seek, previous/next, and volume sliders wired to the Web Audio API.
- **Mathematical visual modes** – switch between harmonic membrane, Fourier helix, and Lissajous orbit palettes without interrupting playback.
- **Harmonic observatory scene** – immersive 3D canvas with waveform surface deformation, helical spectrum bars, particle fog, and tracer ribbons animated from live analyser data.
- **Responsive layout** – glassmorphism-inspired UI that scales gracefully from tablets to widescreen displays.

## Tech Stack

- **Framework**: Next.js App Router (React 18, TypeScript) targeting Vercel deployment.
- **State & Audio**: Zustand store + custom Web Audio controller with analyser snapshots.
- **Rendering**: Three.js + custom animation loop for the visualizer scene.
- **Styling**: Tailwind CSS with utility-driven theming and frosted glass accents.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to access the visualizer. Interact with the transport controls to grant audio permissions so the scene can react in real time.

## Trying It Out

- **Browser compatibility** – Use a Chromium- or WebKit-based browser that supports the Web Audio API, Pointer Lock, and WebGL 2 for smooth 3D rendering.
- **User interaction** – Start playback with the transport controls to unlock the audio context; the harmonic observatory will animate as soon as analyser data flows.
- **Visualization modes** – Toggle the mode switcher to explore the harmonic membrane, Fourier lattice, and Lissajous orbit presets without stopping the music.
- **Playlist navigation** – Cycle through the curated tracks with previous/next controls to see how different timbres affect the visuals.

## Deployment

- The project is optimized for Vercel. Commit changes to the main branch (or open a PR) and enable automatic deployments to preview environments.
- Remote audio assets are hosted via CDN-friendly URLs, so no additional asset pipeline is required for the demo setup.

## Next Steps

- Expand the visualizer with additional shader-driven effects (bloom, god rays) using `three-stdlib` post-processing utilities.
- Layer in user-uploaded audio by extending the playlist store with drag-and-drop ingestion and safe URL revocation.
- Wire CI (GitHub Actions) to run `npm run lint` and `npm run build` before promoting previews to production.
