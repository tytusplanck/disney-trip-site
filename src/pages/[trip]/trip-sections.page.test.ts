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

  it('offers print export only on the plan and packing pages', () => {
    const printable = Object.entries(tripSectionCopy)
      .filter(([, copy]) => copy.print)
      .map(([section]) => section);
    expect(printable).toEqual(['schedule', 'packing']);
    expect(tripSectionCopy.schedule.print?.buttonLabel).toBe('Print / Save PDF');
    expect(tripSectionCopy.packing.print?.buttonLabel).toBe('Print / Save PDF');
  });
});
