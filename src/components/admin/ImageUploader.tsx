'use client';

import { useRef, useState } from 'react';

type ImageUploaderProps = {
  name: string;
  initialUrl: string | null;
  label: string;
};

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

export default function ImageUploader({ name, initialUrl, label }: ImageUploaderProps) {
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);

    if (file.size > MAX_SIZE_BYTES) {
      setError('Image must be 4 MB or smaller');
      event.target.value = '';
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Upload failed');
      } else {
        setUrl(data.url);
      }
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  function handleRemove() {
    setUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-stone-700">{label}</label>

      <div className="flex items-start gap-4">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-24 w-24 rounded-md border border-stone-300 object-cover" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-md border border-dashed border-stone-300 bg-stone-50 text-xs text-stone-400">
            No image
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={handleFileChange}
            className="text-sm text-stone-600"
          />

          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading || !url}
            className="w-fit rounded-md border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>

          {uploading ? <p className="text-xs text-stone-500">Uploading...</p> : null}
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </div>
      </div>

      <input type="hidden" name={name} value={url ?? ''} />
      <input type="hidden" name={`${name}_uploading`} value={uploading ? 'true' : 'false'} />
    </div>
  );
}
