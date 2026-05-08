import type { LLTripPricing } from '../../../lib/trips/ll-types';

export const planckMegaDisneyTripLLPricing: LLTripPricing = {
  attractions: {
    'mk-seven-dwarfs-mine-train': { estimatedPriceUsd: 13 },
    'mk-tron-lightcycle-run': { estimatedPriceUsd: 21 },
    'epcot-guardians-of-the-galaxy-cosmic-rewind': { estimatedPriceUsd: 18 },
    'dhs-star-wars-rise-of-the-resistance': { estimatedPriceUsd: 25 },
    'dak-avatar-flight-of-passage': { estimatedPriceUsd: 17 },
  },
  multiPass: {
    'magic-kingdom': { estimatedPriceUsd: 32 },
    epcot: { estimatedPriceUsd: 24 },
    'hollywood-studios': { estimatedPriceUsd: 29 },
    'animal-kingdom': { estimatedPriceUsd: 22 },
  },
};
