# Coding Standards

## Purpose

This repository is a private Disney trip site built to be maintained primarily by agents. The initial state is intentionally minimal and should remain stable, strict, and easy to verify.

## Stack Decisions

- Astro 5 with SSR
- React islands only when interactivity is actually needed
- Vercel deployment target
- Vanilla CSS only
- TypeScript everywhere practical

## TypeScript Rules

- Keep TypeScript strict
- Do not use `any`
- Prefer small, explicit types over loose objects
- Use type-only imports when appropriate
- Keep public internal auth types small and exact
- Store route copy in route-adjacent `.ts` modules as typed page objects
- Use separate typed data objects only when content is shared across routes or not owned by a single page
- Shared trip registries may live in `/src/data` when multiple routes and components need the same trip summary records
- Keep route-owned editorial copy separate from shared trip records so layout components stay presentation-only

## Maintainability Guardrails

- Treat 1000 lines as a hard review threshold for source files. Do not push a file from below 1000 lines to above 1000 lines without decomposing first or documenting the structural reason in the change.
- Do not add new feature blocks to already-sprawling files. Stylesheets are split by surface: `trip-pages.css` holds only the shared planner shell and disclosure panels, while `schedule.css`, `attractions.css`, `party.css`, `guide.css`, `ll.css`, and `packing.css` own their routes. New route or component styling goes in the matching module, or a new one imported from `global.css`.
- `src/lib/trips/party-analytics.ts` is near the threshold and mixes persona scoring, affinity pair math, clustering, cohort contrast, and analysis DTO construction. New party-analysis behavior should first extract the relevant ownership slice into a focused module rather than adding another branch to that file.
- Keep React islands as orchestration shells plus small view components. If a component starts combining URL state, editing flows, read-only summaries, price math display, and row rendering, split the view pieces before adding another mode.
- Prefer deleting concepts over centralizing them when behavior allows it. New booleans, nullable modes, or repeated special-case checks should be treated as a missing model until proven otherwise.
- Do not hide data invariants behind casts. If a helper needs a full park inventory, exact trip section, or validated route section, make the type boundary explicit instead of casting at the call site.
- Source-inspection tests are allowed only for narrow, computed guardrails such as token contrast ratios or banning inline styles. Never assert on exact CSS declarations, import lines, or markup strings; prefer behavioral tests so structural simplifications are not blocked by implementation-string assertions.
- When a strict no-behavior-change cleanup is needed, keep the focused tests green before and after, then run the full verification gate. Do not combine structural refactors with content or visual behavior changes.

## Astro and React Policy

- Default to Astro components and server rendering
- Use React islands for small interactive widgets only
- Do not move protected content into client bundles unless there is a clear need
- Do not import server secrets into client code
- Shared document concerns belong in `BaseLayout`; route chrome belongs in page-level shell components

## Styling Rules

- Use vanilla CSS only
- Do not add Tailwind, CSS-in-JS, or component libraries
- Do not use inline `style` attributes in Astro, HTML, JSX, or TSX markup
- Put presentation in stylesheet classes and CSS variables, not component-local style declarations
- When a visual direction changes, update the shared stylesheet and keep the route markup class-based
- Theme variants such as family gradients must be mapped through classes or data attributes, never inline styles
- Keep surface styling intentional with token tiers:
  - `--color-surface-1` for regular containers
  - `--color-surface-2` for important grouped controls
  - `--color-surface-3` for primary, high-attention panels only
- Use the `--color-*`, `--text-*`, and spacing tokens directly; the legacy short aliases (`--surface`, `--muted`, `--must-bg`, and similar) were removed
- Font sizes come from the type tokens (`--text-display-*`, `--text-headline-1/2/3`, `--text-title`, body, and meta sizes); do not hand-write `clamp()` font sizes in component styles
- Responsive rules use three breakpoints only: `max-width: 960px` (tablet), `720px` (mobile), and `480px` (small phones)
- Reuse the shared `.tag`, `.choice-chip`, and `.eyebrow` primitives and the shared selected-state treatment described in [Content Architecture](./content-architecture.md#shared-ui-primitives)
- Avoid reusing one heavy card treatment for every section; reserve shadows and accent treatments for truly primary surfaces
- Keep the shared visual language restrained and tool-like: cool-white neutrals, muted blue/teal/slate accents, a single Manrope sans, and low-motion interactions (see [Design System](./design-system.md))

## Auth and Secrecy Rules

- `SITE_PASSWORD` is required for all environments
- Protected content must stay behind middleware and server-side auth checks
- Do not place protected trip details in `/public`
- Do not expose trip data on `/login`
- Do not bypass the site key gate for new routes unless docs and tests are updated together

## Verification Commands

- Follow the required workflow in [Verification](./verification.md)
- Final completion gate: `npm run verify`

## Testing Expectations

- Prefer updating or adding the narrowest relevant test before implementation when behavior changes
- Expect the focused test to fail before writing the implementation so the gap is proven red-to-green
- Coverage settings must include request/auth logic and shared helper modules, not just narrow leaf files
- When request routing or auth behavior changes, add or update tests for middleware and API routes alongside helper tests
- UI-affecting changes should be visually verified in a real browser with Chrome DevTools MCP, or an equivalent browser MCP if Chrome DevTools MCP is unavailable

## Documentation Policy

- `AGENTS.md` is only a table of contents and quick instructions
- Canonical implementation notes belong in `/docs`
- Update `/docs` when workflows, auth, or coding conventions change
- If a route changes its content model, document the new page-object or shared-data convention here
- Keep content architecture notes current when shared trip data or shell composition patterns change
- If disclosure behavior or responsive defaults change, document the data attributes and route-level defaults in `/docs/content-architecture.md`

## Vercel Expectations

- Deploy with Astro SSR
- Configure `SITE_PASSWORD` in Vercel environment variables
- Keep restrictive crawl behavior in place until the site is intentionally made public
