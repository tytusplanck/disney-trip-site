# LL Picks Tab — Implementation Spec

## Context

The Disney trip planning site currently has three tabs: Attractions, Schedule, Party. We're adding a fourth tab — **"LL Picks"** — for Lightning Lane management. This tab lets party members build per-park-day Lightning Lane plans, compare alternatives, and share via URL.

The site is Astro 5 + React islands, CSS custom properties (no framework), deployed on Vercel SSR. Interactive components use the `client:load` React island pattern established by `AttractionsExplorer.tsx`.

**Trip:** casschwlanck-2026 (Mar 28 – Apr 5, 2026), 10 party members.
**Park days:** Animal Kingdom (Mar 29), Hollywood Studios (Mar 31), EPCOT (Apr 2), Magic Kingdom (Apr 4).

---

## Lightning Lane Rules (for implementation)

### Multi Pass (3 selections per park day)

- **Tiered parks** (Magic Kingdom, EPCOT, Hollywood Studios): Pick **1 from Tier 1** + **2 from Tier 2**
- **Non-tiered park** (Animal Kingdom): Pick **any 3** from the full Multi Pass list

### Single Pass (ILL)

- Purchased individually per attraction per day
- No cap — each is an independent buy/skip decision
- Completely separate from Multi Pass slot counts
- ILL attractions do NOT appear in Multi Pass tier lists

### Closures affecting this trip

Attractions closed during the trip window render as disabled with a "Closed" badge. Key closures:

- **MK:** Big Thunder Mountain Railroad (Spring 2026), Buzz Lightyear's Space Ranger Spin (reopens Apr 8)
- **DHS:** Rock 'n' Roller Coaster Starring The Muppets (Summer 2026)
- **Note:** Closures from the dataset that are NOT Lightning Lane eligible (Big Thunder, Buzz Lightyear) should still be noted somewhere visible since they affect trip planning, but they won't appear in the selectable LL inventory.

---

## Wireframe — Page Layout

The page follows the `TripPageShell` pattern used by all trip tab pages.

