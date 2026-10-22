# Agent Table Of Contents

This project is documentation-first. Read the linked docs before making changes.

- Start here: [Coding Standards](./docs/coding-standards.md)
- Verification workflow: [Verification](./docs/verification.md)
- Content model and shells: [Content Architecture](./docs/content-architecture.md)
- Auth implementation: [Auth Flow](./docs/auth-flow.md)
- Deployment setup: [Deployment](./docs/deployment.md)
- Visual direction, tokens, and component rules: [Design System](./docs/design-system.md)
- Retired planner stats kept for a future recap surface: [Spotify Wrapped Feature Notes](./docs/spotify-wrapped-feature.md)
- Tests-first expectation: update or add the relevant test before implementation and expect the focused assertion to fail first when behavior is changing
- Visual QA expectation: inspect changed routes in a real browser (Chrome DevTools MCP, or another real-browser MCP when it is unavailable) whenever layout, styling, copy, navigation, or interaction changes; see [Verification](./docs/verification.md) for local sign-in and the widths to check
- Verification gate: run `npm run verify` before considering work complete
- Documentation policy: update `/docs` when conventions or architecture change
