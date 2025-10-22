# Music Visualizer

A Next.js (App Router) demo that showcases a responsive audio player with real-time Web Audio visualizations, curated sample tracks, and Tailwind-powered layout primitives. Zustand manages playback and visualization settings globally so the player remains synchronized across the application shell.

## Getting started

```bash
pnpm install    # or npm install / yarn install
pnpm dev        # start the development server
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

- `pnpm dev` – start the Next.js development server.
- `pnpm build` – create an optimized production build.
- `pnpm start` – run the production build.
- `pnpm lint` – execute ESLint using Next.js defaults.

## Tech stack

- **Next.js App Router** with TypeScript for routing and type safety.
- **Tailwind CSS** and custom layout primitives for adaptive tablet/desktop design.
- **Zustand** store provided through `app/providers.tsx` for playback + visualization state.
- **Web Audio API** integration in `app/player/useAudioEngine.ts` to drive playback, analyser nodes, and visual feedback.

## Project structure

```
app/
  layout.tsx         # global shell, providers, and navigation
  page.tsx           # overview/landing screen
  player/            # player route, audio engine hook, UI
components/
  layout/            # responsive shell + section helpers
  player/            # visualizer canvas
  ui/                # buttons, icons, primitives
lib/
  classNames.ts      # helper utilities
  formatDuration.ts
```

Static audio assets are streamed from royalty-free sample URLs so the player works without bundling media files.
