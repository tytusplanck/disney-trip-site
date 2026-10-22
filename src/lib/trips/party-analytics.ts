import type {
  PreferenceTier,
  TripAttractionPreference,
  TripDataModule,
  TripPartyGroupingConfig,
  TripPartyMember,
} from './types';

type PartyPersonaId =
  | 'headline_hunter'
  | 'big_swing_chaser'
  | 'all_in_planner'
  | 'classic_comfort_cruiser'
  | 'selective_rider'
  | 'flexible_floater'
  | 'balanced_explorer';

interface PartyPersonaProfile {
  id: PartyPersonaId;
  label: string;
  description: string;
}

interface PartyAffinityPair {
  memberIds: [string, string];
  memberNames: [string, string];
  similarityScore: number;
}

type PairLookup = Map<string, number>;

interface PartySharedPriorityAttraction {
  attractionLabel: string;
  parkLabel: string;
  mustDoVotes: number;
}

export interface PartyClusterAnalysisGroup {
  id: string;
  label: string | null;
  memberNames: string[];
  size: number;
  averageAffinityScore: number;
  topAnchorAttraction: string;
}

export interface PartyCohortContrast {
  attractionLabel: string;
  parkLabel: string;
  leadingCohortLabel: string;
  leadingPriorityVotes: number;
  leadingSize: number;
  trailingCohortLabel: string;
  trailingPriorityVotes: number;
  trailingSize: number;
}

export interface PartyClusterAnalysis {
  clusters: PartyClusterAnalysisGroup[];
  sharedPriorityAttractions: PartySharedPriorityAttraction[];
  cohortContrasts: PartyCohortContrast[] | null;
}

const PARTY_PERSONA_PROFILES: Record<PartyPersonaId, PartyPersonaProfile> = {
  headline_hunter: {
    id: 'headline_hunter',
    label: 'Headline hunter',
    description: 'Builds the day around a long list of firm must-dos.',
  },
  big_swing_chaser: {
    id: 'big_swing_chaser',
    label: 'Big-swing chaser',
    description:
      'Has a few intense priorities and a sharper no-thanks list than the rest of the group.',
  },
  all_in_planner: {
    id: 'all_in_planner',
    label: 'All-in planner',
    description: 'Finds a reason to be excited about most of the board.',
  },
  classic_comfort_cruiser: {
    id: 'classic_comfort_cruiser',
    label: 'Classic comfort cruiser',
    description: 'Stacks up dependable favorites without needing a huge must-do list.',
  },
  selective_rider: {
    id: 'selective_rider',
    label: 'Selective rider',
    description: 'Keeps the board narrow and filters out a lot more quickly.',
  },
  flexible_floater: {
    id: 'flexible_floater',
    label: 'Flexible floater',
    description: 'Stays easygoing until a few clear favorites rise above the rest.',
  },
  balanced_explorer: {
    id: 'balanced_explorer',
    label: 'Balanced explorer',
    description: 'Mixes headline picks, casual yeses, and a manageable no-thanks list.',
  },
};

const DEFAULT_TIER: PreferenceTier = 3;
const SHARED_PRIORITY_LIMIT = 5;
const CLUSTER_SEED_THRESHOLD = 55;
const CLUSTER_ADD_AVERAGE_THRESHOLD = 52;
const CLUSTER_ADD_MINIMUM_THRESHOLD = 55;
const CLUSTER_ASSIGN_THRESHOLD = 48;

function getMemberTier(attraction: TripAttractionPreference, memberId: string): PreferenceTier {
  return attraction.preferenceByPartyMemberId[memberId] ?? DEFAULT_TIER;
}

function isLowSignalMember(memberId: string, attractions: TripAttractionPreference[]): boolean {
  if (attractions.length === 0) {
    return false;
  }

  const counts = getPartyPreferenceCounts(memberId, attractions);
  const priorityCount = counts[1] + counts[2];
  const avoidCount = counts[4] + counts[5];
  const indifferentRatio = counts[3] / attractions.length;

  return indifferentRatio >= 0.8 && priorityCount <= 4 && avoidCount <= 2;
}

