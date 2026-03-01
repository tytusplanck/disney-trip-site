import type { TripDataModule } from './types';
import { describe, expect, it } from 'vitest';
import { casschwlanck2026TripData } from '../../data/trips/casschwlanck-2026';
import { futureTripData } from '../../data/trips/future-trip';
import {
  getAllTripsCardInsights,
  getAttractionHeatmapRows,
  getAttractionMustDoVoteCount,
  getPartyOverview,
  getPartySummaries,
  getPreferenceLegend,
  getPreferenceMeta,
  getRankedAttractions,
  getSharedPriorityAttractions,
  getScheduleDaySummaries,
  getScheduleOverview,
} from './details';

const fallbackTripData: TripDataModule = {
  summary: {
    attractionCount: 4,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'casschwlanck',
    id: 'fallback-test',
    parkLabels: ['Magic Kingdom'],
    partySize: 2,
    status: 'planning',
    themeId: 'primary',
    title: 'Fallback Test',
    topPick: 'Space Mountain',
  },
  party: [
    { id: 'tytus', name: 'Tytus' },
    { id: 'cassie', name: 'Cassie' },
  ],
  schedule: [],
  attractions: [
    {
      areaLabel: 'Tomorrowland',
      attractionLabel: 'Space Mountain',
      consensusScore: 9,
      id: 'high',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { cassie: 1, tytus: 1 },
    },
    {
      areaLabel: 'Fantasyland',
      attractionLabel: 'Peter Pan',
      consensusScore: 6,
      id: 'medium',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { cassie: 2, tytus: 2 },
    },
    {
      areaLabel: 'Adventureland',
      attractionLabel: 'Swiss Family Treehouse',
      consensusScore: 3,
      id: 'low',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { cassie: 3, tytus: 3 },
    },
    {
      areaLabel: 'Fantasyland',
      attractionLabel: 'Under the Sea',
      consensusScore: 4,
      id: 'fallback',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { tytus: 2 },
    },
  ],
};

const personaFixtureTripData: TripDataModule = {
  summary: {
    attractionCount: 9,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'casschwlanck',
    id: 'persona-fixture',
    parkLabels: ['Magic Kingdom'],
    partySize: 4,
    status: 'planning',
    themeId: 'primary',
    title: 'Persona Fixture',
    topPick: 'Ride 1',
  },
  party: [
    { id: 'big', name: 'Big Swing' },
    { id: 'classic', name: 'Classic Comfort' },
    { id: 'balanced', name: 'Balanced Explorer' },
    { id: 'floater', name: 'Flexible Floater' },
  ],
  schedule: [],
  attractions: [
    {
      areaLabel: 'Tomorrowland',
      attractionLabel: 'Ride 1',
      consensusScore: 8,
      id: 'ride-1',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { balanced: 2, big: 1, classic: 2, floater: 3 },
    },
    {
      areaLabel: 'Tomorrowland',
      attractionLabel: 'Ride 2',
      consensusScore: 8,
      id: 'ride-2',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { balanced: 2, big: 2, classic: 2, floater: 3 },
    },
    {
      areaLabel: 'Fantasyland',
      attractionLabel: 'Ride 3',
      consensusScore: 6,
      id: 'ride-3',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { balanced: 2, big: 3, classic: 2, floater: 2 },
    },
    {
      areaLabel: 'Fantasyland',
      attractionLabel: 'Ride 4',
      consensusScore: 5,
      id: 'ride-4',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { balanced: 3, big: 4, classic: 3, floater: 3 },
    },
    {
      areaLabel: 'Adventureland',
      attractionLabel: 'Ride 5',
      consensusScore: 4,
      id: 'ride-5',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { balanced: 4, big: 4, classic: 3, floater: 4 },
    },
    {
      areaLabel: 'Adventureland',
      attractionLabel: 'Ride 6',
      consensusScore: 3,
      id: 'ride-6',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { balanced: 3, big: 5, classic: 3, floater: 3 },
    },
    {
      areaLabel: 'Liberty Square',
      attractionLabel: 'Ride 7',
      consensusScore: 6,
      id: 'ride-7',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { balanced: 2, big: 3, classic: 2, floater: 3 },
    },
    {
      areaLabel: 'Frontierland',
      attractionLabel: 'Ride 8',
      consensusScore: 4,
      id: 'ride-8',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { balanced: 3, big: 3, classic: 4, floater: 5 },
    },
    {
      areaLabel: 'Main Street, U.S.A.',
      attractionLabel: 'Ride 9',
      consensusScore: 5,
      id: 'ride-9',
      parkLabel: 'Magic Kingdom',
      preferenceByPartyMemberId: { balanced: 4, big: 3, classic: 3, floater: 3 },
    },
  ],
};

