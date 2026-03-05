import { describe, expect, it } from 'vitest';
import { getAllTripsCardPresentation, allTripsPage } from './index.page';

describe('all trips page copy helpers', () => {
  it('returns status-aware card copy for planning, upcoming, and completed trips', () => {
    expect(getAllTripsCardPresentation(allTripsPage.card, 'planning')).toEqual({
      fallbackNote:
        'Planner insights will appear here once the ride scores, itinerary, and traveler signals are loaded.',
      primaryActionLabel: 'Open planner',
      showShortcutLinks: true,
    });
    expect(getAllTripsCardPresentation(allTripsPage.card, 'upcoming')).toEqual({
      fallbackNote: 'Planner sections will open here once this trip starts taking shape.',
      primaryActionLabel: 'Open planner',
      showShortcutLinks: false,
    });
    expect(getAllTripsCardPresentation(allTripsPage.card, 'completed')).toEqual({
      fallbackNote:
        'Archive notes and the final planner state will stay here once this trip wraps.',
      primaryActionLabel: 'Open archive',
      showShortcutLinks: false,
    });
  });
});
