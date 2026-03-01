import { describe, expect, it } from 'vitest';
import { attractionsExplorerFixtureTrip } from '../../test/attractions-explorer.fixture';
import {
  buildAttractionsExplorerData,
  deriveAttractionsExplorerView,
} from './attractions-explorer';

const defaultState = {
  selectedDayId: null,
  parkLabel: null,
  areaLabel: null,
  memberId: null,
  sentiment: 'all',
  search: '',
} as const;

describe('attractions explorer helpers', () => {
  it('builds trip-wide explorer data with scheduled park-day presets and park summaries', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
    const defaultView = deriveAttractionsExplorerView(data, defaultState);

    expect(data.dayPresets).toHaveLength(2);
    expect(data.dayPresets.map((preset) => preset.parkLabel)).toEqual(['EPCOT', 'Magic Kingdom']);
    expect(data.dayPresets.map((preset) => preset.dayNumber)).toEqual([2, 4]);
    expect(data.parkLabels).toEqual(['EPCOT', 'Magic Kingdom']);
    expect(data.parkSummaries[0]).toMatchObject({
      parkLabel: 'EPCOT',
      attractionCount: 3,
      averageScorePercent: 82,
    });
    expect(defaultView.contextHeading).toBe('Explorer Fixture Trip decision board');
    expect(defaultView.hasResults).toBe(true);
    expect(defaultView.topPicks[0]?.attractionLabel).toBe('Living with the Land');
  });

  it('filters to the EPCOT day preset and carries the schedule note into the context copy', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
    const epcotPreset = data.dayPresets.find((preset) => preset.parkLabel === 'EPCOT');

    expect(epcotPreset).toBeDefined();

    const view = deriveAttractionsExplorerView(data, {
      ...defaultState,
      selectedDayId: epcotPreset?.id ?? null,
    });

    expect(view.contextHeading).toBe('Day 2: EPCOT');
    expect(view.contextDetail).toContain('Hold - Geo82');
    expect(view.rankedAttractions.every((attraction) => attraction.parkLabel === 'EPCOT')).toBe(
      true,
    );
  });

  it('exposes only the selected park areas when the view is scoped manually by park', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
    const view = deriveAttractionsExplorerView(data, {
      ...defaultState,
      parkLabel: 'Magic Kingdom',
    });

    expect(view.activeDayPreset).toBeNull();
    expect(view.availableAreas).toEqual(['Fantasyland', 'Tomorrowland']);
  });

  it('sorts traveler views by that traveler tier before consensus score', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
    const view = deriveAttractionsExplorerView(data, {
      ...defaultState,
      memberId: 'ben',
    });

    expect(view.mode).toBe('traveler');
    expect(
      view.rankedAttractions.slice(0, 4).map((attraction) => attraction.attractionLabel),
    ).toEqual([
      "Soarin' Around the World",
      'Frozen Ever After',
      'Living with the Land',
      "Peter Pan's Flight",
    ]);
  });

  it('filters group views by consensus tone bands', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);

    const highView = deriveAttractionsExplorerView(data, {
      ...defaultState,
      sentiment: 'high',
    });
    const mediumView = deriveAttractionsExplorerView(data, {
      ...defaultState,
      sentiment: 'medium',
    });
    const lowView = deriveAttractionsExplorerView(data, {
      ...defaultState,
      sentiment: 'low',
    });

    expect(highView.rankedAttractions.map((attraction) => attraction.attractionLabel)).toEqual([
      'Living with the Land',
      "Soarin' Around the World",
      "Peter Pan's Flight",
    ]);
    expect(mediumView.rankedAttractions.map((attraction) => attraction.attractionLabel)).toEqual([
      'Frozen Ever After',
      'The Many Adventures of Winnie the Pooh',
    ]);
    expect(lowView.rankedAttractions.map((attraction) => attraction.attractionLabel)).toEqual([
      'Space Mountain',
    ]);
  });

  it('filters traveler views by exact tier values', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
    const view = deriveAttractionsExplorerView(data, {
      ...defaultState,
      memberId: 'ben',
      sentiment: 1,
    });

    expect(view.rankedAttractions.map((attraction) => attraction.attractionLabel)).toEqual([
      "Soarin' Around the World",
      'Frozen Ever After',
    ]);
  });

  it('supports combined day, area, traveler, sentiment, and search filters', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
    const epcotPreset = data.dayPresets.find((preset) => preset.parkLabel === 'EPCOT');

    const view = deriveAttractionsExplorerView(data, {
      ...defaultState,
      selectedDayId: epcotPreset?.id ?? null,
      areaLabel: 'World Nature',
      memberId: 'ben',
      sentiment: 1,
      search: 'Soarin',
    });

    expect(view.rankedAttractions.map((attraction) => attraction.attractionLabel)).toEqual([
      "Soarin' Around the World",
    ]);
    expect(view.availableAreas).toEqual(['World Nature', 'World Showcase']);
  });

  it('returns a clean empty state when filters eliminate every attraction', () => {
    const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
    const view = deriveAttractionsExplorerView(data, {
      ...defaultState,
      memberId: 'ben',
      sentiment: 5,
      search: 'Soarin',
    });

    expect(view.hasResults).toBe(false);
    expect(view.rankedAttractions).toEqual([]);
    expect(view.heatmapRows).toEqual([]);
    expect(view.summaryCards[0]).toMatchObject({
      label: 'Matching rides',
      value: '0',
    });
  });
});
