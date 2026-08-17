import type { TripSummary } from '../../../lib/trips/types';
import { osborneFallFamilyTripSchedule } from './schedule';

export const osborneFallFamilyTripSummary: TripSummary = {
  slug: 'osborne-fall-family-trip',
  title: 'Osborne Fall Family Trip',
  dateLabel: 'Sep 20 - Sep 26, 2026',
  parkLabels: ["Disney's Animal Kingdom", 'Magic Kingdom', 'EPCOT', "Disney's Hollywood Studios"],
  partySize: null,
  dayCount: osborneFallFamilyTripSchedule.length,
  attractionCount: null,
  status: 'planning',
  topPick: null,
  themeId: 'primary',
};
