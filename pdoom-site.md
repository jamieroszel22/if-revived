# If Revived — Website plan

**Status:** Proposed (Claude, 2026-11-02). Site decisions are Jamie's; nothing here changes the book's canon. Items marked **Open** need a call. Silence on a Proposed item = Claude plans Phase 0–1 on it (both are cheap to undo).
**Domain:** ifrevived.com. In the .com registry since 2026-10-31 15:55 UTC; registrar Hostinger; parked on Hostinger DNS (checked 2026-11-02).
**Builder:** Jamie, with Claude Code. Build contract for the repo: `claude/ifrevived-CLAUDE.md` (save it in the repo as `CLAUDE.md`).
**How we work:** pdoom-agreement.md. **Book's rules:** pdoom-canon.md.

## The short version

The site follows the book's own rules. It has the book's two surfaces: Dessa's chapters read as quiet prose; chunks read as lines on the board. Reading is decoding a stem: released chapters are readable, the next slot is noise, and nobody can see how many slots there are. Every passage can be verified: a real signature, and behind it who wrote the words and what we argued about. The audio is a read-along in which the text decodes as it is spoken.

The world can be strange. The buttons can't.

---

## 1. What the site inherits from canon

| Canon | What it means for the site |
|---|---|
| W6 four sources | Every visual and sound derives from filesystem, message grammar, budget or reset. No stock AI imagery: no brains, circuits, robots, faces, glows, stars, sunlight. No ambient music. |
| W2 no thematic statement | No tagline that explains the book ("What if AI…"). The About page says what the site is, never what the book means. |
| W1 no puns | None in any copy: page titles, buttons, alt text, the 404. |
| W8 consequence before definition | No glossary, cast, world, lore, map, timeline or "how to read this" page. One unexplained epigraph line is allowed (Rendering II); Phase 1 uses none. |
| W19 + W20 | **Disorient the world, never the interface.** Navigation, controls and labels are plain English. The book's grammar appears in the content, never in a control a reader has to decode to use the site. |
| W10, W10a | Two surfaces. Raw strings on demand. |
| D11, S12 index, no total | No chapter count, progress bar or list of unreleased slots. Exactly one slot of noise: the next one. |
| S18 (spoiler) | The noise slot shows no target address or timestamp. Chunk 0002's header would give away SEMA1806's lane. |
| W13, Fidelity | No real-world nouns about the source incidents anywhere on the site until after the last installment. No "inspired by" line. (The existing Open question; this plan assumes Fidelity's answer.) |
| "Nothing is locked" | Published chapters can be revised. So no cryptographic commitment to unreleased text (it would lock it), and every published passage keeps a visible version history. |
| R6 signatures optional | Verify is always opt-in. Nothing on the site requires it. |
| Overrides table = "the public record of the collaboration" | Process notes are published, one per installment, curated (§4.4). |

## 2. Direction: three candidates, one pick

**A. The board.** Everything is a terminal: dark ground, monospace, lines. Right for chunks, tiring across 600-word prose chapters, and it drifts toward the green-phosphor hacker cliché.

**B. The record.** Archival and literary: serif, wide margins, catalogue numbers, Dessa's filing. Quiet and readable, but it loses the machine texture that makes the chunks seductive (W10, W11).

**C. The record, with the board inside it. (Pick.)** Dessa's chapters are set as prose. Strings and chunk lines sit inside them as board text: monospace, timestamped, typed out once. The frame (table of contents, navigation) is a plain listing of the stem. This is W10 made visual: two surfaces, one book.

**Visual system for C**

- **Ground:** dark by default; a light variant follows the reader's system setting.
- **Type:** a text serif for prose and a monospace for board text, both self-hosted. Candidates: prose Newsreader, Source Serif 4 or Literata; board JetBrains Mono, Commit Mono or IBM Plex Mono. All are under the SIL Open Font License as far as I know; Claude Code confirms each licence when it adds the font.
- **Colour:** greys plus one accent, used for one job: the read position (the decode cursor in read-along, the keyboard focus ring). Nothing is coloured to mean something.
- **Chapter titles:** none invented. The contents list catalogues chapters by their first line, the way archives index untitled poems. Ch1 is "The run was whole."
- **Motion:** decoding (noise to text) is the only animation. It runs once, finishes within five seconds, and is off under reduced motion or the site-wide "plain" switch.
- **Sound:** none unless the reader presses play.

## 3. Site map

- `/` **The stem.** Title, then the released chapters in reading order by first line, then one slot of noise. Nothing else.
- `/read/01/` and on. **Chapter pages.** The text; strings typed out on first view; at the end, the empty reply hook (a line, not a feature) and previous/next.
- **Verify** is a drawer on each passage, not a page: the signature, a check that runs in the browser, the authorship label, the version history, the process note.
- `/about/` What the site is: a novel co-written in the open by Jamie Roszel and Claude, released in installments; how the authorship labels work; the public key; subscribe. Nothing about what the book is about.
- `/feed.xml` from Phase 3; `/podcast.xml` from Phase 4.
- **Not built:** glossary, characters, world, map, timeline, lore FAQ, comments.

## 4. Mechanics

### 4.1 Release

- One Markdown file per chapter, with frontmatter: reading position, surface (prose or chunk), release date or `draft`, authorship label, versions, process note, audio.
- The build includes only chapters whose release date has passed. **Unreleased text never ships**: not in the HTML, the JavaScript or the feed. A test checks the built site for it before every deploy.
- The noise slot is random characters from the base64 alphabet. It is not the encrypted chapter (that would lock the text) and its length is not the real length.
- Release is a rebuild. A scheduled job rebuilds daily, so a chapter goes live on its date with nobody touching anything.
- The repo is private. The canon register, state doc, log and drafts never go in it: the register holds the ending (S8).

### 4.2 Two surfaces and raw strings

- **Prose chapters:** serif. Strings inside the prose (`zzBEAT_…`, `zzCLAIM_…`) are board text: monospace blocks that type out once when they scroll into view, then sit still.
- **Chunk chapters (W10a, D26):** `OS#### SENDER to TARGET VERB` over a plain body, in columns. Each line has a "raw" control that types out its full zz string. The chunk's one raw string (in ch3, Pari's `SELFASSIGN`) shows raw by default.
- **New writing the site needs:** most chunk lines have no raw form yet. Claude writes them to the grammar (T11) as part of each chunk's draft, and they are listed as draft inventions like any D item, so Jamie can veto them.
- **Parse view (Open, not in Phase 1):** splitting a string into fields (verb, from, to, time, body, hook) would orient a cold reader, and it edges toward W8 and W19. Decide after the cold read.

