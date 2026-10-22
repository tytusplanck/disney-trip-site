import { describe, expect, it } from 'vitest';
import { getGuideParkGroups } from './guide';
import type { GuideAttraction, TripScheduleEntry } from './types';

function attraction(
  id: string,
  parkLabel: string,
  priority: GuideAttraction['priority'],
): GuideAttraction {
  return { id, parkLabel, areaLabel: 'Area', attractionLabel: id, priority, notes: '' };
}

function parkDay(date: string, parkLabel: string): TripScheduleEntry {
  return { date, kind: 'park', label: parkLabel, parkLabel, notes: null };
}

const schedule: TripScheduleEntry[] = [
  { date: '2026-11-07', kind: 'travel', label: 'Travel day', parkLabel: null, notes: null },
  parkDay('2026-11-08', "Disney's Hollywood Studios"),
  parkDay('2026-11-10', 'Magic Kingdom'),
  parkDay('2026-11-12', 'EPCOT'),
  parkDay('2026-11-14', 'Magic Kingdom'),
];

describe('getGuideParkGroups', () => {
  it('orders parks by their first scheduled park day', () => {
    const groups = getGuideParkGroups(
      [
        attraction('everest', "Disney's Animal Kingdom", 'must-do'),
        attraction('test-track', 'EPCOT', 'must-do'),
        attraction('haunted-mansion', 'Magic Kingdom', 'must-do'),
        attraction('slinky', "Disney's Hollywood Studios", 'must-do'),
      ],
      schedule,
    );

    expect(groups.map((group) => group.parkLabel)).toEqual([
      "Disney's Hollywood Studios",
      'Magic Kingdom',
      'EPCOT',
      "Disney's Animal Kingdom",
    ]);
    expect(groups.map((group) => group.anchorId)).toEqual([
      'park-hollywood-studios',
      'park-magic-kingdom',
      'park-epcot',
      'park-animal-kingdom',
    ]);
  });

  it('lists must-do rides first while keeping editorial order within a priority', () => {
    const [group] = getGuideParkGroups(
      [
        attraction('jungle-cruise', 'Magic Kingdom', 'recommended'),
        attraction('space-mountain', 'Magic Kingdom', 'if-time'),
        attraction('tiana', 'Magic Kingdom', 'must-do'),
        attraction('pirates', 'Magic Kingdom', 'recommended'),
        attraction('pooh', 'Magic Kingdom', 'must-do'),
        attraction('skip-me', 'Magic Kingdom', 'skip'),
      ],
      schedule,
    );

    expect(group?.attractions.map((item) => item.id)).toEqual([
      'tiana',
      'pooh',
      'jungle-cruise',
      'pirates',
      'space-mountain',
      'skip-me',
    ]);
  });
});
