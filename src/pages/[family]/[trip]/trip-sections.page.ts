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
    title: 'Choose where to explore next',
    intro:
      'Pick one section below to open the part of the trip you want. Start with Attractions for the quickest look at what the group cares about most.',
  },
  attractions: {
    section: 'attractions',
    pageLabel: 'Attractions',
    title: 'Ride picks',
    intro:
      'Start with the scoring guide, then drill into park day, area, traveler, and full-matrix filters when it is time to make ride calls.',
  },
  schedule: {
    section: 'schedule',
    pageLabel: 'Schedule',
    title: 'Day-by-day plan',
    intro: 'Go straight to the full itinerary when you need every day card, note, and park label.',
  },
  party: {
    section: 'party',
    pageLabel: 'Party',
    title: 'Traveler preferences',
    intro:
      'Start with the kid-versus-adult split to see where the plan diverges, then open every traveler card when you need the full breakdown.',
  },
};
