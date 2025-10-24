#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');

if (!fs.existsSync(publicDir)) {
  console.error('Public directory not found. Nothing to build.');
  process.exit(1);
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

copyRecursive(publicDir, distDir);

const audioBaseUrl = process.env.DEMO_AUDIO_BASE_URL || 'https://example-bucket.vercel-storage.com/audio';
const manifest = {
  generatedAt: new Date().toISOString(),
  demoAudioBaseUrl: audioBaseUrl,
  note: 'Update DEMO_AUDIO_BASE_URL before production deployments to point at the curated demo asset bucket.'
};
fs.writeFileSync(path.join(distDir, 'demo-audio-manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`Static assets copied to ${path.relative(root, distDir)}.`);
console.log(`Demo audio base URL set to ${audioBaseUrl}`);
