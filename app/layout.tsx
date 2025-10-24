import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./providers";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Music Visualizer",
  description: "Interactive audio visualizer demo built with Next.js"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-950 text-slate-50">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
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
