import type { TripDataModule } from '../../../lib/trips/types';
import { planckMegaDisneyTripAttractions } from './attractions';
import { planckMegaDisneyTripGuide } from './guide';
import { planckMegaDisneyTripLogistics } from './logistics';
import { planckMegaDisneyTripParty } from './party';
import { planckMegaDisneyTripSchedule } from './schedule';
import { planckMegaDisneyTripSummary } from './summary';
import { planckMegaDisneyTripTravelerProfiles } from './traveler-profiles';

export const planckMegaDisneyTripData: TripDataModule = {
  summary: planckMegaDisneyTripSummary,
  party: planckMegaDisneyTripParty,
  schedule: planckMegaDisneyTripSchedule,
  attractions: planckMegaDisneyTripAttractions,
  sectionConfig: [
    { label: 'Attractions', section: 'guide' },
    { label: 'Schedule', section: 'schedule' },
    { label: 'Party', section: 'travelers' },
    { label: 'LL Picks', section: 'll' },
    { label: 'Logistics', section: 'logistics' },
  ],
  guide: planckMegaDisneyTripGuide,
  travelerProfiles: planckMegaDisneyTripTravelerProfiles,
  logistics: planckMegaDisneyTripLogistics,
};
