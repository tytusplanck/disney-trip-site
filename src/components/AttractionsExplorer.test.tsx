import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AttractionsExplorer from './AttractionsExplorer';
import { buildAttractionsExplorerData } from '../lib/trips/attractions-explorer';
import { attractionsExplorerFixtureTrip } from '../test/attractions-explorer.fixture';

function renderExplorer() {
  return render(
    <AttractionsExplorer data={buildAttractionsExplorerData(attractionsExplorerFixtureTrip)} />,
  );
}

describe('AttractionsExplorer', () => {
  it('updates the board when the EPCOT day chip is selected', async () => {
    renderExplorer();

    fireEvent.click(screen.getByRole('button', { name: /Day 2/i }));

    await waitFor(() => {
      expect(screen.getByText('Day 2: EPCOT')).toBeInTheDocument();
    });

    expect(screen.getByText(/Hold - Geo82/)).toBeInTheDocument();
    expect(screen.queryAllByText("Peter Pan's Flight")).toHaveLength(0);
    expect(screen.getAllByText('Living with the Land').length).toBeGreaterThan(0);
  });

  it('switches sentiment labels and highlights the selected traveler column', async () => {
    renderExplorer();

    fireEvent.change(screen.getByLabelText('Traveler'), {
      target: { value: 'ben' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Must Do' })).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'High' })).not.toBeInTheDocument();

    const table = screen.getByRole('table');
    const benHeader = within(table).getByText('Ben');
    expect(benHeader).toHaveClass('trip-heatmap__heading--highlighted');
  });

  it('restores the default trip-wide state when filters are reset', async () => {
    renderExplorer();

    fireEvent.click(screen.getByRole('button', { name: /Day 2/i }));
    await waitFor(() => {
      expect(screen.getByText('Day 2: EPCOT')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));

    await waitFor(() => {
      expect(screen.getByText('Explorer Fixture Trip decision board')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /All Trip/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('shows the no-results panel with a reset path when filters eliminate the board', async () => {
    renderExplorer();

    fireEvent.change(screen.getByLabelText('Traveler'), {
      target: { value: 'ben' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Will Skip' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Will Skip' }));
    fireEvent.change(screen.getByLabelText('Search'), {
      target: { value: 'Soarin' },
    });

    await waitFor(() => {
      expect(
        screen.getByText('No attractions matched the current filter stack.'),
      ).toBeInTheDocument();
    });

    expect(screen.getAllByRole('button', { name: 'Reset filters' }).length).toBeGreaterThan(0);
  });
});
