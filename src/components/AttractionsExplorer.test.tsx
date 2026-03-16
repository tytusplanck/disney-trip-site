import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AttractionsExplorer from './AttractionsExplorer';
import * as attractionsExplorerModel from '../lib/trips/attractions-explorer';
import { casschwlanck2026TripData } from '../data/trips/casschwlanck-2026';
import { attractionsExplorerFixtureTrip } from '../test/attractions-explorer.fixture';

function renderExplorer() {
  return render(
    <AttractionsExplorer
      data={attractionsExplorerModel.buildAttractionsExplorerData(attractionsExplorerFixtureTrip)}
    />,
  );
}

describe('AttractionsExplorer', () => {
  it('renders a reduced decision surface with filters and rankings only', () => {
    renderExplorer();

    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Traveler')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All Park Days/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Ranked rides')).toBeInTheDocument();

    expect(screen.queryByText('View traveler matrix')).not.toBeInTheDocument();
    expect(screen.queryByText('View area breakdown')).not.toBeInTheDocument();
    expect(screen.queryByText('Patterns worth noticing before you commit')).not.toBeInTheDocument();
  });

  it('updates the ranking when the EPCOT day chip is selected', async () => {
    renderExplorer();

    fireEvent.click(screen.getByRole('button', { name: /EPCOT/i }));

    await waitFor(() => {
      expect(screen.getByText(/Living with the Land/)).toBeInTheDocument();
    });
    expect(screen.queryAllByText("Peter Pan's Flight")).toHaveLength(0);
  });

  it('sorts by traveler when a specific traveler is selected', async () => {
    renderExplorer();

    fireEvent.change(screen.getByLabelText('Traveler'), {
      target: { value: 'ben' },
    });

    await waitFor(() => {
      expect(screen.getByText("Soarin' Around the World")).toBeInTheDocument();
    });

    const topRows = screen.getAllByText(/Top [1-3]/).map((node) => node.textContent);
    expect(topRows).toEqual(['Top 1', 'Top 2', 'Top 3']);
    expect(screen.getByText("Soarin' Around the World")).toBeInTheDocument();
  });

  it('restores the default trip-wide state when filters are reset', async () => {
    renderExplorer();

    fireEvent.click(screen.getByRole('button', { name: /EPCOT/i }));
    fireEvent.change(screen.getByLabelText('Traveler'), {
      target: { value: 'ben' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Reset filters' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /All Park Days/i })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });
  });

  it('collapses to the top 15 rides by default and supports expanding the rest', async () => {
    render(
      <AttractionsExplorer
        data={attractionsExplorerModel.buildAttractionsExplorerData(casschwlanck2026TripData)}
      />,
    );

    const toggle = screen.getByRole('button', { name: /Show \d+ More Rides/ });
    expect(toggle).toBeInTheDocument();

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Show Top 15 Only' })).toBeInTheDocument();
    });
  });

  it('shows the no-results state with a reset path when search eliminates the list', async () => {
    renderExplorer();

    fireEvent.change(screen.getByLabelText('Search'), {
      target: { value: 'Not a ride' },
    });

    await waitFor(() => {
      expect(screen.getByText('No attractions matched the current filters.')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('button', { name: 'Reset filters' }).length).toBeGreaterThan(0);
  });
});
