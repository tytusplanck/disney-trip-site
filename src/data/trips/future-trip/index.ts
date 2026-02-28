import type { TripDataModule } from '../../../lib/trips/types';
import { futureTripAttractions } from './attractions';
import { futureTripParty } from './party';
import { futureTripSchedule } from './schedule';
import { futureTripSummary } from './summary';

export const futureTripData: TripDataModule = {
  summary: futureTripSummary,
  party: futureTripParty,
  schedule: futureTripSchedule,
  attractions: futureTripAttractions,
};
