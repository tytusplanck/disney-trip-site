import type { TripSummary } from '../../../lib/trips/types';
import { planckMegaDisneyTripParty } from './party';
import { planckMegaDisneyTripSchedule } from './schedule';

export const planckMegaDisneyTripSummary: TripSummary = {
  slug: 'planck-mega-disney-trip',
  title: 'Planck Mega Disney trip',
  dateLabel: 'Nov 7 - Nov 15, 2026',
  parkLabels: ["Disney's Hollywood Studios", 'Magic Kingdom', 'EPCOT', "Disney's Animal Kingdom"],
  partySize: planckMegaDisneyTripParty.length,
  dayCount: planckMegaDisneyTripSchedule.length,
  status: 'planning',
  themeId: 'secondary',
};
