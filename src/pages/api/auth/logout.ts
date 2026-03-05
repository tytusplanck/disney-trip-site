import type { APIRoute } from 'astro';
import { AUTH_COOKIE_NAME, getSessionCookieOptionsForUrl } from '../../../lib/auth/session';

export const POST: APIRoute = (context) => {
  context.cookies.delete(AUTH_COOKIE_NAME, getSessionCookieOptionsForUrl(context.url));
  return context.redirect('/login', 303);
};
