import type { LLTripPricing } from '../../../lib/trips/ll-types';

// Exact Nov. 2026 Lightning Lane pricing is not available yet; these estimates
// use same-date Nov. 2025 posted prices as the closest date-based proxy.
export const planckMegaDisneyTripLLPricing: LLTripPricing = {
  attractions: {
    'mk-seven-dwarfs-mine-train': { estimatedPriceUsd: 15 },
    'mk-tron-lightcycle-run': { estimatedPriceUsd: 23 },
    'epcot-guardians-of-the-galaxy-cosmic-rewind': { estimatedPriceUsd: 22 },
    'dhs-star-wars-rise-of-the-resistance': { estimatedPriceUsd: 25 },
    'dak-avatar-flight-of-passage': { estimatedPriceUsd: 18 },
  },
  multiPass: {
    'magic-kingdom': { estimatedPriceUsd: 39 },
    epcot: { estimatedPriceUsd: 32 },
    'hollywood-studios': { estimatedPriceUsd: 32 },
    'animal-kingdom': { estimatedPriceUsd: 22 },
  },
};
