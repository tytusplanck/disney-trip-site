# Deployment

## Target Platform

- Vercel
- Astro SSR
- Node serverless runtime

This project is intentionally deployed as a server-rendered Astro app because the password gate depends on server-side checks and signed cookies.

## Required Vercel Configuration

### Environment Variables

Set `SITE_PASSWORD` in:

- Preview
- Production

If preview deployments should be isolated from production, use different password values for each environment.

### Runtime Expectations

- Use the normal Astro/Vercel serverless deployment flow
- Do not switch this project to Edge runtime unless the auth implementation is rewritten away from Node's crypto APIs
- Keep the Node version aligned with [package.json](../package.json)

### Build Settings

Typical Vercel settings for this repo:

- Framework preset: `Astro`
- Install command: `npm install`
- Build command: `npm run build`
- Output setting: handled by the Astro Vercel adapter

## Origin Check Note

Astro's built-in `security.checkOrigin` setting is disabled in this project. The deployed Vercel form flow can trip Astro's default SSR origin comparison and block the shared-password login form before the endpoint code runs.

That means this project currently depends on its own application-level protections instead:

- password check on the server
- signed session cookies
- `SameSite=Strict` cookies
- middleware-based route protection

If future features add more state-changing form endpoints, review whether a custom CSRF/origin validation layer should be added.

## Repository Expectations

The password gate protects the deployed site only. It does not hide source code in GitHub.

If this repository will contain real trip plans, personal details, confirmation numbers, or other private family information, the repository should remain private.

## Crawl And Indexing Defaults

This project already ships with restrictive defaults:

- `public/robots.txt` blocks crawling
- `vercel.json` sets restrictive response headers
- layout metadata sets `noindex`

Do not relax these defaults until the site is intentionally public.

## Pre-Deploy Checklist

1. Confirm `SITE_PASSWORD` is set in Vercel.
2. Run `npm run verify`.
3. Confirm the repo visibility matches the sensitivity of the trip content.
4. Confirm the Vercel project root points to this project directory.
5. Deploy and test the login flow, logout flow, and direct access to `/`.

## Post-Deploy Checks

1. Visiting `/` without a valid cookie should redirect to `/login`.
2. Entering the correct password should return access to `/`.
3. Logging out should clear access and return the browser to `/login`.
4. The deployment should return restrictive crawl headers.
