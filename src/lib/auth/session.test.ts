import { describe, expect, it } from 'vitest';
import {
  AUTH_COOKIE_NAME,
  createSessionCookieValue,
  getSessionCookieOptions,
  verifySessionCookieValue,
} from './session';

const SECRET = 'epcot-after-dark';
const ISSUED_AT = '2026-02-27T00:00:00.000Z';

describe('session helpers', () => {
  it('creates and verifies a signed session cookie', () => {
    const cookieValue = createSessionCookieValue(SECRET, ISSUED_AT);

    expect(verifySessionCookieValue(cookieValue, SECRET)).toEqual({
      scope: 'site',
      issuedAt: ISSUED_AT,
    });
  });

  it('rejects a cookie with an invalid signature', () => {
    const cookieValue = createSessionCookieValue(SECRET, ISSUED_AT);
    const segments = cookieValue.split('.');
    const payload = segments[0];
    const signature = segments[1];

    expect(payload).toBeDefined();
    expect(signature).toBeDefined();

    if (!payload || !signature) {
      throw new Error('Cookie segments were not created as expected.');
    }

    const tamperedCookie = `${payload}.${signature.slice(0, -1)}x`;

    expect(verifySessionCookieValue(tamperedCookie, SECRET)).toBeNull();
  });

  it('rejects malformed cookies', () => {
    expect(verifySessionCookieValue('not-a-valid-cookie', SECRET)).toBeNull();
    expect(verifySessionCookieValue(undefined, SECRET)).toBeNull();
  });

  it('returns the expected cookie defaults', () => {
    expect(AUTH_COOKIE_NAME).toBe('site_access');
    expect(getSessionCookieOptions(true)).toMatchObject({
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: true,
    });
  });
});
