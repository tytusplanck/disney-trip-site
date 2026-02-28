import { describe, expect, it } from 'vitest';
import { casschwlanck2026TripData } from '../../data/trips/casschwlanck-2026';
import {
  getArchiveTripInsights,
  getAttractionMustDoVoteCount,
  getPartyOverview,
  getPartySummaries,
  getRankedAttractions,
  getScheduleDaySummaries,
  getScheduleOverview,
} from './details';

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
});
