import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  join(process.cwd(), 'src/pages/[family]/[trip]/attractions.astro'),
  'utf-8',
);

describe('attractions page section order', () => {
  it('keeps the scoring guide ahead of the reduced decision board', () => {
    const scoringGuideIndex = source.indexOf('<DisclosurePanel');
    const decisionBoardIndex = source.indexOf(
      '<AttractionsExplorer client:load data={explorerData} />',
    );

    expect(scoringGuideIndex).toBeGreaterThan(-1);
    expect(decisionBoardIndex).toBeGreaterThan(-1);
    expect(scoringGuideIndex).toBeLessThan(decisionBoardIndex);
    expect(source.includes('summary="See how scores work"')).toBe(true);
  });

  it('removes the route intro and deleted secondary analysis modules', () => {
    expect(source.includes('How the board turns preferences into points')).toBe(false);
    expect(source.includes('Filter down to the right ride stack for the day')).toBe(false);
    expect(source.includes('AttractionHeatmap')).toBe(false);
    expect(source.includes('SignalList')).toBe(false);
  });
});
