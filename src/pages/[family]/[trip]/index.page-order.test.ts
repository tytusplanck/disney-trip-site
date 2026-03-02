import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src/pages/[family]/[trip]/index.astro'), 'utf-8');

describe('overview page action order', () => {
  it('keeps attractions first, schedule second, and party third', () => {
    const attractionsIndex = source.indexOf("title: 'Attractions'");
    const scheduleIndex = source.indexOf("title: 'Schedule'");
    const partyIndex = source.indexOf("title: 'Party'");

    expect(attractionsIndex).toBeGreaterThan(-1);
    expect(scheduleIndex).toBeGreaterThan(-1);
    expect(partyIndex).toBeGreaterThan(-1);
    expect(attractionsIndex).toBeLessThan(scheduleIndex);
    expect(scheduleIndex).toBeLessThan(partyIndex);
  });

  it('removes the legacy overview summaries', () => {
    expect(source.includes('Park lineup')).toBe(false);
    expect(source.includes('Shared must-dos')).toBe(false);
    expect(source.includes('Quick routes')).toBe(false);
  });
});
