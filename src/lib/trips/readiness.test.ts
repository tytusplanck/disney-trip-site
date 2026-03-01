import { describe, expect, it } from 'vitest';
import type { TripDataModule } from './types';
import { hasTripOverviewContent, hasTripSectionContent } from './readiness';

const emptyTripData: TripDataModule = {
  summary: {
    attractionCount: 0,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'casschwlanck',
    id: 'empty-test',
    parkLabels: [],
    partySize: 0,
    status: 'upcoming',
    themeId: 'secondary',
    title: 'Empty Test',
    topPick: null,
  },
  party: [],
  schedule: [],
  attractions: [],
};

const scheduleOnlyTripData: TripDataModule = {
  ...emptyTripData,
  schedule: [
    {
      date: '2026-11-07',
      kind: 'travel',
      label: 'Travel day',
      parkLabel: null,
      notes: null,
    },
  ],
};

describe('trip section readiness helpers', () => {
  it('keeps fully empty trips in placeholder mode', () => {
    expect(hasTripOverviewContent(emptyTripData)).toBe(false);
    expect(hasTripSectionContent(emptyTripData, 'overview')).toBe(false);
    expect(hasTripSectionContent(emptyTripData, 'schedule')).toBe(false);
    expect(hasTripSectionContent(emptyTripData, 'party')).toBe(false);
    expect(hasTripSectionContent(emptyTripData, 'attractions')).toBe(false);
  });

  it('unlocks overview content as soon as any planner data exists', () => {
    expect(hasTripOverviewContent(scheduleOnlyTripData)).toBe(true);
    expect(hasTripSectionContent(scheduleOnlyTripData, 'overview')).toBe(true);
  });

  it('keeps unrelated sections stubbed until their own data is loaded', () => {
    expect(hasTripSectionContent(scheduleOnlyTripData, 'schedule')).toBe(true);
    expect(hasTripSectionContent(scheduleOnlyTripData, 'party')).toBe(false);
    expect(hasTripSectionContent(scheduleOnlyTripData, 'attractions')).toBe(false);
  });
});
