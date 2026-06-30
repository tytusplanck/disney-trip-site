import type { TripScheduleEntry } from '../../../lib/trips/types';

export const declanBigSummerTripSchedule: TripScheduleEntry[] = [
  {
    date: '2026-07-07',
    kind: 'travel',
    kinds: ['travel', 'park'],
    label: "Disney's Animal Kingdom",
    parkLabel: "Disney's Animal Kingdom",
    notes:
      "Animal Kingdom day with Caribbean Beach check-in after 3:00 PM and Sebastian's Bistro dinner at 6:10 PM.",
  },
  {
    date: '2026-07-08',
    kind: 'park',
    label: "Disney's Hollywood Studios",
    parkLabel: "Disney's Hollywood Studios",
    notes:
      "Hollywood Studios day with Star Wars, Toy Story Land, and Oga's Cantina lunch at 1:05 PM.",
  },
  {
    date: '2026-07-09',
    kind: 'park',
    label: 'Magic Kingdom',
    parkLabel: 'Magic Kingdom',
    notes:
      'Magic Kingdom day with Liberty Tree Tavern lunch at 2:00 PM and fireworks dessert party at 8:30 PM.',
  },
  {
    date: '2026-07-10',
    kind: 'travel',
    kinds: ['travel', 'park'],
    label: 'EPCOT',
    parkLabel: 'EPCOT',
    notes:
      'Caribbean Beach checkout before 11:00 AM, EPCOT Lightning Lanes through early afternoon, and San Angel Inn lunch at 1:10 PM.',
  },
];
