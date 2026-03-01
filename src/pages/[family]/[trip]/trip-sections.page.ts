import type { TripSection } from '../../../lib/trips/types';

export interface TripSectionPageCopy {
  section: TripSection;
  pageLabel: string;
  title: string;
  intro: string;
}

export const tripSectionPages: Record<TripSection, TripSectionPageCopy> = {
  overview: {
    section: 'overview',
    pageLabel: 'Overview',
    title: 'Trip overview',
    intro:
      'Start here for the dates, park lineup, top family picks, and the fastest routes into the full planner.',
  },
  attractions: {
    section: 'attractions',
    pageLabel: 'Attractions',
    title: 'Ride picks',
    intro:
      'See the strongest group picks first, then open the full matrix when you need every rating.',
  },
  schedule: {
    section: 'schedule',
    pageLabel: 'Schedule',
    title: 'Day-by-day plan',
    intro:
      'Travel, park, and resort days in a quick scan up top, with the full itinerary ready just below.',
  },
  party: {
    section: 'party',
    pageLabel: 'Party',
    title: 'Traveler preferences',
    intro:
      'Start with the group pressure points, then open every traveler card when you need the full breakdown.',
  },
};
