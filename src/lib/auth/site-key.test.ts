import { describe, expect, it } from 'vitest';
import { checkSiteKey } from './site-key';

describe('checkSiteKey', () => {
  it('returns ok when the provided site key matches', () => {
    expect(checkSiteKey('castle', 'castle')).toEqual({ ok: true });
  });

  it('returns not ok when the provided site key differs', () => {
    expect(checkSiteKey('castle', 'spaceship-earth')).toEqual({ ok: false });
  });
});
