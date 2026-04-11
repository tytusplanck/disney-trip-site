import { describe, expect, it } from 'vitest';
import {
  allTripsPage,
  getAllTripsCardPresentation,
  getAllTripsSectionEmptyState,
} from './index.page';

describe('all trips page copy helpers', () => {
  it('returns status-aware card copy for planning, upcoming, and completed trips', () => {
    expect(getAllTripsCardPresentation(allTripsPage.card, 'planning')).toEqual({
      primaryActionLabel: 'Open planner',
      supportingCopy: 'The live planning trip stays focused here while decisions are still moving.',
    });
    expect(getAllTripsCardPresentation(allTripsPage.card, 'upcoming')).toEqual({
      primaryActionLabel: 'Preview trip',
      supportingCopy: 'This trip will open up once the core itinerary and ride list are ready.',
    });
    expect(getAllTripsCardPresentation(allTripsPage.card, 'completed')).toEqual({
      primaryActionLabel: 'Open archive',
      supportingCopy: 'Finished planning snapshots will stay here after the trip wraps.',
    });
  });

  it('returns status-aware empty copy for visible sections without trips', () => {
    expect(getAllTripsSectionEmptyState(allTripsPage.sections, 'planning')).toBe(
      'No active planning trip right now. The next live plan will move here when decisions start.',
    );
    expect(getAllTripsSectionEmptyState(allTripsPage.sections, 'upcoming')).toBe(
      'No later trips are parked here right now.',
    );
    expect(getAllTripsSectionEmptyState(allTripsPage.sections, 'completed')).toBe(
      'No completed trips yet. Finished itineraries will land here once the first trip wraps.',
    );
  });
});
