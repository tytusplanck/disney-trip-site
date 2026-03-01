import type { AttractionHeatmapRow } from './details';
import type { PreferenceTier, TripDataModule, TripPartyMember, TripScheduleEntry } from './types';

type AttractionTone = 'high' | 'medium' | 'low';
type GroupSentiment = 'all' | 'high' | 'medium' | 'low';

interface AttractionsExplorerSummaryCard {
  label: string;
  value: string;
  detail: string;
}

interface AttractionsExplorerParkSummary {
  parkLabel: string;
  attractionCount: number;
  averageScorePercent: number;
  highConsensusCount: number;
}

export interface AttractionsExplorerAttraction {
  id: string;
  attractionLabel: string;
  parkLabel: string;
  areaLabel: string;
  consensusScore: number;
  maxScore: number;
  scorePercent: number;
  mustDoVotes: number;
  preferredVotes: number;
  tone: AttractionTone;
  memberTiers: Record<string, PreferenceTier>;
  ratingVariance: number;
}

export interface AttractionsExplorerDayPreset {
  id: string;
  dayNumber: number;
  weekdayLabel: string;
  dateLabel: string;
  parkLabel: string;
  notes: string | null;
}

export interface AttractionsExplorerState {
  selectedDayId: string | null;
  parkLabel: string | null;
  areaLabel: string | null;
  memberId: string | null;
  sentiment: GroupSentiment | PreferenceTier;
  search: string;
}

export interface AttractionsExplorerAreaBreakdown {
  areaLabel: string;
  attractionCount: number;
  averageScorePercent: number;
  highConsensusCount: number;
}

export interface AttractionsExplorerData {
  tripTitle: string;
  party: TripPartyMember[];
  dayPresets: AttractionsExplorerDayPreset[];
  attractions: AttractionsExplorerAttraction[];
  parkLabels: string[];
  parkSummaries: AttractionsExplorerParkSummary[];
}

export interface AttractionsExplorerView {
  activeDayPreset: AttractionsExplorerDayPreset | null;
  activeMember: TripPartyMember | null;
  mode: 'group' | 'traveler';
  contextHeading: string;
  contextDetail: string;
  summaryCards: AttractionsExplorerSummaryCard[];
  topPicks: AttractionsExplorerAttraction[];
  broadApproval: AttractionsExplorerAttraction[];
  splitDecisions: AttractionsExplorerAttraction[];
  areaBreakdown: AttractionsExplorerAreaBreakdown[];
  rankedAttractions: AttractionsExplorerAttraction[];
  heatmapRows: AttractionHeatmapRow[];
  availableAreas: string[];
  hasResults: boolean;
}

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

function getTone(scorePercent: number): AttractionTone {
  if (scorePercent >= 74) {
    return 'high';
  }

  if (scorePercent >= 58) {
    return 'medium';
  }

  return 'low';
}

function countTier(memberTiers: Record<string, PreferenceTier>, tier: PreferenceTier): number {
  return Object.values(memberTiers).filter((value) => value === tier).length;
}

function getRatingVariance(ratings: readonly PreferenceTier[]): number {
  if (ratings.length === 0) {
    return 0;
  }

  const average = ratings.reduce((total, rating) => total + rating, 0) / ratings.length;

  const variance =
    ratings.reduce((total, rating) => total + (rating - average) ** 2, 0) / ratings.length;

  return Math.round(variance * 100) / 100;
}

function getHeatmapRows(
  party: readonly TripPartyMember[],
  attractions: readonly AttractionsExplorerAttraction[],
): AttractionHeatmapRow[] {
  return attractions.map((attraction) => ({
    id: attraction.id,
    attractionLabel: attraction.attractionLabel,
    areaLabel: attraction.areaLabel,
    parkLabel: attraction.parkLabel,
    consensusScore: attraction.consensusScore,
    ratings: party.map((member) => ({
      memberId: member.id,
      memberName: member.name,
      tier: attraction.memberTiers[member.id] ?? 3,
    })),
  }));
}

