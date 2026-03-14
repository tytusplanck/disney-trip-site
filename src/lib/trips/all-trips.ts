import type {
  AllTripsSection,
  TripDataModule,
  TripSection,
  TripStatus,
  TripSummary,
} from './types';

const SECTION_ORDER: TripStatus[] = ['planning', 'upcoming', 'completed'];
const DEFAULT_TRIP_SECTION: TripSection = 'attractions';

export interface TripRouteContext {
  trip: TripSummary;
  tripModule: TripDataModule;
}

function formatCountLabel(count: number): string {
  return `${String(count)} ${count === 1 ? 'trip' : 'trips'}`;
}

function formatInlineMetric(
  value: number | null,
  singularLabel: string,
  pluralLabel: string,
  missingLabel: string,
): string {
  if (value === null) {
    return missingLabel;
  }

  const label = value === 1 ? singularLabel : pluralLabel;

  return `${String(value)} ${label}`;
}

export function getAllTripsSections(trips: TripSummary[]): AllTripsSection[] {
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

export function findTripSummary(
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

export function getTripRouteContext(
  trips: TripSummary[],
  modules: TripDataModule[],
  groupId: string,
  tripId: string,
): TripRouteContext | null {
  const trip = findTripSummary(trips, groupId, tripId);
  const tripModule = findTripDataModule(modules, groupId, tripId);

  return trip && tripModule ? { trip, tripModule } : null;
}

export function getTripSectionPath(
  trip: Pick<TripSummary, 'groupId' | 'id'>,
  section: TripSection,
): string {
  return `${getTripBasePath(trip)}/${section}`;
}

export function getTripLandingPath(trip: Pick<TripSummary, 'groupId' | 'id'>): string {
  return getTripSectionPath(trip, DEFAULT_TRIP_SECTION);
}

export function getTripBasePath(trip: Pick<TripSummary, 'groupId' | 'id'>): string {
  return `/${trip.groupId}/${trip.id}`;
}

export function getTripCompactFactsLine(trip: TripSummary): string {
  return [
    formatInlineMetric(trip.partySize, 'person', 'people', 'Party TBD'),
    formatInlineMetric(trip.dayCount, 'day', 'days', 'Length TBD'),
    trip.parkLabels.length > 0
      ? `${String(trip.parkLabels.length)} ${trip.parkLabels.length === 1 ? 'park' : 'parks'}`
      : 'Parks TBD',
  ].join(' • ');
}