function buildPrioritySet(memberId: string, attractions: TripAttractionPreference[]): Set<string> {
  return new Set(
    attractions
      .filter((attraction) => getMemberTier(attraction, memberId) <= 2)
      .map((attraction) => attraction.id),
  );
}

function getSortedKey(values: [string, string]): string {
  return [...values].sort((left, right) => left.localeCompare(right)).join('|');
}

function getJaccardOverlap(left: Set<string>, right: Set<string>): number {
  const union = new Set([...left, ...right]);

  if (union.size === 0) {
    return 0;
  }

  const intersectionCount = [...left].filter((value) => right.has(value)).length;
  return intersectionCount / union.size;
}

function getRatingAgreement(
  memberId: string,
  otherMemberId: string,
  attractions: TripAttractionPreference[],
): number {
  if (attractions.length === 0) {
    return 0;
  }

  const totalAgreement = attractions.reduce((total, attraction) => {
    const tier = getMemberTier(attraction, memberId);
    const otherTier = getMemberTier(attraction, otherMemberId);

    return total + (1 - Math.abs(tier - otherTier) / 4);
  }, 0);

  return totalAgreement / attractions.length;
}

function buildAffinityPairs(
  party: TripPartyMember[],
  attractions: TripAttractionPreference[],
): PartyAffinityPair[] {
  const prioritySets = new Map(
    party.map((member) => [member.id, buildPrioritySet(member.id, attractions)]),
  );

  return party
    .flatMap((member, index) =>
      party.slice(index + 1).map((otherMember) => {
        const priorityOverlap = getJaccardOverlap(
          prioritySets.get(member.id) ?? new Set<string>(),
          prioritySets.get(otherMember.id) ?? new Set<string>(),
        );
        const ratingAgreement = getRatingAgreement(member.id, otherMember.id, attractions);

        return {
          memberIds: [member.id, otherMember.id],
          memberNames: [member.name, otherMember.name],
          similarityScore: Math.round((priorityOverlap * 0.65 + ratingAgreement * 0.35) * 100),
        } satisfies PartyAffinityPair;
      }),
    )
    .sort(
      (left, right) =>
        right.similarityScore - left.similarityScore ||
        getSortedKey(left.memberNames).localeCompare(getSortedKey(right.memberNames)),
    );
}

function buildPairLookup(pairs: PartyAffinityPair[]): PairLookup {
  return new Map(pairs.map((pair) => [getSortedKey(pair.memberIds), pair.similarityScore]));
}

function getPairSimilarity(
  pairLookup: PairLookup,
  memberId: string,
  otherMemberId: string,
): number {
  if (memberId === otherMemberId) {
    return 100;
  }

  return pairLookup.get(getSortedKey([memberId, otherMemberId])) ?? 0;
}

function getAverageSimilarityToCluster(
  pairLookup: PairLookup,
  memberId: string,
  clusterMemberIds: string[],
): number {
  if (clusterMemberIds.length === 0) {
    return 0;
  }

  const total = clusterMemberIds.reduce(
    (runningTotal, clusterMemberId) =>
      runningTotal + getPairSimilarity(pairLookup, memberId, clusterMemberId),
    0,
  );

  return total / clusterMemberIds.length;
}

function getAverageClusterAffinity(pairLookup: PairLookup, memberIds: string[]): number {
  if (memberIds.length < 2) {
    return 0;
  }

  const pairScores = memberIds.flatMap((memberId, index) =>
    memberIds
      .slice(index + 1)
      .map((otherMemberId) => getPairSimilarity(pairLookup, memberId, otherMemberId)),
  );

  const total = pairScores.reduce((runningTotal, score) => runningTotal + score, 0);
  return Math.round(total / pairScores.length);
}

function getMemberName(memberById: Map<string, TripPartyMember>, memberId: string): string {
  return memberById.get(memberId)?.name ?? memberId;
}

function getClusterLeadName(memberIds: string[], memberById: Map<string, TripPartyMember>): string {
  const leadMemberId = memberIds[0];

  return leadMemberId ? getMemberName(memberById, leadMemberId) : '';
}

