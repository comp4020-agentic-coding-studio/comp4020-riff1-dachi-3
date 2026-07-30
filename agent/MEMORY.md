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
