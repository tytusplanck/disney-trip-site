# Spotify Wrapped Feature Notes

## Purpose

This note tracks planner stats that were removed from primary trip pages but should stay documented for a future "Spotify Wrapped" style summary surface.

Keep the helper logic even when the live UI no longer shows these cards.

## Attractions Stats

The attractions page used to open with a four-card stat strip in [`/src/pages/[family]/[trip]/attractions.astro`](../src/pages/[family]/[trip]/attractions.astro):

- `Top score`
- `Must-do votes`
- `Scored attractions`
- `Hottest park`

Those values still matter, but they fit better in a future recap surface than at the top of the planner.

### Points Model

The attraction scoring comes from [`/src/lib/trips/data.ts`](../src/lib/trips/data.ts):

- Tier `1` = `5` points (`Must Do`)
- Tier `2` = `4` points (`Preferred`)
- Tier `3` = `3` points (`Indifferent`)
- Tier `4` = `1` point (`Don't Want`)
- Tier `5` = `0` points (`Will Skip`)

Useful recap copy should make clear that:

- `consensusScore` is the sum of those points across the whole party
- `maxScore` is `party size * 5`
- a high total means broad support, not necessarily unanimous `Must Do`
- `must-do votes` and `preferred votes` are directional signals that complement the score

## Retired Party Stats

The party page no longer shows the top stat-card row that used to appear in [`/src/pages/[family]/[trip]/party.astro`](../src/pages/[family]/[trip]/party.astro):

- `Party members`
- `Avg must-dos`
- `Most selective`
- `Most enthusiastic`

These values come from [`getPartyOverview`](../src/lib/trips/details.ts) after building traveler summaries with [`getPartySummaries`](../src/lib/trips/details.ts).

### Party Summary Inputs

Per traveler, [`getPartySummaries`](../src/lib/trips/details.ts) derives:

- `mustDoCount`: number of attractions rated tier `1`
- `enthusiasmCount`: number of attractions rated tier `1` or `2`
- `avoidCount`: number of attractions rated tier `4` or `5`

### Party Card Formulas

[`getPartyOverview`](../src/lib/trips/details.ts) calculates:

- `Party members`: `summaries.length`
- `Avg must-dos`: rounded average of `summary.mustDoCount` across all travelers
- `Most selective`: traveler with the highest `avoidCount`; ties break alphabetically by name
- `Most enthusiastic`: traveler with the highest `enthusiasmCount`; ties break alphabetically by name

## Retired Schedule Stats

The schedule page no longer shows the top stat-card row that used to appear in [`/src/pages/[family]/[trip]/schedule.astro`](../src/pages/[family]/[trip]/schedule.astro):

- `Park days`
- `Resort resets`
- `Travel days`
- `Logged notes`

These values come from [`getScheduleOverview`](../src/lib/trips/details.ts).

### Schedule Card Formulas

[`getScheduleOverview`](../src/lib/trips/details.ts) calculates:

- `Park days`: count of itinerary entries where `entry.kind === 'park'`
- `Resort resets`: count of itinerary entries where `entry.kind === 'resort'`
- `Travel days`: count of itinerary entries where `entry.kind === 'travel'`
- `Logged notes`: count of itinerary entries where `entry.notes !== null`
- `parkLineup`: ordered unique list of non-null `parkLabel` values pulled from the itinerary

## Preserve For Later

Good candidates for a future "Spotify Wrapped" planner surface:

- top-scoring attraction
- total must-do votes
- number of scored attractions
- hottest park by average score
- party member count
- average must-do count
- most selective traveler
- most enthusiastic traveler
- park / resort / travel day counts
- logged note count
- broad-approval attractions
- split-decision attractions
- strongest area by average score
- park-level averages and high-confidence counts

## Suggested Future Task

When this gets revisited:

1. Build a dedicated recap surface instead of re-adding these stat rows to the planner pages.
2. Read from the existing helpers in [`/src/lib/trips/details.ts`](../src/lib/trips/details.ts) and related attraction view-model code instead of duplicating formulas in the UI.
3. Keep recap copy explicit about how each metric is counted so organizers can trust the summary.
