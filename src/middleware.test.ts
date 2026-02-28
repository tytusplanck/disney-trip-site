import type { MiddlewareHandler } from 'astro';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import { AUTH_COOKIE_NAME, createSessionCookieValue } from './lib/auth/session';
import { MockCookies, createMiddlewareContext } from './test/astro-mocks';

const SITE_PASSWORD = 'test-password';

let onRequest: MiddlewareHandler;

function assertResponse(response: unknown): asserts response is Response {
  if (!(response instanceof Response)) {
    throw new Error('Expected middleware to return a response.');
  }
}

beforeAll(async () => {
  vi.resetModules();
  vi.stubEnv('SITE_PASSWORD', SITE_PASSWORD);
  ({ onRequest } = await import('./middleware'));
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe('middleware', () => {
  it('redirects unauthenticated protected requests to login with a safe next target', async () => {
    const context = createMiddlewareContext('https://example.com/casschwlanck/2026?view=full');
    const next = vi.fn<() => Promise<Response>>(() => Promise.resolve(new Response('protected')));

    const response = await onRequest(context, next);
    assertResponse(response);

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe(
      '/login?next=%2Fcasschwlanck%2F2026%3Fview%3Dfull',
    );
    expect(response.headers.get('cache-control')).toBe('private, no-store, max-age=0');
    expect(response.headers.get('x-frame-options')).toBe('DENY');
  });

  it('redirects authenticated login requests back to the archive', async () => {
    const cookies = new MockCookies({
      [AUTH_COOKIE_NAME]: createSessionCookieValue(SITE_PASSWORD, '2026-02-28T00:00:00.000Z'),
    });
    const context = createMiddlewareContext('https://example.com/login', cookies);

    const response = await onRequest(context, () => Promise.resolve(new Response('login')));
    assertResponse(response);

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('/');
    expect(response.headers.get('cache-control')).toBe('private, no-store, max-age=0');
  });

  it('preserves cache control for Astro build assets', async () => {
    const context = createMiddlewareContext('https://example.com/_astro/app.js');
    const next = vi.fn<() => Promise<Response>>(() =>
      Promise.resolve(
        new Response('asset', {
          headers: {
            'cache-control': 'public, max-age=31536000, immutable',
          },
        }),
      ),
    );

    const response = await onRequest(context, next);
    assertResponse(response);

    expect(next).toHaveBeenCalledOnce();
    expect(response.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    expect(response.headers.get('referrer-policy')).toBe('no-referrer');
    expect(response.headers.get('x-robots-tag')).toContain('noindex');
  });

  it('applies private cache headers to authenticated protected responses', async () => {
    const cookies = new MockCookies({
      [AUTH_COOKIE_NAME]: createSessionCookieValue(SITE_PASSWORD, '2026-02-28T00:00:00.000Z'),
    });
    const context = createMiddlewareContext('https://example.com/', cookies);

    const response = await onRequest(context, () => Promise.resolve(new Response('archive')));
    assertResponse(response);

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('private, no-store, max-age=0');
  });
});