function buildDayPreset(entry: TripScheduleEntry, dayNumber: number): AttractionsExplorerDayPreset {
  const date = new Date(`${entry.date}T12:00:00`);

  return {
    id: `park-day-${entry.date}`,
    dayNumber,
    weekdayLabel: WEEKDAY_FORMATTER.format(date),
    dateLabel: DATE_FORMATTER.format(date),
    parkLabel: entry.parkLabel ?? entry.label,
    notes: entry.notes,
  };
}

function getOrderedParkLabels(
  dayPresets: readonly AttractionsExplorerDayPreset[],
  attractions: readonly AttractionsExplorerAttraction[],
): string[] {
  return Array.from(
    new Set([
      ...dayPresets.map((preset) => preset.parkLabel),
      ...attractions.map((attraction) => attraction.parkLabel),
    ]),
  );
}

function getParkSummaries(
  attractions: readonly AttractionsExplorerAttraction[],
): AttractionsExplorerParkSummary[] {
  const groups = new Map<string, AttractionsExplorerAttraction[]>();

  attractions.forEach((attraction) => {
    const group = groups.get(attraction.parkLabel);

    if (group) {
      group.push(attraction);
      return;
    }

    groups.set(attraction.parkLabel, [attraction]);
  });

  return [...groups.entries()]
    .map(([parkLabel, parkAttractions]) => {
      const averageScorePercent = Math.round(
        parkAttractions.reduce((total, attraction) => total + attraction.scorePercent, 0) /
          parkAttractions.length,
      );

      return {
        parkLabel,
        attractionCount: parkAttractions.length,
        averageScorePercent,
        highConsensusCount: parkAttractions.filter((attraction) => attraction.tone === 'high')
          .length,
      };
    })
    .sort(
      (left, right) =>
        right.averageScorePercent - left.averageScorePercent ||
        right.attractionCount - left.attractionCount ||
        left.parkLabel.localeCompare(right.parkLabel),
    );
}

function getMemberTier(
  attraction: AttractionsExplorerAttraction,
  memberId: string,
): PreferenceTier {
  return attraction.memberTiers[memberId] ?? 3;
}

function sortGroupAttractions(
  attractions: readonly AttractionsExplorerAttraction[],
): AttractionsExplorerAttraction[] {
  return [...attractions].sort(
    (left, right) =>
      right.consensusScore - left.consensusScore ||
      right.mustDoVotes - left.mustDoVotes ||
      left.attractionLabel.localeCompare(right.attractionLabel),
  );
}

function sortTravelerAttractions(
  attractions: readonly AttractionsExplorerAttraction[],
  memberId: string,
): AttractionsExplorerAttraction[] {
  return [...attractions].sort(
    (left, right) =>
      getMemberTier(left, memberId) - getMemberTier(right, memberId) ||
      right.consensusScore - left.consensusScore ||
      left.attractionLabel.localeCompare(right.attractionLabel),
  );
}

function getAvailableAreas(
  attractions: readonly AttractionsExplorerAttraction[],
  parkLabel: string | null,
): string[] {
  if (!parkLabel) {
    return [];
  }

  return Array.from(
    new Set(
      attractions
        .filter((attraction) => attraction.parkLabel === parkLabel)
        .map((attraction) => attraction.areaLabel),
    ),
  ).sort((left, right) => left.localeCompare(right));
}

function getAreaBreakdown(
  attractions: readonly AttractionsExplorerAttraction[],
): AttractionsExplorerAreaBreakdown[] {
  const groups = new Map<string, AttractionsExplorerAttraction[]>();

  attractions.forEach((attraction) => {
    const group = groups.get(attraction.areaLabel);

    if (group) {
      group.push(attraction);
      return;
    }

    groups.set(attraction.areaLabel, [attraction]);
  });

  return [...groups.entries()]
    .map(([areaLabel, areaAttractions]) => ({
      areaLabel,
      attractionCount: areaAttractions.length,
      averageScorePercent: Math.round(
        areaAttractions.reduce((total, attraction) => total + attraction.scorePercent, 0) /
          areaAttractions.length,
      ),
      highConsensusCount: areaAttractions.filter((attraction) => attraction.tone === 'high').length,
    }))
    .sort(
      (left, right) =>
        right.averageScorePercent - left.averageScorePercent ||
        right.attractionCount - left.attractionCount ||
        left.areaLabel.localeCompare(right.areaLabel),
    );
}

