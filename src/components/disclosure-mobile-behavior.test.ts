import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const disclosureSource = readFileSync(
  join(process.cwd(), 'src/components/DisclosurePanel.astro'),
  'utf-8',
);
const islandDisclosureSource = readFileSync(
  join(process.cwd(), 'src/components/islands/DisclosurePanel.tsx'),
  'utf-8',
);
const layoutSource = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf-8');

describe('disclosure mobile behavior wiring', () => {
  it('uses explicit mobile behavior attributes in Astro and React disclosures', () => {
    expect(
      disclosureSource.includes("mobileBehavior?: 'expanded' | 'collapsed' | 'match-desktop'"),
    ).toBe(true);
    expect(disclosureSource.includes('data-mobile-behavior={mobileBehavior}')).toBe(true);
    expect(
      disclosureSource.includes("data-desktop-default-open={defaultOpen ? 'true' : 'false'}"),
    ).toBe(true);
    expect(disclosureSource.includes('mobileCollapsed')).toBe(false);

    expect(
      islandDisclosureSource.includes(
        "mobileBehavior?: 'expanded' | 'collapsed' | 'match-desktop'",
      ),
    ).toBe(true);
    expect(islandDisclosureSource.includes('data-mobile-behavior={mobileBehavior}')).toBe(true);
    expect(
      islandDisclosureSource.includes("data-desktop-default-open={defaultOpen ? 'true' : 'false'}"),
    ).toBe(true);
  });

  it('syncs disclosure open state from data-mobile-behavior in the shared layout script', () => {
    expect(
      layoutSource.includes("document.querySelectorAll('details[data-mobile-behavior]')"),
    ).toBe(true);
    expect(
      layoutSource.includes("const behavior = panel.dataset['mobileBehavior'] ?? 'match-desktop';"),
    ).toBe(true);
    expect(
      layoutSource.includes(
        "const desktopDefaultOpen = panel.dataset['desktopDefaultOpen'] !== 'false';",
      ),
    ).toBe(true);
    expect(layoutSource.includes('details[data-mobile-collapsed]')).toBe(false);
  });
});
