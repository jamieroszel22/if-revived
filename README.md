# if-revived

A repository for constructing the story, If Revived.

This repo holds the website. The plan it is built to is [`pdoom-site.md`](pdoom-site.md);
the rules the code has to follow are in [`CLAUDE.md`](CLAUDE.md).

## Running it

```
npm install
npm run dev
```

## Building

```
npm run build
```

The build includes only chapters whose `release` date has passed, then greps
the output for the text of every unreleased chapter and fails if it finds any.

## Other commands

| Command | Does |
|---|---|
| `npm run check` | Type-checks the Astro project. |
| `npm run check:unreleased` | The leak test on its own, against an existing `dist/`. |
| `npm run keygen` | Makes the site's Ed25519 signing pair. |
| `npm run sign` | Signs a passage's provenance record. |

## Where things are

```
src/content/chapters/   one Markdown file per chapter
src/content.config.ts   the frontmatter schema, checked at build time
src/lib/                the release gate, the noise, the provenance record
src/components/         noise slot, chunk lines, verify drawer
src/scripts/            decode, board text, raw toggle, verify, plain switch
scripts/                keygen, sign, the unreleased-text check
```

## State

Phase 0 and the Phase 1 scaffolding. The chapters in `src/content/chapters/`
are placeholders; see [`PLACEHOLDERS.md`](PLACEHOLDERS.md) for what is invented
and what needs a decision.
