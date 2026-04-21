import { describe, expect, it } from 'vitest';
import type { LLMemberPlan, LLParkDaySelections } from './ll-types';
import type { ScheduleEntryKind } from './types';
import {
  buildLLPlannerData,
  deserializePlan,
  emptySelections,
  formatPriceEstimate,
  getChildParkDayPriceEstimate,
  getChildSinglePassPriceEstimate,
  getHeightRestrictedSelections,
  getMultiPassCount,
  getMultiPassPriceEstimate,
  getProjectedParkDayPriceEstimate,
  getSelectedSinglePassPriceEstimate,
  serializePlan,
  toggleSelection,
} from './ll-planner';
import { casschwlanck2026TripData } from '../../data/trips/casschwlanck-2026/index';
import { declanBigSummerTripData } from '../../data/trips/declan-big-summer-trip';

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

  it('sets hasChildren when party grouping has a kids cohort', () => {
    const plannerData = buildLLPlannerData(tripModule);
    expect(plannerData.hasChildren).toBe(true);
  });

  it('keeps mixed travel and park days in the planner park-day list', () => {
    const mixedTripModule = {
      ...tripModule,
      schedule: tripModule.schedule.map((entry, index) =>
        index === 0
          ? {
              ...entry,
              kind: 'travel' as const,
              kinds: ['travel', 'park'] as ScheduleEntryKind[],
              parkLabel: "Disney's Animal Kingdom",
            }
          : entry,
      ),
    };
    const plannerData = buildLLPlannerData(mixedTripModule);

    expect(plannerData.parkDays.map((day) => day.parkDate)).toEqual([
      '2026-03-28',
      '2026-03-29',
      '2026-03-31',
      '2026-04-02',
      '2026-04-04',
    ]);
    expect(plannerData.parkDays.map((day) => day.parkLabel)).toEqual([
      "Disney's Animal Kingdom",
      "Disney's Animal Kingdom",
      "Disney's Hollywood Studios",
      'EPCOT',
      'Magic Kingdom',
    ]);
  });

  it("builds Declan's LL planner days from the July park schedule", () => {
    const plannerData = buildLLPlannerData(declanBigSummerTripData);

    expect(plannerData.parkDays.map((day) => day.parkDate)).toEqual([
      '2026-07-07',
      '2026-07-08',
      '2026-07-09',
      '2026-07-10',
    ]);
    expect(plannerData.parkDays.map((day) => day.parkLabel)).toEqual([
      "Disney's Animal Kingdom",
      'Magic Kingdom',
      "Disney's Hollywood Studios",
      'EPCOT',
    ]);
    expect(Object.keys(plannerData.defaultPlan.parkDays)).toEqual([
      '2026-07-07',
      '2026-07-08',
      '2026-07-09',
      '2026-07-10',
    ]);
    expect(plannerData.heightRestrictionsMatter).toBe(false);
    expect(
      plannerData.inventory['magic-kingdom'].attractions.find(
        (attraction) => attraction.id === 'mk-big-thunder-mountain-railroad',
      )?.closedDuringTrip,
    ).toBe(false);
    expect(
      plannerData.inventory['magic-kingdom'].attractions.find(
        (attraction) => attraction.id === 'mk-buzz-lightyears-space-ranger-spin',
      )?.closedDuringTrip,
    ).toBe(false);
    expect(
      plannerData.inventory['hollywood-studios'].attractions.find(
        (attraction) => attraction.id === 'dhs-rock-n-roller-coaster-starring-the-muppets',
      )?.closedDuringTrip,
    ).toBe(false);
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

describe('pricing helpers', () => {
  if (!mkInventory || !akInventory) {
    throw new Error('Test setup: inventory data is required');
  }

  it('formats exact projected prices without a range', () => {
    expect(
      formatPriceEstimate({
        estimatedPriceUsd: 37,
      }),
    ).toBe('$37');
  });

  it('formats projected prices as a single estimate even when a historic range exists', () => {
    expect(
      formatPriceEstimate({
        estimatedPriceUsd: 39,
        estimatedRangeUsd: [37, 41],
      }),
    ).toBe('$39');
  });

  it('aggregates selected single pass totals when only exact values exist', () => {
    const selections: LLParkDaySelections = {
      illSelections: ['mk-seven-dwarfs-mine-train', 'mk-tron-lightcycle-run'],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: [],
    };

    expect(getSelectedSinglePassPriceEstimate(selections, mkInventory)).toEqual({
      estimatedPriceUsd: 36,
    });
  });

  it('includes Multi Pass once in the park-day total with historic ranges', () => {
    const oneSelection: LLParkDaySelections = {
      illSelections: [],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: ['dak-kilimanjaro-safaris'],
    };
    const threeSelections: LLParkDaySelections = {
      illSelections: [],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: [
        'dak-kilimanjaro-safaris',
        'dak-expedition-everest-legend-of-the-forbidden-mountain',
        'dak-navi-river-journey',
      ],
    };

    expect(getProjectedParkDayPriceEstimate(oneSelection, akInventory)).toEqual({
      estimatedPriceUsd: 35,
    });
    expect(getProjectedParkDayPriceEstimate(threeSelections, akInventory)).toEqual({
      estimatedPriceUsd: 35,
    });
  });

  it('combines Multi Pass and Single Pass ranges into the current park-day total', () => {
    const selections: LLParkDaySelections = {
      illSelections: ['dak-avatar-flight-of-passage'],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: [
        'dak-kilimanjaro-safaris',
        'dak-expedition-everest-legend-of-the-forbidden-mountain',
      ],
    };

    expect(getProjectedParkDayPriceEstimate(selections, akInventory)).toEqual({
      estimatedPriceUsd: 53,
    });
  });

  it('returns null when a park day has no priced selections', () => {
    expect(getProjectedParkDayPriceEstimate(emptySelections(), akInventory)).toBeNull();
    expect(getSelectedSinglePassPriceEstimate(emptySelections(), mkInventory)).toBeNull();
  });

  it('excludes height-restricted ILL from child single pass estimate', () => {
    // TRON (48in+, $22) and Seven Dwarfs ($14) selected at MK
    const selections: LLParkDaySelections = {
      illSelections: ['mk-seven-dwarfs-mine-train', 'mk-tron-lightcycle-run'],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: [],
    };

    // Adult gets both, child only gets Seven Dwarfs (no height restriction)
    const adultEstimate = getSelectedSinglePassPriceEstimate(selections, mkInventory);
    const childEstimate = getChildSinglePassPriceEstimate(selections, mkInventory);
    expect(adultEstimate?.estimatedPriceUsd).toBe(36);
    expect(childEstimate?.estimatedPriceUsd).toBe(14);
  });

  it('child park day total excludes height-restricted ILL attractions', () => {
    // Avatar Flight of Passage (44in+, $18) + multi pass at AK
    const selections: LLParkDaySelections = {
      illSelections: ['dak-avatar-flight-of-passage'],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: ['dak-kilimanjaro-safaris'],
    };

    const adultTotal = getProjectedParkDayPriceEstimate(selections, akInventory);
    const childTotal = getChildParkDayPriceEstimate(selections, akInventory);

    // Adult: Multi Pass ($35) + Avatar ($18) = $53
    expect(adultTotal?.estimatedPriceUsd).toBe(53);
    // Child: Multi Pass ($35) only, Avatar excluded due to height restriction
    expect(childTotal?.estimatedPriceUsd).toBe(35);
  });

  it('child estimate equals adult when no height-restricted rides are selected', () => {
    // Seven Dwarfs only (no height restriction)
    const selections: LLParkDaySelections = {
      illSelections: ['mk-seven-dwarfs-mine-train'],
      tier1Selection: 'mk-jungle-cruise',
      tier2Selections: ['mk-haunted-mansion'],
      multiPassSelections: [],
    };

    const adultTotal = getProjectedParkDayPriceEstimate(selections, mkInventory);
    const childTotal = getChildParkDayPriceEstimate(selections, mkInventory);
    expect(childTotal?.estimatedPriceUsd).toBe(adultTotal?.estimatedPriceUsd);
  });

  it('identifies height-restricted selections', () => {
    const selections: LLParkDaySelections = {
      illSelections: ['mk-seven-dwarfs-mine-train', 'mk-tron-lightcycle-run'],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: [],
    };

    const restricted = getHeightRestrictedSelections(selections, mkInventory);
    expect(restricted).toHaveLength(1);
    expect(restricted[0]?.id).toBe('mk-tron-lightcycle-run');
    expect(restricted[0]?.heightRestriction).toBe('48in+');
  });

  it('suppresses child-specific pricing when height restrictions do not matter', () => {
    const selections: LLParkDaySelections = {
      illSelections: ['mk-seven-dwarfs-mine-train', 'mk-tron-lightcycle-run'],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: [],
    };

    const childEstimate = getChildSinglePassPriceEstimate(selections, mkInventory, false);
    const childTotal = getChildParkDayPriceEstimate(selections, mkInventory, false);

    expect(childEstimate).toBeNull();
    expect(childTotal).toBeNull();
    expect(getHeightRestrictedSelections(selections, mkInventory, false)).toEqual([]);
  });

  it('allows selecting trip-overridden reopened attractions', () => {
    const declanInventory = buildLLPlannerData(declanBigSummerTripData).inventory['magic-kingdom'];

    let sel = emptySelections();
    sel = toggleSelection(sel, 'mk-big-thunder-mountain-railroad', declanInventory);
    expect(sel.tier1Selection).toBe('mk-big-thunder-mountain-railroad');

    sel = toggleSelection(sel, 'mk-buzz-lightyears-space-ranger-spin', declanInventory);
    expect(sel.tier2Selections).toContain('mk-buzz-lightyears-space-ranger-spin');
  });

  it("uses Declan's July Thrill-Data price estimates in the default plan", () => {
    const plannerData = buildLLPlannerData(declanBigSummerTripData);
    const dayTotals = plannerData.parkDays.map((day) => {
      const inventory = plannerData.inventory[day.parkId];
      const selections = plannerData.defaultPlan.parkDays[day.parkDate] ?? emptySelections();

      return {
        parkDate: day.parkDate,
        multiPass: getMultiPassPriceEstimate(inventory).estimatedPriceUsd,
        singlePass:
          getSelectedSinglePassPriceEstimate(selections, inventory)?.estimatedPriceUsd ?? 0,
        total: getProjectedParkDayPriceEstimate(selections, inventory)?.estimatedPriceUsd ?? 0,
      };
    });

    expect(dayTotals).toEqual([
      {
        parkDate: '2026-07-07',
        multiPass: 16,
        singlePass: 15,
        total: 31,
      },
      {
        parkDate: '2026-07-08',
        multiPass: 25,
        singlePass: 30,
        total: 55,
      },
      {
        parkDate: '2026-07-09',
        multiPass: 24,
        singlePass: 20,
        total: 44,
      },
      {
        parkDate: '2026-07-10',
        multiPass: 20,
        singlePass: 16,
        total: 36,
      },
    ]);
    expect(dayTotals.reduce((sum, day) => sum + day.total, 0)).toBe(166);
  });
});

describe('URL serialization round-trip', () => {
  const plannerData = buildLLPlannerData(tripModule);
  const plannerInventory = plannerData.inventory;
  const parkDays = plannerData.parkDays;
  const declanPlannerData = buildLLPlannerData(declanBigSummerTripData);
  const declanPlannerInventory = declanPlannerData.inventory;
  const declanParkDays = declanPlannerData.parkDays;

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

  it("serializes Declan's default plan to the current shared hash", () => {
    expect(
      serializePlan(declanPlannerData.defaultPlan, declanPlannerInventory, declanParkDays),
    ).toBe(
      'll=tytus-planck:0707=i.afp.m.ee.nrj.ks,0708=i.sdmt.tron.t1.btmr.t2.hm.blsrs,0709=i.rotr.t1.sdd.t2.tsm.tzt,0710=i.gotr.t1.tt.t2.sal.lwl',
    );
  });
});
