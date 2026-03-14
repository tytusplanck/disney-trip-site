import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const tripPagesStyles = readFileSync(join(process.cwd(), 'src/styles/trip-pages.css'), 'utf-8');
const partyCardSource = readFileSync(
  join(process.cwd(), 'src/components/PartyCard.astro'),
  'utf-8',
);

describe('trip page style contracts', () => {
  it('renders schedule cards as a two-column timeline layout before mobile collapse', () => {
    expect(tripPagesStyles.includes('grid-template-columns: auto minmax(0, 1fr);')).toBe(true);
    expect(tripPagesStyles.includes('.schedule-card__day-marker')).toBe(true);
  });

  it('exposes tier row modifiers for traveler sentiment styling', () => {
    expect(partyCardSource.includes('`party-detail-card__tier-row--${tierSummary.tier}`')).toBe(
      true,
    );
    expect(
      tripPagesStyles.includes('.party-detail-card__tier-row--1 .party-detail-card__tier-label'),
    ).toBe(true);
    expect(
      tripPagesStyles.includes('.party-detail-card__tier-row--5 .party-detail-card__tier-count'),
    ).toBe(true);
  });
});
