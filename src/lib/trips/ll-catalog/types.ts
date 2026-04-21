import type { LLParkId, LLPassType, LLTier } from '../ll-types';

export interface LLCatalogAttraction {
  id: string;
  shortCode: string;
  attractionLabel: string;
  parkId: LLParkId;
  passType: LLPassType;
  tier: LLTier | null;
  heightRestriction: string | null;
}

export interface LLCatalogPark {
  parkId: LLParkId;
  parkLabel: string;
  hasTiers: boolean;
  maxTier1: number;
  maxTier2: number;
  maxMultiPass: number;
  attractions: LLCatalogAttraction[];
}

export type LLCatalog = Record<LLParkId, LLCatalogPark>;
