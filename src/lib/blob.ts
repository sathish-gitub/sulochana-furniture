import { del } from '@vercel/blob';

export function isBlobUrl(url: string | null | undefined): boolean {
  if (!url) {
    return false;
  }

  try {
    const { hostname } = new URL(url);
    return hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

export async function deleteBlobIfOwned(url: string | null | undefined): Promise<void> {
  if (!url || url.startsWith('/images/') || !isBlobUrl(url)) {
    return;
  }

  try {
    await del(url);
  } catch {
    // Ignore delete errors; the blob may already be gone.
  }
}
