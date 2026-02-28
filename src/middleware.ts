import type { MiddlewareHandler } from 'astro';
import { SITE_PASSWORD } from 'astro:env/server';
import { getPublicPathDecision, normalizePathname, sanitizeRedirectTarget } from './lib/auth/paths';
import { AUTH_COOKIE_NAME, verifySessionCookieValue } from './lib/auth/session';

const RESPONSE_SECURITY_HEADERS = {
  'referrer-policy': 'no-referrer',
  'x-frame-options': 'DENY',
  'x-robots-tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
} as const;
const PRIVATE_CACHE_CONTROL_HEADER = 'private, no-store, max-age=0';

function shouldPreserveCacheControl(pathname: string): boolean {
  return (
    pathname.startsWith('/_astro/') || pathname === '/robots.txt' || pathname === '/favicon.svg'
  );
}

function applySecurityHeaders(pathname: string, response: Response): Response {
  Object.entries(RESPONSE_SECURITY_HEADERS).forEach(([header, value]) => {
    response.headers.set(header, value);
  });

  if (!shouldPreserveCacheControl(pathname)) {
    response.headers.set('cache-control', PRIVATE_CACHE_CONTROL_HEADER);
  }

  return response;
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const pathname = normalizePathname(context.url.pathname);
  const sessionCookie = context.cookies.get(AUTH_COOKIE_NAME);
  const sessionValue = typeof sessionCookie?.value === 'string' ? sessionCookie.value : undefined;
  const isAuthenticated = verifySessionCookieValue(sessionValue, SITE_PASSWORD) !== null;
  const { isPublic } = getPublicPathDecision(pathname);

  if (pathname === '/login' && isAuthenticated) {
    return applySecurityHeaders(pathname, context.redirect('/', 302));
  }

  if (!isPublic && !isAuthenticated) {
    const redirectLocation = new URL('/login', context.url);
    const nextTarget = sanitizeRedirectTarget(`${pathname}${context.url.search}`);

    if (nextTarget !== '/') {
      redirectLocation.searchParams.set('next', nextTarget);
    }

    return applySecurityHeaders(
      pathname,
      context.redirect(`${redirectLocation.pathname}${redirectLocation.search}`, 302),
    );
  }

  const response = await next();
  return applySecurityHeaders(pathname, response);
};
