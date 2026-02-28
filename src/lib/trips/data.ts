import type { PreferenceTier, TripAttractionPreference, TripPartyMember } from './types';

export type RawAttractionPreferenceRow = readonly [
  id: string,
  parkLabel: string,
  areaLabel: string,
  attractionLabel: string,
  ratings: readonly PreferenceTier[],
];

const PREFERENCE_SCORE_BY_TIER: Record<PreferenceTier, number> = {
  1: 5,
  2: 4,
  3: 3,
  4: 1,
  5: 0,
};

export function buildAttractionPreferences(
  party: readonly Pick<TripPartyMember, 'id'>[],
  rows: readonly RawAttractionPreferenceRow[],
): TripAttractionPreference[] {
  return rows.map(([id, parkLabel, areaLabel, attractionLabel, ratings]) => {
    if (ratings.length !== party.length) {
      throw new Error(
        `Expected ${String(party.length)} ratings for ${id}, received ${String(ratings.length)}.`,
      );
    }

    const preferenceByPartyMemberId: Record<string, PreferenceTier> = {};

    party.forEach((member, index) => {
      const rating = ratings[index];

      if (rating === undefined) {
        throw new Error(`Missing rating for ${member.id} on ${id}.`);
      }

      preferenceByPartyMemberId[member.id] = rating;
    });

    return {
      id,
      parkLabel,
      areaLabel,
      attractionLabel,
      consensusScore: ratings.reduce(
        (total, rating) => total + PREFERENCE_SCORE_BY_TIER[rating],
        0,
      ),
      preferenceByPartyMemberId,
    };
  });
}

export function getTripParkLabels(
  attractions: readonly Pick<TripAttractionPreference, 'parkLabel'>[],
): string[] {
  return Array.from(new Set(attractions.map((attraction) => attraction.parkLabel)));
}

export function getTopAttractionPick(
  attractions: readonly Pick<TripAttractionPreference, 'attractionLabel' | 'consensusScore'>[],
): string | null {
  const [topAttraction] = [...attractions].sort(
    (left, right) =>
      right.consensusScore - left.consensusScore ||
      left.attractionLabel.localeCompare(right.attractionLabel),
  );

  return topAttraction?.attractionLabel ?? null;
}