```
┌─────────────────────────────────────────────────┐
│  [Site Header]                                  │
│  [Breadcrumbs]                                  │
│  [Attractions] [Schedule] [Party] [LL Picks*]   │  ← Tab rail
├─────────────────────────────────────────────────┤
│                                                 │
│  Lightning Lane picks                           │  ← pageTitle
│  Build a plan for each park day, then share     │  ← pageSummary
│  it with the group.                             │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  PLANNING AS                            │    │
│  │  [Tytus●] [Kelsey] [Tim] [Lisa] ...    │    │  ← Member chip row
│  │                                         │    │
│  │  PARK DAY                               │    │
│  │  [AK Mar 29●] [DHS Mar 31] [EPCOT …]  │    │  ← Park day chip row
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │    │
│  │  ┃  Park Day Card (active day)      ┃   │    │  ← Expanded card
│  │  ┃  (see wireframe below)           ┃   │    │
│  │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  [Copy plan link]   [Clear selections] │    │  ← Action bar
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Controls Panel

Uses the same bordered-card treatment as `attractions-explorer__panel`:

- `border: var(--border-thin) solid var(--color-line-subtle)`
- `border-radius: var(--radius-xl)`
- `background: var(--color-surface-1)`
- `padding: var(--space-5)`

**Member chip row:** Same chip pattern as `AttractionsExplorer`. Tytus is selected by default. Each chip shows the member's name. On desktop, Tytus's chip includes a subtle "(Owner)" label.

**Park day chip row:** Same chip pattern. Each chip shows: park abbreviation + date. Example: `AK · Mar 29`. The first park day is selected by default.

---

## Wireframe — Park Day Card (Tiered Park Example: Magic Kingdom)

```
┌──────────────────────────────────────────────────────┐
│  Magic Kingdom                                       │
│  Day 8 · Sat Apr 4 · KELSEYS BIRTHDAY              │  ← from schedule.notes
│                                                      │
│  ── LIGHTNING LANE SINGLE PASS ──────────────────── │
│  Purchased individually · ~$15–25/person             │
│                                                      │
│  [ ] Seven Dwarfs Mine Train                         │
│  [ ] TRON Lightcycle / Run                           │
│                                                      │
│  ── MULTI PASS · TIER 1 ────────────────────────── │
│  Choose 1                                            │
│                                                      │
│  ( ) Jungle Cruise                                   │
│  ( ) Peter Pan's Flight                              │
│  ( ) Space Mountain                                  │
│  ( ) Tiana's Bayou Adventure                         │
│                                                      │
│  ── MULTI PASS · TIER 2 ────────────────────────── │
│  Choose 2                      ○ 0 of 2 selected    │
│                                                      │
│  [ ] The Barnstormer                                 │
│  [ ] Dumbo the Flying Elephant                       │
│  [ ] Haunted Mansion                                 │
│  [ ] "it's a small world"                            │
│  [ ] Mad Tea Party                                   │
│  [ ] The Magic Carpets of Aladdin                    │
│  [ ] The Many Adventures of Winnie the Pooh          │
│  [ ] Mickey's PhilharMagic                           │
│  [ ] Monsters Inc. Laugh Floor                       │
│  [ ] Pirates of the Caribbean                        │
│  [ ] Tomorrowland Speedway                           │
│  [ ] Under the Sea ~ Journey of The Little Mermaid   │
│                                                      │
│  ── SUMMARY ────────────────────────────────────── │
│  Single Pass: 0 selected · Multi Pass: 0 of 3       │
└──────────────────────────────────────────────────────┘
```

### Park Day Card (Non-Tiered Example: Animal Kingdom)

```
┌──────────────────────────────────────────────────────┐
│  Disney's Animal Kingdom                             │
│  Day 2 · Sun Mar 29 · Campfire                      │
│                                                      │
│  ── LIGHTNING LANE SINGLE PASS ──────────────────── │
│  Purchased individually · ~$15–25/person             │
│                                                      │
│  [ ] Avatar Flight of Passage                        │
│                                                      │
│  ── MULTI PASS ─────────────────────────────────── │
│  Choose 3                      ○ 0 of 3 selected    │
│                                                      │
│  [ ] Expedition Everest                              │
│  [ ] Feathered Friends in Flight!                    │
│  [ ] Festival of the Lion King                       │
│  [ ] Finding Nemo: The Big Blue... and Beyond!       │
│  [ ] Kali River Rapids                               │
│  [ ] Kilimanjaro Safaris                             │
│  [ ] Na'vi River Journey                             │
│  [ ] Zootopia: Better Zoogether!                     │
│                                                      │
│  ── SUMMARY ────────────────────────────────────── │
│  Single Pass: 0 selected · Multi Pass: 0 of 3       │
└──────────────────────────────────────────────────────┘
```

### Park Day Card (Hollywood Studios — with closure)

```
┌──────────────────────────────────────────────────────┐
│  Disney's Hollywood Studios                          │
│  Day 4 · Tue Mar 31 · Roundup Rodeo BBQ (lunch)    │
│                                                      │
│  ── LIGHTNING LANE SINGLE PASS ──────────────────── │
│                                                      │
│  [ ] Star Wars: Rise of the Resistance               │
│                                                      │
│  ── MULTI PASS · TIER 1 ────────────────────────── │
│  Choose 1                                            │
│                                                      │
│  ( ) Mickey & Minnie's Runaway Railway               │
│  ( ) Millennium Falcon: Smugglers Run                │
│  (░) Rock 'n' Roller Coaster ···· [CLOSED]          │  ← greyed, disabled
│  ( ) Slinky Dog Dash                                 │
│                                                      │
│  ── MULTI PASS · TIER 2 ────────────────────────── │
│  Choose 2                      ○ 0 of 2 selected    │
│  ...                                                 │
└──────────────────────────────────────────────────────┘
```

---

## Wireframe — Shared Plan (View-then-Fork Mode)

When a user opens a shared URL, they see a read-only presentation of the sharer's plan:

```
┌──────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────┐  │
│  │  Viewing Kelsey's Lightning Lane picks         │  │  ← Banner
│  │  [Make my own version]                         │  │  ← Fork CTA
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  Disney's Animal Kingdom · Day 2 · Mar 29     │  │
│  │                                                │  │
│  │  Single Pass                                   │  │
│  │    ✓ Avatar Flight of Passage                  │  │
│  │                                                │  │
│  │  Multi Pass (3 of 3)                           │  │
│  │    ✓ Kilimanjaro Safaris                       │  │
│  │    ✓ Expedition Everest                        │  │
│  │    ✓ Na'vi River Journey                       │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  Hollywood Studios · Day 4 · Mar 31           │  │
│  │  ...                                           │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  (all 4 park days shown stacked, read-only)          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Key differences from edit mode:**

