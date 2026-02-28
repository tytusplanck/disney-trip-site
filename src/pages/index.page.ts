interface MetaContent {
  title: string;
  description: string;
}

interface HomeHeroContent {
  eyebrow: string;
  title: string;
  lede: string;
  detail: string;
  chips: string[];
}

interface SnapshotItem {
  label: string;
  value: string;
  note: string;
}

interface SnapshotContent {
  heading: string;
  intro: string;
  items: SnapshotItem[];
}

interface PlanningGroup {
  title: string;
  description: string;
  items: string[];
}

interface PlanningContent {
  heading: string;
  intro: string;
  groups: PlanningGroup[];
}

interface TimelineStep {
  phase: string;
  title: string;
  description: string;
}

interface TimelineContent {
  heading: string;
  intro: string;
  steps: TimelineStep[];
}

interface LogoutContent {
  heading: string;
  text: string;
  buttonLabel: string;
}

export interface HomePage {
  meta: MetaContent;
  hero: HomeHeroContent;
  snapshot: SnapshotContent;
  planning: PlanningContent;
  timeline: TimelineContent;
  logout: LogoutContent;
}

export const homePage: HomePage = {
  meta: {
    title: 'Disney Trip Planner',
    description:
      'Private planning shell for shaping the Disney trip before real itinerary details are added.',
  },
  hero: {
    eyebrow: 'Protected planning workspace',
    title: 'Set up the trip site before the itinerary is final.',
    lede: 'This first pass focuses on structure and editable content slots rather than finished park plans.',
    detail:
      'Each route now owns a typed page object so trip copy can change without mixing long text blocks into Astro templates.',
    chips: [
      'Route-level page objects',
      'Server-rendered',
      'No inline styles',
      'Ready for trip details',
    ],
  },
  snapshot: {
    heading: 'Planning scaffold',
    intro:
      'Use these blocks as placeholders for the first real round of content entry once travel dates and priorities are settled.',
    items: [
      {
        label: 'Trip rhythm',
        value: 'Narrative first',
        note: 'Define the shape of the week before filling in park-by-park specifics.',
      },
      {
        label: 'Primary focus',
        value: 'Decision clarity',
        note: 'Separate items that need advance reservations from items that can stay flexible.',
      },
      {
        label: 'Current state',
        value: 'Shell complete',
        note: 'Route data modules, layout structure, and styling guardrails are in place for actual trip data.',
      },
    ],
  },
  planning: {
    heading: 'Content lanes',
    intro:
      'The page is organized around the kinds of information a family trip site usually needs, without pretending the details already exist.',
    groups: [
      {
        title: 'Parks and priorities',
        description: 'Capture anchors first so later edits stay purposeful.',
        items: [
          'List must-do attractions versus optional extras.',
          'Track rider constraints, height notes, and group splits.',
          'Keep park-specific reminders concise and skimmable.',
        ],
      },
      {
        title: 'Dining and reservations',
        description: 'Document what is locked in and what still needs monitoring.',
        items: [
          'Mark reservations that need exact times or deposit details.',
          'Separate celebratory meals from utility stops.',
          'Add cancellation windows once bookings start landing.',
        ],
      },
      {
        title: 'Logistics and budget',
        description: 'Make the less glamorous details easy to maintain.',
        items: [
          'Store flight, hotel, and transport checkpoints in plain language.',
          'Note spending buckets before individual charges pile up.',
          'Leave space for packing, weather, and contingency notes.',
        ],
      },
      {
        title: 'Memory cues',
        description: 'Not every useful note is operational.',
        items: [
          'Reserve room for photo ideas, surprises, or family traditions.',
          'Keep a shortlist of moments worth protecting from over-scheduling.',
          'Use short prompts that can later expand into real trip stories.',
        ],
      },
    ],
  },
  timeline: {
    heading: 'Build sequence',
    intro:
      'A simple order of operations keeps this site useful while the trip is still only partly known.',
    steps: [
      {
        phase: 'Phase 01',
        title: 'Frame the travelers',
        description:
          'Identify who is going, what pace works, and which experiences matter enough to shape the rest of the week.',
      },
      {
        phase: 'Phase 02',
        title: 'Drop in fixed constraints',
        description:
          'Add dates, lodging, transport, and anything with real deadlines before the fun details start competing for space.',
      },
      {
        phase: 'Phase 03',
        title: 'Layer the daily plan',
        description:
          'Fill each day with anchor experiences, dining targets, and mobility notes while preserving deliberate breathing room.',
      },
      {
        phase: 'Phase 04',
        title: 'Refine from the field',
        description:
          'Once the trip exists in reality, convert this shell from planning surface into a living family reference.',
      },
    ],
  },
  logout: {
    heading: 'Sign out',
    text: 'Leave the protected workspace when you are done so the next visit starts with a fresh login.',
    buttonLabel: 'Log out',
  },
};
