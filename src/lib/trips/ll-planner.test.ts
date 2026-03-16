import { describe, expect, it } from 'vitest';
import type { LLMemberPlan, LLParkDaySelections } from './ll-types';
import {
  buildLLPlannerData,
  deserializePlan,
  emptySelections,
  getMultiPassCount,
  serializePlan,
  toggleSelection,
} from './ll-planner';
import { casschwlanck2026TripData } from '../../data/trips/casschwlanck-2026/index';

const tripModule = casschwlanck2026TripData;
const inventory = tripModule.llInventory ?? {};
const mkInventory = inventory['magic-kingdom'];
const akInventory = inventory['animal-kingdom'];
const dhsInventory = inventory['hollywood-studios'];

describe('buildLLPlannerData', () => {
  it('builds planner data from trip module', () => {
    const plannerData = buildLLPlannerData(tripModule);
    expect(plannerData.party).toHaveLength(10);
    expect(plannerData.parkDays).toHaveLength(4);
    expect(plannerData.ownerMemberId).toBe('tytus');

    const dayDates = plannerData.parkDays.map((d) => d.parkDate);
    expect(dayDates).toEqual(['2026-03-29', '2026-03-31', '2026-04-02', '2026-04-04']);
  });

  it('derives correct park day labels', () => {
    const plannerData = buildLLPlannerData(tripModule);
    const akDay = plannerData.parkDays[0];
    expect(akDay?.parkId).toBe('animal-kingdom');
    expect(akDay?.weekdayLabel).toBe('Sun');
    expect(akDay?.dateLabel).toBe('Mar 29');
    expect(akDay?.dayNumber).toBe(2);
  });

  it('throws if llInventory is missing', () => {
    const { llInventory: _, ...noLL } = tripModule;
    expect(() => buildLLPlannerData(noLL as typeof tripModule)).toThrow('LL data is required');
  });
});

describe('toggleSelection', () => {
  if (!mkInventory || !akInventory || !dhsInventory) {
    throw new Error('Test setup: inventory data is required');
  }

  it('toggles ILL selections on and off', () => {
    let sel = emptySelections();
    sel = toggleSelection(sel, 'mk-seven-dwarfs-mine-train', mkInventory);
    expect(sel.illSelections).toEqual(['mk-seven-dwarfs-mine-train']);

    sel = toggleSelection(sel, 'mk-seven-dwarfs-mine-train', mkInventory);
    expect(sel.illSelections).toEqual([]);
  });

  it('swaps tier 1 selection (radio behavior)', () => {
    let sel = emptySelections();
    sel = toggleSelection(sel, 'mk-jungle-cruise', mkInventory);
    expect(sel.tier1Selection).toBe('mk-jungle-cruise');

    sel = toggleSelection(sel, 'mk-space-mountain', mkInventory);
    expect(sel.tier1Selection).toBe('mk-space-mountain');
  });

  it('deselects tier 1 when toggling the same one', () => {
    let sel = emptySelections();
    sel = toggleSelection(sel, 'mk-jungle-cruise', mkInventory);
    sel = toggleSelection(sel, 'mk-jungle-cruise', mkInventory);
    expect(sel.tier1Selection).toBeNull();
  });

  it('enforces tier 2 max of 2', () => {
    let sel = emptySelections();
    sel = toggleSelection(sel, 'mk-haunted-mansion', mkInventory);
    sel = toggleSelection(sel, 'mk-pirates-of-the-caribbean', mkInventory);
    expect(sel.tier2Selections).toHaveLength(2);

    // Third one should be ignored
    sel = toggleSelection(sel, 'mk-dumbo-the-flying-elephant', mkInventory);
    expect(sel.tier2Selections).toHaveLength(2);
    expect(sel.tier2Selections).not.toContain('mk-dumbo-the-flying-elephant');
  });

  it('enforces AK multi pass max of 3', () => {
    let sel = emptySelections();
    sel = toggleSelection(sel, 'dak-kilimanjaro-safaris', akInventory);
    sel = toggleSelection(
      sel,
      'dak-expedition-everest-legend-of-the-forbidden-mountain',
      akInventory,
    );
    sel = toggleSelection(sel, 'dak-navi-river-journey', akInventory);
    expect(sel.multiPassSelections).toHaveLength(3);

    sel = toggleSelection(sel, 'dak-kali-river-rapids', akInventory);
    expect(sel.multiPassSelections).toHaveLength(3);
    expect(sel.multiPassSelections).not.toContain('dak-kali-river-rapids');
  });

  it('does not toggle closed attractions', () => {
    let sel = emptySelections();
    sel = toggleSelection(sel, 'dhs-rock-n-roller-coaster-starring-the-muppets', dhsInventory);
    expect(sel.tier1Selection).toBeNull();
  });
});

