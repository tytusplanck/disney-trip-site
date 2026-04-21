import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LightningLanePlanner from './LightningLanePlanner';
import { casschwlanck2026TripData } from '../data/trips/casschwlanck-2026';
import { declanBigSummerTripData } from '../data/trips/declan-big-summer-trip';
import { buildLLPlannerData } from '../lib/trips/ll-planner';

function renderPlanner() {
  window.location.hash = '';

  return render(<LightningLanePlanner data={buildLLPlannerData(casschwlanck2026TripData)} />);
}

function renderDeclanPlanner() {
  window.location.hash = '';

  return render(<LightningLanePlanner data={buildLLPlannerData(declanBigSummerTripData)} />);
}

describe('LightningLanePlanner pricing', () => {
  it('shows the pricing disclaimer and projected costs in summary mode', () => {
    renderPlanner();

    const totalLabel = screen.getAllByText('Adult total')[0];
    const totalItem = totalLabel?.parentElement;
    const selectedSinglePassLabel = screen.getAllByText('Selected Single Pass')[0];
    const selectedSinglePassItem = selectedSinglePassLabel?.parentElement;

    if (!totalItem || !selectedSinglePassItem) {
      throw new Error('Expected projected cost items to render in summary mode');
    }

    expect(screen.getAllByText(/Projections based on historical data/i)).not.toHaveLength(0);
    expect(screen.getAllByText('Projected per-person costs')).not.toHaveLength(0);
    expect(within(selectedSinglePassItem).getByText('$18')).toBeInTheDocument();
    expect(within(totalItem).getByText('$53')).toBeInTheDocument();
    expect(screen.queryByText('$53 ($37–$41)')).not.toBeInTheDocument();
  });

  it('shows price pills in edit mode and updates the current total when selections change', () => {
    renderPlanner();

    fireEvent.click(screen.getByRole('button', { name: 'Customize picks' }));

    const totalLabel = screen.getByText('Adult total');
    const totalItem = totalLabel.parentElement;
    if (!totalItem) {
      throw new Error('Expected the adult total cost item to render');
    }

    const selectedSinglePassLabel = screen.getByText('Selected Single Pass');
    const selectedSinglePassItem = selectedSinglePassLabel.parentElement;
    if (!selectedSinglePassItem) {
      throw new Error('Expected the selected single pass cost item to render');
    }

    expect(within(totalItem).getByText('$53')).toBeInTheDocument();
    expect(within(selectedSinglePassItem).getByText('$18')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /Avatar Flight of Passage/i }));

    const updatedTotalLabel = screen.getByText('Current plan total');
    const updatedTotalItem = updatedTotalLabel.parentElement;
    if (!updatedTotalItem) {
      throw new Error('Expected the current total cost item to render');
    }

    expect(within(updatedTotalItem).getByText('$35')).toBeInTheDocument();
    expect(screen.queryByText('$53 ($37–$41)')).not.toBeInTheDocument();
    expect(screen.queryByText('$35 ($20–$23)')).not.toBeInTheDocument();
  });

  it("hides height-specific UI for Declan's trip and shows reopened rides as available", () => {
    renderDeclanPlanner();

    expect(screen.queryByText('Child total')).not.toBeInTheDocument();
    expect(screen.queryByText('Not available for children')).not.toBeInTheDocument();
    expect(screen.queryByText('48in+')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Customize picks' }));
    fireEvent.click(screen.getByRole('button', { name: 'MK · Jul 8' }));

    expect(screen.getByRole('radio', { name: /Big Thunder Mountain Railroad/i })).toBeEnabled();
    fireEvent.click(screen.getByRole('checkbox', { name: /Haunted Mansion/i }));
    expect(
      screen.getByRole('checkbox', { name: /Buzz Lightyear's Space Ranger Spin/i }),
    ).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'DHS · Jul 9' }));

    expect(
      screen.getByRole('radio', { name: /Rock 'n' Roller Coaster Starring The Muppets/i }),
    ).toBeEnabled();
    expect(screen.queryByText('CLOSED')).not.toBeInTheDocument();
  });
});
