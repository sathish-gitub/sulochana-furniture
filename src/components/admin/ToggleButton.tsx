'use client';

import { useFormStatus } from 'react-dom';

type ToggleButtonProps = {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs font-medium text-stone-600 transition hover:text-brandBg disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving...' : label}
    </button>
  );
}

export default function ToggleButton({ action, id, label }: ToggleButtonProps) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton label={label} />
    </form>
  );
}
