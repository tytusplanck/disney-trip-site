import { describe, expect, it } from 'vitest';
import { attractionsExplorerFixtureTrip } from '../../test/attractions-explorer.fixture';
import {
  buildAttractionsExplorerData,
  deriveAttractionsExplorerView,
} from './attractions-explorer';

const defaultState = {
  selectedDayId: null,
  search: '',
} as const;

describe('attractions explorer helpers', () => {
  it('builds trip-wide explorer data with scheduled park-day presets', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
    const defaultView = deriveAttractionsExplorerView(data, defaultState);

    expect(data.dayPresets).toHaveLength(2);
    expect(data.dayPresets.map((preset) => preset.parkLabel)).toEqual(['EPCOT', 'Magic Kingdom']);
    expect(data.dayPresets.map((preset) => preset.dayNumber)).toEqual([2, 4]);
    expect(defaultView.scopeLabel).toBe('All Park Days • Whole Group');
    expect(defaultView.hasResults).toBe(true);
    expect(defaultView.rankedAttractions[0]?.attractionLabel).toBe('Living with the Land');
  });

  it('filters to the EPCOT day preset and keeps only that park in the ranking', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
    const epcotPreset = data.dayPresets.find((preset) => preset.parkLabel === 'EPCOT');

    expect(epcotPreset).toBeDefined();

    const view = deriveAttractionsExplorerView(data, {
      ...defaultState,
      selectedDayId: epcotPreset?.id ?? null,
    });

    expect(view.activeDayPreset?.parkLabel).toBe('EPCOT');
    expect(view.scopeLabel).toBe('Day 2: EPCOT • Whole Group');
    expect(view.rankedAttractions.every((attraction) => attraction.parkLabel === 'EPCOT')).toBe(
      true,
    );
  });

  it('supports combined day and search filtering', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
    const epcotPreset = data.dayPresets.find((preset) => preset.parkLabel === 'EPCOT');

    const view = deriveAttractionsExplorerView(data, {
      ...defaultState,
      selectedDayId: epcotPreset?.id ?? null,
      search: 'Soarin',
    });

    expect(view.scopeLabel).toBe('Day 2: EPCOT • Whole Group • Search: "Soarin"');
    expect(view.rankedAttractions.map((attraction) => attraction.attractionLabel)).toEqual([
      "Soarin' Around the World",
    ]);
  });

  it('returns a clean empty state when search eliminates every attraction', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
    const view = deriveAttractionsExplorerView(data, {
      ...defaultState,
      search: 'Not a ride',
    });

    expect(view.hasResults).toBe(false);
    expect(view.rankedAttractions).toEqual([]);
  });
});
