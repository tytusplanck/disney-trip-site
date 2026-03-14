import { describe, expect, it } from 'vitest';
import { getAllTripsCardPresentation, allTripsPage } from './index.page';

describe('all trips page copy helpers', () => {
  it('returns status-aware card copy for planning, upcoming, and completed trips', () => {
    expect(getAllTripsCardPresentation(allTripsPage.card, 'planning')).toEqual({
      fallbackNote:
        'Ride priorities, itinerary, and traveler signals will stay concentrated here while the trip is active.',
      primaryActionLabel: 'Open planner',
      showShortcutLinks: true,
    });
    expect(getAllTripsCardPresentation(allTripsPage.card, 'upcoming')).toEqual({
      fallbackNote:
        'This trip will move into the live planner once the core itinerary and ride list are ready.',
      primaryActionLabel: 'Preview trip',
      showShortcutLinks: false,
    });
    expect(getAllTripsCardPresentation(allTripsPage.card, 'completed')).toEqual({
      fallbackNote: 'The final planner state and archive notes stay here after the trip wraps.',
      primaryActionLabel: 'Open archive',
      showShortcutLinks: false,
    });
  });
});
