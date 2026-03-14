import type { TripSection } from '../../../lib/trips/types';

export const tripSectionCopy: Record<TripSection, { title: string; summary: string }> = {
  attractions: {
    title: 'Ride picks',
    summary: 'Rank rides by shared support, then narrow to a day or traveler when a call is close.',
  },
  schedule: {
    title: 'Day-by-day plan',
    summary: 'Read the trip in one line from arrival to departure.',
  },
  party: {
    title: 'Traveler preferences',
    summary: "See the biggest group splits first, then scan each traveler's totals below.",
  },
};
