import type { TripScheduleEntry } from '../../../lib/trips/types';

export const declanBigSummerTripSchedule: TripScheduleEntry[] = [
  {
    date: '2026-07-07',
    kind: 'travel',
    kinds: ['travel', 'park'],
    label: "Disney's Animal Kingdom / Epcot",
    parkLabel: "Disney's Animal Kingdom",
    notes:
      'Flight land at 9:31am at MCO. We will knock out DAK for the trip and then enjoy Epcot at night time permitting.',
  },
  {
    date: '2026-07-08',
    kind: 'park',
    label: 'Magic Kingdom',
    parkLabel: 'Magic Kingdom',
    notes:
      'Plan to find a good spot for parade and fireworks. Prefer to get Beak and Barrel reservation.',
  },
  {
    date: '2026-07-09',
    kind: 'park',
    label: "Disney's Hollywood Studios",
    parkLabel: "Disney's Hollywood Studios",
    notes:
      "Fantasmic at night. Optionally hop to Epcot if we are nervous about accomplishing everything. Prefer to get Oga's reservation.",
  },
  {
    date: '2026-07-10',
    kind: 'travel',
    kinds: ['travel', 'park'],
    label: 'EPCOT / Clean-up',
    parkLabel: 'EPCOT',
    notes: 'EPCOT rope drop, then clean up other parks if applicable. Flight leaves MCO at 9:19pm.',
  },
];