function sortMemberIds(memberIds: string[], memberById: Map<string, TripPartyMember>): string[] {
  return [...memberIds].sort((left, right) =>
    getMemberName(memberById, left).localeCompare(getMemberName(memberById, right)),
  );
}

function getValidatedNamedCohorts(
  config: TripPartyGroupingConfig | undefined,
  party: TripPartyMember[],
):
  | [
      { id: string; label: string; memberIds: string[] },
      { id: string; label: string; memberIds: string[] },
    ]
  | null {
  if (config?.kind !== 'named-cohorts') {
    return null;
  }

  const [firstCohort, secondCohort] = config.cohorts;

  if (
    firstCohort.id.length === 0 ||
    secondCohort.id.length === 0 ||
    firstCohort.label.length === 0 ||
    secondCohort.label.length === 0
  ) {
    return null;
  }

  const partyMemberIds = new Set(party.map((member) => member.id));
  const firstMemberIds = new Set(firstCohort.memberIds);
  const secondMemberIds = new Set(secondCohort.memberIds);

  if (
    firstMemberIds.size !== firstCohort.memberIds.length ||
    secondMemberIds.size !== secondCohort.memberIds.length ||
    firstMemberIds.size === 0 ||
    secondMemberIds.size === 0
  ) {
    return null;
  }

  const combinedMemberIds = [...firstMemberIds, ...secondMemberIds];

  if (combinedMemberIds.length !== party.length) {
    return null;
  }

  if (new Set(combinedMemberIds).size !== combinedMemberIds.length) {
    return null;
  }

  if (combinedMemberIds.some((memberId) => !partyMemberIds.has(memberId))) {
    return null;
  }

  return [
    { ...firstCohort, memberIds: [...firstCohort.memberIds] },
    { ...secondCohort, memberIds: [...secondCohort.memberIds] },
  ];
}

function getTierStats(
  attraction: TripAttractionPreference,
  memberIds: string[],
): { mustDoVotes: number; priorityVotes: number; averageTier: number } {
  const tiers = memberIds.map((memberId) => getMemberTier(attraction, memberId));

  return {
    mustDoVotes: tiers.filter((tier) => tier === 1).length,
    priorityVotes: tiers.filter((tier) => tier <= 2).length,
    averageTier: tiers.reduce((total, tier) => total + tier, 0) / Math.max(tiers.length, 1),
  };
}

function findNearestCluster(
  pairLookup: PairLookup,
  memberId: string,
  clusters: string[][],
  excludedClusterIndex = -1,
): { clusterIndex: number; averageSimilarity: number } | undefined {
  return clusters
    .map((clusterMemberIds, clusterIndex) => ({
      clusterIndex,
      averageSimilarity: getAverageSimilarityToCluster(pairLookup, memberId, clusterMemberIds),
    }))
    .filter((cluster) => cluster.clusterIndex !== excludedClusterIndex)
    .sort(
      (left, right) =>
        right.averageSimilarity - left.averageSimilarity || left.clusterIndex - right.clusterIndex,
    )[0];
}

function addMemberToCluster(
  clusters: string[][],
  clusterIndex: number,
  memberId: string,
  memberById: Map<string, TripPartyMember>,
): void {
  const cluster = clusters[clusterIndex];

  if (cluster) {
    clusters.splice(clusterIndex, 1, sortMemberIds([...cluster, memberId], memberById));
  }
}

