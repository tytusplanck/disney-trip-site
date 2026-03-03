import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  join(process.cwd(), 'src/pages/[family]/[trip]/attractions.astro'),
  'utf-8',
);

describe('attractions page section order', () => {
  it('keeps the scoring system ahead of the decision board', () => {
    const scoringSystemIndex = source.indexOf('<DisclosurePanel');
    const decisionBoardIndex = source.indexOf(
      '<AttractionsExplorer client:load data={explorerData} />',
    );

    expect(scoringSystemIndex).toBeGreaterThan(-1);
    expect(decisionBoardIndex).toBeGreaterThan(-1);
    expect(scoringSystemIndex).toBeLessThan(decisionBoardIndex);
    expect(source.includes('How the board turns preferences into points')).toBe(false);
    expect(source.includes('Filter down to the right ride stack for the day')).toBe(false);
  });
});