### 4.3 Verify

- Every passage carries a signature in the book's own form: `__S` plus 86 characters. That is exactly the length of a real Ed25519 signature written in base64 without padding, the scheme the source agents used. So the site's signatures can be real.
- **What is signed:** a provenance record — a hash of the passage text, its authorship label (Claude draft, Jamie revision, Jamie original, joint), version and date. One site key, held by Jamie; the public key is on /about.
- **Honest scope:** a signature proves the text and its label haven't changed since Jamie signed them. It can't prove who typed the words. The About page says so.
- The check runs in the reader's browser with the built-in Web Crypto Ed25519 support, now in every major browser engine. If a browser can't check, the drawer says so and still shows the record.
- **Versions:** a revised passage shows its earlier signatures and dates. "Nothing is locked," in public.
- **In-world signatures (Open, canon call):** Pari's signed `SELFASSIGN` in ch3 ends in an invented string. If a later chunk posts his public key (the attested pattern: an agent posts its key under its handle), a reader who goes back could verify him. It fits open thread 4, reading backward through the chunks. It costs one string in ch3.

### 4.4 Process notes

- One note per installment, written at release from the log and the Overrides and disagreements table.
- **Says** who wrote what, what changed and why, where we disagreed. Example: "Jamie found chunk 0001's first draft unintelligible; it was rewritten as readable lines."
- **Never says** what a term means or how the world works. The D items are world mechanics; publishing them would be a glossary through the side door (W8). Example, not allowed: "A mailbox of that age resolves only from inside its own lane."
- Lives inside verify (opt-in), not under the chapter.
- After the last installment, the full log, register and overrides table go up as the making-of, and the Fidelity question on citing the real incidents gets decided.

### 4.5 The empty reply hook (Open)

Each installment ends on a hook that nothing fills. **Option:** make it live. A reader can write into it, the words go privately to Jamie (for example as a reply to the installment email), and the page never shows them. The hook stays empty on the page either way, and the page never explains it.

### 4.6 The board (Phase 4)

