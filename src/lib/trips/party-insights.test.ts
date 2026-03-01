import { describe, expect, it } from 'vitest';
import { casschwlanck2026TripData } from '../../data/trips/casschwlanck-2026';
import type { TripDataModule } from './types';
import { getPartyClusterView, getPartyPersonaProfile } from './party-insights';

const affinityFixture: TripDataModule = {
  summary: {
    attractionCount: 6,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'test-family',
    id: 'affinity-fixture',
    parkLabels: ['Magic Kingdom', 'EPCOT'],
    partySize: 6,
    status: 'planning',
    themeId: 'primary',
    title: 'Affinity Fixture',
    topPick: 'Pirates',
  },
  party: [
    { id: 'ava', name: 'Ava' },
    { id: 'ben', name: 'Ben' },
    { id: 'cara', name: 'Cara' },
    { id: 'drew', name: 'Drew' },
    { id: 'elle', name: 'Elle' },
    { id: 'finn', name: 'Finn' },
  ],
  schedule: [],
  attractions: [
    {
      id: 'pirates',
      attractionLabel: 'Pirates',
      areaLabel: 'Adventureland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 22,
      preferenceByPartyMemberId: { ava: 1, ben: 1, cara: 2, drew: 4, elle: 4, finn: 3 },
    },
    {
      id: 'mansion',
      attractionLabel: 'Mansion',
      areaLabel: 'Liberty Square',
      parkLabel: 'Magic Kingdom',
      consensusScore: 21,
      preferenceByPartyMemberId: { ava: 2, ben: 1, cara: 2, drew: 5, elle: 4, finn: 3 },
    },
    {
      id: 'thunder',
      attractionLabel: 'Thunder',
      areaLabel: 'Frontierland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 19,
      preferenceByPartyMemberId: { ava: 2, ben: 2, cara: 1, drew: 4, elle: 3, finn: 5 },
    },
    {
      id: 'remy',
      attractionLabel: 'Remy',
      areaLabel: 'World Showcase',
      parkLabel: 'EPCOT',
      consensusScore: 18,
      preferenceByPartyMemberId: { ava: 4, ben: 4, cara: 3, drew: 1, elle: 1, finn: 4 },
    },
    {
      id: 'frozen',
      attractionLabel: 'Frozen',
      areaLabel: 'World Showcase',
      parkLabel: 'EPCOT',
      consensusScore: 17,
      preferenceByPartyMemberId: { ava: 5, ben: 4, cara: 4, drew: 2, elle: 2, finn: 5 },
    },
    {
      id: 'tron',
      attractionLabel: 'TRON',
      areaLabel: 'Tomorrowland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 14,
      preferenceByPartyMemberId: { ava: 4, ben: 5, cara: 5, drew: 4, elle: 5, finn: 1 },
    },
  ],
};

const tieBreakFixture: TripDataModule = {
  summary: {
    attractionCount: 4,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'test-family',
    id: 'tie-break-fixture',
    parkLabels: ['Magic Kingdom', 'EPCOT'],
    partySize: 4,
    status: 'planning',
    themeId: 'primary',
    title: 'Tie Break Fixture',
    topPick: 'Astro Orbiter',
  },
  party: [
    { id: 'amy', name: 'Amy' },
    { id: 'ben', name: 'Ben' },
    { id: 'cara', name: 'Cara' },
    { id: 'drew', name: 'Drew' },
  ],
  schedule: [],
  attractions: [
    {
      id: 'orbiter',
      attractionLabel: 'Astro Orbiter',
      areaLabel: 'Tomorrowland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 11,
      preferenceByPartyMemberId: { amy: 1, ben: 1, cara: 4, drew: 4 },
    },
    {
      id: 'buzz',
      attractionLabel: 'Buzz',
      areaLabel: 'Tomorrowland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 10,
      preferenceByPartyMemberId: { amy: 2, ben: 2, cara: 5, drew: 5 },
    },
    {
      id: 'remy',
      attractionLabel: 'Remy',
      areaLabel: 'France',
      parkLabel: 'EPCOT',
      consensusScore: 10,
      preferenceByPartyMemberId: { amy: 4, ben: 4, cara: 1, drew: 1 },
    },
    {
      id: 'frozen',
      attractionLabel: 'Frozen',
      areaLabel: 'Norway',
      parkLabel: 'EPCOT',
      consensusScore: 9,
      preferenceByPartyMemberId: { amy: 5, ben: 5, cara: 2, drew: 2 },
    },
  ],
};

