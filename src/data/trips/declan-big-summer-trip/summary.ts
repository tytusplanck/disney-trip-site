import type { TripSummary } from '../../../lib/trips/types';
import { declanBigSummerTripParty } from './party';
import { declanBigSummerTripSchedule } from './schedule';

export const declanBigSummerTripSummary: TripSummary = {
  slug: 'declan-big-summer-trip',
  title: "Declan's Big Summer Trip",
  dateLabel: 'Jul 7 - Jul 10, 2026',
  parkLabels: ["Disney's Animal Kingdom", 'EPCOT', 'Magic Kingdom', "Disney's Hollywood Studios"],
  partySize: declanBigSummerTripParty.length,
  dayCount: declanBigSummerTripSchedule.length,
  attractionCount: null,
  status: 'planning',
  topPick: null,
  themeId: 'secondary',
};
