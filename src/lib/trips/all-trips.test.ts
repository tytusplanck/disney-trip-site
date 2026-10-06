import { describe, expect, it } from 'vitest';
import { allTripsData } from '../../data/all-trips';
import type { TripSummary } from './types';
import {
  findTripDataModule,
  findTripSummary,
  getAllTripsSections,
  getLegacyTripRedirectPath,
  getTripBasePath,
  getTripCompactFactsLine,
  getTripLandingPath,
  getTripRouteContext,
  getTripSectionPath,
} from './all-trips';

describe('all trips helpers', () => {
  it('groups trips by status in planning, upcoming, completed order', () => {
    const sections = getAllTripsSections(allTripsData.trips);

    expect(
      sections.map((section) => ({
        status: section.status,
        count: section.tripCount,
      })),
    ).toEqual([
      { status: 'planning', count: 1 },
      { status: 'upcoming', count: 1 },
      { status: 'completed', count: 3 },
    ]);

    expect(sections[0]?.trips.map((trip) => trip.title)).toEqual(['Planck Mega Disney trip']);
    expect(sections[0]?.countLabel).toBe('1 trip');
    expect(sections[1]?.trips.map((trip) => trip.title)).toEqual([
      'Secret Planck / Osborne Janurary Trip',
    ]);
    expect(sections[1]?.countLabel).toBe('1 trip');
    expect(sections[2]?.trips.map((trip) => trip.title)).toEqual([
      'Osborne Fall Family Trip',
      'Casschwlanck 2026',
      "Declan's Big Summer Trip",
    ]);
    expect(sections[2]?.countLabel).toBe('3 trips');
  });

  it('registers the secret January trip with a working placeholder landing route', () => {
    const trip = findTripSummary(allTripsData.trips, 'secret-planck-osborne-january-trip');
    const module = findTripDataModule(allTripsData.modules, 'secret-planck-osborne-january-trip');

    expect(trip).toMatchObject({
      title: 'Secret Planck / Osborne Janurary Trip',
      status: 'upcoming',
      dateLabel: 'January • Dates TBD',
      partySize: null,
      dayCount: null,
      parkLabels: [],
    });
    expect(module).toBeDefined();
    if (!trip || !module) throw new Error('Expected the secret January trip to be registered.');
    expect(getTripLandingPath(trip, module)).toBe('/secret-planck-osborne-january-trip/schedule');
    expect(module.schedule).toEqual([]);
  });

  it('routes trips to canonical single-slug planner sections', () => {
    const archivedTrip = findTripSummary(allTripsData.trips, 'casschwlanck-2026');
    const planningTrip = findTripSummary(allTripsData.trips, 'planck-mega-disney-trip');
    const archivedModule = findTripDataModule(allTripsData.modules, 'casschwlanck-2026');
    const planningModule = findTripDataModule(allTripsData.modules, 'planck-mega-disney-trip');

    expect(archivedTrip).toBeDefined();
    expect(planningTrip).toBeDefined();

    if (!archivedTrip || !planningTrip) {
      throw new Error('Expected seeded archived and planning trips to exist.');
    }

    expect(getTripLandingPath(archivedTrip, archivedModule)).toBe('/casschwlanck-2026/attractions');
    expect(getTripLandingPath(planningTrip, planningModule)).toBe(
      '/planck-mega-disney-trip/schedule',
    );
    expect(getTripSectionPath(archivedTrip, 'schedule')).toBe('/casschwlanck-2026/schedule');
  });

  it('finds trip modules and derives route context', () => {
    const planningTrip = findTripSummary(allTripsData.trips, 'planck-mega-disney-trip');
    const planningModule = findTripDataModule(allTripsData.modules, 'planck-mega-disney-trip');
    const declanTrip = findTripSummary(allTripsData.trips, 'declan-big-summer-trip');
    const declanModule = findTripDataModule(allTripsData.modules, 'declan-big-summer-trip');
    const routeContext = getTripRouteContext(
      allTripsData.trips,
      allTripsData.modules,
      'planck-mega-disney-trip',
    );
    const declanRouteContext = getTripRouteContext(
      allTripsData.trips,
      allTripsData.modules,
      'declan-big-summer-trip',
    );

    expect(planningModule?.summary.slug).toBe('planck-mega-disney-trip');
    expect(declanTrip?.title).toBe("Declan's Big Summer Trip");
    expect(declanModule?.summary.slug).toBe('declan-big-summer-trip');
    expect(getTripLandingPath(declanTrip ?? { slug: 'declan-big-summer-trip' }, declanModule)).toBe(
      '/declan-big-summer-trip/schedule',
    );
    expect(findTripDataModule(allTripsData.modules, 'missing-trip')).toBeUndefined();
    expect(routeContext?.trip.slug).toBe('planck-mega-disney-trip');
    expect(routeContext?.tripModule.summary.slug).toBe('planck-mega-disney-trip');
    expect(routeContext?.sectionConfig.map((tab) => tab.label)).toEqual([
      'Plan',
      'Packing',
      'LL',
      'Rides',
    ]);
    expect(routeContext?.sectionConfig.map((tab) => tab.section)).toEqual([
      'schedule',
      'packing',
      'll',
      'guide',
    ]);
    expect(planningModule?.travelerProfiles).toBeUndefined();
    expect(planningModule?.logistics).toBeUndefined();
    expect(declanRouteContext?.sectionConfig.map((tab) => tab.label)).toEqual(['Plan', 'LL']);
    expect(declanRouteContext?.sectionConfig.map((tab) => tab.section)).toEqual(['schedule', 'll']);

    if (!planningTrip) {
      throw new Error('Expected seeded planning trip to exist.');
    }

    expect(getTripBasePath(planningTrip)).toBe('/planck-mega-disney-trip');
  });

  it('maps legacy two-segment routes to canonical trip paths', () => {
    expect(getLegacyTripRedirectPath(allTripsData.modules, 'casschwlanck', '2026')).toBe(
      '/casschwlanck-2026/attractions',
    );
    expect(
      getLegacyTripRedirectPath(allTripsData.modules, 'casschwlanck', 'future-trip', 'guide'),
    ).toBe('/planck-mega-disney-trip/guide');
    expect(getLegacyTripRedirectPath(allTripsData.modules, 'missing', 'trip')).toBeNull();
  });

  it('builds the compact facts row used on the simplified trip cards', () => {
    const archivedTrip = findTripSummary(allTripsData.trips, 'casschwlanck-2026');
    const planningTrip = findTripSummary(allTripsData.trips, 'planck-mega-disney-trip');

    if (!archivedTrip || !planningTrip) {
      throw new Error('Expected seeded archived and planning trips to exist.');
    }

    expect(getTripCompactFactsLine(archivedTrip)).toBe('10 people • 9 days • 4 parks');
    expect(getTripCompactFactsLine(planningTrip)).toBe('14 people • 9 days • 4 parks');
  });

  it('uses TBD copy for missing compact fact values', () => {
    const draftTrip: TripSummary = {
      slug: 'draft',
      title: 'Draft Trip',
      dateLabel: 'Dates TBD',
      parkLabels: [],
      partySize: null,
      dayCount: null,
      attractionCount: null,
      status: 'planning',
      topPick: null,
      themeId: 'primary',
    };

    expect(getTripCompactFactsLine(draftTrip)).toBe('Party TBD • Length TBD • Parks TBD');
  });
});
