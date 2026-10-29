'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { TestimonialFormState } from '@/app/admin/(panel)/testimonials/actions';

type TestimonialFormProps = {
  mode: 'create' | 'edit';
  action: (prevState: TestimonialFormState, formData: FormData) => Promise<TestimonialFormState>;
  initialValues?: {
    id: string;
    name: string;
    quote: string;
    rating: number;
    featured: boolean;
  };
};

const initialState: TestimonialFormState = {};

const RATING_OPTIONS = [1, 2, 3, 4, 5];

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

export default function TestimonialForm({ mode, action, initialValues }: TestimonialFormProps) {
  const [state, formAction] = useFormState(action, initialState);

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
          defaultValue={initialValues?.name ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
      </div>

      <div>
        <label htmlFor="quote" className="mb-1 block text-sm font-medium text-stone-700">
          Quote
        </label>
        <textarea
          id="quote"
          name="quote"
          rows={4}
          required
          defaultValue={initialValues?.quote ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
      </div>

      <div>
        <label htmlFor="rating" className="mb-1 block text-sm font-medium text-stone-700">
          Rating
        </label>
        <select
          id="rating"
          name="rating"
          required
          defaultValue={initialValues?.rating ?? 5}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        >
          {RATING_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          defaultChecked={initialValues?.featured ?? true}
          className="h-4 w-4 rounded border-stone-300 text-brandBg focus:ring-brandBg"
        />
        <label htmlFor="featured" className="text-sm font-medium text-stone-700">
          Featured
        </label>
      </div>
      <p className="-mt-2 text-xs text-stone-500">Featured testimonials appear on the website</p>

      <SubmitButton />
    </form>
  );
}
