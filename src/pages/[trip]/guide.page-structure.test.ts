import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src/pages/[trip]/guide.astro'), 'utf-8');

describe('guide page structure', () => {
  it('uses the informational guide component, not the consensus explorer', () => {
    expect(source.includes('GuideAttractionList')).toBe(true);
    expect(source.includes('AttractionsExplorer')).toBe(false);
    expect(source.includes('AttractionsScoreGuide')).toBe(false);
  });

  it('passes the correct active section and section config to shells', () => {
    expect(source.includes('activeSection="guide"')).toBe(true);
    expect(source.includes('sectionConfig={sectionConfig}')).toBe(true);
  });

  it('groups attractions by park', () => {
    expect(source.includes('attractionsByPark')).toBe(true);
  });
});