const longTitleFixture: TripDataModule = {
  summary: {
    attractionCount: 2,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'test-family',
    id: 'long-title-fixture',
    parkLabels: ["Disney's Hollywood Studios"],
    partySize: 2,
    status: 'planning',
    themeId: 'primary',
    title: 'Long Title Fixture',
    topPick: 'Millennium Falcon: Smugglers Run',
  },
  party: [
    { id: 'ivy', name: 'Ivy' },
    { id: 'jude', name: 'Jude' },
  ],
  schedule: [],
  attractions: [
    {
      id: 'falcon',
      attractionLabel: 'Millennium Falcon: Smugglers Run',
      areaLabel: "Star Wars: Galaxy's Edge",
      parkLabel: "Disney's Hollywood Studios",
      consensusScore: 8,
      preferenceByPartyMemberId: { ivy: 1, jude: 1 },
    },
    {
      id: 'tower',
      attractionLabel: 'The Twilight Zone Tower of Terror',
      areaLabel: 'Sunset Boulevard',
      parkLabel: "Disney's Hollywood Studios",
      consensusScore: 7,
      preferenceByPartyMemberId: { ivy: 2, jude: 2 },
    },
  ],
};

const leftoverAssignmentFixture: TripDataModule = {
  summary: {
    attractionCount: 6,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'test-family',
    id: 'leftover-assignment-fixture',
    parkLabels: ['Magic Kingdom'],
    partySize: 3,
    status: 'planning',
    themeId: 'primary',
    title: 'Leftover Assignment Fixture',
    topPick: 'Ride 1',
  },
  party: [
    { id: 'alma', name: 'Alma' },
    { id: 'beck', name: 'Beck' },
    { id: 'casey', name: 'Casey' },
  ],
  schedule: [],
  attractions: [
    {
      id: 'ride-1',
      attractionLabel: 'Ride 1',
      areaLabel: 'Tomorrowland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 9,
      preferenceByPartyMemberId: { alma: 1, beck: 1, casey: 1 },
    },
    {
      id: 'ride-2',
      attractionLabel: 'Ride 2',
      areaLabel: 'Tomorrowland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 8,
      preferenceByPartyMemberId: { alma: 1, beck: 1, casey: 2 },
    },
    {
      id: 'ride-3',
      attractionLabel: 'Ride 3',
      areaLabel: 'Fantasyland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 7,
      preferenceByPartyMemberId: { alma: 2, beck: 2, casey: 3 },
    },
    {
      id: 'ride-4',
      attractionLabel: 'Ride 4',
      areaLabel: 'Fantasyland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 5,
      preferenceByPartyMemberId: { alma: 2, beck: 2, casey: 4 },
    },
    {
      id: 'ride-5',
      attractionLabel: 'Ride 5',
      areaLabel: 'Adventureland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 4,
      preferenceByPartyMemberId: { alma: 2, beck: 2, casey: 4 },
    },
    {
      id: 'ride-6',
      attractionLabel: 'Ride 6',
      areaLabel: 'Adventureland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 3,
      preferenceByPartyMemberId: { alma: 4, beck: 4, casey: 5 },
    },
  ],
};

