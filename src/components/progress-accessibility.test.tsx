import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ConsensusBars from './ConsensusBars';
import type { AttractionsExplorerAttraction } from '../lib/trips/attractions-explorer';

describe('progress accessibility', () => {
  it('announces consensus progress bars with attraction and score details', () => {
    const item: AttractionsExplorerAttraction = {
      id: 'space',
      attractionLabel: 'Space Mountain',
      parkLabel: 'Magic Kingdom',
      areaLabel: 'Tomorrowland',
      consensusScore: 18,
      maxScore: 25,
      scorePercent: 72,
      mustDoVotes: 3,
      preferredVotes: 1,
      tone: 'high',
      memberTiers: { ada: 1 },
    };

    render(<ConsensusBars items={[item]} />);

    expect(
      screen.getByRole('progressbar', {
        name: 'Space Mountain consensus score 18 out of 25',
      }),
    ).toBeInTheDocument();
  });

  it('keeps the reduced party surfaces free of obsolete progress meters', () => {
    const partySummarySource = readFileSync(
      join(process.cwd(), 'src/components/PartySummary.astro'),
      'utf8',
    );
    const partyTravelerCardsSource = readFileSync(
      join(process.cwd(), 'src/components/PartyTravelerCards.astro'),
      'utf8',
    );

    expect(partySummarySource.includes('role="progressbar"')).toBe(false);
    expect(partyTravelerCardsSource.includes('role="progressbar"')).toBe(false);
  });
});
