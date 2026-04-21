import type {
  PreferenceTier,
  TripAttractionPreference,
  TripDataModule,
  TripPartyMember,
  TripScheduleEntry,
} from './types';
import { getPartyPersonaProfile, getPartyPreferenceCounts } from './party-analytics';
import { getScheduleEntryBadges, hasScheduleEntryKind } from './schedule';

export interface PreferenceMeta {
  tier: PreferenceTier;
  label: string;
  shortLabel: string;
  tone: 'must' | 'prefer' | 'indifferent' | 'avoid' | 'skip';
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
  styleDescription: string;
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
  badges: ReturnType<typeof getScheduleEntryBadges>;
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

export function getSharedPriorityAttractions(
  attractions: TripAttractionPreference[],
  partySize: number,
  limit = 5,
): RankedAttraction[] {
  return getRankedAttractions(attractions, partySize)
    .sort(
      (left, right) =>
        right.mustDoVotes - left.mustDoVotes ||
        right.consensusScore - left.consensusScore ||
        left.attractionLabel.localeCompare(right.attractionLabel),
    )
    .slice(0, limit);
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
    const counts = getPartyPreferenceCounts(member.id, module.attractions);
    const persona = getPartyPersonaProfile(counts, totalAttractions);

    return {
      member,
      styleLabel: persona.label,
      styleDescription: persona.description,
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
  const maxAvoidCount = Math.max(0, ...summaries.map((summary) => summary.avoidCount));
  const maxEnthusiasmCount = Math.max(0, ...summaries.map((summary) => summary.enthusiasmCount));

  const mostSelectiveMember =
    maxAvoidCount === 0
      ? null
      : ([...summaries].sort(
          (left, right) =>
            right.avoidCount - left.avoidCount || left.member.name.localeCompare(right.member.name),
        )[0]?.member.name ?? null);

  const mostEnthusiasticMember =
    maxEnthusiasmCount === 0
      ? null
      : ([...summaries].sort(
          (left, right) =>
            right.enthusiasmCount - left.enthusiasmCount ||
            left.member.name.localeCompare(right.member.name),
        )[0]?.member.name ?? null);

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
  const parkLineup = schedule.flatMap((entry) =>
    entry.parkLabel && hasScheduleEntryKind(entry, 'park') ? [entry.parkLabel] : [],
  );

  return {
    parkDays: schedule.filter((entry) => hasScheduleEntryKind(entry, 'park')).length,
    resortDays: schedule.filter((entry) => hasScheduleEntryKind(entry, 'resort')).length,
    travelDays: schedule.filter((entry) => hasScheduleEntryKind(entry, 'travel')).length,
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
      badges: getScheduleEntryBadges(entry),
    };
  });
}
