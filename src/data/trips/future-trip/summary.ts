import type { TripSummary } from '../../../lib/trips/types';
import { futureTripParty } from './party';
import { futureTripSchedule } from './schedule';

export const futureTripSummary: TripSummary = {
  groupId: 'casschwlanck',
  id: 'future-trip',
  title: 'Planck Mega Disney trip',
  dateLabel: 'Nov 7 - Nov 15, 2026',
  parkLabels: ["Disney's Animal Kingdom", 'EPCOT', 'Magic Kingdom', "Disney's Hollywood Studios"],
  partySize: futureTripParty.length,
  dayCount: futureTripSchedule.length,
  attractionCount: null,
  status: 'upcoming',
  topPick: null,
  themeId: 'secondary',
};