describe('getMultiPassCount', () => {
  if (!mkInventory || !akInventory) {
    throw new Error('Test setup: inventory data is required');
  }

  it('counts tiered park multi pass selections', () => {
    const sel: LLParkDaySelections = {
      illSelections: ['mk-seven-dwarfs-mine-train'],
      tier1Selection: 'mk-jungle-cruise',
      tier2Selections: ['mk-haunted-mansion'],
      multiPassSelections: [],
    };
    expect(getMultiPassCount(sel, mkInventory)).toBe(2);
  });

  it('counts non-tiered park multi pass selections', () => {
    const sel: LLParkDaySelections = {
      illSelections: [],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: ['dak-kilimanjaro-safaris', 'dak-navi-river-journey'],
    };
    expect(getMultiPassCount(sel, akInventory)).toBe(2);
  });
});

describe('URL serialization round-trip', () => {
  const plannerData = buildLLPlannerData(tripModule);
  const plannerInventory = plannerData.inventory;
  const parkDays = plannerData.parkDays;

  it('serializes and deserializes a plan correctly', () => {
    const plan: LLMemberPlan = {
      memberId: 'kelsey',
      parkDays: {
        '2026-03-29': {
          illSelections: ['dak-avatar-flight-of-passage'],
          tier1Selection: null,
          tier2Selections: [],
          multiPassSelections: [
            'dak-kilimanjaro-safaris',
            'dak-expedition-everest-legend-of-the-forbidden-mountain',
            'dak-navi-river-journey',
          ],
        },
        '2026-03-31': emptySelections(),
        '2026-04-02': emptySelections(),
        '2026-04-04': {
          illSelections: ['mk-seven-dwarfs-mine-train'],
          tier1Selection: 'mk-peter-pans-flight',
          tier2Selections: ['mk-haunted-mansion', 'mk-pirates-of-the-caribbean'],
          multiPassSelections: [],
        },
      },
    };

    const hash = serializePlan(plan, plannerInventory, parkDays);
    expect(hash).toContain('ll=kelsey:');
    expect(hash.length).toBeGreaterThan(0);

    const result = deserializePlan(`#${hash}`, plannerInventory, parkDays);
    expect(result).not.toBeNull();
    expect(result?.memberId).toBe('kelsey');

    // Verify AK day
    const akSelections = result?.plan.parkDays['2026-03-29'];
    expect(akSelections?.illSelections).toEqual(['dak-avatar-flight-of-passage']);
    expect(akSelections?.multiPassSelections).toEqual([
      'dak-kilimanjaro-safaris',
      'dak-expedition-everest-legend-of-the-forbidden-mountain',
      'dak-navi-river-journey',
    ]);

    // Verify MK day
    const mkSelections = result?.plan.parkDays['2026-04-04'];
    expect(mkSelections?.illSelections).toEqual(['mk-seven-dwarfs-mine-train']);
    expect(mkSelections?.tier1Selection).toBe('mk-peter-pans-flight');
    expect(mkSelections?.tier2Selections).toEqual([
      'mk-haunted-mansion',
      'mk-pirates-of-the-caribbean',
    ]);
  });

  it('returns null for invalid hash', () => {
    expect(deserializePlan('#invalid', plannerInventory, parkDays)).toBeNull();
    expect(deserializePlan('#ll=', plannerInventory, parkDays)).toBeNull();
  });

  it('returns empty string for empty plan', () => {
    const plan: LLMemberPlan = {
      memberId: 'tytus',
      parkDays: Object.fromEntries(parkDays.map((d) => [d.parkDate, emptySelections()])),
    };
    expect(serializePlan(plan, plannerInventory, parkDays)).toBe('');
  });
});
