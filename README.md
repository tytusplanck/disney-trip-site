# Disney Trip Site

Minimal Astro + React-islands scaffold for a private Disney trip planning site.

## Stack

- Astro 5 with SSR on Vercel
- React islands for small interactive components
- TypeScript with strict compiler options
- ESLint, Prettier, and Vitest for agent-friendly verification
- Vanilla CSS only

## Required Environment Variable

- `SITE_PASSWORD`: shared password used by the server-side auth gate

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run verify`

## Deployment Notes

- Target platform: Vercel
- The site is intentionally password-gated
- `robots.txt`, `X-Robots-Tag`, and `noindex` metadata are configured to discourage crawling before launch

## Agent Notes

- Start with [AGENTS.md](./AGENTS.md)
- The canonical conventions live in `/docs`
