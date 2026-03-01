import type { TripDataModule, TripSummary } from '../lib/trips/types';
import { tripDataModules } from './trips';

export interface AllTripsData {
  trips: TripSummary[];
  modules: TripDataModule[];
}

export const allTripsData: AllTripsData = {
  trips: tripDataModules.map((trip) => trip.summary),
  modules: tripDataModules,
};
