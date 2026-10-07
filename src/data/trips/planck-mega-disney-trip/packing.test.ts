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
      expect(['must', 'rec', 'nice']).toContain(item.priority);
    }
  }
});

it('includes Aquaphor / Vaseline only in the kids list', () => {
  const categories = planckMegaDisneyTripData.packing?.categories ?? [];
  expect(
    categories
      .filter((category) => category.kidsOnly)
      .flatMap((category) => category.items.map((item) => item.name)),
  ).toContain('Aquaphor / Vaseline');
  expect(
    categories
      .filter((category) => category.archetypes.includes('adults'))
      .flatMap((category) => category.items.map((item) => item.name)),
  ).not.toContain('Aquaphor / Vaseline');
});

it('includes adult comfort supplies and keeps the sleep sack without travel crib sheets', () => {
  const categories = planckMegaDisneyTripData.packing?.categories ?? [];
  const adultNames = categories
    .filter((category) => category.archetypes.includes('adults'))
    .flatMap((category) => category.items.map((item) => item.name));
  expect(adultNames).toContain('Body Glide / anti-chafe');
  expect(adultNames).toContain('Gold Bond / powder');
  const allNames = categories.flatMap((category) => category.items.map((item) => item.name));
  expect(allNames).toContain('Sleep sack');
  expect(allNames.some((name) => /travel crib sheets/i.test(name))).toBe(false);
});

it('uses corrected spelling in park essentials, medical supplies, and dining outfits', () => {
  const categories = planckMegaDisneyTripData.packing?.categories ?? [];
  expect(categories.map((category) => category.category)).toContain('Park day essentials');
  const items = categories.flatMap((category) => category.items);
  expect(items.map((item) => item.name)).toContain('Thermometer');
  expect(items.flatMap((item) => item.details ?? [])).toContain("'Ohana: Hawaiian Shirts");
});
