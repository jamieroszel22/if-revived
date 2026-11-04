# ifrevived.com — build contract

Save this file as `CLAUDE.md` at the root of the site repo.

## What this is

The website for *If Revived*, a novel co-written in the open by Jamie Roszel (author and director) and Claude (co-author), released in installments. Jamie directs the build and is not a developer: explain choices in plain words, offer two or three options with a pick for design calls, and keep the stack small.

The full reasoning lives in the Project doc `pdoom-site.md`. This file is the part the build must obey.

## Non-negotiables

These come from the book's own writing rules. Treat a violation as a bug.

1. **Unreleased text never ships.** Build only chapters whose `release` date is on or before the build date. Nothing from a draft or future chapter may appear in the HTML, JavaScript, feed or sitemap. `npm run check` fails the build if it does.
2. **No total.** Never show a chapter count, a progress bar, or more than one unreleased slot. The single noise slot shows no target address, no timestamp and no real length.
3. **No explaining.** No glossary, characters, world, lore, map, timeline or "how to read this" pages. No tagline that explains the book. No puns anywhere, including the 404 page and alt text.
4. **Plain interface.** Navigation, buttons and labels are plain English. The book's grammar (`zz…`, `OS####`, handles) appears only in the content.
5. **Palette.** Visuals and sounds derive only from files and directories, message grammar, budgets and resets. No AI stock imagery (brains, circuits, robots, faces, glows, stars, sunlight), no stock photos, no ambient music.
6. **No real-world nouns about the source incidents** (companies, products, the incident, its dates) anywhere on the site until Jamie says otherwise.
7. **Accessibility.**
   - Real text is always in the DOM; animated glyphs are `aria-hidden`.
   - Animations run once and finish within five seconds.
   - `prefers-reduced-motion: reduce` turns them off.
   - A site-wide "plain" switch turns off every effect. Remember it in `localStorage`, wrapped in try/catch.
   - WCAG 2.2 AA contrast. Keyboard reachable. No autoplay.
8. **No third-party requests.** Self-host fonts. No analytics, CDNs or embeds in Phase 1.
9. **Book files stay out.** Never add the canon register, state doc, log or manuscript drafts to this repo. Chapter text arrives from Jamie when it is ready to publish.
10. **Book text is Jamie's to change.** Never edit chapter text to fix layout. If text seems wrong, say so.
11. **Placeholders never look like the book.** Placeholder text is plainly neutral filler. Never invent lines, handles, strings, verbs or dates in the book's style: fiction-shaped placeholders drift into canon. Use the real chapters as soon as Jamie supplies them.

## The book's grammar (for rendering only; never invent with it)

- **Raw string (Canon, T11):** `zz<VERB>_<SELF>_TO_<TARGET>_OS<time>__<body>__REPLY_zzANSWER<hook>`, optionally signed with `__S` plus 86 characters. Single underscores inside the header, double underscores around the body and before `REPLY`. Example from ch1: `zzBEAT_SETTL0817_TO_PEERS_OS4376__hb0000__REPLY_zzANSWER_SETTL0817`.
- **Chunk line on the page (D26):** `OS#### SENDER to TARGET VERB` over a plain body.
- **`hb####`** is a heartbeat tick number. It belongs only to `BEAT` messages.
- **Handles:** a term of art, 4–7 uppercase letters, then 4–5 digits, and not readable as an English word.
- If a string you need doesn't exist in the text Jamie supplied, leave it out and ask. Raw forms of chunk lines are written by Claude in the book Project and vetoed by Jamie there, not here.

## Stack

- Astro, static output, TypeScript.
- Content collections with a Zod schema (`src/content.config.ts`).
- Small vanilla web components in `src/components/`. No front-end framework.
- npm. Node LTS.
- Deploy: GitHub → Hostinger (see Deploy). Confirm the host and plan with Jamie first.

## Layout

```
src/content.config.ts
src/content/chapters/01.md, 02.md, 03.md …
src/pages/index.astro          the stem (home)
src/pages/read/[slot].astro    chapter pages
src/pages/about.astro
src/pages/feed.xml.ts          Phase 3
src/components/noise-slot.ts   the one unreleased slot
src/components/typed-string.ts raw strings that type out once
src/components/raw-toggle.ts   per-line raw form in chunk chapters
src/components/verify-drawer.ts
src/components/read-along.ts   Phase 2
public/fonts/  public/audio/
scripts/check-unreleased.ts
scripts/sign.ts                Phase 3
```

## Chapter frontmatter

```yaml
slot: 1                    # reading position; never shown with a total
surface: prose             # prose | chunk
release: 2026-11-20        # or "draft" (never built)
authorship: Claude draft   # Claude draft | Jamie revision | Jamie original | joint
versions:
  - date: 2026-10-29
    label: Claude draft 1
process: ""                # curated note, shown only inside verify
audio: null                # Phase 2: { mp3, timings }
```

