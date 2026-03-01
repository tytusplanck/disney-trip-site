import type {
  PreferenceTier,
  TripAttractionPreference,
  TripDataModule,
  TripPartyMember,
} from './types';

export type PartyPersonaId =
  | 'headline_hunter'
  | 'big_swing_chaser'
  | 'all_in_planner'
  | 'classic_comfort_cruiser'
  | 'selective_rider'
  | 'flexible_floater'
  | 'balanced_explorer';

export interface PartyPersonaProfile {
  id: PartyPersonaId;
  label: string;
  description: string;
}

export interface PartyAffinityPair {
  memberIds: [string, string];
  memberNames: [string, string];
  priorityOverlap: number;
  ratingAgreement: number;
  similarityScore: number;
}

interface PartyClusterFavorite {
  attractionLabel: string;
  parkLabel: string;
  priorityVotes: number;
  mustDoVotes: number;
}

interface PartySharedPriorityAttraction {
  attractionLabel: string;
  parkLabel: string;
  mustDoVotes: number;
  consensusScore: number;
}

export interface PartyClusterCard {
  id: string;
  eyebrow: string;
  title: string;
  memberIds: string[];
  memberNames: string[];
  size: number;
  averageAffinityScore: number;
  sharedFavorites: PartyClusterFavorite[];
  topAnchorAttraction: string;
  topAnchorParkLabel: string;
  dominantParkLabel: string;
  description: string;
}

export interface PartyClusterRailItem {
  badge: string;
  detail: string;
  title: string;
}

export interface PartyClusterHeadlineInsight {
  detail: string;
  eyebrow: string;
  title: string;
}

export interface PartyClusterView {
  headlineInsight: PartyClusterHeadlineInsight | null;
  mode: 'cohorts' | 'clusters';
  pairs: PartyAffinityPair[];
  railEyebrow: string;
  railItems: PartyClusterRailItem[];
  railTitle: string;
  clusters: PartyClusterCard[];
  sharedPriorityAttractions: PartySharedPriorityAttraction[];
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
const COHORT_PRESETS: Record<
  string,
  {
    adultsLabel: string;
    kidsLabel: string;
    kidMemberIds: string[];
  }
> = {
  'casschwlanck/2026': {
    adultsLabel: 'Adults',
    kidsLabel: 'Kids',
    kidMemberIds: ['truman', 'charlie', 'margot', 'cassian'],
  },
};

function getMemberTier(attraction: TripAttractionPreference, memberId: string): PreferenceTier {
  return attraction.preferenceByPartyMemberId[memberId] ?? DEFAULT_TIER;
}

function createEmptyTierCounts(): Record<PreferenceTier, number> {
  return {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
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

function getPairNameKey(names: [string, string]): string {
  return [...names].sort((left, right) => left.localeCompare(right)).join('|');
}

function getPairLookupKey(memberIds: [string, string]): string {
  return [...memberIds].sort((left, right) => left.localeCompare(right)).join('|');
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
          priorityOverlap,
          ratingAgreement,
          similarityScore: Math.round((priorityOverlap * 0.65 + ratingAgreement * 0.35) * 100),
        } satisfies PartyAffinityPair;
      }),
    )
    .sort(
      (left, right) =>
        right.similarityScore - left.similarityScore ||
        getPairNameKey(left.memberNames).localeCompare(getPairNameKey(right.memberNames)),
    );
}

function buildPairLookup(pairs: PartyAffinityPair[]): Map<string, PartyAffinityPair> {
  return new Map(pairs.map((pair) => [getPairLookupKey(pair.memberIds), pair]));
}

function getPairSimilarity(
  pairLookup: Map<string, PartyAffinityPair>,
  memberId: string,
  otherMemberId: string,
): number {
  if (memberId === otherMemberId) {
    return 100;
  }

  return pairLookup.get(getPairLookupKey([memberId, otherMemberId]))?.similarityScore ?? 0;
}

