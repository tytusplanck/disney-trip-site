import type { TripDataModule, TripSection } from './types';

type TripSectionData = Pick<TripDataModule, 'attractions' | 'party' | 'schedule'> & {
  llInventory?: TripDataModule['llInventory'];
  guide?: TripDataModule['guide'];
  travelerProfiles?: TripDataModule['travelerProfiles'];
  logistics?: TripDataModule['logistics'];
};

export function hasTripSectionContent(module: TripSectionData, section: TripSection): boolean {
  switch (section) {
    case 'attractions':
      return module.attractions.length > 0;
    case 'schedule':
      return module.schedule.length > 0;
    case 'party':
      return module.party.length > 0;
    case 'll':
      return module.llInventory != null && Object.keys(module.llInventory).length > 0;
    case 'guide':
      return module.guide != null && module.guide.length > 0;
    case 'travelers':
      return module.travelerProfiles != null && module.travelerProfiles.length > 0;
    case 'logistics':
      return module.logistics != null && module.logistics.length > 0;
    default:
      throw new Error('Unsupported trip section.');
  }
}
