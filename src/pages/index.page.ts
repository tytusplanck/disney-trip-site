import type { TripStatus } from '../lib/trips/types';

interface MetaContent {
  title: string;
  description: string;
}

interface AllTripsIntroCopy {
  label: string;
  title: string;
  body: string;
}

interface AllTripsStatsCopy {
  tripsLabel: string;
  planningTripsLabel: string;
  ridesLabel: string;
  peopleLabel: string;
  parksLabel: string;
}

interface AllTripsSectionsCopy {
  planningLabel: string;
  upcomingLabel: string;
  completedLabel: string;
  completedEmptyState: string;
}

export interface AllTripsCardCopy {
  primaryActionLabelByStatus: Record<TripStatus, string>;
  fallbackNoteByStatus: Record<TripStatus, string>;
  shortcutLabel: string;
  shortcutIntro: string;
}

export interface AllTripsCardPresentation {
  primaryActionLabel: string;
  fallbackNote: string;
  showShortcutLinks: boolean;
}

export function getAllTripsCardPresentation(
  copy: AllTripsCardCopy,
  status: TripStatus,
): AllTripsCardPresentation {
  return {
    primaryActionLabel: copy.primaryActionLabelByStatus[status],
    fallbackNote: copy.fallbackNoteByStatus[status],
    showShortcutLinks: status === 'planning',
  };
}

export interface AllTripsPage {
  meta: MetaContent;
  headerMetaLabel: string;
  intro: AllTripsIntroCopy;
  stats: AllTripsStatsCopy;
  sections: AllTripsSectionsCopy;
  card: AllTripsCardCopy;
  footerNote: string;
}

export const allTripsPage: AllTripsPage = {
  meta: {
    title: 'Disney Planned by Tytus',
    description: 'Protected Disney trip collection with one-tap access to the full planner.',
  },
  headerMetaLabel: 'Private trip archive',
  intro: {
    label: 'Private trip archive',
    title: 'Choose the trip that needs a decision.',
    body: 'Open the active planner, scan what is next, or revisit a finished trip.',
  },
  stats: {
    tripsLabel: 'Trips',
    planningTripsLabel: 'Active Planners',
    ridesLabel: 'Scored Rides',
    peopleLabel: 'People (next trip)',
    parksLabel: 'Parks (next trip)',
  },
  sections: {
    planningLabel: 'Planning Now',
    upcomingLabel: 'Coming Later',
    completedLabel: 'Archive',
    completedEmptyState:
      'No completed trips yet. Finished itineraries will land here once the first trip wraps.',
  },
  card: {
    primaryActionLabelByStatus: {
      planning: 'Open planner',
      upcoming: 'Preview trip',
      completed: 'Open archive',
    },
    fallbackNoteByStatus: {
      planning:
        'Ride priorities, itinerary, and traveler signals will stay concentrated here while the trip is active.',
      upcoming:
        'This trip will move into the live planner once the core itinerary and ride list are ready.',
      completed: 'The final planner state and archive notes stay here after the trip wraps.',
    },
    shortcutLabel: 'Jump to section',
    shortcutIntro: 'Need a specific slice? Open it directly.',
  },
  footerNote: 'Private planner. Built for fast Disney decisions.',
};
