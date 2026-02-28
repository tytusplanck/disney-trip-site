import { describe, expect, it } from 'vitest';
import { tripArchiveData } from '../../data/trip-archive';
import {
  findArchiveTrip,
  findTripDataModule,
  getArchiveSections,
  getArchiveStats,
  getTripBarStats,
  getTripBasePath,
  getTripLandingPath,
} from './archive';

describe('archive helpers', () => {
  it('groups trips by status in planning, upcoming, completed order', () => {
    const sections = getArchiveSections(tripArchiveData.trips);

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
    expect(sections[1]?.countLabel).toBe('1 trip');
    expect(sections[2]?.countLabel).toBe('0 trips');
  });

  it('derives the archive stat strip from the next planning trip', () => {
    expect(getArchiveStats(tripArchiveData.trips)).toEqual({
      totalTrips: '2',
      planningTrips: '1',
      ridesScouted: '87',
      nextTripPeople: '10',
      nextTripParks: '4',
    });
  });

  it('redirects planning trips to attractions and leaves upcoming trips on the stub route', () => {
    const planningTrip = findArchiveTrip(tripArchiveData.trips, 'casschwlanck', '2026');
    const upcomingTrip = findArchiveTrip(tripArchiveData.trips, 'casschwlanck', 'future-trip');

    expect(planningTrip).toBeDefined();
    expect(upcomingTrip).toBeDefined();

    if (!planningTrip || !upcomingTrip) {
      throw new Error('Expected seeded planning and upcoming trips to exist.');
    }

    expect(getTripLandingPath(planningTrip)).toBe('/casschwlanck/2026/attractions');
    expect(getTripLandingPath(upcomingTrip)).toBeNull();
  });

  it('finds trip modules and derives shared trip chrome stats', () => {
    const planningTrip = findArchiveTrip(tripArchiveData.trips, 'casschwlanck', '2026');
    const upcomingTrip = findArchiveTrip(tripArchiveData.trips, 'casschwlanck', 'future-trip');
    const planningModule = findTripDataModule(tripArchiveData.modules, 'casschwlanck', '2026');

    expect(planningModule?.summary.id).toBe('2026');
    expect(findTripDataModule(tripArchiveData.modules, 'missing', 'trip')).toBeUndefined();

    if (!planningTrip || !upcomingTrip) {
      throw new Error('Expected seeded trips to exist.');
    }

    expect(getTripBasePath(planningTrip)).toBe('/casschwlanck/2026');
    expect(getTripBarStats(upcomingTrip)).toEqual([
      { label: 'People', value: '--' },
      { label: 'Days', value: '--' },
      { label: 'Attractions', value: '--' },
      { label: 'Parks', value: '--' },
    ]);
  });
});
