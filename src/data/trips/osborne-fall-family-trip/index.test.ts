import { describe, expect, it } from 'vitest';
import { allTripsData } from '../../all-trips';
import { getTripLandingPath } from '../../../lib/trips/all-trips';
import {
  buildLLPlannerData,
  emptySelections,
  getMultiPassPriceEstimate,
  getParkDayInventory,
  getProjectedParkDayPriceEstimate,
  getSelectedSinglePassPriceEstimate,
} from '../../../lib/trips/ll-planner';
import { osborneFallFamilyTripData } from '.';

describe('Osborne Fall Family Trip data', () => {
  it('is an active LL-only trip with the requested park schedule', () => {
    expect(osborneFallFamilyTripData.summary).toMatchObject({
      slug: 'osborne-fall-family-trip',
      title: 'Osborne Fall Family Trip',
      dateLabel: 'Sep 20 - Sep 26, 2026',
      status: 'planning',
    });
    expect(osborneFallFamilyTripData.sectionConfig).toEqual([{ label: 'LL', section: 'll' }]);
    expect(osborneFallFamilyTripData.schedule.map((entry) => entry.date)).toEqual([
      '2026-09-20',
      '2026-09-21',
      '2026-09-22',
      '2026-09-23',
      '2026-09-24',
      '2026-09-25',
      '2026-09-26',
    ]);
    expect(
      osborneFallFamilyTripData.schedule
        .filter((entry) => entry.kind === 'park')
        .map((entry) => [entry.date, entry.parkLabel]),
    ).toEqual([
      ['2026-09-21', "Disney's Animal Kingdom"],
      ['2026-09-22', 'Magic Kingdom'],
      ['2026-09-23', 'EPCOT'],
      ['2026-09-24', 'Magic Kingdom'],
      ['2026-09-25', "Disney's Hollywood Studios"],
    ]);
  });

  it('lands on the LL picker and carries over the Planck picks by park', () => {
    expect(getTripLandingPath(osborneFallFamilyTripData.summary, osborneFallFamilyTripData)).toBe(
      '/osborne-fall-family-trip/ll',
    );
    expect(osborneFallFamilyTripData.llDefaultPlan).toEqual({
      memberId: 'tytus-planck',
      parkDays: {
        '2026-09-21': {
          illSelections: ['dak-avatar-flight-of-passage'],
          tier1Selection: null,
          tier2Selections: [],
          multiPassSelections: [
            'dak-expedition-everest-legend-of-the-forbidden-mountain',
            'dak-navi-river-journey',
            'dak-kilimanjaro-safaris',
          ],
        },
        '2026-09-22': {
          illSelections: ['mk-seven-dwarfs-mine-train', 'mk-tron-lightcycle-run'],
          tier1Selection: 'mk-big-thunder-mountain-railroad',
          tier2Selections: ['mk-haunted-mansion', 'mk-buzz-lightyears-space-ranger-spin'],
          multiPassSelections: [],
        },
        '2026-09-23': {
          illSelections: ['epcot-guardians-of-the-galaxy-cosmic-rewind'],
          tier1Selection: 'epcot-test-track',
          tier2Selections: ['epcot-soarin-around-the-world', 'epcot-living-with-the-land'],
          multiPassSelections: [],
        },
        '2026-09-24': {
          illSelections: ['mk-seven-dwarfs-mine-train', 'mk-tron-lightcycle-run'],
          tier1Selection: 'mk-big-thunder-mountain-railroad',
          tier2Selections: ['mk-haunted-mansion', 'mk-buzz-lightyears-space-ranger-spin'],
          multiPassSelections: [],
        },
        '2026-09-25': {
          illSelections: ['dhs-star-wars-rise-of-the-resistance'],
          tier1Selection: 'dhs-slinky-dog-dash',
          tier2Selections: ['dhs-toy-story-mania', 'dhs-the-twilight-zone-tower-of-terror'],
          multiPassSelections: [],
        },
      },
    });
  });

  it('uses same-date September price proxies for the default plan', () => {
    const plannerData = buildLLPlannerData(osborneFallFamilyTripData);
    const dayTotals = plannerData.parkDays.map((day) => {
      const inventory = getParkDayInventory(plannerData, day);
      const selections = plannerData.defaultPlan.parkDays[day.parkDate] ?? emptySelections();

      return {
        parkDate: day.parkDate,
        multiPass: getMultiPassPriceEstimate(inventory).estimatedPriceUsd,
        singlePass:
          getSelectedSinglePassPriceEstimate(selections, inventory)?.estimatedPriceUsd ?? 0,
        total: getProjectedParkDayPriceEstimate(selections, inventory)?.estimatedPriceUsd ?? 0,
      };
    });

    expect(dayTotals).toEqual([
      { parkDate: '2026-09-21', multiPass: 16, singlePass: 16, total: 32 },
      { parkDate: '2026-09-22', multiPass: 27, singlePass: 32, total: 59 },
      { parkDate: '2026-09-23', multiPass: 21, singlePass: 18, total: 39 },
      { parkDate: '2026-09-24', multiPass: 29, singlePass: 32, total: 61 },
      { parkDate: '2026-09-25', multiPass: 27, singlePass: 24, total: 51 },
    ]);
    expect(dayTotals.reduce((sum, day) => sum + day.total, 0)).toBe(242);
  });

  it('is registered in the all-trips data source', () => {
    expect(allTripsData.trips.some((trip) => trip.slug === 'osborne-fall-family-trip')).toBe(true);
    expect(
      allTripsData.modules.find((module) => module.summary.slug === 'osborne-fall-family-trip'),
    ).toBe(osborneFallFamilyTripData);
  });
});
