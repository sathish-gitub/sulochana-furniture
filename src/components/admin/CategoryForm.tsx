'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { slugify } from '@/lib/slug';
import ImageUploader from '@/components/admin/ImageUploader';
import type { CategoryFormState } from '@/app/admin/(panel)/categories/actions';

type ParentOption = {
  id: string;
  name: string;
};

type CategoryFormProps = {
  mode: 'create' | 'edit';
  action: (prevState: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  parentOptions: ParentOption[];
  initialValues?: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    description: string | null;
    order: number;
    image: string | null;
    hasChildren: boolean;
  };
};

const initialState: CategoryFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-brandBg px-4 py-2 text-sm font-semibold text-white transition hover:bg-brandBg/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

export default function CategoryForm({ mode, action, parentOptions, initialValues }: CategoryFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  const [name, setName] = useState(initialValues?.name ?? '');
  const [slug, setSlug] = useState(initialValues?.slug ?? '');

  useEffect(() => {
    if (mode === 'create') {
      setSlug(slugify(name));
    }
  }, [name, mode]);

  const parentSelectDisabled = Boolean(initialValues?.hasChildren);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {state?.error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      ) : null}

      {mode === 'edit' && initialValues ? (
        <input type="hidden" name="id" value={initialValues.id} />
      ) : null}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-stone-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-stone-700">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          readOnly={mode === 'edit'}
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg read-only:bg-stone-100 read-only:text-stone-500"
        />
      </div>

      <div>
        <label htmlFor="parentId" className="mb-1 block text-sm font-medium text-stone-700">
          Parent category
        </label>
        <select
          id="parentId"
          name="parentId"
          defaultValue={initialValues?.parentId ?? ''}
          disabled={parentSelectDisabled}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg disabled:bg-stone-100 disabled:text-stone-500"
        >
          <option value="">None (top-level)</option>
          {parentOptions
            .filter((option) => option.id !== initialValues?.id)
            .map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
        </select>
        {parentSelectDisabled ? (
          <p className="mt-1 text-xs text-stone-500">
            This category has subcategories, so it must stay top-level.
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-stone-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initialValues?.description ?? ''}
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

      <ImageUploader 
        name="image" 
        initialUrl={initialValues?.image ?? null} 
        label="Image" 
        hint="Recommended 500 x 500 px (1:1 square), JPG or WebP, max 1 MB"
      />

      <SubmitButton />
    </form>
  );
}
