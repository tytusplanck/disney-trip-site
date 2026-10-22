# Content Architecture

## Shared Trip Data

- Store trip summaries shared across multiple routes in [`/src/data/all-trips.ts`](../src/data/all-trips.ts).
- Keep shared trip data typed so All Trips cards, stub routes, and future trip pages read the same source of truth.
- Use `TripSummary.slug` as the canonical public trip identifier. Trip pages live at `/:tripSlug/:section`, and helper-generated URLs should use the single-slug path instead of family/trip pairs.
- Store full trip payloads as separate modules under [`/src/data/trips`](../src/data/trips) so `summary`, `party`, `schedule`, and `attractions` can evolve independently while sharing one interface.
- Trip-specific grouping rules such as named party cohorts belong in the trip data module itself so reusable analytics stay free of hardcoded trip ids, member ids, or family-specific presets.
- Use helpers in [`/src/lib/trips/all-trips.ts`](../src/lib/trips/all-trips.ts) to derive grouped sections, compact card facts, and route paths instead of hard-coding those rules in Astro templates.
- Use [`/src/lib/trips/details.ts`](../src/lib/trips/details.ts) to derive page-level view models such as rankings, party summaries, and schedule day cards from the typed trip modules.
- Schedule days may carry optional `moments` (`ScheduleMoment[]`, 24-hour `HH:MM` times, kinds `depart | rope-drop | dining | show | arrival`, optional `detail` and `booked | penciled` status). Helpers in [`/src/lib/trips/schedule.ts`](../src/lib/trips/schedule.ts) validate and format times and sort moments; `notes` stays for non-time-bound context and must not duplicate a moment. Dining moments may add `menuUrl`, which must be an `https` link on `disneyworld.disney.go.com`; the helper throws for any other host, protocol, or non-dining kind so bad links fail the build rather than ship. The card renders the restaurant label as the link and opens it in a new tab with a visually-hidden "menu (opens in a new tab)" hint. The underline sits on an inner `schedule-moment__link-text` span so markup whitespace inside the link is never underlined.
- Schedule days may also carry optional `outfit` text (one or two short sentences). `ScheduleDayCard` renders it as an always-visible paragraph after the moments and optional note, spanning the card body with a teal uppercase label. Missing or empty outfit text renders nothing; its styles live in `src/styles/schedule.css`.
- Use [`/src/lib/trips/readiness.ts`](../src/lib/trips/readiness.ts) to decide when each protected section can leave placeholder mode; attractions, schedule, and party routes each unlock when their own arrays are populated.
- Planner sections are `attractions | schedule | party | ll | guide | packing`. Every section must be reachable from some trip's tabs; the old `logistics` and `travelers` routes were removed because no trip linked to them. Add a section only alongside the trip data and tab that use it.
- When one planner route needs richer interactive filtering, add a dedicated view-model helper under [`/src/lib/trips`](../src/lib/trips) for that surface instead of forcing unrelated logic into `details.ts`.
- Keep analytics and renderer DTOs separate when a planning surface needs both. Analytics helpers may expose richer testable results, but the object passed into a component should contain only the fields that component actually renders.
- Lightning Lane planner data treats scheduled park labels as a strict boundary. Park-day schedule labels must map to the canonical Disney park ids, and LL inventory must include every canonical park before planner data is built; do not silently fall back to another park.
- Repeated visits to the same park may provide `llInventoryByParkDate` overrides for date-specific pricing or availability. The planner validates that each override matches the scheduled park and otherwise uses the canonical park inventory for that date.
- Firm Lightning Lane bookings can add optional `returnWindows` on each park-day selection map, keyed by attraction id. Shared-link serialization preserves return windows for selected attractions so copied LL plans do not lose confirmed times.

## Optional Packing Lists

