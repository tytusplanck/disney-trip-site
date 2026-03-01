export type TripStatus = 'planning' | 'upcoming' | 'completed';

export type TripSection = 'overview' | 'attractions' | 'schedule' | 'party';

export type TripThemeId = 'primary' | 'secondary';

export type PreferenceTier = 1 | 2 | 3 | 4 | 5;

export type ScheduleEntryKind = 'travel' | 'park' | 'resort';

export interface TripSummary {
  groupId: string;
  id: string;
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

export interface AllTripsStats {
  totalTrips: string;
  planningTrips: string;
  ridesScouted: string;
  nextTripPeople: string;
  nextTripParks: string;
}

export interface TripBarStat {
  label: string;
  value: string;
}

export interface TripStubPage {
  section: TripSection;
  pageLabel: string;
  title: string;
  intro: string;
  calloutTitle: string;
  calloutBody: string;
  checklist: string[];
}

export interface TripPartyMember {
  id: string;
  name: string;
}

export interface TripScheduleEntry {
  date: string;
  kind: ScheduleEntryKind;
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

export interface TripDataModule {
  summary: TripSummary;
  party: TripPartyMember[];
  schedule: TripScheduleEntry[];
  attractions: TripAttractionPreference[];
}
