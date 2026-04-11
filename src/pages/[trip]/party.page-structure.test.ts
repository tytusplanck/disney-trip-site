import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src/pages/[trip]/party.astro'), 'utf-8');

describe('party page structure', () => {
  it('renders visible traveler cards instead of a disclosure', () => {
    expect(source.includes('DisclosurePanel')).toBe(false);
    expect(source.includes('PartyTravelerCards')).toBe(true);
    expect(source.includes('summary="See traveler quick list"')).toBe(false);
  });

  it('replaces the old dossier board with compact summary components', () => {
    expect(source.includes('PartySummary')).toBe(true);
    expect(source.includes('PartyTravelerCards')).toBe(true);
    expect(source.includes('PartyCard')).toBe(false);
    expect(source.includes('PartyClusterBoard')).toBe(false);
  });
});
