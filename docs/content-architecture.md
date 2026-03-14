# Content Architecture

## Shared Trip Data

- Store trip summaries shared across multiple routes in [`/src/data/all-trips.ts`](../src/data/all-trips.ts).
- Keep shared trip data typed so All Trips cards, stub routes, and future trip pages read the same source of truth.
- Store full trip payloads as separate modules under [`/src/data/trips`](../src/data/trips) so `summary`, `party`, `schedule`, and `attractions` can evolve independently while sharing one interface.
- Trip-specific grouping rules such as named party cohorts belong in the trip data module itself so reusable analytics stay free of hardcoded trip ids, member ids, or family-specific presets.
- Use helpers in [`/src/lib/trips/all-trips.ts`](../src/lib/trips/all-trips.ts) to derive grouped sections, stat-strip values, and route paths instead of hard-coding those rules in Astro templates.
- Use [`/src/lib/trips/details.ts`](../src/lib/trips/details.ts) to derive page-level view models such as rankings, party summaries, and schedule day cards from the typed trip modules.
- Use [`/src/lib/trips/readiness.ts`](../src/lib/trips/readiness.ts) to decide when each protected section can leave placeholder mode; attractions, schedule, and party routes each unlock when their own arrays are populated.
- When one planner route needs richer interactive filtering, add a dedicated view-model helper under [`/src/lib/trips`](../src/lib/trips) for that surface instead of forcing unrelated logic into `details.ts`.
- Keep analytics and renderer DTOs separate when a planning surface needs both. Analytics helpers may expose richer testable results, but the object passed into a component should contain only the fields that component actually renders.

## Route-Owned Copy

- Keep page-specific labels, metadata, and supporting copy in route-adjacent `.page.ts` modules.
- Keep trip section copy in [`/src/pages/[family]/[trip]/trip-sections.page.ts`](../src/pages/[family]/[trip]/trip-sections.page.ts) so the planner routes stay in sync.
- Treat Astro components as presentation-only wherever practical. Shared components should receive typed props, not own page copy decisions.
- If route-owned copy needs status-aware behavior, resolve that in the route-adjacent page module or a route-owned helper rather than burying those decisions inside a shared component.

## Shell Composition

- [`/src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro) owns only document concerns: fonts, metadata, global styles, and skip-link behavior.
- Visible page chrome lives in page-level shell components such as All Trips, auth, and trip shells.
- The trip root route redirects to the first planner section, with the protected planner continuing under attractions, schedule, and party routes.
- Planning trip tabs render inside the shared content shell so attractions, schedule, and party pages all open with the same content-width embedded tab strip.
- The embedded planner tabs are styled as a segmented wayfinding rail with a label and supporting detail for each section.
- Desktop trip pages use a lean shared header for brand and breadcrumb context, with the section tabs starting the main content column instead of living in the full-width header.
- Trip shells use a compact mobile header pattern: breadcrumbs collapse to a back link, trip facts move into an inline disclosure, and the same content-embedded tabs stay directly above the page body.
- Planner routes may open with a concise page-intro section inside the main content column before the first disclosure or tool surface.
- Disclosure panels use explicit responsive behavior via `data-mobile-behavior`:
  - `expanded`: open by default on mobile first load
  - `collapsed`: collapsed by default on mobile first load
  - `match-desktop`: mirror the desktop `open` default
- The schedule itinerary and party traveler profile disclosures default to `expanded` on mobile so pages never feel empty on first view.
- The attractions scoring guide and deep-dive ranking/matrix disclosures default to `collapsed` on mobile to keep the first screen focused.
- This split keeps route layouts flexible without duplicating document scaffolding.

## Attractions Filter IA

- The attractions decision board keeps a two-layer filter model:
  - Always visible controls: quick scope, park filter, and search
  - Advanced disclosure controls: traveler, area filter, and sentiment
- This preserves full filtering power while reducing first-view cognitive load.

## Theme Mapping

- Trip-specific visuals are mapped through `data-trip-theme` attributes and CSS variables.
- Do not use inline styles for gradients, accent pips, or status treatments.
- Shared theme tokens belong in the stylesheet layer so future trip pages inherit the same system.
