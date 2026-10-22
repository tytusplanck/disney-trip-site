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
  - `600` for page titles, headings, trip and attraction names, tabs, buttons, chips, and eyebrow labels
  - `700` for `.tag` text and emphasized figures such as Lightning Lane prices
  - `500` for secondary chip text and helper text
  - `400` for body copy and dense list rows such as packing items
- Keep uppercase metadata to eyebrow labels, tags, and supporting system text.
- Sizes come from the type tokens: `--text-display-1/2` for page titles, `--text-headline-1/2/3` for section and card headings, `--text-title` for list-item names, then body and meta sizes. Body copy uses `--text-body`; dense rows and secondary text may drop to `--text-body-sm`.
- Keep heading levels visibly ordered: a list item's name must stay smaller than the section heading above it (ride names use `--text-title` under `--text-headline-2` park headings).

## Core Tokens

- Canvas: `#f7f9fc`
- Canvas alt: `#eef3f8`
- Surface 1: `#ffffff`
- Surface 2: `#f4f7fb`
- Surface 3: `#e9eff6`
- Ink: `#19242f`
- Ink muted: `#566474`
- Ink faint: `#606d7d`
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
- Apply schedule-day semantics to the day-type tag only (`.tag` with `data-tone` `travel`, `park`, or `resort`).
- Keep the vertical day marker on one shared trip accent so the timeline rail stays calm and consistent. On mobile the marker is hidden and the day number joins the date row.
- Tag treatments stay as soft pills with stronger text, not solid saturated fills.

## Data Viz Spectrum

- Planner data-viz uses one shared ordered spectrum instead of mixing brand, success, danger, and skip hues independently.
- Use these token pairs for data surfaces only:
  - `viz-1`: strongest support / must-do (`#067a48` / `#d8f5e6`)
  - `viz-2`: positive support / preferred (`#0a6dad` / `#ddf1ff`)
  - `viz-3`: neutral bridge / indifferent (`#607b97` / `#eaf0f6`)
  - `viz-4`: friction / don't-want (`#7046b7` / `#f1e7ff`)
  - `viz-5`: strongest rejection / will-skip (`#5d3d98` / `#ede5fb`)
- Apply the spectrum to bars, badges, stat cells, and thin summary rails only. Keep long-form copy, control chrome, tabs, and page shells on the neutral/trip-accent system.
- `--color-danger*` remains reserved for destructive or error UI. It is not part of planner preference visualization.
- Schedule stays the reference for semantic vibrance, but its travel / park / resort colors remain scoped to the schedule badge treatment.
- Party should stay metrics-first: color belongs in affinity and gap tags, stat cells, and summary rails, not full-card washes.
- Priority tags map onto the spectrum through shared tones: `must` → `viz-1`, `recommended` → `viz-2`, `optional` (nice to have, if time) → `viz-3`, `highlight` → `viz-4`, `skip` → `viz-5`.

## Layout Rules

- Minimum tap target: `2.75rem`
- Mobile gutter: `1.25rem`
- Tablet gutter: `1.75rem`
- Desktop gutter: `2.5rem`
- Main content width: `72rem`
- Wide content width: `88rem`
- Reading width: `40rem`
- Breakpoints: `960px` (tablet: gutters tighten, stub panels stack), `720px` (mobile: compact trip header, single-column cards, single-row scrolling chip rows), and `480px` (small phones: tightest padding). Do not add other widths.
- Shell grids use `minmax(0, 1fr)` columns so a scrolling chip row or long word can never widen the page.

## Surface And Radius Rules

- Standard controls use `--radius-pill` or `--radius-sm`.
- Cards and disclosures use `--radius-xl` unless they are smaller nested utility surfaces.
- Nested utility surfaces should use `--radius-lg` or `--radius-md`.
- Only the active planning trip and high-attention planner summaries should use elevated featured treatments.
- Do not reintroduce generic card grids where every card carries the same weight.

## Component Rules

- The homepage remains a chooser. Trip cards should contain only status, title, date, primary action, compact facts, and one supporting sentence.
- Trip tabs are a segmented planner rail with label-only wayfinding. Trips with one section show no rail.
- One selected state everywhere: active tab, pressed chip, and checked packing audience all use the trip accent border, soft accent fill, and strong accent text.
- Pills come in two shared kinds: `.tag` for read-only labels and `.choice-chip` for buttons and jump links. Do not add route-specific pill classes.
- Park-day filters use the shared `ParkDayPicker` (short park name plus weekday and date) on both Lightning Lane and ride rankings.
- Lightning Lane park cards show the projected cost once, in the headline, with a flat breakdown row; do not nest boxed panels inside the card.
- The ride guide opens with park jump links, lists parks in trip order with must-do rides first, and shows height requirements as a tag instead of in the notes.
- Every planner tab shows its page title at all widths; mobile uses the smaller headline size.
- Attractions should lead with the scoring guide disclosure, the small filter stack, and the ranked ride list. Do not reintroduce side rails, heatmaps, signals, or area breakdowns.
- Schedule reads as a vertical trip timeline with clear day markers.
- Party leads with one compact split summary and follows with visible slim traveler cards that surface each person's total preference counts.
- On party traveler cards, color is limited to the 3 stat cells only. Keep the card shell, persona label, description, and top call neutral.
- Login stays simple: one centered entry panel, no novelty illustration.

## Motion

- Motion should stay restrained and functional.
- Use `140ms`, `180ms`, and `240ms` timing tokens with `cubic-bezier(0.22, 1, 0.36, 1)`.
- Respect `prefers-reduced-motion` by removing non-essential transition and animation effects.
