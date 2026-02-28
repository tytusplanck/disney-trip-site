import type { APIRoute } from 'astro';
import { SITE_PASSWORD } from 'astro:env/server';
import { sanitizeRedirectTarget } from '../../../lib/auth/paths';
import { checkPassword } from '../../../lib/auth/password';
import {
  AUTH_COOKIE_NAME,
  createSessionCookieValue,
  getSessionCookieOptions,
} from '../../../lib/auth/session';

function getIsSecure(url: URL): boolean {
  return url.protocol === 'https:' || url.hostname !== 'localhost';
}

function buildErrorLocation(url: URL, next: string): string {
  const loginUrl = new URL('/login', url);
  loginUrl.searchParams.set('error', 'invalid-password');

  if (next !== '/') {
    loginUrl.searchParams.set('next', next);
  }

  return `${loginUrl.pathname}${loginUrl.search}`;
}

export const POST: APIRoute = async (context) => {
  const formData = await context.request.formData();
  const nextEntry = formData.get('next');
  const passwordEntry = formData.get('password');
  const next = sanitizeRedirectTarget(typeof nextEntry === 'string' ? nextEntry : null);

  if (typeof passwordEntry !== 'string') {
    return context.redirect(buildErrorLocation(context.url, next), 303);
  }

  const passwordCheck = checkPassword(passwordEntry, SITE_PASSWORD);

  if (!passwordCheck.ok) {
    return context.redirect(buildErrorLocation(context.url, next), 303);
  }

  context.cookies.set(
    AUTH_COOKIE_NAME,
    createSessionCookieValue(SITE_PASSWORD),
    getSessionCookieOptions(getIsSecure(context.url)),
  );

  return context.redirect(next, 303);
};
