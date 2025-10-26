'use client';

import { useCallback, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { PutBlobResult } from '@vercel/blob';

import { usePlayerStore } from '@/lib/store/playerStore';

type UploadStatus =
  | { state: 'idle' }
  | { state: 'uploading' }
  | { state: 'success'; audioUrl: string; coverUrl?: string }
  | { state: 'error'; message: string };

async function uploadBlob(file: File): Promise<PutBlobResult> {
  const response = await fetch(`/api/tracks/upload?filename=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    body: file
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error ?? `Upload failed with status ${response.status}`);
  }

  return (await response.json()) as PutBlobResult;
}

export default function UploadTrackPage() {
  const addTrack = usePlayerStore((state) => state.addTrack);
  const setCurrentIndex = usePlayerStore((state) => state.setCurrentIndex);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const playlistLength = usePlayerStore((state) => state.playlist.length);

  const [status, setStatus] = useState<UploadStatus>({ state: 'idle' });
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [accent, setAccent] = useState('#4cc9f0');
  const [description, setDescription] = useState('');

  const isUploading = status.state === 'uploading';

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const audioFile = formData.get('audio') as File | null;
      const coverFile = formData.get('cover') as File | null;

      if (!audioFile || audioFile.size === 0) {
        setStatus({ state: 'error', message: 'Please choose an audio file.' });
        return;
      }

      try {
        setStatus({ state: 'uploading' });
        const [audioBlob, coverBlob] = await Promise.all([
          uploadBlob(audioFile),
          coverFile && coverFile.size > 0 ? uploadBlob(coverFile) : Promise.resolve(undefined)
        ]);

        const trackId = crypto.randomUUID();
        const trackTitle = title.trim() || audioFile.name;
        const trackArtist = artist.trim() || 'Unknown Artist';

        addTrack({
          id: trackId,
          title: trackTitle,
          artist: trackArtist,
          src: audioBlob.url,
          coverImage: coverBlob?.url,
          accent: accent.trim() || undefined,
          description: description.trim() || undefined
        });

        // focus the newly added track
        setCurrentIndex(playlistLength);
        setIsPlaying(true);

        setStatus({ state: 'success', audioUrl: audioBlob.url, coverUrl: coverBlob?.url });
        event.currentTarget.reset();
      } catch (error) {
        setStatus({
          state: 'error',
          message: error instanceof Error ? error.message : 'Upload failed.'
        });
      }
    },
    [accent, addTrack, artist, description, playlistLength, setCurrentIndex, setIsPlaying, title]
  );

  const feedback = useMemo(() => {
    switch (status.state) {
      case 'success':
        return (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Uploaded successfully. Track URL:{' '}
            <a href={status.audioUrl} className="underline" target="_blank" rel="noreferrer">
              {status.audioUrl}
            </a>
            {status.coverUrl ? (
              <>
                {' '}
                · Cover URL:{' '}
                <a href={status.coverUrl} className="underline" target="_blank" rel="noreferrer">
                  {status.coverUrl}
                </a>
              </>
            ) : null}
          </div>
        );
      case 'error':
        return (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {status.message}
          </div>
        );
      default:
        return null;
    }
  }, [status]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold text-white">Upload a custom track</h1>
        <p className="text-sm text-white/70">
          Use Vercel Blob storage to host a single audio track (and optional artwork). The uploaded
          media will be appended to the in-memory playlist for this session.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="glass-panel grid gap-6 rounded-3xl border border-white/10 p-6"
      >
        <div className="grid gap-2">
          <label htmlFor="audio" className="text-sm font-semibold text-white">
            Audio file (MP3, WAV, AAC…)
          </label>
          <input
            id="audio"
            name="audio"
            type="file"
            accept="audio/*"
            required
            disabled={isUploading}
            className="block w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:border-white/20"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="cover" className="text-sm font-semibold text-white">
            Artwork (optional)
          </label>
          <input
            id="cover"
            name="cover"
            type="file"
            accept="image/*"
            disabled={isUploading}
            className="block w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:border-white/20"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-semibold text-white">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Night Drive"
            disabled={isUploading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-400 focus:outline-none"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="artist" className="text-sm font-semibold text-white">
            Artist
          </label>
          <input
            id="artist"
            name="artist"
            type="text"
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
            placeholder="Abdul Malik"
            disabled={isUploading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-400 focus:outline-none"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="accent" className="text-sm font-semibold text-white">
            Accent colour (hex)
          </label>
          <input
            id="accent"
            name="accent"
            type="text"
            value={accent}
            onChange={(event) => setAccent(event.target.value)}
            placeholder="#4cc9f0"
            disabled={isUploading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-400 focus:outline-none"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-semibold text-white">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            disabled={isUploading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-400 focus:outline-none"
            placeholder="A neon-lit journey through synthwave soundscapes."
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-600/40 transition hover:from-brand-300 hover:to-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? 'Uploading…' : 'Upload & Play'}
        </button>

        {feedback}
      </form>
    </main>
  );
}
