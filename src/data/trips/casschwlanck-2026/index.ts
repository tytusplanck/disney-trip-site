import type { TripDataModule } from '../../../lib/trips/types';
import { casschwlanck2026Attractions } from './attractions';
import { casschwlanck2026Party } from './party';
import { casschwlanck2026Schedule } from './schedule';
import { casschwlanck2026Summary } from './summary';

export const casschwlanck2026TripData: TripDataModule = {
  summary: casschwlanck2026Summary,
  party: casschwlanck2026Party,
  schedule: casschwlanck2026Schedule,
  attractions: casschwlanck2026Attractions,
  partyGrouping: {
    kind: 'named-cohorts',
    cohorts: [
      {
        id: 'kids',
        label: 'Kids',
        memberIds: ['truman', 'charlie', 'margot', 'cassian'],
      },
      {
        id: 'adults',
        label: 'Adults',
        memberIds: ['tytus', 'kelsey', 'tim', 'lisa', 'kayla', 'collin'],
      },
    ],
  },
};
