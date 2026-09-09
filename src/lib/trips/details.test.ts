import type { TripDataModule } from './types';
import { describe, expect, it } from 'vitest';
import { casschwlanck2026TripData } from '../../data/trips/casschwlanck-2026';
import { declanBigSummerTripData } from '../../data/trips/declan-big-summer-trip';
import { osborneFallFamilyTripData } from '../../data/trips/osborne-fall-family-trip';
import { planckMegaDisneyTripData } from '../../data/trips/planck-mega-disney-trip';
import {
  getAttractionMustDoVoteCount,
  getPartyOverview,
  getPartySummaries,
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
    slug: 'fallback-test',
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
    slug: 'persona-fixture',
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
    const overview = getScheduleOverview(planckMegaDisneyTripData.schedule);
    const days = getScheduleDaySummaries(planckMegaDisneyTripData.schedule);

    expect(overview).toEqual({
      parkDays: 4,
      resortDays: 3,
      travelDays: 2,
      scheduledNotes: 4,
      parkLineup: [
        "Disney's Hollywood Studios",
        'Magic Kingdom',
        'EPCOT',
        "Disney's Animal Kingdom",
      ],
    });
    expect(days[0]?.weekdayLabel).toBe('Sat');
    expect(days[0]?.dateLabel).toBe('Nov 7');
    expect(days.map((day) => [day.entry.date, day.entry.notes])).toEqual([
      ['2026-11-07', null],
      ['2026-11-08', 'Fantasmic.'],
      ['2026-11-09', 'David / Lee / Grammy arrive.'],
      ['2026-11-10', null],
      ['2026-11-11', null],
      ['2026-11-12', 'Food & Wine'],
      ['2026-11-13', 'David / Lee / Grammy leave.'],
      ['2026-11-14', null],
      ['2026-11-15', null],
    ]);
  });

  it('counts mixed travel and park itinerary days in both categories', () => {
    const overview = getScheduleOverview(declanBigSummerTripData.schedule);
    const days = getScheduleDaySummaries(declanBigSummerTripData.schedule);

    expect(overview).toEqual({
      parkDays: 4,
      resortDays: 0,
      travelDays: 2,
      scheduledNotes: 4,
      parkLineup: [
        "Disney's Animal Kingdom",
        "Disney's Hollywood Studios",
        'Magic Kingdom',
        'EPCOT',
      ],
    });
    expect(days[0]?.entry.label).toBe("Disney's Animal Kingdom");
    expect(days[0]?.entry.kinds).toEqual(['travel', 'park']);
    expect(days[1]?.entry.label).toBe("Disney's Hollywood Studios");
    expect(days[2]?.entry.label).toBe('Magic Kingdom');
    expect(days[3]?.entry.label).toBe('EPCOT');
    expect(days[3]?.entry.kinds).toEqual(['travel', 'park']);
  });

  it('keeps party summaries useful when only the traveler list is loaded', () => {
    const summaries = getPartySummaries(planckMegaDisneyTripData);
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

  it('derives preference metadata and indifferent fallbacks for missing traveler ratings', () => {
    const partySummaries = getPartySummaries(fallbackTripData);

    expect(getPreferenceMeta(1).label).toBe('Must Do');
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
      styleLabel: 'Big-swing chaser',
    });
    expect(summaries.find((summary) => summary.member.id === 'classic')).toMatchObject({
      styleDescription: 'Stacks up dependable favorites without needing a huge must-do list.',
      styleLabel: 'Classic comfort cruiser',
    });
  });

  it('produces at least four distinct persona labels for the current 2026 trip', () => {
    const summaries = getPartySummaries(casschwlanck2026TripData);
    const uniqueStyles = new Set(summaries.map((summary) => summary.styleLabel));

    expect(uniqueStyles.size).toBeGreaterThanOrEqual(4);
  });

  it('attaches sorted moment views to each schedule day and leaves sparse days empty', () => {
    const planckDays = getScheduleDaySummaries(planckMegaDisneyTripData.schedule);
    const hollywoodStudios = planckDays.find((day) => day.entry.date === '2026-11-08');
    const magicKingdom = planckDays.find((day) => day.entry.date === '2026-11-10');
    const epcot = planckDays.find((day) => day.entry.date === '2026-11-12');
    const animalKingdom = planckDays.find((day) => day.entry.date === '2026-11-14');
    const ohanaDay = planckDays.find((day) => day.entry.date === '2026-11-09');
    const chefMickeyDay = planckDays.find((day) => day.entry.date === '2026-11-11');
    const narcoosseeDay = planckDays.find((day) => day.entry.date === '2026-11-13');

    expect(hollywoodStudios?.entry.parkLabel).toBe("Disney's Hollywood Studios");
    expect(
      hollywoodStudios?.moments.map((moment) => [moment.timeLabel, moment.kindLabel, moment.label]),
    ).toEqual([
      ['7:10 AM', 'Leave', 'Leave the resort'],
      ['8:30 AM', 'Rope drop', 'Rope drop'],
      ['10:45 AM', 'Dining', 'Roundup Rodeo BBQ'],
      ['4:10 PM', 'Dining', "Oga's Cantina"],
    ]);
    expect(
      magicKingdom?.moments.map((moment) => [moment.timeLabel, moment.kindLabel, moment.label]),
    ).toEqual([
      ['7:10 AM', 'Leave', 'Leave the resort'],
      ['8:30 AM', 'Rope drop', 'Rope drop'],
      ['1:55 PM', 'Dining', 'Liberty Tree Tavern'],
    ]);
    expect(epcot?.entry.parkLabel).toBe('EPCOT');
    expect(
      epcot?.moments.map((moment) => [moment.timeLabel, moment.kindLabel, moment.label]),
    ).toEqual([
      ['7:10 AM', 'Leave', 'Leave the resort'],
      ['8:30 AM', 'Rope drop', 'Rope drop'],
    ]);
    expect(animalKingdom?.entry.parkLabel).toBe("Disney's Animal Kingdom");
    expect(
      animalKingdom?.moments.map((moment) => [moment.timeLabel, moment.kindLabel, moment.label]),
    ).toEqual([
      ['6:10 AM', 'Leave', 'Leave the resort'],
      ['7:30 AM', 'Rope drop', 'Rope drop'],
    ]);
    expect(
      ohanaDay?.moments.map((moment) => [moment.timeLabel, moment.kindLabel, moment.label]),
    ).toEqual([
      ['3:50 PM', 'Leave', 'Leave the resort'],
      ['5:00 PM', 'Dining', "'Ohana"],
    ]);
    expect(
      chefMickeyDay?.moments.map((moment) => [moment.timeLabel, moment.kindLabel, moment.label]),
    ).toEqual([
      ['6:45 AM', 'Leave', 'Leave the resort'],
      ['7:35 AM', 'Dining', "Chef Mickey's"],
      ['4:40 PM', 'Leave', 'Leave the resort'],
      ['5:50 PM', 'Dining', 'Wailulu Bar & Grill'],
    ]);
    expect(
      narcoosseeDay?.moments.map((moment) => [moment.timeLabel, moment.kindLabel, moment.label]),
    ).toEqual([
      ['4:20 PM', 'Leave', 'Leave the resort'],
      ['5:30 PM', 'Dining', "Narcoossee's"],
    ]);
    expect(
      planckDays.flatMap((day) => day.moments).every((moment) => moment.statusLabel === null),
    ).toBe(true);

    const osborneDays = getScheduleDaySummaries(osborneFallFamilyTripData.schedule);
    expect(osborneDays.every((day) => day.moments.length === 0)).toBe(true);
  });

  it('links every Planck dining moment to a Disney menu', () => {
    const dining = getScheduleDaySummaries(planckMegaDisneyTripData.schedule)
      .flatMap((day) => day.moments)
      .filter((moment) => moment.kind === 'dining');

    expect(dining.map((moment) => [moment.label, moment.menuUrl])).toEqual([
      [
        'Hoop-Dee-Doo Musical Revue',
        'https://disneyworld.disney.go.com/dining/campsites-at-fort-wilderness-resort/pioneer-hall/menus/',
      ],
      [
        'Roundup Rodeo BBQ',
        'https://disneyworld.disney.go.com/dining/hollywood-studios/roundup-rodeo-bbq/menus/',
      ],
      [
        "Oga's Cantina",
        'https://disneyworld.disney.go.com/dining/hollywood-studios/ogas-cantina/menus/',
      ],
      ["'Ohana", 'https://disneyworld.disney.go.com/dining/polynesian-resort/ohana/menus/'],
      [
        'Liberty Tree Tavern',
        'https://disneyworld.disney.go.com/dining/magic-kingdom/liberty-tree-tavern/menus/',
      ],
      [
        "Chef Mickey's",
        'https://disneyworld.disney.go.com/dining/contemporary-resort/chef-mickeys/menus/',
      ],
      [
        'Wailulu Bar & Grill',
        'https://disneyworld.disney.go.com/dining/polynesian-resort/wailulu-bar-grill/menus/',
      ],
      [
        "Narcoossee's",
        'https://disneyworld.disney.go.com/dining/grand-floridian-resort-and-spa/narcoossees/menus/',
      ],
    ]);
  });
});
