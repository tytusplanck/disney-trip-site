import type { TripDataModule } from '../../../lib/trips/types';
import { declanBigSummerTripAttractions } from './attractions';
import { declanBigSummerTripLLInventory } from './ll-inventory';
import { declanBigSummerTripLLDefaultPlan } from './ll-selections';
import { declanBigSummerTripParty } from './party';
import { declanBigSummerTripSchedule } from './schedule';
import { declanBigSummerTripSummary } from './summary';

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
};
