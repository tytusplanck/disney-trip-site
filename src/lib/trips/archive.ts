import type {
  ArchiveSection,
  ArchiveStats,
  TripDataModule,
  TripBarStat,
  TripSection,
  TripStatus,
  TripSummary,
} from './types';

const SECTION_ORDER: TripStatus[] = ['planning', 'upcoming', 'completed'];
const MISSING_VALUE = '--';

function formatCountLabel(count: number): string {
  return `${String(count)} ${count === 1 ? 'trip' : 'trips'}`;
}

function formatMetricValue(value: number | null): string {
  return value === null ? MISSING_VALUE : String(value);
}

export function getArchiveSections(trips: TripSummary[]): ArchiveSection[] {
  return SECTION_ORDER.map((status) => {
    const sectionTrips = trips.filter((trip) => trip.status === status);

    return {
      status,
      tripCount: sectionTrips.length,
      countLabel: formatCountLabel(sectionTrips.length),
      trips: sectionTrips,
    };
  });
}

export function getArchiveStats(trips: TripSummary[]): ArchiveStats {
  const nextPlanningTrip = trips.find((trip) => trip.status === 'planning');

  return {
    totalTrips: String(trips.length),
    planningTrips: String(trips.filter((trip) => trip.status === 'planning').length),
    ridesScouted: formatMetricValue(nextPlanningTrip?.attractionCount ?? null),
    nextTripPeople: formatMetricValue(nextPlanningTrip?.partySize ?? null),
    nextTripParks: formatMetricValue(nextPlanningTrip?.parkLabels.length ?? null),
  };
}

export function findArchiveTrip(
  trips: TripSummary[],
  groupId: string,
  tripId: string,
): TripSummary | undefined {
  return trips.find((trip) => trip.groupId === groupId && trip.id === tripId);
}

export function findTripDataModule(
  modules: TripDataModule[],
  groupId: string,
  tripId: string,
): TripDataModule | undefined {
  return modules.find(
    (module) => module.summary.groupId === groupId && module.summary.id === tripId,
  );
}

export function getTripSectionPath(
  trip: Pick<TripSummary, 'groupId' | 'id'>,
  section: TripSection,
): string {
  return section === 'overview' ? getTripBasePath(trip) : `${getTripBasePath(trip)}/${section}`;
}

export function getTripLandingPath(trip: Pick<TripSummary, 'groupId' | 'id'>): string {
  return getTripBasePath(trip);
}

export function getTripBasePath(trip: Pick<TripSummary, 'groupId' | 'id'>): string {
  return `/${trip.groupId}/${trip.id}`;
}

export function getTripBarStats(trip: TripSummary): TripBarStat[] {
  return [
    { label: 'People', value: formatMetricValue(trip.partySize) },
    { label: 'Days', value: formatMetricValue(trip.dayCount) },
    { label: 'Attractions', value: formatMetricValue(trip.attractionCount) },
    { label: 'Parks', value: formatMetricValue(trip.parkLabels.length || null) },
  ];
}
