import type { TripSection, TripStubPage } from '../lib/trips/types';

export interface TripStubStatusCopy {
  eyebrow: string;
  title: string;
  body: string;
}

export const tripStubPages: Record<TripSection, TripStubPage> = {
  attractions: {
    section: 'attractions',
    pageLabel: '01 - Preference Data',
    title: 'Attractions board',
    intro: 'Heatmaps, rankings, and ride consensus components land here in the next build.',
    calloutTitle: 'Attraction scaffolding reserved',
    calloutBody:
      'This route now proves the protected shell, tabs, and stat strip without committing to the full attraction model yet.',
    checklist: [
      'Preference heatmap table',
      'Consensus ranking bars',
      'Per-attraction detail drawer',
    ],
  },
  schedule: {
    section: 'schedule',
    pageLabel: '02 - Day by Day',
    title: 'Daily schedule',
    intro: 'Day tabs, session groupings, and event tagging arrive in the next implementation pass.',
    calloutTitle: 'Schedule layout held',
    calloutBody:
      'The route and navigation are in place so the real day-by-day planner can be dropped into the shared shell next.',
    checklist: ['Day tabs', 'Session groupings', 'Event rows and tags'],
  },
  party: {
    section: 'party',
    pageLabel: '03 - The Party',
    title: 'Party overview',
    intro: 'Rider summaries, preference mixes, and party cards are staged for the next phase.',
    calloutTitle: 'Party components queued',
    calloutBody:
      'This placeholder keeps the protected route tree complete while the reusable party summaries and cards are still pending.',
    checklist: ['Summary stat row', 'Party cards', 'Preference distribution bars'],
  },
};

export const planningStubStatus: TripStubStatusCopy = {
  eyebrow: 'Phase 02',
  title: 'Component route reserved',
  body: 'This protected route is live now so the archive, breadcrumb, tabs, and stat bar can be exercised end to end.',
};

export const upcomingStubStatus: TripStubStatusCopy = {
  eyebrow: 'Planning Window',
  title: 'Planning begins soon',
  body: 'The trip stays in placeholder mode until dates, parks, and party details are ready for real page content.',
};
