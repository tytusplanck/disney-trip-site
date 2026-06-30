import type { LLMemberPlan } from '../../../lib/trips/ll-types';

export const declanBigSummerTripLLDefaultPlan: LLMemberPlan = {
  memberId: 'tytus-planck',
  parkDays: {
    '2026-07-07': {
      illSelections: ['dak-avatar-flight-of-passage'],
      tier1Selection: null,
      tier2Selections: [],
      multiPassSelections: ['dak-navi-river-journey', 'dak-kilimanjaro-safaris'],
      returnWindows: {
        'dak-navi-river-journey': '10:55 AM - 11:55 AM',
        'dak-kilimanjaro-safaris': '12:05 PM - 1:05 PM',
        'dak-avatar-flight-of-passage': '2:10 PM - 3:10 PM',
      },
    },
    '2026-07-08': {
      illSelections: ['dhs-star-wars-rise-of-the-resistance'],
      tier1Selection: 'dhs-slinky-dog-dash',
      tier2Selections: ['dhs-star-tours-the-adventures-continue', 'dhs-toy-story-mania'],
      multiPassSelections: [],
      returnWindows: {
        'dhs-star-tours-the-adventures-continue': '9:20 AM - 10:20 AM',
        'dhs-star-wars-rise-of-the-resistance': '12:45 PM - 1:45 PM',
        'dhs-toy-story-mania': '4:10 PM - 5:10 PM',
        'dhs-slinky-dog-dash': '5:30 PM - 6:30 PM',
      },
    },
    '2026-07-09': {
      illSelections: ['mk-tron-lightcycle-run', 'mk-seven-dwarfs-mine-train'],
      tier1Selection: 'mk-big-thunder-mountain-railroad',
      tier2Selections: ['mk-buzz-lightyears-space-ranger-spin', 'mk-haunted-mansion'],
      multiPassSelections: [],
      returnWindows: {
        'mk-buzz-lightyears-space-ranger-spin': '9:30 AM - 10:30 AM',
        'mk-tron-lightcycle-run': '10:30 AM - 11:30 AM',
        'mk-seven-dwarfs-mine-train': '11:30 AM - 12:30 PM',
        'mk-haunted-mansion': '12:30 PM - 1:30 PM',
        'mk-big-thunder-mountain-railroad': '1:30 PM - 2:30 PM',
      },
    },
    '2026-07-10': {
      illSelections: ['epcot-guardians-of-the-galaxy-cosmic-rewind'],
      tier1Selection: 'epcot-test-track',
      tier2Selections: ['epcot-living-with-the-land', 'epcot-soarin-around-the-world'],
      multiPassSelections: [],
      returnWindows: {
        'epcot-living-with-the-land': '9:10 AM - 10:10 AM',
        'epcot-soarin-around-the-world': '10:20 AM - 11:20 AM',
        'epcot-guardians-of-the-galaxy-cosmic-rewind': '11:20 AM - 12:20 PM',
        'epcot-test-track': '12:20 PM - 1:20 PM',
      },
    },
  },
};
