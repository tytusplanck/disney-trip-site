import { llCatalog, mergeLLInventory } from '../../../lib/trips/ll-catalog';
import { declanBigSummerTripLLPricing } from './ll-pricing';

export const declanBigSummerTripLLInventory = mergeLLInventory(llCatalog, {
  pricing: declanBigSummerTripLLPricing,
});
