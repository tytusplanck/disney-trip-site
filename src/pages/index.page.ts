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
  headerMetaLabel: 'All Trips',
  intro: {
    label: 'All Trips',
    title: 'Pick a trip.',
    body: "See the schedule, rides, and who's going.",
  },
  stats: {
    tripsLabel: 'Trips',
    planningTripsLabel: 'Planning Trips',
    ridesLabel: 'Rides Scouted',
    peopleLabel: 'People (next trip)',
    parksLabel: 'Parks (next trip)',
  },
  sections: {
    planningLabel: 'Next Up',
    upcomingLabel: 'Future Trips',
    completedLabel: 'Completed',
    completedEmptyState:
      'No completed trips yet - trip history will appear here after the first itinerary wraps.',
  },
  card: {
    primaryActionLabelByStatus: {
      planning: 'Open planner',
      upcoming: 'Open planner',
      completed: 'Open archive',
    },
    fallbackNoteByStatus: {
      planning:
        'Planner insights will appear here once the ride scores, itinerary, and traveler signals are loaded.',
      upcoming: 'Planner sections will open here once this trip starts taking shape.',
      completed: 'Archive notes and the final planner state will stay here once this trip wraps.',
    },
    shortcutLabel: 'Skip ahead',
    shortcutIntro: 'Already know what you need? Open a planner section directly.',
  },
  footerNote: 'I do it for fun. Relax.',
};
