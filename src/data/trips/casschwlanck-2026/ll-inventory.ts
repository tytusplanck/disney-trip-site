import { llCatalog, mergeLLInventory } from '../../../lib/trips/ll-catalog';
import { casschwlanck2026LLClosures } from './ll-closures';
import { casschwlanck2026LLPricing } from './ll-pricing';

export const casschwlanck2026LLInventory = mergeLLInventory(llCatalog, {
  pricing: casschwlanck2026LLPricing,
  closures: casschwlanck2026LLClosures,
});
