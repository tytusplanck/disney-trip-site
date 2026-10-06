import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PackingLists from './PackingLists';
import { planckMegaDisneyTripPacking } from '../data/trips/planck-mega-disney-trip/packing';
import { planckMegaDisneyTripData } from '../data/trips/planck-mega-disney-trip';
import { getTripSectionConfig, getLegacyTripRedirectPath } from '../lib/trips/all-trips';
import { hasTripSectionContent } from '../lib/trips/readiness';

const adultItems = planckMegaDisneyTripPacking.categories
  .filter((category) => category.archetypes.includes('adults'))
  .flatMap((category) => category.items);
const familyItems = planckMegaDisneyTripPacking.categories.flatMap((category) => category.items);
const kidsCount = familyItems.length - adultItems.length;
const adultsLabel = `Adults ${String(adultItems.length)} items`;
const kidsLabel = `Adults with kids ${String(familyItems.length)} items, ${String(kidsCount)} for kids`;
const renderLists = () => render(<PackingLists data={planckMegaDisneyTripPacking} />);

describe('Packing lists', () => {
  it('renders outfit themes as bullet lists beneath their item titles', () => {
    renderLists();
    const parkOutfits = screen.getByText('Four park day outfits').closest('li');
    const diningOutfits = screen.getByText('Dining outfits').closest('li');
    expect(parkOutfits).not.toBeNull();
    expect(diningOutfits).not.toBeNull();
    if (!parkOutfits || !diningOutfits) throw new Error('Expected outfit rows');
    expect(within(parkOutfits).getAllByRole('listitem')).toHaveLength(4);
    expect(
      within(parkOutfits).getByText('Epcot: Travel themed, Ratatouille, Nemo, Frozen'),
    ).toBeInTheDocument();
    expect(within(diningOutfits).getAllByRole('listitem')).toHaveLength(3);
    expect(
      within(diningOutfits).getByText('Hoop-Dee-Doo Revue: Pioneer / Cowboy'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Hat and sunglasses')).not.toBeInTheDocument();
    const parkBag = screen.getByRole('region', { name: 'Park day bag' });
    const sunglasses = within(parkBag).getByText('Sunglasses').closest('li');
    const hat = within(parkBag).getByText('Hat').closest('li');
    expect(sunglasses).toHaveTextContent('Must pack');
    expect(hat).toHaveTextContent('Recommended');
  });

  it('shows item names and priorities without descriptions', () => {
    const { container } = renderLists();
    expect(screen.getByText('Portable battery and cable')).toBeInTheDocument();
    expect(
      screen.queryByText('Heavy app use drains a phone by mid-afternoon.'),
    ).not.toBeInTheDocument();
    expect(container.querySelector('.packing__item-note')).not.toBeInTheDocument();
  });

  it('keeps both archetype icons and omits the weather context strip', () => {
    const { container } = renderLists();
    const adults = screen.getByRole('radio', { name: adultsLabel });
    const kids = screen.getByRole('radio', { name: kidsLabel });
    expect(adults.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(kids.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.packing__context')).not.toBeInTheDocument();
    expect(screen.queryByText(/Check the forecast before departure/)).not.toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('adds Packing after Plan only to the opted-in trip and recognizes legacy links', () => {
    expect(getTripSectionConfig(planckMegaDisneyTripData).map((tab) => tab.label)).toEqual([
      'Plan',
      'Packing',
      'LL',
      'Rides',
    ]);
    expect(hasTripSectionContent(planckMegaDisneyTripData, 'packing')).toBe(true);
    expect(
      hasTripSectionContent({ ...planckMegaDisneyTripData, packing: undefined }, 'packing'),
    ).toBe(false);
    expect(
      getLegacyTripRedirectPath(
        [planckMegaDisneyTripData],
        'casschwlanck',
        'future-trip',
        'packing',
      ),
    ).toBe('/planck-mega-disney-trip/packing');
  });

  it('starts with adults and counts every item independently of priority filters', () => {
    renderLists();
    expect(screen.getByRole('radio', { name: adultsLabel })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('radio', { name: kidsLabel })).toHaveAttribute('aria-checked', 'false');
    expect(
      screen.queryByRole('heading', { name: 'Kid diaper bag / stroller' }),
    ).not.toBeInTheDocument();
    expect(document.querySelectorAll('.packing__item')).toHaveLength(adultItems.length);
    fireEvent.click(screen.getByRole('button', { name: 'Must pack' }));
    expect(document.querySelectorAll('.packing__item')).toHaveLength(
      adultItems.filter((item) => item.priority === 'must').length,
    );
    expect(screen.getByRole('radio', { name: adultsLabel })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('shows kids first plus adult categories, preserving the filter when switching groups', () => {
    renderLists();
    fireEvent.click(screen.getByRole('button', { name: 'Recommended' }));
    fireEvent.click(screen.getByRole('radio', { name: /Adults with kids/ }));
    expect(screen.getAllByRole('heading', { level: 2 })[0]).toHaveTextContent(
      'Kid diaper bag / stroller',
    );
    expect(screen.getByRole('heading', { name: 'Kid packing list' })).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Kid diaper bag / stroller' })).getByText(
        'Kids only',
      ),
    ).toBeInTheDocument();
    expect(document.querySelectorAll('.packing__item')).toHaveLength(
      familyItems.filter((item) => item.priority === 'rec').length,
    );
    expect(screen.queryByText('Portable battery and cable')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(document.querySelectorAll('.packing__item')).toHaveLength(familyItems.length);
  });

  it('supports arrow keys, Home and End with roving focus and resets on remount', () => {
    const { unmount } = renderLists();
    const adults = screen.getByRole('radio', { name: adultsLabel });
    adults.focus();
    fireEvent.keyDown(adults, { key: 'ArrowRight' });
    const kids = screen.getByRole('radio', { name: /Adults with kids/ });
    expect(kids).toHaveFocus();
    expect(kids).toHaveAttribute('aria-checked', 'true');
    expect(adults).toHaveAttribute('tabindex', '-1');
    fireEvent.keyDown(kids, { key: 'Home' });
    expect(adults).toHaveFocus();
    fireEvent.keyDown(adults, { key: 'End' });
    expect(kids).toHaveFocus();
    fireEvent.keyDown(kids, { key: 'ArrowDown' });
    expect(adults).toHaveFocus();
    fireEvent.click(kids);
    fireEvent.click(screen.getByRole('button', { name: 'Nice to have' }));
    unmount();
    renderLists();
    expect(screen.getByRole('radio', { name: adultsLabel })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('inherits adult-only categories for families and hides empty categories after filtering', () => {
    render(
      <PackingLists
        data={{
          categories: [
            {
              category: 'Adults essentials',
              archetypes: ['adults'],
              items: [{ name: 'Shoes', priority: 'must' }],
            },
            {
              category: 'Extras',
              archetypes: ['adults'],
              items: [{ name: 'Camera', priority: 'nice' }],
            },
            {
              category: 'Kids extras',
              archetypes: ['kids'],
              kidsOnly: true,
              items: [{ name: 'Toy', priority: 'nice' }],
            },
          ],
        }}
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: /Adults with kids/ }));
    expect(document.querySelectorAll('.packing__item')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'Must pack' }));
    expect(screen.queryByRole('heading', { name: 'Extras' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Kids extras' })).not.toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Adults essentials' })).getByText('Shoes'),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Recommended' }));
    expect(screen.queryAllByRole('heading', { level: 2 })).toHaveLength(0);
    expect(screen.getByRole('status')).toHaveTextContent('No items match this priority.');
  });
});
