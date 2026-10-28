import type { LLTripPricing } from '../../../lib/trips/ll-types';

// Pulled Oct. 27, 2026 from Thrill Data.
// Multi Pass: posted prices for the actual park days (Nov 8, 10, 12, 14, 2026).
// Single Pass: only tracked day-of, so these use same-weekday Nov. 2025 prices
// nudged by the Oct. 2025 -> Oct. 2026 change and recent same-weekday prices.
// Multi Pass history: thrill-data.com/lightning-lane/wdw/price-history
// Single Pass history: thrill-data.com/lightning-lane/wdw/prices
export const planckMegaDisneyTripLLPricing: LLTripPricing = {
  attractions: {
    'mk-seven-dwarfs-mine-train': { estimatedPriceUsd: 15 },
    'mk-tron-lightcycle-run': { estimatedPriceUsd: 23 },
    'epcot-guardians-of-the-galaxy-cosmic-rewind': { estimatedPriceUsd: 22 },
    'dhs-star-wars-rise-of-the-resistance': { estimatedPriceUsd: 25 },
    'dak-avatar-flight-of-passage': { estimatedPriceUsd: 19 },
  },
  multiPass: {
    'magic-kingdom': { estimatedPriceUsd: 39 },
    epcot: { estimatedPriceUsd: 28 },
    'hollywood-studios': { estimatedPriceUsd: 29 },
    'animal-kingdom': { estimatedPriceUsd: 25 },
  },
};