- No member chip row or park day chip row — all days shown stacked
- Selections shown as check marks, not interactive inputs
- No action bar (copy link / clear)
- Banner at top identifies the plan author + fork CTA
- Tapping "Make my own version" copies the selections into the viewer's own plan and switches to edit mode

---

## Interaction Model

### Selection mechanics

| Section               | Input type | Behavior                                                   |
| --------------------- | ---------- | ---------------------------------------------------------- |
| Single Pass (ILL)     | Checkbox   | Toggle on/off. No cap. Independent of Multi Pass.          |
| Tier 1 (tiered parks) | Radio-like | Selecting one deselects any previous Tier 1 pick. Max 1.   |
| Tier 2 (tiered parks) | Checkbox   | Max 2. When 2 selected, remaining unchecked items disable. |
| Multi Pass (AK)       | Checkbox   | Max 3. When 3 selected, remaining unchecked items disable. |

### Tier limit enforcement

When a section reaches its cap:

1. Remaining unchecked items render with `opacity: 0.45`, `pointer-events: none`
2. The constraint counter updates: "2 of 2 selected" in `var(--color-brand)` (filled state) vs "0 of 2 selected" in `var(--color-ink-faint)` (empty state)
3. Deselecting a pick immediately re-enables all disabled options

For Tier 1: since only 1 is allowed, use radio-like behavior — tapping a new Tier 1 attraction automatically deselects the previous one (no disabled state needed, just swap).

### Closure display

Closed attractions:

- Row: `opacity: 0.45`
- Label: `text-decoration: line-through`
- Badge: `[CLOSED]` pill — `background: var(--color-viz-4-soft); color: var(--color-viz-4-strong)`
- Input: disabled, not selectable
- Hover/focus tooltip: closure detail from dataset (e.g., "Closed for Muppets re-theme — Summer 2026")

### Park day navigation

Clicking a park day chip switches the displayed card. This is **client-side state only** — no page navigation. The URL hash updates to reflect the active park day for deep linking (e.g., `#day=0331`), but does not cause a page reload.

### Member switching

1. Click a member chip → that member becomes the active planner
2. If that member has prior selections in the React state, restore them
3. If no prior selections exist, all park days show empty states
4. Tytus's selections load from the hardcoded default plan data (the only persisted plan)
5. Other members start blank (or from URL hash if present)
6. Switching members does **not** discard the prior member's in-session state — it's held in React state
7. **All non-Tytus plans are ephemeral** — they exist only in the current browser session and are lost on refresh. The URL hash is the only way to share/preserve them.

---

## Important: No Server-Side Persistence

**Only Tytus's default plan is stored in the codebase** (as static data). All other member plans are purely ephemeral:

- Created and held in React component state during a browser session
- Lost on page refresh or navigation away
- The **only way to preserve or share** a plan is via the URL hash
- "Make my own version" copies selections into local React state — nothing is saved to any server or database
- This is intentional: the site has no database, and alternative plans are meant to be lightweight "what-if" explorations shared via link

---

## Sharing Mechanism — URL Hash Encoding

### Why URL hash

- No backend/database needed (site has no DB)
- Works with existing Vercel SSR + auth setup
- Hash fragment not sent to server (clean server logs)
- Compact enough for reasonable URLs
- Party members already have site access via shared password
- **The URL IS the persistence layer** for non-default plans

### Encoding format

```
#ll={memberId}:{parkDate}={selections},...

Each parkDate is MMDD format.
Each selections value is a dot-separated list of attraction short codes.
Prefix: i= for ILL, t1= for Tier 1, t2= for Tier 2, m= for Multi Pass (AK).
```

**Example URL:**

