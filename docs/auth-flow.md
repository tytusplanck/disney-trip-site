# Auth Flow

## Why SSR

This site uses Astro SSR on Vercel so protected content can stay on the server until a correct password is submitted. A static export would expose the generated HTML to anyone who can reach the deployment.

## Required Secret

- `SITE_PASSWORD`

The password is defined as a server-only secret in Astro's env schema and validated at startup/build time.

## Request Flow

1. A visitor requests `/`.
2. Astro middleware checks the `site_access` cookie.
3. If the cookie is missing or invalid, the request is redirected to `/login`.
4. The visitor submits the password form on `/login`.
5. `POST /api/auth/login` compares the submitted password to `SITE_PASSWORD`.
6. On success, the server issues a signed, HTTP-only session cookie and redirects back to `/`.
7. Middleware accepts the cookie on future requests and allows the protected page to render.
8. `POST /api/auth/logout` deletes the cookie and redirects back to `/login`.

## Public Routes

These routes stay public so the login experience can function:

- `/login`
- `/api/auth/login`
- `/robots.txt`
- `/_astro/*` build assets needed by the rendered pages
- `/favicon.svg` if added later

Everything else is protected by middleware.

## Cookie Design

The auth cookie is not a plain boolean flag.

- Cookie name: `site_access`
- Payload: base64url-encoded JSON with `scope` and `issuedAt`
- Signature: HMAC-SHA256 using `SITE_PASSWORD`
- Stored value: `<payload>.<signature>`

Middleware verifies the signature before treating the request as authenticated.

## Security Defaults

- HTTP-only cookie
- `SameSite=Strict`
- session-scoped lifetime (no persistent max age)
- secure cookie in HTTPS/production contexts
- `noindex` and `X-Robots-Tag` protections
- `Cache-Control: private, no-store, max-age=0`

## Astro Origin Check

Astro ships with a built-in `security.checkOrigin` guard for SSR form submissions. In this project it is disabled because the Vercel deployment path can cause Astro's request origin comparison to reject the shared-password form before the login handler runs.

The application still relies on these controls:

- server-side password validation
- signed HTTP-only session cookies
- `SameSite=Strict` cookies
- route protection in middleware

If form handling changes later, re-evaluate whether a custom CSRF/origin strategy should be added.

## Deployment And Repository Warning

The password gate protects the deployed site. It does not protect a public GitHub repository.

If private trip details are committed to a public repo, anyone who can view the repo can read that content without going through the password page. Keep the repository private if it will contain real family trip details.

## Agent Boundaries

- Do not move secrets into client-side code
- Do not expose protected trip content in `/public`
- Do not add protected routes without keeping middleware, docs, and tests in sync
- Do not turn the login page into a place where private trip details leak before authentication
