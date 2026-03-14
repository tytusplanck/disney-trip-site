# Design System

## Direction

- The site uses a light-only, Joi-inspired product aesthetic with a cool-white foundation, blue/teal/slate accents, and restrained motion.
- The visual language should read as crisp, calm, and decision-focused rather than whimsical, luxury-editorial, or generic SaaS.
- The wayfinding motif is expressed through segmented rails, route stripes, badge-like metadata, and timeline markers.
- The palette should feel cool-white, blue/teal/slate, and minimal-warmth rather than parchment-toned.

## Typography

- The site uses a single-sans, product-forward, Joi-aligned type system.
- UI, body, and display font: `Manrope`
- Keep `--font-display` as a semantic alias, but it resolves to `Manrope` so titles and shell chrome stay in the same family.
- Weight usage:
  - `800` for hero titles, day markers, and highest-emphasis page titles
  - `700` for section headings, trip names, and major card headers
  - `600` for tabs, buttons, chips, badges, attraction names, and prominent utility labels
  - `500` for body copy, metadata, timestamps, and helper text
  - `400` only when long text blocks feel too dense at `500`
- Keep uppercase metadata to utility labels, tabs, badges, and supporting system text.
- Minimum body copy size is `1rem`.

## Core Tokens

- Canvas: `#f7f9fc`
- Canvas alt: `#eef3f8`
- Surface 1: `#ffffff`
- Surface 2: `#f4f7fb`
- Surface 3: `#e9eff6`
- Ink: `#19242f`
- Ink muted: `#566474`
- Ink faint: `#6b7888`
- Brand: `#2b6f8a`
- Brand strong: `#1f5f7c`
- Slate accent: `#607b97`
- Success: `#2d7a78`
- Danger: `#aa606a`
- Skip: `#7a7291`
- Focus ring: `#2b6f8a`

## Schedule Day Semantics

- Schedule day colors are semantic, not trip-theme driven.
- Use the shared schedule aliases in the token layer:
  - `travel` maps to plum
  - `park` maps to lake / brand blue
  - `resort` maps to teal
- Apply schedule-day semantics to the day-type badge only.
- Keep the vertical day marker on one shared trip accent so the timeline rail stays calm and consistent.
- Badge treatments should stay as soft pills with stronger text, not solid saturated fills.

## Layout Rules

- Minimum tap target: `2.75rem`
- Mobile gutter: `1.25rem`
- Tablet gutter: `1.75rem`
- Desktop gutter: `2.5rem`
- Main content width: `72rem`
- Wide content width: `88rem`
- Reading width: `40rem`

## Surface And Radius Rules

- Standard controls use `--radius-pill` or `--radius-sm`.
- Cards and disclosures use `--radius-xl` unless they are smaller nested utility surfaces.
- Nested utility surfaces should use `--radius-lg` or `--radius-md`.
- Only the active planning trip and high-attention planner summaries should use elevated featured treatments.
- Do not reintroduce generic card grids where every card carries the same weight.

## Component Rules

- The homepage remains a chooser. Trip cards should contain only status, title, date, primary action, compact facts, and one supporting sentence.
- Trip tabs are a segmented planner rail with label-only wayfinding.
- Attractions should lead with the scoring guide disclosure, the small filter stack, and the ranked ride list. Do not reintroduce side rails, heatmaps, signals, or area breakdowns.
- Schedule reads as a vertical trip timeline with clear day markers.
- Party leads with one compact split summary and follows with visible slim traveler cards that surface each person's total preference counts.
- On party traveler cards, color is limited to the 3 stat cells only. Keep the card shell, persona label, description, and top call neutral.
- Login stays simple: one centered entry panel, no novelty illustration.

## Motion

- Motion should stay restrained and functional.
- Use `140ms`, `180ms`, and `240ms` timing tokens with `cubic-bezier(0.22, 1, 0.36, 1)`.
- Respect `prefers-reduced-motion` by removing non-essential transition and animation effects.
