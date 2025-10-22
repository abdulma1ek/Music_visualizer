# Vercel deployment

The repository ships with a declarative `vercel.json` so that a Vercel project can be configured without manual clicks. Once the
project is imported in the Vercel dashboard, Vercel will:

1. Build preview deployments for every branch and pull request.
2. Promote the default branch (`main`) to production once checks pass.

## Initial setup

1. Create a new Vercel project and choose "Import Third-Party Git Repository".
2. Point the import URL at `https://github.com/<your-org>/<your-repo>`.
3. Ensure the project uses the `vercel.json` in the repository. No framework preset is required because the build command is explicitly defined.
4. Define the `DEMO_AUDIO_BASE_URL` environment variable in Vercel for the `Preview` and `Production` environments. Values can point to Vercel Blob Storage, AWS S3, or any HTTPS-accessible CDN bucket.
5. Optional: Use Vercel Blob or Edge Config to manage larger curated audio libraries and reference them via the environment variable.

## Git integration

- Preview deployments are enabled for all non-production branches via the `git.deploymentEnabled.preview` flag in `vercel.json`.
- `git.autoJobCancelation` is enabled so that redundant builds from superseded commits are cancelled automatically.

## Promotion workflow

1. GitHub Actions runs `npm run lint` and `npm run build` for every push/PR.
2. Vercel previews wait for the GitHub status checks (via branch protection rules) before allowing promotion to production.
3. Once the `main` branch build is successful and checks pass, Vercel promotes the latest preview to production.

Refer to `.github/workflows/ci.yml` for the exact checks executed before promotion.