function getAverageSimilarityToCluster(
  pairLookup: Map<string, PartyAffinityPair>,
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

function getAverageClusterAffinity(
  pairLookup: Map<string, PartyAffinityPair>,
  memberIds: string[],
): number {
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

function getCohortPreset(module: TripDataModule): {
  adultsLabel: string;
  kidsLabel: string;
  kidMemberIds: string[];
} | null {
  const preset = COHORT_PRESETS[`${module.summary.groupId}/${module.summary.id}`];

  if (!preset) {
    return null;
  }

  return preset.kidMemberIds.every((memberId) =>
    module.party.some((member) => member.id === memberId),
  )
    ? preset
    : null;
}

function getPriorityVotesForMembers(
  attraction: TripAttractionPreference,
  memberIds: string[],
): { averageTier: number; priorityVotes: number } {
  const tiers = memberIds.map((memberId) => getMemberTier(attraction, memberId));

  return {
    averageTier: tiers.reduce((total, tier) => total + tier, 0) / Math.max(memberIds.length, 1),
    priorityVotes: tiers.filter((tier) => tier <= 2).length,
  };
}

function getCohortDescriptions(
  kidsTopAnchor: string,
  adultsTopAnchor: string,
): { adultsDescription: string; kidsDescription: string } {
  return {
    adultsDescription: `Carries more of the headliner pull, with ${adultsTopAnchor} setting the adult pace.`,
    kidsDescription: `Keeps the family-side picks in the conversation, with ${kidsTopAnchor} anchoring the kid stack.`,
  };
}

function buildClusterMemberIds(
  party: TripPartyMember[],
  pairLookup: Map<string, PartyAffinityPair>,
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
      .map((memberId) => {
        const nearestCluster = clusters
          .map((clusterMemberIds, clusterIndex) => ({
            clusterIndex,
            averageSimilarity: getAverageSimilarityToCluster(
              pairLookup,
              memberId,
              clusterMemberIds,
            ),
          }))
          .sort(
            (left, right) =>
              right.averageSimilarity - left.averageSimilarity ||
              left.clusterIndex - right.clusterIndex,
          )[0];

        return {
          memberId,
          name: getMemberName(memberById, memberId),
          nearestClusterIndex: nearestCluster?.clusterIndex ?? -1,
          nearestClusterSimilarity: nearestCluster?.averageSimilarity ?? 0,
        };
      })
      .filter((candidate) => candidate.nearestClusterIndex >= 0)
      .sort(
        (left, right) =>
          right.nearestClusterSimilarity - left.nearestClusterSimilarity ||
          left.name.localeCompare(right.name),
      )[0];

    if (
      !assignableCandidate ||
      assignableCandidate.nearestClusterSimilarity < CLUSTER_ASSIGN_THRESHOLD
    ) {
      break;
    }

    const targetCluster = clusters[assignableCandidate.nearestClusterIndex];

    if (!targetCluster) {
      break;
    }

    targetCluster.push(assignableCandidate.memberId);
    const sortedTargetCluster = sortMemberIds(targetCluster, memberById);
    clusters.splice(assignableCandidate.nearestClusterIndex, 1, sortedTargetCluster);
    unassignedMembers.delete(assignableCandidate.memberId);
  }

  const lowSignalAssignments = sortMemberIds(
    [...unassignedMembers].filter((memberId) => lowSignalMembers.has(memberId)),
    memberById,
  );

  for (const memberId of lowSignalAssignments) {
    if (clusters.length === 0) {
      break;
    }

    const nearestCluster = clusters
      .map((clusterMemberIds, clusterIndex) => ({
        clusterIndex,
        averageSimilarity: getAverageSimilarityToCluster(pairLookup, memberId, clusterMemberIds),
      }))
      .sort(
        (left, right) =>
          right.averageSimilarity - left.averageSimilarity ||
          left.clusterIndex - right.clusterIndex,
      )[0];

    if (!nearestCluster) {
      break;
    }

    const targetCluster = clusters[nearestCluster.clusterIndex];

    if (!targetCluster) {
      break;
    }

    targetCluster.push(memberId);
    clusters.splice(nearestCluster.clusterIndex, 1, sortMemberIds(targetCluster, memberById));
    unassignedMembers.delete(memberId);
  }

  for (const memberId of sortMemberIds([...unassignedMembers], memberById)) {
    clusters.push([memberId]);
  }

  while (clusters.length > 3) {
    const soloClusterCandidate = clusters
      .map((clusterMemberIds, clusterIndex) => ({ clusterIndex, clusterMemberIds }))
      .filter((cluster) => cluster.clusterMemberIds.length === 1)
      .map((cluster) => {
        const memberId = cluster.clusterMemberIds[0];

        if (!memberId) {
          return null;
        }

        const nearestCluster = clusters
          .map((candidateClusterMemberIds, candidateClusterIndex) => ({
            clusterIndex: candidateClusterIndex,
            averageSimilarity:
              candidateClusterIndex === cluster.clusterIndex
                ? -1
                : getAverageSimilarityToCluster(pairLookup, memberId, candidateClusterMemberIds),
          }))
          .filter((candidate) => candidate.averageSimilarity >= 0)
          .sort(
            (left, right) =>
              right.averageSimilarity - left.averageSimilarity ||
              left.clusterIndex - right.clusterIndex,
          )[0];

        return {
          clusterIndex: cluster.clusterIndex,
          memberId,
          name: getMemberName(memberById, memberId),
          nearestClusterIndex: nearestCluster?.clusterIndex ?? -1,
          nearestClusterSimilarity: nearestCluster?.averageSimilarity ?? -1,
        };
      })
      .filter(
        (
          cluster,
        ): cluster is {
          clusterIndex: number;
          memberId: string;
          name: string;
          nearestClusterIndex: number;
          nearestClusterSimilarity: number;
        } => cluster !== null && cluster.nearestClusterIndex >= 0,
      )
      .sort(
        (left, right) =>
          left.nearestClusterSimilarity - right.nearestClusterSimilarity ||
          left.name.localeCompare(right.name),
      )[0];

    if (!soloClusterCandidate) {
      break;
    }

    const soloCluster = clusters[soloClusterCandidate.clusterIndex];
    const targetCluster = clusters[soloClusterCandidate.nearestClusterIndex];

    if (!soloCluster || !targetCluster) {
      break;
    }

    targetCluster.push(soloClusterCandidate.memberId);
    const sortedTargetCluster = sortMemberIds(targetCluster, memberById);
    const nextClusters = clusters.filter(
      (_, clusterIndex) => clusterIndex !== soloClusterCandidate.clusterIndex,
    );
    const adjustedTargetClusterIndex =
      soloClusterCandidate.nearestClusterIndex > soloClusterCandidate.clusterIndex
        ? soloClusterCandidate.nearestClusterIndex - 1
        : soloClusterCandidate.nearestClusterIndex;
    nextClusters.splice(adjustedTargetClusterIndex, 1, sortedTargetCluster);
    clusters.splice(0, clusters.length, ...nextClusters);
  }

  return [...clusters].sort(
    (left, right) =>
      right.length - left.length ||
      getAverageClusterAffinity(pairLookup, right) - getAverageClusterAffinity(pairLookup, left) ||
      getClusterLeadName(left, memberById).localeCompare(getClusterLeadName(right, memberById)),
  );
}

function countSharedPriorityVotes(
  attraction: TripAttractionPreference,
  clusterMemberIds: string[],
): { mustDoVotes: number; priorityVotes: number; averageTier: number } {
  const clusterTiers = clusterMemberIds.map((memberId) => getMemberTier(attraction, memberId));
  const mustDoVotes = clusterTiers.filter((tier) => tier === 1).length;
  const priorityVotes = clusterTiers.filter((tier) => tier <= 2).length;
  const averageTier =
    clusterTiers.reduce((total, tier) => total + tier, 0) / Math.max(clusterTiers.length, 1);

  return {
    mustDoVotes,
    priorityVotes,
    averageTier,
  };
}

function getClusterSharedFavorites(
  clusterMemberIds: string[],
  attractions: TripAttractionPreference[],
): PartyClusterFavorite[] {
  return attractions
    .map((attraction) => {
      const { mustDoVotes, priorityVotes, averageTier } = countSharedPriorityVotes(
        attraction,
        clusterMemberIds,
      );

      return {
        attractionLabel: attraction.attractionLabel,
        parkLabel: attraction.parkLabel,
        consensusScore: attraction.consensusScore,
        averageTier,
        mustDoVotes,
        priorityVotes,
      };
    })
    .filter((attraction) => attraction.priorityVotes / clusterMemberIds.length >= 0.5)
    .sort(
      (left, right) =>
        right.priorityVotes - left.priorityVotes ||
        right.mustDoVotes - left.mustDoVotes ||
        left.averageTier - right.averageTier ||
        right.consensusScore - left.consensusScore ||
        left.attractionLabel.localeCompare(right.attractionLabel),
    )
    .map(({ attractionLabel, parkLabel, priorityVotes, mustDoVotes }) => ({
      attractionLabel,
      parkLabel,
      priorityVotes,
      mustDoVotes,
    }));
}

function getTopAnchorAttraction(
  clusterMemberIds: string[],
  attractions: TripAttractionPreference[],
  sharedFavorites: PartyClusterFavorite[],
): { attractionLabel: string; parkLabel: string } {
  if (sharedFavorites.length > 0) {
    const leadFavorite = sharedFavorites[0];

    if (leadFavorite) {
      return {
        attractionLabel: leadFavorite.attractionLabel,
        parkLabel: leadFavorite.parkLabel,
      };
    }
  }

  const fallbackAttraction = [...attractions]
    .map((attraction) => {
      const { averageTier } = countSharedPriorityVotes(attraction, clusterMemberIds);

      return {
        attractionLabel: attraction.attractionLabel,
        parkLabel: attraction.parkLabel,
        averageTier,
        consensusScore: attraction.consensusScore,
      };
    })
    .sort(
      (left, right) =>
        left.averageTier - right.averageTier ||
        right.consensusScore - left.consensusScore ||
        left.attractionLabel.localeCompare(right.attractionLabel),
    )[0];

  return {
    attractionLabel: fallbackAttraction?.attractionLabel ?? 'No anchor attraction yet',
    parkLabel: fallbackAttraction?.parkLabel ?? 'Unassigned park',
  };
}

function getDominantParkLabel(
  sharedFavorites: PartyClusterFavorite[],
  fallbackParkLabel: string,
): string {
  if (sharedFavorites.length === 0) {
    return fallbackParkLabel;
  }

  const parkStats = new Map<string, { count: number; voteTotal: number }>();

  for (const favorite of sharedFavorites) {
    const current = parkStats.get(favorite.parkLabel) ?? { count: 0, voteTotal: 0 };
    parkStats.set(favorite.parkLabel, {
      count: current.count + 1,
      voteTotal: current.voteTotal + favorite.priorityVotes,
    });
  }

  return (
    [...parkStats.entries()].sort(
      (left, right) =>
        right[1].count - left[1].count ||
        right[1].voteTotal - left[1].voteTotal ||
        left[0].localeCompare(right[0]),
    )[0]?.[0] ?? fallbackParkLabel
  );
}

function formatMemberNames(memberNames: string[]): string {
  const firstMemberName = memberNames[0] ?? 'This group';
  const secondMemberName = memberNames[1] ?? firstMemberName;

  if (memberNames.length === 0) {
    return 'This group';
  }

  if (memberNames.length === 1) {
    return firstMemberName;
  }

  if (memberNames.length === 2) {
    return `${firstMemberName} and ${secondMemberName}`;
  }

  return `${firstMemberName}, ${secondMemberName}, and ${String(memberNames.length - 2)} others`;
}

function getClusterTitle(
  memberNames: string[],
  sharedFavorites: PartyClusterFavorite[],
  topAnchorAttraction: string,
): string {
  const firstMemberName = memberNames[0] ?? 'This group';

  if (memberNames.length === 1) {
    return `${firstMemberName}'s lane`;
  }

  if (sharedFavorites.length >= 2) {
    const firstFavorite = sharedFavorites[0];
    const secondFavorite = sharedFavorites[1];

    if (firstFavorite && secondFavorite) {
      const combinedTitle = `${firstFavorite.attractionLabel} + ${secondFavorite.attractionLabel}`;

      if (combinedTitle.length <= 42) {
        return combinedTitle;
      }
    }
  }

  return `${topAnchorAttraction} cluster`;
}

function getClusterDescription(
  memberNames: string[],
  topAnchorAttraction: string,
  dominantParkLabel: string,
): string {
  const firstMemberName = memberNames[0] ?? 'This group';

  if (memberNames.length === 1) {
    return `${firstMemberName} breaks from the pack around ${topAnchorAttraction} and a more ${dominantParkLabel}-leaning ride mix.`;
  }

  return `${formatMemberNames(memberNames)} line up most closely around ${topAnchorAttraction}, with ${dominantParkLabel} carrying the strongest overlap.`;
}

function getAttractionMustDoVoteCount(attraction: TripAttractionPreference): number {
  return Object.values(attraction.preferenceByPartyMemberId).filter((tier) => tier === 1).length;
}

function buildSharedPriorityAttractions(
  attractions: TripAttractionPreference[],
): PartySharedPriorityAttraction[] {
  return [...attractions]
    .map((attraction) => ({
      attractionLabel: attraction.attractionLabel,
      parkLabel: attraction.parkLabel,
      mustDoVotes: getAttractionMustDoVoteCount(attraction),
      consensusScore: attraction.consensusScore,
    }))
    .sort(
      (left, right) =>
        right.mustDoVotes - left.mustDoVotes ||
        right.consensusScore - left.consensusScore ||
        left.attractionLabel.localeCompare(right.attractionLabel),
    )
    .slice(0, SHARED_PRIORITY_LIMIT);
}

function buildClusterRailItems(
  sharedPriorityAttractions: PartySharedPriorityAttraction[],
): PartyClusterRailItem[] {
  return sharedPriorityAttractions.map((attraction, index) => ({
    badge: `#${String(index + 1)}`,
    detail: `${String(attraction.mustDoVotes)} must-do calls • ${String(attraction.consensusScore)} points • ${attraction.parkLabel}`,
    title: attraction.attractionLabel,
  }));
}

function buildCohortContrastView(
  attractions: TripAttractionPreference[],
  kidsMemberIds: string[],
  adultsMemberIds: string[],
  kidsLabel: string,
  adultsLabel: string,
): {
  headlineInsight: PartyClusterHeadlineInsight;
  railItems: PartyClusterRailItem[];
} {
  const contrastAttractions = [...attractions]
    .map((attraction) => {
      const kidsStats = getPriorityVotesForMembers(attraction, kidsMemberIds);
      const adultsStats = getPriorityVotesForMembers(attraction, adultsMemberIds);
      const kidsShare = kidsStats.priorityVotes / Math.max(kidsMemberIds.length, 1);
      const adultsShare = adultsStats.priorityVotes / Math.max(adultsMemberIds.length, 1);
      const shareGap = Math.abs(kidsShare - adultsShare);
      const averageTierGap = Math.abs(kidsStats.averageTier - adultsStats.averageTier) / 4;
      const leaningLabel =
        kidsShare > adultsShare ||
        (kidsShare === adultsShare && kidsStats.averageTier < adultsStats.averageTier)
          ? kidsLabel
          : adultsLabel;

      return {
        attractionLabel: attraction.attractionLabel,
        gapScore: shareGap * 0.7 + averageTierGap * 0.3,
        leaningLabel,
        parkLabel: attraction.parkLabel,
        adultsPriorityVotes: adultsStats.priorityVotes,
        adultsSize: adultsMemberIds.length,
        consensusScore: attraction.consensusScore,
        kidsPriorityVotes: kidsStats.priorityVotes,
        kidsSize: kidsMemberIds.length,
      };
    })
    .sort(
      (left, right) =>
        right.gapScore - left.gapScore ||
        right.consensusScore - left.consensusScore ||
        left.attractionLabel.localeCompare(right.attractionLabel),
    );

  const topContrast = contrastAttractions[0];
  const contrastingPick = contrastAttractions.find(
    (attraction) => attraction.leaningLabel !== topContrast?.leaningLabel,
  );
  const curatedContrasts = [topContrast, contrastingPick, ...contrastAttractions].filter(
    (attraction, index, array): attraction is (typeof contrastAttractions)[number] =>
      attraction !== undefined &&
      array.findIndex((candidate) => candidate?.attractionLabel === attraction.attractionLabel) ===
        index,
  );

  return {
    headlineInsight: {
      eyebrow: 'Sharpest split',
      title: `${topContrast?.leaningLabel ?? kidsLabel} lean hardest toward ${topContrast?.attractionLabel ?? 'the current top contrast'}`,
      detail: `${String(topContrast?.kidsPriorityVotes ?? 0)}/${String(topContrast?.kidsSize ?? 0)} kids marked it Must Do or Preferred, versus ${String(topContrast?.adultsPriorityVotes ?? 0)}/${String(topContrast?.adultsSize ?? 0)} adults.`,
    },
    railItems: curatedContrasts.slice(0, 4).map((attraction) => ({
      badge: attraction.leaningLabel,
      detail: `${String(attraction.kidsPriorityVotes)}/${String(attraction.kidsSize)} kids priority • ${String(attraction.adultsPriorityVotes)}/${String(attraction.adultsSize)} adults priority • ${attraction.parkLabel}`,
      title: attraction.attractionLabel,
    })),
  };
}

function buildClusterCard(
  id: string,
  eyebrow: string,
  memberIds: string[],
  memberById: Map<string, TripPartyMember>,
  pairLookup: Map<string, PartyAffinityPair>,
  attractions: TripAttractionPreference[],
  descriptionOverride?: string,
): PartyClusterCard {
  const memberNames = memberIds.map((memberId) => memberById.get(memberId)?.name ?? memberId);
  const sharedFavorites = getClusterSharedFavorites(memberIds, attractions);
  const topAnchor = getTopAnchorAttraction(memberIds, attractions, sharedFavorites);
  const dominantParkLabel = getDominantParkLabel(sharedFavorites, topAnchor.parkLabel);

  return {
    averageAffinityScore: getAverageClusterAffinity(pairLookup, memberIds),
    description:
      descriptionOverride ??
      getClusterDescription(memberNames, topAnchor.attractionLabel, dominantParkLabel),
    dominantParkLabel,
    eyebrow,
    id,
    memberIds,
    memberNames,
    sharedFavorites,
    size: memberIds.length,
    title: getClusterTitle(memberNames, sharedFavorites, topAnchor.attractionLabel),
    topAnchorAttraction: topAnchor.attractionLabel,
    topAnchorParkLabel: topAnchor.parkLabel,
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

export function getPartyClusterView(module: TripDataModule): PartyClusterView {
  const memberById = new Map(module.party.map((member) => [member.id, member]));
  const pairs = buildAffinityPairs(module.party, module.attractions);
  const pairLookup = buildPairLookup(pairs);
  const sharedPriorityAttractions = buildSharedPriorityAttractions(module.attractions);
  const cohortPreset = getCohortPreset(module);

  if (cohortPreset) {
    const kidsMemberIds = sortMemberIds(cohortPreset.kidMemberIds, memberById);
    const adultsMemberIds = sortMemberIds(
      module.party
        .map((member) => member.id)
        .filter((memberId) => !cohortPreset.kidMemberIds.includes(memberId)),
      memberById,
    );
    const cohortDescriptions = getCohortDescriptions(
      getTopAnchorAttraction(
        kidsMemberIds,
        module.attractions,
        getClusterSharedFavorites(kidsMemberIds, module.attractions),
      ).attractionLabel,
      getTopAnchorAttraction(
        adultsMemberIds,
        module.attractions,
        getClusterSharedFavorites(adultsMemberIds, module.attractions),
      ).attractionLabel,
    );
    const cohortContrastView = buildCohortContrastView(
      module.attractions,
      kidsMemberIds,
      adultsMemberIds,
      cohortPreset.kidsLabel,
      cohortPreset.adultsLabel,
    );

    return {
      clusters: [
        buildClusterCard(
          'cohort-kids',
          cohortPreset.kidsLabel,
          kidsMemberIds,
          memberById,
          pairLookup,
          module.attractions,
          cohortDescriptions.kidsDescription,
        ),
        buildClusterCard(
          'cohort-adults',
          cohortPreset.adultsLabel,
          adultsMemberIds,
          memberById,
          pairLookup,
          module.attractions,
          cohortDescriptions.adultsDescription,
        ),
      ],
      headlineInsight: cohortContrastView.headlineInsight,
      mode: 'cohorts',
      pairs,
      railEyebrow: 'Kid vs adult gaps',
      railItems: cohortContrastView.railItems,
      railTitle: 'Where the two groups pull the day in different directions',
      sharedPriorityAttractions,
    };
  }

  const clusterMemberIds = buildClusterMemberIds(
    module.party,
    pairLookup,
    pairs,
    module.attractions,
  );

  return {
    headlineInsight: null,
    mode: 'clusters',
    pairs,
    railEyebrow: 'Shared priorities',
    railItems: buildClusterRailItems(sharedPriorityAttractions),
    railTitle: 'Must-do pressure that still moves the whole board',
    clusters: clusterMemberIds.map((memberIds, index) =>
      buildClusterCard(
        `cluster-${String(index + 1)}`,
        'Affinity cluster',
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
  const counts = createEmptyTierCounts();

  for (const attraction of attractions) {
    counts[getMemberTier(attraction, memberId)] += 1;
  }

  return counts;
}
