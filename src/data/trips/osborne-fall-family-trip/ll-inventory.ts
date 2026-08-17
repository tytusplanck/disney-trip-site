import { llCatalog, mergeLLInventory } from '../../../lib/trips/ll-catalog';
import { osborneFallFamilyTripLLPricing } from './ll-pricing';

export const osborneFallFamilyTripLLInventory = mergeLLInventory(llCatalog, {
  pricing: osborneFallFamilyTripLLPricing,
});

// The second Magic Kingdom visit uses its same-date Sep. 24, 2025 Multi Pass price.
export const osborneFallFamilyTripLLInventoryByParkDate = {
  '2026-09-24': {
    ...osborneFallFamilyTripLLInventory['magic-kingdom'],
    multiPassEstimatedPriceUsd: 29,
  },
};
