# Placeholders

The chapters in `src/content/chapters/` are scaffolding, not canon. They exist
so the site could be built and read through before the real chapters arrive.

Per rule 11 of the build contract, placeholder text is **plainly neutral
filler**. It invents no lines, handles, strings, verbs or dates in the book's
style, because fiction-shaped placeholders drift into canon.

| File | Status |
|---|---|
| `01.md` | Real: ch1, Claude draft 1 (2026-10-29). |
| `02.md` | Real: ch2, Claude draft 1 (2026-10-29). |
| `03.md` | Real: ch3 (chunk 0001), Claude draft 2 (2026-11-01). Raw forms behind its lines are Proposed (D28 in the book Project) and Jamie's to veto. |
| `04.md` | Not a chapter. Marked `draft` as a canary for the leak test. |

Real chapters carry no `placeholder` flag. A file that still stands in for a
chapter is marked `placeholder: true`, and the chapter page prints a visible
note saying the text is not the book.

## What is deliberately absent

- **No raw `zz` strings.** Raw forms are written and vetoed in the book
  Project, not here. A chunk line without a `raw` simply has no raw control,
  so `03.md` exercises the column layout but not the raw toggle.
- **No handles, verbs or `OS` times.** The chunk lines read `PLACEHOLDER` in
  every column. Nothing on the page can be mistaken for the book's grammar.
- **No signatures.** No key exists yet, so every passage reports "Not signed
  yet." rather than showing a signature that would fail its own check.

An earlier version of these placeholders invented handles, verbs and strings
in the book's style and got the T11 grammar wrong. They have been removed.

## Decided

- The real ch1–ch3 sit at the site root (Jamie, 2026-11-04), hidden from
  search engines but readable by anyone with the address.
