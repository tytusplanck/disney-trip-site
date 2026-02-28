import type {
  PreferenceTier,
  TripAttractionPreference,
  TripDataModule,
  TripPartyMember,
  TripScheduleEntry,
} from './types';

export interface PreferenceMeta {
  tier: PreferenceTier;
  label: string;
  shortLabel: string;
  tone: 'must' | 'prefer' | 'indifferent' | 'avoid' | 'skip';
}

export interface AttractionHeatmapCell {
  memberId: string;
  memberName: string;
  tier: PreferenceTier;
}

export interface AttractionHeatmapRow {
  id: string;
  attractionLabel: string;
  areaLabel: string;
  parkLabel: string;
  consensusScore: number;
  ratings: AttractionHeatmapCell[];
}

export interface RankedAttraction extends TripAttractionPreference {
  maxScore: number;
  scorePercent: number;
  mustDoVotes: number;
  preferredVotes: number;
  tone: 'high' | 'medium' | 'low';
}

export interface PartyTierSummary {
  tier: PreferenceTier;
  label: string;
  count: number;
  maxCount: number;
}

export interface PartyMemberSummary {
  member: TripPartyMember;
  styleLabel: string;
  topChoices: string[];
  mustDoCount: number;
  enthusiasmCount: number;
  avoidCount: number;
  tierSummaries: PartyTierSummary[];
}

export interface PartyOverview {
  memberCount: number;
  averageMustDoCount: number;
  mostSelectiveMember: string | null;
  mostEnthusiasticMember: string | null;
}

export interface ScheduleOverview {
  parkDays: number;
  resortDays: number;
  travelDays: number;
  scheduledNotes: number;
  parkLineup: string[];
}

export interface ScheduleDaySummary {
  dayNumber: number;
  weekdayLabel: string;
  dateLabel: string;
  entry: TripScheduleEntry;
}

export interface ArchiveTripInsight {
  label: string;
  value: string;
  detail: string;
}

const PREFERENCE_META_BY_TIER: Record<PreferenceTier, PreferenceMeta> = {
  1: { tier: 1, label: 'Must Do', shortLabel: 'M', tone: 'must' },
  2: { tier: 2, label: 'Preferred', shortLabel: 'P', tone: 'prefer' },
  3: { tier: 3, label: 'Indifferent', shortLabel: '~', tone: 'indifferent' },
  4: { tier: 4, label: "Don't Want", shortLabel: 'X', tone: 'avoid' },
  5: { tier: 5, label: 'Will Skip', shortLabel: 'S', tone: 'skip' },
};

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

function getPreferenceTierCount(
  attraction: TripAttractionPreference,
  tier: PreferenceTier,
): number {
  return Object.values(attraction.preferenceByPartyMemberId).filter((value) => value === tier)
    .length;
}

function derivePartyStyleLabel(
  counts: Record<PreferenceTier, number>,
  totalAttractions: number,
): string {
  const enthusiasmRatio = (counts[1] + counts[2]) / totalAttractions;
  const avoidRatio = (counts[4] + counts[5]) / totalAttractions;
  const indifferentRatio = counts[3] / totalAttractions;

  if (counts[1] >= 15) {
    return 'Headline hunter';
  }

  if (avoidRatio >= 0.28) {
    return 'Selective rider';
  }

  if (enthusiasmRatio >= 0.58) {
    return 'All-in planner';
  }

  if (indifferentRatio >= 0.42) {
    return 'Flexible floater';
  }

  return 'Balanced explorer';
}

function getTopChoicesForMember(
  memberId: string,
  attractions: TripAttractionPreference[],
): string[] {
  return attractions
    .map((attraction) => ({
      attractionLabel: attraction.attractionLabel,
      tier: attraction.preferenceByPartyMemberId[memberId],
      consensusScore: attraction.consensusScore,
    }))
    .filter(
      (item): item is { attractionLabel: string; tier: PreferenceTier; consensusScore: number } =>
        item.tier !== undefined && item.tier <= 2,
    )
    .sort(
      (left, right) =>
        left.tier - right.tier ||
        right.consensusScore - left.consensusScore ||
        left.attractionLabel.localeCompare(right.attractionLabel),
    )
    .slice(0, 3)
    .map((item) => item.attractionLabel);
}

export function getPreferenceMeta(tier: PreferenceTier): PreferenceMeta {
  return PREFERENCE_META_BY_TIER[tier];
}

export function getPreferenceLegend(): PreferenceMeta[] {
  return Object.values(PREFERENCE_META_BY_TIER);
}

export function getAttractionHeatmapRows(
  party: TripPartyMember[],
  attractions: TripAttractionPreference[],
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
      tier: attraction.preferenceByPartyMemberId[member.id] ?? 3,
    })),
  }));
}

