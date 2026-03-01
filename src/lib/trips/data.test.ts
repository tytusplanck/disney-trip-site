import type { PreferenceTier } from './types';
import { describe, expect, it } from 'vitest';
import {
  buildAttractionPreferences,
  getPreferenceTierPoints,
  getTopAttractionPick,
  getTripParkLabels,
} from './data';

describe('trip data helpers', () => {
  it('maps raw preference rows into scored attraction records', () => {
    const preferences = buildAttractionPreferences(
      [{ id: 'tytus' }, { id: 'cassie' }],
      [['space-mountain', 'Magic Kingdom', 'Tomorrowland', 'Space Mountain', [1, 4]]],
    );

    expect(preferences).toEqual([
      {
        areaLabel: 'Tomorrowland',
        attractionLabel: 'Space Mountain',
        consensusScore: 6,
        id: 'space-mountain',
        parkLabel: 'Magic Kingdom',
        preferenceByPartyMemberId: {
          cassie: 4,
          tytus: 1,
        },
      },
    ]);
  });

  it('rejects rows whose rating counts do not match the party size', () => {
    expect(() =>
      buildAttractionPreferences(
        [{ id: 'tytus' }, { id: 'cassie' }],
        [['space-mountain', 'Magic Kingdom', 'Tomorrowland', 'Space Mountain', [1]]],
      ),
    ).toThrow('Expected 2 ratings for space-mountain, received 1.');
  });

  it('rejects sparse rating rows that omit a party member value', () => {
    const sparseRatings: PreferenceTier[] = [1, 2];
    sparseRatings.length = 3;

    expect(() =>
      buildAttractionPreferences(
        [{ id: 'tytus' }, { id: 'cassie' }, { id: 'dave' }],
        [['space-mountain', 'Magic Kingdom', 'Tomorrowland', 'Space Mountain', sparseRatings]],
      ),
    ).toThrow('Missing rating for dave on space-mountain.');
  });

  it('derives distinct park labels and the top attraction pick', () => {
    const attractions = [
      { attractionLabel: 'Haunted Mansion', consensusScore: 42, parkLabel: 'Magic Kingdom' },
      {
        attractionLabel: 'Kilimanjaro Safaris',
        consensusScore: 47,
        parkLabel: "Disney's Animal Kingdom",
      },
      {
        attractionLabel: 'Pirates of the Caribbean',
        consensusScore: 42,
        parkLabel: 'Magic Kingdom',
      },
    ];

    expect(getTripParkLabels(attractions)).toEqual(['Magic Kingdom', "Disney's Animal Kingdom"]);
    expect(getTopAttractionPick(attractions)).toBe('Kilimanjaro Safaris');
  });

  it('exposes the point value for each preference tier', () => {
    expect(([1, 2, 3, 4, 5] as const).map((tier) => getPreferenceTierPoints(tier))).toEqual([
      5, 4, 3, 1, 0,
    ]);
  });
});