```
/casschwlanck/2026/ll#ll=kelsey:0329=i.afp.m.ks.ee.nrj,0331=i.rotr.t1.sdd.t2.tsm.tzt,0402=i.gotr.t1.fea.t2.se.sal,0404=i.sdmt.tron.t1.ppf.t2.hm.poc
```

Where short codes map to attractions:

- `afp` = Avatar Flight of Passage, `ks` = Kilimanjaro Safaris, etc.
- Every LL-eligible attraction gets a stable 2–4 char `shortCode` in the inventory data

**Estimated URL length:** ~100–150 chars in the hash for a full 4-day plan. Well within limits.

### Share flow

1. User taps **"Copy plan link"** button
2. Current member's full plan serialized into URL hash
3. URL copied to clipboard via `navigator.clipboard.writeText()`
4. Confirmation toast (CSS animation, fades after 2s): "Link copied!"
5. Recipient opens URL → page detects `#ll=` hash → enters **view mode**

### View-then-fork flow

1. URL with `#ll=` hash detected on page load
2. Page renders in **read-only shared view** (all park days stacked, selections shown as checkmarks)
3. Banner: "Viewing {Member}'s Lightning Lane picks" + **"Make my own version"** button
4. Tapping fork button:
   - Copies the displayed selections into the viewer's own plan state
   - Switches to edit mode with the viewer's name in the member chip
   - URL hash clears (viewer starts fresh with forked data)

---

## Data Model

### New types (`src/lib/trips/ll-types.ts`)

```typescript
export type LLParkId = 'magic-kingdom' | 'epcot' | 'hollywood-studios' | 'animal-kingdom';

export type LLTier = 'tier1' | 'tier2' | 'notier';

export type LLPassType = 'individual' | 'multipass';

export interface LLAttraction {
  id: string; // stable slug, e.g. 'avatar-flight-of-passage'
  shortCode: string; // 2-4 char code for URL encoding
  attractionLabel: string; // display name
  parkId: LLParkId;
  passType: LLPassType;
  tier: LLTier | null; // null for ILL
  closedDuringTrip: boolean; // derived from closure dataset for this trip's dates
  closureNote: string | null; // e.g. "Closed for Muppets re-theme — Summer 2026"
}

export interface LLParkInventory {
  parkId: LLParkId;
  parkLabel: string;
  hasTiers: boolean;
  maxTier1: number; // 1 for tiered parks, 0 for AK
  maxTier2: number; // 2 for tiered parks, 0 for AK
  maxMultiPass: number; // 3 for AK, 0 for tiered parks (use tier limits)
  attractions: LLAttraction[];
}

export interface LLParkDay {
  parkDate: string; // ISO date
  parkId: LLParkId;
  parkLabel: string;
  dayNumber: number;
  weekdayLabel: string; // "Sun", "Tue", etc.
  dateLabel: string; // "Mar 29", "Apr 4"
  scheduleNotes: string | null; // from TripScheduleEntry.notes
}

export interface LLParkDaySelections {
  illSelections: string[]; // attraction IDs
  tier1Selection: string | null; // single ID (tiered parks)
  tier2Selections: string[]; // IDs (tiered parks, max 2)
  multiPassSelections: string[]; // IDs (AK only, max 3)
}

export interface LLMemberPlan {
  memberId: string;
  parkDays: Record<string, LLParkDaySelections>; // keyed by parkDate
}

// Props for the React island
export interface LLPlannerData {
  party: TripPartyMember[];
  parkDays: LLParkDay[];
  inventory: Record<LLParkId, LLParkInventory>;
  defaultPlan: LLMemberPlan; // Tytus's hardcoded picks (placeholder initially)
  ownerMemberId: string; // 'tytus'
}
```

### Additions to existing types

In `src/lib/trips/types.ts`:

```typescript
export type TripSection = 'attractions' | 'schedule' | 'party' | 'll';
```

In `TripDataModule` (same file):

```typescript
export interface TripDataModule {
  // ... existing fields ...
  llInventory?: LLInventory; // NEW — optional, only for trips with LL data
  llDefaultPlan?: LLMemberPlan; // NEW — owner's default plan (placeholder for now)
}
```

### New data files

