import type { LLMemberPlan } from '../../../lib/trips/ll-types';

export const declanBigSummerTripLLDefaultPlan: LLMemberPlan = {
  memberId: 'tytus-planck',
  parkDays: {
    '2026-07-07': {
      illSelections: ['dak-avatar-flight-of-passage'],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: [
        'dak-expedition-everest-legend-of-the-forbidden-mountain',
        'dak-navi-river-journey',
        'dak-kilimanjaro-safaris',
      ],
    },
    '2026-07-08': {
      illSelections: ['mk-seven-dwarfs-mine-train', 'mk-tron-lightcycle-run'],
      tier1Selection: 'mk-big-thunder-mountain-railroad',
      tier2Selections: ['mk-haunted-mansion', 'mk-buzz-lightyears-space-ranger-spin'],
      multiPassSelections: [],
    },
    '2026-07-09': {
      illSelections: ['dhs-star-wars-rise-of-the-resistance'],
      tier1Selection: 'dhs-slinky-dog-dash',
      tier2Selections: ['dhs-toy-story-mania', 'dhs-the-twilight-zone-tower-of-terror'],
      multiPassSelections: [],
    },
    '2026-07-10': {
      illSelections: ['epcot-guardians-of-the-galaxy-cosmic-rewind'],
      tier1Selection: 'epcot-test-track',
      tier2Selections: ['epcot-soarin-around-the-world', 'epcot-living-with-the-land'],
      multiPassSelections: [],
    },
  },
};
