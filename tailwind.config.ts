import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-space-grotesk)'],
        sans: ['var(--font-inter)']
      },
      colors: {
        midnight: '#04011b',
        aurora: '#4cc9f0',
        magenta: '#f72585',
        nebula: '#7209b7',
        sunburst: '#f4a261'
      },
      boxShadow: {
        glow: '0 0 35px rgba(114, 9, 183, 0.45)'
      }
    }
  },
  plugins: [forms]
};

export default config;
