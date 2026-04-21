import type { TripDataModule } from '../../../lib/trips/types';
import { declanBigSummerTripAttractions } from './attractions';
import { declanBigSummerTripGuide } from './guide';
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
    { label: 'Attractions', section: 'guide' },
    { label: 'Schedule', section: 'schedule' },
    { label: 'Party', section: 'travelers' },
    { label: 'LL Picks', section: 'll' },
  ],
  guide: declanBigSummerTripGuide,
  travelerProfiles: declanBigSummerTripTravelerProfiles,
};
