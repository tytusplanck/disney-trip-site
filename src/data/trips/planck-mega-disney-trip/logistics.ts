import type { LogisticsEntry } from '../../../lib/trips/types';

export const planckMegaDisneyTripLogistics: LogisticsEntry[] = [
  {
    id: 'wilderness-lodge-home-base',
    kind: 'resort',
    title: "Home base: Boulder Ridge Villas at Disney's Wilderness Lodge",
    date: null,
    notes:
      "Most of the group is staying at Boulder Ridge Villas for the whole trip. Barb, David, and Lee are staying at Copper Creek Villas & Cabins, also at Disney's Wilderness Lodge. Use the Wilderness Lodge lobby, bus depot, and boat dock as the default meeting points.",
  },
  {
    id: 'airport-transportation',
    kind: 'transport',
    title: 'Airport transportation: Mears Connect',
    date: '2026-11-07',
    notes:
      "We are taking Mears from the airport to Disney's Wilderness Lodge. Plan for airport pickup time, luggage, and the ride to the resort.",
  },
  {
    id: 'disney-transportation-plan',
    kind: 'transport',
    title: 'On-property transportation plan',
    date: null,
    notes:
      'We are using Disney transportation the whole time once on property. Build in buffer time, especially with strollers, grandparents, and the full group moving together.',
  },
  {
    id: 'transport-magic-kingdom',
    kind: 'transport',
    title: 'To Magic Kingdom: boat from Wilderness Lodge',
    date: null,
    notes:
      'Take the boat from the Wilderness Lodge boat dock to Magic Kingdom when service is running. If boats are paused, use the Disney bus from the resort bus depot. Leave extra time before fireworks and park close.',
  },
  {
    id: 'transport-animal-kingdom',
    kind: 'transport',
    title: "To Disney's Animal Kingdom: resort bus",
    date: null,
    notes:
      "Use the Disney bus from Wilderness Lodge to Disney's Animal Kingdom. This is usually the longest park ride from the resort, so leave a larger morning buffer.",
  },
  {
    id: 'transport-epcot',
    kind: 'transport',
    title: 'To EPCOT: resort bus',
    date: null,
    notes:
      'Use the Disney bus from Wilderness Lodge to EPCOT. For Food & Wine day, set a meetup point before the group spreads out around World Showcase.',
  },
  {
    id: 'transport-hollywood-studios',
    kind: 'transport',
    title: "To Disney's Hollywood Studios: resort bus",
    date: null,
    notes:
      "Use the Disney bus from Wilderness Lodge to Disney's Hollywood Studios. For Fantasmic! night, plan the return bus as a full-group move after the show.",
  },
  {
    id: 'll-booking-strategy',
    kind: 'tip',
    title: 'Lightning Lane booking strategy',
    date: null,
    notes:
      'Individual Lightning Lane for the top rides (Rise of the Resistance, TRON, Guardians, Slinky Dog) goes on sale at 7am on your park day — resort guests can book 7 days in advance. Tytus will handle bookings for the group. Lightning Lane Multi Pass opens at 7am day-of for all resort guests.',
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
