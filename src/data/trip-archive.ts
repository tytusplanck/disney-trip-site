import type { TripDataModule, TripSummary } from '../lib/trips/types';
import { tripDataModules } from './trips';

export interface TripArchiveData {
  trips: TripSummary[];
  modules: TripDataModule[];
}

export const tripArchiveData: TripArchiveData = {
  trips: tripDataModules.map((trip) => trip.summary),
  modules: tripDataModules,
};
