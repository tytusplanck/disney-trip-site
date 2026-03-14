import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const tripPagesStyles = readFileSync(join(process.cwd(), 'src/styles/trip-pages.css'), 'utf-8');
const tokensStyles = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf-8');
const partySummarySource = readFileSync(
  join(process.cwd(), 'src/components/PartySummary.astro'),
  'utf-8',
);
const partyTravelerCardsSource = readFileSync(
  join(process.cwd(), 'src/components/PartyTravelerCards.astro'),
  'utf-8',
);

describe('trip page style contracts', () => {
  it('renders schedule rows as a single-column timeline stack', () => {
    expect(tripPagesStyles.includes('.schedule-grid {\n  display: grid;\n  gap: 0;')).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.schedule-card {\n' +
          '  --schedule-kind-strong: var(--color-ink-soft);\n' +
          '  --schedule-kind-soft: transparent;\n' +
          '  display: grid;\n' +
          '  grid-template-columns: auto minmax(0, 1fr);',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes('border-bottom: var(--border-thin) solid var(--color-line-subtle);'),
    ).toBe(true);
  });

  it('applies semantic day colors only to the schedule badge', () => {
    expect(tokensStyles.includes('--color-schedule-travel-strong: #7046b7;')).toBe(true);
    expect(tokensStyles.includes('--color-schedule-travel-soft: #f1e7ff;')).toBe(true);
    expect(tokensStyles.includes('--color-schedule-park-strong: #0a6dad;')).toBe(true);
    expect(tokensStyles.includes('--color-schedule-park-soft: #ddf1ff;')).toBe(true);
    expect(tokensStyles.includes('--color-schedule-resort-strong: #067a48;')).toBe(true);
    expect(tokensStyles.includes('--color-schedule-resort-soft: #d8f5e6;')).toBe(true);
    expect(
      tripPagesStyles.includes(
        ".schedule-card[data-kind='travel'] {\n  --schedule-kind-strong: var(--color-schedule-travel-strong);",
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        ".schedule-card[data-kind='park'] {\n  --schedule-kind-strong: var(--color-schedule-park-strong);",
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        ".schedule-card[data-kind='resort'] {\n  --schedule-kind-strong: var(--color-schedule-resort-strong);",
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.schedule-card__day-marker {\n' +
          '  width: 3px;\n' +
          '  min-height: 5.2rem;\n' +
          '  border-radius: var(--radius-pill);\n' +
          '  background: var(--trip-accent, var(--color-brand));\n' +
          '}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.schedule-card__kind {\n' +
          '  padding: 0.3rem 0.7rem;\n' +
          '  border-radius: var(--radius-pill);\n' +
          '  background: var(--schedule-kind-soft);\n' +
          '  color: var(--schedule-kind-strong);\n' +
          '}',
      ),
    ).toBe(true);
    expect(tripPagesStyles.includes('--color-schedule-travel-accent')).toBe(false);
    expect(
      tripPagesStyles.includes(
        'background: linear-gradient(90deg, var(--schedule-kind-soft) 0%, transparent 62%);',
      ),
    ).toBe(false);
  });

  it('styles the compact party summary and traveler card grid', () => {
    expect(partySummarySource.includes('party-summary__cluster-list')).toBe(true);
    expect(partySummarySource.includes('party-summary__gap-list')).toBe(true);
    expect(partyTravelerCardsSource.includes('Priority votes')).toBe(true);
    expect(partyTravelerCardsSource.includes('Broad likes')).toBe(true);
    expect(partyTravelerCardsSource.includes('Avoid flags')).toBe(true);
    expect(partyTravelerCardsSource.includes('party-traveler-card__stat--priority')).toBe(true);
    expect(partyTravelerCardsSource.includes('party-traveler-card__stat--likes')).toBe(true);
    expect(partyTravelerCardsSource.includes('party-traveler-card__stat--avoid')).toBe(true);
    expect(partyTravelerCardsSource.includes('summary.styleDescription')).toBe(true);
    expect(partyTravelerCardsSource.includes('summaries.map((summary) => (')).toBe(true);
    expect(partyTravelerCardsSource.includes('.sort(')).toBe(false);
    expect(tripPagesStyles.includes('.party-summary__highlight')).toBe(true);
    expect(tripPagesStyles.includes('.party-traveler-cards')).toBe(true);
    expect(tripPagesStyles.includes('.party-traveler-card__stats')).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.party-summary__gap-copy {\n  justify-items: end;\n  text-align: right;\n}',
      ),
    ).toBe(true);
    expect(tripPagesStyles.includes('.party-traveler-card__stat--priority')).toBe(true);
    expect(tripPagesStyles.includes('.party-traveler-card__stat--likes')).toBe(true);
    expect(tripPagesStyles.includes('.party-traveler-card__stat--avoid')).toBe(true);
    expect(tripPagesStyles.includes('background: var(--color-success-soft);')).toBe(true);
    expect(tripPagesStyles.includes('background: var(--color-brand-soft);')).toBe(true);
    expect(tripPagesStyles.includes('background: var(--color-danger-soft);')).toBe(true);
    expect(tripPagesStyles.includes('color: var(--color-pref-must);')).toBe(true);
    expect(tripPagesStyles.includes('color: var(--color-pref-pref);')).toBe(true);
    expect(tripPagesStyles.includes('color: var(--color-pref-dont);')).toBe(true);
  });
});
