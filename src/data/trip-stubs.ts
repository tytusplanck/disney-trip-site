import type { TripSection, TripStatus, TripStubPage } from '../lib/trips/types';

export interface TripStubStatusCopy {
  eyebrow: string;
  body: string;
}

export const tripStubPages: Record<TripSection, TripStubPage> = {
  attractions: {
    title: 'Ride picks',
    calloutTitle: 'Attractions view is reserved',
    calloutBody:
      'The route is live so rankings, filters, and the traveler matrix can drop into the shared shell without reworking navigation.',
    checklist: ['Top recommendation stack', 'Consensus ranking board', 'Traveler matrix'],
  },
  schedule: {
    title: 'Day-by-day plan',
    calloutTitle: 'Schedule layout is held',
    calloutBody:
      'The route and navigation are already in place so the full itinerary can slot into the shared shell without a second layout pass.',
    checklist: ['Day timeline cards', 'Park and travel markers', 'Note and tag stack'],
  },
  party: {
    title: 'Traveler preferences',
    calloutTitle: 'Party view is queued',
    calloutBody:
      'This placeholder keeps the protected route tree complete so the planner can open straight into group alignment and traveler detail once the data is ready.',
    checklist: ['Cluster highlights', 'Traveler dossier cards', 'Preference distribution bars'],
  },
  ll: {
    title: 'Lightning Lane picks',
    calloutTitle: 'LL planner is queued',
    calloutBody:
      'The route is live so the Lightning Lane planner can drop into the shared shell once park inventory data is ready.',
    checklist: ['Per-park-day selections', 'Tier constraint enforcement', 'Shareable plan links'],
  },
  guide: {
    title: 'Ride guide',
    calloutTitle: 'Guide view is reserved',
    calloutBody:
      'The route is live so the curated ride guide can drop into the shared shell once attraction notes are written.',
    checklist: ['Park-grouped ride list', 'Priority labels', 'Written notes per attraction'],
  },
  travelers: {
    title: 'Traveler notes',
    calloutTitle: 'Traveler notes are queued',
    calloutBody:
      'The route is ready for per-person notes and priorities once those are written.',
    checklist: ['Per-person priority list', 'Written notes', 'Group awareness summary'],
  },
  logistics: {
    title: 'Trip logistics',
    calloutTitle: 'Logistics view is queued',
    calloutBody:
      'The route is ready for dining, resort, and transport details once those are entered.',
    checklist: ['Dining reservations', 'Resort details', 'Transport plans'],
  },
};

export const planningStubStatus: TripStubStatusCopy = {
  eyebrow: 'Planning in progress',
  body: 'This protected route is wired into the planner now so tabs, breadcrumbs, and shell behavior stay ready as real trip data lands.',
};

export const upcomingStubStatus: TripStubStatusCopy = {
  eyebrow: 'Waiting on trip details',
  body: 'Each section stays in preview mode until that part of the trip data is ready for live planner content.',
};

export function getTripStubStatusCopy(status: TripStatus): TripStubStatusCopy {
  return status === 'upcoming' ? upcomingStubStatus : planningStubStatus;
}
