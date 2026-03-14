import type {
  PartyClusterAnalysis,
  PartyClusterAnalysisGroup,
  PartyCohortContrast,
} from './party-analytics';
import { getPartyClusterAnalysis } from './party-analytics';
import type { TripDataModule } from './types';

export interface PartySummaryCluster {
  id: string;
  anchorAttraction: string;
  affinityValue: string;
  label: string;
  memberSummary: string;
}

export interface PartySummaryGapItem {
  badge: string;
  detail: string;
  title: string;
}

export interface PartySummaryHeadlineInsight {
  detail: string;
  eyebrow: string;
  title: string;
}

export interface PartySummaryView {
  headlineInsight: PartySummaryHeadlineInsight | null;
  clusters: PartySummaryCluster[];
  gapItems: PartySummaryGapItem[];
}

function formatMemberSummary(memberNames: string[]): string {
  if (memberNames.length === 0) {
    return 'No travelers grouped yet';
  }

  if (memberNames.length <= 3) {
    return memberNames.join(', ');
  }

  return `${memberNames.slice(0, 2).join(', ')}, +${String(memberNames.length - 2)} more`;
}

function getClusterLabel(cluster: PartyClusterAnalysisGroup): string {
  if (cluster.label) {
    return cluster.label;
  }

  if (cluster.size === 1) {
    return cluster.memberNames[0] ?? 'Solo lane';
  }

  return `${cluster.memberNames[0] ?? 'Group'} cluster`;
}

function buildCluster(cluster: PartyClusterAnalysisGroup): PartySummaryCluster {
  return {
    id: cluster.id,
    anchorAttraction: cluster.topAnchorAttraction,
    affinityValue:
      cluster.size === 1 ? 'Solo lane' : `${String(cluster.averageAffinityScore)}% aligned`,
    label: getClusterLabel(cluster),
    memberSummary: formatMemberSummary(cluster.memberNames),
  };
}

function buildHeadlineInsight(
  contrast: PartyCohortContrast | undefined,
): PartySummaryHeadlineInsight | null {
  if (!contrast) {
    return null;
  }

  return {
    eyebrow: 'Sharpest split',
    title: `${contrast.leadingCohortLabel} lean hardest toward ${contrast.attractionLabel}`,
    detail: `${String(contrast.leadingPriorityVotes)}/${String(contrast.leadingSize)} ${contrast.leadingCohortLabel} priority vs ${String(contrast.trailingPriorityVotes)}/${String(contrast.trailingSize)} ${contrast.trailingCohortLabel} in ${contrast.parkLabel}.`,
  };
}

function buildGapItems(analysis: PartyClusterAnalysis): PartySummaryGapItem[] {
  if (analysis.cohortContrasts) {
    return analysis.cohortContrasts.slice(0, 4).map((contrast) => ({
      badge: contrast.leadingCohortLabel,
      detail: `${String(contrast.leadingPriorityVotes)}/${String(contrast.leadingSize)} priority vs ${String(contrast.trailingPriorityVotes)}/${String(contrast.trailingSize)} • ${contrast.parkLabel}`,
      title: contrast.attractionLabel,
    }));
  }

  return analysis.sharedPriorityAttractions.slice(0, 4).map((attraction) => ({
    badge: 'Shared',
    detail: `${String(attraction.mustDoVotes)} must-do calls • ${attraction.parkLabel}`,
    title: attraction.attractionLabel,
  }));
}

export function buildPartySummaryViewFromAnalysis(
  analysis: PartyClusterAnalysis,
): PartySummaryView {
  return {
    headlineInsight: buildHeadlineInsight(analysis.cohortContrasts?.[0]),
    clusters: analysis.clusters.map(buildCluster),
    gapItems: buildGapItems(analysis),
  };
}

export function buildPartySummaryView(module: TripDataModule): PartySummaryView {
  return buildPartySummaryViewFromAnalysis(getPartyClusterAnalysis(module));
}
