#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const vercelConfigPath = path.join(root, 'vercel.json');
const envExamplePath = path.join(root, '.env.example');
const issues = [];

function requireFile(filePath) {
  if (!fs.existsSync(filePath)) {
    issues.push(`Missing required file: ${path.relative(root, filePath)}`);
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

const vercelConfigRaw = requireFile(vercelConfigPath);
let vercelConfig;
if (vercelConfigRaw) {
  try {
    vercelConfig = JSON.parse(vercelConfigRaw);
  } catch (error) {
    issues.push(`vercel.json is not valid JSON: ${error.message}`);
  }
}

if (vercelConfig) {
  if (vercelConfig.version !== 2) {
    issues.push('vercel.json must specify "version": 2 for the current deployment platform.');
  }
  if (vercelConfig.buildCommand && vercelConfig.buildCommand !== 'npm run build') {
    issues.push('vercel.json buildCommand should use "npm run build" so deployments mirror local builds.');
  }
  if (typeof vercelConfig.outputDirectory !== 'undefined' && vercelConfig.outputDirectory !== '.next') {
    issues.push('vercel.json outputDirectory should be omitted or set to ".next" for standard Next.js deployments.');
  }
  if (!vercelConfig.git || !vercelConfig.git.deploymentEnabled || vercelConfig.git.deploymentEnabled.preview !== true) {
    issues.push('vercel.json must enable preview deployments for non-production branches.');
  }
  if (!vercelConfig.env || !('DEMO_AUDIO_BASE_URL' in vercelConfig.env)) {
    issues.push('vercel.json should expose the DEMO_AUDIO_BASE_URL environment variable.');
  }
}

const envExample = requireFile(envExamplePath);
if (envExample && !/DEMO_AUDIO_BASE_URL=/.test(envExample)) {
  issues.push('The .env.example file must document the DEMO_AUDIO_BASE_URL variable.');
}

if (issues.length > 0) {
  console.error('Configuration lint failed:\n - ' + issues.join('\n - '));
  process.exitCode = 1;
} else {
  console.log('Configuration lint checks passed.');
}
