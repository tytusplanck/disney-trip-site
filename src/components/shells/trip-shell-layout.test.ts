import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const tripPageShellSource = readFileSync(
  join(process.cwd(), 'src/components/shells/TripPageShell.astro'),
  'utf-8',
);
const tripStubShellSource = readFileSync(
  join(process.cwd(), 'src/components/shells/TripStubShell.astro'),
  'utf-8',
);

describe('trip page shell layout', () => {
  it('renders tabs, then the visible heading block, then the page slot', () => {
    const tabsIndex = tripPageShellSource.indexOf(
      '<TripTabs trip={trip} activeSection={activeSection} />',
    );
    const headingIndex = tripPageShellSource.indexOf('<section class="trip-page-heading">');
    const slotIndex = tripPageShellSource.indexOf('<slot />');

    expect(tabsIndex).toBeGreaterThan(-1);
    expect(headingIndex).toBeGreaterThan(tabsIndex);
    expect(slotIndex).toBeGreaterThan(headingIndex);
    expect(tripPageShellSource.includes('pageSummary')).toBe(true);
  });

  it('removes the legacy page header and header-level tab slots', () => {
    expect(tripPageShellSource.includes('trip-shell__page-header')).toBe(false);
    expect(tripPageShellSource.includes('PageIntroTooltip')).toBe(false);
    expect(tripPageShellSource.includes('slot="desktop-tabs"')).toBe(false);
    expect(tripPageShellSource.includes('slot="mobile-tabs"')).toBe(false);
  });
});

describe('trip stub shell layout', () => {
  it('keeps tabs embedded in the content shell ahead of the stub panel', () => {
    const tabsIndex = tripStubShellSource.indexOf(
      '<TripTabs trip={trip} activeSection={activeSection} />',
    );
    const panelIndex = tripStubShellSource.indexOf('<section class="stub-panel">');

    expect(tabsIndex).toBeGreaterThan(-1);
    expect(panelIndex).toBeGreaterThan(tabsIndex);
  });

  it('removes the legacy visible page header and header-level tab slots', () => {
    expect(tripStubShellSource.includes('trip-shell__page-header')).toBe(false);
    expect(tripStubShellSource.includes('PageIntroTooltip')).toBe(false);
    expect(tripStubShellSource.includes('slot="desktop-tabs"')).toBe(false);
    expect(tripStubShellSource.includes('slot="mobile-tabs"')).toBe(false);
  });
});
