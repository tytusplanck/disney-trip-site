interface MetaContent {
  title: string;
  description: string;
}

interface ArchiveStatsCopy {
  tripsLabel: string;
  planningTripsLabel: string;
  ridesLabel: string;
  peopleLabel: string;
  parksLabel: string;
}

interface ArchiveSectionsCopy {
  planningLabel: string;
  upcomingLabel: string;
  completedLabel: string;
  completedEmptyState: string;
}

export interface ArchivePage {
  meta: MetaContent;
  headerMetaLabel: string;
  stats: ArchiveStatsCopy;
  sections: ArchiveSectionsCopy;
  footerNote: string;
}

export const archivePage: ArchivePage = {
  meta: {
    title: 'Disney Planned by Tytus',
    description:
      'Protected Disney trip archive with shared design system scaffolding and future trip routes.',
  },
  headerMetaLabel: 'All Trips',
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
      'No completed trips yet - archive history will appear here after the first itinerary wraps.',
  },
  footerNote:
    'Shared trip records live in typed data modules, while route-specific copy stays with the page that owns it.',
};
