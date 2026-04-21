import type { LLMemberPlan, LLParkInventory } from './ll-types';

export type TripStatus = 'planning' | 'upcoming' | 'completed';

export type TripSection =
  | 'attractions'
  | 'schedule'
  | 'party'
  | 'll'
  | 'guide'
  | 'travelers'
  | 'logistics';

export interface TripSectionTab {
  label: string;
  section: TripSection;
}

export type TripThemeId = 'primary' | 'secondary';

export type PreferenceTier = 1 | 2 | 3 | 4 | 5;

export type ScheduleEntryKind = 'travel' | 'park' | 'resort';

export interface TripLegacyRoute {
  familySlug: string;
  tripSlug: string;
}

export interface TripSummary {
  slug: string;
  legacyRoutes?: TripLegacyRoute[];
  title: string;
  dateLabel: string;
  parkLabels: string[];
  partySize: number | null;
  dayCount: number | null;
  attractionCount: number | null;
  status: TripStatus;
  topPick: string | null;
  themeId: TripThemeId;
}

export interface AllTripsSection {
  status: TripStatus;
  tripCount: number;
  countLabel: string;
  trips: TripSummary[];
}

export interface TripPartyMember {
  id: string;
  name: string;
}

export interface TripPartyNamedCohort {
  id: string;
  label: string;
  memberIds: string[];
}

export type TripPartyGroupingConfig =
  | {
      kind: 'auto-clusters';
    }
  | {
      kind: 'named-cohorts';
      cohorts: [TripPartyNamedCohort, TripPartyNamedCohort];
    };

export interface TripScheduleEntry {
  date: string;
  kind: ScheduleEntryKind;
  kinds?: ScheduleEntryKind[];
  label: string;
  parkLabel: string | null;
  notes: string | null;
}

export interface TripAttractionPreference {
  id: string;
  parkLabel: string;
  areaLabel: string;
  attractionLabel: string;
  consensusScore: number;
  preferenceByPartyMemberId: Record<string, PreferenceTier>;
}

export interface GuideAttraction {
  id: string;
  parkLabel: string;
  areaLabel: string;
  attractionLabel: string;
  priority: 'must-do' | 'recommended' | 'if-time' | 'skip';
  notes: string;
}

export interface TravelerProfile {
  memberId: string;
  notes: string;
  priorities: string[];
}

export type LogisticsEntryKind = 'dining' | 'resort' | 'transport' | 'tip' | 'general';

export interface LogisticsEntry {
  id: string;
  kind: LogisticsEntryKind;
  title: string;
  date: string | null;
  notes: string;
}

export interface TripDataModule {
  summary: TripSummary;
  party: TripPartyMember[];
  schedule: TripScheduleEntry[];
  attractions: TripAttractionPreference[];
  partyGrouping?: TripPartyGroupingConfig;
  llInventory?: Record<string, LLParkInventory>;
  llDefaultPlan?: LLMemberPlan;
  sectionConfig?: TripSectionTab[];
  guide?: GuideAttraction[];
  travelerProfiles?: TravelerProfile[];
  logistics?: LogisticsEntry[];
}

export interface TripStubPage {
  title: string;
  calloutTitle: string;
  calloutBody: string;
  checklist: string[];
}
