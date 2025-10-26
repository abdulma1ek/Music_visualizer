# Music Visualizer

A Next.js (App Router) demo that pairs a curated audio playlist with a real-time Three.js scene. Zustand keeps playback state, visualizer mode, and UI controls in sync while Web Audio analyser nodes stream data into the shaders.

## Getting started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the visualizer.

## Available scripts

- `npm run dev` – launch the development server.
- `npm run build` – produce an optimized production build.
- `npm run start` – serve the production bundle.
- `npm run lint` – run ESLint with the Next.js ruleset.
- `npm run check` – type-check the project with `tsc`.

## Tech stack

- **Next.js App Router** with TypeScript.
- **Tailwind CSS** for theming plus custom “glass” utility classes.
- **Zustand** store in `lib/store/playerStore.ts` for transport, playlist, and visualization state.
- **Web Audio API** handled by `lib/audio/useAudioController.ts`, exposed through the `AppProviders` context.
- **Three.js** rendering via `components/visualizer/HarmonicObservatory.tsx`.

## Project structure

```
app/
  layout.tsx         # Fonts, global providers, shell
  page.tsx           # Landing page with condensed player + visualizer
  player/            # Immersive player route
  providers.tsx      # AppProviders + audio engine context
components/
  player/            # Playback controls, playlist, cards
  ui/                # Icons and primitives
  visualizer/        # Three.js scene integration
lib/
  audio/             # Web Audio controller hook
  store/             # Zustand store for playback + visualization state
  visualization/     # Shared constants
```

Demo audio assets stream from royalty-free sources by default. For production deployments you can set `DEMO_AUDIO_BASE_URL` to point at your own storage bucket.

## Custom playlist

1. Host your audio files (and optional artwork) under the URL you will assign to `DEMO_AUDIO_BASE_URL`.  
2. Create a `playlist.json` file alongside the assets. Example:

   ```json
   {
     "tracks": [
       {
         "id": "custom-track",
         "title": "Custom Track Title",
         "artist": "Artist Name",
         "src": "custom-track.mp3",
         "coverImage": "artwork/custom-track.jpg",
         "accent": "#4cc9f0",
         "description": "Optional blurb about the song"
       }
     ]
   }
   ```

   Relative paths in `src` or `coverImage` are resolved against `DEMO_AUDIO_BASE_URL`. Absolute HTTPS URLs work as well.
3. Set `DEMO_AUDIO_BASE_URL` in `.env` (and on your hosting platform) to the base folder that contains `playlist.json`.
4. Restart the dev server or redeploy. The player falls back to the bundled demo tracks if the manifest can’t be fetched.

### Single-track override

If you only need one song and don’t want to host a playlist manifest, populate the optional
`DEMO_AUDIO_TRACK_*` variables in `.env`:

```
DEMO_AUDIO_TRACK_SRC=https://example-storage.com/audio/night-drive.mp3
DEMO_AUDIO_TRACK_TITLE=Night Drive
DEMO_AUDIO_TRACK_ARTIST=Abdul Malik
DEMO_AUDIO_TRACK_COVER=https://example-storage.com/audio/art/night-drive.jpg
DEMO_AUDIO_TRACK_ACCENT=#ff6b6b
DEMO_AUDIO_TRACK_DESCRIPTION=Synthwave vibes for the road.
DEMO_AUDIO_TRACK_DURATION=228
```

Relative paths are supported when `DEMO_AUDIO_BASE_URL` points to a folder; otherwise use absolute URLs.
If both `playlist.json` and the single-track variables are unavailable, the app defaults to the bundled demo playlist.

## Uploading tracks at runtime

- Set `BLOB_READ_WRITE_TOKEN` in your environment (create one with `vercel blob generate-token`).
- Visit `/upload` while the dev server is running. The form uploads audio (and optional artwork) to Vercel Blob via `/api/tracks/upload`.
- Successful uploads append a new entry to the in-memory playlist and start playback immediately; the data only persists for the current session unless you copy the generated blob URLs into a playlist manifest.

## Visualizer engine

The reusable Three.js scene lives under `app/visualizer/`:

- **Audio hooks** – analyser helpers in `app/visualizer/audio/hooks.ts`.
- **Waveform membrane** – polar surface displacement (`app/visualizer/geometry/waveformMembrane.ts`).
- **Fourier lattice & ribbons** – instanced geometry animated from FFT data (`app/visualizer/geometry/fourierStructures.ts`).
- **Lissajous particles** – gradient tracer system (`app/visualizer/geometry/lissajousParticles.ts`).
- **Camera presets & LOD** – orbit and free-fly rigs with safeguards (`app/visualizer/controls/cameraPresets.ts`, `app/visualizer/utils/lod.ts`).
- **Post-processing** – bloom + fog pipeline (`app/visualizer/effects/postProcessing.ts`).

The scene can be embedded elsewhere by importing `createVisualizerScene` from `app/visualizer/index.ts`.
