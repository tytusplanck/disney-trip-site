import type { TripScheduleEntry } from '../../../lib/trips/types';

export const declanBigSummerTripSchedule: TripScheduleEntry[] = [
  {
    date: '2026-07-07',
    kind: 'travel',
    label: 'Travel early',
    parkLabel: null,
    notes: 'Land at 9:31am at MCO. DAK day with the evening in EPCOT.',
  },
  {
    date: '2026-07-08',
    kind: 'park',
    label: 'Magic Kingdom',
    parkLabel: 'Magic Kingdom',
    notes: 'Fireworks',
  },
  {
    date: '2026-07-09',
    kind: 'park',
    label: "Disney's Hollywood Studios",
    parkLabel: "Disney's Hollywood Studios",
    notes: 'Fantasmic. Potential afternoon park hop to EPCOT.',
  },
  {
    date: '2026-07-10',
    kind: 'travel',
    label: 'Travel late',
    parkLabel: null,
    notes: 'EPCOT rope drop, then clean up other parks if applicable. Flight leaves MCO at 9:19pm.',
  },
];
