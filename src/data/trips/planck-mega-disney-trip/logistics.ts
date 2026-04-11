import type { LogisticsEntry } from '../../../lib/trips/types';

export const planckMegaDisneyTripLogistics: LogisticsEntry[] = [
  {
    id: 'chef-mickeys',
    kind: 'dining',
    title: "Chef Mickey's",
    date: '2026-11-11',
    notes:
      "Character dining at Disney's Contemporary Resort. Mickey, Minnie, and friends come to your table for photos. Buffet-style. Great for the whole group and a classic Disney experience. Reservation already on the calendar.",
  },
  {
    id: 'resort',
    kind: 'resort',
    title: 'Resort: Add resort name here',
    date: null,
    notes:
      'Update with the resort name and any details the group needs to know — check-in process, parking, pool hours, shuttle service to the parks, etc.',
  },
  {
    id: 'park-transport',
    kind: 'transport',
    title: 'Getting to the parks',
    date: null,
    notes:
      'Disney resorts have complimentary bus service to all four parks. Buses run every 20 minutes. The Disney Skyliner gondola system serves EPCOT and Hollywood Studios from select resorts. Plan 30–45 minutes travel time each way.',
  },
  {
    id: 'park-tickets',
    kind: 'tip',
    title: 'Park tickets & reservations',
    date: null,
    notes:
      "Everyone needs both a park ticket and a Disney Park Pass reservation for each day. Reservations are linked to your My Disney Experience account. Make sure everyone in the group has their tickets connected before arrival.",
  },
  {
    id: 'my-disney-experience',
    kind: 'tip',
    title: 'My Disney Experience app',
    date: null,
    notes:
      "Download the My Disney Experience app before the trip. It shows real-time wait times, lets you book Lightning Lane, view your dining reservations, and navigate the parks. Connect your ticket to the app in advance.",
  },
  {
    id: 'll-booking-strategy',
    kind: 'tip',
    title: 'Lightning Lane booking strategy',
    date: null,
    notes:
      "Individual Lightning Lane for the top rides (Rise of the Resistance, TRON, Guardians, Slinky Dog) goes on sale at 7am on your park day — resort guests can book 7 days in advance. Tytus will handle bookings for the group. Lightning Lane Multi Pass opens at 7am day-of for all resort guests.",
  },
  {
    id: 'arrival-day',
    kind: 'general',
    title: 'Arrival day — Nov 7',
    date: '2026-11-07',
    notes:
      'Travel day. No park planned. Focus on getting to the resort, checking in, grabbing dinner, and getting to bed early. Animal Kingdom is the first park day on Nov 8.',
  },
  {
    id: 'resort-day-nov-9',
    kind: 'general',
    title: 'Resort day — Nov 9',
    date: '2026-11-09',
    notes:
      "David, Lee, and Grammy arrive today. No park planned — use the day to explore the resort, rest, and welcome the new arrivals. Good opportunity for a resort pool day.",
  },
  {
    id: 'resort-day-nov-11',
    kind: 'general',
    title: 'Resort day — Nov 11',
    date: '2026-11-11',
    notes:
      "Chef Mickey's character dining is today. A resort day otherwise — enjoy the pool, the resort grounds, and a relaxed pace before Magic Kingdom the next day.",
  },
  {
    id: 'group-departure-nov-13',
    kind: 'general',
    title: 'David, Lee & Grammy depart — Nov 13',
    date: '2026-11-13',
    notes:
      'Resort day. David, Lee, and Grammy leave today. A quieter day — good chance to rest before Hollywood Studios and Fantasmic! on Nov 14.',
  },
  {
    id: 'what-to-pack',
    kind: 'tip',
    title: 'What to bring',
    date: null,
    notes:
      'Comfortable walking shoes are non-negotiable — you will log 10+ miles per park day. Bring a light jacket for November evenings. A small backpack with snacks and refillable water bottles saves money. Ponchos are useful for water rides.',
  },
];
