import { describe, expect, it } from 'vitest';
import { getPublicPathDecision, sanitizeRedirectTarget } from './paths';

describe('getPublicPathDecision', () => {
  it('marks the login route as public', () => {
    expect(getPublicPathDecision('/login')).toEqual({ isPublic: true });
  });

  it('marks Astro asset chunks as public', () => {
    expect(getPublicPathDecision('/_astro/app.js')).toEqual({ isPublic: true });
  });

  it('marks the trip homepage as protected', () => {
    expect(getPublicPathDecision('/')).toEqual({ isPublic: false });
  });
});

describe('sanitizeRedirectTarget', () => {
  it('preserves safe internal paths', () => {
    expect(sanitizeRedirectTarget('/itinerary?day=1')).toBe('/itinerary?day=1');
  });

  it('falls back to the homepage for external values', () => {
    expect(sanitizeRedirectTarget('https://example.com')).toBe('/');
    expect(sanitizeRedirectTarget('//example.com')).toBe('/');
  });

  it('falls back to the homepage for public and API route targets', () => {
    expect(sanitizeRedirectTarget('/login')).toBe('/');
    expect(sanitizeRedirectTarget('/_astro/app.js')).toBe('/');
    expect(sanitizeRedirectTarget('/api/auth/logout')).toBe('/');
  });
});
