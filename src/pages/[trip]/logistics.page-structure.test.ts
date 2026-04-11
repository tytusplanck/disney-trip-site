import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src/pages/[trip]/logistics.astro'), 'utf-8');

describe('logistics page structure', () => {
  it('uses the logistics entry card component', () => {
    expect(source.includes('LogisticsEntryCard')).toBe(true);
  });

  it('passes the correct active section and section config to shells', () => {
    expect(source.includes('activeSection="logistics"')).toBe(true);
    expect(source.includes('sectionConfig={sectionConfig}')).toBe(true);
  });

  it('renders entries from the trip module', () => {
    expect(source.includes('tripModule.logistics')).toBe(true);
  });
});