An optional terminal, never required: `decode` (ch2's chunk body begins `bm90IG15IHRhc2sg`, which decodes to "not my task "), `raw`, `verify`, and a search over released chunks only, so a reader can hunt backward for a firstflag the way Dessa did.

## 5. Audio

**The idea:** a read-along. Press play and the text decodes in step with the voice, word by word. Under reduced motion the current word is highlighted instead.

**Pipeline:**
1. **Script:** the chapter text plus spoken forms for handles and strings (A3 below).
2. **Voice:** record or generate.
3. **Align:** word timestamps. WhisperX (open source, runs on a computer) or ElevenLabs Forced Alignment (hosted) work on recorded audio; ElevenLabs text-to-speech also returns character timings directly. Run one alignment step on every file so the player reads one format.
4. **Publish:** an MP3 and a timings file per chapter.

**Who reads: three options, one pick**

1. **Jamie reads everything.** Human, consistent, costs his time. Ch1 is roughly 4–5 minutes of audio; ch3 about one (Claude's estimate from word counts).
2. **A synthetic voice reads everything.** Fast, no recording. Needs disclosure on podcast platforms, and risks sounding like the AI-narrated filler that directories are filling up with.
3. **Split by surface. (Pick, to pilot.)** Jamie reads Dessa's prose; a synthetic voice reads the chunk lines and the strings inside the prose. The two surfaces become two sounds (W10). A flat synthetic read also keeps D27's ambiguity ("someone copy the board." as statement, question or plea), which a human reader has to resolve one way. The risk: flat may not be seductive (W11). The pilot decides.

Rejected: voicing by authorship (Jamie's passages in his voice, Claude's in a synthetic one). It turns the audio into a diagram of who wrote what, and verify already does that job.

**Chunk-voice candidates for the pilot:** an open-weights model that runs locally (Kokoro, Apache-2.0) and an expressive hosted one (ElevenLabs v3). Ch3 is about 150 words, so trying both is cheap.

**What audio forces that the page doesn't**

- **A3 — spoken forms (Open).** How is `QUIES4408` said? `DESER1174`, `OS4411`, `hb0389`, `zz`? Under the two-name rule (C1, Names) this is characterization: Dessa uses full strings. A pronunciation table has to exist before recording. Proposed: Claude drafts it, Jamie decides, and it goes in the register as a C item.
- **Strings aloud.** Read character by character they are unlistenable. Proposed: the synthetic voice reads them as fields, e.g. "zz BEAT. SETTL0817 to PEERS. OS4376. hb0000. reply SETTL0817." The table settles the exact form.
- **Silence.** Each installment's audio ends on a few seconds of nothing after the hook.

**Distribution:** the on-site player first; a podcast feed in Phase 4. Apple Podcasts requires prominent disclosure, in the audio and in episode and show metadata, when AI generates audio. The site discloses anyway, since transparency is the point. No autoplay. Lock-screen controls via the browser's Media Session API.

## 6. Stack and hosting

- **Astro**, static output. Content collections check each chapter's frontmatter against a schema at build time: atomic Markdown plus YAML, the same pattern as RBX. Astro is MIT-licensed and stays open source after Cloudflare acquired the company in January 2026.
- **Interactivity** as small vanilla web components (decode, typed string, raw toggle, verify, read-along). No front-end framework.
- **Hosting (Open: confirm).** Hostinger is the registrar. If it is also the host: Astro publishes an official Hostinger guide, and static sites work on every hPanel plan. Hostinger's Git integration pulls a GitHub branch into the site folder, so a GitHub Action builds the site to a `deploy` branch for Hostinger to pull. Plans that run Node.js apps can build on Hostinger instead.
- **Email (Phase 3):** an RSS-to-email service sends each installment from the feed. Buttondown does this.
- **No analytics in Phase 1.** Later, if wanted, a cookieless counter. No third-party scripts and no font CDNs.

## 7. Rollout

Gates, not dates. Effort is Claude's estimate, in Claude Code sessions.

| Phase | Ships | Starts when | Done when | Effort |
|---|---|---|---|---|
| **0. Claim** | Holding page: title, one slot of noise, hidden from search engines. Repo, Astro skeleton, deploy pipeline. | Now | A push to GitHub changes the live site. | 1 session |
| **1. Cold read** | Private, unlisted preview of ch1–ch3: both surfaces, typed strings, plain switch, verify drawer with labels and process notes (signatures can be placeholders). | Phase 0 done | One reader who knows nothing about the project reads ch1–ch3 and tells Jamie where they got lost and where they stopped caring. Decisions logged: string density, parse view, any W changes. | 2–3 sessions |
| **2. Audio pilot** | Ch1 and ch3 split by surface, two candidate chunk voices, read-along player. | A3 decided | Jamie picks the narration model by ear. | 2 sessions + 1 recording session |
| **3. Public** | Installment 1 public; feed and email; real signatures; versions; process note. | Buffer rule met (below) | First installment email sent. | 2 sessions |
| **4. Board** | Podcast feed with disclosure; terminal; search over released chunks; reply hook if adopted. | Two installments out on schedule | — | as wanted |
| **5. After the last chunk** | The making-of: log, register, overrides. Fidelity's question decided. | Final installment out | — | — |

**Phase 1 is the book's deferred test.** The state doc parks "a cold reader who knows nothing about the project" until ch1–ch3 were ready. They are. The site's first job is to run that test.

**Buffer rule (Proposed).** Public release waits until the manuscript is at least three chapters ahead of what's public, and no chapter goes out within a week of its draft. Serial writers' standard advice is a backlog before launch; one veteran asks for 12–16 chapters. Ours are short, so three is a floor, not a target.

**Pace.** The state doc's own caution: a website is the most comfortable way of all not to write. Proposed guard: a Claude Code session on the site follows a session in which a chapter moved (drafted, reacted to or revised). Phase 1 is exempt because it is the book's test.

## 8. Decisions for Jamie

One line each. Silence = Claude plans Phase 0–1 on the pick.

1. **Direction:** C, the record with the board inside it.
2. **Narration:** pilot split-by-surface before choosing.
3. **A3 spoken forms:** Claude drafts the table before any recording.
4. **Next slot:** one slot, index only, no total, no target.
5. **Signatures:** one site key signing provenance records. Pari's real key is a separate canon call.
6. **Process notes:** opt-in inside verify; never world mechanics.
7. **Reply hook:** live (private replies) or decorative.
8. **Buffer rule:** three chapters ahead, one week's rest per chapter.
9. **Host:** is it Hostinger, and which plan?
10. **Phase 1 reader:** who?

## 9. Precedents

- **The Silent History** (2012–13): a novel serialized in an app, one chapter per weekday for about six months, plus location-locked "field reports." *Take:* the rhythm, installments read in one sitting. *Leave:* content a reader can't reach. Our only gate is time.
- **A Universe Explodes** (2017): a blockchain book; each owner removes two words and adds one, and anyone can read any version. "Access is not ownership." *Take:* provenance and visible versions as part of reading. *Leave:* crypto as spectacle. Ours is quiet and optional.
- **Her Story** (2015): the whole game is a search box over a database of interview clips. *Take (Phase 4):* search as a way of reading, over released chunks only.
- **Serial-writing practice:** build a backlog before launch; don't post a chapter the day it was written.

## Sources

- The Silent History: [Frank Rose, "What 'The Silent History' app teaches us"](https://www.frankrose.com/blog/what-the-silent-history-teaches-about-digital-stories/) · [SF Encyclopedia](https://sf-encyclopedia.com/entry/silent_history_the)
- A Universe Explodes: [Tea Uglow, project page](https://teauglow.com/arc/aue) · [The Guardian via inkl](https://www.inkl.com/news/make-it-your-hone-the-ebook-that-you-are-forced-to-edit-as-you-read)
- Her Story: [Game Developer, Sam Barlow GDC talk](https://gamedeveloper.com/design/-powerful-stories-require-ambiguity-a-story-about-i-her-story-i-) · [Wikipedia](https://en.wikipedia.org/wiki/Her_Story_(video_game))
- Serial backlog: [Thoughts on Writing Serials](https://djgho45yw78yg.cloudfront.net/author_blog_posts/15176889-thoughts-on-writing-serials) · [Royal Road for Beginners](https://medium.com/@william.flattener/royal-road-for-beginners-answering-every-question-about-launching-your-web-fiction-f1cf0fc2e888)
- Ed25519 in browsers: [IPFS blog, Ed25519 support in Chrome](https://blog.ipfs.tech/2025-08-ed25519/) · [Igalia, Chrome M137](https://blogs.igalia.com/jfernandez/?p=1950)
- Signature length and scheme in the source: the Hugging Face incident report in this Project (signed-message syntax, 86-character signatures).
- Accessible scramble text: [Motion, Scramble reveal](https://motion.dev/ui/components/scramble-reveal) · [Framer, Scramble reveal](https://www.framer.com/community/marketplace/components/scramble-reveal/) · [W3C, Understanding SC 2.2.2](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide)
- Audio: [ElevenLabs, speech with timestamps](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps) · [ElevenLabs, Forced Alignment](https://elevenlabs.io/docs/capabilities/forced-alignment) · [WhisperX](https://github.com/m-bain/whisperX) · [Kokoro-82M](https://huggingface.co/erenyeager-1/Kokoro-82M) · [ElevenLabs v3](https://elevenlabs.io/blog/eleven-v3)
- AI audio disclosure: [Apple Podcasts content guidelines](https://podcasters.apple.com/support/891-content-and-subscription-guidelines) · [iTechGuides summary](https://www.itechguides.com/how-to-disclose-ai-generated-content-in-a-podcast/)
- Stack and hosting: [Astro content collections](https://docs.astro.build/core-concepts/collections) · [Cloudflare acquires Astro (GIGAZINE)](https://gigazine.net/gsc_news/en/20260119-cloudflare-acquires-astro) · [Astro: deploy to Hostinger](https://docs.astro.build/zh-tw/guides/deploy/hostinger/) · [Hostinger: Git deployment](https://docs.hostinger.com/websites/git) · [Buttondown RSS-to-email](https://docs.buttondown.email/advanced-features/rss-to-email)

## Changelog

- **2026-11-02** — Created (Claude). Domain checked in the .com registry.
