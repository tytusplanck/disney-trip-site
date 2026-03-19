import type { LLMemberPlan } from '../../../lib/trips/ll-types';

export const casschwlanck2026LLDefaultPlan: LLMemberPlan = {
  memberId: 'tytus',
  parkDays: {
    '2026-03-29': {
      illSelections: ['dak-avatar-flight-of-passage'],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: [
        'dak-expedition-everest-legend-of-the-forbidden-mountain',
        'dak-navi-river-journey',
        'dak-kilimanjaro-safaris',
      ],
    },
    '2026-03-31': {
      illSelections: ['dhs-star-wars-rise-of-the-resistance'],
      tier1Selection: 'dhs-slinky-dog-dash',
      tier2Selections: ['dhs-toy-story-mania', 'dhs-the-twilight-zone-tower-of-terror'],
      multiPassSelections: [],
    },
    '2026-04-02': {
      illSelections: ['epcot-guardians-of-the-galaxy-cosmic-rewind'],
      tier1Selection: 'epcot-frozen-ever-after',
      tier2Selections: ['epcot-soarin-around-the-world', 'epcot-living-with-the-land'],
      multiPassSelections: [],
    },
    '2026-04-04': {
      illSelections: ['mk-seven-dwarfs-mine-train', 'mk-tron-lightcycle-run'],
      tier1Selection: 'mk-tianas-bayou-adventure',
      tier2Selections: ['mk-haunted-mansion', 'mk-the-many-adventures-of-winnie-the-pooh'],
      multiPassSelections: [],
    },
  },
};
