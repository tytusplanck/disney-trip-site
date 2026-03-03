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
  it('renders the hidden title and embedded tabs before the page content slot', () => {
    const mainIndex = tripPageShellSource.indexOf(
      '<main class="trip-shell__main trip-page-shell__main" id="main-content">',
    );
    const headingIndex = tripPageShellSource.indexOf(
      '<h1 class="visually-hidden">{pageTitle}</h1>',
    );
    const tabsIndex = tripPageShellSource.indexOf(
      '<TripTabs trip={trip} activeSection={activeSection} />',
    );
    const slotIndex = tripPageShellSource.indexOf('<slot />');

    expect(mainIndex).toBeGreaterThan(-1);
    expect(headingIndex).toBeGreaterThan(mainIndex);
    expect(tabsIndex).toBeGreaterThan(headingIndex);
    expect(slotIndex).toBeGreaterThan(tabsIndex);
  });

  it('removes the legacy visible page header and header-level tab slots', () => {
    expect(tripPageShellSource.includes('trip-shell__page-header')).toBe(false);
    expect(tripPageShellSource.includes('PageIntroTooltip')).toBe(false);
    expect(tripPageShellSource.includes('slot="desktop-tabs"')).toBe(false);
    expect(tripPageShellSource.includes('slot="mobile-tabs"')).toBe(false);
  });
});

describe('trip stub shell layout', () => {
  it('renders the hidden title and embedded tabs before the stub panel', () => {
    const mainIndex = tripStubShellSource.indexOf(
      '<main class="trip-shell__main" id="main-content">',
    );
    const headingIndex = tripStubShellSource.indexOf(
      '<h1 class="visually-hidden">{pageTitle}</h1>',
    );
    const tabsIndex = tripStubShellSource.indexOf(
      '<TripTabs trip={trip} activeSection={activeSection} />',
    );
    const panelIndex = tripStubShellSource.indexOf('<section class="stub-panel">');

    expect(mainIndex).toBeGreaterThan(-1);
    expect(headingIndex).toBeGreaterThan(mainIndex);
    expect(tabsIndex).toBeGreaterThan(headingIndex);
    expect(panelIndex).toBeGreaterThan(tabsIndex);
  });

  it('removes the legacy visible page header and header-level tab slots', () => {
    expect(tripStubShellSource.includes('trip-shell__page-header')).toBe(false);
    expect(tripStubShellSource.includes('PageIntroTooltip')).toBe(false);
    expect(tripStubShellSource.includes('slot="desktop-tabs"')).toBe(false);
    expect(tripStubShellSource.includes('slot="mobile-tabs"')).toBe(false);
  });
});
