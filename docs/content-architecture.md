# Content Architecture

## Shared Trip Data

- Store trip summaries shared across multiple routes in [`/src/data/trip-archive.ts`](../src/data/trip-archive.ts).
- Keep shared trip data typed so archive cards, stub routes, and future trip pages read the same source of truth.
- Store full trip payloads as separate modules under [`/src/data/trips`](../src/data/trips) so `summary`, `party`, `schedule`, and `attractions` can evolve independently while sharing one interface.
- Use helpers in [`/src/lib/trips/archive.ts`](../src/lib/trips/archive.ts) to derive grouped sections, stat-strip values, and route paths instead of hard-coding those rules in Astro templates.
- Use [`/src/lib/trips/details.ts`](../src/lib/trips/details.ts) to derive page-level view models such as rankings, party summaries, and schedule day cards from the typed trip modules.

## Route-Owned Copy

- Keep page-specific labels, metadata, and supporting copy in route-adjacent `.page.ts` modules.
- Keep trip overview and section copy in [`/src/pages/[family]/[trip]/trip-sections.page.ts`](../src/pages/[family]/[trip]/trip-sections.page.ts) so the trip root and tabbed planner stay in sync.
- Treat Astro components as presentation-only wherever practical. Shared components should receive typed props, not own page copy decisions.

## Shell Composition

- [`/src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro) owns only document concerns: fonts, metadata, global styles, and skip-link behavior.
- Visible page chrome lives in page-level shell components such as archive, auth, and trip shells.
- The trip root route is the overview landing page, with the full planner sections continuing under attractions, schedule, and party routes.
- Planning trip tabs render through a dedicated content shell so the shared header, breadcrumb, and tab chrome stay consistent across overview, attractions, schedule, and party pages.
- Dense planning views stay fully available, but sections such as the full attraction matrix, full itinerary, and traveler cards collapse through disclosure panels on smaller screens.
- This split keeps route layouts flexible without duplicating document scaffolding.

## Theme Mapping

- Trip-specific visuals are mapped through `data-trip-theme` attributes and CSS variables.
- Do not use inline styles for gradients, accent pips, or status treatments.
- Shared theme tokens belong in the stylesheet layer so future trip pages inherit the same system.
