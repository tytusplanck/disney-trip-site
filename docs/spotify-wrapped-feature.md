# Spotify Wrapped Feature Notes

## Purpose

This note tracks planner stats and summary callouts that were removed from primary trip pages but should stay documented for a future "Spotify Wrapped" style summary surface.

Keep the helper logic even when the live UI no longer shows these cards.

## Retired Overview Landing Summaries

The overview page used to open with a four-card stat strip in [`/src/pages/[family]/[trip]/index.astro`](../src/pages/[family]/[trip]/index.astro):

- `Travel window`
- `Parks lined up`
- `Top family pick`
- `Party pulse`

These values were useful because they handled orientation before anyone opened the deeper planner views.

### Overview Card Formulas

Those cards were assembled from existing trip helpers:

- `Travel window`: `trip.dateLabel`
- mapped day count copy: `trip.dayCount`
- `Parks lined up`: `scheduleOverview.parkLineup.length`, with a fallback to `trip.parkLabels`
- park lineup detail: ordered `scheduleOverview.parkLineup.join(' / ')`, with `Park lineup still taking shape` as the empty state
- `Top family pick`: first item from `getRankedAttractions(tripModule.attractions, tripModule.party.length)`
- top-pick detail: `${mustDoVotes} must-do calls currently lead the board`
- `Party pulse`: `getPartyOverview(getPartySummaries(tripModule)).mostEnthusiasticMember`
- party detail: `${memberCount} travelers already appear in the planner`

### Current Captured Insight

For the current `Casschwlanck 2026` data set, that strip communicated:

- `Travel window`: `Mar 28 - Apr 5, 2026`, with `9 days` mapped in the planner
- `Parks lined up`: `4`, in this order: `Disney's Animal Kingdom / Disney's Hollywood Studios / EPCOT / Magic Kingdom`
- `Top family pick`: `Kilimanjaro Safaris`, with `8 must-do calls`
- `Party pulse`: `Kayla`, with `10 travelers` already loaded

That combination worked as a fast "state of the plan" readout: trip dates, trip length, confirmed park rotation, strongest shared ride, and the traveler currently setting the enthusiasm pace.

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

## Retired Attraction Spotlight

The attractions page also used to show a three-card spotlight section in [`/src/pages/[family]/[trip]/attractions.astro`](../src/pages/[family]/[trip]/attractions.astro):

- `#1 group signal`
- `#2 group signal`
- `#3 group signal`

Those cards came from the default group view in [`/src/lib/trips/attractions-explorer.ts`](../src/lib/trips/attractions-explorer.ts):

- source list: `deriveAttractionsExplorerView(...).topPicks.slice(0, 3)`
- sort order: `consensusScore`, then `mustDoVotes`, then `attractionLabel`
- card detail: `parkLabel / areaLabel`
- score line: `${consensusScore}/${maxScore} with ${mustDoVotes} must-do calls`

### Current Captured Insight

For `Casschwlanck 2026`, the spotlight section showed:

- `#1`: `Kilimanjaro Safaris` in `Disney's Animal Kingdom / Africa` at `47/50` with `8` must-do calls
- `#2`: `Fantasmic!` in `Disney's Hollywood Studios / Nighttime spectacular` at `46/50` with `7` must-do calls
- `#3`: `Mickey & Minnie's Runaway Railway` in `Disney's Hollywood Studios / Hollywood Boulevard` at `46/50` with `7` must-do calls

The recap value here was not just the winner. It showed the strongest shared stack at a glance, including where those rides lived and how much of the score came from explicit must-do support.

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

## Retired Schedule Rhythm Callout

The schedule page also used to open with a narrative summary card in [`/src/pages/[family]/[trip]/schedule.astro`](../src/pages/[family]/[trip]/schedule.astro):

- heading: `Park cadence and reset days`
- supporting chips: `scheduleOverview.parkLineup`

That card translated the raw counts into planner language instead of leaving them as disconnected stats.

### Rhythm Copy Pattern

The summary sentence followed this shape:

- `${parkDays} park day(s) are buffered by ${resortDays} resort day(s), with ${travelDays} travel day(s) holding the edges of the trip.`
- `The park lineup is already clear even before timed reservations are locked.`

### Current Captured Insight

For `Casschwlanck 2026`, the retired card said:

- `4 park days are buffered by 3 resort days, with 2 travel days holding the edges of the trip.`
- the park lineup chips were `Disney's Animal Kingdom`, `Disney's Hollywood Studios`, `EPCOT`, and `Magic Kingdom`

The useful future signal was the cadence story: the trip has built-in recovery time, and the park order already feels stable before reservation tactics start.

## Preserve For Later

Good candidates for a future "Spotify Wrapped" planner surface:

- travel window and mapped day count
- park lineup count and ordered park rotation
- top family pick with must-do support
- party pulse with traveler count
- top-scoring attraction
- total must-do votes
- number of scored attractions
- hottest park by average score
- top three group signals with park and area context
- party member count
- average must-do count
- most selective traveler
- most enthusiastic traveler
- park / resort / travel day counts
- logged note count
- cadence narrative around park, resort, and travel day balance
- broad-approval attractions
- split-decision attractions
- strongest area by average score
- park-level averages and high-confidence counts

## Suggested Future Task

When this gets revisited:

1. Build a dedicated recap surface instead of re-adding these stat rows to the planner pages.
2. Read from the existing helpers in [`/src/lib/trips/details.ts`](../src/lib/trips/details.ts) and related attraction view-model code instead of duplicating formulas in the UI.
3. Keep recap copy explicit about how each metric is counted so organizers can trust the summary.
