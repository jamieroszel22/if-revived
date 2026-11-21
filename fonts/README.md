# Fonts

The site self-hosts its type. No font CDN, no third-party request.

| Role | Family | Files | Licence |
|---|---|---|---|
| Prose | Newsreader | `newsreader-latin.woff2`, `newsreader-latin-ext.woff2` | SIL Open Font License 1.1 |
| Board | JetBrains Mono | `jetbrains-mono-latin.woff2`, `jetbrains-mono-latin-ext.woff2` | SIL Open Font License 1.1 |

## Licences, confirmed

Both were checked against the upstream licence files, not assumed:

- Newsreader — `google/fonts`, `ofl/newsreader/OFL.txt`: "Copyright 2020 The
  Newsreader Project Authors", SIL Open Font License, Version 1.1.
- JetBrains Mono — `JetBrains/JetBrainsMono`, `OFL.txt`: "Copyright 2020 The
  JetBrains Mono Project Authors", SIL Open Font License, Version 1.1.

Both licences permit self-hosting and redistribution with the software.

## What is here

Variable-weight woff2, latin and latin-ext subsets only, as served by the
Google Fonts API and saved locally. A browser fetches a subset only when the
page uses a character from its range, so most readers load the two latin
files and nothing else. The `@font-face` rules and their unicode ranges are at
the top of `src/styles/global.css`; the two latin files are preloaded in
`src/layouts/Base.astro`.

Replacing a family means replacing the files, the `@font-face` rules, the
preloads and the stack in `global.css`, and confirming the new licence here.
