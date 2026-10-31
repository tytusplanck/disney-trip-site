import { llCatalog, mergeLLInventory } from '../../../lib/trips/ll-catalog';
import { planckMegaDisneyTripLLClosures } from './ll-closures';
import { planckMegaDisneyTripLLPricing } from './ll-pricing';

export const planckMegaDisneyTripLLInventory = mergeLLInventory(llCatalog, {
  pricing: planckMegaDisneyTripLLPricing,
  closures: planckMegaDisneyTripLLClosures,
});
