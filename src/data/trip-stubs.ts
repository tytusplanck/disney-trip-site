import type { TripSection, TripStatus, TripStubPage } from '../lib/trips/types';

export interface TripStubStatusCopy {
  eyebrow: string;
  body: string;
}

export const tripStubPages: Record<TripSection, TripStubPage> = {
  attractions: {
    title: 'Ride picks',
    calloutTitle: 'Attraction planner reserved',
    calloutBody:
      'The route is ready now so the planner can open straight into full rankings, traveler scans, and the full matrix.',
    checklist: [
      'Preference heatmap table',
      'Consensus ranking bars',
      'Per-attraction detail drawer',
    ],
  },
  schedule: {
    title: 'Day-by-day plan',
    calloutTitle: 'Schedule layout held',
    calloutBody:
      'The route and navigation are already in place so the full itinerary can slot into the shared shell next.',
    checklist: ['Day tabs', 'Session groupings', 'Event rows and tags'],
  },
  party: {
    title: 'Traveler preferences',
    calloutTitle: 'Party components queued',
    calloutBody:
      'This placeholder keeps the protected route tree complete so the planner can link straight into a ready-made party section later.',
    checklist: ['Summary stat row', 'Party cards', 'Preference distribution bars'],
  },
};

export const planningStubStatus: TripStubStatusCopy = {
  eyebrow: 'Phase 02',
  body: 'This protected route is live now so the All Trips page, breadcrumb, tabs, and stat bar can be exercised end to end.',
};

export const upcomingStubStatus: TripStubStatusCopy = {
  eyebrow: 'Planning Window',
  body: 'Each section stays in placeholder mode until that part of the trip data is ready for real page content.',
};

export function getTripStubStatusCopy(status: TripStatus): TripStubStatusCopy {
  return status === 'upcoming' ? upcomingStubStatus : planningStubStatus;
}