function getContextHeading(
  tripTitle: string,
  activeDayPreset: AttractionsExplorerDayPreset | null,
  parkLabel: string | null,
): string {
  if (activeDayPreset) {
    return `Day ${String(activeDayPreset.dayNumber)}: ${activeDayPreset.parkLabel}`;
  }

  if (parkLabel) {
    return `${parkLabel} board`;
  }

  return `${tripTitle} decision board`;
}

function getContextDetail(
  data: AttractionsExplorerData,
  activeDayPreset: AttractionsExplorerDayPreset | null,
  parkLabel: string | null,
  areaLabel: string | null,
  activeMember: TripPartyMember | null,
  search: string,
): string {
  const filters: string[] = [];

  if (activeDayPreset) {
    filters.push(`${activeDayPreset.weekdayLabel} ${activeDayPreset.dateLabel}`);

    if (activeDayPreset.notes) {
      filters.push(activeDayPreset.notes);
    }
  } else if (parkLabel) {
    filters.push(`Focused on ${parkLabel}`);
  } else {
    filters.push(
      `Showing all ${String(data.attractions.length)} scored rides across ${String(data.parkLabels.length)} parks`,
    );
  }

  if (areaLabel) {
    filters.push(areaLabel);
  }

  filters.push(activeMember ? `${activeMember.name}'s preferences` : 'Whole-group consensus');

  if (search.length > 0) {
    filters.push(`Search: "${search}"`);
  }

  return filters.join(' / ');
}

function getSummaryCards(
  filteredAttractions: readonly AttractionsExplorerAttraction[],
  data: AttractionsExplorerData,
  areaBreakdown: readonly AttractionsExplorerAreaBreakdown[],
): AttractionsExplorerSummaryCard[] {
  const [topSignal] = filteredAttractions;
  const [mostDivisiveRide] = [...filteredAttractions].sort(
    (left, right) =>
      right.ratingVariance - left.ratingVariance ||
      right.consensusScore - left.consensusScore ||
      left.attractionLabel.localeCompare(right.attractionLabel),
  );
  const highConfidenceRides = filteredAttractions.filter(
    (attraction) => attraction.tone === 'high',
  );

  return [
    {
      label: 'Matching rides',
      value: String(filteredAttractions.length),
      detail:
        filteredAttractions.length > 0
          ? `${String(areaBreakdown.length)} area${areaBreakdown.length === 1 ? '' : 's'} currently in scope`
          : 'No rides match the current filter stack',
    },
    {
      label: 'Top signal',
      value: topSignal?.attractionLabel ?? '--',
      detail: topSignal
        ? `${String(topSignal.consensusScore)}/${String(topSignal.maxScore)} with ${String(topSignal.mustDoVotes)} must-do calls`
        : 'Adjust filters to restore the leaderboard',
    },
    {
      label: 'High-confidence rides',
      value: String(highConfidenceRides.length),
      detail:
        filteredAttractions.length > 0
          ? `${String(Math.round((highConfidenceRides.length / filteredAttractions.length) * 100))}% of results land in the high band`
          : 'No high-confidence rides in the current slice',
    },
    {
      label: 'Most divisive ride',
      value: mostDivisiveRide?.attractionLabel ?? '--',
      detail: mostDivisiveRide
        ? `Variance ${mostDivisiveRide.ratingVariance.toFixed(2)} across ${String(data.party.length)} travelers`
        : 'No divisive ride available in this slice',
    },
  ];
}

