import type { PackingArchetype, PackingCategory, PackingPriority } from './types';

export const PACKING_PRIORITY_LABELS: Record<PackingPriority, string> = {
  must: 'Must pack',
  rec: 'Recommended',
  nice: 'Nice to have',
};

const PRIORITY_ORDER: Record<PackingPriority, number> = { must: 0, rec: 1, nice: 2 };

export function getPackingCategories(
  categories: PackingCategory[],
  archetype: PackingArchetype,
  priority: PackingPriority | 'all' = 'all',
): PackingCategory[] {
  return categories
    .filter((category) =>
      archetype === 'kids'
        ? category.archetypes.includes('adults') || category.archetypes.includes('kids')
        : !category.kidsOnly && category.archetypes.includes('adults'),
    )
    .map((category) => ({
      ...category,
      items: category.items
        .filter((item) => priority === 'all' || item.priority === priority)
        .sort((left, right) => PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority]),
    }))
    .filter((category) => category.items.length > 0)
    .sort((left, right) => Number(Boolean(right.kidsOnly)) - Number(Boolean(left.kidsOnly)));
}

export function countPackingItems(categories: PackingCategory[]): number {
  return categories.reduce((count, category) => count + category.items.length, 0);
}
