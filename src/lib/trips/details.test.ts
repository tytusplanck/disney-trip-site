import type { TripDataModule } from './types';
import { describe, expect, it } from 'vitest';
import { casschwlanck2026TripData } from '../../data/trips/casschwlanck-2026';
import {
  getArchiveTripInsights,
  getAttractionHeatmapRows,
  getAttractionMustDoVoteCount,
  getPartyOverview,
  getPartySummaries,
  getPreferenceLegend,
  getPreferenceMeta,
  getRankedAttractions,
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

  it('builds compact archive insights for the planning card', () => {
    const insights = getArchiveTripInsights(casschwlanck2026TripData);

    expect(insights).toHaveLength(3);
    expect(insights.map((insight) => insight.label)).toEqual([
      'Cadence',
      'Crew Pulse',
      'Consensus',
    ]);
    expect(insights[0]?.value).toContain('park');
    expect(insights[2]?.detail).toContain('Led by');
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

  it('handles empty overview and insight states', () => {
    expect(getPartyOverview([])).toEqual({
      averageMustDoCount: 0,
      memberCount: 0,
      mostEnthusiasticMember: null,
      mostSelectiveMember: null,
    });
    expect(getArchiveTripInsights(emptyTripData)).toEqual([]);
  });
});
