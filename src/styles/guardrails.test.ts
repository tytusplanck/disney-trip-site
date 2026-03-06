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

  it('keeps the faint text token above WCAG AA contrast on base surfaces', () => {
    const tokenSource = readFileSync(join(stylesDirectory, 'tokens.css'), 'utf8');
    const faint = getTokenValue(tokenSource, '--faint');
    const surface = getTokenValue(tokenSource, '--surface-base');

    expect(contrastRatio(faint, surface)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the muted token readable against base surfaces', () => {
    const tokenSource = readFileSync(join(stylesDirectory, 'tokens.css'), 'utf8');
    const muted = getTokenValue(tokenSource, '--muted');
    const surface = getTokenValue(tokenSource, '--surface-base');

    expect(contrastRatio(muted, surface)).toBeGreaterThanOrEqual(5);
  });

  it('keeps key mobile controls at or above 44px touch targets', () => {
    const componentsSource = readFileSync(join(stylesDirectory, 'components.css'), 'utf8');
    const tripPagesSource = readFileSync(join(stylesDirectory, 'trip-pages.css'), 'utf8');

    expect(componentsSource).not.toMatch(/min-height:\s*2\.(6|65)rem/);
    expect(componentsSource).toMatch(
      /\.site-header__mobile-back,\s*\.site-header__mobile-facts-summary\s*{[\s\S]*min-height:\s*2\.75rem;/,
    );
    expect(componentsSource).toMatch(/\.trip-tabs__link\s*{[\s\S]*min-height:\s*2\.75rem;/);
    expect(componentsSource).toMatch(/\.page-label\s*{[\s\S]*font-size:\s*0\.79rem;/);
    expect(tripPagesSource).toMatch(
      /\.attractions-explorer__chip--compact\s*{[\s\S]*min-height:\s*2\.75rem;/,
    );
  });
});
