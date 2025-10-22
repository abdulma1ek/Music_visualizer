# Music Visualizer Product Plan

## Product Vision
- Deliver a browser-based **Universal** (client + server-rendered) experience that feels native within the web and is effortless to deploy on Vercel.
- Provide a curated demo showcase where visitors can choose from a pre-uploaded set of tracks hosted alongside the app.
- Combine high-energy audio playback with immersive, multi-color 3D visualizations that feel performant on modern desktop and tablet hardware.

## Updated Product Requirements
- Host the production and preview environments on **Vercel**, wiring CI/CD to auto-build from the main branch.
- Ship the core audio analysis logic as reusable modules that can be plugged into the Vercel-powered UX layer.
- Allow visitors to select from a curated playlist (e.g., 5 demo songs) and stream them directly in the browser without local uploads.
- Provide real-time playback controls (play, pause, seek, volume) synchronized with the visual experience.
- Maintain responsive layouts that adapt fluidly from widescreen monitors down to tablets, preserving 3D immersion.
- Prepare for future expansion toward user-uploaded tracks while ensuring licensing-friendly demo defaults.

## Target Platforms & Technology Stack
- **Platform & Hosting:** Next.js (app router) deployed on Vercel for universal rendering, edge caching, and preview links.
- **Core Libraries & APIs:**
  - React for component-driven UI and state orchestration.
  - Web Audio API for frequency/time-domain analysis and audio control.
  - Three.js + WebGL shaders for 3D rendering, particle effects, and color-rich animations.
  - Zustand or Context API for synchronized playback + visualization state management.
  - Tailwind CSS (or similar utility-first system) for rapid layout and theming iterations.

## First Visualization Concept
Kick off with a **3D radial spectrum nebula**:
- Create a circular arrangement of frequency bins extruded in 3D, pulsing outward based on amplitude.
- Drive dynamic color gradients across the spectrum using audio-reactive palettes (e.g., low frequencies shift toward deep purples, highs toward electric cyans).
- Overlay particle emitters that burst in sync with beat-detection heuristics derived from Web Audio temporal analysis.
- Render subtle depth-of-field and bloom via post-processing passes to emphasize the "super cool" aesthetic.
- Provide camera orbit controls (auto + user interaction) while safeguarding performance with adaptive quality settings.