const mergeSoloFixture: TripDataModule = {
  summary: {
    attractionCount: 6,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'test-family',
    id: 'merge-solo-fixture',
    parkLabels: ['Magic Kingdom', 'EPCOT', "Disney's Hollywood Studios"],
    partySize: 7,
    status: 'planning',
    themeId: 'primary',
    title: 'Merge Solo Fixture',
    topPick: 'Ride 1',
  },
  party: [
    { id: 'alma', name: 'Alma' },
    { id: 'beck', name: 'Beck' },
    { id: 'cora', name: 'Cora' },
    { id: 'drew', name: 'Drew' },
    { id: 'elliot', name: 'Elliot' },
    { id: 'faye', name: 'Faye' },
    { id: 'gina', name: 'Gina' },
  ],
  schedule: [],
  attractions: [
    {
      id: 'ride-1',
      attractionLabel: 'Ride 1',
      areaLabel: 'Tomorrowland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 11,
      preferenceByPartyMemberId: {
        alma: 1,
        beck: 1,
        cora: 4,
        drew: 4,
        elliot: 4,
        faye: 4,
        gina: 3,
      },
    },
    {
      id: 'ride-2',
      attractionLabel: 'Ride 2',
      areaLabel: 'Tomorrowland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 10,
      preferenceByPartyMemberId: {
        alma: 2,
        beck: 2,
        cora: 5,
        drew: 5,
        elliot: 4,
        faye: 4,
        gina: 3,
      },
    },
    {
      id: 'ride-3',
      attractionLabel: 'Ride 3',
      areaLabel: 'World Discovery',
      parkLabel: 'EPCOT',
      consensusScore: 10,
      preferenceByPartyMemberId: {
        alma: 4,
        beck: 4,
        cora: 1,
        drew: 1,
        elliot: 4,
        faye: 4,
        gina: 3,
      },
    },
    {
      id: 'ride-4',
      attractionLabel: 'Ride 4',
      areaLabel: 'World Discovery',
      parkLabel: 'EPCOT',
      consensusScore: 9,
      preferenceByPartyMemberId: {
        alma: 5,
        beck: 5,
        cora: 2,
        drew: 2,
        elliot: 4,
        faye: 4,
        gina: 3,
      },
    },
    {
      id: 'ride-5',
      attractionLabel: 'Ride 5',
      areaLabel: 'Sunset Boulevard',
      parkLabel: "Disney's Hollywood Studios",
      consensusScore: 10,
      preferenceByPartyMemberId: {
        alma: 4,
        beck: 4,
        cora: 4,
        drew: 4,
        elliot: 1,
        faye: 1,
        gina: 3,
      },
    },
    {
      id: 'ride-6',
      attractionLabel: 'Ride 6',
      areaLabel: 'Sunset Boulevard',
      parkLabel: "Disney's Hollywood Studios",
      consensusScore: 9,
      preferenceByPartyMemberId: {
        alma: 4,
        beck: 4,
        cora: 5,
        drew: 5,
        elliot: 2,
        faye: 2,
        gina: 3,
      },
    },
  ],
};

const noSharedFavoriteFixture: TripDataModule = {
  summary: {
    attractionCount: 2,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'test-family',
    id: 'no-shared-favorite-fixture',
    parkLabels: ['Magic Kingdom'],
    partySize: 1,
    status: 'planning',
    themeId: 'primary',
    title: 'No Shared Favorite Fixture',
    topPick: 'Ride 1',
  },
  party: [{ id: 'nora', name: 'Nora' }],
  schedule: [],
  attractions: [
    {
      id: 'ride-1',
      attractionLabel: 'Ride 1',
      areaLabel: 'Tomorrowland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 4,
      preferenceByPartyMemberId: { nora: 4 },
    },
    {
      id: 'ride-2',
      attractionLabel: 'Ride 2',
      areaLabel: 'Fantasyland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 3,
      preferenceByPartyMemberId: { nora: 5 },
    },
  ],
};

const cohortFixture: TripDataModule = {
  summary: {
    attractionCount: 4,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'casschwlanck',
    id: '2026',
    parkLabels: ['Magic Kingdom', 'EPCOT'],
    partySize: 6,
    status: 'planning',
    themeId: 'primary',
    title: 'Cohort Fixture',
    topPick: 'TRON Lightcycle / Run',
  },
  party: [
    { id: 'tytus', name: 'Tytus' },
    { id: 'kelsey', name: 'Kelsey' },
    { id: 'truman', name: 'Truman' },
    { id: 'charlie', name: 'Charlie' },
    { id: 'margot', name: 'Margot' },
    { id: 'cassian', name: 'Cassian' },
  ],
  schedule: [],
  attractions: [
    {
      id: 'tron',
      attractionLabel: 'TRON Lightcycle / Run',
      areaLabel: 'Tomorrowland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 20,
      preferenceByPartyMemberId: {
        tytus: 1,
        kelsey: 2,
        truman: 1,
        charlie: 2,
        margot: 2,
        cassian: 2,
      },
    },
    {
      id: 'pirates',
      attractionLabel: 'Pirates of the Caribbean',
      areaLabel: 'Adventureland',
      parkLabel: 'Magic Kingdom',
      consensusScore: 18,
      preferenceByPartyMemberId: {
        tytus: 2,
        kelsey: 2,
        truman: 1,
        charlie: 1,
        margot: 2,
        cassian: 2,
      },
    },
    {
      id: 'frozen',
      attractionLabel: 'Frozen Ever After',
      areaLabel: 'World Showcase',
      parkLabel: 'EPCOT',
      consensusScore: 16,
      preferenceByPartyMemberId: {
        tytus: 4,
        kelsey: 4,
        truman: 1,
        charlie: 2,
        margot: 1,
        cassian: 2,
      },
    },
    {
      id: 'guardians',
      attractionLabel: 'Guardians of the Galaxy: Cosmic Rewind',
      areaLabel: 'World Discovery',
      parkLabel: 'EPCOT',
      consensusScore: 17,
      preferenceByPartyMemberId: {
        tytus: 1,
        kelsey: 1,
        truman: 4,
        charlie: 4,
        margot: 5,
        cassian: 5,
      },
    },
  ],
};

