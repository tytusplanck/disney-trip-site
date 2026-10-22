import type { TripPrintCopy } from '../../lib/trips/print';
import type { TripSection } from '../../lib/trips/types';

interface TripSectionCopy {
  title: string;
  summary: string;
  /** Present only on pages whose print layout has been checked; renders the Print / Save PDF button. */
  print?: TripPrintCopy;
}

export const tripSectionCopy: Record<TripSection, TripSectionCopy> = {
  attractions: {
    title: 'Ride picks',
    summary: 'Rank rides by shared support, then narrow to a day or traveler when a call is close.',
  },
  schedule: {
    title: 'Day-by-day plan',
    summary: 'Read the trip in one line from arrival to departure.',
    print: { buttonLabel: 'Print / Save PDF', documentTitle: 'Day-by-day plan' },
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
  packing: {
    title: 'Packing lists',
    summary: "Tytus' recommendations for your trip, tuned to the weather and the group's schedule.",
    print: { buttonLabel: 'Print / Save PDF', documentTitle: 'Packing list' },
  },
};
