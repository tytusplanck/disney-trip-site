import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src/components/ScheduleDayCard.astro'), 'utf-8');

describe('ScheduleDayCard', () => {
  it('renders one badge per schedule kind when a day has multiple labels', () => {
    expect(source.includes('day.badges.map((badge) => (')).toBe(true);
    expect(source.includes('schedule-card__kind--${badge.kind}')).toBe(true);
  });

  it('suppresses the park sub-label when a mixed day already names the park in the title', () => {
    expect(source.includes('day.badges.length === 1')).toBe(true);
  });

  it('renders the moment list only when a day has moments, between the title block and the note', () => {
    expect(source.includes('day.moments.length > 0 && (')).toBe(true);
    expect(source.includes('<ol class="schedule-moments">')).toBe(true);
    expect(source.includes('<time class="schedule-moment__time" datetime={moment.datetime}>')).toBe(
      true,
    );
    expect(source.indexOf('schedule-moments')).toBeLessThan(source.indexOf('schedule-card__note'));
    expect(source.indexOf('schedule-card__park')).toBeLessThan(source.indexOf('schedule-moments'));
  });

  it('renders optional moment detail and status without empty separators', () => {
    expect(
      source.includes(
        '{moment.detail && <span class="schedule-moment__detail">{moment.detail}</span>}',
      ),
    ).toBe(true);
    expect(source.includes('{moment.statusLabel && (')).toBe(true);
    expect(
      source.includes('<span class="schedule-moment__status">{moment.statusLabel}</span>'),
    ).toBe(true);
  });

  it('links the dining label to its menu in a new tab with an accessible hint, or renders plain text', () => {
    expect(source.includes('moment.menuUrl ? (')).toBe(true);
    expect(source.includes('class="schedule-moment__label schedule-moment__link"')).toBe(true);
    expect(source.includes('href={moment.menuUrl}')).toBe(true);
    expect(source.includes('target="_blank"')).toBe(true);
    expect(source.includes('rel="noopener noreferrer"')).toBe(true);
    expect(
      source.includes('<span class="visually-hidden">, menu (opens in a new tab)</span>'),
    ).toBe(true);
    expect(source.includes('<span class="schedule-moment__label">{moment.label}</span>')).toBe(
      true,
    );
  });
});
