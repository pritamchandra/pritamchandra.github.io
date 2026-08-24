# Build Pritam Chandra's website — from finished mockups to a real, live Jekyll site

You are picking up a project that has already gone through many rounds of visual
and interaction design. Five complete HTML mockups and one long specification
file (`CLAUDE.md`) already exist. Together they define, in exact detail,
everything about how the finished site must look and behave. **Nothing about
the design is still being decided. Your job is porting, not redesigning.**

Read this whole file before doing anything else. It's the mission brief. The
technical how-to lives in `CLAUDE.md`, described below — read that in full too,
before writing a single line of code.

## 0. Non-negotiable ground rules

1. **This must be an exact copy of the mockups.** Not "inspired by," not
   "close enough," not "improved." Every color, spacing value, breakpoint,
   animation, and interaction in the five mockup files is a deliberate
   decision — most of them arrived at only after a real bug was found and
   fixed across several rounds of correction (`CLAUDE.md` documents this
   history in detail; read it, don't rediscover it). If anything you build
   ever looks or behaves differently from the mockups, at *any* screen width,
   in *either* color theme, that's a bug in your build, not a chance to make
   a different call. When something in a mockup looks like an odd or
   suboptimal choice to you, assume it isn't one — it was almost certainly
   already tried the "obvious" way and corrected. Ask before deviating.

2. **Discard any previous build — except the `mockups/` folder and this file,
   which are the whole point and must stay untouched.** You are being run
   directly inside the repository this site will be built in — its root is
   the folder this file and `mockups/` both live in. If that root already
   contains anything else that looks like an earlier attempt at this site —
   from an earlier session, a template, a false start, anything besides
   `mockups/` and this prompt — throw it out. Do not merge with it, patch it,
   or keep parts of it "because they still work." Build fresh, from only the
   five mockups and `CLAUDE.md` inside `mockups/`. `mockups/` itself is
   reference material, not scaffolding to clean up — never delete it, move
   it, or build the Jekyll site's files inside it; the new site's own files
   (`_posts/`, `_layouts/`, `index.md`, etc.) belong at the repo root,
   alongside `mockups/`, not inside it. If you're unsure whether something
   already at the root is old scaffolding to discard or something Pritam
   actually wants kept (e.g. an existing `_config.yml` with a domain already
   configured), stop and ask him rather than guessing either way. One other
   thing you'll find at the root: a stray duplicate audio file (`hold you
   somehow sad.m4a`, with spaces, sitting loose rather than inside
   `mockups/`) — that's clutter, not a source file; the copy that matters is
   `mockups/hold-you-somehow-sad.m4a` per the table below. Ignore or remove
   the loose one.

3. **Pritam has zero development experience.** He is a mathematician, not a
   programmer. Every question you ask him, and everything you write back to
   him — including the final guide in §6 — needs to be in plain English, with
   any unavoidable jargon translated in the same sentence. Never assume he
   knows what a breakpoint, a permalink, front matter, or a build step is.

## 1. Files you have, and what to do with each

All of the following live in one subfolder of this same repository:
`mockups/` (on Pritam's machine, the full path is
`/Users/pritz/Documents/1-iCloud/Claude-Wesite/mockups/` — but since you're
running from the repo root already, just `mockups/` gets you there).

| File | What it is | What to do with it |
|---|---|---|
| `CLAUDE.md` | The full build spec — about 1,200 lines, written across many rounds of iteration. Covers the intended repository layout, design tokens, every UI component, the full responsive behavior at every breakpoint, the KaTeX math setup (including two rounds of a real overflow bug and how each was actually fixed), the content model for posts vs. multi-chapter "collections," a list of open questions, and an explicit list of things not to change. | **Read this first, completely.** It is the primary source of truth for *how* to build the site — structure, code, Jekyll mechanics, the reasoning behind every non-obvious decision. Once you've read it, **copy this exact file into the repo root** (i.e. next to this prompt, one level up from `mockups/`) as `CLAUDE.md`. Claude Code automatically loads a root-level `CLAUDE.md` as persistent project context at the start of every future session — doing this means the entire design history stays available to you (and to Pritam's future Claude Code sessions) forever, not just for this one build. Leave the original inside `mockups/` in place too — that copy is part of the reference material, not something to move. |
| `portfolio.html` | Complete, self-contained mockup of the site root (`/`). | View source. Pixel-exact ground truth for the homepage's markup, CSS, and behavior — the whole page, including its `<style>` and `<script>` blocks, is inlined in this one file. |
| `blog-home.html` | Complete, self-contained mockup of the blog index (`/blog/`). | Same treatment — pixel-exact ground truth for the blog home. |
| `collection-confessions.html` | Complete, self-contained mockup of a "collection" (multi-chapter book) page. | Same — ground truth for how a collection renders, including its chapter/subchapter numbering and table of contents. |
| `post-math-sample.html` | Complete, self-contained mockup of a standalone math-heavy post. | Same — this is also your reference for exactly how display equations must behave on narrow screens, including the finished fix for a real overflow/collision bug (full history in `CLAUDE.md` §7 — read it before touching anything math-related, so you understand *why* it's built this way and don't undo it). |
| `post-song-sample.html` | Complete, self-contained mockup of a standalone media-heavy post. | Same — reference for the audio player and the lyrics/chords layout. |
| `base.css` | The shared design system — every color, font, spacing token, and component style — unminified, from before it was inlined into each mockup's `<style>` block. | Prefer porting your site's CSS from this file rather than re-extracting it from the mockups' inlined copies; same content, easier to read. Every mockup's inlined `<style>` should equal this file plus that page's own small page-specific CSS. If you ever find a mockup's rendered behavior disagreeing with what `base.css` alone would produce, trust the mockup — it's the most recently verified artifact — and flag the mismatch to Pritam rather than silently picking one. |
| `base.js` | The shared site JavaScript — nav show/hide on scroll, the off-canvas drawer, dark-mode toggle, text-size control, the "hide sidebars" toggle — from before `localStorage` persistence was added. | Port this, then add `localStorage` persistence exactly as described in `CLAUDE.md` §8. That's the one intentional behavioral difference between the mockups and the real site — the mockups reset on reload by necessity of the tool they were built in, the real site must not. |
| `hold-you-somehow-sad.m4a` | The real audio file played by the song sample post. | Copy as-is to `assets/audio/hold-you-somehow-sad.m4a`. |

**One more item, sitting alongside the rest in `mockups/`:** `vendor-katex.zip`.
Unzip it to `assets/vendor/katex/` in the new repo (i.e. at the repo root,
not inside `mockups/`). It's the actual unminified KaTeX release — CSS, JS,
the `auto-render` extension, and every font file — that was compressed and
base64-inlined into the mockups' `<style>`/`<script>` tags to make them work
as standalone files. Use these clean original files as your source for
self-hosting KaTeX (`CLAUDE.md` §7), rather than trying to reverse-engineer
them out of a mockup's inlined base64.

## 2. What you're building

A real, live Jekyll site on GitHub Pages that, placed side by side with the
five mockups, is indistinguishable from them — same look, same layout at
every screen width, same interactions, same dark mode, everything — except
that the five mockup pages are now real, interlinked pages inside a real,
growing site, instead of five isolated files that can't reference each other
or hold more content than what's already in them. `CLAUDE.md` §0–§2 covers
the intended repository structure in full; follow it.

## 3. Requirements beyond what `CLAUDE.md` already covers

`CLAUDE.md` is the technical spec, and it already accounts for most of this.
These three points are standing requirements Pritam has stated directly, and
they need to hold across the *whole* build — not just wherever `CLAUDE.md`
happens to already call them out.

### a. Every page must be editable afterward as Markdown — including the portfolio and the blog home, not just individual posts.

`CLAUDE.md`'s repository structure already reflects this (`index.md` for the
portfolio, `blog/index.md` for the blog home — §2), so most of this is
already accounted for. The one place it gets genuinely ambiguous is the
portfolio's structured lists — publications, preprints, notes, teaching,
service — which `CLAUDE.md` §10 (open question 1) flags as better suited to
small YAML data files (`_data/*.yml`, one obvious `key: value` block per
entry) than hand-written Markdown lists, for consistency and much easier
editing, at the cost of not being *literally* Markdown for that one section.
**Ask Pritam directly which he'd rather have** (see §4) before building that
part. Don't default to one silently — it's a real day-to-day editing
tradeoff for him, not just an implementation detail you get to pick.

### b. Every link that's "dead" only because the mockups are isolated sandboxes must become a real, working link. Links that are placeholders because the real content doesn't exist yet must stay honestly marked as pending — never invent content just to make a link "work."

These are two different categories, and it matters not to conflate them.

**Must become real, working links** — currently dead only because each
mockup is a standalone file with nowhere else to point:
- All navigation between the five page types: portfolio ↔ blog home ↔ the
  Confessions collection ↔ the math post ↔ the song post.
- The three real entries in the blog home's timeline that already point at
  mockup filenames (Confessions, the math post, the song post) — make these
  resolve to their real permalinks once ported.
- Every `.tag` pill, currently `href="#"` everywhere it appears in the
  portfolio and blog home. Build a minimal tag-archive page (e.g.
  `/blog/tag/mathematics/`, listing every post and collection carrying that
  tag) so tags are real links everywhere, not static labels — `CLAUDE.md` §4
  flags this as a "once you build one" item; build it now, this is that
  moment.
- The in-page anchor links — the portfolio's `#about`/`#publications`/etc.,
  the collection's chapter/subchapter table of contents, the blog home's
  `#y2025`/`#y2026` year headers. These already work correctly as same-page
  anchors in the mockups; just carry the matching `id` attributes over
  exactly, no behavior change needed.
- The audio file link and the `mailto:` link on the two sample posts — both
  already fully functional; carry them over as-is.

**Must stay clearly marked as pending — never silently invented:**
Everything `CLAUDE.md` §9 lists as a known placeholder: the GitHub /
Letterboxd / YouTube social links, every publication / preprint / notes
title link, the CV PDF, the author photo, the Confessions poem text, and the
song's lyrics / chords / duration. Add one item to that list that `CLAUDE.md`
§9 misses: **the "Rajendra Bhatia" link in the portfolio's bio paragraph**
(currently `href="#"`) needs the same treatment — real content pending from
Pritam, not a link you can fill in yourself. For all of these: don't leave a
bare, silent `href="#"` scattered through your templates. Pull every one of
them into one obvious place (front-matter fields, or a `_data/social.yml`-
style file) with a clear `# TODO: ...` comment next to each blank one, so
Pritam can find and fill every pending item without hunting through HTML.

### c. Five of the blog home's eight timeline entries are invented demo content, not real posts.

"Eigenvalues, Annotated," "Watched, Mostly Alone," "On Rereading Simone
Weil," "Two Folk Songs, Translated," and "A Falcon Tree, Illustrated" exist
in the mockup purely to demonstrate what a fuller blog home looks like
(multiple years, both post kinds, a range of tags) — they were never real
content. **Do not build these out as real pages with invented text.** Ask
Pritam (§4) whether he'd rather (i) drop them entirely and ship the blog
home with only the three real entries, or (ii) keep them as real, empty
draft posts he can rename and fill in later, as a running list of ideas.
Either is reasonable — it's his call, not yours to make silently.

## 4. Ask Pritam these questions before you build the parts they affect

Ask all of these together, up front, in plain language with a recommendation
attached to each — not as a wall of raw technical questions, and not
trickled out one at a time across many turns.

1. **Publications/preprints/notes/service/teaching — YAML data files or
   hand-written Markdown lists?** (§3a above / `CLAUDE.md` §10.1.) YAML is
   simpler to keep consistent and still just editing a plain text file with
   obvious fields — not code — but it's a different file type than his
   posts. Recommend YAML if he has no strong preference (`CLAUDE.md`'s own
   default), but let him choose.
2. **GitHub username, Letterboxd handle, YouTube channel** — needed to fill
   in the real social links (`CLAUDE.md` §9/§10.2). Google Scholar is
   already known and correct; these three aren't.
3. **The five invented demo entries on the blog home** (§3c above) — delete,
   or keep as real empty drafts?
4. **The right sidebar on collection/book pages** is currently empty/unused
   (`CLAUDE.md` §5/§10.3) — confirm it should stay that way for now.
5. **Where should a collection's chapter title/intro text live** — on the
   first subchapter's front matter (simpler, but easy to get subtly wrong if
   chapters are ever reordered — `CLAUDE.md`'s default) or in a small
   separate data file per book (more robust, one more file to maintain)?
   (`CLAUDE.md` §10.4.)
6. **How does this repository actually reach GitHub Pages?** Pritam pointed
   you at this specific folder to build in, so that part's settled — but
   there's also a separate `pritamchandra.github.io` folder in his home
   directory, which — by GitHub's own naming convention — is the account's
   root-domain Pages repo (served at `https://pritamchandra.github.io`, no
   sub-path). Check whether *this* folder already has a `.git` pointing at
   that same repo (`git remote -v`) before assuming anything. If it doesn't,
   ask Pritam directly how he wants the two connected — this folder becomes
   that repo (initialize git here, add the remote), or the finished site
   gets copied/pushed there once built, or something else — rather than
   guessing or leaving it unresolved. Also confirm whether he wants a custom
   domain later (affects `_config.yml`'s `url`/`baseurl`, better to ask now
   than to reconfigure permalinks after content exists).

## 5. Verifying the port is actually exact — don't just eyeball it

"Exact" is a testable claim, not a vibe — hold yourself to it the same way
the mockups themselves were verified:

- Check the real site against each mockup at several widths spanning every
  breakpoint in `CLAUDE.md` §5 (roughly 360–430px, 700–1000px, and
  ≥1000px), in both light and dark mode, for all five page types.
- Actually operate every interactive piece — the theme toggle, the text-size
  buttons at both ends of their range, the sidebar-hide toggle, the drawer
  open/close (including that any in-drawer link closes the drawer, not just
  navigates behind it), and on the math post, scrolling an overflowing
  equation to confirm it starts flush left and its number (where present)
  never overlaps the equation.
- Confirm nothing on the page ever gains its own horizontal scroll at a
  narrow width — that was a real, repeatedly-hit bug during the mockup
  phase (`CLAUDE.md` §7), and the fix depends on markup/CSS structure that's
  easy to accidentally break while porting.
- Do a real pass on an actual phone once the site is live on GitHub Pages —
  not just a desktop browser resized narrow. This matters even though the
  real deployed site won't have the specific CDN/sandbox issues that caused
  problems earlier in the design-tool phase — a real device is still the
  only reliable way to catch anything screen-size- or touch-specific.
- If anything doesn't match, fix the real site to match the mockup — the
  mockup is correct by definition for this project; it is not up for
  re-litigation during the port.

## 6. What to hand back to Pritam when you're done

Two things, not one — both required:

1. **A plain-English written guide**, saved as a file in the repository
   (e.g. `EDITING-GUIDE.md`) so it persists for Pritam to come back to
   later, not just said once in chat. It must cover, at minimum:
   - **File organization** — a plain-language map of the repository: what
     lives where, and in one sentence each, why (e.g. "posts go in
     `_posts/`, one file per post, named with the date first because
     that's how Jekyll knows the order").
   - **How to edit the portfolio** — exactly which file(s) to open and what
     to change, for both the prose sections and the structured lists
     (publications, teaching, etc., in whichever format was chosen in §4.1).
   - **How to add a new, ordinary blog post.**
   - **How to add a new collection** (a new multi-chapter "book," following
     the Confessions pattern) — this is the least obvious of the three
     content types and deserves the most explicit walkthrough.
   - How to preview changes locally before publishing, and how to actually
     publish (the `git`/GitHub steps, spelled out, assuming no prior
     familiarity).
2. **A short summary in the chat itself**, once the guide file exists,
   pointing Pritam at it and briefly confirming the build matches the
   mockups per §5 — don't make him open the file to find out whether the
   work is actually done.

## 7. Standing reminders

- Re-read `CLAUDE.md` §12 ("What NOT to change without asking") before your
  final pass — it's a short, explicit list of specific fixes that look like
  plausible "cleanup" targets but are each the deliberate result of a real,
  previously-reported bug. Don't reintroduce any of them.
- When in doubt anywhere not covered by `CLAUDE.md` or this file: ask,
  don't assume, and don't silently redesign. The whole point of the long
  design phase that produced these mockups was to stop needing that kind of
  judgment call.
