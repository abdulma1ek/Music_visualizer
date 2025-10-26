import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'var(--font-inter)', 'sans-serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e6eeff',
          200: '#c2d3ff',
          300: '#99b5ff',
          400: '#6c90ff',
          500: '#3f68ff',
          600: '#2247db',
          700: '#1636ac',
          800: '#122e86',
          900: '#10286a'
        },
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
  plugins: []
};

export default config;
