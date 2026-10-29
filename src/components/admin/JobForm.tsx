'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { JobFormState } from '@/app/admin/(panel)/careers/actions';

const JOB_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract', 'Internship'];

type JobFormProps = {
  mode: 'create' | 'edit';
  action: (prevState: JobFormState, formData: FormData) => Promise<JobFormState>;
  initialValues?: {
    id: string;
    title: string;
    jobType: string;
    location: string;
    salary: string | null;
    description: string;
    active: boolean;
  };
};

const initialState: JobFormState = {};

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

export default function JobForm({ mode, action, initialValues }: JobFormProps) {
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
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-stone-700">
          Job title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialValues?.title ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
      </div>

      <div>
        <label htmlFor="jobType" className="mb-1 block text-sm font-medium text-stone-700">
          Job type
        </label>
        <select
          id="jobType"
          name="jobType"
          required
          defaultValue={initialValues?.jobType ?? JOB_TYPE_OPTIONS[0]}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        >
          {JOB_TYPE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="location" className="mb-1 block text-sm font-medium text-stone-700">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          defaultValue={initialValues?.location ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
      </div>

      <div>
        <label htmlFor="salary" className="mb-1 block text-sm font-medium text-stone-700">
          Salary
        </label>
        <input
          id="salary"
          name="salary"
          type="text"
          defaultValue={initialValues?.salary ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
        <p className="mt-1 text-xs text-stone-500">
          For example: Rs 15,000 - 20,000 per month, or Negotiable
        </p>
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-stone-700">
          Job description
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          required
          defaultValue={initialValues?.description ?? ''}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
        />
        <p className="mt-1 text-xs text-stone-500">Line breaks are kept</p>
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

      <SubmitButton />
    </form>
  );
}