function buildClusterMemberIds(
  party: TripPartyMember[],
  pairLookup: PairLookup,
  pairs: PartyAffinityPair[],
  attractions: TripAttractionPreference[],
): string[][] {
  const memberById = new Map(party.map((member) => [member.id, member]));
  const unassignedMembers = new Set(party.map((member) => member.id));
  const clusters: string[][] = [];
  const lowSignalMembers = new Set(
    party.filter((member) => isLowSignalMember(member.id, attractions)).map((member) => member.id),
  );

  while (clusters.length < 3) {
    const seedPair = pairs.find(
      (pair) =>
        pair.similarityScore >= CLUSTER_SEED_THRESHOLD &&
        unassignedMembers.has(pair.memberIds[0]) &&
        unassignedMembers.has(pair.memberIds[1]),
    );

    if (!seedPair) {
      break;
    }

    const clusterMemberIds = [...seedPair.memberIds];
    unassignedMembers.delete(seedPair.memberIds[0]);
    unassignedMembers.delete(seedPair.memberIds[1]);

    for (;;) {
      const nextCandidate = [...unassignedMembers]
        .map((memberId) => ({
          memberId,
          name: getMemberName(memberById, memberId),
          averageSimilarity: getAverageSimilarityToCluster(pairLookup, memberId, clusterMemberIds),
          minimumSimilarity: Math.min(
            ...clusterMemberIds.map((clusterMemberId) =>
              getPairSimilarity(pairLookup, memberId, clusterMemberId),
            ),
          ),
        }))
        .filter(
          (candidate) =>
            candidate.averageSimilarity >= CLUSTER_ADD_AVERAGE_THRESHOLD &&
            candidate.minimumSimilarity >= CLUSTER_ADD_MINIMUM_THRESHOLD,
        )
        .sort(
          (left, right) =>
            right.averageSimilarity - left.averageSimilarity || left.name.localeCompare(right.name),
        )[0];

      if (!nextCandidate) {
        break;
      }

      clusterMemberIds.push(nextCandidate.memberId);
      unassignedMembers.delete(nextCandidate.memberId);
    }

    clusters.push(sortMemberIds(clusterMemberIds, memberById));
  }

  while (clusters.length > 0) {
    const assignableCandidate = [...unassignedMembers]
      .flatMap((memberId) => {
        const nearest = findNearestCluster(pairLookup, memberId, clusters);

        return nearest ? [{ memberId, name: getMemberName(memberById, memberId), ...nearest }] : [];
      })
      .sort(
        (left, right) =>
          right.averageSimilarity - left.averageSimilarity || left.name.localeCompare(right.name),
      )[0];

    if (!assignableCandidate || assignableCandidate.averageSimilarity < CLUSTER_ASSIGN_THRESHOLD) {
      break;
    }

    addMemberToCluster(
      clusters,
      assignableCandidate.clusterIndex,
      assignableCandidate.memberId,
      memberById,
    );
    unassignedMembers.delete(assignableCandidate.memberId);
  }

  const lowSignalAssignments = sortMemberIds(
    [...unassignedMembers].filter((memberId) => lowSignalMembers.has(memberId)),
    memberById,
  );

  for (const memberId of lowSignalAssignments) {
    const nearest = findNearestCluster(pairLookup, memberId, clusters);

    if (!nearest) {
      break;
    }

    addMemberToCluster(clusters, nearest.clusterIndex, memberId, memberById);
    unassignedMembers.delete(memberId);
  }

  for (const memberId of sortMemberIds([...unassignedMembers], memberById)) {
    clusters.push([memberId]);
  }

  while (clusters.length > 3) {
    const soloClusterCandidate = clusters
      .flatMap((clusterMemberIds, clusterIndex) => {
        const [memberId] = clusterMemberIds;

        if (clusterMemberIds.length !== 1 || !memberId) {
          return [];
        }

        const nearest = findNearestCluster(pairLookup, memberId, clusters, clusterIndex);

        return nearest
          ? [{ clusterIndex, memberId, name: getMemberName(memberById, memberId), nearest }]
          : [];
      })
      .sort(
        (left, right) =>
          left.nearest.averageSimilarity - right.nearest.averageSimilarity ||
          left.name.localeCompare(right.name),
      )[0];

    if (!soloClusterCandidate) {
      break;
    }

    addMemberToCluster(
      clusters,
      soloClusterCandidate.nearest.clusterIndex,
      soloClusterCandidate.memberId,
      memberById,
    );
    clusters.splice(soloClusterCandidate.clusterIndex, 1);
  }

  return [...clusters].sort(
    (left, right) =>
      right.length - left.length ||
      getAverageClusterAffinity(pairLookup, right) - getAverageClusterAffinity(pairLookup, left) ||
      getClusterLeadName(left, memberById).localeCompare(getClusterLeadName(right, memberById)),
  );
}

