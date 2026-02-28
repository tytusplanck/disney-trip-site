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

## Auth and Secrecy Rules

- `SITE_PASSWORD` is required for all environments
- Protected content must stay behind middleware and server-side auth checks
- Do not place protected trip details in `/public`
- Do not expose trip data on `/login`
- Do not bypass the password gate for new routes unless docs and tests are updated together

## Verification Commands

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run verify`

## Testing Expectations

- Coverage settings must include request/auth logic and shared helper modules, not just narrow leaf files
- When request routing or auth behavior changes, add or update tests for middleware and API routes alongside helper tests

## Documentation Policy

- `AGENTS.md` is only a table of contents and quick instructions
- Canonical implementation notes belong in `/docs`
- Update `/docs` when workflows, auth, or coding conventions change
- If a route changes its content model, document the new page-object or shared-data convention here
- Keep content architecture notes current when shared trip data or shell composition patterns change

## Vercel Expectations

- Deploy with Astro SSR
- Configure `SITE_PASSWORD` in Vercel environment variables
- Keep restrictive crawl behavior in place until the site is intentionally made public
