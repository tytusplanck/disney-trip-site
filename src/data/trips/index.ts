import type { TripDataModule } from '../../lib/trips/types';
import { casschwlanck2026TripData } from './casschwlanck-2026';
import { declanBigSummerTripData } from './declan-big-summer-trip';
import { osborneFallFamilyTripData } from './osborne-fall-family-trip';
import { planckMegaDisneyTripData } from './planck-mega-disney-trip';

export const tripDataModules: TripDataModule[] = [
  osborneFallFamilyTripData,
  casschwlanck2026TripData,
  planckMegaDisneyTripData,
  declanBigSummerTripData,
];
