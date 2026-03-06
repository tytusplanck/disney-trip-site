import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src/pages/[family]/[trip]/party.astro'), 'utf-8');

describe('party page structure', () => {
  it('uses concise disclosure copy and keeps traveler details visible on first mobile view', () => {
    expect(source.includes('summary="See all traveler profiles"')).toBe(true);
    expect(source.includes('mobileBehavior="expanded"')).toBe(true);
    expect(source.includes('Open every traveler profile')).toBe(false);
  });
});
