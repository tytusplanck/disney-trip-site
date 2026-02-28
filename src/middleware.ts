import type { MiddlewareHandler } from 'astro';
import { SITE_PASSWORD } from 'astro:env/server';
import { getPublicPathDecision, normalizePathname, sanitizeRedirectTarget } from './lib/auth/paths';
import { AUTH_COOKIE_NAME, verifySessionCookieValue } from './lib/auth/session';

const SECURITY_HEADERS = {
  'cache-control': 'private, no-store, max-age=0',
  'referrer-policy': 'no-referrer',
  'x-frame-options': 'DENY',
  'x-robots-tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
} as const;

function applySecurityHeaders(response: Response): Response {
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    response.headers.set(header, value);
  });

  return response;
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const pathname = normalizePathname(context.url.pathname);
  const sessionCookie = context.cookies.get(AUTH_COOKIE_NAME);
  const sessionValue = typeof sessionCookie?.value === 'string' ? sessionCookie.value : undefined;
  const isAuthenticated = verifySessionCookieValue(sessionValue, SITE_PASSWORD) !== null;
  const { isPublic } = getPublicPathDecision(pathname);

  if (pathname === '/login' && isAuthenticated) {
    return applySecurityHeaders(context.redirect('/', 302));
  }

  if (!isPublic && !isAuthenticated) {
    const redirectLocation = new URL('/login', context.url);
    const nextTarget = sanitizeRedirectTarget(`${pathname}${context.url.search}`);

    if (nextTarget !== '/') {
      redirectLocation.searchParams.set('next', nextTarget);
    }

    return applySecurityHeaders(
      context.redirect(`${redirectLocation.pathname}${redirectLocation.search}`, 302),
    );
  }

  const response = await next();
  return applySecurityHeaders(response);
};
