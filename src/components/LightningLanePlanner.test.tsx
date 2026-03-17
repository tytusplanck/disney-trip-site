import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LightningLanePlanner from './LightningLanePlanner';
import { casschwlanck2026TripData } from '../data/trips/casschwlanck-2026';
import { buildLLPlannerData } from '../lib/trips/ll-planner';

function renderPlanner() {
  window.location.hash = '';

  return render(<LightningLanePlanner data={buildLLPlannerData(casschwlanck2026TripData)} />);
}

describe('LightningLanePlanner pricing', () => {
  it('shows the historic pricing disclaimer and projected costs in summary mode', () => {
    renderPlanner();

    const totalLabel = screen.getAllByText('Current plan total')[0];
    const totalItem = totalLabel?.parentElement;
    const selectedSinglePassLabel = screen.getAllByText('Selected Single Pass')[0];
    const selectedSinglePassItem = selectedSinglePassLabel?.parentElement;

    if (!totalItem || !selectedSinglePassItem) {
      throw new Error('Expected projected cost items to render in summary mode');
    }

    expect(
      screen.getByText(/Historic per-person projections based on recent Lightning Lane data/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Projected costs')).not.toHaveLength(0);
    expect(within(selectedSinglePassItem).getByText('$17')).toBeInTheDocument();
    expect(within(totalItem).getByText('$39')).toBeInTheDocument();
    expect(screen.queryByText('$39 ($37–$41)')).not.toBeInTheDocument();
  });

  it('shows price pills in edit mode and updates the current total when selections change', () => {
    renderPlanner();

    fireEvent.click(screen.getByRole('button', { name: 'Customize picks' }));

    const totalLabel = screen.getByText('Current plan total');
    const totalItem = totalLabel.parentElement;
    if (!totalItem) {
      throw new Error('Expected the current total cost item to render');
    }

    const selectedSinglePassLabel = screen.getByText('Selected Single Pass');
    const selectedSinglePassItem = selectedSinglePassLabel.parentElement;
    if (!selectedSinglePassItem) {
      throw new Error('Expected the selected single pass cost item to render');
    }

    expect(within(totalItem).getByText('$39')).toBeInTheDocument();
    expect(within(selectedSinglePassItem).getByText('$17')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /Avatar Flight of Passage/i }));

    expect(within(totalItem).getByText('$22')).toBeInTheDocument();
    expect(screen.queryByText('$39 ($37–$41)')).not.toBeInTheDocument();
    expect(screen.queryByText('$22 ($20–$23)')).not.toBeInTheDocument();
  });
});