export function getRankedAttractions(
  attractions: TripAttractionPreference[],
  partySize: number,
): RankedAttraction[] {
  const maxScore = partySize * 5;

  return [...attractions]
    .sort(
      (left, right) =>
        right.consensusScore - left.consensusScore ||
        left.attractionLabel.localeCompare(right.attractionLabel),
    )
    .map((attraction) => {
      const scorePercent = Math.round((attraction.consensusScore / maxScore) * 100);

      return {
        ...attraction,
        maxScore,
        scorePercent,
        mustDoVotes: getPreferenceTierCount(attraction, 1),
        preferredVotes: getPreferenceTierCount(attraction, 2),
        tone: scorePercent >= 74 ? 'high' : scorePercent >= 58 ? 'medium' : 'low',
      };
    });
}

export function getAttractionMustDoVoteCount(attractions: TripAttractionPreference[]): number {
  return attractions.reduce(
    (total, attraction) => total + getPreferenceTierCount(attraction, 1),
    0,
  );
}

export function getPartySummaries(module: TripDataModule): PartyMemberSummary[] {
  const totalAttractions = module.attractions.length;

  return module.party.map((member) => {
    const counts: Record<PreferenceTier, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    module.attractions.forEach((attraction) => {
      const tier = attraction.preferenceByPartyMemberId[member.id] ?? 3;
      counts[tier] += 1;
    });

    return {
      member,
      styleLabel: derivePartyStyleLabel(counts, totalAttractions),
      topChoices: getTopChoicesForMember(member.id, module.attractions),
      mustDoCount: counts[1],
      enthusiasmCount: counts[1] + counts[2],
      avoidCount: counts[4] + counts[5],
      tierSummaries: ([1, 2, 3, 4, 5] as const).map((tier) => ({
        tier,
        label: getPreferenceMeta(tier).label,
        count: counts[tier],
        maxCount: totalAttractions,
      })),
    };
  });
}

export function getPartyOverview(summaries: PartyMemberSummary[]): PartyOverview {
  const mostSelectiveMember =
    [...summaries].sort(
      (left, right) =>
        right.avoidCount - left.avoidCount || left.member.name.localeCompare(right.member.name),
    )[0]?.member.name ?? null;

  const mostEnthusiasticMember =
    [...summaries].sort(
      (left, right) =>
        right.enthusiasmCount - left.enthusiasmCount ||
        left.member.name.localeCompare(right.member.name),
    )[0]?.member.name ?? null;

  const averageMustDoCount =
    summaries.length === 0
      ? 0
      : Math.round(
          summaries.reduce((total, summary) => total + summary.mustDoCount, 0) / summaries.length,
        );

  return {
    memberCount: summaries.length,
    averageMustDoCount,
    mostSelectiveMember,
    mostEnthusiasticMember,
  };
}

export function getScheduleOverview(schedule: TripScheduleEntry[]): ScheduleOverview {
  const parkLineup = schedule.flatMap((entry) => (entry.parkLabel ? [entry.parkLabel] : []));

  return {
    parkDays: schedule.filter((entry) => entry.kind === 'park').length,
    resortDays: schedule.filter((entry) => entry.kind === 'resort').length,
    travelDays: schedule.filter((entry) => entry.kind === 'travel').length,
    scheduledNotes: schedule.filter((entry) => entry.notes !== null).length,
    parkLineup: Array.from(new Set(parkLineup)),
  };
}

export function getScheduleDaySummaries(schedule: TripScheduleEntry[]): ScheduleDaySummary[] {
  return schedule.map((entry, index) => {
    const date = new Date(`${entry.date}T12:00:00`);

    return {
      dayNumber: index + 1,
      weekdayLabel: WEEKDAY_FORMATTER.format(date),
      dateLabel: DATE_FORMATTER.format(date),
      entry,
    };
  });
}

export function getArchiveTripInsights(module: TripDataModule): ArchiveTripInsight[] {
  if (
    module.attractions.length === 0 &&
    module.schedule.length === 0 &&
    module.party.length === 0
  ) {
    return [];
  }

  const scheduleOverview = getScheduleOverview(module.schedule);
  const partySummaries = getPartySummaries(module);
  const partyOverview = getPartyOverview(partySummaries);
  const rankedAttractions = getRankedAttractions(module.attractions, module.party.length);
  const highConsensusCount = rankedAttractions.filter(
    (attraction) => attraction.consensusScore >= 45,
  ).length;

  return [
    {
      label: 'Cadence',
      value: `${String(scheduleOverview.parkDays)} park / ${String(scheduleOverview.resortDays)} resort`,
      detail: `${String(scheduleOverview.travelDays)} travel day${scheduleOverview.travelDays === 1 ? '' : 's'} on the edges`,
    },
    {
      label: 'Crew Pulse',
      value: partyOverview.mostEnthusiasticMember ?? '--',
      detail: `${String(partyOverview.averageMustDoCount)} average must-do calls`,
    },
    {
      label: 'Consensus',
      value: `${String(highConsensusCount)} rides at 45+`,
      detail: `Led by ${rankedAttractions[0]?.attractionLabel ?? 'the top pick'}`,
    },
  ];
}
