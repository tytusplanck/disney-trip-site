import { fireEvent, render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import LightningLanePlanner from './LightningLanePlanner';
import { casschwlanck2026TripData } from '../data/trips/casschwlanck-2026';
import { declanBigSummerTripData } from '../data/trips/declan-big-summer-trip';
import { osborneFallFamilyTripData } from '../data/trips/osborne-fall-family-trip';
import { planckMegaDisneyTripData } from '../data/trips/planck-mega-disney-trip';
import { buildLLPlannerData, emptySelections, serializePlan } from '../lib/trips/ll-planner';

function renderPlanner() {
  window.location.hash = '';

  return render(<LightningLanePlanner data={buildLLPlannerData(casschwlanck2026TripData)} />);
}

function renderDeclanPlanner() {
  window.location.hash = '';

  return render(<LightningLanePlanner data={buildLLPlannerData(declanBigSummerTripData)} />);
}

function renderPlanckPlanner() {
  window.location.hash = '';

  return render(<LightningLanePlanner data={buildLLPlannerData(planckMegaDisneyTripData)} />);
}

function renderOsbornePlanner() {
  window.location.hash = '';

  return render(<LightningLanePlanner data={buildLLPlannerData(osborneFallFamilyTripData)} />);
}

describe('LightningLanePlanner pricing', () => {
  it('shows the pricing disclaimer and one projected total per audience in summary mode', () => {
    renderPlanner();

    const singlePassLabel = screen.getAllByText('Single Pass picks')[0];
    const singlePassItem = singlePassLabel?.parentElement;

    if (!singlePassItem) {
      throw new Error('Expected the single pass breakdown to render in summary mode');
    }

    expect(screen.getAllByText(/Projections based on historical data/i)).not.toHaveLength(0);
    expect(screen.getAllByText('Projected per-person cost')).not.toHaveLength(0);
    expect(within(singlePassItem).getByText('$18')).toBeInTheDocument();
    expect(screen.getAllByText('$53 adult')).not.toHaveLength(0);
    expect(screen.queryByText('Adult total')).not.toBeInTheDocument();
    expect(screen.queryByText('Current plan total')).not.toBeInTheDocument();
  });

  it('updates the projected total in edit mode when selections change', () => {
    renderPlanner();

    fireEvent.click(screen.getByRole('button', { name: 'Customize picks' }));

    const headline = () => document.querySelector('.ll-costs .disclosure-panel__headline');
    expect(headline()).toHaveTextContent('$53 adult');

    fireEvent.click(screen.getByRole('checkbox', { name: /Avatar Flight of Passage/i }));

    expect(headline()).toHaveTextContent(/^\$35$/);
    expect(screen.queryByText('Current plan total')).not.toBeInTheDocument();
    expect(screen.queryByText('$35 ($20–$23)')).not.toBeInTheDocument();
  });

  it("hides height-specific UI for Declan's trip and shows reopened rides as available", () => {
    renderDeclanPlanner();

    expect(screen.queryByText('Child total')).not.toBeInTheDocument();
    expect(screen.queryByText('Not available for children')).not.toBeInTheDocument();
    expect(screen.queryByText('48in+')).not.toBeInTheDocument();
    expect(screen.getByText('9:20 AM - 10:20 AM')).toBeInTheDocument();
    expect(screen.getByText('12:20 PM - 1:20 PM')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Customize picks' }));
    fireEvent.click(screen.getByRole('button', { name: /^Magic Kingdom .*Jul 9$/ }));

    expect(screen.getByRole('radio', { name: /Big Thunder Mountain Railroad/i })).toBeEnabled();
    fireEvent.click(screen.getByRole('checkbox', { name: /Haunted Mansion/i }));
    expect(
      screen.getByRole('checkbox', { name: /Buzz Lightyear's Space Ranger Spin/i }),
    ).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: /^Hollywood Studios .*Jul 8$/ }));

    expect(
      screen.getByRole('radio', { name: /Rock 'n' Roller Coaster Starring The Muppets/i }),
    ).toBeEnabled();
    expect(screen.queryByText('CLOSED')).not.toBeInTheDocument();
  });

  it("hides height-specific UI for Planck's trip and shows the November estimates", () => {
    renderPlanckPlanner();

    expect(screen.queryByText('Child total')).not.toBeInTheDocument();
    expect(screen.queryByText('Not available for children')).not.toBeInTheDocument();
    expect(screen.queryByText('48in+')).not.toBeInTheDocument();

    const animalKingdomHeading = screen.getByRole('heading', {
      name: "Disney's Animal Kingdom",
    });
    const animalKingdomCard = animalKingdomHeading.closest('.ll-card');
    if (!animalKingdomCard) {
      throw new Error('Expected Animal Kingdom LL card to render');
    }

    expect(within(animalKingdomCard as HTMLElement).getAllByText('$44')).not.toHaveLength(0);
    expect(within(animalKingdomCard as HTMLElement).getAllByText('$19')).not.toHaveLength(0);
  });

  it("shows different date-specific prices for Osborne's two Magic Kingdom days", () => {
    renderOsbornePlanner();

    const september22Card = screen.getByText('Day 3 · Tue Sep 22').closest('.ll-card');
    const september24Card = screen.getByText('Day 5 · Thu Sep 24').closest('.ll-card');
    if (!september22Card || !september24Card) {
      throw new Error('Expected both Osborne Magic Kingdom cards to render');
    }

    expect(within(september22Card as HTMLElement).getAllByText('$59')).not.toHaveLength(0);
    expect(within(september24Card as HTMLElement).getAllByText('$61')).not.toHaveLength(0);
  });
});

describe('LightningLanePlanner navigation', () => {
  it('does not change the URL hash when switching park days', () => {
    renderDeclanPlanner();
    const initialHash = window.location.hash;

    fireEvent.click(screen.getByRole('button', { name: 'Customize picks' }));
    fireEvent.click(screen.getByRole('button', { name: /^Magic Kingdom .*Jul 9$/ }));

    expect(window.location.hash).toBe(initialHash);
    expect(window.location.hash).not.toContain('day=');
  });
});

describe('LightningLanePlanner shared links', () => {
  function setSharedHash() {
    const data = buildLLPlannerData(planckMegaDisneyTripData);
    const firstParkDate = data.parkDays[0]?.parkDate ?? '';
    const sharedPlan = {
      ...data.defaultPlan,
      parkDays: { ...data.defaultPlan.parkDays, [firstParkDate]: emptySelections() },
    };
    window.location.hash = serializePlan(sharedPlan, data.inventory, data.parkDays);
    return data;
  }

  it('restores a shared plan from the URL hash after mount', () => {
    const data = setSharedHash();

    render(<LightningLanePlanner data={data} />);

    expect(screen.getByText(/Someone thinks they can outplan Tytus/)).toBeInTheDocument();
    expect(screen.queryByText('Star Wars: Rise of the Resistance')).not.toBeInTheDocument();
    window.location.hash = '';
  });

  it('server-renders the default plan so hydration matches when a hash is present', () => {
    const data = setSharedHash();

    const markup = renderToString(<LightningLanePlanner data={data} />);

    expect(markup).toContain('Lightning Lane picks');
    expect(markup).not.toContain('Someone thinks they can outplan Tytus');
    expect(markup).toContain('Star Wars: Rise of the Resistance');
    window.location.hash = '';
  });
});
