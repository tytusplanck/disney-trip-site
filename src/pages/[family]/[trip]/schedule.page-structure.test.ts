import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  join(process.cwd(), 'src/pages/[family]/[trip]/schedule.astro'),
  'utf-8',
);

describe('schedule page structure', () => {
  it('opens directly into the itinerary disclosure without the redundant daily board header', () => {
    expect(source.includes('<p class="page-label">Daily board</p>')).toBe(false);
    expect(source.includes('label="Full itinerary"')).toBe(true);
    expect(source.includes('summary="See full itinerary"')).toBe(true);
    expect(source.includes('mobileBehavior="expanded"')).toBe(true);
  });
});
