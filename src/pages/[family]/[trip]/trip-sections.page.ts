import type { TripSection } from '../../../lib/trips/types';

export interface TripSectionPageCopy {
  section: TripSection;
  pageLabel: string;
  title: string;
  intro: string;
}

export const tripSectionPages: Record<TripSection, TripSectionPageCopy> = {
  attractions: {
    section: 'attractions',
    pageLabel: '01 - Preference Data',
    title: 'Attractions board',
    intro:
      'Every attraction rating, the strongest consensus picks, and the pressure points where the party splits.',
  },
  schedule: {
    section: 'schedule',
    pageLabel: '02 - Day by Day',
    title: 'Daily outline',
    intro:
      'A full nine-day trip view built from the imported March planning sheet, including park days, resort resets, and anchor notes.',
  },
  party: {
    section: 'party',
    pageLabel: '03 - The Party',
    title: 'Party breakdown',
    intro:
      'Each traveler’s preference profile, strongest lean, and the rides that consistently surface as their personal priorities.',
  },
};
