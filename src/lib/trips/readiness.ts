import type { TripDataModule, TripSection } from './types';

type TripSectionData = Pick<TripDataModule, 'attractions' | 'party' | 'schedule'>;

export function hasTripOverviewContent(module: TripSectionData): boolean {
  return module.schedule.length > 0 || module.party.length > 0 || module.attractions.length > 0;
}

export function hasTripSectionContent(module: TripSectionData, section: TripSection): boolean {
  switch (section) {
    case 'overview':
      return hasTripOverviewContent(module);
    case 'attractions':
      return module.attractions.length > 0;
    case 'schedule':
      return module.schedule.length > 0;
    case 'party':
      return module.party.length > 0;
    default:
      throw new Error('Unsupported trip section.');
  }
}