- Add `packing: TripPackingData` to a trip module and append `{ label: 'Packing', section: 'packing' }` to its `sectionConfig` to enable `/:tripSlug/packing`. Trips without populated packing data or without the tab redirect to their normal landing route.
- Keep editable categories, item names, and priorities (`must | rec | nice`) in `src/data/trips/<slug>/packing.ts`. The Planck mega trip is the first enabled trip. The archetype cards use Tabler `user` and `friends` outline icons. These two decorative SVGs live in `PackingIcon.tsx`, with attribution in `docs/licenses/tabler-icons.md`; item row icons remain omitted.
- Categories use `archetypes: ['adults']`, `['kids']`, or both. Families inherit all adult categories. Mark child-specific categories `kidsOnly: true` to show the "Kids only" tag and sort them first; these do not appear in the adult view.
- `PackingLists.tsx` server-renders the default adult list and hydrates only the archetype and priority controls. Counts derive from unfiltered data; filters hide empty categories. Items sort within each category by `must`, `rec`, then `nice`, preserving editorial order within a priority and leaving source data unchanged. Radio cards use roving focus and arrow/Home/End navigation. Selection is ephemeral; there are no checkboxes, saved packing state, or extra login requirements. The existing site key gate still applies.
- Packing styles live in `src/styles/packing.css` and reuse app tokens. At 720px and narrower the two archetype cards stay side by side in a compact form and the priority filters stay on one horizontally scrolling row, so the first items show without scrolling. Item rows show regular-weight 15px names and shared priority tags; filters use the shared `choice-chip`. Packing items have no general descriptions. An optional `details: string[]` renders an editorial bullet list beneath the item name, used for park and dining outfit themes.

## Print Export

- A planner page opts into the **Print / Save PDF** button by adding `print: { buttonLabel, documentTitle }` (`TripPrintCopy` from [`/src/lib/trips/print.ts`](../src/lib/trips/print.ts)) to its entry in [`trip-sections.page.ts`](../src/pages/[trip]/trip-sections.page.ts) and passing `print={pageCopy.print}` to `TripPageShell`. Plan (`schedule`) and Packing are enabled. Only add `print` once the page has a checked print layout.
- The button (`PrintButton.astro`, a `choice-chip` with the Tabler `printer` icon) sits beside the page title and calls `window.print()`; the browser's dialog handles paper and "Save as PDF". There is no server-side PDF generation, so printing stays behind the site key gate with no extra dependencies.
- While the dialog is open the document title becomes `getPrintDocumentTitle(...)`, for example "Planck Mega Trip – Packing list (Adults with kids · Must pack only)", because browsers use it as the default PDF file name. The title is restored on `afterprint`. Cmd/Ctrl+P on an opted-in page gets the same title through `beforeprint`.
- A page whose printout depends on on-screen filters renders `data-print-scope="<label>"` on its root so the file name names the filter, and a `.print-only` line so the paper says which filter it shows. Packing prints the selected audience and priority (`getPackingScopeLabel` in [`/src/lib/trips/packing.ts`](../src/lib/trips/packing.ts)), headed "Packing for: Adults with kids · All priorities".
- `src/styles/print.css` (imported last in `global.css`) owns the paper frame: it hides the site header, trip tabs, skip link, and anything marked `data-print-hide`, shows `.print-only` content (the shell prints the trip name and dates above the title), drops the page background, and outlines tags. Each page's paper layout lives in an `@media print` block at the end of its own stylesheet (`schedule.css`, `packing.css`).
- Letter and A4 paper are about 720px wide, so print blocks must restate any desktop layout that the `720px` mobile rules change. Plan keeps the desktop day timeline and never splits a day across pages; Packing hides its controls, keeps items whole, and adds a tick box before each item.

## Route-Owned Copy

- Keep page-specific labels, metadata, and supporting copy in route-adjacent `.page.ts` modules.
- Keep trip section copy in [`/src/pages/[trip]/trip-sections.page.ts`](../src/pages/[trip]/trip-sections.page.ts) so the planner routes stay in sync.
- Treat Astro components as presentation-only wherever practical. Shared components should receive typed props, not own page copy decisions.
- If route-owned copy needs status-aware behavior, resolve that in the route-adjacent page module or a route-owned helper rather than burying those decisions inside a shared component.

## Shell Composition

