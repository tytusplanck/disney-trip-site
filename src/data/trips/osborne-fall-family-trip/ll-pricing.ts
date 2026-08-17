import type { LLTripPricing } from '../../../lib/trips/ll-types';

// Pulled Aug. 17, 2026. Disney only exposes exact prices up to 21 days ahead,
// so Sep. 21-25, 2026 is not available yet. These estimates use the posted
// same-date Sep. 2025 prices as the closest trip-date proxy.
// Availability policy: disneyworld.disney.go.com/en_CA/faq/lightning-lane-passes/cost/
// Multi Pass history: disneyfoodblog.com/disney-genie-and-surge-pricing-what-you-need-to-know/
// Single Pass history: thrill-data.com/home/thrillda/ftn/lightning-lane/wdw/prices
export const osborneFallFamilyTripLLPricing: LLTripPricing = {
  attractions: {
    'mk-seven-dwarfs-mine-train': { estimatedPriceUsd: 12 },
    'mk-tron-lightcycle-run': { estimatedPriceUsd: 20 },
    'epcot-guardians-of-the-galaxy-cosmic-rewind': { estimatedPriceUsd: 18 },
    'dhs-star-wars-rise-of-the-resistance': { estimatedPriceUsd: 24 },
    'dak-avatar-flight-of-passage': { estimatedPriceUsd: 16 },
  },
  multiPass: {
    'magic-kingdom': { estimatedPriceUsd: 27 },
    epcot: { estimatedPriceUsd: 21 },
    'hollywood-studios': { estimatedPriceUsd: 27 },
    'animal-kingdom': { estimatedPriceUsd: 16 },
  },
};
