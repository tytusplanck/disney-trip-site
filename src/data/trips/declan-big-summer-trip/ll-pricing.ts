import type { LLTripPricing } from '../../../lib/trips/ll-types';

export const declanBigSummerTripLLPricing: LLTripPricing = {
  attractions: {
    'mk-seven-dwarfs-mine-train': { estimatedPriceUsd: 11 },
    'mk-tron-lightcycle-run': { estimatedPriceUsd: 19 },
    'epcot-guardians-of-the-galaxy-cosmic-rewind': { estimatedPriceUsd: 16 },
    'dhs-star-wars-rise-of-the-resistance': { estimatedPriceUsd: 20 },
    'dak-avatar-flight-of-passage': { estimatedPriceUsd: 15 },
  },
  multiPass: {
    'magic-kingdom': { estimatedPriceUsd: 25 },
    epcot: { estimatedPriceUsd: 20 },
    'hollywood-studios': { estimatedPriceUsd: 24 },
    'animal-kingdom': { estimatedPriceUsd: 16 },
  },
};
