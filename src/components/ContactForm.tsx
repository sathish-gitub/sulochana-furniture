'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { sendContactEmail, type ContactFormState } from '@/lib/actions/contact';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center rounded-full bg-brandBg px-6 py-3 text-sm font-semibold text-white transition hover:bg-brandBg/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send Message'}
    </button>
  );
}

const inputCls =
  'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-brand';

const initial: ContactFormState = { status: 'idle' };

export default function ContactForm() {
  const [state, action] = useFormState(sendContactEmail, initial);

  if (state.status === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-8 text-center">
        <p className="text-lg font-semibold text-green-800">Message sent!</p>
        <p className="mt-1 text-sm text-green-700">Thanks! We&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-8 space-y-4">
      {state.status === 'error' && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-stone-700">
          <span>First Name <span className="text-red-500">*</span></span>
          <input name="firstName" type="text" required placeholder="John" className={inputCls} />
        </label>
        <label className="space-y-2 text-sm font-medium text-stone-700">
          <span>Last Name</span>
          <input name="lastName" type="text" placeholder="Doe" className={inputCls} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-stone-700">
          <span>Email <span className="text-red-500">*</span></span>
          <input name="email" type="email" required placeholder="john@example.com" className={inputCls} />
        </label>
        <label className="space-y-2 text-sm font-medium text-stone-700">
          <span>Phone</span>
          <input name="phone" type="tel" placeholder="+91" className={inputCls} />
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-stone-700">
        <span>Message <span className="text-red-500">*</span></span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Tell us what furniture you are looking for..."
          className={`${inputCls} resize-y`}
        />
      </label>

      <SubmitButton />
    </form>
  );
}
