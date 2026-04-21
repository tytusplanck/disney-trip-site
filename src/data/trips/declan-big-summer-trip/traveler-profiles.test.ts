import { describe, expect, it } from 'vitest';
import { declanBigSummerTripTravelerProfiles } from './traveler-profiles';

describe('declan big summer trip traveler profiles', () => {
  it('keeps the small-group coordination notes focused on one other adult', () => {
    expect(declanBigSummerTripTravelerProfiles).toHaveLength(3);

    for (const profile of declanBigSummerTripTravelerProfiles) {
      expect(profile.notes).toMatch(/one other adult/i);
    }
  });
});
