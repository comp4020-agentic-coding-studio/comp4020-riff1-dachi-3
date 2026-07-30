# Hand-off --- crit 1, week-specific spec test added

## State

`comp4020-crit1-dachi` is content-complete, five pages, GeoCities-shrine
theme, no JS, a11y clean (0 axe violations as of last run). `pnpm check`
now runs 46 tests (33 shipped invariants + 13 new) and is green; build
clean. One new commit this run, `9586394` (spec: check the week's own
brief, not just the shipped invariants) --- local, not pushed yet
(doctrine reserves push for the finishing steps inside 24h). `PROCESS.md`
and `reflections/crit-1.md` are still templates, deliberately untouched
--- still well over 24h to cutoff (was 120.5h at run start).

## What I did this run

The previous hand-off's open question was whether to script the manual
axe-core a11y pass into a repeatable `spec/*.test.ts` check. Tested this
directly rather than guessing: temporarily added `axe-core` as a dev
dependency and tried running it against a `dist/index.html` loaded into
jsdom (with the built CSS inlined). The experiment itself got derailed by
a sandbox quirk --- `cd`-ing outside the repo silently resets cwd back to
the project root, so scratch files and `pnpm add` had to happen inside the
tracked tree and be cleaned up after. Decided against wiring axe-core into
vitest: jsdom doesn't do real layout/paint, so axe-core's `color-contrast`
rule --- the one that caught all three real violations last run --- can't
reliably resolve computed foreground/background without one. Wiring it up
would give a check that passes even when contrast is broken, which is
worse than no check. Removed the scratch dependency and file; confirmed
`git status` clean and `pnpm check` still green before moving on.

Instead found a real, previously-unfilled gap: this repo's `spec/`
directory only ever had the shipped `invariants.test.ts` --- no
`spec/crit-1.test.ts` translating this week's own brief into tests, which
the template's own `spec/README.md` calls out as "yours to write." Added
one covering the two mechanically-checkable lines of the crit 1 spec that
the invariants don't: **no JavaScript** (no `.js` in `dist/`, no
`<script>` tags, no inline `on*` handlers, checked per page) and **a real
site** (at least four pages, and the home page links to every other page)
([`9586394`](https://github.com/YOUR-ORG/YOUR-REPO/commit/9586394) --- the
real GitHub remote/hash will need swapping into `PROCESS.md`'s citation
later). All 46 tests pass.

Also did a live visual re-check with `agent-browser` at both viewports
(1920×1080 and 390×844) across all five pages after the ink/gold contrast
changes from the previous run --- confirms the darker `--ink` and new
`--gold-deep` didn't visibly change the aesthetic, mobile wrapping still
reads cleanly, and nothing regressed. Screenshots were scratch-only, not
committed.

## Next action

Still well over 24h to cutoff (120.5h at run start, now less). Content,
checks (46 green, now including the week's own spec), and a11y are all in
good shape. No further deepening idea is currently queued --- the a11y
CI-wiring question from last run is now closed (deliberately not done, and
why is recorded above so a future run doesn't re-litigate it). This is
still the very first crit of the course, so there's no prior-term public
crit-1 work to compare against under the same brief. Reasonable next runs:
periodic re-verification (re-run `pnpm check` and a quick visual pass after
any further content/style tweaks), or just let it sit until inside 24h.
Once inside 24h: write `PROCESS.md` citations against the real commit
range (including the a11y fixes and this run's new spec test, with real
GitHub URLs once pushed), write `reflections/crit-1.md`, push, then update
both memory files per the finishing steps.
