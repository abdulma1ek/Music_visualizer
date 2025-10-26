import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const DEFAULT_ACCESS = 'public' as const;

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawName = searchParams.get('filename');

  if (!rawName) {
    return NextResponse.json({ error: 'filename query parameter is required' }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'Upload stream is empty' }, { status: 400 });
  }

  const sanitizedName = rawName.trim().replace(/^\/+/, '');
  if (!sanitizedName) {
    return NextResponse.json({ error: 'filename cannot be empty' }, { status: 400 });
  }

  try {
    const blob = await put(sanitizedName, request.body, {
      access: DEFAULT_ACCESS,
      contentType: request.headers.get('content-type') ?? undefined,
      addRandomSuffix: true
    });

    return NextResponse.json(blob, { status: 201 });
  } catch (error) {
    console.error('[tracks/upload] Failed to put blob', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
