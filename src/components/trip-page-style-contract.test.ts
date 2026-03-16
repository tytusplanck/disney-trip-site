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
  it('defines a shared ordered planner data-viz spectrum', () => {
    expect(tokensStyles.includes('--color-viz-1-strong: #067a48;')).toBe(true);
    expect(tokensStyles.includes('--color-viz-1-soft: #d8f5e6;')).toBe(true);
    expect(tokensStyles.includes('--color-viz-2-strong: #0a6dad;')).toBe(true);
    expect(tokensStyles.includes('--color-viz-2-soft: #ddf1ff;')).toBe(true);
    expect(tokensStyles.includes('--color-viz-3-strong: #607b97;')).toBe(true);
    expect(tokensStyles.includes('--color-viz-3-soft: #eaf0f6;')).toBe(true);
    expect(tokensStyles.includes('--color-viz-4-strong: #7046b7;')).toBe(true);
    expect(tokensStyles.includes('--color-viz-4-soft: #f1e7ff;')).toBe(true);
    expect(tokensStyles.includes('--color-viz-5-strong: #5d3d98;')).toBe(true);
    expect(tokensStyles.includes('--color-viz-5-soft: #ede5fb;')).toBe(true);
    expect(tokensStyles.includes('--color-pref-must: var(--color-viz-1-strong);')).toBe(true);
    expect(tokensStyles.includes('--color-pref-pref: var(--color-viz-2-strong);')).toBe(true);
    expect(tokensStyles.includes('--color-pref-indif: var(--color-viz-3-strong);')).toBe(true);
    expect(tokensStyles.includes('--color-pref-dont: var(--color-viz-4-strong);')).toBe(true);
    expect(tokensStyles.includes('--color-pref-skip: var(--color-viz-5-strong);')).toBe(true);
    expect(tokensStyles.includes('--must-bg: var(--color-viz-1-soft);')).toBe(true);
    expect(tokensStyles.includes('--pref-bg: var(--color-viz-2-soft);')).toBe(true);
    expect(tokensStyles.includes('--indif-bg: var(--color-viz-3-soft);')).toBe(true);
    expect(tokensStyles.includes('--dont-bg: var(--color-viz-4-soft);')).toBe(true);
    expect(tokensStyles.includes('--skip-bg: var(--color-viz-5-soft);')).toBe(true);
    expect(tokensStyles.includes('--color-viz-track: #d8e6f4;')).toBe(true);
    expect(tokensStyles.includes('--color-viz-grid: #eaf1f8;')).toBe(true);
  });

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

  it('maps attractions ranking cues to the shared planner spectrum', () => {
    expect(
      tripPagesStyles.includes(
        '.trip-tier-token--1 {\n  background: var(--color-viz-1-soft);\n  color: var(--color-viz-1-strong);\n}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.trip-tier-token--5 {\n  background: var(--color-viz-5-soft);\n  color: var(--color-viz-5-strong);\n}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.consensus-row__star {\n' +
          '  display: inline-flex;\n' +
          '  align-items: center;\n' +
          '  padding: 0.2rem 0.55rem;\n' +
          '  border: var(--border-thin) solid transparent;\n' +
          '  border-radius: var(--radius-pill);\n' +
          '  background: var(--color-viz-2-soft);\n' +
          '  color: var(--color-viz-2-strong);\n',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.consensus-progress--high {\n  --bar-fill: var(--color-viz-1-strong);\n}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.consensus-progress--medium {\n  --bar-fill: var(--color-viz-2-strong);\n}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.consensus-progress--low {\n  --bar-fill: var(--color-viz-3-strong);\n}',
      ),
    ).toBe(true);
  });

  it('styles the compact party summary and traveler card grid', () => {
    expect(partySummarySource.includes('party-summary__cluster-list')).toBe(true);
    expect(partySummarySource.includes('party-summary__gap-list')).toBe(true);
    expect(partySummarySource.includes('party-summary__cluster-anchor')).toBe(true);
    expect(partySummarySource.includes('party-summary__cluster-affinity')).toBe(true);
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
    expect(tripPagesStyles.includes('.party-summary__highlight::before')).toBe(true);
    expect(tripPagesStyles.includes('var(--color-viz-2-strong) 0%,')).toBe(true);
    expect(tripPagesStyles.includes('var(--color-viz-4-strong) 100%')).toBe(true);
    expect(tripPagesStyles.includes('.party-summary__cluster-affinity')).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.party-summary__cluster-affinity {\n' +
          '  display: inline-flex;\n' +
          '  align-items: center;\n' +
          '  justify-self: end;\n' +
          '  min-height: 2rem;\n' +
          '  padding: 0.2rem 0.7rem;\n' +
          '  border-radius: var(--radius-pill);\n' +
          '  background: var(--color-viz-2-soft);\n' +
          '  color: var(--color-viz-2-strong);\n',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.party-summary__gap-badge {\n' +
          '  min-width: 4.75rem;\n' +
          '  padding: 0.28rem 0.65rem;\n' +
          '  border: var(--border-thin) solid transparent;\n' +
          '  border-radius: var(--radius-pill);\n' +
          '  background: var(--color-viz-4-soft);\n' +
          '  color: var(--color-viz-4-strong);\n',
      ),
    ).toBe(true);
    expect(tripPagesStyles.includes('.party-traveler-cards')).toBe(true);
    expect(tripPagesStyles.includes('.party-traveler-card__stats')).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.party-traveler-card__stat--priority {\n  background: var(--color-viz-1-soft);\n}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.party-traveler-card__stat--likes {\n  background: var(--color-viz-2-soft);\n}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.party-traveler-card__stat--avoid {\n  background: var(--color-viz-5-soft);\n}',
      ),
    ).toBe(true);
    expect(tripPagesStyles.includes('color: var(--color-viz-1-strong);')).toBe(true);
    expect(tripPagesStyles.includes('color: var(--color-viz-2-strong);')).toBe(true);
    expect(tripPagesStyles.includes('color: var(--color-viz-4-strong);')).toBe(true);
    expect(tripPagesStyles.includes('color: var(--color-viz-5-strong);')).toBe(true);
  });

  it('styles the consensus progress bar as a rounded native progress control', () => {
    expect(
      tripPagesStyles.includes(
        '.consensus-progress {\n' +
          '  --consensus-progress-radius: min(var(--radius-sm), 0.36rem);\n' +
          '  --bar-fill: var(--color-viz-2-strong);\n' +
          '  width: 100%;\n' +
          '  height: 0.75rem;\n' +
          '  display: block;\n' +
          '  overflow: hidden;\n' +
          '  appearance: none;\n' +
          '  -webkit-appearance: none;\n' +
          '  border: 0;\n' +
          '  border-radius: var(--consensus-progress-radius);\n' +
          '  background: var(--color-viz-track);\n' +
          '}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.consensus-progress::-webkit-progress-bar {\n' +
          '  background: var(--color-viz-track);\n' +
          '  border-radius: var(--consensus-progress-radius);\n' +
          '}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.consensus-progress::-webkit-progress-value {\n' +
          '  background: var(--bar-fill);\n' +
          '  border-radius: var(--consensus-progress-radius);\n' +
          '}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.consensus-progress::-moz-progress-bar {\n' +
          '  background: var(--bar-fill);\n' +
          '  border-radius: var(--consensus-progress-radius);\n' +
          '}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.consensus-progress--high {\n  --bar-fill: var(--color-viz-1-strong);\n}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.consensus-progress--medium {\n  --bar-fill: var(--color-viz-2-strong);\n}',
      ),
    ).toBe(true);
    expect(
      tripPagesStyles.includes(
        '.consensus-progress--low {\n  --bar-fill: var(--color-viz-3-strong);\n}',
      ),
    ).toBe(true);
  });
});
