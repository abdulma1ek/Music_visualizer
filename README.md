# Music Visualizer Product Plan

## Product Vision
- Deliver a browser-based **Universal** (client + server-rendered) experience that feels native within the web and is effortless to deploy on Vercel.
- Provide a curated demo showcase where visitors can choose from a pre-uploaded set of tracks hosted alongside the app.
- Combine high-energy audio playback with immersive, multi-color 3D visualizations rooted in mathematical motion (wavefields, graphs, particle calculus) that feel performant on modern desktop and tablet hardware.

## Updated Product Requirements
- Host the production and preview environments on **Vercel**, wiring CI/CD to auto-build from the main branch.
- Ship the core audio analysis logic as reusable modules that can be plugged into the Vercel-powered UX layer.
- Allow visitors to select from a curated playlist (e.g., 5 demo songs) and stream them directly in the browser without local uploads.
- Provide real-time playback controls (play, pause, seek, volume) synchronized with the visual experience.
- Maintain responsive layouts that adapt fluidly from widescreen monitors down to tablets, preserving 3D immersion.
- Prepare for future expansion toward user-uploaded tracks while ensuring licensing-friendly demo defaults.
- Ship multiple mathematical visual modes (e.g., Lissajous knots, Fourier bar lattices, waveform membranes) that can be switched live and share color palettes, camera logic, and audio analysis data.

## Target Platforms & Technology Stack
- **Platform & Hosting:** Next.js (app router) deployed on Vercel for universal rendering, edge caching, and preview links.
- **Core Libraries & APIs:**
  - React for component-driven UI and state orchestration.
  - Web Audio API for frequency/time-domain analysis and audio control.
  - Three.js + WebGL shaders for 3D rendering, particle effects, and color-rich animations.
  - Zustand or Context API for synchronized playback + visualization state management.
  - Tailwind CSS (or similar utility-first system) for rapid layout and theming iterations.

## First Visualization Concept
Launch with a **3D harmonic graph observatory** composed of multiple interlocking mathematical plots:
- Generate a pulsating waveform membrane (audio waveform mapped onto a polar grid surface) that undulates in Z-depth using instantaneous amplitude envelopes.
- Surround the membrane with a lattice of Fourier spectrum bars arranged in a helical spiral; bars scale along the radial axis and morph into smooth spline ribbons for sustained notes.
- Thread luminous Lissajous knots and particle tracer orbits through the scene, using beat detection to trigger splashes of complementary colors and curvature tweaks.
- Apply shader-based gradient fields, additive bloom, and refractive fog to layer "super cool" multi-color effects while keeping the scene legible.
- Offer camera presets (auto-orbit, free-fly, orthographic graph view) that highlight different mathematical structures, with adaptive level-of-detail safeguards for performance.
