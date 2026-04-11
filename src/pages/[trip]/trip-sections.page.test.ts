import { describe, expect, it } from 'vitest';
import { tripSectionCopy } from './trip-sections.page';

describe('trip section copy', () => {
  it('keeps logistics copy focused on resort and transportation details', () => {
    expect(tripSectionCopy.logistics.summary).toBe(
      'Resort details, transportation plans, and everything the family needs.',
    );
    expect(tripSectionCopy.logistics.summary).not.toMatch(/dining|reservation/i);
  });
});