| File                                                | Purpose                                                                                                     |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/data/trips/casschwlanck-2026/ll-inventory.ts`  | Full LL attraction inventory from the dataset doc, organized by park. Include `shortCode` for URL encoding. |
| `src/data/trips/casschwlanck-2026/ll-selections.ts` | Tytus's default plan (initially placeholder with empty selections per park day).                            |
| `src/lib/trips/ll-types.ts`                         | All LL-specific TypeScript types.                                                                           |
| `src/lib/trips/ll-planner.ts`                       | View model builder, constraint logic, URL serialization/deserialization.                                    |
| `src/components/LightningLanePlanner.tsx`           | Main React island component.                                                                                |
| `src/pages/[family]/[trip]/ll.astro`                | Page route for the LL Picks tab.                                                                            |

---

## Implementation Steps

### Step 1: Types & data layer

1. Add `'ll'` to `TripSection` in `src/lib/trips/types.ts`
2. Create `src/lib/trips/ll-types.ts` with all types above
3. Create `src/data/trips/casschwlanck-2026/ll-inventory.ts` — transcribe the full LL dataset from the user's doc into the `LLAttraction[]` / `LLParkInventory` structure. Every attraction needs a `shortCode`.
4. Create `src/data/trips/casschwlanck-2026/ll-selections.ts` — placeholder `LLMemberPlan` for Tytus with empty selections per park day
5. Wire into `src/data/trips/casschwlanck-2026/index.ts` as optional `llInventory` and `llDefaultPlan` fields

### Step 2: Routing & tab nav

6. Update `TripTabs.astro` — add `{ label: 'LL Picks', section: 'll' }` to the tabs array
7. Update CSS: the tab rail grid (currently `repeat(3, ...)`) needs to handle 4 tabs. Ensure labels don't truncate on mobile.
8. Add LL section copy to `src/pages/[family]/[trip]/trip-sections.page.ts`:
   ```typescript
   ll: {
     title: 'Lightning Lane Picks',
     summary: 'Build a plan for each park day, then share it with the group.',
   }
   ```
9. Update `src/lib/trips/readiness.ts` to handle `'ll'` section readiness (check if `llInventory` exists)
10. Add LL stub page to `src/data/trip-stubs.ts`
11. Create `src/pages/[family]/[trip]/ll.astro` following the `attractions.astro` pattern

### Step 3: View model logic (`src/lib/trips/ll-planner.ts`)

12. `buildLLPlannerData(module: TripDataModule): LLPlannerData` — derives park days from schedule (park entries only), maps to inventory
13. Constraint enforcement helpers:
    - `canSelectTier1(current: LLParkDaySelections): boolean`
    - `canSelectTier2(current: LLParkDaySelections): boolean`
    - `canSelectMultiPass(current: LLParkDaySelections): boolean`
    - `toggleSelection(current: LLParkDaySelections, attractionId: string, inventory: LLParkInventory): LLParkDaySelections`
14. `serializePlan(plan: LLMemberPlan, inventory): string` — encode to URL hash
15. `deserializePlan(hash: string, inventory): LLMemberPlan | null` — decode from URL hash
16. Unit tests for constraint logic and serialization round-trips

### Step 4: React island

17. Create `src/components/LightningLanePlanner.tsx`:
    - State: `activeMemberId`, `activeParkDate`, `plans: Record<string, LLMemberPlan>`, `viewMode: 'edit' | 'shared'`
    - On mount: check URL hash for `#ll=` → if found, parse and enter shared view mode
    - Render: controls panel + active park day card OR shared view (all days stacked)
    - Selection handlers call constraint helpers and update state
18. Sub-components (can be in same file or split):
    - `LLControlsPanel` — member chips + park day chips
    - `LLParkDayCard` — renders ILL section + tier sections + summary
    - `LLSharedView` — read-only stacked view with fork banner
    - `LLAttractionRow` — single attraction checkbox/radio row with closure badge

### Step 5: Styling

