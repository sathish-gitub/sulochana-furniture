'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { slugify } from '@/lib/slug';
import ImageUploader from '@/components/admin/ImageUploader';
import type { ProductFormState } from '@/app/admin/(panel)/products/actions';

type CategoryOption = {
  id: string;
  label: string;
};

type AttributeRow = {
  label: string;
  value: string;
};

type ProductFormProps = {
  mode: 'create' | 'edit';
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categoryOptions: CategoryOption[];
  initialValues?: {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    sku: string | null;
    brand: string | null;
    description: string | null;
    tags: string | null;
    status: string;
    images: string[];
    attributes: AttributeRow[];
  };
};

const initialState: ProductFormState = {};

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'OUT_OF_STOCK', label: 'Out of stock' },
];

const IMAGE_SLOT_LABELS = [
  'Main image (required)',
  'Image 2',
  'Image 3',
  'Image 4',
  'Image 5',
  'Image 6',
];

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

export default function ProductForm({ mode, action, categoryOptions, initialValues }: ProductFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  const [name, setName] = useState(initialValues?.name ?? '');
  const [slug, setSlug] = useState(initialValues?.slug ?? '');
  const [attributes, setAttributes] = useState<AttributeRow[]>(
    initialValues?.attributes && initialValues.attributes.length > 0
      ? initialValues.attributes
      : [{ label: '', value: '' }]
  );
  const [uploadingSlots, setUploadingSlots] = useState<boolean[]>(new Array(6).fill(false));

  useEffect(() => {
    if (mode === 'create') {
      setSlug(slugify(name));
    }
  }, [name, mode]);

  function handleSlotUploadingChange(slotIndex: number, uploading: boolean) {
    setUploadingSlots((previous) => {
      const next = [...previous];
      next[slotIndex] = uploading;
      return next;
    });
  }

  function addAttributeRow() {
    setAttributes((previous) => [...previous, { label: '', value: '' }]);
  }

  function removeAttributeRow(index: number) {
    setAttributes((previous) => previous.filter((_, i) => i !== index));
  }

  function updateAttributeRow(index: number, field: 'label' | 'value', value: string) {
    setAttributes((previous) =>
      previous.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  const isUploading = uploadingSlots.some(Boolean);

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
        <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-stone-700">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={initialValues?.categoryId ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categoryOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sku" className="mb-1 block text-sm font-medium text-stone-700">
          SKU
        </label>
        <input
          id="sku"
          name="sku"
          type="text"
          defaultValue={initialValues?.sku ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
      </div>

      <div>
        <label htmlFor="brand" className="mb-1 block text-sm font-medium text-stone-700">
          Brand
        </label>
        <input
          id="brand"
          name="brand"
          type="text"
          defaultValue={initialValues?.brand ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-stone-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialValues?.description ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
      </div>

      <div>
        <label htmlFor="tags" className="mb-1 block text-sm font-medium text-stone-700">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={initialValues?.tags ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
        <p className="mt-1 text-xs text-stone-500">Comma separated</p>
      </div>

      <div>
        <label htmlFor="status" className="mb-1 block text-sm font-medium text-stone-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          required
          defaultValue={initialValues?.status ?? 'ACTIVE'}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-stone-700">Images</p>
        {IMAGE_SLOT_LABELS.map((label, index) => (
          <ImageUploader
            key={index}
            name={`image${index + 1}`}
            initialUrl={initialValues?.images?.[index] ?? null}
            label={label}
            onUploadingChange={(uploading) => handleSlotUploadingChange(index, uploading)}
          />
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-stone-700">Specifications</p>
        {attributes.map((row, index) => (
          <div key={index} className="flex items-start gap-2">
            <input
              type="text"
              name="attr_label"
              placeholder="Label"
              value={row.label}
              onChange={(event) => updateAttributeRow(index, 'label', event.target.value)}
              className="w-1/2 rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
            />
            <input
              type="text"
              name="attr_value"
              placeholder="Value"
              value={row.value}
              onChange={(event) => updateAttributeRow(index, 'value', event.target.value)}
              className="w-1/2 rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
            />
            <button
              type="button"
              onClick={() => removeAttributeRow(index)}
              className="rounded-md border border-stone-300 px-3 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-100"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addAttributeRow}
          className="rounded-md border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 transition hover:bg-stone-100"
        >
          Add row
        </button>
      </div>

      <SubmitButton disabled={isUploading} />
    </form>
  );
}
