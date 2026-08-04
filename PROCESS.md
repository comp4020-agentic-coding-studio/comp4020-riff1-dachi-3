# Process overview

## What I built

A shrine to Huang Gongwang (黄公望) and *Dwelling in the Fuchun Mountains*: six
plain HTML/CSS pages --- home, his life, the 1650 fire that split the scroll
in two, the scroll itself, a webring linking out to real scholarship, and a
guestbook --- styled as a parchment-and-seal-red devotional page, the "bygone
web era" look built around a genuine art-history obsession rather than filler
content.

## The moments that mattered

1. **No JavaScript turned out to be a real constraint, not a style note.**
   The starter template ships a small TS/JS scaffold; the brief's "HTML and
   CSS only" line meant deleting it outright and re-deriving effects (the
   ticker marquee, the blink accents) as pure CSS `@keyframes` instead of
   script-driven behaviour. I wrote a project-specific spec check
   (`spec/crit-1.test.ts`) that fails the build on any `<script>` tag, inline
   `on*` handler, or shipped `.js` file, so the constraint is enforced rather
   than just remembered.
   [`9586394`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-dachi/commit/9586394),
   [`0a34b86`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-dachi/commit/0a34b86)

2. **Accessibility has no built-in sensor here, so I wired one myself and it
   found real bugs.** None of `pnpm check` tests contrast or ARIA correctness.
   Running `agent-browser a11y --json` against the live build caught the
   ink/gold colour pair failing WCAG AA in *two* different roles (nav text and
   ticker text, both 4.33:1 against a 4.5:1 bar) and an `aria-label` on a plain
   `<p>` that axe-core flags as dead weight on an element with no ARIA role.
   Both looked fine by eye; neither would have shipped clean without the
   sensor.
   [`ddd0f54`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-dachi/commit/ddd0f54),
   [`7b33fbc`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-dachi/commit/7b33fbc)

3. **A green link check isn't proof a link points where you meant.** Adding an
   external citation to the webring page, `curl -L -w "%{http_code}"` returned
   a clean 200 for a museum-essay URL --- but reading what the page actually
   rendered (not just its status code) showed it had silently 301'd to a
   generic section homepage, the specific article having been retired. I
   swapped it for a stable Wikipedia link and wrote the check-order lesson
   into `CLAUDE.md` so it isn't relearned next time: curl for reachability,
   then read the actual rendered content before citing it.
   [`272479d`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-dachi/commit/272479d),
   [`9efdb85`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-dachi/commit/9efdb85)

4. **Performance also has no sensor in `pnpm check`, and `agent-browser` has
   no Lighthouse equivalent --- so I reached for the Navigation Timing API
   directly.** Served the real `dist/` build locally and ran
   `agent-browser eval "JSON.stringify(performance.getEntriesByType('navigation')[0])"`
   against all six pages: every page loads under 50ms with under 5KB
   transferred, confirming the no-JS, single-stylesheet approach pays off
   without any dedicated optimisation work.
   [`3404fd5`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-dachi/commit/3404fd5)
