import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  join(process.cwd(), 'src/pages/[trip]/schedule.astro'),
  'utf-8',
);

describe('schedule page structure', () => {
  it('renders a direct timeline without a disclosure wrapper', () => {
    expect(source.includes('DisclosurePanel')).toBe(false);
    expect(source.includes('<div class="schedule-grid">')).toBe(true);
    expect(source.includes('ScheduleDayCard')).toBe(true);
    expect(source.includes('day={day}')).toBe(true);
  });

  it('removes the route intro and redundant daily board copy', () => {
    expect(source.includes('<p class="page-label">Daily board</p>')).toBe(false);
    expect(source.includes('pageSummary={pageCopy.summary}')).toBe(true);
  });
});
