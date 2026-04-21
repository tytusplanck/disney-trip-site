import { llCatalog, mergeLLInventory } from '../../../lib/trips/ll-catalog';
import { declanBigSummerTripLLClosures } from './ll-closures';
import { declanBigSummerTripLLPricing } from './ll-pricing';

export const declanBigSummerTripLLInventory = mergeLLInventory(llCatalog, {
  pricing: declanBigSummerTripLLPricing,
  closures: declanBigSummerTripLLClosures,
});
