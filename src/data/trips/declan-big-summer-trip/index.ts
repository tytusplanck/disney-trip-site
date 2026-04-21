import type { TripDataModule } from '../../../lib/trips/types';
import { declanBigSummerTripAttractions } from './attractions';
import { declanBigSummerTripGuide } from './guide';
import { declanBigSummerTripLLInventory } from './ll-inventory';
import { declanBigSummerTripLLDefaultPlan } from './ll-selections';
import { declanBigSummerTripParty } from './party';
import { declanBigSummerTripSchedule } from './schedule';
import { declanBigSummerTripSummary } from './summary';
import { declanBigSummerTripTravelerProfiles } from './traveler-profiles';

export const declanBigSummerTripData: TripDataModule = {
  summary: declanBigSummerTripSummary,
  party: declanBigSummerTripParty,
  schedule: declanBigSummerTripSchedule,
  attractions: declanBigSummerTripAttractions,
  sectionConfig: [
    { label: 'Plan', section: 'schedule' },
    { label: 'LL', section: 'll' },
  ],
  llInventory: declanBigSummerTripLLInventory,
  llDefaultPlan: declanBigSummerTripLLDefaultPlan,
  llPolicy: {
    heightRestrictionsMatter: false,
  },
  guide: declanBigSummerTripGuide,
  travelerProfiles: declanBigSummerTripTravelerProfiles,
};
