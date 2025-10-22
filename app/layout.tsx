import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AppProviders } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'Harmonic Observatory Visualizer',
  description: 'Mathematical 3D music visualizer demo running on Next.js and Vercel-ready.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}> 
        <AppProviders>
          <div className="min-h-screen">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
