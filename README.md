# Music Visualizer deployment scaffold

This repository is pre-configured for Vercel preview deployments, demo audio asset management, and CI/CD checks that gate
production promotions.

## Deployment

- `vercel.json` sets `npm run build` as the build command and publishes the `dist` directory.
- Preview deployments are enabled for every branch while the `main` branch represents production.
- Import the project into Vercel via “Import Third-Party Git Repository” and point at this repository URL.

Additional deployment notes live in [`docs/deployment/vercel.md`](docs/deployment/vercel.md).

## Demo audio configuration

- Provide a `DEMO_AUDIO_BASE_URL` environment variable (see `.env.example`) to point at a remote bucket containing curated demo
  audio.
- Lightweight demo files can be stored directly in `public/demo-audio/`; they are copied into `dist` during the build step.
- The build script emits `dist/demo-audio-manifest.json` capturing the base URL used for the deployment.

## CI/CD checks

GitHub Actions workflow [`ci.yml`](.github/workflows/ci.yml) runs on pushes and pull requests:

1. Installs Node.js dependencies.
2. Executes configuration lint checks via `npm run lint`.
3. Builds the static output via `npm run build`.
4. Uploads the `dist` directory as an artifact so it can be inspected if the build fails.

Protect the `main` branch in GitHub so that Vercel promotions wait for these checks before deploying to production.
