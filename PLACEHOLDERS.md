# Placeholders

The chapters in `src/content/chapters/` are scaffolding, not canon. They exist
so the site could be built and read through before the real chapters arrive.

Per rule 11 of the build contract, placeholder text is **plainly neutral
filler**. It invents no lines, handles, strings, verbs or dates in the book's
style, because fiction-shaped placeholders drift into canon.

| File | Stands in for |
|---|---|
| `01.md` | A prose chapter. Long enough to need scrolling. |
| `02.md` | A prose chapter with two versions, so verify has a history to show. |
| `03.md` | A chunk chapter: four filler lines in the column layout. |
| `04.md` | Not a chapter. Marked `draft` as a canary for the leak test. |

Each is marked `placeholder: true`, and the chapter page prints a visible note
saying the text is not the book. Delete the flag when real text lands and the
note goes away.

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

## Still to come from Jamie

- The real ch1–ch3, with the frontmatter in the build contract.
- A decision on whether the preview sits at the site root or an unlisted path.
