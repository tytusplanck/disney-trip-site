import { describe, expect, it } from 'vitest';
import type { TripDataModule } from './types';
import { hasTripSectionContent } from './readiness';

const emptyTripData: TripDataModule = {
  summary: {
    attractionCount: 0,
    dateLabel: 'TBD',
    dayCount: 0,
    slug: 'empty-test',
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
    expect(hasTripSectionContent(emptyTripData, 'schedule')).toBe(false);
    expect(hasTripSectionContent(emptyTripData, 'party')).toBe(false);
    expect(hasTripSectionContent(emptyTripData, 'attractions')).toBe(false);
    expect(hasTripSectionContent(emptyTripData, 'guide')).toBe(false);
    expect(hasTripSectionContent(emptyTripData, 'travelers')).toBe(false);
    expect(hasTripSectionContent(emptyTripData, 'logistics')).toBe(false);
  });

  it('keeps unrelated sections stubbed until their own data is loaded', () => {
    expect(hasTripSectionContent(scheduleOnlyTripData, 'schedule')).toBe(true);
    expect(hasTripSectionContent(scheduleOnlyTripData, 'party')).toBe(false);
    expect(hasTripSectionContent(scheduleOnlyTripData, 'attractions')).toBe(false);
    expect(hasTripSectionContent(scheduleOnlyTripData, 'guide')).toBe(false);
    expect(hasTripSectionContent(scheduleOnlyTripData, 'travelers')).toBe(false);
    expect(hasTripSectionContent(scheduleOnlyTripData, 'logistics')).toBe(false);
  });

  it('reports informational sections as ready when data is populated', () => {
    const guideData = {
      ...emptyTripData,
      guide: [
        {
          id: 'test-ride',
          parkLabel: 'Magic Kingdom',
          areaLabel: 'Tomorrowland',
          attractionLabel: 'Space Mountain',
          priority: 'must-do' as const,
          notes: 'A classic.',
        },
      ],
      travelerProfiles: [
        {
          memberId: 'test-member',
          notes: 'Loves thrills.',
          priorities: ['Space Mountain'],
        },
      ],
      logistics: [
        {
          id: 'test-entry',
          kind: 'dining' as const,
          title: 'Dinner reservation',
          date: '2026-11-08',
          notes: 'At the restaurant.',
        },
      ],
    };

    expect(hasTripSectionContent(guideData, 'guide')).toBe(true);
    expect(hasTripSectionContent(guideData, 'travelers')).toBe(true);
    expect(hasTripSectionContent(guideData, 'logistics')).toBe(true);
  });

  it('treats Lightning Lane as ready when inventory data exists', () => {
    const llReadyTripData = {
      ...emptyTripData,
      llInventory: {
        'magic-kingdom': {
          parkId: 'magic-kingdom' as const,
          parkLabel: 'Magic Kingdom',
          hasTiers: true,
          maxTier1: 1,
          maxTier2: 2,
          maxMultiPass: 0,
          multiPassEstimatedPriceUsd: 29,
          attractions: [],
        },
      },
    };

    expect(hasTripSectionContent(llReadyTripData, 'll')).toBe(true);
  });
});
