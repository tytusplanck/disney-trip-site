import type {
  PartyClusterAnalysis,
  PartyClusterAnalysisGroup,
  PartyClusterFavorite,
  PartySharedPriorityAttraction,
} from './party-analytics';
import { getPartyClusterAnalysis } from './party-analytics';
import type { TripDataModule } from './types';

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

export interface PartyClusterBoardView {
  headlineInsight: PartyClusterHeadlineInsight | null;
  railEyebrow: string;
  railItems: PartyClusterRailItem[];
  railTitle: string;
  clusters: PartyClusterCard[];
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

function getClusterDescription(cluster: PartyClusterAnalysisGroup): string {
  const firstMemberName = cluster.memberNames[0] ?? 'This group';

  if (cluster.memberNames.length === 1) {
    return `${firstMemberName} breaks from the pack around ${cluster.topAnchorAttraction} and a more ${cluster.dominantParkLabel}-leaning ride mix.`;
  }

  if (cluster.label) {
    return `${cluster.label} line up most closely around ${cluster.topAnchorAttraction}, with ${cluster.dominantParkLabel} carrying the strongest overlap.`;
  }

  return `${formatMemberNames(cluster.memberNames)} line up most closely around ${cluster.topAnchorAttraction}, with ${cluster.dominantParkLabel} carrying the strongest overlap.`;
}

function buildClusterCard(cluster: PartyClusterAnalysisGroup): PartyClusterCard {
  return {
    averageAffinityScore: cluster.averageAffinityScore,
    description: getClusterDescription(cluster),
    dominantParkLabel: cluster.dominantParkLabel,
    eyebrow: cluster.label ?? 'Affinity cluster',
    id: cluster.id,
    memberIds: cluster.memberIds,
    memberNames: cluster.memberNames,
    sharedFavorites: cluster.sharedFavorites,
    size: cluster.size,
    title: getClusterTitle(
      cluster.memberNames,
      cluster.sharedFavorites,
      cluster.topAnchorAttraction,
    ),
    topAnchorAttraction: cluster.topAnchorAttraction,
    topAnchorParkLabel: cluster.topAnchorParkLabel,
  };
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

function getNamedCohortRailEyebrow(clusters: PartyClusterAnalysisGroup[]): string {
  const labels = clusters
    .map((cluster) => cluster.label)
    .filter((label): label is string => typeof label === 'string');
  const normalizedLabels = new Set(labels.map((label) => label.toLowerCase()));
  const [firstLabel, secondLabel] = labels;

  if (normalizedLabels.has('kids') && normalizedLabels.has('adults')) {
    return 'Kid vs adult gaps';
  }

  return labels.length === 2 && firstLabel && secondLabel
    ? `${firstLabel} vs ${secondLabel} gaps`
    : 'Cohort gaps';
}

function buildCohortHeadlineInsight(
  analysis: PartyClusterAnalysis,
): PartyClusterHeadlineInsight | null {
  const topContrast = analysis.cohortContrasts?.[0];

  if (!topContrast) {
    return null;
  }

  return {
    eyebrow: 'Sharpest split',
    title: `${topContrast.leadingCohortLabel} lean hardest toward ${topContrast.attractionLabel}`,
    detail: `${String(topContrast.leadingPriorityVotes)}/${String(topContrast.leadingSize)} ${topContrast.leadingCohortLabel} marked it Must Do or Preferred, versus ${String(topContrast.trailingPriorityVotes)}/${String(topContrast.trailingSize)} ${topContrast.trailingCohortLabel}.`,
  };
}

function buildCohortRailItems(analysis: PartyClusterAnalysis): PartyClusterRailItem[] {
  const [topContrast] = analysis.cohortContrasts ?? [];
  const contrastingPick = analysis.cohortContrasts?.find(
    (contrast) => contrast.leadingCohortLabel !== topContrast?.leadingCohortLabel,
  );
  const curatedContrasts = [topContrast, contrastingPick, ...(analysis.cohortContrasts ?? [])]
    .filter(
      (contrast, index, array): contrast is NonNullable<typeof topContrast> =>
        contrast !== undefined &&
        array.findIndex((candidate) => candidate?.attractionLabel === contrast.attractionLabel) ===
          index,
    )
    .slice(0, 4);

  return curatedContrasts.map((contrast) => ({
    badge: contrast.leadingCohortLabel,
    detail: `${String(contrast.leadingPriorityVotes)}/${String(contrast.leadingSize)} ${contrast.leadingCohortLabel} priority • ${String(contrast.trailingPriorityVotes)}/${String(contrast.trailingSize)} ${contrast.trailingCohortLabel} priority • ${contrast.parkLabel}`,
    title: contrast.attractionLabel,
  }));
}

export function buildPartyClusterBoardViewFromAnalysis(
  analysis: PartyClusterAnalysis,
): PartyClusterBoardView {
  if (analysis.mode === 'named-cohorts') {
    return {
      clusters: analysis.clusters.map(buildClusterCard),
      headlineInsight: buildCohortHeadlineInsight(analysis),
      railEyebrow: getNamedCohortRailEyebrow(analysis.clusters),
      railItems: buildCohortRailItems(analysis),
      railTitle: 'Where the two groups pull the day in different directions',
    };
  }

  return {
    clusters: analysis.clusters.map(buildClusterCard),
    headlineInsight: null,
    railEyebrow: 'Shared priorities',
    railItems: buildClusterRailItems(analysis.sharedPriorityAttractions),
    railTitle: 'Must-do pressure that still moves the whole board',
  };
}

export function buildPartyClusterBoardView(module: TripDataModule): PartyClusterBoardView {
  return buildPartyClusterBoardViewFromAnalysis(getPartyClusterAnalysis(module));
}
