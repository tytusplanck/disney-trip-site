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
      'Start with the trip-wide signal, then drill into park day, area, traveler, and full-matrix filters when it is time to make ride calls.',
  },
  schedule: {
    section: 'schedule',
    pageLabel: 'Schedule',
    title: 'Day-by-day plan',
    intro:
      'Start with the trip rhythm and park lineup, then open the full itinerary when you need every day card.',
  },
  party: {
    section: 'party',
    pageLabel: 'Party',
    title: 'Traveler preferences',
    intro:
      'Start with the kid-versus-adult split to see where the plan diverges, then open every traveler card when you need the full breakdown.',
  },
};
