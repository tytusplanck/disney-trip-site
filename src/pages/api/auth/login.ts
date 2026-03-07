import type { APIRoute } from 'astro';
import { SITE_PASSWORD } from 'astro:env/server';
import { sanitizeRedirectTarget } from '../../../lib/auth/paths';
import { checkSiteKey } from '../../../lib/auth/site-key';
import {
  AUTH_COOKIE_NAME,
  createSessionCookieValue,
  getSessionCookieOptionsForUrl,
} from '../../../lib/auth/session';

function buildErrorLocation(url: URL, next: string): string {
  const loginUrl = new URL('/login', url);
  loginUrl.searchParams.set('error', 'invalid-site-key');

  if (next !== '/') {
    loginUrl.searchParams.set('next', next);
  }

  return `${loginUrl.pathname}${loginUrl.search}`;
}

export const POST: APIRoute = async (context) => {
  const formData = await context.request.formData();
  const nextEntry = formData.get('next');
  const siteKeyEntry = formData.get('siteKey') ?? formData.get('password');
  const next = sanitizeRedirectTarget(typeof nextEntry === 'string' ? nextEntry : null);

  if (typeof siteKeyEntry !== 'string') {
    return context.redirect(buildErrorLocation(context.url, next), 303);
  }

  const siteKeyCheck = checkSiteKey(siteKeyEntry, SITE_PASSWORD);

  if (!siteKeyCheck.ok) {
    return context.redirect(buildErrorLocation(context.url, next), 303);
  }

  context.cookies.set(
    AUTH_COOKIE_NAME,
    createSessionCookieValue(SITE_PASSWORD),
    getSessionCookieOptionsForUrl(context.url),
  );

  return context.redirect(next, 303);
};
