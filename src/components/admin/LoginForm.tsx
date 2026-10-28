'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction, type LoginState } from '@/app/admin/actions';

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-brandBg px-4 py-2 font-semibold text-white transition hover:bg-brandBg/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Signing in...' : 'Sign in'}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-lg border border-stone-200 bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Admin Login</h1>
          <p className="mt-1 text-sm text-stone-500">Sign in to manage Sulochana Furniture.</p>
        </div>

        {state?.error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
        ) : null}

        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-medium text-stone-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-stone-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-brandBg focus:outline-none focus:ring-1 focus:ring-brandBg"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