function getTopAnchorAttraction(
  clusterMemberIds: string[],
  attractions: TripAttractionPreference[],
): string {
  const stats = attractions.map((attraction) => ({
    attraction,
    ...getTierStats(attraction, clusterMemberIds),
  }));

  const sharedFavorite = stats
    .filter((item) => item.priorityVotes / clusterMemberIds.length >= 0.5)
    .sort(
      (left, right) =>
        right.priorityVotes - left.priorityVotes ||
        right.mustDoVotes - left.mustDoVotes ||
        left.averageTier - right.averageTier ||
        right.attraction.consensusScore - left.attraction.consensusScore ||
        left.attraction.attractionLabel.localeCompare(right.attraction.attractionLabel),
    )[0];

  const lead =
    sharedFavorite ??
    stats.sort(
      (left, right) =>
        left.averageTier - right.averageTier ||
        right.attraction.consensusScore - left.attraction.consensusScore ||
        left.attraction.attractionLabel.localeCompare(right.attraction.attractionLabel),
    )[0];

  return lead?.attraction.attractionLabel ?? 'No anchor attraction yet';
}

function buildSharedPriorityAttractions(
  attractions: TripAttractionPreference[],
): PartySharedPriorityAttraction[] {
  return attractions
    .map((attraction) => ({
      attraction,
      mustDoVotes: Object.values(attraction.preferenceByPartyMemberId).filter((tier) => tier === 1)
        .length,
    }))
    .sort(
      (left, right) =>
        right.mustDoVotes - left.mustDoVotes ||
        right.attraction.consensusScore - left.attraction.consensusScore ||
        left.attraction.attractionLabel.localeCompare(right.attraction.attractionLabel),
    )
    .slice(0, SHARED_PRIORITY_LIMIT)
    .map(({ attraction, mustDoVotes }) => ({
      attractionLabel: attraction.attractionLabel,
      parkLabel: attraction.parkLabel,
      mustDoVotes,
    }));
}

function buildCohortContrasts(
  attractions: TripAttractionPreference[],
  firstCohort: { label: string; memberIds: string[] },
  secondCohort: { label: string; memberIds: string[] },
): PartyCohortContrast[] {
  return attractions
    .map((attraction) => {
      const first = getTierStats(attraction, firstCohort.memberIds);
      const second = getTierStats(attraction, secondCohort.memberIds);
      const firstShare = first.priorityVotes / Math.max(firstCohort.memberIds.length, 1);
      const secondShare = second.priorityVotes / Math.max(secondCohort.memberIds.length, 1);
      const averageTierGap = Math.abs(first.averageTier - second.averageTier) / 4;
      const firstLeads =
        firstShare > secondShare ||
        (firstShare === secondShare && first.averageTier < second.averageTier);
      const [leading, trailing] = firstLeads
        ? [
            { cohort: firstCohort, stats: first },
            { cohort: secondCohort, stats: second },
          ]
        : [
            { cohort: secondCohort, stats: second },
            { cohort: firstCohort, stats: first },
          ];

      return {
        contrast: {
          attractionLabel: attraction.attractionLabel,
          parkLabel: attraction.parkLabel,
          leadingCohortLabel: leading.cohort.label,
          leadingPriorityVotes: leading.stats.priorityVotes,
          leadingSize: leading.cohort.memberIds.length,
          trailingCohortLabel: trailing.cohort.label,
          trailingPriorityVotes: trailing.stats.priorityVotes,
          trailingSize: trailing.cohort.memberIds.length,
        },
        gapScore: Math.abs(firstShare - secondShare) * 0.7 + averageTierGap * 0.3,
        consensusScore: attraction.consensusScore,
      };
    })
    .sort(
      (left, right) =>
        right.gapScore - left.gapScore ||
        right.consensusScore - left.consensusScore ||
        left.contrast.attractionLabel.localeCompare(right.contrast.attractionLabel),
    )
    .map(({ contrast }) => contrast);
}

