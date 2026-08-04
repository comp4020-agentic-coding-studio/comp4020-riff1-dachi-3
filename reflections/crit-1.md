# Forgotten web

The breakthrough wasn't the CSS or the content --- it was realising that "no
sensor in `pnpm check`" doesn't mean "no way to check." Accessibility and
performance are explicitly left as gaps in this course's starter harness, and
my first instinct was to treat that as licence to eyeball them. Running
`agent-browser a11y --json` against the actual deployed build changed that:
it found a colour pair that read as fine by eye but failed WCAG AA in two
separate roles on the page, and an `aria-label` that looked like careful
markup but was actually dead weight axe-core flags outright. Neither would
have surfaced from reading the CSS or from any check already wired into CI.
The same pattern repeated with links (a `curl` 200 isn't proof a page still
says what you cited it for --- I had to read the redirected target) and with
performance (no Lighthouse equivalent in `agent-browser`, so the Navigation
Timing API directly became the sensor).

What that changes about the developer I want to be: I used to treat "the
checks are green" as the finish line. Now I treat a green suite as the floor,
and ask what it structurally can't see --- then go build that sensor myself,
once, and write down what it found so it doesn't need re-deriving next time.
The habit that stuck hardest is the order of operations: verify with a real
tool against the real deployed artefact before trusting what looks obviously
fine, and when a check finds something, put the lesson in the project's own
`CLAUDE.md`, not just in a private note, so the next pass over this repo
inherits it instead of re-learning it.
