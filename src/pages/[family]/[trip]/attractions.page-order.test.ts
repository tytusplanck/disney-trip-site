import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  join(process.cwd(), 'src/pages/[family]/[trip]/attractions.astro'),
  'utf-8',
);

describe('attractions page section order', () => {
  it('keeps scoring system first, decision board second, and best bets third', () => {
    const scoringSystemIndex = source.indexOf('<p class="page-label">Scoring system</p>');
    const decisionBoardIndex = source.indexOf('<p class="page-label">Decision board</p>');
    const bestBetsIndex = source.indexOf('<p class="page-label">Best bets</p>');

    expect(scoringSystemIndex).toBeGreaterThan(-1);
    expect(decisionBoardIndex).toBeGreaterThan(-1);
    expect(bestBetsIndex).toBeGreaterThan(-1);
    expect(scoringSystemIndex).toBeLessThan(decisionBoardIndex);
    expect(decisionBoardIndex).toBeLessThan(bestBetsIndex);
  });
});
