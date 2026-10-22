import { llCatalog, mergeLLInventory } from '../../../lib/trips/ll-catalog';
import { planckMegaDisneyTripLLPricing } from './ll-pricing';

export const planckMegaDisneyTripLLInventory = mergeLLInventory(llCatalog, {
  pricing: planckMegaDisneyTripLLPricing,
});
