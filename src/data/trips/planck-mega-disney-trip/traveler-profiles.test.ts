import type { TravelerProfile } from '../../../lib/trips/types';
import { describe, expect, it } from 'vitest';
import { planckMegaDisneyTripTravelerProfiles } from './traveler-profiles';

const profilesByMemberId = new Map(
  planckMegaDisneyTripTravelerProfiles.map((profile) => [profile.memberId, profile]),
);

function getProfile(memberId: string): TravelerProfile {
  const profile = profilesByMemberId.get(memberId);

  if (!profile) {
    throw new Error(`Expected a traveler profile for ${memberId}.`);
  }

  return profile;
}

describe('Planck Mega Disney Trip traveler profiles', () => {
  it('stores the current priority list for each traveler with specific ride goals', () => {
    expect(getProfile('tytus-planck').priorities).toEqual([
      'Guardians of the Galaxy: Cosmic Rewind',
      'EPCOT Food & Wine Festival',
      'Fantasmic!',
      'Big Thunder Mountain Railroad',
      'The Land',
    ]);
    expect(getProfile('kelsey-planck').priorities).toEqual([
      'Have fun',
      'Guardians of the Galaxy: Cosmic Rewind',
    ]);
    expect(getProfile('truman-planck').priorities).toEqual([
      'Seven Dwarfs Mine Train',
      'Journey Into Imagination With Figment',
      'Slinky Dog Dash',
      "Tiana's Bayou Adventure",
      'Kilimanjaro Safaris',
    ]);
    expect(getProfile('cassian-planck').priorities).toEqual([
      'The Many Adventures of Winnie the Pooh',
      '"it\'s a small world"',
      "Remy's Ratatouille Adventure",
      'Alien Swirling Saucers',
    ]);
  });

  it('captures adult trip context and safety goals', () => {
    expect(getProfile('andrea-planck').notes).toContain('Not her first Disney trip');
    expect(getProfile('andrea-planck').priorities).toEqual([
      'Nice family photos',
      'Avatar Flight of Passage',
      'Taking care of the grandchildren',
    ]);

    expect(getProfile('tom-planck').notes).toContain('changing diapers');
    expect(getProfile('everett-planck').notes).toContain('has not been in 20+ years');
    expect(getProfile('barbara-planck').notes).toContain('not get hurt or fall');
    expect(getProfile('barbara-ford').notes).toContain('drink water');
  });

  it('captures the Stevenson and extended-family first-trip notes', () => {
    expect(getProfile('hannah-stevenson').notes).toContain('first time with Macy');
    expect(getProfile('brody-stevenson').notes).toContain('never been to Walt Disney World');
    expect(getProfile('david-everett').notes).toContain('do as much as he can');
    expect(getProfile('lee-bastyr').notes).toContain('do as much as he can');
  });
});
