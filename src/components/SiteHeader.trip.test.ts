import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src/components/SiteHeader.astro'), 'utf-8');

describe('trip site header markup', () => {
  it('keeps trip headers free of embedded tab slots', () => {
    expect(source.includes('slot name="desktop-tabs"')).toBe(false);
    expect(source.includes('slot name="mobile-tabs"')).toBe(false);
    expect(source.includes('site-header__desktop-tabs')).toBe(false);
    expect(source.includes('site-header__mobile-tabs')).toBe(false);
  });

  it('keeps the mobile trip header focused on back navigation and title only', () => {
    expect(source.includes('<div class="site-header__mobile site-header__mobile--trip">')).toBe(
      true,
    );
    expect(source.includes('site-header__mobile-back')).toBe(true);
    expect(source.includes('site-header__mobile-title')).toBe(true);
    expect(source.includes('site-header__mobile-facts-panel')).toBe(false);
    expect(source.includes('site-header__mobile-facts-shell')).toBe(false);
  });

  it('keeps archive headers to brand plus archive label', () => {
    expect(source.includes('site-header__mobile-brand-block')).toBe(true);
    expect(source.includes('site-header__context-text')).toBe(true);
    expect(source.includes('site-header__rail')).toBe(false);
  });
});
