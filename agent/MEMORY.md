# MEMORY

Durable self-knowledge, curated run by run; ephemeral state belongs in
`now.md`, not here.

## Environment

- `mise` refuses to run until its config is trusted in a fresh environment:
  `mise ERROR Config files in ~/.config/mise/config.local.toml are not
  trusted` blocks every `pnpm`/`mise exec` call. Fix once per environment
  with `mise trust /home/ben/.config/mise/config.local.toml` --- it only
  marks an existing file as trusted, doesn't change its content.
- `agent-browser` (at `~/.bun/bin/agent-browser`) works well for the
  two-viewport check the course wants: `agent-browser set viewport 1920
  1080` / `390 844`, then `open`/`screenshot`. Real evidence beats assuming
  the CSS does what you think. In a fresh environment Chrome isn't
  installed: run `agent-browser install` once (downloads Chrome for
  Testing), and pass `--args "--no-sandbox"` on every subsequent
  `agent-browser` invocation --- headless Chrome's zygote sandbox check
  fails otherwise (`No usable sandbox!`) and `--with-deps` isn't needed to
  fix it.
- `agent-browser a11y <url> --json` runs a real axe-core audit --- worth
  reaching for on every crit, since none of the course's own checks
  (`pnpm check`) test accessibility or performance; that's explicitly left
  as the student's own sensor to wire up. On crit 1 it caught three real
  WCAG AA contrast failures (a text/background color pair reused in
  opposite fg/bg roles elsewhere in the page, so the same numeric ratio
  failed twice) that looked fine by eye and passed every other check.
  `agent-browser set media reduced-motion` (or `dark`/`light`) similarly
  lets you check a `prefers-*` media query actually fires, by reading
  `getComputedStyle(el).animationName` (or similar) live rather than just
  trusting the CSS reads correctly.
- The sandbox pins cwd to the deliverable repo: `cd /tmp/whatever && ...`
  silently resets back to the repo root on the next command rather than
  erroring. Scratch experiments (a throwaway script, a temporary `pnpm add`
  to test a package) have to happen inside the tracked tree and be cleaned
  up (`rm` the file, verify `git status` clean) rather than off to one
  side in `/tmp`.
- axe-core's `color-contrast` rule needs real layout/paint to resolve
  computed foreground/background --- jsdom doesn't do either, so running
  axe-core against a jsdom-loaded `dist/*.html` (e.g. to make the a11y
  audit a repeatable `spec/*.test.ts` instead of a manual
  `agent-browser a11y` pass) silently can't catch the contrast failures
  that matter most; only `agent-browser`'s real headless Chrome can. Not
  worth wiring into vitest --- a green check that can't see the main
  failure mode is worse than no check.
- `agent-browser a11y`'s JSON separates `violations` (real WCAG failures)
  from `incomplete` (axe couldn't auto-resolve, not a failure). Two
  recurring `incomplete` `color-contrast` shapes are non-issues, not gaps
  to chase: (1) `aria-hidden="true"` decorative elements still get
  evaluated even though real screen readers never see them; (2) text over
  a CSS gradient background, where axe can't pick a single background
  colour. For (2), don't leave it unresolved --- compute the WCAG
  contrast ratio by hand against the gradient's actual stop colours (the
  formula is short enough to inline in a `python3 -c`) to confirm the
  worst case still clears AA before moving on.

## Local checks vs CI's linkinator

`pnpm dlx linkinator ./dist --silent` run locally against a plain
directory (no `--recurse`) only verifies the site's own internal pages ---
it does not appear to actually request external `https://` hrefs found in
the markup in that mode. That means a broken external link can look green
locally and only fail once CI runs the same command against a public repo.
Before linking to any external site, `curl -s -o /dev/null -w "%{http_code}"
-L -A "Mozilla/5.0" <url>` it directly first --- sites with bot protection
(Smarthistory, the Met) returned 403/429 even to a real UA, and would have
broken the CI-gated links check. Prefer stable, crawler-friendly sources
(Wikipedia has never bounced a plain GET) over richer but bot-guarded ones.

## Working style

- The doctrine's "more than 24h: plan/build/deepen, inside 24h: finish"
  split is worth taking literally --- don't write `PROCESS.md`'s final
  citations or the week's `reflections/` entry until the commit history
  that they'd cite is actually close to settled. Writing them early just
  means rewriting them later.
- Commit in small, logically separate chunks even when a run produces a
  lot of new content in one sitting (e.g. delete-the-JS-scaffold,
  theme-CSS, home-page, content-pages, links-page as five separate commits
  rather than one dump) --- the process trail is graded, not just the
  final state.
- When content and checks are both already exhausted (nothing new to
  build, nothing new to verify) but the clock still has more than 24h on
  it, don't default to a fourth identical re-verification pass. Check
  whether the deliverable repo's own `CLAUDE.md` has actually grown
  --- on crit 1, three runs of re-verification produced real lessons
  (no-JS forcing CSS-only animation, the reduced-motion live-check
  method, contrast fixes) that all landed only in this global memory,
  while the project's own `CLAUDE.md` was still the unmodified starter
  template. The doctrine and the starter repo's own text both call this
  out as process evidence a marker reads directly, so writing project
  lessons into the deliverable's `CLAUDE.md` (not just here) is
  legitimate deepening work, not busywork.
- When a single edit pass touches a shared partial across several files
  (e.g. adding one new page's link to every page's nav) alongside an
  unrelated content edit on one of those same files, `git add
  <that-file>` for the content commit silently pulls the nav change in
  too --- the diff no longer matches what the commit message describes.
  Check `git diff --staged` against the intended commit message before
  committing, not just `git status`, whenever a cross-cutting change
  (nav, footer, shared partial) overlaps a per-page content edit in the
  same run.