describe('trip detail helpers', () => {
  it('ranks attractions by consensus score', () => {
    const rankedAttractions = getRankedAttractions(
      casschwlanck2026TripData.attractions,
      casschwlanck2026TripData.party.length,
    );

    expect(rankedAttractions[0]?.attractionLabel).toBe('Kilimanjaro Safaris');
    expect(rankedAttractions[0]?.consensusScore).toBe(47);
    expect(rankedAttractions[0]?.maxScore).toBe(50);
  });

  it('summarizes party preferences and overview stats', () => {
    const summaries = getPartySummaries(casschwlanck2026TripData);
    const overview = getPartyOverview(summaries);

    expect(summaries).toHaveLength(10);
    expect(summaries[0]).toHaveProperty('styleId');
    expect(summaries[0]).toHaveProperty('styleDescription');
    expect(summaries.find((summary) => summary.member.name === 'Tytus')?.topChoices[0]).toBe(
      'Fantasmic!',
    );
    expect(overview.memberCount).toBe(10);
    expect(overview.averageMustDoCount).toBeGreaterThan(0);
    expect(overview.mostSelectiveMember).not.toBeNull();
    expect(overview.mostEnthusiasticMember).not.toBeNull();
  });

  it('derives schedule overview and day labels from the trip data', () => {
    const overview = getScheduleOverview(casschwlanck2026TripData.schedule);
    const days = getScheduleDaySummaries(casschwlanck2026TripData.schedule);

    expect(overview).toEqual({
      parkDays: 4,
      resortDays: 3,
      travelDays: 2,
      scheduledNotes: 8,
      parkLineup: [
        "Disney's Animal Kingdom",
        "Disney's Hollywood Studios",
        'EPCOT',
        'Magic Kingdom',
      ],
    });
    expect(days[0]?.weekdayLabel).toBe('Sat');
    expect(days[0]?.dateLabel).toBe('Mar 28');
    expect(getAttractionMustDoVoteCount(casschwlanck2026TripData.attractions)).toBeGreaterThan(0);
  });

  it('derives schedule summaries for an itinerary-only upcoming trip', () => {
    const overview = getScheduleOverview(futureTripData.schedule);
    const days = getScheduleDaySummaries(futureTripData.schedule);

    expect(overview).toEqual({
      parkDays: 4,
      resortDays: 3,
      travelDays: 2,
      scheduledNotes: 5,
      parkLineup: [
        "Disney's Animal Kingdom",
        'EPCOT',
        'Magic Kingdom',
        "Disney's Hollywood Studios",
      ],
    });
    expect(days[0]?.weekdayLabel).toBe('Sat');
    expect(days[0]?.dateLabel).toBe('Nov 7');
    expect(days[4]?.entry.notes).toBe('Chef Mickeys');
  });

  it('keeps party summaries useful when only the traveler list is loaded', () => {
    const summaries = getPartySummaries(futureTripData);
    const overview = getPartyOverview(summaries);

    expect(summaries).toHaveLength(14);
    expect(summaries[0]).toMatchObject({
      mustDoCount: 0,
      enthusiasmCount: 0,
      avoidCount: 0,
      styleLabel: 'Balanced explorer',
      topChoices: [],
    });
    expect(overview).toEqual({
      averageMustDoCount: 0,
      memberCount: 14,
      mostEnthusiasticMember: null,
      mostSelectiveMember: null,
    });
  });

  it('builds richer all-trips card insights for the planning card', () => {
    const insights = getAllTripsCardInsights(casschwlanck2026TripData);

    expect(insights).toHaveLength(3);
    expect(insights.map((insight) => insight.label)).toEqual([
      'Cadence',
      'Crew pulse',
      'Shared favorite',
    ]);
    expect(insights[0]?.detail).toContain('park days');
    expect(insights[2]?.detail).toContain('Kilimanjaro Safaris');
  });

  it('derives legend metadata and heatmap rows with indifferent fallbacks', () => {
    const legend = getPreferenceLegend();
    const rows = getAttractionHeatmapRows(
      fallbackTripData.party,
      fallbackTripData.attractions.slice(-1),
    );
    const partySummaries = getPartySummaries(fallbackTripData);

    expect(legend).toHaveLength(5);
    expect(getPreferenceMeta(1).label).toBe('Must Do');
    expect(rows[0]?.ratings[1]).toMatchObject({
      memberId: 'cassie',
      memberName: 'Cassie',
      tier: 3,
    });
    expect(
      partySummaries.find((summary) => summary.member.id === 'cassie')?.tierSummaries[2],
    ).toMatchObject({
      count: 2,
      label: 'Indifferent',
      tier: 3,
    });
  });

  it('assigns attraction tones across high, medium, and low consensus bands', () => {
    const rankedAttractions = getRankedAttractions(fallbackTripData.attractions.slice(0, 3), 2);

    expect(rankedAttractions.map((attraction) => attraction.tone)).toEqual([
      'high',
      'medium',
      'low',
    ]);
  });

  it('sorts shared priority attractions by must-do votes, then score', () => {
    const sharedPriorities = getSharedPriorityAttractions(fallbackTripData.attractions, 2, 2);

    expect(sharedPriorities.map((attraction) => attraction.attractionLabel)).toEqual([
      'Space Mountain',
      'Peter Pan',
    ]);
  });

  it('handles empty overview states', () => {
    expect(getPartyOverview([])).toEqual({
      averageMustDoCount: 0,
      memberCount: 0,
      mostEnthusiasticMember: null,
      mostSelectiveMember: null,
    });
  });

  it('emits the expanded persona model with the new personas and descriptions', () => {
    const summaries = getPartySummaries(personaFixtureTripData);

    expect(summaries.find((summary) => summary.member.id === 'big')).toMatchObject({
      styleDescription:
        'Has a few intense priorities and a sharper no-thanks list than the rest of the group.',
      styleId: 'big_swing_chaser',
      styleLabel: 'Big-swing chaser',
    });
    expect(summaries.find((summary) => summary.member.id === 'classic')).toMatchObject({
      styleDescription: 'Stacks up dependable favorites without needing a huge must-do list.',
      styleId: 'classic_comfort_cruiser',
      styleLabel: 'Classic comfort cruiser',
    });
  });

  it('produces at least four distinct persona labels for the current 2026 trip', () => {
    const summaries = getPartySummaries(casschwlanck2026TripData);
    const uniqueStyles = new Set(summaries.map((summary) => summary.styleLabel));

    expect(uniqueStyles.size).toBeGreaterThanOrEqual(4);
  });
});
