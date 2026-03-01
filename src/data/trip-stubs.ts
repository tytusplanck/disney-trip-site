import type { TripSection, TripStubPage } from '../lib/trips/types';

export interface TripStubStatusCopy {
  eyebrow: string;
  title: string;
  body: string;
}

export const tripStubPages: Record<TripSection, TripStubPage> = {
  overview: {
    section: 'overview',
    pageLabel: 'Overview',
    title: 'Trip overview',
    intro: 'The trip overview will fill in here first as soon as the planning window opens.',
    calloutTitle: 'Overview space reserved',
    calloutBody:
      'This trip already has a protected home so the overview can become the calm entry point before the detailed planner fills in.',
    checklist: [
      'Trip dates and party size',
      'Park lineup snapshot',
      'Quick links into each planner section',
    ],
  },
  attractions: {
    section: 'attractions',
    pageLabel: 'Attractions',
    title: 'Ride picks',
    intro: 'Heatmaps, rankings, and ride preferences will land here once the planner opens.',
    calloutTitle: 'Attraction planner reserved',
    calloutBody:
      'The route is ready now so the overview can later hand off to full rankings, traveler scans, and the full matrix.',
    checklist: [
      'Preference heatmap table',
      'Consensus ranking bars',
      'Per-attraction detail drawer',
    ],
  },
  schedule: {
    section: 'schedule',
    pageLabel: 'Schedule',
    title: 'Day-by-day plan',
    intro: 'Daily timing, park days, and trip notes will land here once the trip is active.',
    calloutTitle: 'Schedule layout held',
    calloutBody:
      'The route and navigation are already in place so the full itinerary can slot into the shared shell next.',
    checklist: ['Day tabs', 'Session groupings', 'Event rows and tags'],
  },
  party: {
    section: 'party',
    pageLabel: 'Party',
    title: 'Traveler preferences',
    intro:
      'Rider summaries, preference mixes, and traveler cards will appear here when planning starts.',
    calloutTitle: 'Party components queued',
    calloutBody:
      'This placeholder keeps the protected route tree complete so the overview can point to a ready-made party section later.',
    checklist: ['Summary stat row', 'Party cards', 'Preference distribution bars'],
  },
};

export const planningStubStatus: TripStubStatusCopy = {
  eyebrow: 'Phase 02',
  title: 'Component route reserved',
  body: 'This protected route is live now so the All Trips page, breadcrumb, tabs, and stat bar can be exercised end to end.',
};

export const upcomingStubStatus: TripStubStatusCopy = {
  eyebrow: 'Planning Window',
  title: 'Planning begins soon',
  body: 'Each section stays in placeholder mode until that part of the trip data is ready for real page content.',
};
