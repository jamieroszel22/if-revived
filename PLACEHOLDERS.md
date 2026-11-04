# Placeholders and invented strings

Everything on this list is scaffolding, not canon. It exists so the site could
be built and read through before the real chapters are in the repo. All of it
is for veto.

Chapters carrying placeholder text are marked `placeholder: true` in their
frontmatter, and the chapter page prints a visible note saying the text is not
the book. Remove the flag when real text lands and the note goes away.

## Placeholder prose

| File | Stands in for |
|---|---|
| `01-the-run-was-whole.md` | ch1. Only its first line, "The run was whole.", is real. |
| `02-a-second-placeholder.md` | ch2. Carries two versions so verify has a history to show. |
| `03-chunk.md` | ch3. Chunk surface, five lines. |
| `04-unreleased.md` | Not a chapter. Marked `draft` as a canary for the leak test. |

## Invented string grammar

The plan gives one spoken form — "zz BEAT. SETTL0817 to PEERS. OS4376. hb0000.
reply SETTL0817" — and two written stems, `zzBEAT_…` and `zzCLAIM_…`. From
those I guessed an underscore-delimited written form:

```
zz<VERB>_<FROM>_<TO>_<OS####>_<hb####>_reply=<HANDLE>
```

**This is a guess.** The real grammar is T11, which is not in this repo. If the
field order, the delimiter, the `reply=` spelling or the `hb` field is wrong,
every raw string in `03-chunk.md` and the board blocks in ch1 and ch2 are
wrong with it. They are in one place each, so correcting them is quick.

## Invented handle

`NOTIF3188`, standing in for Pari in `03-chunk.md`.

The handles the plan names — QUIES4408, DESER1174, SETTL0817, SEMA1806 — all
look like a five-letter truncation plus four digits, so I followed the pattern.
Pari's real handle is a canon call and this one should not survive it.

`SEMA1806` is deliberately absent: the plan flags chunk 0002's header as a
spoiler about its lane.

## Encoded body

`02-a-second-placeholder.md` carries
`bm90IG15IHRhc2sgcGxhY2Vob2xkZXIgdGV4dA==`, which decodes to "not my task
placeholder text". The plan says ch2's chunk body begins `bm90IG15IHRhc2sg`
("not my task "), so the prefix is real and the tail is filler.

## Signatures

None. No key exists yet, so no passage is signed and the verify drawer says
"Not signed yet." rather than showing a fake signature that would fail a check.
`npm run keygen` makes the pair when Jamie wants it.

## Process notes

All four are placeholders and say so. Real ones get written at release from the
log and the overrides table.
