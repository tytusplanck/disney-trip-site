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

interface AllTripsSectionsCopy {
  planningLabel: string;
  upcomingLabel: string;
  completedLabel: string;
  completedEmptyState: string;
}

export interface AllTripsCardCopy {
  primaryActionLabelByStatus: Record<TripStatus, string>;
  supportingCopyByStatus: Record<TripStatus, string>;
}

export interface AllTripsCardPresentation {
  primaryActionLabel: string;
  supportingCopy: string;
}

export function getAllTripsCardPresentation(
  copy: AllTripsCardCopy,
  status: TripStatus,
): AllTripsCardPresentation {
  return {
    primaryActionLabel: copy.primaryActionLabelByStatus[status],
    supportingCopy: copy.supportingCopyByStatus[status],
  };
}

export interface AllTripsPage {
  meta: MetaContent;
  headerMetaLabel: string;
  intro: AllTripsIntroCopy;
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
    title: 'Your trips',
    body: '',
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
    supportingCopyByStatus: {
      planning: 'The live planning trip stays focused here while decisions are still moving.',
      upcoming: 'This trip will open up once the core itinerary and ride list are ready.',
      completed: 'Finished planning snapshots will stay here after the trip wraps.',
    },
  },
  footerNote: 'Private planner. Built for fast Disney decisions.',
};