- [`/src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro) owns only document concerns: fonts, metadata, global styles, and skip-link behavior.
- Visible page chrome lives in page-level shell components such as All Trips, auth, and trip shells.
- The trip root route redirects to the first planner section, with the protected planner continuing under single-slug attractions, schedule, and party routes.
- Planning trip tabs render inside the shared content shell so attractions, schedule, and party pages all open with the same content-width embedded tab strip.
- The embedded planner tabs are label-only. Supporting detail belongs in the shell-owned page summary, not inside each tab.
- On narrow screens, embedded planner tabs use equal-width columns that fill the rail, never narrower than their label; the rail scrolls horizontally only when the labels cannot fit. `getTripNavTabs` in [`/src/lib/trips/all-trips.ts`](../src/lib/trips/all-trips.ts) returns no tabs for a single-section trip, so those routes render no tab strip at all.
- Desktop trip pages use a lean shared header for brand and breadcrumb context only.
- Trip shells use a compact mobile header pattern: breadcrumbs collapse to a back link and trip title, with no extra facts disclosure.
- [`/src/components/shells/TripPageShell.astro`](../src/components/shells/TripPageShell.astro) owns the visible route heading block. Routes pass `pageTitle` and `pageSummary` and should not render their own intro sections above the main tool surface. The heading shows at every width; on mobile it drops to the `--text-headline-1` size so every tab names the page the same way.
- Lightning Lane and ride rankings share [`ParkDayPicker`](../src/components/ParkDayPicker.tsx): `choice-chip` buttons labelled with the short park name (`getShortParkLabel` drops "Disney's") and the weekday and date, plus an optional whole-trip chip. The chips wrap on desktop and scroll horizontally on one row at 720px and narrower. The Lightning Lane action bar stacks vertically on narrow screens so every control remains reachable.
- Lightning Lane park cards show the projected per-person cost once, in the disclosure headline (`$53 adult` when a child total differs). The body is a flat inline breakdown (Multi Pass, Single Pass picks, Child total) inside the card rather than a nested panel. [`LLProjectedCosts`](../src/components/LLProjectedCosts.tsx) owns that view.
- Disclosure panels use explicit responsive behavior via `data-mobile-behavior`:
  - `expanded`: open by default on mobile first load
  - `collapsed`: collapsed by default on mobile first load
  - `match-desktop`: mirror the desktop `open` default
- Disclosure toggles read "Show" and "Hide" through CSS `content`; the toggle text span is `aria-hidden` because `<details>` already announces its expanded state.
- The attractions scoring guide defaults to `collapsed` on mobile to keep the first screen focused.
- Party now renders its traveler preference cards inline below the split summary instead of hiding them behind a disclosure.
- Schedule now renders directly as an always-visible timeline with no disclosure wrapper.
- Days with moments render a compact ordered time list between the day title and the note; days without moments render unchanged. Schedule card and moment styles live in `src/styles/schedule.css`. At 720px and narrower the day number, date, and day-type tags share one row (the decorative day marker is hidden) and each moment keeps time, kind, and label on one row.
- This split keeps route layouts flexible without duplicating document scaffolding.

## Ride Guide

- Trips with `guide` data render `/:tripSlug/guide` through `getGuideParkGroups` in [`/src/lib/trips/guide.ts`](../src/lib/trips/guide.ts). Parks follow the order of their first scheduled park day (parks missing from the schedule keep editorial order after them), and rides within a park sort `must-do`, `recommended`, `if-time`, then `skip`, preserving editorial order within a priority.
- Ride notes are capped at `--content-reading` so long descriptions keep a readable line length on wide screens.
- Each park group carries an `anchorId` (`park-magic-kingdom`); with more than one park the page opens with jump-link chips to each section. Ride names use `--text-title` so they stay smaller than park headings.
- `GuideAttraction.height` holds the minimum height in inches, or `'any'` when there is none; leave it out for shows and events. It renders as a neutral tag (`40" min`, `Any height`), so keep height requirements out of `notes`.

## Attractions Filter IA

- The attractions decision board is intentionally reduced to one primary workflow:
  - scoring guide disclosure
  - search
  - day scope chips (shared `ParkDayPicker`)
  - ranked ride list
- Remove secondary analytics from the route instead of hiding them behind additional disclosures.
- Day scope still follows the trip schedule so park-day filters stay grounded in the itinerary.

## Theme Mapping

- Trip-specific visuals are mapped through `data-trip-theme` attributes and CSS variables.
- Do not use inline styles for gradients, accent pips, or status treatments.
- Shared theme tokens belong in the stylesheet layer so future trip pages inherit the same system.

## Shared UI Primitives

- `components.css` owns the cross-route primitives; use them instead of adding route-specific pills or chips:
  - `.eyebrow` for small uppercase labels.
  - `.tag` with `data-tone` (`must | recommended | optional | skip | highlight | travel | park | resort | accent | neutral`) for priorities, day types, ranking badges, and Lightning Lane price, time, height, and closed badges.
  - `.choice-chip` for pill buttons and jump links; `aria-pressed='true'` marks the selection.
- Every "currently chosen" control (active trip tab, pressed `choice-chip`, checked packing archetype) shares one treatment: trip accent border, soft accent background, and strong accent text. Extend that selector group in `components.css` rather than inventing a new selected style.
