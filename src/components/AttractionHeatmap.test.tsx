import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AttractionHeatmap from './AttractionHeatmap';
import {
  buildAttractionsExplorerData,
  deriveAttractionsExplorerView,
} from '../lib/trips/attractions-explorer';
import { attractionsExplorerFixtureTrip } from '../test/attractions-explorer.fixture';

function buildHeatmapView() {
  const data = buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
  const view = deriveAttractionsExplorerView(data, {
    selectedDayId: null,
    parkLabel: null,
    areaLabel: null,
    memberId: null,
    sentiment: 'all',
    search: '',
  });

  return { party: data.party, rows: view.heatmapRows };
}

describe('AttractionHeatmap', () => {
  it('renders both the desktop table and mobile cards from the same row data', () => {
    const { party, rows } = buildHeatmapView();
    const [firstRow] = rows;

    if (!firstRow) {
      throw new Error('Expected at least one heatmap row');
    }

    const [firstRating] = firstRow.ratings;

    if (!firstRating) {
      throw new Error('Expected at least one heatmap rating');
    }

    const firstScoreLabel = `Score ${String(firstRow.consensusScore)}/${String(firstRow.ratings.length * 5)}`;

    render(<AttractionHeatmap party={party} rows={rows} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByText(firstScoreLabel).length).toBeGreaterThan(0);
    expect(screen.getAllByText(firstRow.attractionLabel).length).toBeGreaterThan(1);
    expect(screen.getAllByText(firstRating.memberName).length).toBeGreaterThan(1);
  });
});
