import type { TripSection } from '../../lib/trips/types';

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
  ll: {
    title: 'Lightning Lane Picks',
    summary:
      'Build a plan for each park day with historic per-person projections; Disney shows the final dynamic prices in the app.',
  },
  guide: {
    title: 'Ride guide',
    summary: "Tytus' top picks by park with notes on why each ride matters for the group.",
  },
  travelers: {
    title: 'Traveler notes',
    summary: "Quick notes on each traveler's priorities and what to know for the trip.",
  },
  logistics: {
    title: 'Logistics',
    summary: 'Dining reservations, resort details, transport plans, and everything the family needs.',
  },
};
