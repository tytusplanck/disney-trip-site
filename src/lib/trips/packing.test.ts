import { expect, it } from 'vitest';
import { getPackingCategories } from './packing';
import type { PackingCategory } from './types';

it('orders each category by priority, preserving ties and the editable source data', () => {
  const categories: PackingCategory[] = [
    {
      category: 'Essentials',
      archetypes: ['adults'],
      items: [
        { name: 'Optional', priority: 'nice' },
        { name: 'Recommended first', priority: 'rec' },
        { name: 'Must first', priority: 'must' },
        { name: 'Recommended second', priority: 'rec' },
        { name: 'Must second', priority: 'must' },
      ],
    },
  ];
  const before = structuredClone(categories);
  for (const archetype of ['adults', 'kids'] as const) {
    expect(getPackingCategories(categories, archetype)[0]?.items.map((item) => item.name)).toEqual([
      'Must first',
      'Must second',
      'Recommended first',
      'Recommended second',
      'Optional',
    ]);
  }
  expect(
    getPackingCategories(categories, 'kids', 'rec')[0]?.items.map((item) => item.name),
  ).toEqual(['Recommended first', 'Recommended second']);
  expect(categories).toEqual(before);
});
