import type { TripDataModule } from '../../../lib/trips/types';
import { planckMegaDisneyTripAttractions } from './attractions';
import { planckMegaDisneyTripGuide } from './guide';
import { planckMegaDisneyTripLLInventory } from './ll-inventory';
import { planckMegaDisneyTripLLDefaultPlan } from './ll-selections';
import { planckMegaDisneyTripParty } from './party';
import { planckMegaDisneyTripSchedule } from './schedule';
import { planckMegaDisneyTripSummary } from './summary';

export const planckMegaDisneyTripData: TripDataModule = {
  summary: planckMegaDisneyTripSummary,
  party: planckMegaDisneyTripParty,
  schedule: planckMegaDisneyTripSchedule,
  attractions: planckMegaDisneyTripAttractions,
  sectionConfig: [
    { label: 'Plan', section: 'schedule' },
    { label: 'LL', section: 'll' },
    { label: 'Rides', section: 'guide' },
  ],
  llInventory: planckMegaDisneyTripLLInventory,
  llDefaultPlan: planckMegaDisneyTripLLDefaultPlan,
  llPolicy: {
    heightRestrictionsMatter: false,
  },
  guide: planckMegaDisneyTripGuide,
};
