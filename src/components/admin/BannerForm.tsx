'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import ImageUploader from '@/components/admin/ImageUploader';
import type { BannerFormState } from '@/app/admin/(panel)/banners/actions';

type BannerFormProps = {
  mode: 'create' | 'edit';
  action: (prevState: BannerFormState, formData: FormData) => Promise<BannerFormState>;
  initialValues?: {
    id: string;
    image: string;
    title: string | null;
    ctaUrl: string | null;
    order: number;
    active: boolean;
  };
};

const initialState: BannerFormState = {};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-md bg-brandBg px-4 py-2 text-sm font-semibold text-white transition hover:bg-brandBg/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

export default function BannerForm({ mode, action, initialValues }: BannerFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  const [uploading, setUploading] = useState(false);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {state?.error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      ) : null}

      {mode === 'edit' && initialValues ? (
        <input type="hidden" name="id" value={initialValues.id} />
      ) : null}

      <div>
        <ImageUploader
          name="image"
          initialUrl={initialValues?.image ?? null}
          label="Image"
          onUploadingChange={setUploading}
        />
        <p className="mt-1 text-xs text-stone-500">
          Recommended 1350 x 450 px (3:1), JPG or WebP, under 4 MB
        </p>
      </div>

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-stone-700">
          Label
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={initialValues?.title ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
        <p className="mt-1 text-xs text-stone-500">Used as the image's alt text, optional</p>
      </div>

      <div>
        <label htmlFor="ctaUrl" className="mb-1 block text-sm font-medium text-stone-700">
          Link
        </label>
        <input
          id="ctaUrl"
          name="ctaUrl"
          type="text"
          defaultValue={initialValues?.ctaUrl ?? ''}
          placeholder="/category/sofas or https://example.com"
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
      </div>

      <div>
        <label htmlFor="order" className="mb-1 block text-sm font-medium text-stone-700">
          Display order
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={initialValues?.order ?? 0}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={initialValues?.active ?? true}
          className="h-4 w-4 rounded border-stone-300 text-brandBg focus:ring-brandBg"
        />
        <label htmlFor="active" className="text-sm font-medium text-stone-700">
          Active
        </label>
      </div>

      <SubmitButton disabled={uploading} />
    </form>
  );
}
