import type { TripDataModule } from '../../../lib/trips/types';
import { secretPlanckOsborneJanuaryTripSummary } from './summary';

export const secretPlanckOsborneJanuaryTripData: TripDataModule = {
  summary: secretPlanckOsborneJanuaryTripSummary,
  party: [],
  schedule: [],
  attractions: [],
  sectionConfig: [{ label: 'Plan', section: 'schedule' }],
};
