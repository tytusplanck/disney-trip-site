import type { APIRoute } from 'astro';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AUTH_COOKIE_NAME, verifySessionCookieValue } from '../../../lib/auth/session';
import { MockCookies, createApiContext } from '../../../test/astro-mocks';

const SITE_PASSWORD = 'test-password';

let loginPost: APIRoute;
let logoutPost: APIRoute;

function buildLoginForm(entries: Record<string, string>): FormData {
  const formData = new FormData();

  Object.entries(entries).forEach(([name, value]) => {
    formData.set(name, value);
  });

  return formData;
}

beforeAll(async () => {
  vi.resetModules();
  vi.stubEnv('SITE_PASSWORD', SITE_PASSWORD);
  ({ POST: loginPost } = await import('./login'));
  ({ POST: logoutPost } = await import('./logout'));
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe('auth route handlers', () => {
  it('sets a signed cookie and redirects to a sanitized next path on successful login', async () => {
    const cookies = new MockCookies();
    const context = createApiContext(
      'https://example.com/api/auth/login',
      cookies,
      buildLoginForm({
        next: '/casschwlanck/2026/schedule',
        password: SITE_PASSWORD,
      }),
    );

    const response = await loginPost(context);
    const cookieWrite = cookies.setCalls[0];

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/casschwlanck/2026/schedule');
    expect(cookieWrite).toBeDefined();
    expect(cookieWrite?.name).toBe(AUTH_COOKIE_NAME);
    expect(cookieWrite?.options).toMatchObject({
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: true,
    });
    expect(verifySessionCookieValue(cookieWrite?.value, SITE_PASSWORD)).toMatchObject({
      scope: 'site',
    });
  });

  it('uses non-secure cookie options for localhost development logins', async () => {
    const cookies = new MockCookies();
    const context = createApiContext(
      'http://localhost/api/auth/login',
      cookies,
      buildLoginForm({
        password: SITE_PASSWORD,
      }),
    );

    await loginPost(context);

    expect(cookies.setCalls[0]?.options).toMatchObject({
      secure: false,
    });
  });

  it('falls back to the archive when next points to an external site', async () => {
    const cookies = new MockCookies();
    const context = createApiContext(
      'https://example.com/api/auth/login',
      cookies,
      buildLoginForm({
        next: 'https://example.org/elsewhere',
        password: SITE_PASSWORD,
      }),
    );

    const response = await loginPost(context);

    expect(response.headers.get('location')).toBe('/');
  });

  it('redirects back with an error when the password is missing', async () => {
    const context = createApiContext(
      'https://example.com/api/auth/login',
      new MockCookies(),
      buildLoginForm({
        next: '/casschwlanck/2026/party',
      }),
    );

    const response = await loginPost(context);

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe(
      '/login?error=invalid-password&next=%2Fcasschwlanck%2F2026%2Fparty',
    );
  });

  it('redirects back with an error when the password is invalid', async () => {
    const context = createApiContext(
      'https://example.com/api/auth/login',
      new MockCookies(),
      buildLoginForm({
        next: '/casschwlanck/2026/party',
        password: 'wrong-password',
      }),
    );

    const response = await loginPost(context);

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe(
      '/login?error=invalid-password&next=%2Fcasschwlanck%2F2026%2Fparty',
    );
  });

  it('clears the session cookie and redirects to login on logout', async () => {
    const cookies = new MockCookies({
      [AUTH_COOKIE_NAME]: 'existing-cookie',
    });
    const context = createApiContext('http://localhost/api/auth/logout', cookies);

    const response = await logoutPost(context);

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/login');
    expect(cookies.deleteCalls[0]).toMatchObject({
      name: AUTH_COOKIE_NAME,
      options: {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: false,
      },
    });
  });
});
