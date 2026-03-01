import { describe, expect, it } from 'vitest';
import { allTripsData } from '../../data/all-trips';
import {
  findTripSummary,
  findTripDataModule,
  getAllTripsSections,
  getAllTripsStats,
  getTripBarStats,
  getTripBasePath,
  getTripLandingPath,
  getTripMobileFacts,
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

  it('derives the All Trips stat strip from the next planning trip', () => {
    expect(getAllTripsStats(allTripsData.trips)).toEqual({
      totalTrips: '2',
      planningTrips: '1',
      ridesScouted: '87',
      nextTripPeople: '10',
      nextTripParks: '4',
    });
  });

  it('routes both planning and upcoming trips to the trip overview page', () => {
    const planningTrip = findTripSummary(allTripsData.trips, 'casschwlanck', '2026');
    const upcomingTrip = findTripSummary(allTripsData.trips, 'casschwlanck', 'future-trip');

    expect(planningTrip).toBeDefined();
    expect(upcomingTrip).toBeDefined();

    if (!planningTrip || !upcomingTrip) {
      throw new Error('Expected seeded planning and upcoming trips to exist.');
    }

    expect(getTripLandingPath(planningTrip)).toBe('/casschwlanck/2026');
    expect(getTripLandingPath(upcomingTrip)).toBe('/casschwlanck/future-trip');
  });

  it('finds trip modules and derives shared trip chrome stats', () => {
    const planningTrip = findTripSummary(allTripsData.trips, 'casschwlanck', '2026');
    const upcomingTrip = findTripSummary(allTripsData.trips, 'casschwlanck', 'future-trip');
    const planningModule = findTripDataModule(allTripsData.modules, 'casschwlanck', '2026');

    expect(planningModule?.summary.id).toBe('2026');
    expect(findTripDataModule(allTripsData.modules, 'missing', 'trip')).toBeUndefined();

    if (!planningTrip || !upcomingTrip) {
      throw new Error('Expected seeded trips to exist.');
    }

    expect(upcomingTrip.dateLabel).toBe('Nov 7 - Nov 15, 2026');
    expect(getTripBasePath(planningTrip)).toBe('/casschwlanck/2026');
    expect(getTripBarStats(upcomingTrip)).toEqual([
      { label: 'People', value: '14' },
      { label: 'Days', value: '9' },
      { label: 'Attractions', value: '--' },
      { label: 'Parks', value: '4' },
    ]);
  });

  it('builds the mobile facts list with dates first', () => {
    const planningTrip = findTripSummary(allTripsData.trips, 'casschwlanck', '2026');

    if (!planningTrip) {
      throw new Error('Expected seeded planning trip to exist.');
    }

    expect(getTripMobileFacts(planningTrip)).toEqual([
      { label: 'Dates', value: 'Mar 28 - Apr 5, 2026' },
      { label: 'People', value: '10' },
      { label: 'Days', value: '9' },
      { label: 'Attractions', value: '87' },
      { label: 'Parks', value: '4' },
    ]);
  });
});
