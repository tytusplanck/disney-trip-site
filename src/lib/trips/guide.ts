import { getShortParkLabel } from './format';
import type { GuideAttraction, TripScheduleEntry } from './types';

export interface GuideParkGroup {
  parkLabel: string;
  /** In-page anchor for the park section, such as `park-magic-kingdom`. */
  anchorId: string;
  attractions: GuideAttraction[];
}

const PRIORITY_ORDER: Record<GuideAttraction['priority'], number> = {
  'must-do': 0,
  recommended: 1,
  'if-time': 2,
  skip: 3,
};

/**
 * Groups guide attractions by park in the order the trip visits each park,
 * listing higher-priority rides first. Parks missing from the schedule keep
 * their editorial order after the scheduled ones.
 */
export function getGuideParkGroups(
  attractions: GuideAttraction[],
  schedule: TripScheduleEntry[],
): GuideParkGroup[] {
  const scheduledParks = [
    ...new Set(schedule.flatMap((entry) => (entry.parkLabel ? [entry.parkLabel] : []))),
  ];
  const editorialParks = [...new Set(attractions.map((attraction) => attraction.parkLabel))];
  const parkLabels = [
    ...scheduledParks.filter((parkLabel) => editorialParks.includes(parkLabel)),
    ...editorialParks.filter((parkLabel) => !scheduledParks.includes(parkLabel)),
  ];

  return parkLabels.map((parkLabel) => ({
    parkLabel,
    anchorId: `park-${getShortParkLabel(parkLabel)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}`,
    attractions: attractions
      .filter((attraction) => attraction.parkLabel === parkLabel)
      .sort((left, right) => PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority]),
  }));
}
