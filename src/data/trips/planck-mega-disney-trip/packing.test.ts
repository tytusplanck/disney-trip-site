import { expect, it } from 'vitest';
import { planckMegaDisneyTripData } from './index';
import { getTripSectionConfig } from '../../../lib/trips/all-trips';

it('opts the Planck trip into Packing after Plan and before LL', () => {
  expect(getTripSectionConfig(planckMegaDisneyTripData).map((tab) => tab.label)).toEqual([
    'Plan',
    'Packing',
    'LL',
    'Rides',
  ]);
});

it('keeps editable packing categories and items complete and unique within each category', () => {
  const categories = planckMegaDisneyTripData.packing?.categories ?? [];
  expect(categories.length).toBeGreaterThan(0);
  expect(new Set(categories.map((category) => category.category)).size).toBe(categories.length);
  for (const category of categories) {
    expect(category.archetypes.length).toBeGreaterThan(0);
    expect(new Set(category.items.map((item) => item.name)).size).toBe(category.items.length);
    for (const item of category.items) {
      expect(item.name.trim()).not.toBe('');
      expect(item.note.trim()).not.toBe('');
      expect(['must', 'rec', 'nice']).toContain(item.priority);
    }
  }
});
