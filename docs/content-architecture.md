# Content Architecture

## Shared Trip Data

- Store trip summaries shared across multiple routes in [`/src/data/trip-archive.ts`](../src/data/trip-archive.ts).
- Keep shared trip data typed so archive cards, stub routes, and future trip pages read the same source of truth.
- Use helpers in [`/src/lib/trips/archive.ts`](../src/lib/trips/archive.ts) to derive grouped sections, stat-strip values, and route paths instead of hard-coding those rules in Astro templates.

## Route-Owned Copy

- Keep page-specific labels, metadata, and supporting copy in route-adjacent `.page.ts` modules.
- Treat Astro components as presentation-only wherever practical. Shared components should receive typed props, not own page copy decisions.

## Shell Composition

- [`/src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro) owns only document concerns: fonts, metadata, global styles, and skip-link behavior.
- Visible page chrome lives in page-level shell components such as archive, auth, and trip shells.
- This split keeps route layouts flexible without duplicating document scaffolding.

## Theme Mapping

- Trip-specific visuals are mapped through `data-trip-theme` attributes and CSS variables.
- Do not use inline styles for gradients, accent pips, or status treatments.
- Shared theme tokens belong in the stylesheet layer so future trip pages inherit the same system.
