import { describe, expect, it } from 'vitest';
import {
  formatScheduleMomentTime,
  getScheduleMomentViews,
  scheduleMomentKindLabelByValue,
} from './schedule';
import type { TripScheduleEntry } from './types';

const baseEntry: TripScheduleEntry = {
  date: '2026-11-12',
  kind: 'park',
  label: 'Magic Kingdom',
  parkLabel: 'Magic Kingdom',
  notes: null,
};

describe('schedule moment helpers', () => {
  it('formats 24-hour times as 12-hour labels', () => {
    expect(formatScheduleMomentTime('07:15')).toBe('7:15 AM');
    expect(formatScheduleMomentTime('00:05')).toBe('12:05 AM');
    expect(formatScheduleMomentTime('12:00')).toBe('12:00 PM');
    expect(formatScheduleMomentTime('12:30')).toBe('12:30 PM');
    expect(formatScheduleMomentTime('18:30')).toBe('6:30 PM');
    expect(formatScheduleMomentTime('23:59')).toBe('11:59 PM');
  });

  it('rejects malformed times instead of rendering garbage', () => {
    expect(() => formatScheduleMomentTime('7:15')).toThrow();
    expect(() => formatScheduleMomentTime('07:15 AM')).toThrow();
    expect(() => formatScheduleMomentTime('24:00')).toThrow();
    expect(() => formatScheduleMomentTime('07:60')).toThrow();
    expect(() => formatScheduleMomentTime('')).toThrow();
  });

  it('labels every moment kind', () => {
    expect(scheduleMomentKindLabelByValue).toEqual({
      depart: 'Leave',
      'rope-drop': 'Rope drop',
      dining: 'Dining',
      show: 'Show',
      arrival: 'Arrive',
    });
  });

  it('returns an empty list when a day has no moments', () => {
    expect(getScheduleMomentViews(baseEntry)).toEqual([]);
    expect(getScheduleMomentViews({ ...baseEntry, moments: [] })).toEqual([]);
  });

  it('sorts moments by time and maps them to render-only view fields', () => {
    const views = getScheduleMomentViews({
      ...baseEntry,
      moments: [
        {
          time: '12:30',
          kind: 'dining',
          label: 'Liberty Tree Tavern',
          detail: '14 people',
          status: 'penciled',
        },
        { time: '07:15', kind: 'depart', label: 'Leave the resort', detail: 'Meet in the lobby' },
        { time: '08:00', kind: 'rope-drop', label: 'Rope drop' },
      ],
    });

    expect(views).toEqual([
      {
        datetime: '07:15',
        timeLabel: '7:15 AM',
        kind: 'depart',
        kindLabel: 'Leave',
        label: 'Leave the resort',
        detail: 'Meet in the lobby',
        statusLabel: null,
        menuUrl: null,
      },
      {
        datetime: '08:00',
        timeLabel: '8:00 AM',
        kind: 'rope-drop',
        kindLabel: 'Rope drop',
        label: 'Rope drop',
        detail: null,
        statusLabel: null,
        menuUrl: null,
      },
      {
        datetime: '12:30',
        timeLabel: '12:30 PM',
        kind: 'dining',
        kindLabel: 'Dining',
        label: 'Liberty Tree Tavern',
        detail: '14 people',
        statusLabel: 'Penciled',
        menuUrl: null,
      },
    ]);
  });

  it('does not mutate the source moments array when sorting', () => {
    const moments = [
      { time: '12:30', kind: 'dining', label: 'B' },
      { time: '07:15', kind: 'depart', label: 'A' },
    ] as const;
    const entry: TripScheduleEntry = { ...baseEntry, moments: [...moments] };
    getScheduleMomentViews(entry);
    expect(entry.moments?.map((moment) => moment.label)).toEqual(['B', 'A']);
  });

  it('labels booked reservations', () => {
    const [view] = getScheduleMomentViews({
      ...baseEntry,
      moments: [{ time: '18:00', kind: 'dining', label: 'X', status: 'booked' }],
    });
    expect(view?.statusLabel).toBe('Booked');
  });

  it('passes a validated menu url through to the view and leaves it null otherwise', () => {
    const [linked, plain] = getScheduleMomentViews({
      ...baseEntry,
      moments: [
        {
          time: '12:30',
          kind: 'dining',
          label: 'Liberty Tree Tavern',
          menuUrl:
            'https://disneyworld.disney.go.com/dining/magic-kingdom/liberty-tree-tavern/menus/',
        },
        { time: '18:00', kind: 'dining', label: 'Somewhere else' },
      ],
    });

    expect(linked?.menuUrl).toBe(
      'https://disneyworld.disney.go.com/dining/magic-kingdom/liberty-tree-tavern/menus/',
    );
    expect(plain?.menuUrl).toBeNull();
  });

  it('rejects menu urls that are not https disneyworld links', () => {
    const build = (menuUrl: string) =>
      getScheduleMomentViews({
        ...baseEntry,
        moments: [{ time: '12:30', kind: 'dining', label: 'X', menuUrl }],
      });

    expect(() => build('http://disneyworld.disney.go.com/dining/x/y/menus/')).toThrow();
    expect(() => build('https://example.com/menus/')).toThrow();
    expect(() => build('javascript:alert(1)')).toThrow();
    expect(() => build('/dining/magic-kingdom/liberty-tree-tavern/menus/')).toThrow();
  });

  it('rejects menu urls on non-dining moments', () => {
    expect(() =>
      getScheduleMomentViews({
        ...baseEntry,
        moments: [
          {
            time: '08:00',
            kind: 'rope-drop',
            label: 'Rope drop',
            menuUrl:
              'https://disneyworld.disney.go.com/dining/magic-kingdom/liberty-tree-tavern/menus/',
          },
        ],
      }),
    ).toThrow();
  });
});
