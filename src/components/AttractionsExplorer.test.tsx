import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AttractionsExplorer from './AttractionsExplorer';
import * as attractionsExplorerModel from '../lib/trips/attractions-explorer';
import { attractionsExplorerFixtureTrip } from '../test/attractions-explorer.fixture';

function renderExplorer() {
  return render(
    <AttractionsExplorer
      data={attractionsExplorerModel.buildAttractionsExplorerData(attractionsExplorerFixtureTrip)}
    />,
  );
}

function createExplorerData() {
  return attractionsExplorerModel.buildAttractionsExplorerData(attractionsExplorerFixtureTrip);
}

describe('AttractionsExplorer', () => {
  it('keeps rankings in the primary column and secondary insights in the rail', () => {
    renderExplorer();

    const summaryLabel = screen.getByText('Matching rides');
    const rankingsDisclosure = screen.getByText('View full rankings');
    const matrixDisclosure = screen.getByText('View traveler matrix');
    const areaDisclosure = screen.getByText('View area breakdown');
    const signalsHeading = screen.getByRole('heading', {
      name: 'Patterns worth noticing before you commit',
    });

    expect(
      summaryLabel.compareDocumentPosition(rankingsDisclosure) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
    expect(
      rankingsDisclosure.compareDocumentPosition(matrixDisclosure) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
    expect(
      rankingsDisclosure.compareDocumentPosition(signalsHeading) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
    expect(
      signalsHeading.compareDocumentPosition(matrixDisclosure) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
    expect(
      matrixDisclosure.compareDocumentPosition(areaDisclosure) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
    expect(rankingsDisclosure.closest('.attractions-explorer__results-primary')).not.toBeNull();
    expect(matrixDisclosure.closest('.attractions-explorer__results-secondary')).not.toBeNull();
    expect(areaDisclosure.closest('.attractions-explorer__results-secondary')).not.toBeNull();
    expect(signalsHeading.closest('.attractions-explorer__results-secondary')).not.toBeNull();
    expect(
      rankingsDisclosure.closest('details')?.hasAttribute('open'),
      'rankings disclosure should default open',
    ).toBe(true);
    expect(
      areaDisclosure.closest('details')?.hasAttribute('open'),
      'area breakdown disclosure should default collapsed',
    ).toBe(false);
    expect(screen.queryByText('Top contenders right now')).not.toBeInTheDocument();
    expect(screen.queryByText('View all areas')).not.toBeInTheDocument();
  });

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

  it('memoizes derived views when parent rerenders with unchanged data', () => {
    const data = createExplorerData();
    const deriveSpy = vi.spyOn(attractionsExplorerModel, 'deriveAttractionsExplorerView');
    const { rerender } = render(<AttractionsExplorer data={data} />);
    const initialCalls = deriveSpy.mock.calls.length;

    rerender(<AttractionsExplorer data={data} />);

    expect(deriveSpy.mock.calls.length).toBe(initialCalls);
    deriveSpy.mockRestore();
  });
});
