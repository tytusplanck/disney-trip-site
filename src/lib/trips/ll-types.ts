import type { TripPartyMember } from './types';

export type LLParkId = 'magic-kingdom' | 'epcot' | 'hollywood-studios' | 'animal-kingdom';

export type LLTier = 'tier1' | 'tier2' | 'notier';

export type LLPassType = 'individual' | 'multipass';

export type LLPriceRange = readonly [number, number];

export interface LLProjectedPrice {
  estimatedPriceUsd: number;
  estimatedRangeUsd?: LLPriceRange;
}

export interface LLPolicy {
  heightRestrictionsMatter: boolean;
}

export interface LLAttraction {
  id: string;
  shortCode: string;
  attractionLabel: string;
  parkId: LLParkId;
  passType: LLPassType;
  tier: LLTier | null;
  closedDuringTrip: boolean;
  closureNote: string | null;
  heightRestriction: string | null;
  estimatedPriceUsd?: number;
  estimatedRangeUsd?: LLPriceRange;
}

export interface LLParkInventory {
  parkId: LLParkId;
  parkLabel: string;
  hasTiers: boolean;
  maxTier1: number;
  maxTier2: number;
  maxMultiPass: number;
  multiPassEstimatedPriceUsd: number;
  multiPassEstimatedRangeUsd?: LLPriceRange;
  attractions: LLAttraction[];
}

export interface LLParkDay {
  parkDate: string;
  parkId: LLParkId;
  parkLabel: string;
  dayNumber: number;
  weekdayLabel: string;
  dateLabel: string;
  scheduleNotes: string | null;
}

export interface LLParkDaySelections {
  illSelections: string[];
  tier1Selection: string | null;
  tier2Selections: string[];
  multiPassSelections: string[];
}

export interface LLMemberPlan {
  memberId: string;
  parkDays: Record<string, LLParkDaySelections>;
}

export interface LLPlannerData {
  party: TripPartyMember[];
  parkDays: LLParkDay[];
  inventory: Record<LLParkId, LLParkInventory>;
  defaultPlan: LLMemberPlan;
  ownerMemberId: string;
  heightRestrictionsMatter: boolean;
  hasChildren?: boolean | undefined;
}