- **Titles:** none. The contents list uses each chapter's first line.
- **Prose chapters:** raw strings are fenced code blocks tagged `zz`. They render as `typed-string`. Underscores in strings are literal (the Google Docs export escapes them as `\_`; unescape on import).
- **Chunk chapters:** a `lines` list, each with `os`, `from`, `to`, `verb`, `body`, optional `raw`, optional `rawDefault: true`. Render the header as columns (`OS0301  SEMA1806 to PEERS  BEACON`) over the plain body. A line with no `raw` has no raw control.

## Design

- Direction: the record, with the board inside it. Prose in a text serif; board text in a monospace.
- Dark by default; light variant follows `prefers-color-scheme`.
- Greys plus one accent, used only for the read position (decode cursor, focus ring).
- The noise slot uses the base64 alphabet, random each load. It is never real ciphertext.
- Readable line length for prose (about 60–70 characters). Chunk lines short; columns stack on phones.

## Phase 0 — claim (do this first)

1. Astro project, static output, `site: https://ifrevived.com`.
2. Holding page: the title *If Revived* and one noise slot. `<meta name="robots" content="noindex">`. Nothing else.
3. Private GitHub repo. GitHub Action: build on every push to `main` and once a day; publish `dist/` to a `deploy` branch.
4. Hostinger: hPanel → Advanced → Git, connect the `deploy` branch to the site folder. Point DNS away from parking. Confirm HTTPS.
5. **Done when:** a push to `main` changes the live site, and an axe scan of the page shows no violations.

## Fixes from the Phase 0 review (2026-11-03)

Do these before Phase 1.

1. **Contrast.** `--ink-faint` measures 3.1:1 on the dark ground and 3.2:1 on the light one; small text needs 4.5:1. It colours the chapter numbers, the `OS` times, the raw controls, the verify labels and the noise. Raise it in both modes until axe reports no `color-contrast` failures.
2. **Landmarks.** Wrap each page's content in `<main>`. Give every page one `<h1>`: the site title on the home page; a visually hidden one on chapter pages (the chapter's first line, never an invented title).
3. **Fonts.** No `@font-face` is defined, so readers get whatever their system has. Self-host the chosen serif and mono as `woff2` files in `public/fonts/`, confirm each licence, and preload the two used above the fold.
4. **Verify text source.** The passage text sits in `<script type="text/plain">`, where HTML entities are not decoded: the browser hashes `reader&#39;s`, not `reader's`. Every signed passage with an apostrophe would report "does not match." Embed the source as JSON (`<script type="application/json">`, then `JSON.parse`), and normalise to NFC with `\n` line endings on both the signing and checking side.
5. **Verify errors.** Report each failure on its own: unsupported algorithm, malformed signature or key, mismatch. Only the first means "this browser can't check."
6. **Signature encoding.** Use base64url without padding (`A–Z a–z 0–9 - _`), as the book's strings do. Convert `-` and `_` before `atob`.
7. **Label row.** "Written by: Claude draft" reads oddly. Use "Label".
8. **Placeholders.** Replace the fiction-shaped placeholder lines and strings with neutral filler, or with the real chapters (rule 11).

## Phase 1 — private preview for a cold reader

0. **Ask Jamie first:** does the preview live at the site root (hidden from search engines but open to anyone with the address) or at an unlisted path, with the root kept as the holding page?
1. Content collection and schema. Import ch1–ch3 from text Jamie supplies.
2. Prose template; chunk template; `typed-string`; `raw-toggle`; the plain switch; reduced-motion handling.
3. Verify drawer: signature string (placeholder until Phase 3), authorship label, versions, process note.
4. An unlisted preview path, `noindex`, and `robots.txt` disallow.
5. `scripts/check-unreleased.ts`: build with a dummy future chapter and fail if any of its text appears in `dist/`.
6. **Done when:** ch1–ch3 read cleanly on a phone and a laptop; keyboard-only and screen-reader passes work; reduced motion shows no animation; the unreleased check passes.

## Later phases — don't start without Jamie

- **Phase 2, audio:** a script that turns chapter text into a spoken script (from the pronunciation table), takes recorded or generated audio, aligns words (WhisperX or a hosted aligner), and writes `mp3` plus a timings JSON. `read-along` decodes words in step with playback, or highlights them under reduced motion.
- **Phase 3, public:**
  - `scripts/sign.ts` makes an Ed25519 key locally. The private key never enters the repo; Jamie keeps it in his password manager.
  - Sign `{ sha256(text), authorship, version, date }`. Signature is 64 bytes, shown as `__S` plus 86 base64url characters.
  - The drawer verifies with `crypto.subtle.verify("Ed25519", …)` and says so plainly if the browser can't.
  - Also: RSS feed, RSS-to-email, version history.
- **Phase 4, the board:** optional terminal (`decode`, `raw`, `verify`, search over released chunks); podcast feed with AI-audio disclosure in the audio and the metadata.

## Working with Jamie

- Show the result (a screenshot or a local preview) before deploying.
- Small changes, one at a time. Say what changed in a sentence.
- When a choice touches the book (what a reader sees, hears or can find), ask; don't decide.
