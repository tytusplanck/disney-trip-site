import { llCatalog, mergeLLInventory } from '../../../lib/trips/ll-catalog';
import { osborneFallFamilyTripLLPricing } from './ll-pricing';

export const osborneFallFamilyTripLLInventory = mergeLLInventory(llCatalog, {
  pricing: osborneFallFamilyTripLLPricing,
});
