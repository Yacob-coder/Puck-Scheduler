# Project Brief — Hockey League Scheduler (App UI)

> Drop this file in the repo root next to `DESIGN.md`. When prompting Claude Code, reference both: "Use DESIGN.md for styling and PROJECT_BRIEF.md for product context."

---

## What this product is

A **fairness-based scheduling tool for amateur sports leagues** (hockey first).

Leagues are assigned **fixed ice slots** by their rinks — they don't choose their times. Our tool's job is to **fairly distribute the good and bad slots and matchups across all teams**, so no team always gets stuck with the early mornings or always plays the same opponent back-to-back. The signature output is a **fairness report** that proves the schedule is balanced.

The thing being optimized is the **assignment of teams/matchups to fixed slots** — not the slots themselves. The calendar is a grid of fixed slots; the moveable pieces are games.

## Audience & voice

Primary user is a **volunteer or part-time league organizer** — a parent who got voluntold into scheduling, doing it on the side. They want **relief and simplicity**, not technology.

Copy rules (apply everywhere):
- Lead with the **outcome**: fewer complaints, less time spent, provably fair.
- Plain language. Short sentences.
- **Do NOT** use "AI" or "machine learning" in user-facing copy.
- **Do NOT** surface the word "annealing" or other engine internals in the UI.
- The method may appear once, quietly, as credibility: "built on proven scheduling-optimization methods."
- Sell **fairness you can prove**; the engine is just how it's delivered.

## Design direction

- Visual system comes from `DESIGN.md` (Stripe-inspired: calm layouts, generous spacing, one clear primary action per screen).
- Import Stripe's **structure and spacing discipline**, not necessarily its heavy purple/thin-type look — favor **clarity and friendliness** for a non-technical user on a mid-range laptop.
- Clarity is the #1 goal. Progressive disclosure: simple path visible by default, advanced options reachable but not in the way.

## Build approach

1. Scaffold project + shared design tokens/components first. Get this right before building screens.
2. Then build screen-by-screen in the order below.
3. Do not generate one giant multi-screen prompt.

---

## Screen flow (build in this order)

1. **Dashboard** — home base. List of the user's leagues/seasons with status (draft, generating, published) and a fairness score at a glance. Primary action: create / open a season.

2. **League setup** — capture teams, divisions, season dates. Foundational data entry. (Consider CSV import for large associations — manual entry of 40 teams is a dealbreaker. Flag as enhancement.)

3. **Slots** — the ice slots the league has been *allocated* (not chosen), across rinks/venues. This is an availability input, not a preference ranking. Apply a built-in **desirability default** (e.g. early mornings / late weeknights = undesirable) so no config is required, with an **optional override** for leagues whose local reality differs.

4. **Constraints** — the core value screen. Rules/toggles: day-of-week fairness, avoid repeat matchups, blackout dates, travel-time limits, venue availability. Progressive disclosure matters most here.

5. **Generate** — runs the engine, shows progress. Must handle the **over-constrained / no-feasible-schedule state**: communicate "here's the best I could do and what I had to relax." [Failure-state UX: TBD — design later.]

6. **Fairness report** — THE differentiator. First-class view, not a PDF afterthought. Visual, scannable, shows balance across teams (slot quality equity, opponent distribution, day-of-week balance). Give this screen the most design care.

7. **Schedule view** — calendar + table toggle. Where users review, manually tweak, and resolve conflicts. Must show when a **manual edit degrades the fairness score**. [Manual override / conflict-resolution UX: TBD — design later.]

8. **Publish / export** — finalize and share the schedule.

---

## Cross-cutting (structure now, detail later)

- **Roles**: single role for now — whoever uses the tool can do everything (setup, generate, publish, export). Do NOT build viewer/permission logic. Parents are *recipients* of the published schedule via existing channels (league site, PDF, email, TeamSnap), not users of the app. Multi-role is deferred until a real multi-person customer (e.g. a large association where a division coordinator edits but can't publish) actually needs it.
- **Re-generation / versioning**: leagues re-schedule mid-season (team drops, rink closes). "Re-run with these games locked" is a real need. Flag as **TBD**.
- **Sport-agnostic**: hockey first. Soccer/other sports are future scope — keep the data model from hard-coding "ice" everywhere, but do NOT build multi-sport UI now. Parked.

---

## Definition: the fairness score

Measures how equitably the schedule distributes across teams along three axes:
- **Slot quality equity** — fair share of desirable vs. undesirable time slots
- **Opponent distribution** — avoids the same matchups repeating too often / back-to-back
- **Day-of-week balance** — no team disproportionately stuck with bad days

This definition should drive the dashboard score, the constraints screen, and the fairness report.
