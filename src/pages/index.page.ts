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
  primaryActionLabel: string;
  shortcutLabel: string;
  shortcutIntro: string;
  futureNote: string;
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
    description:
      'Protected Disney trip collection with calm overview pages and one-tap access to the full planner.',
  },
  headerMetaLabel: 'All Trips',
  intro: {
    label: 'All Trips',
    title: 'Choose a trip, then start with the overview.',
    body: 'The overview is the default first stop for dates, park lineup, and top family picks before anyone dives into the full planner.',
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
    primaryActionLabel: 'Start with overview',
    shortcutLabel: 'Skip ahead',
    shortcutIntro: 'Already know what you need? Open a planner section directly.',
    futureNote: 'Planning will open here first once this trip starts taking shape.',
  },
  footerNote:
    'Start with the overview for the essentials, then skip ahead into attractions, schedule, or party details when you need the full planner.',
};
