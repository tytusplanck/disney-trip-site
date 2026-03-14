import type { PreferenceTier, TripDataModule, TripPartyMember, TripScheduleEntry } from './types';

type AttractionTone = 'high' | 'medium' | 'low';

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
  memberId: string | null;
  search: string;
}

export interface AttractionsExplorerData {
  party: TripPartyMember[];
  dayPresets: AttractionsExplorerDayPreset[];
  attractions: AttractionsExplorerAttraction[];
}

export interface AttractionsExplorerView {
  activeDayPreset: AttractionsExplorerDayPreset | null;
  activeMember: TripPartyMember | null;
  scopeLabel: string;
  rankedAttractions: AttractionsExplorerAttraction[];
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

function getScopeLabel(
  activeDayPreset: AttractionsExplorerDayPreset | null,
  activeMember: TripPartyMember | null,
  search: string,
): string {
  const scopeParts = [
    activeDayPreset
      ? `Day ${String(activeDayPreset.dayNumber)}: ${activeDayPreset.parkLabel}`
      : 'All Park Days',
    activeMember ? activeMember.name : 'Whole Group',
  ];

  if (search.length > 0) {
    scopeParts.push(`Search: "${search}"`);
  }

  return scopeParts.join(' • ');
}

export function buildAttractionsExplorerData(module: TripDataModule): AttractionsExplorerData {
  const maxScore = module.party.length * 5;

  return {
    party: module.party,
    dayPresets: module.schedule.flatMap((entry, index) =>
      entry.kind === 'park' ? [buildDayPreset(entry, index + 1)] : [],
    ),
    attractions: module.attractions.map((attraction) => {
      const memberTiers = module.party.reduce<Record<string, PreferenceTier>>((tiers, member) => {
        tiers[member.id] = attraction.preferenceByPartyMemberId[member.id] ?? 3;
        return tiers;
      }, {});
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
      };
    }),
  };
}

export function deriveAttractionsExplorerView(
  data: AttractionsExplorerData,
  state: AttractionsExplorerState,
): AttractionsExplorerView {
  const activeDayPreset =
    data.dayPresets.find((preset) => preset.id === state.selectedDayId) ?? null;
  const activeMember = state.memberId
    ? (data.party.find((member) => member.id === state.memberId) ?? null)
    : null;
  const normalizedSearch = state.search.trim().toLowerCase();

  const filteredAttractions = data.attractions.filter((attraction) => {
    if (activeDayPreset && attraction.parkLabel !== activeDayPreset.parkLabel) {
      return false;
    }

    if (
      normalizedSearch.length > 0 &&
      !attraction.attractionLabel.toLowerCase().includes(normalizedSearch)
    ) {
      return false;
    }

    return true;
  });

  const rankedAttractions =
    activeMember && state.memberId
      ? sortTravelerAttractions(filteredAttractions, state.memberId)
      : sortGroupAttractions(filteredAttractions);

  return {
    activeDayPreset,
    activeMember,
    scopeLabel: getScopeLabel(activeDayPreset, activeMember, state.search.trim()),
    rankedAttractions,
    hasResults: rankedAttractions.length > 0,
  };
}