19. Add LL-specific classes to `src/styles/trip-pages.css`:
    - `ll-planner__controls` — controls panel
    - `ll-card` — park day card
    - `ll-card__header` — park name + day info
    - `ll-section` — ILL / Tier 1 / Tier 2 section
    - `ll-section__eyebrow` — section label
    - `ll-section__constraint` — "Choose N" counter
    - `ll-row` — attraction row
    - `ll-row--closed` — closed attraction styling
    - `ll-row--disabled` — at-cap disabled styling
    - `ll-badge--closed` — closure pill badge
    - `ll-shared-banner` — shared view banner
    - `ll-toast` — clipboard confirmation
20. Reuse existing chip classes from `AttractionsExplorer` (or extract shared chip component)

### Step 6: Share & polish

21. Implement clipboard copy with `navigator.clipboard.writeText()`
22. Add toast animation (CSS `@keyframes` fade-in/out, 2s duration)
23. Shared view: detect hash on mount, render read-only, wire fork button

---

## Verification

1. **Navigate to LL Picks tab** — should show planner with Tytus selected, first park day active, all inventory loaded
2. **Make selections** — Tier 1 radio-swaps correctly, Tier 2/MultiPass caps enforce, ILL toggles freely
3. **Switch park days** — selections persist per day, card content updates
4. **Switch members** — new member starts empty, switching back restores prior selections
5. **Copy plan link** — URL with hash copied, toast appears
6. **Open shared URL in new tab** — read-only view shows, fork button works
7. **Closed attractions** — greyed out, not selectable, badge visible
8. **Mobile** — 4-tab rail fits, card scrolls, chips wrap, touch targets meet `--tap-target-min`
9. **Run `npm run verify`** — build + lint + type-check + tests pass

---

## Key Files to Modify

| File                                              | Change                                                                  |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/lib/trips/types.ts`                          | Add `'ll'` to `TripSection`, add optional LL fields to `TripDataModule` |
| `src/components/TripTabs.astro`                   | Add 4th tab entry                                                       |
| `src/pages/[family]/[trip]/trip-sections.page.ts` | Add `ll` copy                                                           |
| `src/lib/trips/readiness.ts`                      | Handle `'ll'` readiness check                                           |
| `src/data/trip-stubs.ts`                          | Add LL stub                                                             |
| `src/data/trips/casschwlanck-2026/index.ts`       | Wire LL inventory + default plan                                        |
| `src/styles/trip-pages.css`                       | Tab grid for 4 tabs                                                     |
| `src/styles/components.css`                       | Tab rail grid update if defined here                                    |

## Key Files to Create

| File                                                | Purpose                                            |
| --------------------------------------------------- | -------------------------------------------------- |
| `src/lib/trips/ll-types.ts`                         | All LL TypeScript types                            |
| `src/lib/trips/ll-planner.ts`                       | View model builder, constraints, URL serialization |
| `src/data/trips/casschwlanck-2026/ll-inventory.ts`  | Full LL attraction dataset                         |
| `src/data/trips/casschwlanck-2026/ll-selections.ts` | Tytus's default plan (placeholder)                 |
| `src/pages/[family]/[trip]/ll.astro`                | Page route                                         |
| `src/components/LightningLanePlanner.tsx`           | React island                                       |

## Reference Patterns

| Pattern                        | Reference file                                                     |
| ------------------------------ | ------------------------------------------------------------------ |
| React island with chip filters | `src/components/AttractionsExplorer.tsx`                           |
| View model builder             | `src/lib/trips/attractions-explorer.ts`                            |
| Page route setup               | `src/pages/[family]/[trip]/attractions.astro`                      |
| Data module wiring             | `src/data/trips/casschwlanck-2026/index.ts`                        |
| CSS component naming           | `src/styles/trip-pages.css` (BEM-like: `block__element--modifier`) |
| Design tokens                  | `src/styles/tokens.css`                                            |

## LL Dataset Reference

The complete Lightning Lane inventory (per-park, per-tier, with closure data) is provided in the user's "Walt Disney World Lightning Lane Dataset" document. The dataset includes:

- JSON with full attraction records, tier assignments, status, closure impacts
- TypeScript types (`DisneyWorldLightningLaneDataset`)
- Short codes need to be assigned during implementation (not in the source doc)

The coding agent should transcribe this into the `ll-inventory.ts` data file, mapping park names to `LLParkId` values and filtering to only LL-eligible attractions.
