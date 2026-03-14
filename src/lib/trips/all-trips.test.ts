import { describe, expect, it } from 'vitest';
import { allTripsData } from '../../data/all-trips';
import type { TripSummary } from './types';
import {
  findTripDataModule,
  findTripSummary,
  getAllTripsSections,
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
      { status: 'completed', count: 0 },
    ]);

    expect(sections[0]?.trips[0]?.title).toBe('Casschwlanck 2026');
    expect(sections[1]?.trips[0]?.title).toBe('Planck Mega Disney trip');
    expect(sections[1]?.countLabel).toBe('1 trip');
    expect(sections[2]?.countLabel).toBe('0 trips');
  });

  it('routes both planning and upcoming trips to the first planner section', () => {
    const planningTrip = findTripSummary(allTripsData.trips, 'casschwlanck', '2026');
    const upcomingTrip = findTripSummary(allTripsData.trips, 'casschwlanck', 'future-trip');

    expect(planningTrip).toBeDefined();
    expect(upcomingTrip).toBeDefined();

    if (!planningTrip || !upcomingTrip) {
      throw new Error('Expected seeded planning and upcoming trips to exist.');
    }

    expect(getTripLandingPath(planningTrip)).toBe('/casschwlanck/2026/attractions');
    expect(getTripLandingPath(upcomingTrip)).toBe('/casschwlanck/future-trip/attractions');
    expect(getTripSectionPath(planningTrip, 'schedule')).toBe('/casschwlanck/2026/schedule');
  });

  it('finds trip modules and derives route context', () => {
    const planningTrip = findTripSummary(allTripsData.trips, 'casschwlanck', '2026');
    const planningModule = findTripDataModule(allTripsData.modules, 'casschwlanck', '2026');
    const routeContext = getTripRouteContext(
      allTripsData.trips,
      allTripsData.modules,
      'casschwlanck',
      '2026',
    );

    expect(planningModule?.summary.id).toBe('2026');
    expect(findTripDataModule(allTripsData.modules, 'missing', 'trip')).toBeUndefined();
    expect(routeContext?.trip.id).toBe('2026');
    expect(routeContext?.tripModule.summary.id).toBe('2026');

    if (!planningTrip) {
      throw new Error('Expected seeded planning trip to exist.');
    }

    expect(getTripBasePath(planningTrip)).toBe('/casschwlanck/2026');
  });

  it('builds the compact facts row used on the simplified trip cards', () => {
    const planningTrip = findTripSummary(allTripsData.trips, 'casschwlanck', '2026');
    const upcomingTrip = findTripSummary(allTripsData.trips, 'casschwlanck', 'future-trip');

    if (!planningTrip || !upcomingTrip) {
      throw new Error('Expected seeded planning and upcoming trips to exist.');
    }

    expect(getTripCompactFactsLine(planningTrip)).toBe('10 people • 9 days • 4 parks');
    expect(getTripCompactFactsLine(upcomingTrip)).toBe('14 people • 9 days • 4 parks');
  });

  it('uses TBD copy for missing compact fact values', () => {
    const draftTrip: TripSummary = {
      groupId: 'test',
      id: 'draft',
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
