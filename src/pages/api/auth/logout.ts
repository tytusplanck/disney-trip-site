import type { APIRoute } from 'astro';
import { AUTH_COOKIE_NAME, getSessionCookieOptions } from '../../../lib/auth/session';

function getIsSecure(url: URL): boolean {
  return url.protocol === 'https:' || url.hostname !== 'localhost';
}

export const POST: APIRoute = (context) => {
  context.cookies.delete(AUTH_COOKIE_NAME, getSessionCookieOptions(getIsSecure(context.url)));
  return context.redirect('/login', 303);
};