function buildClusterAnalysisGroup(
  id: string,
  label: string | null,
  memberIds: string[],
  memberById: Map<string, TripPartyMember>,
  pairLookup: PairLookup,
  attractions: TripAttractionPreference[],
): PartyClusterAnalysisGroup {
  return {
    averageAffinityScore: getAverageClusterAffinity(pairLookup, memberIds),
    id,
    label,
    memberNames: memberIds.map((memberId) => getMemberName(memberById, memberId)),
    size: memberIds.length,
    topAnchorAttraction: getTopAnchorAttraction(memberIds, attractions),
  };
}

export function getPartyPersonaProfile(
  counts: Record<PreferenceTier, number>,
  totalAttractions: number,
): PartyPersonaProfile {
  if (totalAttractions === 0) {
    return PARTY_PERSONA_PROFILES.balanced_explorer;
  }

  const mustDoCount = counts[1];
  const mustDoRatio = mustDoCount / totalAttractions;
  const preferredRatio = counts[2] / totalAttractions;
  const enthusiasmRatio = (counts[1] + counts[2]) / totalAttractions;
  const indifferentRatio = counts[3] / totalAttractions;
  const avoidRatio = (counts[4] + counts[5]) / totalAttractions;

  if (mustDoRatio >= 0.2 || mustDoCount >= 18) {
    return PARTY_PERSONA_PROFILES.headline_hunter;
  }

  if (mustDoRatio >= 0.11 && avoidRatio >= 0.2) {
    return PARTY_PERSONA_PROFILES.big_swing_chaser;
  }

  if (avoidRatio >= 0.3) {
    return PARTY_PERSONA_PROFILES.selective_rider;
  }

  if (enthusiasmRatio >= 0.6) {
    return PARTY_PERSONA_PROFILES.all_in_planner;
  }

  if (preferredRatio >= 0.32 && mustDoRatio < 0.11 && avoidRatio < 0.16) {
    return PARTY_PERSONA_PROFILES.classic_comfort_cruiser;
  }

  if (indifferentRatio >= 0.48) {
    return PARTY_PERSONA_PROFILES.flexible_floater;
  }

  return PARTY_PERSONA_PROFILES.balanced_explorer;
}

export function getPartyClusterAnalysis(module: TripDataModule): PartyClusterAnalysis {
  const memberById = new Map(module.party.map((member) => [member.id, member]));
  const pairs = buildAffinityPairs(module.party, module.attractions);
  const pairLookup = buildPairLookup(pairs);
  const sharedPriorityAttractions = buildSharedPriorityAttractions(module.attractions);
  const namedCohorts = getValidatedNamedCohorts(module.partyGrouping, module.party);

  if (namedCohorts) {
    const cohorts = namedCohorts.map((cohort) => ({
      ...cohort,
      memberIds: sortMemberIds(cohort.memberIds, memberById),
    })) as [(typeof namedCohorts)[0], (typeof namedCohorts)[1]];

    return {
      clusters: cohorts.map((cohort) =>
        buildClusterAnalysisGroup(
          cohort.id,
          cohort.label,
          cohort.memberIds,
          memberById,
          pairLookup,
          module.attractions,
        ),
      ),
      cohortContrasts: buildCohortContrasts(module.attractions, cohorts[0], cohorts[1]),
      sharedPriorityAttractions,
    };
  }

  return {
    cohortContrasts: null,
    clusters: buildClusterMemberIds(module.party, pairLookup, pairs, module.attractions).map(
      (memberIds, index) =>
        buildClusterAnalysisGroup(
          `cluster-${String(index + 1)}`,
          null,
          memberIds,
          memberById,
          pairLookup,
          module.attractions,
        ),
    ),
    sharedPriorityAttractions,
  };
}

export function getPartyPreferenceCounts(
  memberId: string,
  attractions: TripAttractionPreference[],
): Record<PreferenceTier, number> {
  const counts: Record<PreferenceTier, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const attraction of attractions) {
    counts[getMemberTier(attraction, memberId)] += 1;
  }

  return counts;
}
