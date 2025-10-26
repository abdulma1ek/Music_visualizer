import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

import { AppProviders } from './providers';
import { TopNav } from '@/components/ui/TopNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'Harmonic Observatory Visualizer',
  description: 'Mathematical 3D music visualizer demo running on Next.js and Vercel-ready.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen font-sans text-white antialiased">
        <AppProviders>
          <div className="relative flex min-h-screen flex-col">
            <TopNav />
            <main className="flex-1">
              <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12 lg:px-10">{children}</div>
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
