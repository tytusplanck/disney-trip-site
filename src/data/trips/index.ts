import type { TripDataModule } from '../../lib/trips/types';
import { casschwlanck2026TripData } from './casschwlanck-2026';
import { planckMegaDisneyTripData } from './planck-mega-disney-trip';

export const tripDataModules: TripDataModule[] = [casschwlanck2026TripData, planckMegaDisneyTripData];