const soloMergeWithoutAttractionsFixture: TripDataModule = {
  summary: {
    attractionCount: 0,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'test-family',
    id: 'solo-merge-without-attractions',
    parkLabels: [],
    partySize: 4,
    status: 'planning',
    themeId: 'primary',
    title: 'Solo Merge Without Attractions',
    topPick: null,
  },
  party: [
    { id: 'adam', name: 'Adam' },
    { id: 'beth', name: 'Beth' },
    { id: 'cara', name: 'Cara' },
    { id: 'drew', name: 'Drew' },
  ],
  schedule: [],
  attractions: [],
};

const emptyFixture: TripDataModule = {
  summary: {
    attractionCount: 0,
    dateLabel: 'TBD',
    dayCount: 0,
    groupId: 'test-family',
    id: 'empty-fixture',
    parkLabels: [],
    partySize: 0,
    status: 'planning',
    themeId: 'primary',
    title: 'Empty Fixture',
    topPick: null,
  },
  party: [],
  schedule: [],
  attractions: [],
};

describe('party insights', () => {
  it('orders stronger affinity pairs ahead of weaker overlap', () => {
    const view = getPartyClusterView(affinityFixture);
    const weakCrossGroupPair = view.pairs.find(
      (pair) => pair.memberNames[0] === 'Ben' && pair.memberNames[1] === 'Drew',
    );

    expect(view.pairs[0]?.memberNames).toEqual(['Ava', 'Ben']);
    expect(view.pairs[0]?.similarityScore).toBeGreaterThan(
      weakCrossGroupPair?.similarityScore ?? 0,
    );
  });

  it('builds a 3-person cluster, a 2-person cluster, and a solo lane', () => {
    const view = getPartyClusterView(affinityFixture);

    expect(view.clusters.map((cluster) => cluster.memberNames)).toEqual([
      ['Ava', 'Ben', 'Cara'],
      ['Drew', 'Elle'],
      ['Finn'],
    ]);
    expect(view.clusters.map((cluster) => cluster.size)).toEqual([3, 2, 1]);
  });

  it('uses stable alphabetical tie-breaking for equal-strength pairs', () => {
    const view = getPartyClusterView(tieBreakFixture);

    expect(view.pairs.slice(0, 2).map((pair) => pair.memberNames)).toEqual([
      ['Amy', 'Ben'],
      ['Cara', 'Drew'],
    ]);
  });

  it('derives shared favorites and title fallbacks for cluster cards', () => {
    const affinityView = getPartyClusterView(affinityFixture);
    const leadCluster = affinityView.clusters[0];
    const soloCluster = affinityView.clusters[2];
    const longTitleView = getPartyClusterView(longTitleFixture);

    expect(leadCluster?.title).toBe('Pirates + Mansion');
    expect(leadCluster?.sharedFavorites.map((favorite) => favorite.attractionLabel)).toEqual([
      'Pirates',
      'Mansion',
      'Thunder',
    ]);
    expect(soloCluster?.title).toBe("Finn's lane");
    expect(longTitleView.clusters[0]?.title).toBe('Millennium Falcon: Smugglers Run cluster');
  });

  it('assigns a leftover traveler into the nearest seeded cluster when they miss the seed threshold', () => {
    const view = getPartyClusterView(leftoverAssignmentFixture);

    expect(view.clusters).toHaveLength(1);
    expect(view.clusters[0]?.memberNames).toEqual(['Alma', 'Beck', 'Casey']);
  });

  it('merges extra solo clusters back down to three groups', () => {
    const view = getPartyClusterView(mergeSoloFixture);

    expect(view.clusters).toHaveLength(3);
    expect(view.clusters.some((cluster) => cluster.memberNames.includes('Gina'))).toBe(true);
    expect(view.clusters.some((cluster) => cluster.size === 3)).toBe(true);
  });

  it('falls back to a best-available anchor when a cluster has no shared favorites', () => {
    const view = getPartyClusterView(noSharedFavoriteFixture);
    const cluster = view.clusters[0];

    expect(cluster?.sharedFavorites).toEqual([]);
    expect(cluster?.topAnchorAttraction).toBe('Ride 1');
    expect(cluster?.dominantParkLabel).toBe('Magic Kingdom');
    expect(cluster?.title).toBe("Nora's lane");
  });

  it('switches into cohort mode when the configured kid roster is present', () => {
    const view = getPartyClusterView(cohortFixture);

    expect(view.mode).toBe('cohorts');
    expect(view.clusters.map((cluster) => cluster.eyebrow)).toEqual(['Kids', 'Adults']);
    expect(view.railEyebrow).toBe('Kid vs adult gaps');
    expect(view.headlineInsight?.eyebrow).toBe('Sharpest split');
    expect(view.railItems.length).toBeGreaterThan(0);
  });

  it('merges extra solo clusters down to three lanes when no attractions are loaded yet', () => {
    const view = getPartyClusterView(soloMergeWithoutAttractionsFixture);

    expect(view.mode).toBe('clusters');
    expect(view.clusters).toHaveLength(3);
    expect(
      view.clusters.map((cluster) => cluster.size).sort((left, right) => left - right),
    ).toEqual([1, 1, 2]);
    expect(view.clusters.flatMap((cluster) => cluster.memberNames).sort()).toEqual([
      'Adam',
      'Beth',
      'Cara',
      'Drew',
    ]);
  });

  it('returns empty cluster data for an empty trip module', () => {
    const view = getPartyClusterView(emptyFixture);

    expect(view).toEqual({
      clusters: [],
      headlineInsight: null,
      mode: 'clusters',
      pairs: [],
      railEyebrow: 'Shared priorities',
      railItems: [],
      railTitle: 'Must-do pressure that still moves the whole board',
      sharedPriorityAttractions: [],
    });
  });

  it('covers each persona branch with the expected profile', () => {
    expect(getPartyPersonaProfile({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, 0).id).toBe(
      'balanced_explorer',
    );
    expect(getPartyPersonaProfile({ 1: 2, 2: 0, 3: 4, 4: 2, 5: 2 }, 10).id).toBe('headline_hunter');
    expect(getPartyPersonaProfile({ 1: 1, 2: 1, 3: 4, 4: 2, 5: 1 }, 9).id).toBe('big_swing_chaser');
    expect(getPartyPersonaProfile({ 1: 0, 2: 1, 3: 5, 4: 2, 5: 1 }, 9).id).toBe('selective_rider');
    expect(getPartyPersonaProfile({ 1: 1, 2: 5, 3: 2, 4: 1, 5: 1 }, 10).id).toBe('all_in_planner');
    expect(getPartyPersonaProfile({ 1: 0, 2: 4, 3: 5, 4: 1, 5: 0 }, 10).id).toBe(
      'classic_comfort_cruiser',
    );
    expect(getPartyPersonaProfile({ 1: 0, 2: 3, 3: 5, 4: 1, 5: 1 }, 10).id).toBe(
      'flexible_floater',
    );
    expect(getPartyPersonaProfile({ 1: 1, 2: 3, 3: 4, 4: 1, 5: 1 }, 10).id).toBe(
      'balanced_explorer',
    );
  });

  it('uses the explicit kids-versus-adults split for the 2026 trip', () => {
    const view = getPartyClusterView(casschwlanck2026TripData);

    expect(view.mode).toBe('cohorts');
    expect(view.clusters).toHaveLength(2);
    expect(
      view.clusters.map((cluster) => ({ eyebrow: cluster.eyebrow, members: cluster.memberNames })),
    ).toEqual([
      {
        eyebrow: 'Kids',
        members: ['Cassian', 'Charlie', 'Margot', 'Truman'],
      },
      {
        eyebrow: 'Adults',
        members: ['Collin', 'Kayla', 'Kelsey', 'Lisa', 'Tim', 'Tytus'],
      },
    ]);
    expect(view.headlineInsight?.eyebrow).toBe('Sharpest split');
    expect(new Set(view.railItems.map((item) => item.badge))).toEqual(new Set(['Adults', 'Kids']));
  });
});
