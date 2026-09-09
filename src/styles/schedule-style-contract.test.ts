import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const globalStyles = readFileSync(join(process.cwd(), 'src/styles/global.css'), 'utf-8');
const scheduleStyles = readFileSync(join(process.cwd(), 'src/styles/schedule.css'), 'utf-8');
const tripPagesStyles = readFileSync(join(process.cwd(), 'src/styles/trip-pages.css'), 'utf-8');

describe('schedule moment style contract', () => {
  it('loads the schedule module after trip pages so it can layer on the card', () => {
    expect(globalStyles.indexOf("@import './trip-pages.css';")).toBeLessThan(
      globalStyles.indexOf("@import './schedule.css';"),
    );
  });

  it('keeps moment styling out of the oversized trip-pages stylesheet', () => {
    expect(tripPagesStyles.includes('schedule-moment')).toBe(false);
  });

  it('lays moments out as a three-column row on desktop and stacks the kind label on mobile', () => {
    expect(scheduleStyles).toMatch(
      /\.schedule-moment \{[\s\S]*?grid-template-columns: 4\.75rem 5\.5rem minmax\(0, 1fr\);[\s\S]*?grid-template-areas: 'time kind body';/,
    );
    expect(scheduleStyles).toMatch(
      /@media \(max-width: 720px\) \{[\s\S]*?\.schedule-moment \{[\s\S]*?grid-template-columns: 4\.5rem minmax\(0, 1fr\);[\s\S]*?grid-template-areas:\s*'time kind'\s*'time body';/,
    );
  });

  it('uses only shared tokens for moment color and type', () => {
    expect(scheduleStyles).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(scheduleStyles).not.toMatch(/box-shadow|linear-gradient/);
  });
});
