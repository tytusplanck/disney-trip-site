import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const tokenSource = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');

function getTokenValue(tokenName: string): string {
  const value = new RegExp(`${tokenName}:\\s*([^;]+);`).exec(tokenSource)?.[1];

  if (!value) {
    throw new Error(`Missing token: ${tokenName}`);
  }

  return value.trim();
}

function luminance(hex: string): number {
  const parsedValue = Number.parseInt(hex.replace('#', ''), 16);
  const [red, green, blue] = [16, 8, 0].map((shift) => {
    const normalized = ((parsedValue >> shift) & 255) / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];

  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('design token guardrails', () => {
  it('keeps the faint metadata token at AA contrast on base surfaces', () => {
    const ratio = contrastRatio(
      getTokenValue('--color-ink-faint'),
      getTokenValue('--color-surface-1'),
    );

    expect(Number(ratio.toFixed(2))).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the muted token readable against base surfaces', () => {
    const ratio = contrastRatio(
      getTokenValue('--color-ink-muted'),
      getTokenValue('--color-surface-1'),
    );

    expect(ratio).toBeGreaterThanOrEqual(5);
  });

  it('keeps the minimum tap target at 44px', () => {
    expect(getTokenValue('--tap-target-min')).toBe('2.75rem');
  });
});
