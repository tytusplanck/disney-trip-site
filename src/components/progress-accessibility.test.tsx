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
      ratingVariance: 0.6,
    };

    render(<ConsensusBars items={[item]} />);

    expect(
      screen.getByRole('progressbar', {
        name: 'Space Mountain consensus score 18 out of 25',
      }),
    ).toBeInTheDocument();
  });

  it('keeps explicit progressbar semantics on Astro meter markup', () => {
    const partyCardSource = readFileSync(
      join(process.cwd(), 'src/components/PartyCard.astro'),
      'utf8',
    );
    const clusterBoardSource = readFileSync(
      join(process.cwd(), 'src/components/PartyClusterBoard.astro'),
      'utf8',
    );

    expect(partyCardSource).toMatch(/role="progressbar"/);
    expect(partyCardSource).toMatch(/aria-label=/);
    expect(partyCardSource).toMatch(/aria-valuenow=/);
    expect(clusterBoardSource).toMatch(/role="progressbar"/);
    expect(clusterBoardSource).toMatch(/aria-label=/);
    expect(clusterBoardSource).toMatch(/aria-valuenow=/);
  });
});
