import { describe, expect, it } from 'vitest';
import { tripSectionCopy } from './trip-sections.page';

describe('trip section copy', () => {
  it('only carries copy for planner sections that a trip can link to', () => {
    expect(Object.keys(tripSectionCopy).sort()).toEqual([
      'attractions',
      'guide',
      'll',
      'packing',
      'party',
      'schedule',
    ]);
  });
});
