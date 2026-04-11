import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  join(process.cwd(), 'src/pages/[trip]/travelers.astro'),
  'utf-8',
);

describe('travelers page structure', () => {
  it('uses the informational profile component, not the preference analytics cards', () => {
    expect(source.includes('TravelerProfileCards')).toBe(true);
    expect(source.includes('PartyTravelerCards')).toBe(false);
    expect(source.includes('PartySummary')).toBe(false);
  });

  it('passes the correct active section and section config to shells', () => {
    expect(source.includes('activeSection="travelers"')).toBe(true);
    expect(source.includes('sectionConfig={sectionConfig}')).toBe(true);
  });

  it('joins traveler profiles with party member names', () => {
    expect(source.includes('travelerProfiles')).toBe(true);
    expect(source.includes('member?.name')).toBe(true);
  });
});
