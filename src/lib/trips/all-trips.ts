import type {
  AllTripsSection,
  TripDataModule,
  TripSection,
  TripSectionTab,
  TripStatus,
  TripSummary,
} from './types';

const SECTION_ORDER: TripStatus[] = ['planning', 'upcoming', 'completed'];
const VALID_TRIP_SECTIONS = new Set<TripSection>([
  'attractions',
  'schedule',
  'party',
  'll',
  'guide',
  'travelers',
  'logistics',
]);

export const DEFAULT_SECTION_CONFIG: TripSectionTab[] = [
  { label: 'Rides', section: 'attractions' },
  { label: 'Plan', section: 'schedule' },
  { label: 'Party', section: 'party' },
  { label: 'LL', section: 'll' },
];

export function getTripSectionConfig(tripModule: TripDataModule): TripSectionTab[] {
  return tripModule.sectionConfig ?? DEFAULT_SECTION_CONFIG;
}

export interface TripRouteContext {
  trip: TripSummary;
  tripModule: TripDataModule;
  sectionConfig: TripSectionTab[];
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

export function findTripSummary(trips: TripSummary[], tripSlug: string): TripSummary | undefined {
  return trips.find((trip) => trip.slug === tripSlug);
}

export function findTripDataModule(
  modules: TripDataModule[],
  tripSlug: string,
): TripDataModule | undefined {
  return modules.find((module) => module.summary.slug === tripSlug);
}

export function getTripRouteContext(
  trips: TripSummary[],
  modules: TripDataModule[],
  tripSlug: string,
): TripRouteContext | null {
  const trip = findTripSummary(trips, tripSlug);
  const tripModule = findTripDataModule(modules, tripSlug);

  if (!trip || !tripModule) return null;

  return { trip, tripModule, sectionConfig: getTripSectionConfig(tripModule) };
}

export function getTripSectionPath(trip: Pick<TripSummary, 'slug'>, section: TripSection): string {
  return `${getTripBasePath(trip)}/${section}`;
}

export function getTripLandingPath(
  trip: Pick<TripSummary, 'slug'>,
  tripModule?: TripDataModule,
): string {
  const config = tripModule ? getTripSectionConfig(tripModule) : DEFAULT_SECTION_CONFIG;
  const firstSection = config[0]?.section ?? 'attractions';
  return getTripSectionPath(trip, firstSection);
}

export function getTripBasePath(trip: Pick<TripSummary, 'slug'>): string {
  return `/${trip.slug}`;
}

export function getLegacyTripRedirectPath(
  modules: TripDataModule[],
  familySlug: string,
  tripSlug: string,
  section?: string,
): string | null {
  const tripModule = modules.find((module) =>
    module.summary.legacyRoutes?.some(
      (route) => route.familySlug === familySlug && route.tripSlug === tripSlug,
    ),
  );

  if (!tripModule) return null;

  if (section && !VALID_TRIP_SECTIONS.has(section as TripSection)) {
    return null;
  }

  return section
    ? getTripSectionPath(tripModule.summary, section as TripSection)
    : getTripLandingPath(tripModule.summary, tripModule);
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
