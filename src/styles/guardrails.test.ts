import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const stylesDirectory = join(process.cwd(), 'src/styles');

function getStylesheetPaths(): string[] {
  return readdirSync(stylesDirectory)
    .filter((fileName) => fileName.endsWith('.css'))
    .map((fileName) => join(stylesDirectory, fileName));
}

function getTokenValue(source: string, tokenName: string): string {
  const tokenMatch = new RegExp(`${tokenName}:\\s*([^;]+);`).exec(source);

  if (!tokenMatch) {
    throw new Error(`Missing token: ${tokenName}`);
  }

  const value = tokenMatch[1];

  if (!value) {
    throw new Error(`Missing value for token: ${tokenName}`);
  }

  return value.trim();
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '');
  const parsedValue = Number.parseInt(normalized, 16);
  return [(parsedValue >> 16) & 255, (parsedValue >> 8) & 255, parsedValue & 255];
}

function toLinear(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const [red, green, blue] = hexToRgb(hex);
  const linearRed = toLinear(red);
  const linearGreen = toLinear(green);
  const linearBlue = toLinear(blue);

  return linearRed * 0.2126 + linearGreen * 0.7152 + linearBlue * 0.0722;
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('style guardrails', () => {
  it('prevents hard-coded accent rgba values from reappearing', () => {
    const stylesheetSources = getStylesheetPaths().map((filePath) =>
      readFileSync(filePath, 'utf8'),
    );
    const accentLiteralPattern = /rgba\(200,\s*169,\s*110,\s*[0-9.]+\)/;

    const offenders = stylesheetSources.filter((source) => accentLiteralPattern.test(source));
    expect(offenders).toEqual([]);
  });

  it('keeps the faint metadata token at AA contrast on base surfaces', () => {
    const tokenSource = readFileSync(join(stylesDirectory, 'tokens.css'), 'utf8');
    const faint = getTokenValue(tokenSource, '--color-ink-faint');
    const surface = getTokenValue(tokenSource, '--color-surface-1');

    expect(Number(contrastRatio(faint, surface).toFixed(2))).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the muted token readable against base surfaces', () => {
    const tokenSource = readFileSync(join(stylesDirectory, 'tokens.css'), 'utf8');
    const muted = getTokenValue(tokenSource, '--color-ink-muted');
    const surface = getTokenValue(tokenSource, '--color-surface-1');

    expect(contrastRatio(muted, surface)).toBeGreaterThanOrEqual(5);
  });

  it('keeps key mobile controls at or above 44px touch targets', () => {
    const tokenSource = readFileSync(join(stylesDirectory, 'tokens.css'), 'utf8');
    const componentsSource = readFileSync(join(stylesDirectory, 'components.css'), 'utf8');
    const tripPagesSource = readFileSync(join(stylesDirectory, 'trip-pages.css'), 'utf8');

    expect(getTokenValue(tokenSource, '--tap-target-min')).toBe('2.75rem');
    expect(componentsSource).not.toMatch(/min-height:\s*2\.(6|65)rem/);
    expect(componentsSource).toContain('.site-header__mobile-back {');
    expect(componentsSource).toContain('.site-header__mobile-title {');
    expect(componentsSource).toContain('.trip-tabs__link {');
    expect(componentsSource).toContain('min-height: var(--tap-target-min);');
    expect(tripPagesSource).toContain('.attractions-explorer__chip {');
    expect(tripPagesSource).toContain('.attractions-explorer__input,');
    expect(tripPagesSource).toContain('.attractions-explorer__select {');
  });

  it('keeps trip tabs and LL planner controls usable on narrow screens', () => {
    const componentsSource = readFileSync(join(stylesDirectory, 'components.css'), 'utf8');
    const tripPagesSource = readFileSync(join(stylesDirectory, 'trip-pages.css'), 'utf8');

    expect(componentsSource).toMatch(
      /@media \(max-width: 720px\) \{[\s\S]*?\.trip-tabs__rail \{[\s\S]*?grid-template-columns: none;[\s\S]*?grid-auto-flow: column;[\s\S]*?grid-auto-columns: minmax\(6\.5rem, max-content\);[\s\S]*?overflow-x: auto;/,
    );
    expect(componentsSource).toContain('.trip-tabs__rail::-webkit-scrollbar {');
    expect(componentsSource).not.toMatch(
      /@media \(max-width: 720px\) \{[\s\S]*?\.trip-tabs__rail\[data-tab-count='5'\]/,
    );
    expect(componentsSource).not.toMatch(
      /@media \(max-width: 520px\) \{[\s\S]*?\.trip-tabs__rail \{[\s\S]*?gap: 0\.35rem;/,
    );
    expect(componentsSource).not.toMatch(
      /@media \(max-width: 360px\) \{[\s\S]*?\.trip-tabs__rail \{/,
    );
    expect(componentsSource).toMatch(
      /@media \(max-width: 360px\) \{[\s\S]*?\.trip-tabs__link \{[\s\S]*?padding: var\(--space-2\) var\(--space-3\);/,
    );
    expect(tripPagesSource).toMatch(
      /\.ll-row__label \{[\s\S]*?min-width: 0;[\s\S]*?overflow-wrap: anywhere;/,
    );
    expect(tripPagesSource).toMatch(/\.ll-row__main \{/);
    expect(tripPagesSource).toMatch(/\.ll-row__top \{[\s\S]*?flex-wrap: wrap;/);
    expect(tripPagesSource).toMatch(
      /@media \(max-width: 720px\) \{[\s\S]*?\.ll-planner__actions \{[\s\S]*?flex-direction: column;/,
    );
    expect(tripPagesSource).toMatch(
      /@media \(max-width: 720px\) \{[\s\S]*?\.ll-planner__control-group::after \{/,
    );
    expect(tripPagesSource).toMatch(
      /@media \(max-width: 480px\) \{[\s\S]*?\.ll-planner__chip-row \{[\s\S]*?display: grid;[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/,
    );
  });

  it('supports five-section trip tabs on desktop and universal mobile scrolling', () => {
    const componentsSource = readFileSync(join(stylesDirectory, 'components.css'), 'utf8');
    const tripTabsSource = readFileSync(
      join(process.cwd(), 'src/components/TripTabs.astro'),
      'utf8',
    );

    expect(tripTabsSource).toContain('data-tab-count={tabs.length}');
    expect(componentsSource).toContain(".trip-tabs__rail[data-tab-count='5'] {");
    expect(componentsSource).toContain('grid-template-columns: repeat(5, minmax(0, 1fr));');
    expect(componentsSource).toMatch(
      /@media \(max-width: 720px\) \{[\s\S]*?\.trip-tabs__rail \{[\s\S]*?grid-auto-flow: column;/,
    );
  });

  it('rejects the old parchment canvas palette in active stylesheets', () => {
    const stylesheetSources = getStylesheetPaths().map((filePath) =>
      readFileSync(filePath, 'utf8'),
    );
    const deprecatedPalette = ['#f4ede3', '#ede4d8', '#f6efe6', '#ece2d5', '#ddd0bf'];

    const offenders = stylesheetSources.filter((source) =>
      deprecatedPalette.some((token) => source.toLowerCase().includes(token)),
    );

    expect(offenders).toEqual([]);
  });
});
