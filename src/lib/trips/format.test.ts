import { describe, expect, it } from 'vitest';
import { getAttractionTone, getDayLabels, getShortParkLabel } from './format';

describe('trip format helpers', () => {
  it('drops the Disney possessive from park labels for compact chips', () => {
    expect(getShortParkLabel("Disney's Hollywood Studios")).toBe('Hollywood Studios');
    expect(getShortParkLabel('Disney’s Animal Kingdom')).toBe('Animal Kingdom');
    expect(getShortParkLabel('Magic Kingdom')).toBe('Magic Kingdom');
    expect(getShortParkLabel('EPCOT')).toBe('EPCOT');
  });

  it('builds short weekday and date labels from an ISO date', () => {
    expect(getDayLabels('2026-03-28')).toEqual({ weekdayLabel: 'Sat', dateLabel: 'Mar 28' });
    expect(getDayLabels('2026-09-05')).toEqual({ weekdayLabel: 'Sat', dateLabel: 'Sep 5' });
    expect(getDayLabels('2026-12-31')).toEqual({ weekdayLabel: 'Thu', dateLabel: 'Dec 31' });
  });

  it('labels every month with a three-letter abbreviation', () => {
    const labels = Array.from(
      { length: 12 },
      (_, index) =>
        getDayLabels(`2026-${String(index + 1).padStart(2, '0')}-10`).dateLabel.split(' ')[0],
    );

    expect(labels).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]);
  });

  it('assigns tone bands at the 74 and 58 percent cutoffs', () => {
    expect(getAttractionTone(100)).toBe('high');
    expect(getAttractionTone(74)).toBe('high');
    expect(getAttractionTone(73)).toBe('medium');
    expect(getAttractionTone(58)).toBe('medium');
    expect(getAttractionTone(57)).toBe('low');
    expect(getAttractionTone(0)).toBe('low');
  });
});
