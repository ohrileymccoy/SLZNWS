# Phase 7 — Infinite Scroll UX Plan (Interaction Rules Only)

Goal  
Define precisely when to fetch the next page, how to avoid over‑fetching, and how to behave during fast scrolls and offline states. No code in this phase.

---

## Observer Contract

- **Sentinel placement**: A single sentinel element lives **after** the last feed item.
- **Intersection**: Use a viewport‑based observer to detect when the sentinel approaches view.
- **Observer options (locked)**:
  - `root`: `null` (viewport)
  - `rootMargin`: `0px 0px 600px 0px` (pre‑fetch ~600px before bottom)
  - `threshold`: `0` (any visibility counts)

## Fetch Guards (hard rules)

- **Single‑flight**: Never issue a new request while one is pending (success or failure must resolve first).
- **Distance guard**: Ignore triggers if the sentinel has moved **less than 350px** since the last accepted trigger (`MIN_TRIGGER_GAP_PX = 350`).
- **Cooldown**: Require **≥ 300ms** between accepted triggers (`MIN_TRIGGER_GAP_MS = 300`) to prevent rapid fire.
- **Stop condition**: If the last response returns `nextCursor = null`, **disconnect** the observer and stop requesting permanently for this session.
- **Visibility only**: Only list **published** items; dedupe by ID when merging pages (cursor + `id` tiebreaker prevents duplicates).

## State Model

States: `idle` → `loading` → (`idle` | `error` | `end`)  
- **idle**: Ready to fetch if guards pass and sentinel intersects.
- **loading**: Awaiting response; UI shows “Loading more…” at the bottom.
- **error**: Last request failed; show “Retry” control. Next successful retry returns to `idle`.
- **end**: No more pages (`nextCursor=null`); hide/disable sentinel.

Events & Actions:
- **onIntersect** (in `idle` only): if `online` & guards pass → `loading` + fire request.
- **onSuccess**:
  - Append items in order; advance `cursor` to response `nextCursor`.
  - If `nextCursor=null` → `end`, else → `idle`.
- **onFailure**:
  - If `navigator.onLine === false` or network error → `error` with message.
  - Provide **Retry** action; retry resumes from same `cursor`.
- **onRetry**: if `online` → `loading` + refire request; else remain `error`.

## Navigation & Position

- **Back‑to‑feed restoration**: When navigating to an article, store:
  - `scrollY`, current `cursor`, and the current list of item IDs (for dedupe on return).
  - On back, restore **exact scroll** and **existing items** before reattaching the observer.
- **Top refresh dedupe**: If the app refreshes (or user pulls to refresh) and new items exist, **prepend** without duplicating any ID already present.

## Visual & A11y States (MVP)

- **Loading indicator** under the last item while `loading`.
- **Error row** with “Retry” button if a request fails.
- **Offline** copy: “You’re offline. Try again when connected.” Retry stays visible.
- Non‑interactive sentinel (not focusable); loading/error rows are reachable with keyboard.

## Edge/Performance Rules

- **Layout stability**: Reserve image space to avoid CLS when new cards appear.
- **Resize/rotate**: Keep observer active; guards still apply (distance + cooldown).
- **Section change** (filter/sort change): Clear list, reset `cursor`, reattach sentinel fresh.
- **Telemetry (optional later)**: Count accepted vs. rejected triggers (guards), errors, and average page load time.

---

## Scenarios to Verify

1) **Normal scroll**
- Sentinel enters view once; single request fires; new items append; sentinel shifts; no overlaps.

2) **Very fast scroll**
- Multiple intersections may occur, but **only one** request runs due to single‑flight + cooldown + 350px distance guard.
- After append, at most **one** additional fetch occurs if sentinel is still in pre‑fetch range.

3) **Offline / flaky**
- If network drops during fetch: transition to `error`, show Retry.
- With connection restored, Retry succeeds and continues from the same `cursor`.

4) **End of list**
- Response returns `nextCursor=null`; observer disconnects; no further calls occur.

5) **Back navigation**
- Open article → back: original `scrollY` restored exactly; items remain; sentinel reattached at bottom with same `cursor`.

---

## Acceptance Criteria (AC)

- Intersection observer uses the exact options above and triggers **only** in `idle`.
- No overlapping requests ever occur.
- Triggers respect **both** distance (≥350px) **and** time (≥300ms) guards.
- When `nextCursor=null`, further fetches never fire.
- Back navigation restores prior scroll and previously loaded items with no duplicates.
- Offline and error states display clear messaging and a working Retry.

## Verify

- Console/telemetry shows: no concurrent calls; min 300ms between calls; ≥350px scroll between accepted triggers.
- Manual tests: normal, fast flick, offline mid‑fetch, end‑of‑list, back‑to‑feed all match the Scenarios to Verify.

## Rollback

- Adjust `rootMargin`, `MIN_TRIGGER_GAP_PX`, or `MIN_TRIGGER_GAP_MS` here if testing shows under/over‑fetching. No code changes are locked yet.
