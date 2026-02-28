import { describe, expect, it } from 'vitest';
import { checkPassword } from './password';

describe('checkPassword', () => {
  it('returns ok when the provided password matches', () => {
    expect(checkPassword('castle', 'castle')).toEqual({ ok: true });
  });

  it('returns not ok when the provided password differs', () => {
    expect(checkPassword('castle', 'spaceship-earth')).toEqual({ ok: false });
  });
});
