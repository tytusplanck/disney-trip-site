import type { TripScheduleEntry } from '../../../lib/trips/types';

export const planckMegaDisneyTripSchedule: TripScheduleEntry[] = [
  {
    date: '2026-11-07',
    kind: 'travel',
    label: 'Travel day',
    parkLabel: null,
    notes: null,
    moments: [
      { time: '14:50', kind: 'depart', label: 'Leave the resort' },
      {
        time: '16:00',
        kind: 'dining',
        label: 'Hoop-Dee-Doo Musical Revue',
        detail: '11 people',
        menuUrl:
          'https://disneyworld.disney.go.com/dining/campsites-at-fort-wilderness-resort/pioneer-hall/menus/',
      },
    ],
  },
  {
    date: '2026-11-08',
    kind: 'park',
    label: "Disney's Hollywood Studios",
    parkLabel: "Disney's Hollywood Studios",
    notes: 'Fantasmic.',
    moments: [
      { time: '07:10', kind: 'depart', label: 'Leave the resort', detail: 'Meet in the lobby' },
      { time: '08:30', kind: 'rope-drop', label: 'Rope drop' },
      {
        time: '10:45',
        kind: 'dining',
        label: 'Roundup Rodeo BBQ',
        detail: '11 people',
        menuUrl:
          'https://disneyworld.disney.go.com/dining/hollywood-studios/roundup-rodeo-bbq/menus/',
      },
      {
        time: '16:10',
        kind: 'dining',
        label: "Oga's Cantina",
        detail: '11 people',
        menuUrl: 'https://disneyworld.disney.go.com/dining/hollywood-studios/ogas-cantina/menus/',
      },
    ],
  },
  {
    date: '2026-11-09',
    kind: 'resort',
    label: 'Resort day',
    parkLabel: null,
    notes: 'David / Lee / Grammy arrive.',
    moments: [
      { time: '15:50', kind: 'depart', label: 'Leave the resort' },
      {
        time: '17:00',
        kind: 'dining',
        label: "'Ohana",
        detail: '14 people',
        menuUrl: 'https://disneyworld.disney.go.com/dining/polynesian-resort/ohana/menus/',
      },
    ],
  },
  {
    date: '2026-11-10',
    kind: 'park',
    label: 'Magic Kingdom',
    parkLabel: 'Magic Kingdom',
    notes: null,
    moments: [
      { time: '07:10', kind: 'depart', label: 'Leave the resort', detail: 'Meet in the lobby' },
      { time: '08:30', kind: 'rope-drop', label: 'Rope drop' },
      {
        time: '13:55',
        kind: 'dining',
        label: 'Liberty Tree Tavern',
        detail: '14 people',
        menuUrl:
          'https://disneyworld.disney.go.com/dining/magic-kingdom/liberty-tree-tavern/menus/',
      },
    ],
  },
  {
    date: '2026-11-11',
    kind: 'resort',
    label: 'Resort day',
    parkLabel: null,
    notes: null,
    moments: [
      { time: '06:45', kind: 'depart', label: 'Leave the resort' },
      {
        time: '07:35',
        kind: 'dining',
        label: "Chef Mickey's",
        detail: '14 people',
        menuUrl: 'https://disneyworld.disney.go.com/dining/contemporary-resort/chef-mickeys/menus/',
      },
      { time: '16:40', kind: 'depart', label: 'Leave the resort' },
      {
        time: '17:50',
        kind: 'dining',
        label: 'Wailulu Bar & Grill',
        detail: '14 people',
        menuUrl:
          'https://disneyworld.disney.go.com/dining/polynesian-resort/wailulu-bar-grill/menus/',
      },
    ],
  },
  {
    date: '2026-11-12',
    kind: 'park',
    label: 'EPCOT',
    parkLabel: 'EPCOT',
    notes: 'Food & Wine',
    moments: [
      { time: '07:10', kind: 'depart', label: 'Leave the resort', detail: 'Meet in the lobby' },
      { time: '08:30', kind: 'rope-drop', label: 'Rope drop' },
    ],
  },
  {
    date: '2026-11-13',
    kind: 'resort',
    label: 'Resort day',
    parkLabel: null,
    notes: 'David / Lee / Grammy leave.',
    moments: [
      { time: '16:20', kind: 'depart', label: 'Leave the resort' },
      {
        time: '17:30',
        kind: 'dining',
        label: "Narcoossee's",
        detail: '11 people',
        menuUrl:
          'https://disneyworld.disney.go.com/dining/grand-floridian-resort-and-spa/narcoossees/menus/',
      },
    ],
  },
  {
    date: '2026-11-14',
    kind: 'park',
    label: "Disney's Animal Kingdom",
    parkLabel: "Disney's Animal Kingdom",
    notes: null,
    moments: [
      { time: '06:10', kind: 'depart', label: 'Leave the resort', detail: 'Meet in the lobby' },
      { time: '07:30', kind: 'rope-drop', label: 'Rope drop' },
    ],
  },
  {
    date: '2026-11-15',
    kind: 'travel',
    label: 'Travel day',
    parkLabel: null,
    notes: null,
  },
];
