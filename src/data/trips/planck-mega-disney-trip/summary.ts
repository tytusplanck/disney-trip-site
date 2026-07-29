import type { TripSummary } from '../../../lib/trips/types';
import { planckMegaDisneyTripParty } from './party';
import { planckMegaDisneyTripSchedule } from './schedule';

export const planckMegaDisneyTripSummary: TripSummary = {
  slug: 'planck-mega-disney-trip',
  legacyRoutes: [{ familySlug: 'casschwlanck', tripSlug: 'future-trip' }],
  title: 'Planck Mega Disney trip',
  dateLabel: 'Nov 7 - Nov 15, 2026',
  parkLabels: ["Disney's Animal Kingdom", 'EPCOT', 'Magic Kingdom', "Disney's Hollywood Studios"],
  partySize: planckMegaDisneyTripParty.length,
  dayCount: planckMegaDisneyTripSchedule.length,
  attractionCount: null,
  status: 'planning',
  topPick: null,
  themeId: 'secondary',
};
