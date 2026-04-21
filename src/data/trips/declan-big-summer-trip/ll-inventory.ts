import type { LLAttraction, LLParkId, LLParkInventory } from '../../../lib/trips/ll-types';
import { casschwlanck2026LLInventory } from '../casschwlanck-2026/ll-inventory';

const REOPENED_ATTRACTION_IDS = new Set([
  'mk-big-thunder-mountain-railroad',
  'mk-buzz-lightyears-space-ranger-spin',
  'dhs-rock-n-roller-coaster-starring-the-muppets',
]);

function reopenAttraction(attraction: LLAttraction): LLAttraction {
  if (!REOPENED_ATTRACTION_IDS.has(attraction.id)) {
    return attraction;
  }

  return {
    ...attraction,
    closedDuringTrip: false,
    closureNote: null,
  };
}

function buildTripInventory(
  inventory: Record<LLParkId, LLParkInventory>,
): Record<LLParkId, LLParkInventory> {
  return Object.fromEntries(
    Object.entries(inventory).map(([parkId, parkInventory]) => [
      parkId,
      {
        ...parkInventory,
        attractions: parkInventory.attractions.map(reopenAttraction),
      },
    ]),
  ) as Record<LLParkId, LLParkInventory>;
}

export const declanBigSummerTripLLInventory = buildTripInventory(casschwlanck2026LLInventory);