export function buildAttractionsExplorerData(module: TripDataModule): AttractionsExplorerData {
  const maxScore = module.party.length * 5;

  const attractions = module.attractions.map((attraction) => {
    const memberTiers = module.party.reduce<Record<string, PreferenceTier>>((tiers, member) => {
      tiers[member.id] = attraction.preferenceByPartyMemberId[member.id] ?? 3;
      return tiers;
    }, {});

    const ratings = module.party.map((member) => memberTiers[member.id] ?? 3);
    const scorePercent =
      maxScore === 0 ? 0 : Math.round((attraction.consensusScore / maxScore) * 100);

    return {
      id: attraction.id,
      attractionLabel: attraction.attractionLabel,
      parkLabel: attraction.parkLabel,
      areaLabel: attraction.areaLabel,
      consensusScore: attraction.consensusScore,
      maxScore,
      scorePercent,
      mustDoVotes: countTier(memberTiers, 1),
      preferredVotes: countTier(memberTiers, 2),
      tone: getTone(scorePercent),
      memberTiers,
      ratingVariance: getRatingVariance(ratings),
    };
  });

  const dayPresets = module.schedule.flatMap((entry, index) =>
    entry.kind === 'park' ? [buildDayPreset(entry, index + 1)] : [],
  );

  return {
    tripTitle: module.summary.title,
    party: module.party,
    dayPresets,
    attractions,
    parkLabels: getOrderedParkLabels(dayPresets, attractions),
    parkSummaries: getParkSummaries(attractions),
  };
}

export function deriveAttractionsExplorerView(
  data: AttractionsExplorerData,
  state: AttractionsExplorerState,
): AttractionsExplorerView {
  const activeDayPreset =
    data.dayPresets.find((preset) => preset.id === state.selectedDayId) ?? null;
  const parkLabel = activeDayPreset?.parkLabel ?? state.parkLabel;
  const availableAreas = getAvailableAreas(data.attractions, parkLabel);
  const areaLabel =
    parkLabel && state.areaLabel && availableAreas.includes(state.areaLabel)
      ? state.areaLabel
      : null;
  const activeMember = state.memberId
    ? (data.party.find((member) => member.id === state.memberId) ?? null)
    : null;
  const mode = activeMember ? 'traveler' : 'group';
  const activeMemberId = activeMember?.id ?? null;
  const normalizedSearch = state.search.trim().toLowerCase();

  const filteredByScope = data.attractions.filter((attraction) => {
    if (parkLabel && attraction.parkLabel !== parkLabel) {
      return false;
    }

    if (areaLabel && attraction.areaLabel !== areaLabel) {
      return false;
    }

    if (
      normalizedSearch.length > 0 &&
      !attraction.attractionLabel.toLowerCase().includes(normalizedSearch)
    ) {
      return false;
    }

    if (mode === 'group') {
      if (
        typeof state.sentiment === 'string' &&
        state.sentiment !== 'all' &&
        attraction.tone !== state.sentiment
      ) {
        return false;
      }

      return true;
    }

    if (!activeMemberId) {
      return true;
    }

    if (typeof state.sentiment === 'number') {
      return getMemberTier(attraction, activeMemberId) === state.sentiment;
    }

    return true;
  });

  const rankedAttractions =
    mode === 'traveler' && activeMemberId
      ? sortTravelerAttractions(filteredByScope, activeMemberId)
      : sortGroupAttractions(filteredByScope);

  const [topSignal] = rankedAttractions;
  const broadApproval = [...rankedAttractions]
    .filter((attraction) => attraction.id !== topSignal?.id)
    .sort(
      (left, right) =>
        right.preferredVotes - left.preferredVotes ||
        right.consensusScore - left.consensusScore ||
        left.attractionLabel.localeCompare(right.attractionLabel),
    )
    .slice(0, 3);
  const splitDecisions = [...rankedAttractions]
    .sort(
      (left, right) =>
        right.ratingVariance - left.ratingVariance ||
        right.consensusScore - left.consensusScore ||
        left.attractionLabel.localeCompare(right.attractionLabel),
    )
    .slice(0, 3);
  const areaBreakdown = getAreaBreakdown(rankedAttractions);
  const summaryCards = getSummaryCards(rankedAttractions, data, areaBreakdown);

  return {
    activeDayPreset,
    activeMember,
    mode,
    contextHeading: getContextHeading(data.tripTitle, activeDayPreset, parkLabel),
    contextDetail: getContextDetail(
      data,
      activeDayPreset,
      parkLabel,
      areaLabel,
      activeMember,
      state.search.trim(),
    ),
    summaryCards,
    topPicks: rankedAttractions.slice(0, 8),
    broadApproval,
    splitDecisions,
    areaBreakdown,
    rankedAttractions,
    heatmapRows: getHeatmapRows(data.party, rankedAttractions),
    availableAreas,
    hasResults: rankedAttractions.length > 0,
  };
}
