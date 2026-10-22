import type { TripSection, TripStatus, TripStubPage } from '../lib/trips/types';

interface TripStubStatusCopy {
  eyebrow: string;
  body: string;
}

export const tripStubPages: Record<TripSection, TripStubPage> = {
  attractions: {
    calloutTitle: 'Ride picks are coming',
    calloutBody: 'Rankings will show up here once everyone has rated the rides.',
    checklist: ['Group ride rankings', 'Filters by day and park', 'Picks for each traveler'],
  },
  schedule: {
    calloutTitle: 'The plan is coming',
    calloutBody: 'The full itinerary will show up here once the days are booked.',
    checklist: ['Each day at a glance', 'Park and travel days', 'Dining and show times'],
  },
  party: {
    calloutTitle: 'Group preferences are coming',
    calloutBody: 'You can compare preferences here once everyone has rated the rides.',
    checklist: ['Traveler groups', 'Biggest group splits', "Each traveler's totals"],
  },
  ll: {
    calloutTitle: 'Lightning Lane picks are coming',
    calloutBody: 'You can plan Lightning Lanes here once the park days are set.',
    checklist: ['Picks for each park day', 'Estimated prices', 'Shareable plan links'],
  },
  guide: {
    calloutTitle: 'The ride guide is coming',
    calloutBody: "Tytus' ride notes will show up here once they're written.",
    checklist: ['Rides grouped by park', 'Top picks', 'Notes on each ride'],
  },
  packing: {
    calloutTitle: 'Packing lists are coming',
    calloutBody: 'Packing lists will show up here once recommendations are added.',
    checklist: ['Adult essentials', 'Kids extras', 'Trip-specific notes'],
  },
};

const planningStubStatus: TripStubStatusCopy = {
  eyebrow: 'Planning in progress',
  body: 'This part of the trip is still being planned.',
};

const upcomingStubStatus: TripStubStatusCopy = {
  eyebrow: 'Waiting on trip details',
  body: 'This part of the trip is waiting on final details.',
};

export function getTripStubStatusCopy(status: TripStatus): TripStubStatusCopy {
  return status === 'upcoming' ? upcomingStubStatus : planningStubStatus;
}
