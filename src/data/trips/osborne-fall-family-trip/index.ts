import type { TripDataModule } from '../../../lib/trips/types';
import {
  osborneFallFamilyTripLLInventory,
  osborneFallFamilyTripLLInventoryByParkDate,
} from './ll-inventory';
import { osborneFallFamilyTripLLDefaultPlan } from './ll-selections';
import { osborneFallFamilyTripParty } from './party';
import { osborneFallFamilyTripSchedule } from './schedule';
import { osborneFallFamilyTripSummary } from './summary';

export const osborneFallFamilyTripData: TripDataModule = {
  summary: osborneFallFamilyTripSummary,
  party: osborneFallFamilyTripParty,
  schedule: osborneFallFamilyTripSchedule,
  attractions: [],
  sectionConfig: [{ label: 'LL', section: 'll' }],
  llInventory: osborneFallFamilyTripLLInventory,
  llInventoryByParkDate: osborneFallFamilyTripLLInventoryByParkDate,
  llDefaultPlan: osborneFallFamilyTripLLDefaultPlan,
  llPolicy: {
    heightRestrictionsMatter: false,
  },
};
