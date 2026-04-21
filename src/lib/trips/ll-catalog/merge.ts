import type { LLAttraction, LLParkId, LLParkInventory, LLTripOverlay } from '../ll-types';
import type { LLCatalog, LLCatalogAttraction, LLCatalogPark } from './types';

const PARK_IDS: readonly LLParkId[] = [
  'magic-kingdom',
  'epcot',
  'hollywood-studios',
  'animal-kingdom',
];

export function mergeLLInventory(
  catalog: LLCatalog,
  overlay: LLTripOverlay,
): Record<LLParkId, LLParkInventory> {
  const catalogIds = new Set<string>();
  for (const parkId of PARK_IDS) {
    for (const a of catalog[parkId].attractions) {
      catalogIds.add(a.id);
    }
  }

  for (const parkId of PARK_IDS) {
    if (!(parkId in overlay.pricing.multiPass)) {
      throw new Error(`mergeLLInventory: missing multiPass price for park "${parkId}"`);
    }
  }

  for (const parkId of PARK_IDS) {
    for (const a of catalog[parkId].attractions) {
      if (a.passType === 'individual' && !overlay.pricing.attractions[a.id]) {
        throw new Error(`mergeLLInventory: missing ILL price for attraction "${a.id}"`);
      }
    }
  }

  for (const id of Object.keys(overlay.pricing.attractions)) {
    if (!catalogIds.has(id)) {
      throw new Error(`mergeLLInventory: pricing references unknown attraction "${id}"`);
    }
  }

  if (overlay.closures) {
    for (const id of Object.keys(overlay.closures)) {
      if (!catalogIds.has(id)) {
        throw new Error(`mergeLLInventory: closure references unknown attraction "${id}"`);
      }
    }
  }

  const result = {} as Record<LLParkId, LLParkInventory>;
  for (const parkId of PARK_IDS) {
    result[parkId] = mergePark(catalog[parkId], overlay);
  }
  return result;
}

function mergePark(park: LLCatalogPark, overlay: LLTripOverlay): LLParkInventory {
  const multiPass = overlay.pricing.multiPass[park.parkId];
  const base: LLParkInventory = {
    parkId: park.parkId,
    parkLabel: park.parkLabel,
    hasTiers: park.hasTiers,
    maxTier1: park.maxTier1,
    maxTier2: park.maxTier2,
    maxMultiPass: park.maxMultiPass,
    multiPassEstimatedPriceUsd: multiPass.estimatedPriceUsd,
    attractions: park.attractions.map((a) => mergeAttraction(a, overlay)),
  };
  if (multiPass.estimatedRangeUsd) {
    base.multiPassEstimatedRangeUsd = multiPass.estimatedRangeUsd;
  }
  return base;
}

function mergeAttraction(cat: LLCatalogAttraction, overlay: LLTripOverlay): LLAttraction {
  const closure = overlay.closures?.[cat.id];
  const price = cat.passType === 'individual' ? overlay.pricing.attractions[cat.id] : undefined;

  const merged: LLAttraction = {
    id: cat.id,
    shortCode: cat.shortCode,
    attractionLabel: cat.attractionLabel,
    parkId: cat.parkId,
    passType: cat.passType,
    tier: cat.tier,
    closedDuringTrip: closure?.closed ?? false,
    closureNote: closure?.note ?? null,
    heightRestriction: cat.heightRestriction,
  };

  if (price) {
    merged.estimatedPriceUsd = price.estimatedPriceUsd;
    if (price.estimatedRangeUsd) {
      merged.estimatedRangeUsd = price.estimatedRangeUsd;
    }
  }

  return merged;
}
