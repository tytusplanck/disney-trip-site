import { buildAttractionPreferences } from '../lib/trips/data';
import type { RawAttractionPreferenceRow } from '../lib/trips/data';
import type {
  TripDataModule,
  TripPartyMember,
  TripScheduleEntry,
  TripSummary,
} from '../lib/trips/types';

const party: TripPartyMember[] = [
  { id: 'ava', name: 'Ava' },
  { id: 'ben', name: 'Ben' },
  { id: 'chris', name: 'Chris' },
];

const schedule: TripScheduleEntry[] = [
  {
    date: '2026-04-01',
    kind: 'travel',
    label: 'Travel day',
    parkLabel: null,
    notes: null,
  },
  {
    date: '2026-04-02',
    kind: 'park',
    label: 'EPCOT',
    parkLabel: 'EPCOT',
    notes: 'Hold - Geo82',
  },
  {
    date: '2026-04-03',
    kind: 'resort',
    label: 'Resort day',
    parkLabel: null,
    notes: null,
  },
  {
    date: '2026-04-04',
    kind: 'park',
    label: 'Magic Kingdom',
    parkLabel: 'Magic Kingdom',
    notes: 'Birthday fireworks',
  },
];

const summary: TripSummary = {
  groupId: 'fixture-family',
  id: 'fixture-trip',
  title: 'Explorer Fixture Trip',
  dateLabel: 'Apr 1-4, 2026',
  parkLabels: ['EPCOT', 'Magic Kingdom'],
  partySize: party.length,
  dayCount: schedule.length,
  attractionCount: 6,
  status: 'planning',
  topPick: 'Living with the Land',
  themeId: 'primary',
};

const attractionRows: RawAttractionPreferenceRow[] = [
  ['living-with-the-land', 'EPCOT', 'World Nature', 'Living with the Land', [1, 2, 2]],
  ['soarin', 'EPCOT', 'World Nature', "Soarin' Around the World", [2, 1, 2]],
  ['frozen-ever-after', 'EPCOT', 'World Showcase', 'Frozen Ever After', [1, 1, 4]],
  ['peter-pan', 'Magic Kingdom', 'Fantasyland', "Peter Pan's Flight", [1, 2, 3]],
  [
    'winnie-the-pooh',
    'Magic Kingdom',
    'Fantasyland',
    'The Many Adventures of Winnie the Pooh',
    [2, 3, 2],
  ],
  ['space-mountain', 'Magic Kingdom', 'Tomorrowland', 'Space Mountain', [1, 4, 5]],
];

export const attractionsExplorerFixtureTrip: TripDataModule = {
  summary,
  party,
  schedule,
  attractions: buildAttractionPreferences(party, attractionRows),
};
