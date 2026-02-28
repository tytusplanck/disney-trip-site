import { getTopAttractionPick, getTripParkLabels } from '../../../lib/trips/data';
import type { TripSummary } from '../../../lib/trips/types';
import { casschwlanck2026Attractions } from './attractions';
import { casschwlanck2026Party } from './party';
import { casschwlanck2026Schedule } from './schedule';

export const casschwlanck2026Summary: TripSummary = {
  groupId: 'casschwlanck',
  id: '2026',
  title: 'Casschwlanck 2026',
  dateLabel: 'Mar 28 - Apr 5, 2026',
  parkLabels: getTripParkLabels(casschwlanck2026Attractions),
  partySize: casschwlanck2026Party.length,
  dayCount: casschwlanck2026Schedule.length,
  attractionCount: casschwlanck2026Attractions.length,
  status: 'planning',
  topPick: getTopAttractionPick(casschwlanck2026Attractions),
  themeId: 'primary',
};
