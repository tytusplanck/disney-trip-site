# Content Architecture

## Shared Trip Data

- Store trip summaries shared across multiple routes in [`/src/data/all-trips.ts`](../src/data/all-trips.ts).
- Keep shared trip data typed so All Trips cards, stub routes, and future trip pages read the same source of truth.
- Use `TripSummary.slug` as the canonical public trip identifier. Trip pages live at `/:tripSlug/:section`, and helper-generated URLs should use the single-slug path instead of family/trip pairs.
- Store old two-part URLs in `TripSummary.legacyRoutes` when an existing trip URL needs a compatibility redirect.
- Store full trip payloads as separate modules under [`/src/data/trips`](../src/data/trips) so `summary`, `party`, `schedule`, and `attractions` can evolve independently while sharing one interface.
- Trip-specific grouping rules such as named party cohorts belong in the trip data module itself so reusable analytics stay free of hardcoded trip ids, member ids, or family-specific presets.
- Use helpers in [`/src/lib/trips/all-trips.ts`](../src/lib/trips/all-trips.ts) to derive grouped sections, compact card facts, and route paths instead of hard-coding those rules in Astro templates.
- Use [`/src/lib/trips/details.ts`](../src/lib/trips/details.ts) to derive page-level view models such as rankings, party summaries, and schedule day cards from the typed trip modules.
- Use [`/src/lib/trips/readiness.ts`](../src/lib/trips/readiness.ts) to decide when each protected section can leave placeholder mode; attractions, schedule, and party routes each unlock when their own arrays are populated.
- When one planner route needs richer interactive filtering, add a dedicated view-model helper under [`/src/lib/trips`](../src/lib/trips) for that surface instead of forcing unrelated logic into `details.ts`.
- Keep analytics and renderer DTOs separate when a planning surface needs both. Analytics helpers may expose richer testable results, but the object passed into a component should contain only the fields that component actually renders.

## Route-Owned Copy

- Keep page-specific labels, metadata, and supporting copy in route-adjacent `.page.ts` modules.
- Keep trip section copy in [`/src/pages/[trip]/trip-sections.page.ts`](../src/pages/[trip]/trip-sections.page.ts) so the planner routes stay in sync.
- Treat Astro components as presentation-only wherever practical. Shared components should receive typed props, not own page copy decisions.
- If route-owned copy needs status-aware behavior, resolve that in the route-adjacent page module or a route-owned helper rather than burying those decisions inside a shared component.

## Shell Composition

- [`/src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro) owns only document concerns: fonts, metadata, global styles, and skip-link behavior.
- Visible page chrome lives in page-level shell components such as All Trips, auth, and trip shells.
- The trip root route redirects to the first planner section, with the protected planner continuing under single-slug attractions, schedule, and party routes.
- Legacy family/trip URLs redirect to their canonical single-slug trip route instead of rendering duplicate pages.
- Planning trip tabs render inside the shared content shell so attractions, schedule, and party pages all open with the same content-width embedded tab strip.
- The embedded planner tabs are label-only. Supporting detail belongs in the shell-owned page summary, not inside each tab.
- On narrow screens, the embedded planner tabs switch to a horizontally scrollable rail instead of shrinking until labels clip.
- Desktop trip pages use a lean shared header for brand and breadcrumb context only.
- Trip shells use a compact mobile header pattern: breadcrumbs collapse to a back link and trip title, with no extra facts disclosure.
- [`/src/components/shells/TripPageShell.astro`](../src/components/shells/TripPageShell.astro) owns the visible route heading block. Routes pass `pageTitle` and `pageSummary` and should not render their own intro sections above the main tool surface.
- The Lightning Lane planner keeps park-day chips horizontally scrollable on narrow screens and stacks its action bar vertically so every control remains reachable.
- Disclosure panels use explicit responsive behavior via `data-mobile-behavior`:
  - `expanded`: open by default on mobile first load
  - `collapsed`: collapsed by default on mobile first load
  - `match-desktop`: mirror the desktop `open` default
- The attractions scoring guide defaults to `collapsed` on mobile to keep the first screen focused.
- Party now renders its traveler preference cards inline below the split summary instead of hiding them behind a disclosure.
- Schedule now renders directly as an always-visible timeline with no disclosure wrapper.
- This split keeps route layouts flexible without duplicating document scaffolding.

## Attractions Filter IA

- The attractions decision board is intentionally reduced to one primary workflow:
  - scoring guide disclosure
  - search
  - day scope chips
  - traveler select
  - ranked ride list
- Remove secondary analytics from the route instead of hiding them behind additional disclosures.
- Day scope still follows the trip schedule so park-day filters stay grounded in the itinerary.

## Theme Mapping

- Trip-specific visuals are mapped through `data-trip-theme` attributes and CSS variables.
- Do not use inline styles for gradients, accent pips, or status treatments.
- Shared theme tokens belong in the stylesheet layer so future trip pages inherit the same system.
