'use server';

import { redirect } from 'next/navigation';
import { clearSession, createSession, verifyCredentials } from '@/lib/admin-auth';

export type LoginState = {
  error?: string;
};

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  // Always wait first so success and failure take roughly the same time.
  await wait(500);

  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!verifyCredentials(username, password)) {
    return { error: 'Invalid username or password' };
  }

  await createSession();
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect('/admin');
}
