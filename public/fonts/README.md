# Fonts

The site self-hosts its type. No font CDN, no third-party request.

Nothing is in here yet, so the stacks in `src/styles/global.css` currently fall
back to the reader's system serif and monospace. That is a working site, not a
finished one: the candidates still need checking and adding.

| Role | Candidates | Licence to confirm |
|---|---|---|
| Prose | Newsreader, Source Serif 4, Literata | SIL Open Font License |
| Board | JetBrains Mono, Commit Mono, IBM Plex Mono | SIL Open Font License |

To add one:

1. Download the woff2 files and put them in this folder.
2. Confirm the licence and record it below.
3. Uncomment the matching `@font-face` block in `src/styles/global.css`.

Subset to latin and latin-ext. The board font needs tabular figures.

## Licences confirmed

None yet.
