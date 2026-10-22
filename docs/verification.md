# Verification

## Default Workflow

- Read the relevant docs first, then identify the narrowest affected test surface and the manual flows that could regress.
- For behavior changes, update or add the relevant test before implementation.
- Run that focused test immediately and expect it to fail before writing the implementation. If it passes before the code change, the assertion is probably too weak or aimed at the wrong surface.
- Implement the change only after the failing test proves the gap.
- Re-run focused tests until they pass, then run the full repository verification steps.
- In the final handoff, state exactly which commands ran, which routes were checked manually, and whether a red-to-green test failure was observed.

## Focused Red-Green Loop

1. Pick the smallest existing test surface that matches the change:
   - pure helpers and view models: route-adjacent or `src/lib/**/*.test.ts`
   - auth, middleware, and routing: `src/middleware.test.ts`, `src/pages/api/auth/auth-routes.test.ts`, `src/lib/auth/*.test.ts`
   - route view models: route-adjacent `*.page.test.ts`
   - React islands and interactive components: component `*.test.tsx`
   - design token and markup guardrails: `src/styles/guardrails.test.ts` (contrast and tap-target tokens), `src/test/no-inline-styles.test.ts`
   - do not add tests that assert on source text (exact CSS declarations, import lines, markup strings); verify layout and styling in the browser instead
2. Update or add the relevant spec first.
3. Run a focused Vitest command, for example `npx vitest run src/middleware.test.ts`.
4. Confirm the new or changed assertion fails before implementation when behavior is meant to change.
5. Implement the change.
6. Re-run the focused test and any nearby affected tests until they pass.
7. If no failing test is expected, such as docs-only work or a strict no-behavior-change refactor, say that explicitly in the handoff and still run the applicable checks.

## Required Commands

Run these commands as needed while fixing issues, then finish with the aggregate gate:

1. `npm run format:check`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test`
5. `npm run build`
6. `npm run verify`

`npm run verify` is the required completion gate even if the individual commands were already run earlier.

## Browser And Visual Verification

- Use Chrome DevTools MCP for any change that affects layout, styling, copy, navigation, forms, responsive behavior, or perceived interaction.
- Do not sign off UI work from static code inspection alone.
- Start the site with `SITE_PASSWORD=replace-me npm run dev`, then open the changed route and the nearest related route in Chrome DevTools MCP.
  - The shell variable overrides `.env`, so agents sign in at `/login` with the placeholder key from `.env.example` and never need the real site key. Do not read, type, or paste the deployed `SITE_PASSWORD`.
  - The session cookie lasts for the browser session, so one sign-in covers the whole check.
  - Astro's dev toolbar overlays the bottom of the page; hide it (`document.querySelector('astro-dev-toolbar')?.remove()`) before taking screenshots.
- Check at minimum:
  - one mobile width such as `375px` or `390px`
  - one desktop width such as `1280px`
  - an intermediate width such as `768px` when the layout meaningfully shifts
  - `320px` when a change touches the trip tab strip or any single-row scrolling chip row
  - layouts only change at the `960px`, `720px`, and `480px` breakpoints, so check one width on each side of any breakpoint the change touches
  - console output stays clean
  - relevant network and form requests succeed
  - keyboard and focus behavior still work when interaction changed
  - no clipping, overflow, broken spacing, or missing states appear; `html` uses `overflow-x: clip`, so measure the widest content element rather than trusting `document.documentElement.scrollWidth`
- When auth, redirects, or guarded routes change, manually verify `/login`, `/`, logout, and a direct deep link to the changed protected route.
- If Chrome DevTools MCP is unavailable in the session, use the available real-browser MCP equivalent and say which tool was used.

## Change-Specific Guidance

- Auth or middleware changes:
  - run focused tests for `src/middleware.test.ts`, `src/pages/api/auth/auth-routes.test.ts`, and the relevant files in `src/lib/auth`
  - manually verify login, logout, redirect, and direct URL access in a real browser
- Trip data, derived view models, or route copy changes:
  - run the affected `src/lib/trips/*.test.ts` files and any route-adjacent `*.page.test.ts` files
  - visually verify the changed trip route in the browser at mobile and desktop widths
- Styling, shells, or interactive component changes:
  - run component tests plus `src/styles/guardrails.test.ts` and `src/test/no-inline-styles.test.ts` when relevant
  - inspect the changed surface in Chrome DevTools MCP and verify console cleanliness, responsive layout, and interaction states
