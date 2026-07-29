import type { TripSummary } from '../../../lib/trips/types';
import { declanBigSummerTripParty } from './party';
import { declanBigSummerTripSchedule } from './schedule';

export const declanBigSummerTripSummary: TripSummary = {
  slug: 'declan-big-summer-trip',
  title: "Declan's Big Summer Trip",
  dateLabel: 'Jul 7 - Jul 10, 2026',
  parkLabels: ["Disney's Animal Kingdom", "Disney's Hollywood Studios", 'Magic Kingdom', 'EPCOT'],
  partySize: declanBigSummerTripParty.length,
  dayCount: declanBigSummerTripSchedule.length,
  attractionCount: null,
  status: 'completed',
  topPick: null,
  themeId: 'secondary',
};
