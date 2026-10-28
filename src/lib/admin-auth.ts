import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function sha256(value: string): Buffer {
  return crypto.createHash('sha256').update(value).digest();
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const hashA = sha256(a);
  const hashB = sha256(b);
  return crypto.timingSafeEqual(hashA, hashB);
}

export function verifyCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return false;
  }

  const usernameMatches = timingSafeEqualStrings(username, expectedUsername);
  const passwordMatches = timingSafeEqualStrings(password, expectedPassword);

  return usernameMatches && passwordMatches;
}

export async function createSession(): Promise<void> {
  const secret = process.env.ADMIN_JWT_SECRET;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret.length < 32 || secret === 'change-me') {
      throw new Error('ADMIN_JWT_SECRET must be set in production to a random string of at least 32 characters.');
    }
    if (!adminPassword || adminPassword.length < 10) {
      throw new Error('ADMIN_PASSWORD must be set in production to a value of at least 10 characters.');
    }
  }

  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is not set.');
  }

  const token = jwt.sign({ role: 'admin' }, secret, { algorithm: 'HS256', expiresIn: '7d' });

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function getAdmin(): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
      return false;
    }

    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) {
      return false;
    }

    const payload = jwt.verify(token, secret);
    if (typeof payload === 'object' && payload !== null && payload.role === 'admin') {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export async function requireAdmin(): Promise<void> {
  const isAdmin = await getAdmin();
  if (!isAdmin) {
    redirect('/admin');
  }
}

export async function clearSession(): Promise<void> {
  cookies().delete(COOKIE_NAME);
}
