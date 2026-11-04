# If Revived — build contract

**This file is derived from `pdoom-site.md` because the real contract
(`claude/ifrevived-CLAUDE.md`) is not in this repo yet. Replace it with that
file when it arrives.** Where the two disagree, the real contract wins.

## The one rule that decides most questions

Disorient the world, never the interface. Navigation, controls and labels are
plain English. The book's grammar appears in the content, never in a control a
reader has to decode in order to use the site.

The world can be strange. The buttons can't.

## What the site may not have

- **No thematic statement.** No tagline explaining the book. The About page
  says what the site *is*, never what the book *means*.
- **No puns.** Not in page titles, buttons, alt text or the 404.
- **No glossary, cast, world, lore, map, timeline or "how to read this" page.**
  Consequence before definition.
- **No chapter count, progress bar, or list of unreleased slots.** The contents
  page shows released chapters and exactly one slot of noise: the next one.
- **No target address or timestamp on the noise slot.** A header there would
  give away where the next chunk goes.
- **No stock AI imagery.** No brains, circuits, robots, faces, glows, stars or
  sunlight. Every visual and sound derives from one of four sources:
  filesystem, message grammar, budget, reset.
- **No ambient music.** No sound at all unless the reader presses play.
- **No real-world nouns about the source incidents**, and no "inspired by"
  line, anywhere on the site until after the last installment.
- **No invented chapter titles.** The contents list catalogues chapters by
  their first line.
- **No third-party scripts, no font CDNs, no analytics.**

## Hard constraints in the code

- **Unreleased text never ships.** A chapter is in the build only once its
  `release` date has passed. `scripts/check-unreleased.mjs` greps `dist/` for
  the text of every unreleased chapter and fails the build if it finds any. It
  runs as part of `npm run build`.
- **No cryptographic commitment to unreleased text.** The noise slot is random
  base64 drawn at build time, not the chapter encrypted — encrypting it would
  lock text that is still allowed to change. Its length says nothing about the
  real length.
- **Every published passage keeps a visible version history.** Nothing is
  locked, in public.
- **Verify is always opt-in.** Nothing on the site requires it.
- **A signature's honest scope** is stated wherever one appears: it proves the
  text and its label have not changed since signing. It cannot prove who typed
  the words.
- **Process notes** say who wrote what, what changed and where we disagreed.
  They never say what a term means or how the world works — that would be a
  glossary through the side door.

## Two surfaces

Prose chapters are set as prose, in a serif. Strings inside them are board
text: monospace blocks that type out once when they scroll into view, then sit
still. Chunk chapters are lines on the board — `OS#### SENDER to TARGET VERB`
over a plain body, in columns — and each line can show the full `zz` string
behind it.

## Motion and sound

Decoding (noise to text) is the only animation. It runs once, finishes inside
five seconds, and does not run at all under `prefers-reduced-motion` or the
site-wide **Plain text** switch. Colour is greys plus one accent, and the
accent has exactly one job: the read position, which includes the focus ring.

## Layout of the repo

```
src/content/chapters/   one Markdown file per chapter; schema in content.config.ts
src/lib/chapters.ts     the release gate, the noise, the signed-passage source
src/lib/provenance.js   the record format, shared by the signer and the browser
src/lib/site.ts         title, public key, whether the site is indexable
src/components/         noise slot, chunk lines, verify drawer
src/scripts/            decode, board text, raw toggle, verify, plain switch
scripts/                keygen, sign, the unreleased-text check
```

Interactivity is small vanilla modules. No front-end framework.

## What never goes in this repo

The canon register, the state doc, the log and the drafts. The register holds
the ending. The private signing key never goes in either.

## Pace

A session on the site follows a session in which a chapter moved. A website is
the most comfortable way of all not to write.
