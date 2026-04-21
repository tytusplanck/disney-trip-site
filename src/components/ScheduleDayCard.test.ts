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
});
