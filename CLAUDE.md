# CLAUDE.md — build instructions for Pritam Chandra's site

This file is written for Claude Code. It is the spec for turning the five HTML
mockups delivered alongside it into a real Jekyll site hosted on GitHub Pages.
Pritam has no development experience, so two things matter more than usual:
(1) nothing here should require him to write HTML or Liquid to add a post —
Markdown (and occasionally a YAML file with obvious `key: value` fields) is
the ceiling of technical complexity he should ever need, and (2) explain
*why*, briefly, wherever a decision isn't obvious, because he'll be reading
this too, not just you.

## 0. What you're building

A personal academic site plus a blog, statically built with **Jekyll**,
hosted on **GitHub Pages**, editable entirely through Markdown files (and a
couple of small YAML data files) after this initial build. No React, no
build step beyond Jekyll itself, no npm required to run the site day to day.

Five mockups are included as the visual and structural ground truth:

| File | Stands in for |
|---|---|
| `portfolio.html` | the site root, `/` |
| `blog-home.html` | the blog index, `/blog/` |
| `collection-confessions.html` | a "collection" (book) page, e.g. `/blog/confessions/` |
| `post-math-sample.html` | a standalone "page" post, math-heavy |
| `post-song-sample.html` | a standalone "page" post, media-heavy |

**Treat the mockups as the source of truth for markup, class names, and
CSS**, not as throwaway references. View source on each; the CSS is all in
one `<style>` block per file and is meant to be lifted close to verbatim
into `assets/css/main.css` (or split into `_sass` partials if you prefer —
functionally identical, your call). Don't redesign from scratch — port.

All five mockups share one design system (`base.css` + `base.js`, in the
delivered files folder, unminified, before they were inlined into each
page — start there, it's the same code repeated in every mockup's
`<style>`/`<script>` tags). Page-specific CSS/markup is layered on top per
page. If you rebuild the CSS from the inlined mockups instead of the
separate `base.css`/page-extra files, that's fine — they're identical, the
separate files were only a build convenience on this end.

## 1. Why Jekyll + GitHub Pages, no plugins, no Actions build

Everything in these mockups — collections, tag/date grouping, the math
rendering — is achievable with **stock Jekyll** (`collections`, Liquid's
`where`/`sort`/`group_by` filters) which GitHub Pages builds natively from a
`git push`, no GitHub Actions workflow required. Math rendering (KaTeX) is
plain client-side JS/CSS, self-hosted (vendored into the repo, see §7) —
not a Jekyll plugin and not a CDN dependency — so it doesn't touch the
GitHub Pages plugin allowlist and doesn't add a third-party network
dependency to every page load either.

**Recommendation: don't set up a GitHub Actions build.** It adds a layer
Pritam would have to debug alone later. Only reach for it if a future
feature genuinely needs a non-whitelisted plugin — cross that bridge then.

## 2. Repository structure

```
/
├── _config.yml
├── index.md                       → portfolio home ("/")
├── resume.pdf                     → linked from the right sidebar
├── assets/
│   ├── css/main.css                (ported from the mockups' <style> blocks,
│   │                                 KaTeX CSS inlined at the top — see §7)
│   ├── js/main.js                  (ported from base.js + localStorage added, see §8;
│   │                                 KaTeX JS + auto-render appended before it, see §7)
│   ├── vendor/katex/                (vendored KaTeX release — fonts, unminified
│   │                                 originals — source for the inlined copies above)
│   ├── img/
│   │   ├── author-photo.jpg        ← placeholder box in portfolio.html marks this slot
│   │   └── fish-hero.svg           (lift the inline <svg> out of blog-home.html —
│   │                                 the small school-of-fish line art, one fish
│   │                                 turned against the current, see §4. It's the
│   │                                 2nd fish from the left that's turned/muted,
│   │                                 not the 3rd — Pritam corrected this once
│   │                                 already, don't swap it back.)
│   └── audio/
│       └── hold-you-somehow-sad.m4a
├── _data/
│   ├── publications.yml            → journal publications (portfolio §"Journal Publications")
│   ├── preprints.yml               → preprints & working papers
│   ├── notes.yml                   → "Select Notes"
│   ├── service.yml                 → academic service
│   ├── teaching.yml                → teaching table
│   └── social.yml                  → Scholar / GitHub / Letterboxd / YouTube
│                                      (email is NOT in this list — it's a
│                                      plain-text line in the page header,
│                                      not a social link; see §4 and §9)
├── _layouts/
│   ├── default.html                (nav + drawer scrim only — NOT the footer, see
│   │                                 the footer.html note below; no external
│   │                                 <head> tags for KaTeX/fonts, everything's
│   │                                 inlined, see §7)
│   ├── home.html                   (portfolio: layout-3col, unified responsive
│   │                                 pattern, see §5; includes footer.html itself,
│   │                                 inside <main>, without the "Jesu Juva" line)
│   ├── blog-home.html              (layout-3col, same unified pattern, plus the
│   │                                 All/Collections/Pages filter, see §4; includes
│   │                                 footer.html inside <main>)
│   ├── book.html                   (layout-2col, chapters concatenated — see §6;
│   │                                 includes footer.html inside <main>)
│   └── post.html                   (no sidebar — used by both math and media posts;
│                                     includes footer.html inside <main>)
├── _includes/
│   ├── nav.html
│   ├── drawer.html
│   ├── footer.html                 (conditional: adds "Jesu Juva" after the
│   │                                 copyright on every layout except home.html —
│   │                                 see §12. Included from INSIDE each layout's
│   │                                 own <main>...</main>, as its last child, not
│   │                                 once from default.html — default.html can't
│   │                                 place it correctly since each layout's <main>
│   │                                 closes in a different place/structure
│   │                                 (layout-3col vs layout-2col vs plain))
│   └── audio-player.html
├── _books/                         → collection chapters (Confessions, etc.) — see §6
│   ├── confessions-i-prayer.md
│   ├── confessions-ii-fifteen.md
│   └── ...
├── _posts/                         → standalone "page" posts AND non-continuous
│   │                                 collection index stubs (see §6)
│   ├── 2026-07-07-operator-fidelity-qpower-means.md
│   └── 2026-06-14-hold-you-somehow-sad.md
└── blog/
    └── index.md                    → blog home ("/blog/")
```

## 3. Design tokens

All colors, type, spacing, and breakpoints are CSS custom properties on
`:root` — see `base.css`. Do not hand-roll new values; every component
should reference these. Summary:

- **Serif** (body/headings): `Source Serif 4`, falling back to Georgia/Cambria.
- **Sans** (chrome — nav, tags, table headers, meta text): `IBM Plex Sans`.
- **Mono**: `IBM Plex Mono`.
- Base size 18px (`--step-0: 1rem`), line-height 1.7. Generous on purpose —
  see the falcon-sign.info / augustinus.cc brief: clarity over density.
- Content column: `--content-width: 640px`, narrow and centered, wide
  margins either side on desktop. Sidebars: left `--sidebar-width: 232px`,
  right `--sidebar-width-right: 168px` (deliberately narrower than the
  left — the right sidebar only ever holds a small photo, a "Resume
  (PDF)" tag-link, and a short list of social links, so it doesn't need
  the left sidebar's width), sitting *close* to the content (small
  `--gap`), the whole
  3-column cluster centered as one block (`--cluster-max: 1240px`) rather
  than sidebars pinned to the viewport edges — this is the Tao-blog note
  about sidebars "sticking close" even on wide screens.
- Breakpoints: `--bp-tablet: 1000px`, `--bp-mobile: 700px`. **Below 700px,
  `--content-width` is overridden to 100%** — standard margins, not the
  wide-margin desktop layout, per the brief. The page-edge margin itself
  (`.cluster`'s left/right padding) is `1.35rem` below 700px — deliberately
  still tighter than the desktop `.cluster` padding of `1.25rem`... wait,
  no: **1.35rem is now *larger* than the desktop 1.25rem**, which looks
  backwards at a glance but is correct — it used to be `1.1rem` (tighter
  than desktop), and Pritam asked for "very slightly" more breathing room
  on a phone than that; the fix nudged it up past the desktop value rather
  than just less far below it. Don't "correct" it back down to look
  smaller than the desktop margin — check the actual current value in
  `base.css`'s `@media (max-width: 700px)` block before changing it.
- Light palette: warm paper background (`#faf7ee`), near-black text,
  muted academic blue links (`#1a4e93`), classic purple visited-link
  (`#6a3f96`). Dark palette: warm near-black (`#171612`), warm off-white
  text (`#e9e2cd`) — not pure white/black anywhere, which is what makes it
  read as "paper" rather than "app."
- Corners are almost sharp (`--radius: 2px`) everywhere. No shadows except
  the drawer scrim. This is the "primitive" instruction — resist the urge
  to make boxes look like Bootstrap/Material cards.
- Dark mode is driven by `[data-theme="dark"]` on `<html>`, with a
  `prefers-color-scheme` fallback when no explicit choice has been made —
  see `base.css`'s `:root` / `@media (prefers-color-scheme: dark)` /
  `:root[data-theme="dark"]` triad. Copy this pattern for any *new*
  component color you add; don't give a color its only definition inside
  the media query.

## 4. Components (class names are load-bearing — reuse them)

- **`.sitenav`** — sticky top bar, hides on scroll-down/reveals on
  scroll-up (`base.js`, `.is-hidden`). Four zones: sidebar-toggle button
  (always leftmost, icon-only, `.icon-btn`, omitted entirely on pages with
  no sidebar — see §5) → site name/home link → spacer → one cross-link →
  text-size control + theme toggle.
- **Site name collapses to initials on a narrow nav.** `.nav-sitename`
  wraps two spans:
  ```html
  <a class="nav-sitename" href="portfolio.html">
    <span class="full">Pritam Chandra</span><span class="short">PC</span>
  </a>
  ```
  Below 480px `.full` hides and `.short` shows (plain CSS, `base.css`
  `@media (max-width: 480px)`). Apply this same two-span pattern anywhere
  else the nav gets tight — it's the general rule, not a portfolio-only
  fix. Don't add a subtitle span (e.g. "Mathematics & writing") next to the
  site name — an earlier draft had one and it's exactly what overflowed
  the bar on narrow screens; the nav is name + nav-links + controls, full
  stop.
- **Text size control** — a `−`/`+` pair, not the old three-step cycle:
  ```html
  <div class="size-ctl" role="group" aria-label="Text size">
    <button class="nav-btn" data-action="size-dec" aria-label="Decrease text size">&minus;</button>
    <button class="nav-btn" data-action="size-inc" aria-label="Increase text size">&plus;</button>
  </div>
  ```
  `base.js` steps `root.style.fontSize` through `SIZES = [80, 90, 100, 110,
  120, 130, 140, 150]` (percent, index 2 = 100% default) and disables
  whichever button is at the end of the range. Wider range than the old
  three fixed sizes, and two icon-only buttons read as less nav clutter
  than one button cycling through text labels.
- **Theme toggle is icon-only** — `<button class="nav-btn icon-btn"
  data-action="toggle-theme" title="Toggle dark mode" aria-label="Toggle
  dark mode">&#9728;</button>`. `base.js` sets its `textContent` to `☀` or
  `☾` for the current theme; don't put the word "Light"/"Dark" back next
  to the icon — the icon-only pair (size control + theme button) is what
  declutters the bar on narrow screens, matched by `.icon-btn` styling.
- **`.layout-3col` / `.layout-2col`** — CSS grid, `.col-sidebar` /
  `.col-content`. See §5 for how each breakpoint behaves.
- **`.drawer`** / **`.drawer-scrim`** — off-canvas panel,
  `data-action="close-drawer"` closes it, `Escape` closes it, class
  `drawer-open` on `<html>` drives the slide-in. `html.sb-hidden` is the
  *separate* manual "hide both sidebars" desktop toggle — same button,
  different behavior depending on viewport width. Every page now shares
  one breakpoint (700px, `base.js`'s `MOBILE_BP` constant) — there is no
  longer a per-page `data-drawer-bp` override; if you still see that
  attribute on `<html>` anywhere, it's inert and can be deleted. **Any
  `<a href="#...">` inside `.drawer` also closes the drawer on click**
  (`base.js` wires every in-drawer link, not just the explicit close
  button/scrim/Escape) — without this, tapping a contents link on a phone
  scrolls the page *behind* a drawer that's still sitting open on top of
  it, which reads as "the link is broken." Keep this wired up for any new
  drawer content you add.
- **Every sidebar's content needs a copy inside `.drawer` too, on any
  page that has a drawer.** The portfolio page originally only put its
  left sidebar (contents) in the drawer and left the right sidebar
  (photo, Resume link, social links) out — so below 700px, where both
  sidebars move into the drawer, that content simply had nowhere to
  appear at all. Fixed by adding a second `.drawer-section` with the same
  markup as the static `.col-right` aside, minus the photo (see
  `portfolio-body.html`). The blog home already did this correctly (its
  drawer has always duplicated both the tag list and the timeline) — use
  it as the reference when adding a right sidebar to any new page: static
  `.col-left`, static `.col-right`, and a `.drawer-section` copy of each,
  three places total for anything that lives in a sidebar. **Except the
  photo**: the drawer copy deliberately omits it — see the "photo is
  desktop-only" note below — so the drawer's second section is the Resume
  link, then the "Elsewhere" heading, then the link list, in that order,
  same as the static aside minus the photo/caption.
- **The right sidebar's photo only ever appears in the full ≥1000px
  three-column layout — nowhere else.** Below 1000px, once the right
  sidebar has joined the bottom of the left sidebar's column (or, below
  700px, moved into the drawer), the portrait box and its caption simply
  don't reappear; only the Resume link and link list do (`portfolio-
  extra.css`: `.col-right .portrait, .col-right .portrait-cap{ display:
  none; }` inside `@media (max-width: 1000px)`, and the drawer copy of
  `.col-right` never includes the portrait markup at all). Don't try to
  shrink the photo down and keep showing it at narrower widths — Pritam's
  explicit call was to drop it entirely once the layout can no longer
  show it beside the rest of the sidebar content.
- **The Resume link sits above "Elsewhere," outside the link list, styled
  as a small pill/tag — not as a button, and not as a `<li>`.** It went
  through three shapes: first a full-width `.nav-btn.btn-block` "Download
  CV" button, then (briefly) folded into `.link-list` as its first item
  styled exactly like Google Scholar/GitHub/etc., and now this — Pritam's
  final call was that living inside the plain-links list undersold it, but
  a full button overstated it. It's `<a class="tag resume-link" href="…">
  Resume (PDF)</a>`, reusing the same small bordered-box `.tag` style as
  the post-title topic pills (`.tags`/`.tag` — see the tags/pills bullet
  below) rather than inventing new chrome, with `.resume-link` in
  `portfolio-extra.css` only adding `display:inline-block; margin: 0 0
  1.3rem;` so it sits on its own line above the "Elsewhere" heading. Order
  in both the static aside and the drawer copy: photo (aside only) → CV
  caption (aside only) → Resume tag → "Elsewhere" heading → link list
  (Scholar/GitHub/Letterboxd/YouTube — Resume is NOT one of these `<li>`s
  anymore). Don't fold it back into the list or re-promote it to a button.
- **`html.sb-hidden` keeps the ≥1000px three-column layout completely
  static, but *does* reflow the narrower two-visible-column case.** At
  the full 3-column width, hiding the sidebars only ever toggles
  visibility (`html.sb-hidden .col-sidebar{ display: none !important; }`)
  — no grid or width changes there, and the content column must stay
  exactly where it is; an earlier version once also widened the content
  column at this width, which made the text visibly jump, and that must
  not come back. But below 1000px there's only ever one sidebar column on
  screen at a time (the merged left+right column, or the collection
  page's single left column), and hiding *that* one used to leave its now-
  empty grid track still reserved and blank — a dead gap on the left only,
  with the content shoved off-center to the right. Pritam asked for the
  content column to re-center into the freed space **at its existing
  width**, not grow to fill it. See §5 for the full mechanism
  (`html.sb-hidden .layout-3col`/`.layout-2col` overrides) — the short
  version: below 1000px, `sb-hidden` collapses the grid to a single track
  and gives `.col-content` an explicit `width: calc(100% - var(--sidebar-
  width) - var(--gap))` (capped by `max-width: var(--content-width)`) plus
  `margin: 0 auto`, which reproduces the exact width it already had as the
  second column of the two-column grid, just centered instead of pinned
  left. Don't simplify this back to a plain `margin: 0 auto` with no
  explicit `width` — that lets the column grow to fill the newly-freed
  space instead of holding steady, which is the one thing Pritam explicitly
  said *not* to do.
- **`.thm` / `.thm-label` / `.proof`** — theorem/lemma/proposition boxes.
  Tao-inspired but made primitive: flat fill, single hairline border, no
  icons, no color-coding by type (all one treatment).
- **`.callout` / `.callout--note` / `.callout--warning` / `.callout--tip`**
  — this is the de-styled replacement for Quarto's rounded, icon-and-color
  callout boxes. Use for anything you'd have reached for a Quarto callout
  for. Not used in the current 5 mockups — add an example if a real post
  needs one, following this pattern exactly.
- **Tables** — booktabs style, horizontal rules only, no vertical rules,
  no zebra striping. `<caption>` for a table footnote, styled small and
  left-aligned, when a table needs one. The Teaching Experience table
  (`portfolio-body.html`) is deliberately just three columns — Year,
  Course, Instructor — **at every width**, not six columns on desktop
  narrowed down on a phone. An earlier draft tried the responsive
  hide-columns-on-mobile approach (`.col-hide-narrow`/`.col-keep`,
  toggled with a media query); Pritam preferred simplifying the table
  itself instead of making it context-dependent, so that mechanism is
  gone — don't reintroduce it for this table. `.teaching-table` also
  isn't full-width: it's `width: auto` with `margin: 1.4em auto`, so it
  sits centered in the content column rather than stretching edge to edge
  with a lot of empty space on the right (that read as "pushed left").
  If a future table on the site genuinely needs more columns than fit on
  a phone, the hide-columns technique is a reasonable thing to reach for
  again — just don't apply it here, where the fix was to have fewer
  columns, period.
- **`.tag` / `.tags`** — small bordered pill, used both as a real link
  (tag archive, once you build one) and as a static label.
- **`.verse`** — `white-space: pre-line`, used for both the Confessions
  poems and the song lyrics. In Markdown, write it as a kramdown block
  with an IAL:
  ```markdown
  {: .verse}
  You said the quiet doesn't scare you anymore,
  that you've made peace with the dark corners of the floor,
  ```
  (kramdown, Jekyll's default Markdown engine, supports attribute lists on
  the paragraph directly above them — no HTML needed for the common case.)
- **`.chords`** — one plain line of chord names above a `.verse` block on
  a song post (see `post-song-sample.html`, `media-extra.css`):
  ```html
  <p class="chords">G &middot; D &middot; Em &middot; C</p>
  <p class="verse">You said the quiet doesn't scare you anymore, ...</p>
  ```
  This is a *section-level* progression (one line per verse/chorus/bridge),
  not word-by-word alignment above individual syllables — a fixed-width
  aligned chord chart needs a monospace grid that breaks on narrow screens
  and is fragile to keep in Markdown (whitespace gets collapsed/reflowed).
  If Pritam wants precise per-word chord placement later, that's a bigger
  design decision (probably a `<pre>` block, monospace, horizontally
  scrollable on mobile) — flag it rather than silently building it.
- **`.epigraph`** — centered, both-sides-indented. **No automatic
  quotation marks and no automatic italics** — both were removed at
  Pritam's request (see §13's epigraph UPDATE for the full history,
  including why: nested quotations inside a real quoted source don't
  work if the template is the one adding the outer quote marks). Write
  `epigraph.text` exactly as it should look — add your own `"..."` and
  `*italic*`/`**bold**` inline in the YAML, same rules as `note` (§13).
  The two existing Confessions epigraphs keep their italic look by
  having `*...*` written into their `text:` field by hand, not by any
  CSS doing it for them — copy that pattern for a new italicized
  epigraph rather than expecting it automatically.
- **Collections use a point-numbering system — chapter (`I`, `II`, ...)
  and subchapter (`I.1`, `I.2`, `II.1`, ...) — not named "parts."** An
  earlier draft grouped Confessions' five poems under two labels, "Part
  One — Before" / "Part Two — After," where the label itself wasn't a
  link, just a heading grouping its children. Pritam asked for point
  numbers instead, **and for the chapter-level heading to be a real,
  independently linkable section**, not just a label — a chapter can
  carry its own content (an intro line, an epigraph) before its first
  subchapter begins, so it needs its own anchor. Two nesting levels of
  `<section>`, both linkable:
  ```html
  <section class="chapter" id="i">
    <header class="chapter-head">
      <span class="chapter-num">I</span>
      <h2>Before</h2>
    </header>
    <p class="chapter-intro">Three pieces written while I still thought doubt was something to resolve rather than live inside.</p>

    <section class="subchapter" id="i-1">
      <header class="subchapter-head">
        <span class="subchapter-num">I.1</span>
        <h3>Prayer Before the First Line</h3>
      </header>
      <p class="verse"> ... </p>
    </section>

    <hr class="rule chapter-divider">

    <section class="subchapter" id="i-2"> ... </section>
  </section>

  <section class="chapter" id="ii"> ... </section>
  ```
  Heading levels matter here: the chapter title is `<h2>` (a major
  section, same level as the rest of the site's section headings) and
  the subchapter title is `<h3>` (one level finer) — don't make them both
  `<h2>`, that breaks the "don't skip/flatten heading levels" rule in
  §11. `.chapter-intro` is optional — a collection with no chapter-level
  framing text just omits it and goes straight from the chapter heading
  to its first subchapter. Between two subchapters of the *same* chapter,
  use a plain `<hr class="rule chapter-divider">` — no centered dots.
  `hr.divider` (the `•  •  •` treatment, `base.css`) still exists as a
  shared utility for anywhere else a "soft break with an ornament" reads
  right, but this divider must **not** carry the `.divider` class, only
  `.rule.chapter-divider` — that's what keeps the dots off. Between two
  *chapters*, don't use an `<hr>` at all — the next chapter's own heading
  (`.chapter + .chapter` gets a top rule and extra space in
  `collection-extra.css`) is the divider; there's no separate divider
  element for that break anymore.
- **Collection table of contents** — mirrors the point-numbering above,
  one level of nesting, and **both levels are real links**:
  ```html
  <div class="book-toc">
    <ul>
      <li>
        <a href="#i"><span class="chapter-num">I</span><span class="chapter-title">Before</span></a>
        <ul class="toc-sub">
          <li><a href="#i-1"><span class="chapter-num">I.1</span><span class="chapter-title">Prayer Before the First Line</span></a></li>
          ...
        </ul>
      </li>
      <li>
        <a href="#ii"><span class="chapter-num">II</span><span class="chapter-title">After</span></a>
        <ul class="toc-sub"> ... </ul>
      </li>
    </ul>
  </div>
  ```
  `.book-toc a` is a flex row (numeral + title side by side, `gap:.55em`)
  at both levels; the numeral (`.chapter-num`) never wraps, and a long
  title wraps to a second line under the *title's* own start, not under
  the numeral. A collection with only one level (no subchapters worth
  splitting out) just omits `ul.toc-sub` and puts each poem directly as a
  top-level `<li>` — the nesting is optional, one level deep only if
  used, same as before.
- **Blog home post filter** — `All` / `Collections` / `Pages`, one small
  button group (`.post-filter`) placed directly above the tag list, in
  **both** copies of the sidebar content (the static `.col-left` aside and
  the `.drawer` copy — they're wired together, since `base.js` selects on
  `[data-filter]` regardless of which copy was clicked):
  ```html
  <div class="post-filter" role="group" aria-label="Filter posts">
    <button type="button" data-filter="all" aria-pressed="true">All</button>
    <button type="button" data-filter="collection" aria-pressed="false">Collections</button>
    <button type="button" data-filter="page" aria-pressed="false">Pages</button>
  </div>
  ```
  Every `<article class="post-entry">` needs `data-kind="collection"` or
  `data-kind="page"` — `base.js` reads it to decide what to hide, and also
  hides a `.year-divider` heading if every entry under it gets filtered
  out. When you wire this to real Jekyll data, `data-kind` should come
  straight from whichever front-matter field distinguishes a book chapter
  index page from a standalone post (or just hardcode it per layout, since
  a `_books` index entry vs. a `_posts` entry already know which they are).
- **Audio player** (`post-song-sample.html`) — plain native `<audio
  controls>`, boxed in `.player`. Don't build or import a custom audio
  player; native controls in a plain box is the "primitive" choice and it
  works. One CSS detail that matters: `color-scheme: light` /
  `[data-theme="dark"] { color-scheme: dark }` on `:root` — without it the
  native control chrome stays light-themed even when the page goes dark.

## 5. Responsive behaviour — one unified pattern across every page

This is the fix for the bug the brief called out on the Quarto reference
sites (`jjallaire.github.io/hopr`, `course.fast.ai`): their sidebars vanish
below a breakpoint with **no way to get them back**. Every page here keeps
a way back — either a toggle or a reflow — and that must survive whatever
refactor you do.

An earlier draft gave the portfolio page, the blog home, and the
collection page each their own breakpoint and their own reflow shape
(right sidebar becoming a full-width bottom section on one page, drawer-
only on another, at two different widths). Pritam found that inconsistent
across pages and it made the JS more fragile than it needed to be
(`data-drawer-bp` had to vary per page). **It's been unified into one
pattern that every page with a right sidebar follows**, driven entirely by
`base.css` grid rules (`.layout-3col`) — there should be no page-specific
responsive override left to write:

- **≥1000px**: three columns, as designed — left sidebar, content, right
  sidebar, all static.
- **700–1000px**: the right sidebar stops being its own grid column and
  drops to sit **underneath the left sidebar, in the left sidebar's own
  column** (not a separate full-width section spanning under the content —
  it joins the left column specifically). Both are still plain static
  content at this width, just stacked. Content stays in the middle column,
  full height.
- **<700px**: left and right sidebar content both move into the drawer
  together (single hamburger button, `MOBILE_BP = 700` in `base.js`, no
  per-page override). The content column becomes the only thing on screen,
  full width.
- The "hide sidebars" nav button hides *everything* at any width
  (`html.sb-hidden`) — a separate, always-available "just let me read"
  mode, independent of the responsive reflow above, and it only ever
  toggles `display: none` on the sidebar — it must never change the
  content column's position or width (see §4).

This is one CSS pattern (`base.css`, the `@media (max-width: 1000px)` and
`@media (max-width: 700px)` blocks under `.layout-3col`), and there is
**no page-specific override left for any of it**.

**Sidebars are sticky (pinned in place, scrolling only within themselves
if they're taller than the viewport) at every width that shows a
sidebar at all — ≥1000px AND 700–1000px alike. The body scrolling past a
sidebar that stays put is the correct, intended behavior everywhere; a
sidebar drifting down the page along with the body text is the bug.**
This went through three states before landing here, worth knowing so it
doesn't regress:
1. Originally, `.col-left`/`.col-right` each carried `.sidebar-sticky`
   independently at every width. At 700–1000px, once the right sidebar
   was stacked underneath the left one in the same column, that meant
   *two* independently sticky panels in a row — they drift apart from
   each other as you scroll, since each sticks to its own `top: 72px`
   rather than to where the other one happens to end.
2. The fix at the time neutralized stickiness entirely below 1000px
   (`position: static` on both), which stopped the drift-apart problem
   but overcorrected: now the *whole* merged sidebar scrolled away with
   the body, instead of staying pinned like it does at ≥1000px. Pritam
   caught this — the merged sidebar should behave exactly like the wide
   sidebars do, just as one pinned unit instead of two.
3. **Current fix**: make `.col-sidebar-wrap` itself — not the individual
   asides — the sticky element at 700–1000px. `.col-left` and `.col-
   right` go back to plain `position: static`, sitting in normal document
   flow *inside* the wrapper, so they can never drift apart from each
   other; the wrapper as a whole pins to `top: 72px` and scrolls
   internally (`overflow-y: auto`, capped at `max-height: calc(100vh -
   90px)`) if its combined content is taller than the viewport — same
   numbers as the ≥1000px `.sidebar-sticky` rule, just applied to the
   wrapper instead of to each aside.

The scrollbar for any of this internal scrolling (wrapper or individual
`.sidebar-sticky` aside) is deliberately invisible — `scrollbar-width:
none` (Firefox) + `-ms-overflow-style: none` (old Edge) +
`::-webkit-scrollbar{ display: none }` (Chromium/Safari) on
`.sidebar-sticky` itself. The content still scrolls by wheel, touch, or
keyboard; only the visual track is suppressed, so a long Contents list or
a merged Tags+Timeline column doesn't compete with the page's own
scrollbar. **Don't drop these three rules thinking they're dead code** —
they're load-bearing the moment any sidebar's content exceeds the
viewport height, which the brief specifically flagged as something to
expect eventually on the blog home and book/collection pages.

Separately from the sticky behavior, `.col-left`/`.col-right` are also
wrapped in `.col-sidebar-wrap` for a second, unrelated reason — a CSS
Grid row-sizing bug. **If you add a right sidebar to a new page, wrap
both asides in `.col-sidebar-wrap` the same way — don't put
`.col-left`/`.col-right` back as bare grid children of `.layout-3col`.**
The first attempt at "right sidebar joins the bottom of the left
sidebar's column" kept `.col-left` and `.col-right` as direct grid
children — `.col-left` in row 1, `.col-right` in row 2, both in column 1
— with `.col-content` set to `grid-row: 1 / 3` so it could span both rows
in column 2 next to them. That looks reasonable but is wrong: **CSS Grid
sizes a row track from the tallest item touching that row, in *any*
column** — so row 1's height was being set by `.col-content` (long
article body, very tall), not by `.col-left` (a short list of links).
Row 2, and therefore `.col-right`, ended up pushed hundreds of pixels
down the page — wherever the tall content column happened to end —
instead of sitting right below `.col-left`. Measured on the portfolio
page at 900px width, this was a **951px gap**, not the few-pixel spacing
gap it should have been. No amount of tuning `row-gap`/`margin`/`padding`
fixes this — the row track itself is oversized, not the spacing between
elements in it.

The fix for *that* bug is structural: stop making `.col-left`/`.col-
right` share a grid row with the content column at all. `.col-sidebar-
wrap` is `display: contents` at ≥1000px (so it's invisible to layout and
`.col-left`/`.col-right` are independent grid items in columns 1 and 3,
exactly as before), and becomes a real, ordinary block box at <1000px —
the *sole* occupant of column 1's single row, with `.col-left` and
`.col-right` simply stacked inside it in normal document flow. Its
height is then governed only by its own two children, never by the
content column's height, so `.col-right` reliably sits right after
`.col-left` — and, per the sticky discussion above, that whole box is
also what actually carries the sticky positioning at this width.
```css
/* base rule (all widths) */
.layout-3col > .col-sidebar-wrap{ display: contents; }

/* base rule (all widths) — the hidden-scrollbar treatment for any
   sticky/scrolling sidebar, at any breakpoint */
.sidebar-sticky{
  position: sticky; top: 72px; max-height: calc(100vh - 90px); overflow-y: auto;
  scrollbar-width: none; -ms-overflow-style: none;
}
.sidebar-sticky::-webkit-scrollbar{ display: none; }

@media (max-width: 1000px){
  .layout-3col{ grid-template-columns: var(--sidebar-width) minmax(0, 1fr); }
  /* the wrapper is the sticky unit here, not the individual asides */
  .layout-3col > .col-sidebar-wrap{
    display: block; grid-column: 1; grid-row: 1; min-width: 0;
    position: sticky; top: 72px; max-height: calc(100vh - 90px); overflow-y: auto;
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .layout-3col > .col-sidebar-wrap::-webkit-scrollbar{ display: none; }
  .layout-3col > .col-content{ grid-column: 2; grid-row: 1; }
  .col-sidebar-wrap > .col-right{
    margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border);
  }
  /* col-left/col-right are no longer sticky as individuals — the
     wrapper above is the one sticky/scrolling element now; descendant
     selectors here, not direct-child, since .col-left/.col-right now
     sit one level inside .col-sidebar-wrap */
  .layout-3col .col-left.sidebar-sticky,
  .layout-3col .col-right.sidebar-sticky{
    position: static; max-height: none; overflow: visible;
  }
}
```
At <700px, hide `.col-sidebar-wrap` (not the individual asides — they're
no longer direct children of `.layout-3col`) alongside the existing
`.col-left`/`.col-right` hide rule, so both the wrapped and unwrapped
cases are covered:
```css
@media (max-width: 700px){
  .layout-3col > .col-left, .layout-3col > .col-right,
  .layout-3col > .col-sidebar-wrap, .layout-2col > .col-sidebar{ display: none; }
}
```
One accessibility tradeoff worth knowing about: wrapping `.col-left` and
`.col-right` adjacent to each other in the DOM (so the stacked layout
works without JS) means, at the ≥1000px width, tab order visits both
sidebars before the main content column, rather than interleaving
left-sidebar → content → right-sidebar to match the visual left-to-right
order. The page's `.skip-link` (jumps straight to `#main`) is the
mitigation already in place for keyboard users; that's an intentional
tradeoff, not an oversight — don't "fix" it by moving `.col-right` back
out of the wrapper, that reintroduces the row-spanning bug above.

**Collection / book pages** (`.layout-2col`, left = chapter contents, no
right sidebar currently):
- ≥700px: sticky left sidebar (this page never merges a second sidebar
  into it, so it's just the plain `.sidebar-sticky` behavior — no
  `.col-sidebar-wrap` needed here, that's only for pages stacking two
  sidebars into one column).
- <700px: drawer only, same 700px breakpoint as everywhere else.
- The right column is intentionally unused right now ("for now can be
  empty," per the brief) — the grid is `.layout-2col`, not a 3-column grid
  with an empty slot. If Pritam later wants something there (related
  chapters, footnotes), switch to `.layout-3col` and it gets the same
  stacking behavior as every other page, for free, no new CSS needed.

**Standalone posts** (math sample, media sample): no sidebar, no drawer,
no hamburger button in the nav at all. Just the centered content column.
Simplest case — don't add chrome that isn't in the mockup.

**The manual "hide sidebars" toggle (`html.sb-hidden`) behaves differently
depending on how many sidebar *columns* are actually on screen** — this
tripped up an earlier pass, worth being precise about:

- **≥1000px, `.layout-3col` pages** — three columns on screen (left,
  content, right). Hiding the sidebars must leave the content column
  exactly where it is: two blank, roughly-balanced tracks either side.
  This case gets no special override at all — just the plain visibility
  rule (`html.sb-hidden .col-sidebar{ display: none !important; }`).
- **700–1000px, `.layout-3col` pages, and `.layout-2col` pages at any
  width ≥700px** — only *one* sidebar column is on screen (the merged
  left+right column, or the collection page's single left column). Hiding
  it used to leave that one column's track still reserved and blank —
  a dead gap on the left only, shoving the content off-center to the
  right, which reads as broken in a way the balanced ≥1000px case
  doesn't. Pritam's fix request was specific: re-center the content
  column into the freed space, but **hold its width to what it already
  was** — don't let it grow just because the space opened up. That rules
  out the simplest fix (drop the sidebar track and let `.col-content`
  stretch to `max-width`), since the two-column track width at a given
  viewport is usually narrower than `--content-width` (e.g. ~584px vs.
  640px at 900px viewport) — stretching to the cap is a visible, unwanted
  width change. The actual fix reproduces the old two-column arithmetic
  explicitly instead of relying on the grid to produce it:
  ```css
  /* base.css — applies at every width for .layout-2col (it's always
     "one sidebar column", there's no wider 3-column state to protect) */
  html.sb-hidden .layout-2col{ grid-template-columns: minmax(0, 1fr); }
  html.sb-hidden .layout-2col > .col-content{
    width: calc(100% - var(--sidebar-width) - var(--gap));
    max-width: var(--content-width);
    margin-left: auto; margin-right: auto;
  }

  /* base.css, inside @media (max-width: 1000px) — same idea for
     .layout-3col, scoped so it can never fire at the ≥1000px width */
  html.sb-hidden .layout-3col{ grid-template-columns: minmax(0, 1fr); }
  html.sb-hidden .layout-3col > .col-content{
    grid-column: 1;
    width: calc(100% - var(--sidebar-width) - var(--gap));
    max-width: var(--content-width);
    margin-left: auto; margin-right: auto;
  }
  ```
  `calc(100% - var(--sidebar-width) - var(--gap))` is exactly the width
  `.col-content` would have measured as the second track of the original
  two-column grid at that same viewport (100% here resolves against the
  single remaining track, which now spans the whole row) — so the column
  doesn't visibly resize when the sidebar disappears, it just re-centers.
  `max-width: var(--content-width)` keeps the usual cap for the (rarer)
  case where the calculated width would otherwise exceed it. Verified
  with Playwright at 900px on both a `.layout-3col` page and the
  `.layout-2col` collection page: identical `.col-content` width before
  and after toggling, and equal left/right gaps after.
- **<700px, any page** — sidebars are already off-canvas in the drawer,
  not shown in the grid at all, so `html.sb-hidden` has nothing to do here
  regardless of page type; `--content-width` is already 100% at this
  width, so centering is moot.

## 6. Content model: "collections" vs "pages"

A **collection** (Confessions, a future "Watched, Mostly Alone," etc.) is
several Markdown files that render as **one continuous scrolling page**,
with the left sidebar linking to in-page anchors — not one Jekyll page per
file. A **page** is an ordinary standalone post.

**Recommended implementation** — one Jekyll collection, `_books`, shared by
every book. Each *subchapter* (a poem, e.g. "I.1 — Prayer Before the First
Line") is its own file — note it's the subchapter that's the Markdown
file, not the chapter; a chapter is just a grouping of subchapter files
plus a little metadata, so it doesn't need a file of its own:

```yaml
---
book: confessions
book_title: "Confessions"
chapter: 1                 # 1 → renders as "I", 2 → "II", etc.
chapter_title: "Before"    # only read from the FIRST subchapter of each
                            #   chapter (chapter_order: 1) — see below
chapter_intro: "Three pieces written while I still thought doubt was something to resolve rather than live inside."
                            # optional; only read from the first subchapter too
chapter_order: 1           # this file's position *within* its chapter (1, 2, 3, ...)
                            #   → renders as "I.1", "I.2", ...
order: 1                   # this file's position in the whole book, for the top-to-bottom
                            #   render order — usually just chapter*100 + chapter_order, or
                            #   keep a simple running count, your call
title: "Prayer Before the First Line"
slug: i-1
epigraph: null            # or {text: "...", cite: "Augustine, Confessions X"}
gloss: null                # optional short prose note after the poem
---
Let me start honest, or not at all —
no clean confession dressed as praise,
...
```

`chapter_title` and `chapter_intro` are **only meaningful on the first
subchapter of a chapter** (`chapter_order: 1`) — leave them blank
(`null`) on every other subchapter in that chapter. This avoids a
separate small data file just to name two chapters, at the cost of one
easy-to-miss rule: if Pritam ever reorders which subchapter is "first" in
a chapter, the title has to move with it. Flag this as an open question
(§10) — if it turns out to be confusing in practice, moving chapter
metadata into a `_data/books/<book>-chapters.yml` file (one small
`{title, intro}` entry per chapter number) is the more robust
alternative, just one more file to maintain per book.

In `_config.yml`, set `output: false` for this collection so Jekyll does
**not** generate an individual permalink page per subchapter — only the
combined book page (built below) should be reachable. In
`_layouts/book.html`, group by chapter and render two nested loops:

```liquid
{% assign subchapters = site.books | where: "book", page.book_slug | sort: "order" %}
{% assign chapters = subchapters | group_by: "chapter" %}
{% for ch in chapters %}
  {% assign first = ch.items | where: "chapter_order", 1 | first %}
  <section class="chapter" id="{{ ch.name | roman_numeral }}"> {# see note below #}
    <header class="chapter-head">
      <span class="chapter-num">{{ ch.name | roman_numeral }}</span>
      <h2>{{ first.chapter_title }}</h2>
    </header>
    {% if first.chapter_intro %}<p class="chapter-intro">{{ first.chapter_intro }}</p>{% endif %}
    {% for sub in ch.items %}
      <section class="subchapter" id="{{ sub.slug }}">
        <header class="subchapter-head">
          <span class="subchapter-num">{{ ch.name | roman_numeral }}.{{ sub.chapter_order }}</span>
          <h3>{{ sub.title }}</h3>
        </header>
        {% if sub.epigraph %}...{% endif %}
        {{ sub.content }}
        {% if sub.gloss %}<p class="chapter-gloss">{{ sub.gloss }}</p>{% endif %}
      </section>
      {% unless forloop.last %}<hr class="rule chapter-divider">{% endunless %}
    {% endfor %}
  </section>
{% endfor %}
```

Liquid has no built-in Roman-numeral filter (the `roman_numeral` filter
above is a stand-in) — either write a tiny custom Liquid filter (a few
lines of Ruby, allowed on GitHub Pages since it's not a *plugin* in the
allowlist sense... actually it is a plugin; GitHub Pages' `safe` build
mode won't run custom Ruby, so this needs to run **at write time, not
build time** either way), or — much simpler, no Ruby at all — just make
`chapter` a **string** in front matter (`chapter: "I"`) instead of an
integer, and use it directly wherever the example above computes a
Roman numeral. That's the actual recommendation: skip the filter
entirely, store `chapter: "I"` / `chapter: "II"` as plain text. Same for
`id`s: use `id="i"`/`id="ii"` directly rather than deriving them.

This produces markup matching `collection-confessions.html` — chapter
number, chapter title, optional chapter-level intro line, then each
subchapter with its own point-number, title, optional epigraph, the verse
content, optional gloss, and a plain `<hr class="rule chapter-divider">`
between subchapters of the same chapter (**not** `class="rule divider
chapter-divider"` — the `divider` class is what draws the centered dots,
and those were removed). Between chapters, don't render an `<hr>` at all;
`.chapter + .chapter` in `collection-extra.css` already adds a top rule
and extra space, so the next chapter's own heading is the divider. The
book's own page (e.g. `/blog/confessions/`) is a normal `.md` file with
`layout: book` and `book_slug: confessions` in its front matter, so
Pritam adds a *new* book by adding one small page file plus its
subchapter files — no template editing. A book that doesn't need
chapters at all (every poem stands on its own) can skip the `chapter`/
`chapter_order` fields and render a flat list of `.subchapter` sections
with no wrapping `.chapter` — matching the note in §4 that the nesting is
optional.

This is also why the collection sample page carries an explicit "these are
placeholder poems" note: **the actual Confessions manuscript wasn't
attached to the design request**, so what's rendered is original filler
written to demonstrate the pattern, not the real text. Swap it — the
poems are disposable, the `_books` mechanism is not.

A **page** is just `_posts/YYYY-MM-DD-slug.md`, `layout: post`, front
matter `title`, `tags`, and for media posts an `audio:` path. Nothing
collection-specific needed.

**Tags and the timeline on the blog home are computed automatically** from
post/book front matter (`site.tags`, grouping by `date | date: "%Y"`) —
don't ask Pritam to maintain a tag list or year index by hand anywhere.

## 7. Math rendering — self-host KaTeX, don't load it from a CDN

**Use a locally-hosted copy of KaTeX (CSS + JS + the `auto-render`
extension + its webfonts), not a CDN `<link>`/`<script src>`.** The
mockups originally pointed at `cdnjs.cloudflare.com`, and that's the most
likely reason math (and everything else on the page) rendered fine in one
browsing context and failed in another during review — a blocked,
slow, or otherwise unreliable path to a third-party CDN is invisible until
someone hits it, and a phone on a different network/browser than a
desktop is exactly where that shows up. The mockups you were handed
already have KaTeX fully inlined — view source on `post-math-sample.html`
and you'll find the entire KaTeX stylesheet (fonts included, as base64
`data:` URIs) inside the page's own `<style>` block, and `katex.min.js` +
`auto-render.min.js` inside its own `<script>` block, with **zero**
external requests. Verified by re-rendering every one of the 5 mockups
with all network requests blocked at the browser level — math, fonts, and
every toggle still worked. Port this as-is:

- Vendor KaTeX into the repo (e.g. `assets/vendor/katex/`) rather than
  linking `cdnjs.cloudflare.com`.
- Inline `katex.min.css` into `assets/css/main.css` (or a `_sass`
  partial), with its `@font-face` `src: url(fonts/*.woff2)` references
  rewritten to base64 `data:` URIs — this is what makes the fonts load
  with zero extra requests and zero risk of a font 404 silently breaking
  matrix/delimiter scaling (see the next paragraph for why that matters).
  A short one-off Python script did this rewrite for the mockups
  (base64-encode each `.woff2`, substitute it into the `src:` list, drop
  the `.woff`/`.ttf` fallbacks) — regenerate it once during the port
  rather than hand-editing 20 `@font-face` blocks.
- Inline `katex.min.js` and `contrib/auto-render.min.js` into your
  site-wide JS bundle, same as `base.js`.
- Keep the `renderMathInElement` call exactly as before:
  ```js
  renderMathInElement(document.body, {
    delimiters: [
      {left: "$$", right: "$$", display: true},
      {left: "\\[", right: "\\]", display: true},
      {left: "$", right: "$", display: false},
      {left: "\\(", right: "\\)", display: false}
    ],
    throwOnError: false
  });
  ```

**Why the font inlining matters beyond "no CDN": a broken/missing KaTeX
webfont doesn't fail loudly, it fails as a subtly wrong render** — delimiters
(parentheses, matrix brackets) that KaTeX scales by stacking glyphs from
those fonts render undersized/unscaled instead of erroring, which is easy
to mistake for a KaTeX bug rather than a font-loading bug. If matrix
brackets or any stacked delimiter ever look wrong again after a rebuild,
check the font loading path first (`document.fonts` in devtools should
list 20 KaTeX font entries) before assuming it's a rendering-engine issue.

Also worth double-checking once real content is in place: **load-test one
math-heavy page and one toggle-heavy page on an actual phone**, not just a
desktop preview — that's the gap that prompted this section, and while
self-hosting removes the specific cause found here (CDN dependency), it's
the only way to be sure nothing else network-shaped slipped in.

Pritam then just writes `$F(A,B) = ...$` or `\[ ... \]` directly in his
Markdown, same as any LaTeX file — **this is the exact mechanism verified
in `post-math-sample.html`**, which renders the full "Incomparability of
Operator Fidelity" paper (definitions, four lemmas, a full multi-step
limit proof, matrices, `\tag{}` equation numbers) with zero rendering
errors, including matrices with full-height scaled brackets. One kramdown
gotcha to watch for: kramdown can misinterpret `_` as Markdown emphasis
inside math. If an equation ever renders with a spurious italic split,
wrap that line in a raw HTML `<span>` or use kramdown's `{::nomarkdown}`
block, or simplest, tell Pritam to avoid bare `_` for subscripts in inline
text and prefer `{}` grouping — this didn't come up in the sample post but
is the standard kramdown+KaTeX interaction to be aware of.

Also carry over the `.thm`/`.proof` markup pattern from
`post-math-sample.html` for every future theorem/lemma — it's plain HTML
inside the Markdown body (kramdown passes raw HTML blocks through
untouched), not a Liquid include, so Pritam can type it directly:

```html
<div class="thm">
  <span class="thm-label">Lemma 5</span>
  <div class="thm-body">
  State the lemma. Inline math like $A \succeq B$ works here too.
  </div>
</div>
```

**Wide display equations get their own horizontal scroll strip — they
must never widen the page itself.** This was a real, frequent bug on
narrow screens: KaTeX's own default CSS centers a display equation with
`text-align: center` on a block, and a block wider than its container
that's centered just bleeds out equally on both sides with nothing to
contain it — which on a phone showed up as the *entire page* gaining
horizontal scroll (everything "wobbly," margins not holding) the moment
one equation was too wide, not just that one equation misbehaving.

The fix went through two iterations worth knowing about, because the
first one looked reasonable and shipped, then failed on real-device
testing in two distinct ways — both worth understanding so they don't
get reintroduced. **First attempt (reverted, don't reuse):** switch the
centering mechanism from `text-align: center` to flexbox's
`justify-content: center` (`.katex-display{ display:flex; justify-
content:center; overflow-x:auto; }` + `.katex-display > .katex{ flex-
shrink:0; }`), on the theory that flexbox computes scrollable overflow
correctly on both sides where `text-align` doesn't. That part is true,
but it broke two things: (1) the *default*, unscrolled view showed the
equation already centered — i.e. already scrolled *past* its true left
edge, which can't be undone (`scrollLeft` can't go negative) — exactly
backwards from "start at the left, scroll right for more." (2) making
`.katex` a flex item changed its width from "100% of `.katex-display`"
(its normal block behavior) to shrink-to-fit its own content, and
`.katex-html` (KaTeX's own nested block, also 100% of *its* parent)
shrank right along with it — collapsing `\tag{}`'s `position:absolute;
right:0` anchor from "the container's right margin" down to "the
equation's own tight box," landing the tag directly on top of the
equation's last few characters, even on equations that fit fine and
weren't overflowing at all.

**Final fix**, in `base.css`, applied at every width (a no-op on
desktop for equations that already fit, so no media-query needed):
```css
.katex-display{
  overflow-x: auto; overflow-y: hidden;
}
.katex-display > .katex{
  text-align: left;
  width: max-content;
  min-width: 100%;
}
.katex-display:has(.tag) .katex-html{
  padding-right: 2.6em;
}
```
Three pieces, each earning its keep:
1. `text-align: left` instead of KaTeX's default `center` (this is
   KaTeX's own documented `fleqn` — "flush left equations" — convention,
   see `.katex-display.fleqn` in `katex.css`; not an improvised hack).
   Left-aligned content that overflows only ever overflows to the
   *right*, which plain `overflow-x: auto` has always handled correctly
   and natively — the default scroll position shows the equation's true
   left edge, full stop, no flexbox trick required. This is a genuine,
   deliberate visual change from centered to left-aligned display math.
2. `width: max-content; min-width: 100%` on `.katex` lets the box grow
   to fit content wider than the column (instead of staying pinned at
   100% and letting content silently paint past its own edge) while
   never shrinking below the column's width for short equations. This is
   what makes `scrollWidth` correctly exceed `clientWidth` exactly when
   an equation is genuinely too wide — and *not* for equations that fit.
3. The `:has(.tag)` rule handles a second bug the first two rules don't:
   `\tag{}` is `position: absolute`, so it never counts toward an
   equation's "natural width" in rule 2's calculation at all — an
   equation whose glyphs alone are, say, 95% of the column width reads
   as "fits" by that measure, yet still collides with a number anchored
   at the column's right margin, because the tag and the tail of the
   equation are fighting over the same few pixels. Confirmed on a real
   `\tag{3}` at 390px: glyphs rendered to 308px inside a 324px column
   (comfortably "non-overflowing" by rule 2), but the ~32px-wide tag,
   anchored flush with that same 324px edge, had its left edge land 16px
   *inside* the glyphs' own span — the number rendered on top of the
   equation's tail. Reserving `padding-right` on `.katex-html`, scoped to
   only equations that actually have a `.tag`, fixes this — not by
   physically shifting where the glyphs paint (nowrap inline content
   ignores padding; it isn't wrap-constrained by it), but by inflating
   `.katex-html`'s own preferred (max-content) width, which is exactly
   what rule 2 measures on its parent `.katex`. Once glyphs + this
   reserved padding together exceed the column width, `.katex` genuinely
   grows to fit both, pulling `.katex-html`'s right edge (where the
   tag's `right:0` anchors) out past the padding, clear of the glyphs —
   landing the reserved gap exactly between them. A short, un-tagged, or
   comfortably-fitting-with-room-to-spare equation is unaffected (its
   tag stays pinned at the margin, the classic numbered-equation look);
   a near-full-width tagged equation instead gets nudged into the
   horizontally-scrollable state, with its number reachable "inside that
   [scrollable] space, at the right end" — Pritam's own phrasing for
   where a numbered overflowing equation's tag belongs. Needs `:has()`
   (Safari 15.4+ / Chrome 105+ / Firefox 121+ — fine for this audience);
   a browser without it just skips the padding, so the worst case there
   is the pre-existing exact-collision, not a new failure mode.

Verified with Playwright across widths 360–430px on the math sample
page: every one of its display equations (numbered and un-numbered,
overflowing and not) starts at `scrollLeft: 0` showing its true left
edge; none of the three `\tag{}` numbers overlap their equation's
glyphs (confirmed both by DOM measurement and by cropped screenshots);
`document.documentElement.scrollWidth` never exceeds the viewport width
at any tested width, i.e. the page itself never gains horizontal scroll
from an equation. Also checked at 1400px (desktop) to confirm the
`:has(.tag)` padding doesn't do anything unwanted when there's plenty of
room — it doesn't; equations well under the column width are untouched.

**UPDATE, post-launch (superseding point 1 above):** Pritam asked for this
reversed — a display equation that *fits* within the column must be
centered, not flush-left; only an equation that genuinely overflows should
switch to flush-left + scrollable. The unconditional `text-align: left`
above was flattening every equation to the left margin, fitting or not,
which reads wrong for the common case (most equations are short). The
underlying reason `text-align: left` existed at all — centering an
*overflowing* box starts the default scroll position in the middle of the
content, with the true left edge already scrolled past and unreachable
(`scrollLeft` can't go negative) — is still real and still needs
avoiding, so the fix can't simply revert to bare `text-align: center`
either. The actual fix: leave KaTeX's own default (`text-align: center`
on `.katex-display > .katex`, from `katex.css`) untouched, and add
`text-align: left` only inside a new `.katex-display.katex-overflowing`
rule. Nothing in the DOM knows ahead of time whether a given equation
will overflow — that depends on the rendered width of specific glyphs at
a specific column width — so this can't be done in CSS alone; `main.js`
measures each `.katex-display` right after `renderMathInElement` runs
(`scrollWidth > clientWidth`) and adds `.katex-overflowing` only when
true. Two more things had to be handled for this to actually work,
not just on first load:
- **A window resize alone isn't enough to catch every case.** The
  text-size `−`/`+` control changes `root.style.fontSize`, which changes
  every equation's rendered pixel width without the window itself
  resizing — a plain `resize` listener misses this entirely, silently
  leaving newly-overflowing equations centered (reintroducing the exact
  bug this whole section exists to prevent). Re-checking is instead done
  with a `ResizeObserver`.
- **The `ResizeObserver` must watch `.katex` (the inner element), not
  `.katex-display` (the outer one).** `.katex-display` has
  `overflow-x: auto`, so its own box is clipped to the column width no
  matter how wide its *content* gets — a `ResizeObserver` on it silently
  never fires from content-only growth (confirmed by testing: watching
  `.katex-display` missed every equation that crossed the overflow
  threshold from a text-size change alone, even though `scrollWidth` had
  visibly changed). `.katex` itself has `width: max-content; min-width:
  100%` (point 2 above, unchanged) — its own box only actually grows
  once content exceeds the column, which is exactly the transition that
  needs catching, so that's the element to observe.

The `:has(.tag)` padding-right rule (point 3 above) needed no change —
it's about reserving width, not alignment, and keeps working the same
regardless of which equations end up centered vs. left-aligned.

## 8. One deliberate gap: add localStorage in production

**The mockups keep theme / text-size / sidebar-hidden state in memory
only — it resets on reload.** This is a hard rule for anything previewed
inside the design/chat tooling this was built in (browser storage isn't
reliably available there), and does not apply to the real site. For the
actual Jekyll build, wrap the three "set" points in `base.js` with
`localStorage`:

```js
// on load
var savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
// on theme toggle
localStorage.setItem('theme', newTheme);
```

Same pattern for the text-size index and (optionally) the sidebar-hidden
state. This is the one functional change expected on top of a straight
port — everything else in `base.js` should carry over as-is.

## 9. Known placeholders to fill in (all clearly marked in the HTML)

- **Author photo** — portfolio right sidebar shows a bordered box with
  "PC" initials and a caption naming the expected path
  (`/assets/img/author-photo.jpg`). Pritam mentioned pulling this from his
  Google Scholar profile; that page couldn't be fetched programmatically
  (robots.txt), so he'll need to save the image himself.
- **GitHub / Letterboxd / YouTube links** — placeholder `#` hrefs in both
  the portfolio right sidebar and anywhere social links appear. Google
  Scholar is real (the exact URL he gave). Fill in the rest.
- **Email** — real (`pritamchandra18@gmail.com`), but it is deliberately
  **not** a `mailto:` link and **not** in the social/link list anymore. It
  shows as a plain obfuscated text line, `pritamchandra18[at]gmail[dot]com`,
  directly under the "Pritam Chandra" `<h1>` in the portfolio page's
  `.entry-head` — and it is now the *only* line there. An earlier draft
  also had a "Mathematics — Ashoka University" affiliation line above the
  email; Pritam asked for it removed, so the header is just name + email
  + rule. Keep it as plain text, not a link — that was an explicit choice,
  not an oversight.
- **Confessions poems** — entirely original filler (see §6). Replace with
  the real manuscript when available.
- **Song lyrics + duration** — `post-song-sample.html` states in its own
  body text that the lyrics are reconstructed/approximate, since the
  audio couldn't be transcribed in this tool. The real `hold-you-somehow-
  sad.m4a` file *is* embedded and does play — only the lyric text and the
  "3:5X" duration placeholder need a human pass.
- **Chord progression** — the `.chords` line above each verse/chorus
  (`G · D · Em · C`, etc.) is an invented, plausible-sounding placeholder
  progression, not transcribed from the actual recording — same caveat as
  the lyrics above. Swap in the real chords once Pritam has them.
- **Publication/preprint links** (`href="#"`) — point these at the real
  PDFs/arXiv/journal pages once hosted.
- **CV PDF** — `assets/pritam-chandra-cv.pdf`, referenced by the "Resume
  (PDF)" tag-styled link above "Elsewhere" (not a button, not a
  `.link-list` item — see §4); drop the real file at that path.

## 10. Open questions for Pritam (flag these, don't silently pick)

1. **Publications/teaching as YAML data files vs. hand-written Markdown
   lists.** This spec defaults to `_data/*.yml` (§2) because it makes
   "add one publication" a single obvious block to copy-paste and
   guarantees consistent sorting/formatting — arguably *simpler* than
   Markdown for structured, repeated records, even though it's a
   different file format than "everything is Markdown." If Pritam wants
   the letter of "editable as Markdown" more than the convenience, these
   can instead be Markdown definition lists parsed at build time — more
   fragile, more Liquid logic, worse editing ergonomics. Confirm which he
   prefers before building this part.
2. **GitHub username, Letterboxd handle, YouTube channel** — needed to
   fill in §9's placeholder links.
3. **Right sidebar of collection/book pages** — currently empty/unused
   (§5). Confirm it should stay empty rather than removed outright.
4. **Where chapter-level metadata (`chapter_title`, `chapter_intro`)
   lives for a collection** (§6) — the spec's default is "on the first
   subchapter file of that chapter, every other subchapter leaves it
   blank," which needs zero new files but is easy to get subtly wrong
   (reorder which subchapter is first, and the title silently stops
   showing up where expected). The alternative is a small
   `_data/books/<book>-chapters.yml` file, one entry per chapter, which
   is more foolproof but is one more file per book to remember to update.
   Try the front-matter approach first since it's simpler, but if it
   causes confusion in practice, switch to the data-file approach rather
   than living with it.

## 11. Accessibility notes carried over from the mockups

- Skip-to-content link (`.skip-link`), visually hidden until focused.
- `aria-pressed` on the theme/sidebar toggle buttons reflects actual
  state — keep this wired up if you change the JS.
- `Escape` closes the drawer; the scrim is clickable and has
  `data-action="close-drawer"`.
- Heading hierarchy: one `<h1>` per page (title), `<h2>` for major
  sections — including a collection's top-level chapter titles — `<h3>`
  for one level finer than that — including a collection's subchapter
  (poem) titles — and `<h4>` reserved for anything finer still. Don't
  skip levels when porting content in, and don't flatten a collection's
  two heading levels into one `<h2>` either (see §4/§6) — a subchapter
  title is structurally inside its chapter, and the markup should say so.

## 12. What NOT to change without asking

The three inspiration sites' specific fixes were the point of this
exercise — please preserve, don't "improve":

- The always-recoverable sidebar (§5) — this is the direct fix for the
  Quarto templates' broken narrow-screen behavior.
- The unified one-breakpoint-set responsive pattern (§5) — don't let a
  future page reintroduce a page-specific `data-drawer-bp` or a different
  reflow shape "because this page is a bit different"; extend the shared
  pattern instead.
- `html.sb-hidden` must never move or resize the content column, only
  hide the sidebar (§4) — this was a real bug in an earlier draft
  (hiding the sidebar visibly shifted the text left) and it's exactly the
  kind of thing a "cleanup" pass could reintroduce by adding back a
  `grid-template-columns` override.
- ~~Oblique (not italic) quotes.~~ Superseded — epigraphs are no longer
  auto-italicized at all (§13's epigraph UPDATE); this line described
  the automatic behavior that was deliberately removed, not a rule
  still in force.
- No blue navbar (the one explicit thing ruled out from the Quarto look).
- Math rendered as real KaTeX, not images (the fix for Tao's blog's
  dark-mode-unfriendly math images) — **and self-hosted, not loaded from a
  CDN** (§7); that CDN dependency is the most likely reason math and the
  nav toggles worked in one browsing context and silently didn't in
  another during review.
- The wide-margin/narrow-column layout on desktop, standard margins on
  mobile — don't let a future "responsive audit" widen the mobile
  column back out for "more space," that's an intentional brief item, not
  an oversight.
- Any in-page link inside `.drawer` closing the drawer on click (§4) — the
  drawer must never sit open on top of the content it just scrolled to.
- The footer is just the copyright line (`© 2026 Pritam Chandra.`) — no
  "Built with Jekyll, hosted on GitHub Pages" credit line underneath it.
  This was deliberately removed; don't add a build-tool attribution line
  back in for any reason (including a Jekyll theme's usual convention).
- **`<footer class="sitefoot">` lives INSIDE `<main>` — the very last
  child, right before `</main>` — not as a sibling of `.cluster`/
  `.layout-3col`/`.layout-2col` after the grid closes.** An earlier draft
  had it as a page-wide sibling, which meant its `border-top` rule and its
  centered copyright text both spanned the *entire viewport width*,
  running underneath the sidebars — Pritam's explicit correction: "the
  footer is a footer of only the main block, the sidebars are independent
  without any footers." Because `.sitefoot` itself sets no `max-width`, it
  simply fills whatever box contains it — nested inside `<main>` (which is
  already width-capped: `.col-content{ max-width: var(--content-width) }`
  on sidebar pages, or the inline `max-width: var(--content-width);
  margin: 0 auto;` on standalone posts), its rule and its `text-align:
  center`ed text both end up scoped to exactly the main content column,
  matching every other block in the prose — and the sidebars, having
  never had a footer of their own, are simply unaffected; they just end
  wherever their own content ends. Also dropped the footer's old
  left/right padding (`1.6rem 1.25rem 3rem` → `1.6rem 0 3rem`) once it
  moved inside `<main>` — that padding used to match the page-level
  `.cluster` inset for edge alignment; inside `<main>` it would instead
  indent the footer *further in* than the rest of the prose (e.g. `hr.
  rule`, which has no horizontal inset), reading as a mismatched margin.
  If you ever add a right sidebar to a new `.layout-3col` page, don't
  "helpfully" give it a closing footer element too — the design intent is
  literally one footer per page, scoped to the reading column, full stop.
- **On every page except the portfolio home**, the footer has a second,
  italicized bit of text right after the copyright line, on the same
  line: `<p>&copy; 2026 Pritam Chandra. <em>Jesu Juva</em></p>` ("Jesus,
  help" — the inscription Bach wrote at the top of his manuscripts).
  Portfolio (`index.md`/`home.html`) keeps the plain copyright-only
  footer; blog home, the collection/book pages, and both standalone posts
  all get the "Jesu Juva" line. This is a deliberate per-page-type split,
  not an inconsistency to "fix" by making all five match.

## 13. Components added after launch (not in the original five mockups)

These were added in response to direct requests from Pritam after the
initial build, not present in `portfolio.html`/`blog-home.html`/etc. —
listed here so a future session (human or Claude Code) knows they're
real, intentional site components, not scope creep to question.

- **Display-math centering** (§7's own "UPDATE" note has the full
  history) — a display equation that fits its column is centered; only
  one that overflows switches to flush-left + scrollable. This
  *supersedes* §7's original "every display equation is unconditionally
  left-aligned" fix — don't revert to that.
- **A kramdown + inline-math gotcha beyond the `_` one §7 already
  documents**: a bare `*` or `|` character inside `$...$` inline math can
  get misread as emphasis or a table, respectively — confirmed by direct
  testing, independent of the `input: GFM` setting in `_config.yml` (both
  plain kramdown and the GFM parser do this). `\[ ... \]` inside a raw
  `<div>` block is unaffected (raw HTML blocks are fully opaque to
  kramdown), so this only matters for bare inline math directly in prose.
  The fix is the same idiom LaTeX itself prefers anyway: `\ast` instead
  of a literal `*`, `\lvert ... \rvert` instead of literal `|...|`. See
  EDITING-GUIDE.md §3 for the Pritam-facing version of this.
- **`.references` / `.ref-link`** — a plain numbered bibliography
  (`<ol>` + `id="ref-1"` anchors, linked from the text via `<a
  class="ref-link" href="#ref-1">[1]</a>`), hand-written HTML, no new
  Liquid. See `_posts/2026-08-10-von-neumann-trace-inequality-notes.md`.
- **Footnotes** — kramdown's own native `[^1]` / `[^1]: ...` syntax,
  which needs no new template code at all; the CSS additions
  (`.footnotes`, `.footnote`, `.reversefootnote`) just restyle kramdown's
  own default output classes to match the site.
- **`.gallery-full` / `.gallery-float-left` / `.gallery-float-right` /
  `.gallery-video`** — three image/video layouts for post content: a
  full-column image, a smaller image with text wrapping around it
  (switches to full-width/stacked below 700px, same breakpoint as
  everything else), and a boxed 16:9 responsive video embed. Floats are
  cleared before `.prose h2`/`h3`/`.gallery-full`/`.gallery-video`, so a
  wrapped image can never bleed into unrelated content below it. Video is
  the one deliberate exception to the site's self-hosting-over-CDN
  preference (§1, §7, §12) — a video file is too large to reasonably
  self-host on a personal blog, so an external embed
  (`youtube-nocookie.com`, not the regular tracking-cookie domain) is the
  accepted approach here, unlike the KaTeX/font situation. See
  `_posts/2026-08-17-spirals-and-seeds-a-small-gallery.md` — its three
  illustrations are original self-hosted SVG line art (`assets/img/
  gallery-*.svg`), matching the existing fish-hero-art style from
  `blog-home.html`, specifically so the *images* stay self-hosted even
  though the one video doesn't.
- **Reading list** (`/reading/`, `_reading/` collection, `_layouts/
  reading.html` + `_layouts/reading-review.html`) — a diary-style list of
  books, requested directly by Pritam, modeled loosely on Letterboxd's
  "diary" view but deliberately de-featured to match this site's
  primitive aesthetic: no star ratings, no colored icons, just year (or a
  small book icon for "currently reading"), cover, title/author, and an
  optional review link. Each book is **both** a row of table data *and*,
  optionally, a full review page — one file in `_reading/` serves both
  purposes; if its Markdown body is non-empty, the collection is
  `output: true` so it gets a real page at `/reading/<slug>/`, and the
  list's "Review" link (and only then) points there. Deliberately **not**
  a real `<table>` — `.reading-row` is a 4-column CSS grid
  (year/cover/title+author/review) that collapses to 3 columns below
  480px (review link moves under the title instead of getting squeezed
  into its own column) — a literal table would need either a fixed
  layout that breaks on a phone or a horizontal-scroll escape hatch, and
  neither reads as well as this for a short diary list. Cover images are
  hotlinked from Open Library's cover service (`covers.openlibrary.org`)
  rather than self-hosted — a deliberate, explicit exception Pritam asked
  for directly ("pulled from the internet"), unlike the KaTeX/font
  self-hosting rule elsewhere on the site; a personal reading list that
  might eventually hold hundreds of entries isn't practical to self-host
  images for one at a time. The `goodreads` field is kept per-book as the
  reference link (the cover links out to it) and as the intended source
  Pritam pastes to have a future Claude Code session look up a new book's
  cover/author — see EDITING-GUIDE.md §5. **Never invent a `year` or
  `status`** for a book — these are genuinely personal facts (when Pritam
  actually finished something) that only he knows; leave `year: null`
  with a `# TODO` rather than guessing, exactly like the pending-link
  fields elsewhere in `_data/`. The "Reading List" sidebar link
  (`.reading-link`, styled like `.resume-link`) appears in **four**
  places total, per the standing sidebar rule (§4): the portfolio's
  static right aside and its drawer copy, and the blog home's static
  right aside and its drawer copy — positioned after Resume/before
  "Elsewhere" on the portfolio, and before "Timeline" on the blog home,
  per Pritam's explicit placement request.

**UPDATE to the reading list, shortly after the section above was
written:**
- **Favorites shelf** — `.reading-favorites`, a row of up to a handful of
  covers above the main list, populated by `favorite: 1`/`2`/`3`/...  on
  individual `_reading/*.md` files (independent of `order`, which is
  purely chronological). Plain flex with `flex: 1 1 0` on each item is
  what keeps every favorite on one line at any width, phone included —
  they shrink together rather than wrapping, so no separate mobile
  layout was needed here (unlike `.gallery-float-*`, which does need
  one, since that pattern intentionally changes from side-by-side to
  stacked rather than just shrinking in place).
- **Cover placeholder** — `.reading-cover-placeholder`, shown instead of
  `.reading-cover`/a favorite's `<img>` whenever `cover` is blank in the
  front matter, same idea as the portfolio's photo placeholder box, using
  the same book icon as the "currently reading" marker.
- **Sidebar link style, superseding this section's original "same small
  bordered .tag pill as the post-title pills" description**: Pritam
  asked for these plainer — icon + text, no box/border/background — so
  Resume and Reading List are now `.icon-link` (see the class definition
  near where `.resume-link` used to be defined), not `.tag`. Both class
  names (`.resume-link`, `.reading-link`) are kept as secondary classes
  alongside `.icon-link` purely as CSS hooks/history, not for any visual
  effect of their own anymore. Resume's icon is `_includes/icon-resume.html`
  (a plain document-with-folded-corner glyph, matching the book icon's
  line-drawn style); its link text was also shortened from "Resume (PDF)"
  to plain "Resume" as part of the same request.
- **A real content bug, not just a style one**: the original Open
  Library cover IDs picked for "The Brothers Karamazov" and "Devils" both
  turned out to be scans of *Russian-language* editions (blank library
  bindings, no illustration) rather than the specific English
  translations named in the front matter — confirmed by actually opening
  the images, not just checking that the URL returned a valid JPEG (it
  did; a wrong-but-valid image doesn't show up as an HTTP error). Fixed
  by searching Open Library by the specific English edition's ISBN
  instead of a generic title/author query. Worth remembering if a future
  cover ever looks "off" for a classic with many editions: the cover ID
  resolving successfully is not the same as it being the right cover —
  actually look at it.

**UPDATE, another round of direct requests from Pritam:**
- **Reading List moved into the portfolio's "Elsewhere" link list** (after
  GitHub, before Letterboxd), styled as a plain link like its neighbors —
  no icon there anymore. It's `.icon-link` (with the book icon) only in
  the two sidebar-header positions described below now; inside
  `.link-list` it's a bare `<a>`, matching Scholar/GitHub/Letterboxd/
  YouTube exactly.
- **Resume now appears twice in the portfolio's markup** —
  `.resume-link-desktop` in its original spot (inside `.col-right`,
  above "Elsewhere") and `.resume-link-merged` as the first child of
  `.col-left`, before "Contents". Only one is shown at a time via CSS,
  toggled at the 1000px breakpoint: below it, Resume needs to appear at
  the very top of the merged single sidebar column, ahead of Contents,
  per Pritam's explicit request — and since CSS Grid item promotion
  can't relocate one element between two different DOM parents at
  different breakpoints, two copies plus a display toggle was the actual
  fix, not a layout trick. **Real bug hit while building this, worth
  remembering**: the two toggle rules (base "hidden" state and the
  `@media (max-width: 1000px)` override) have equal CSS specificity
  (both single-class selectors), so which one wins is decided by *source
  order in the file*, not by which one is "more specific" to the
  situation or which one is inside a media query — a later plain rule
  beats an earlier `@media`-wrapped one regardless of viewport. Both
  rules now live directly next to each other (right by `.icon-link`'s
  own definition) specifically so this can't silently regress again by
  something else getting inserted between them.
- **Reading List moved to the blog home's LEFT sidebar** (both the
  static aside and its drawer copy), with its icon kept this time —
  sits directly below the All/Collections/Pages filter's divider line,
  above "Tags". The right sidebar there is now just "Timeline" again,
  matching the original mockup's simplicity.
- **The reading list page grew its own left sidebar** — `.layout-2col`,
  same `sidebar-sticky`/drawer/hamburger pattern as the book/collection
  pages (added `"reading"` as a case in both `nav.html` and
  `drawer.html`) — holding a Timeline of years (`site.reading`'s `year`
  values, `compact`ed so "currently reading" books with no year don't
  produce a stray blank entry, `uniq`+`sort`+`reverse`d). These are
  **filter buttons, not anchor links** (`data-reading-year="2026"` etc.,
  mirroring the blog home's `data-filter` pattern) — clicking one hides
  the favorites shelf, the "N books" count, and every row whose
  `data-year` doesn't match, leaving only that year's books; "All"
  restores everything. **Another real bug hit here, same root cause as
  above but a different symptom**: `.reading-row{ display: grid }` and
  `.reading-favorites{ display: flex }` both have an explicit `display`
  declared, which is equal specificity to the browser's own built-in
  `[hidden]{ display: none }` rule — since a page's own stylesheet loads
  after the browser's default one, the page's `display: grid` was
  silently winning over `[hidden]`, so `row.hidden = true` in JS did
  nothing visually at all. Fixed with explicit `.reading-row[hidden]{
  display: none; }` / `.reading-favorites[hidden]{ display: none; }`
  rules — needed on **any** element in this codebase that both uses the
  `hidden` attribute for show/hide *and* carries its own `display`
  override (grid/flex/inline-flex/etc.) in the stylesheet; a plain
  block-level element with no such override doesn't need this, since
  nothing competes with `[hidden]` there.
- **Margins below the full 3-column width**: `.cluster`'s left/right
  padding is now 1.5× larger any time the page can't show the full
  3-column layout — 1.875rem from 700–1000px (was the same 1.25rem as
  desktop), 2.025rem below 700px (was a flat 1.35rem). Applies to every
  page via the shared `.cluster` class, `.layout-2col` pages included,
  not just `.layout-3col` ones — Pritam's explicit "universally" scope.

**UPDATE, superseding the Resume dual-copy approach above:** Pritam
changed his mind on where Resume permanently lives — not a
breakpoint-dependent relocation at all anymore. It's now a single,
ordinary instance in the **left** sidebar, between the Contents nav and
the "Interests" paragraph (drawer copy: same relative spot, at the end
of the Contents `drawer-section`, since the drawer never duplicated
"Interests" separately). The `.resume-link-desktop`/`.resume-link-merged`
dual-copy CSS toggle described above is gone entirely — deleted, not
just unused — since there's only one copy of the link now and it never
needs to move: it's part of the *left* sidebar's content, which was
never the side that reordered at the 1000px merge point in the first
place (only the *right* sidebar's content — photo aside, Elsewhere +
link list — merges underneath it, exactly as it always did before the
Resume-relocation experiment). The right sidebar is back to being just
photo/caption + "Elsewhere", i.e. exactly what it was before any of
this Resume back-and-forth started.

**UPDATE, reading list page — the `.layout-2col` sidebar approach above
was scrapped**, not fixed. Pritam wanted the reading list to behave like
a standalone post (single centered content column, `.cluster > main`,
no grid, no sidebar-related breakpoint at all) at *every* width, with
Timeline access being a drawer *only* — available and working
identically whether the viewport is 300px or 3000px, not gated to "below
700px" the way the drawer normally is elsewhere on the site. Two things
made this work:
- The page markup dropped `.layout-2col`/`.col-sidebar` entirely — it's
  now structurally identical to `_layouts/post.html` (plus the hamburger
  button, which post pages don't have at all).
- The hamburger button on this page carries a new `data-drawer-always`
  attribute (set via a `drawer_always` flag in `nav.html`'s per-layout
  case statement). `base.js`'s toggle-sidebars click handler checks for
  this attribute alongside its existing `isMobile()` check — if either
  is true, it opens the drawer; only when neither is true does it fall
  back to toggling `sb-hidden` (which would be a no-op here anyway,
  since there's no `.col-sidebar` on this page for `sb-hidden` to hide).
  This is the first page on the site where the drawer is reachable above
  700px at all — every other drawer is strictly a <700px fallback for a
  grid sidebar that's visible above that width. If a future page ever
  wants "sidebar content, but only ever as a drawer, at any width"
  again, this is the mechanism to reuse: no grid column, plus
  `data-drawer-always` on that page's nav case.

**UPDATE, Resume's style reverted back to a box** (superseding the
"plain icon + text, no box" note above — that change stood for exactly
one round before Pritam asked for the box back): Resume is `.tag
resume-link` again, not `.icon-link` — literally the same pill as a
topic tag under a post title, sized to its own content rather than
stretched across the sidebar, with the icon now living inside that box
instead of beside a boxless link. Reading List is unaffected — it's
still `.icon-link` (no box), since this request was specifically about
Resume only. Two spacing details worth knowing if this area gets
touched again:
- **Desktop sidebar**: `.col-left .resume-link{ margin: 0 0 2rem; }`
  exists specifically so the gap above Resume (under the Contents list)
  equals the gap below it (above "Interests") — both 2rem, matching the
  Contents `<ul>`'s own existing `margin: 0 0 2rem` inline style. This
  was a direct, explicit request ("the first gap is smaller, make it
  the same") — don't let a future change to the `.tag` component's own
  margin (it doesn't currently have one) silently reintroduce a
  mismatch here.
- **Drawer**: `.drawer .resume-link{ font-size: 1rem; margin: 1.2rem 0
  1.4rem; }` overrides `.tag`'s own `.74rem` — inside the drawer, Resume
  sits among plain `1rem` sans links (the Contents/Elsewhere list items
  have no size override), so the bare `.tag` size read as noticeably
  smaller than its neighbors; sized back up to match. The drawer's
  Contents section also now includes "Interests" (heading + the same
  paragraph as the static sidebar) — it never did before this round.
  Pritam's framing is worth remembering for any *future* sidebar
  content, not just this one fix: **the drawer's content should always
  equal the union of both static sidebars** (i.e., exactly what the
  700–1000px merged single column shows), just presented as a popover
  instead of a static column. If a new right-sidebar item is ever added
  to a `.layout-3col` page, it needs a matching drawer copy for this
  reason, same as every other sidebar item on the site already does.

**UPDATE — author photo now actually wired up, and a fuller account of
the kramdown escape-character gotcha.**

- **Author photo**: `home.html`'s right sidebar previously hardcoded the
  `<div class="portrait">PC</div>` placeholder unconditionally — dropping
  a real `author-photo.jpg` into `assets/img/` never did anything,
  because nothing in the template ever checked for the file or rendered
  an `<img>` for it. Real, live bug, caught only because Pritam actually
  tried it. Fixed with `{% assign author_photo = site.static_files |
  where: "path", "/assets/img/author-photo.jpg" | first %}` — Jekyll
  exposes every non-processed file as a `Jekyll::StaticFile` in
  `site.static_files`, each with a `.path` relative to the source root,
  so this is a real existence check, not a guess. When found, renders
  `<img class="portrait" src="...">` (new `img.portrait{ object-fit:
  cover }` CSS rule) instead of the placeholder div + its caption. The
  general lesson: **any "drop a file here and it'll show up" instruction
  in EDITING-GUIDE.md needs a template that actually checks for the
  file** — a hardcoded placeholder with no conditional is a silent trap,
  identical in spirit to the `[hidden]`-vs-`display` bugs found earlier
  this session, just at the template level instead of the CSS level.

- **The kramdown inline-math escape gotcha (§13's `*`/`\|` note) is
  bigger than originally documented.** Tested systematically: kramdown
  strips a backslash immediately before any of `\` `` ` `` `*` `_` `{`
  `}` `[` `]` `#` `+` `-` `.` `!` `~` when it's processing Markdown —
  which includes bare `$...$` math sitting in ordinary prose, *not* just
  a `markdown="1"` div. Confirmed corrupted in this codebase's own
  testing: `\#` → `#` (breaks Ando's geometric-mean notation, used
  throughout the operator-fidelity post — verified the *shipped* post is
  actually safe only because every `\#` in it happens to sit inside a
  `.thm`/`.proof`/display-math raw block, never bare in prose) and `\!`
  → `!` (breaks negative-thin-space spacing, used constantly in serious
  LaTeX). `\{`/`\}` are also stripped, though bare unescaped `{`/`}`
  (grouping, e.g. `A^{-1}`) are completely unaffected — only the
  *escaped* literal-brace form is at risk. The `*`/`\|` risk specifically
  needs a *pair* of them in the same paragraph to trigger (Markdown
  pairs them up as emphasis/table syntax); a lone one is harmless. The
  `\#`/`\!`/`\{`/`\}` risk is different — it's Markdown's *own* escape
  syntax firing, not a pairing issue, and it fires on every single
  occurrence, not just paired ones.
- **Considered and rejected**: using kramdown's `markdown="1"` attribute
  on `.thm`/`.proof` divs to get automatic `<p>` wrapping and avoid
  hand-typing HTML. This does work for the prose (verified: `**bold**`,
  numbered lists, auto-`<p>` all work correctly with `markdown="1"`) —
  but it re-enables the exact escape-stripping bug above for anything
  inside the div, which is a bad trade for a mathematician's blog where
  `\#`/`\!` are common. Decided to keep `.thm`/`.proof` as plain raw
  HTML (hand-written `<p>` tags) as the *documented default* rather than
  switch, but EDITING-GUIDE.md §3 explains the tradeoff honestly and
  offers `markdown="1"` as an opt-in for a specific box Pritam is sure
  has no risky math in it, rather than silently deciding for him either
  way.

**UPDATE — a real gap found while answering a question about blank
front-matter fields.** Pritam asked whether an unwanted field should be
left as `key:` or `key: ""`. The answer matters more than it looks:
Liquid's truthiness treats `nil` (what `key:` with nothing after it
parses to) as falsy, but an empty string (`key: ""`) as **truthy** —
`{% if page.subtitle %}` is `false` for the former, `true` for the
latter. Checking the actual codebase for this turned up one real bug:
`_layouts/book.html`'s `<p class="entry-meta">{{ page.subtitle }}</p>`
had no `{% if %}` guard at all, unlike `page.note` right below it (which
already had one) — so a book with no `subtitle` would render an empty,
gap-leaving `<p>` rather than nothing. Fixed (`{% if page.subtitle
%}...{% endif %}`), and did the same audit on `entry.preview` in
`blog-home.html`/`tag.html`, which had the identical gap. General rule
worth remembering for any *future* optional field added to a template:
**every field that's allowed to be blank needs an explicit `{% if %}`
around the element it renders into** — printing `{{ page.field }}`
directly into a `<p>`/`<div>` with no guard will always leave a
gap-shaped hole once that field is actually left blank, even though it
looks harmless while every real page still has a real value there.

**UPDATE — `page.note` (a book's editorial note, `_layouts/book.html`)
switched from raw HTML to real Markdown.** Came up while answering
Pritam's follow-up question about writing newlines and quotation marks
inside `note:`. The field was originally `<p class="book-note">{{
page.note }}</p>` — `{{ }}` with no filter prints the string completely
literally, so it was never Markdown at all; the Confessions sample note
only worked because it happened to be written as raw HTML by hand
(`<em>...&mdash;...</em>`). That made Pritam's actual question genuinely
awkward to answer well: a YAML double-quoted flow scalar can hold a
literal quote mark, but only by backslash-escaping it (`\"`), and a
"newline" typed into it doesn't produce a visible line break in the
output at all (no `white-space: pre-line` on `.book-note`, and no
paragraph-splitting logic downstream) — it would've been correct but
clunky advice.

Fixed at the template level instead of just documenting the workaround:
`{% if page.note %}<div class="book-note">{{ page.note | markdownify
}}</div>{% endif %}` — swapped the wrapping tag from `<p>` to `<div>`
(a `markdownify`'d multi-paragraph note produces its own `<p>` tags,
and `<p>` can't legally contain another `<p>`), and added `| markdownify`
so the field is processed as real kramdown, same as every other body of
prose on the site. Verified safe for the existing Confessions note (raw
HTML passes through kramdown completely untouched, confirmed byte-for-
byte identical output before/after) and verified with a direct kramdown
CLI test that this newly enables exactly what was asked: literal `"`
quotes with zero escaping, and blank-line-separated paragraphs that
render as real, separate `<p>` tags — using YAML's `|` block-scalar
syntax (see EDITING-GUIDE.md §4) rather than a quoted one-liner. Added
`.book-note p{ margin: 0 0 1em; } .book-note p:last-child{ margin-bottom:
0; }` to `main.css` right after `.book-note` itself, since a multi-
paragraph note now needs the same last-child margin reset already used
elsewhere on the site (e.g. `.prose li:last-child`) so the block's own
`padding-bottom`/`border-bottom` doesn't end up with extra trailing
space stacked under a paragraph's own default bottom margin.

This is the same category of gotcha as `.thm`/`.proof`'s deliberate
raw-HTML choice above, just resolved the other way: `.thm`/`.proof`
stayed raw HTML because they're the one place on the site genuinely
likely to contain `\#`/`\!`-style escaped LaTeX, where kramdown's
escape-stripping is a real risk. `note` is a short editorial aside, not
a place serious LaTeX would ever live, so the trade favors real Markdown
there — flag it if a future book's note ever needs an escaped `\#` or
`\!` in prose, same caveat as §7/§13's other kramdown-escape notes.

**UPDATE — `sub.epigraph.text` (a subchapter's epigraph, also
`_layouts/book.html`) given the same Markdown treatment as `note`,
immediately after, when Pritam asked the natural follow-up: does the
same fix apply to epigraphs too, since he wants quotation marks and
bold there as well. Same underlying problem (`{{ sub.epigraph.text }}`
printed with no filter, so no Markdown at all, and any `"` in a quoted
YAML flow scalar needed backslash-escaping) but a different fix shape,
because of one constraint `note` didn't have: **the template itself
wraps the whole epigraph in curly smart quotes**
(`<p>&ldquo;{{ ... }}&rdquo;</p>`), and that wrapping `<p>` is
hand-written, not `markdownify`'s own output — so naively changing this
to `{{ sub.epigraph.text | markdownify }}` the same way `note` was
fixed would nest a kramdown-generated `<p>...</p>` inside the
hand-written one (invalid HTML: a `<p>` can't contain a `<p>`) *and*
strand the &ldquo;/&rdquo; entities outside of it, printed as bare text
before/after the paragraph rather than as its first/last visible glyph.

Fixed by running `sub.epigraph.text` through `markdownify` in its own
`{% assign %}` first, then stripping kramdown's own `<p>`/`</p>` wrapper
back off with two `| remove:` filters before splicing the result into
the hand-written `<p>&ldquo;...&rdquo;</p>`:
```liquid
{% assign epigraph_html = sub.epigraph.text | markdownify | strip | remove: '<p>' | remove: '</p>' %}
<p>&ldquo;{{ epigraph_html }}&rdquo;</p>
```
This keeps `**bold**`/`*italic*` and un-escaped `"` working inside the
epigraph (verified via a direct kramdown CLI test: `<strong>`/`<em>`
tags and curly `"..."` render correctly, then get sliced out of their
auto-`<p>` cleanly by the `remove` filters) while still producing valid,
single-`<p>` HTML with the site's own smart quotes wrapped around the
*outside* of whatever Markdown rendered on the inside. Verified this is
also fully backward-compatible with the existing Confessions epigraphs,
which are hand-written with HTML entities (`&mdash;`) rather than plain
punctuation — rebuilt the site and diffed the rendered
`<div class="epigraph">` blocks for both existing epigraphs
byte-for-byte against their pre-change output; identical.

**This `markdownify` + `remove: '<p>'`/`remove: '</p>'` pattern is the
one to reach for any time a future field needs inline Markdown
(bold/italic/smart-quotes/etc.) spliced into a *hand-written* wrapper
element** (as opposed to `note`, which owns its whole wrapper and could
just switch that wrapper from `<p>` to `<div>` outright) — it only
holds up for genuinely single-paragraph content, since a second
paragraph in the source would produce a second `<p>...</p>` that this
approach doesn't know how to un-nest, so `epigraph.text` is documented
in EDITING-GUIDE.md as a one-paragraph-only field, unlike `note`.

**UPDATE, immediately superseding the block above — the auto-added
smart quotes and automatic oblique italic are both gone; both are now
manual, by Pritam's explicit request.** His reasoning: the whole point
of wanting quotation marks *inside* an epigraph is to quote a real
source directly, and a real quotation very often needs its own nested
quote marks (a quote within the quoted passage) — automatically
wrapping the *entire* epigraph in the site's own curly quotes made that
impossible to do cleanly (nested `&ldquo;...&ldquo;...&rdquo;...&rdquo;`
reads wrong, and there's no clean way to vary the inner/outer quote
style — e.g. `"..."` outside, `'...'` inside — when the outer pair is
being added by the template rather than typed). Likewise, the automatic
`font-style: oblique 10deg` meant Pritam had no way to write an epigraph
that *wasn't* italicized, or to italicize only part of one.

The fix removes both mechanisms from the template/CSS, moving the
choice entirely into what Pritam types in `text:`:
```liquid
{% if sub.epigraph %}
<div class="epigraph">
  {{ sub.epigraph.text | markdownify }}
  <cite>{{ sub.epigraph.cite }}</cite>
</div>
{% endif %}
```
This is *simpler* than the block it replaces, not just different — the
`&ldquo;`/`&rdquo;` hand-wrapping is gone, and with it the whole reason
the previous fix needed `remove: '<p>'`/`remove: '</p>'` to unwrap and
re-wrap kramdown's own `<p>` tag: there is no hand-written wrapper left
to collide with, so `markdownify`'s own `<p>...</p>` output is used
directly and satisfies the existing `.epigraph p` CSS selector on its
own. One consequence worth naming: the "single paragraph only" limit
documented in the block above was a symptom of that now-deleted
`remove` trick, not a real requirement — a multi-paragraph epigraph
would technically work fine today (each resulting `<p>` gets the same
centered styling). Epigraphs are still described as one short quote by
convention/design, just not enforced by the markup anymore.

CSS: `.epigraph p{ font-style: oblique 10deg; ... }` had the
`font-style` declaration removed entirely — `.epigraph p` is now plain
centered/muted text with no automatic slant. `text-align: center` and
the `.epigraph`/`.epigraph cite` block's indentation/attribution
styling are all unchanged; only the auto-italic and auto-quotes were
in scope for this request.

Because the two existing Confessions epigraphs relied on the automatic
italic to get their look, and Pritam asked to keep their current
*appearance* even though the mechanism is now manual, both
`_books/confessions-i-2-what-i-did-not-say-at-fifteen.md` and
`_books/confessions-ii-1-letter-to-an-old-belief.md` had their
`epigraph.text` wrapped in a literal `*...*` by hand (kramdown turns
this into `<em>`, and `.prose em{ font-style: italic; }` — already
defined site-wide, unchanged — picks it up) so the rendered page looks
identical to before this change. This is a real, deliberate departure
from the original "oblique, not italic" font distinction described at
the top of this section: that distinction only ever mattered while the
site was choosing the font-style *for* Pritam automatically; now that
he's choosing it himself with plain `*text*`, it renders as ordinary
`<em>`/italic like anywhere else in the prose, not the special oblique
variant, and that's an accepted tradeoff of moving control to him, not
an oversight to fix later. If a future epigraph wants no italics at
all, or wants only part of the line italicized, or wants a nested
quotation (e.g. `text: |` block with `"she said, 'I meant it,'" he
wrote` inside it), all of that now works directly by typing it, no
template change needed — see EDITING-GUIDE.md §4 for the reworded
instructions.

**UPDATE — the "chapterless book" case described in §6/§4 was never
actually implemented, and a real second book (a new collection, called
"Confession," singular — not a chapter added to "Confessions") hit the
gap immediately.** Pritam added `blog/confession/index.md` (correct,
`book_slug: confession`) and a piece,
`_books/confession-1-wicked-seed.md` (correct, `book: confession`,
`order: 1`, `slug: 1`, no `chapter:`/`chapter_order:` — exactly per
spec for a book with "just pieces," his own term), then reported the
piece wasn't showing up. Nothing in his front matter was wrong; the bug
was structural, in both `_layouts/book.html` and
`_includes/book-toc.html`, which had only ever been written for the
chaptered case:
```liquid
{% assign chapters_data = site.data.books[chapters_data_key].chapters %}
{% for ch in chapters_data %}
  ...only place any piece is ever rendered...
{% endfor %}
```
Since a chapterless book correctly has no
`_data/books/<slug>-chapters.yml` file at all, `chapters_data` is
`nil`, and `{% for ch in chapters_data %}` silently iterates zero
times — not just skipping that one piece, but skipping *the entire book
body and its whole Contents list*, no matter how many correct pieces
exist in `site.books` for it. Confirmed by inspecting the built output
directly before touching any template code: `Wicked Seed`'s title,
epigraph, and verse were completely absent from
`_site/blog/confession/index.html`, and both copies of `.book-toc`
(static sidebar + drawer) rendered as empty shells with zero `<li>`s.
This is exactly the gap CLAUDE.md §6 predicted in its original spec
text ("a book that doesn't need chapters... render[s] a flat list of
`.subchapter` sections with no wrapping `.chapter`") but which was
never actually built, since Confessions — the only book that existed
until now — always used chapters, so the untested code path sat there
looking plausible until a second, chapterless book actually exercised
it.

Fixed by giving both templates a real `{% if chapters_data %} ... {%
else %} ... {% endif %}` split. The `{% else %}` branch in
`book.html` loops `subchapters` directly (no chapter grouping),
rendering each as a bare `.subchapter` section numbered by its plain
position (`{{ forloop.index }}`, matching `order`'s own 1, 2, 3...),
carrying over epigraph/content/gloss handling unchanged from the
chaptered branch. `book-toc.html` got the matching flat `{% else %}`:
one top-level `<li>` per piece, no `ul.toc-sub` nesting, per §4's
existing (and, until now, also untested) description of that case.

**One deliberate accessibility fix made while building this, not just
a mechanical copy of the chaptered branch**: the flat branch's piece
title is `<h2>`, not `<h3>` like a normal subchapter. In the chaptered
case, `<h3>` is correct because it sits one level under the chapter's
own `<h2>` (§11's "don't skip heading levels" rule). In a chapterless
book there is no chapter `<h2>` at all — the piece is the first
heading-bearing content under the page's own `<h1>` — so keeping it at
`<h3>` would silently skip a level. This meant `.subchapter-head h3`'s
CSS rule (font size, weight, family — the "subchapter" visual
treatment) needed extending to `.subchapter-head h2, .subchapter-head
h3` so a flat-book piece keeps the exact same look despite the
different tag. Verified both books render correctly and independently
after this change: Confessions' existing chapter/subchapter structure
is byte-for-byte unchanged (`<h2>Before</h2>` / `<h3>Prayer Before the
First Line</h3>` still present), and Confession's one piece now renders
with `<h2>Wicked Seed</h2>`, its epigraph, and its Contents entry
("1 — Wicked Seed"), confirmed both in the built HTML and visually in
the browser.

**UPDATE — three small, related design changes to `_layouts/book.html`,
all requested together right after "Wicked Seed" first went live: the
epigraph moved above the title, `cite` lost its automatic dash, and
`subtitle` got the same Markdown treatment as `note`/`epigraph`.**

1. **Epigraph now renders *before* the subchapter/piece header, not
   after it** — in both the chaptered branch and the flat (chapterless)
   branch added just above. The header (`.subchapter-head`, numeral +
   title) is now immediately followed by `{{ sub.content }}`, with no
   epigraph in between. This is a pure reordering of the same three
   blocks (epigraph / header / content) — no new Liquid logic, no CSS
   changes needed for the reorder itself (each block's own margins
   already made sense in either order).

2. **`.epigraph cite::before{ content: "\2014 "; }` — the CSS rule that
   auto-prepended an em dash to every citation — was deleted outright.**
   `cite` now renders exactly what's typed in `epigraph.cite`, nothing
   added. Pritam's own reasoning: he wants to choose per-epigraph
   whether a dash appears at all, not have one forced on every citation.
   Since the two existing Confessions epigraphs relied on the automatic
   dash to get their current look, both had `&mdash; ` (matching the
   entity style already used elsewhere in those same files, e.g. the
   Confessions `note`) hand-typed onto the front of their `cite:` field
   — same "preserve existing appearance by making the old automatic
   behavior explicit" move already made twice before in this file, for
   epigraph italics and for the CDN removal precedent. `cite` is still
   *not* run through Markdown (only `epigraph.text` and `note`/`subtitle`
   are) — it's a short attribution line, raw text is sufficient, and
   there was no request to change that.

3. **`page.subtitle` (shown under the book's `<h1>`) now goes through
   `markdownify`, matching `note`.** Was `<p class="entry-meta">{{
   page.subtitle }}</p>` (raw, unguarded against nested-`<p>` — though
   this was never actually hit before since subtitle was always one
   plain sentence with no HTML in it); now
   `<div class="entry-meta">{{ page.subtitle | markdownify }}</div>` —
   same wrapper-swap trick as `note` (§13's earlier UPDATE), for the
   same reason (`markdownify` produces its own `<p>`, which can't nest
   inside another `<p>`). Added `.entry-meta p{ margin: 0; }` right
   after `.entry-meta`'s own definition in `main.css`, since
   `.entry-meta` already carries its own `margin-bottom: .9em` and the
   auto-generated inner `<p>` would otherwise add its own default
   browser margin on top of that. This CSS rule is scoped to only fire
   when there's an actual nested `<p>` (i.e. only the book-subtitle
   case) — every other `.entry-meta` usage on the site (post dates, tag
   lines, the portfolio's plain-text email line) uses `<p class="entry-
   meta">` directly with no child `<p>`, so they're unaffected. Verified
   Confessions' existing subtitle ("poems, 2024–2026") renders
   byte-for-byte equivalent visually before/after (wrapped in kramdown's
   auto-`<p>` now, but no visible spacing change, confirmed in the
   browser).

Note this was a deliberate, narrow scope: Pritam separately asked
whether the book page's `description:` field (the invisible SEO `<meta
name="description">` tag) should also take Markdown, and was told no —
that field is plain text only, since a meta description can't contain
rendered HTML (search engines would show literal asterisks) — and
confirmed he meant `subtitle`, not `description`. `description` is
unchanged.

**UPDATE — top-level Contents entries (a chapter's title, or a piece's
title in a chapterless book) are no longer bold.** The rule was
`.book-toc > ul > li > a .chapter-title{ font-weight: 600; }` in
`main.css`, meant to read "slightly heavier than their subchapters" —
Pritam asked for it gone across the board, both for books with chapters
(Confessions' "Before"/"After") and books without (Confession's
"Wicked Seed", "Blemishes", "Sensualists", each its own top-level entry
per §13's chapterless-book fix above). Removed the `font-weight`
declaration entirely rather than zeroing it out, since `font-weight:
600` was the only thing that rule did. The extra `margin-bottom: 1.3em`
on `.book-toc > ul > li` (more breathing room before the next
chapter/piece's group) was left alone — only the bold was in scope.

**UPDATE — the nav bar's icon/text-size/theme buttons sat too close to
the top and bottom of the sticky nav bar.** `.sitenav` has a fixed
`height: 52px` (unchanged, per Pritam's explicit request not to grow
the bar); the buttons themselves (`.nav-btn`) had `min-width: 2.1rem;
min-height: 2.1rem`, leaving only ~7px of clearance above/below each
button inside the 52px bar. Shrunk the buttons instead of the bar:
`.nav-btn`'s `min-width`/`min-height` dropped to `1.85rem`, and
`.size-ctl .nav-btn`'s narrower override dropped from `2rem` to
`1.75rem` to keep the segmented −/+ control visually matching the new
icon-button size. Verified via computed styles in the browser: nav bar
still exactly 52px, button height went from 37.8px to 29.6px, vertical
clearance above/below each button went from ~7.1px to ~11.2px per
side.

**UPDATE — a round of portfolio changes, plus the blog's nav mark.**

1. **No underlines on the portfolio page, colors alone signal a link.**
   Explicitly scoped to the portfolio, not site-wide: `default.html` now
   sets `class="page-home"` on `<body>` only when `page.layout ==
   "home"`, and `main.css` has `.page-home #main a, .page-home
   .col-sidebar a{ text-decoration: none; }` plus `.page-home .link-list
   a{ border-bottom: none; }` (`.link-list`, the right sidebar's
   "Elsewhere" links, used a border-bottom as its underline rather than
   `text-decoration`, so it needed its own line). The global `a{
   text-decoration: underline; ... }` rule near the top of `main.css` is
   untouched — the blog still underlines links as before. If this
   experiment doesn't stick, deleting the `.page-home` block (and the
   body-class line in `default.html`) fully reverts it.

2. **Real bug: the "Interests" line in the drawer had drifted out of
   sync with the static left sidebar.** Pritam had reordered it (moving
   "machine learning theory" before "post-quantum cryptography") in the
   static `.col-left` copy in `home.html`, but the mirrored copy in
   `drawer.html` — which is what narrow screens actually show — still
   had the old order (and a capitalization mismatch: "Matrix analysis"
   vs. "matrix analysis"). This is exactly the failure mode §13 already
   warned about elsewhere on this page ("the drawer's content should
   always equal the union of both static sidebars") — there's no single
   source of truth for sidebar text, so a static aside and its drawer
   copy can silently diverge if only one gets edited. Fixed by copying
   the static copy's text verbatim into the drawer. **Then hit the
   identical bug two more times in the same sitting** — once adding
   ORCID (next item): added it to the static `.link-list` in
   `home.html`, initially forgot `drawer.html` entirely. Once reordering
   the Contents nav for the section-order change (item 3, below):
   reordered the `<li>`s in `home.html`'s `nav.toc`, again initially left
   `drawer.html`'s copy in the old order. Both caught only by diffing the
   *rendered* text of both copies in the browser (`.col-left`'s TOC/
   Interests/link-list vs. `.drawer`'s), not by re-reading the diff or
   inspecting source — the mistake is invisible in a source diff of just
   the file you actually edited, because the bug by definition is in the
   file you *didn't* touch. Three instances of the same slip in one
   session is a strong signal, not a coincidence: treat "did I update
   the drawer copy too" as a mandatory check, not an optional one, on
   every future `.col-left`/`.col-right` edit in `home.html` — verify by
   rendering and comparing both, every time, not by memory.

3. **Section names and order.** Headings: "Journal Publications" →
   "Select Journal Publications", "Preprints & Working Papers" →
   "Select Preprints and Working Papers", "Select Notes" → "Select
   Lecture Notes". "Academic Service" and "Teaching Experience" keep
   their text. Section order (both the `<section>` blocks in `home.html`
   and the Contents `<nav class="toc">` list, in the static sidebar and
   the drawer) is now About, Journal Publications, Preprints, Teaching,
   Lecture Notes, Academic Service — Teaching moved up from last to
   third, Notes and Service swapped after it. The Contents nav *link
   text* was deliberately left as the short forms ("Notes", not "Select
   Lecture Notes") — this page already had that asymmetry (nav said
   "Notes", the heading already said "Select Notes", before this update
   touched either), so the new section names just extend an existing
   convention rather than introduce one.

4. **ORCID added** to `_data/social.yml` and both `.link-list`s, right
   after GitHub, before Reading List — same conditional-render pattern
   as the other social links (`{% if site.data.social.orcid %}`), so a
   missing value degrades to "link not shown," not a dead link.

5. **Teaching Experience is text now, not the `.teaching-table` table.**
   The table markup and its `{% for t in site.data.teaching %}` loop are
   still in `home.html`, wrapped in `{% comment %}...{% endcomment %}`
   rather than deleted, since Pritam may want the
   data-file-driven-table pattern again elsewhere — `_data/teaching.yml`
   itself is untouched. In its place: `{% capture teaching_text %}{%
   include teaching-description.md %}{% endcapture %}{{ teaching_text |
   markdownify }}`. The new `_includes/teaching-description.md` is plain
   Markdown (deliberately not YAML, so it reads/edits like prose, not
   data) — see EDITING-GUIDE.md §2 for how to edit it. Rajendra Bhatia's
   name links via `{{ page.bhatia_link }}`, reusing the same front-matter
   value `index.md` already sets for his name elsewhere on the page —
   confirmed `page.*` front-matter variables resolve correctly from
   inside an `{% include %}`'d file, not just the page that includes it
   directly. Abhishek Khetan's name links to `#` — a real placeholder,
   not a broken oversight; swap it for his actual page once Pritam has
   a link he wants to use.

6. **The blog's nav mark is now "1⁄ε" (a slanted fraction), not "Pritam
   Chandra"/"PC" — the portfolio and reading pages keep the name.** This
   is the blog's actual name ("one over epsilon" — also the Letterboxd
   handle in `social.yml`), typeset as a real slanted/nice fraction: a
   raised, reduced numerator, the Unicode fraction-slash character
   (`⁄`, U+2044 — not a plain `/`), and a normal-baseline denominator —
   deliberately not a stacked `\frac`-style fraction, and not built with
   KaTeX (this is nav-bar chrome, not page content). Markup and CSS are
   both in `nav.html`/`main.css`: `.frac`/`.frac-n`/`.frac-d` sized in
   `em` off the surrounding `.nav-sitename` font-size, so it scales
   correctly with the nav's own font-size and with dark/light mode
   (inherits `color`, not set separately). `nav.html` picks the mark via
   a new `brand` variable (`"frac"` or `"name"`) in the same per-layout
   `{% case page.layout %}` block that already set `sitename_href` —
   the two turned out to already be the same split (`brand: "frac"`
   exactly where `sitename_href` was already `"/blog/"`: blog-home,
   book, and the post/tag/reading-review `else` branch; `brand: "name"`
   where it was already `"/"`: home and reading), so no new
   per-layout-type decision was actually needed, just reusing the
   existing one. No `.short`/narrow-screen variant — unlike "Pritam
   Chandra"/"PC", "1⁄ε" doesn't need one, it's already short at any
   width. Verified via computed styles in the browser (numerator ~72%
   size raised ~0.5em, denominator ~88% size on the baseline) and via
   curl across one page of each layout type (home, reading, blog-home,
   book, a post, a tag page, a reading-review page) to confirm the
   split lands on the right side for each.

**UPDATE — visited-link color, a mild scrollspy highlight, and a few
more underline removals.**

1. **Visited links no longer change color.** Originally scoped to just
   the portfolio (`.page-home a:visited`), matching how the underline
   removal above was scoped — but Pritam reported visited links still
   changing color on the blog shortly after, meaning he wanted this
   site-wide, not portfolio-only. Now a plain `a:visited{ color:
   var(--link); }` in `main.css`, overriding the original `a:visited`
   rule near the top of the file by source order (both are the same
   specificity, so the later one in the file wins — no `!important`
   needed). `--link-visited` is still defined in the color tokens,
   just unused now; left in rather than deleted in case a future page
   wants the distinction back.

2. **The Contents sidebar now mildly highlights whatever section is
   currently in view while scrolling** — both the static `.col-left`
   copy and its drawer mirror update together (one shared
   `IntersectionObserver` in `main.js` toggles `.current` on every
   `.toc a` whose `href` matches, in both copies at once, not just
   whichever one happens to be visible). Styling is deliberately
   restrained — Wikipedia's TOC highlighting was named as the explicit
   "too much" reference point: just a color shift to `--accent` and a
   thin 2px left border stripe (`.toc a.current` in `main.css`), no
   background tint, no bold. Every `.toc a` (not just `.current`) carries
   a transparent `border-left` + matching `padding-left`/negative
   `margin-left` at all times, so the text doesn't visibly shift
   sideways the moment a section activates — only the border's color
   changes, not the layout. Scoped to `.toc` specifically (`.book-toc` on
   book pages is a different class, untouched — this wasn't asked for
   there).

   **Testing note for future sessions**: this could only be partially
   verified live. The observer's *initial* firing (setting `.current` on
   "About" at page load) was confirmed working, and the CSS's own
   correctness was confirmed by manually toggling the `.current` class
   by hand and screenshotting the result (clean, mild highlight, exactly
   as intended). But *dynamic* re-firing on scroll could not be
   confirmed in the browser tooling used for this session —
   `document.visibilityState` reported `"hidden"` throughout, which is
   what actually explains it (browsers correctly suspend
   `IntersectionObserver` notifications, `requestAnimationFrame`, and
   scroll-driven animation for a page that isn't genuinely foregrounded,
   screenshots or no) — matching an already-documented limitation
   elsewhere in this project's history with `scroll-behavior: smooth` in
   the same tooling. Not a sign of a real bug; just something that has
   to be checked by hand in an actual browser rather than assumed fixed
   from a screenshot.

3. **More underline removals, same border-bottom-as-underline pattern as
   `.link-list`/`.tag-cloud` already established:**
   - `.nav-link` (the "Blog"/"Website"/"All posts" cross-link) — site-
     wide, not scoped, since it's the one shared element regardless of
     which page/wording is showing.
   - `.tag-cloud a` (the blog sidebar's tag list) — blog-only by
     construction, since `.tag-cloud` doesn't exist on the portfolio.
   - `.timeline a`/`.timeline button` (the year links/reading-year
     filters) were deliberately **left untouched** — a completely
     separate rule already, so removing `.tag-cloud`'s underline doesn't
     touch it, confirmed still underlined both at full width and at the
     ~700-1000px breakpoint where the timeline merges into the left
     sidebar column (a pure layout reflow — the merge doesn't change
     which CSS class governs the link, so nothing extra was needed to
     "maintain" this, it already held).

4. **The blog's "1⁄ε" mark is bigger** — `.frac{ font-size: 1.4em; }`
   (up from inheriting `.nav-sitename`'s own size directly), sized off
   `.nav-sitename` like before so it still scales with the nav's own
   font-size; `.frac-n`/`.frac-d`'s own relative sizing (`.72em`/`.88em`
   off `.frac`) is unchanged, so the numerator/denominator proportions
   look the same, just bigger overall.

**UPDATE — visited-link fix wasn't complete, plus real link support in
publication/note/service subtext.**

1. **The underline-removal experiment above missed the drawer.** Pritam
   reported underlines still showing on the left sidebar in narrow-
   screen mode. Cause: `.page-home #main a, .page-home .col-sidebar a`
   only reaches the static sidebars — `.drawer` is a sibling off-canvas
   panel, not a descendant of `.col-sidebar`, so its mirrored Contents
   links were never in scope. Added `.page-home .drawer a` alongside the
   other two selectors. This is the same "two copies, one CSS rule
   forgotten" mistake as the earlier JS/content drift bugs, just on the
   CSS side — worth remembering that the drawer needs checking whenever
   *any* portfolio-scoped rule is added, not just content edits.

2. **`authors`, `venue` (publications/preprints/notes), and `description`
   (service) now run through `markdownify`**, so they can hold a real
   `[text](url)` link instead of just plain text — Pritam asked for this
   generally ("wherever there's a subtext... anywhere else"), not for one
   specific field. Concretely this turned out to fix something already
   broken: `_data/preprints.yml`'s "Fast Fourier Orthogonalization" entry
   already had `[Falcon](fd.com)` typed into its `venue`, written before
   this was wired up — it was rendering as the literal bracketed text,
   not a link, since `{{ pub.venue }}` was plain unfiltered output.
   Confirmed it renders as a real `<a>` now.

   Mechanically this is the same wrapper-tag swap as `note`/`subtitle`
   elsewhere on this page (`<p class="pub-venue">{{ pub.venue }}</p>` →
   `<div class="pub-venue">{{ pub.venue | markdownify }}</div>`, same for
   `.pub-authors` and service's description), **not** the epigraph-style
   `remove: '<p>'` unwrap trick — these fields own their whole wrapper
   element outright (nothing hand-written surrounds them), so there was
   no nested-`<p>` collision to avoid, just an unwanted tag mismatch if
   left as `<p>`. No new margin CSS was needed to compensate for
   kramdown's own `<p>`: this file's base `p{ margin: 0 0 1.15em; }` +
   `p:last-child{ margin-bottom: 0; }` already zeroes it automatically
   for these fields, since a one-line field's rendered `<p>` is always
   both first- and last-child — confirmed 0px/0px via computed style
   rather than assumed. Raw HTML already living in these fields
   (`<strong>`, `<em>`) passes through kramdown untouched, confirmed
   byte-equivalent for the existing entries that use it.

**UPDATE — a new preprint entry, two mobile-only rendering discrepancies,
and two new blog books (one chapterless with optional dates, one
chaptered with a new Bible-verse popup feature).**

1. **New preprint entry** in `_data/preprints.yml`: "Norm Inequalities
   Related to the Cartesian Decomposition of matrices", with `venue`
   holding `"Undergraduate Capstone Thesis written under [Rajendra
   Bhatia](https://scholar.google.com/citations?user=QQYGgRoAAAAJ&hl=en)"`
   — the first real-world use of the `venue`-as-Markdown fix from the
   UPDATE directly above this one, added the same session it landed.
   `year: 2022` is a **placeholder, not a confirmed fact** — flagged with
   a `# TODO` comment in the file; Pritam should confirm or correct it.
   `link: null` is also a pending TODO (no PDF/page yet).

2. **Two mobile-only visual bugs, neither reproducible by narrowing a
   desktop browser window** — both are real phone-vs-desktop rendering
   differences, not narrow-vs-wide layout differences, which is why
   resizing a Mac browser never surfaced them:

   - **Theme toggle icon looked "more sophisticated" on phone.** Root
     cause: `☀`/`☾` with no variation selector let iOS fall back to its
     default colorful emoji-style glyph for those two characters, while
     desktop browsers were already rendering them as plain monochrome
     text glyphs. Fixed by appending **U+FE0E** (VARIATION SELECTOR-15,
     "render as text") right after each character, both in
     `base.js`/`main.js` (`b.textContent = t === 'dark' ? '☾︎' : '☀︎';`
     — that trailing mark is U+FE0E, verified with a hex dump, not the
     visually-identical-in-a-diff U+FE0F "render as emoji" selector,
     which would have made this worse) and in the static HTML fallback
     in `nav.html` (`&#9728;` → `&#9728;&#xFE0E;`). No visible change on
     desktop (glyphs there were already text-presentation by default);
     on iOS this forces the same plain glyph desktop already showed.
     Confirmed via `Array.from(btn.textContent).map(c =>
     c.codePointAt(0).toString(16))` → `["263e", "fe0e"]`.
   - **Scrollspy TOC highlight (`.toc a.current`, from an earlier
     UPDATE) looked exaggerated on phone.** Root cause: mobile Safari/
     Chrome's default tap behavior flashes a gray highlight rectangle
     over a tapped link (`-webkit-tap-highlight-color`), which desktop
     doesn't have at all — that flash was stacking visually on top of
     the already-restrained `.current` accent styling, reading as
     over-designed. Fixed with a global reset right after the base CSS
     reset block: `a, button{ -webkit-tap-highlight-color: transparent;
     }`. This is a general mobile-hygiene fix, not scoped to `.toc`
     specifically — it also quietly improves every other link/button's
     tap feedback on mobile (Bible verse-ref links included, see below),
     since none of this site's interactive elements were designed
     around that default flash.

   General takeaway for future sessions: **a "looks different on my
   phone but not when I narrow the Mac browser" report is a strong
   signal to check mobile-only browser defaults (emoji presentation,
   tap-highlight, `-webkit-*` UA styles) before assuming it's a
   responsive-breakpoint bug** — narrowing a desktop window changes
   viewport width but not the browser engine or its platform defaults.

3. **New book: "From the journal"** (`blog/from-the-journal/index.md`,
   `book_slug: from-the-journal`) — a **chapterless** book (no
   `_data/books/from-the-journal-chapters.yml` file), three filler
   entries: Lent, Easter, Shimla. This is also the first real use of the
   **optional per-entry `date` field**, added to `_layouts/book.html`'s
   subchapter-head markup in both the chaptered and chapterless
   branches:
   ```liquid
   {% if sub.date %}<span class="subchapter-date">{{ sub.date | date: "%B %-d, %Y" }}</span>{% endif %}
   ```
   guarded exactly like every other optional field on this site (§10's
   "every optional field needs its own `{% if %}`" rule) — a subchapter
   with no `date:` in its front matter renders with no date line at all,
   not an empty one. Styled small and muted, directly under the
   title (`.subchapter-date`, sans-serif, `--text-muted`).

   **Pritam listed the three entries as "Shimla, Easter, Lent" but the
   dates given to them are real 2026 liturgical/calendar dates, which
   put them in a different order: Lent (Ash Wednesday, Feb 18 2026, used
   March 15 as a mid-Lent placeholder date) → Easter (April 5, 2026,
   computed via the actual Gregorian/Western Easter algorithm for 2026)
   → Shimla (June 10, 2026, an arbitrary placeholder since no real date
   was given for a summer trip).** The book's `order:` front-matter
   field was set chronologically (Lent=1, Easter=2, Shimla=3) rather
   than in Pritam's listed order, since a diary-style "from the journal"
   book reads more sensibly sorted by date than by whatever order the
   entries happened to be requested in — **but this is a judgment call,
   not a fact Pritam stated explicitly, and should be confirmed with
   him**; if he intended the listed order (or different actual dates for
   Easter/Shimla), swap the three files' `order:`/`date:` values, no
   template change needed.

4. **New book: "Homilies"** (`blog/homilies/index.md`,
   `book_slug: homilies`) — **chaptered**, one chapter so far
   (`_data/books/homilies-chapters.yml`: chapter "1", id `colossians`,
   title "Colossians", with a two-paragraph `intro`), one subchapter
   (`_books/homilies-1-colossians-1.md`, "Chapter 1"). Content is
   adapted from a source PDF (`Book of Colossians.pdf`) per Pritam's
   explicit instruction to preserve meaning while adapting presentation:
   the original's inline "!!" emphasis markers became bold lead-in
   phrases, its shorthand verse citations (e.g. "v17") became real
   `.verse-ref` links (see next point), its numbered catechism became a
   real Markdown ordered list, and its ASV Colossians 1:24 quotation
   became a real Markdown blockquote.

   **`chapter_intro` needed `markdownify`** — `ch.intro` was previously
   plain `{{ }}` output in a `<p>`, which can't hold the Homilies intro's
   two separate paragraphs. Changed to
   `<div class="chapter-intro">{{ ch.intro | markdownify }}</div>` (same
   wrapper-swap pattern as `note`/`subtitle` elsewhere in this file).
   Regression-checked against Confessions' existing single-paragraph
   chapter intros: rendered output is visually identical, only
   difference is kramdown's own `<p>` wrapper now present around the
   text, which was already accounted for by this site's standing
   `p:last-child{ margin-bottom: 0 }` rule.

5. **New feature: Bible verse hover/tap popups (`.verse-ref` /
   `.verse-popup`).** A verse citation like `Colossians 1:17` is now
   written as `<a href="#" class="verse-ref" data-verse="Colossians
   1:17">Colossians 1:17</a>` directly in the Markdown body (raw HTML
   passes through kramdown untouched, same as `.thm`/`.proof`). Hovering
   it (desktop) or tapping it (phone) shows a small floating box with the
   verse text; tapping/clicking outside closes it. Built from three
   pieces:

   - **`_data/bible_verses.yml`** — a flat `"Book C:V": "verse text"` map,
     NIV text, fetched per-verse from a live source rather than
     paraphrased, with a header comment recording Biblica's stated
     NIV attribution/permissions requirement for quoting individual
     verses (quoted in full in the file itself — keep that comment
     intact if this file is ever edited, it's the actual permissions
     basis for including NIV text at all). **Note the underscore, not a
     hyphen, in the filename/key** — `site.data.bible_verses` is valid
     Liquid dot-notation, `site.data.bible-verses` is not (parses as
     subtraction) — this is now the second data file on this site to
     need that (existing precedent noted elsewhere in this doc); any
     future new `_data/*.yml` file that gets accessed via
     `site.data.<name>` must use underscores, not hyphens, in its
     filename for this reason.
   - **`_layouts/default.html`** exposes the whole map to client JS as a
     JSON `<script>` tag, once per page, right before the `main.js`
     include:
     ```liquid
     <script type="application/json" id="bible-verses-data">{{ site.data.bible_verses | jsonify }}</script>
     ```
     (the *id* can keep the hyphen — only the Liquid data-file key needs
     the underscore; a DOM id has no such restriction).
   - **`main.js`** — one self-contained block, gated behind `if
     (verseRefs.length)` so it's a no-op on every page with no `.verse-
     ref` elements (i.e. every page except Homilies posts, currently).
     Creates a single shared `.verse-popup` div appended to
     `document.body` (not one popup per link — repositioned/repopulated
     on demand), wires `mouseenter`/`mouseleave` (desktop hover),
     `focus`/`blur` (keyboard access), and `click` (mobile tap-to-toggle,
     `preventDefault`ed since `href="#"` would otherwise jump/scroll),
     plus a document-level click-outside listener
     (`e.target.closest('.verse-ref')`/`closest('.verse-popup')` checked
     to decide whether a click was "outside") and `scroll`/`resize`
     listeners that reposition (not hide) an already-open popup.
     Verse text lookup fails quietly (`if (!text) return;`) if a
     `data-verse` key isn't in `bible_verses.yml` yet — a citation with
     no matching entry just doesn't pop anything up, rather than
     throwing or showing "undefined", so adding a `.verse-ref` ahead of
     its data entry is safe, not a build-breaker.
   - **CSS** (`main.css`): `.verse-ref{ cursor: pointer; }` plus
     `.verse-popup` styled as a small serif-italic floating card
     (`position: absolute`, themed border/background via existing
     tokens, `[hidden]{ display: none; }` — this project's established
     pattern for anything toggled via the `hidden` attribute rather than
     inline `style.display`, see the reading-list `[hidden]` bug
     documented earlier in this file for why that pairing matters
     whenever an element also has its own non-block `display` — this one
     doesn't, so no extra override was needed here).

   **Verified functionally** (hover shows correct text and hides on
   `mouseleave`; click opens/toggles; a click elsewhere on the page
   closes it) via dispatched synthetic DOM events rather than
   screenshots — this session's Browser-pane tooling had the same
   intermittent screenshot/compositing unreliability documented
   elsewhere in this file (`document.visibilityState` reporting
   `"hidden"`), so the interaction logic was confirmed via direct
   assertions on `.verse-popup.hidden` and its `textContent` instead of
   relying on visual capture. If a future session needs to add a real
   screenshot to this record, that's still outstanding — the underlying
   behavior itself is confirmed correct, just not yet captured visually.

   **Adding a new verse later** is a two-step, no-template-change
   operation: add the citation as a `.verse-ref` link in the post's
   Markdown, and add its `"Book C:V": "text"` entry to
   `_data/bible_verses.yml` — see EDITING-GUIDE.md for the Pritam-facing
   version of this.

**UPDATE — a `for_later/` staging folder, and the mobile scrollspy
highlight was still not right after the tap-highlight-color fix above.**

1. **`for_later/`** — a new top-level folder, added to `_config.yml`'s
   `exclude:` list (`for_later/`), so nothing in it is ever copied into
   the built site regardless of what it contains — no front matter, no
   filename convention, nothing Jekyll-shaped required. It's a staging
   area for source material (a PDF, a rough draft, notes) that Pritam
   intends to turn into a real post later by asking a future session to
   process a specific file from it — same pattern already used for the
   Homilies content (sourced from a PDF outside the repo, but the intent
   going forward is that such source material lives in `for_later/`
   instead of an arbitrary path elsewhere on disk). Not `.gitignore`d —
   these are documents Pritam wants kept/versioned, just not built.

2. **The mobile scrollspy highlight ("exaggerated"/"more sophisticated"
   than desktop) was reported again after the earlier tap-highlight-color
   fix, meaning that fix wasn't the whole story.** Root-caused as a
   second, independent mobile-only layering effect: tapping a link also
   *focuses* it, and some mobile browsers (notably iOS Safari) draw their
   own default focus ring around the tapped element even though it
   wasn't reached via keyboard — that ring stacks visually on top of the
   `.toc` scrollspy's own accent stripe/color, reading as an extra box
   the desktop click-driven version never shows (desktop mouse clicks
   don't trigger a visible focus ring in modern browsers to begin with).
   `main.css` had no focus-outline handling at all before this — the
   default browser outline was simply never addressed.

   Fixed with the standard, accessibility-preserving idiom rather than a
   blanket outline removal:
   ```css
   a:focus:not(:focus-visible), button:focus:not(:focus-visible){ outline: none; }
   ```
   `:focus-visible` is the browser's own heuristic for "this focus came
   from a keyboard/keyboard-equivalent interaction, show the ring" versus
   "this focus came from a mouse click or a touch tap, don't bother" —
   so this removes exactly the mobile-only extra box without touching
   real keyboard focus indication anywhere on the site (including the
   verse-ref popup's own focus/blur handling from the UPDATE just above,
   and the `.skip-link:focus` rule, both unaffected since neither relies
   on the default outline being present). Placed directly after the
   `-webkit-tap-highlight-color` rule since the two are the same class of
   fix (mobile-only default chrome stacking on top of this site's own
   restrained styling) — if a future "looks different on my phone" report
   about tapped elements comes in again, check both of these together,
   plus emoji-presentation (the theme icon fix, two UPDATEs above) — that's
   now three distinct mobile-default-styling causes found in this general
   category, worth checking as a set rather than one at a time.

   Verified via `getComputedStyle` after a programmatic `.focus()` call
   (`outlineStyle: "none"`, `tapHighlightColor: "rgba(0,0,0,0)"`) in this
   session's Chromium-based mobile emulation — genuine `:focus-visible`
   (real keyboard Tab-focus) could not be simulated by this tooling to
   verify the ring is *still shown* there, so that half relies on the
   pseudo-class's well-established, spec-defined browser behavior rather
   than a direct test; if the skip-link or any keyboard-only user ever
   reports lost focus visibility, this rule is the first place to check.

**UPDATE — the blog home's nav cross-link now says "Pritam Chandra"/"PC",
not "Website".** `_includes/nav.html`'s `blog-home` case previously set
`cross_text = "Website"`, rendered as plain text into `.nav-link`. Changed
to the same two-span markup `.nav-sitename` itself uses:
```liquid
{% assign cross_text = '<span class="full">Pritam Chandra</span><span class="short">PC</span>' %}
```
— safe to splice unescaped into `{{ cross_text }}` (Liquid's plain `{{ }}`
was already outputting this variable unescaped before this change; only
its content changed, not the escaping behavior). The `.full`/`.short`
collapse-to-initials rule in `main.css` was scoped to `.nav-sitename .full`/
`.short` only, so it needed generalizing to also match `.nav-link .full`/
`.short` — done at both the base "hide `.short`" rule and the `@media
(max-width: 480px)` override, rather than duplicating the pattern under a
`.nav-link`-specific selector, per §4's own instruction that this two-span
pattern is "the general rule, not a portfolio-only fix." Verified at
1400px (`.full` shown, "Pritam Chandra") and 420px (`.short` shown, "PC")
via computed `display` values in the browser. The other three `cross_text`
values (`"Blog"`, `"All posts"`) are unaffected — they're short enough at
every width already and don't use the two-span markup, same as before.

**UPDATE — the big one: publishing years of older material from
`for_later/Publish`.** Pritam collected years of older writing (an old
Hugo-based site's exported HTML, plus PDFs/docx/rtf he'd written directly)
into `for_later/Publish/`, organized into folders-are-collections,
loose-files-are-standalone-posts, and asked for all of it to be turned
into real site content in one pass. This was the largest single batch of
this project's history — worth recording the shape of it, not just the
mechanics, since a future session extending any of these collections
needs the same conventions.

1. **Five new collections**, all using the existing chapterless-book
   mechanism (§6, §13's "chapterless book" fix) — no new Liquid, no new
   layout, just more `_books/*.md` files plus a `blog/<slug>/index.md`:
   `Elegy` (4 poems), `Hope` (3 poems), `Translations of Lyrics` (5
   translated song lyrics), `Poems from when I was much younger` (4
   poems), `Stories from when I was much younger` (5 short stories).
   Two *existing* collections also grew: `From the journal` gained two
   pieces (`for-pippy`, `piu-in-the-cavea`), and `Homilies` gained a
   second chapter (`Genesis`, one subchapter so far) via the same
   `_data/books/homilies-chapters.yml` mechanism already used for
   Colossians.

2. **Ten new standalone `_posts`**, three of them math/CS: an exposition
   of Robust Vector Space Decomposition combining an old short intro post
   with a *new* YouTube video (the previous embedded video in the old
   HTML was deliberately dropped per Pritam's instruction) and a full,
   section-by-section transcription of a 74-slide Beamer deck. The slide
   deck was PDF-text-extracted with `pdftotext -layout`, then
   **deduplicated programmatically** — Beamer's incremental `\pause`
   reveals meant most of the 74 pages were partial builds of the same
   slide; a page was kept only if the *next* page's text didn't start
   with it verbatim (i.e. only the final, fullest build of each slide
   survived), which took 74 pages down to 36 genuinely distinct slides
   before transcription. The other two math posts (`basis-counting`,
   `klein`) came from short LaTeX-typeset PDFs with embedded figures —
   see the next point for how those figures made it onto the page.

3. **PDF figures were rasterized, not redrawn.** `basis-counting.pdf` has
   four hand-drawn 3D cube diagrams (GeoGebra-style) illustrating a
   combinatorial proof; `klein.pdf` has one Gaussian-curve-with-rectangles
   figure. Neither existed as a separate image file, only baked into the
   PDF. `pdftoppm`/`ghostscript` weren't installed on this machine at the
   start of this session — `brew install poppler` was run to get
   `pdftoppm`/`pdftotext` (ghostscript was already present and used for
   the actual page rasterization at 300dpi, then Python/PIL cropped each
   figure's region out of the full-page render). This is a real,
   reusable technique for this site: a PDF's own diagrams don't need to
   be manually redrawn as SVG when a pixel-accurate crop of the original
   is good enough — `assets/img/basis-counting-*.png` and
   `assets/img/klein-gaussian-rectangles.png` are the result, dropped
   into `.gallery-full` figures same as any other image.

4. **New component: `.song-thumb`** (`main.css`, right after
   `.subchapter-date`) — a small YouTube-thumbnail-plus-title link, used
   above each piece in "Translations of Lyrics" the same way a reading-
   list book gets a cover. Deliberately modeled on `.reading-cover`
   (bordered box, no shadow, `object-fit: cover`) rather than invented
   from scratch, just a 16:9 video thumbnail instead of a 2:3 book cover,
   and laid out as a single link (image + title side by side) rather
   than a whole list row, since it's a one-off per piece, not a repeated
   table. Thumbnail images are hotlinked from `img.youtube.com/vi/<id>/
   hqdefault.jpg` — the same "hotlink rather than self-host" exception
   already established for the reading list's Open Library covers (§13),
   extended here to YouTube's own thumbnail CDN for the same reason (a
   growing list of songs isn't practical to self-host thumbnails for one
   at a time).

5. **Real bug found and fixed: `_includes/audio-player.html` had no
   guards for missing `duration`/`instruments`/`caption`.** Every song
   post until now (`Hold You Somehow`) supplied all four fields, so this
   never surfaced. The new "Sailor Take Me" post needs an audio player
   wired up to a file that doesn't exist yet (`audio_src` points at
   `/assets/audio/sailor-take-me.m4a`, a real recording Pritam will add
   later) with genuinely unknown duration/instruments/caption — exactly
   the "every optional field needs its own `{% if %}`" gap documented
   earlier in this file (the `page.subtitle`/`entry.preview` UPDATE), just
   never hit before because no song post had ever left a field blank.
   Fixed with the same pattern: `{% if include.duration or include.
   instruments %}` around the whole middle dot separator (not just each
   half, so a lone duration/instruments doesn't leave a stray `&middot;`
   on its own), and `{% if include.caption %}` around the caption text
   before the `<code>{{ include.src }}</code>` path, which always shows
   regardless. Verified via computed `innerHTML` in the browser: with all
   three fields `null`, the label renders as just `<span>Recording</span>`
   (no trailing `· ·`) and the caption renders as just the `<code>` path
   with no leading space.

6. **"Hold You Somehow" was a real update, not a new post** — Pritam's
   explicit instruction was to replace the placeholder/reconstructed
   lyrics in the existing `2026-06-14-hold-you-somehow-sad.md` with the
   real ones (sourced from `for_later/Publish/2025-04-Hold you somehow.
   pdf`) and drop "Sad" from the title. Renamed the file to `2026-06-14-
   hold-you-somehow.md` (slug follows title) but **left the actual
   `.m4a` asset's filename alone** (`hold-you-somehow-sad.m4a` — it's a
   real 8MB recording already committed; renaming a real binary asset
   for a title change is unnecessary churn, only the page URL/slug
   needed to track the new title). The real lyrics have a very different
   emotional arc than the placeholder ones (doubt clearing into trust,
   not an unresolved ache), so the surrounding prose commentary had to
   be rewritten too, not just the lyrics block swapped — the old prose
   ("I almost didn't post this one... it doesn't resolve") was simply
   false of the real song. No chords were given for the real lyrics, so
   none were invented — the `.chords` line was dropped entirely (not
   filled with a plausible-sounding placeholder) with a one-line note
   that chords are still pending, consistent with this file's own
   standing rule against inventing chord progressions.

7. **Six filler posts retired, moved (not deleted) to
   `for_later/retired-posts/`** — same "keep on disk, exclude from the
   build" pattern as `for_later/old-posts/` (both already covered by
   `for_later/` itself being in `_config.yml`'s `exclude:` list, so no
   config change was needed for this specific move): `a-falcon-tree-
   illustrated`, `two-folk-songs-translated`, `on-rereading-simone-weil`,
   `watched-mostly-alone`, `eigenvalues-annotated`, `von-neumann-trace-
   inequality-notes`. `spirals-and-seeds-a-small-gallery` was explicitly
   named to *keep* and is untouched; `rose-leaves` and `operator-
   fidelity-qpower-means` weren't on the retirement list either and were
   left alone.

8. **Tags were retained verbatim from the old site's HTML** (`Categories`
   ignored per instruction, `Tags` kept exactly), and any piece that
   arrived with no tags at all (every PDF/docx/rtf source, since only the
   old site's HTML pages carried metadata) got sensible filler tags
   chosen to reuse the *existing* tag vocabulary wherever the content
   genuinely fit (`poetry`, `faith`, `mathematics`, `post-quantum-
   crypto`, `translation`, `music`) rather than inventing near-duplicates
   — new tags were only introduced where the content genuinely needed a
   word the site didn't have yet (`prose`, `realism`, `testimony`,
   `journal`, `oped`, `commentary`, `song`, `psalm`, `elegy`, plus
   `math`/`cs`/`video`/`exposition`/`ml`, retained verbatim from the old
   RVSD post's own tags rather than folded into the existing
   `mathematics` tag). Per Pritam's explicit instruction, every tag now
   in use — old and new — was cross-checked against `blog/tag/` and any
   missing page created; this turned up one pre-existing gap too
   (`theology`, used by `rose-leaves.md` from an earlier session, had no
   tag page at all until this pass) — worth remembering that "make sure
   every tag has a page" is a real, recurring maintenance task on this
   site now that tag pages are hand-created stubs, not auto-generated.

9. **A collection's own `date:`, when its pieces don't reliably carry
   dates, now works the way Pritam described it in the instruction that
   started this whole batch**: newest-page-date when pages have dates
   (verified against `From the journal`'s existing manual edits, which
   turned out to already be in *newest-first* internal order —
   `order: 1` = the most recently dated piece, `order: 3` = the oldest —
   the opposite of the chronological-ascending convention used for
   Confession/the original three journal placeholders; this was
   Pritam's own deliberate reordering from a previous session, preserved
   rather than "corrected" back to ascending, and the two new pieces
   were slotted in at `order: 4`/`5` to extend that same newest-first
   scheme, not to reinstate the old one), and an explicit collection-
   level date when pieces are genuinely undated (`Translations of
   Lyrics`, per Pritam's own note that those pieces aren't dated yet —
   given today's date as a placeholder, `note:` on the collection says
   so directly).

10. **Placeholder dates, flagged for Pritam to correct** — several source
    files only had a year, or a year and month, in their filename, with
    no more precise date recoverable from the content itself (one
    exception: `for pippy.pdf`'s filename said 2026-04-28, but the piece
    itself opens "March 5, for Pippy" — the *content's* date was trusted
    over the filename's, landing it at `2026-03-05`). Every other
    partial date was filled in with a `-01-01` or `-MM-01` placeholder
    and should be treated as provisional: the "Poems"/"Stories from when
    I was much younger" collections (every piece), `there-may-be-rain`,
    `an-average-monday-of-departure`, `you-can-call-me-abraham`, and
    `hope-3-ressurection`. None of these are guesses at content — only at
    the precise day (or day+month) within a year Pritam himself
    supplied — but they're still not real dates and the pages/posts
    should be revisited once he has the actual ones.

11. **One deliberate non-decision, flagged rather than resolved**: the
    Publish folder's `Translations of Lyrics/0-2025-01-14-sailor-take-me.
    html` is a byte-identical duplicate of the top-level `Sailor Take Me`
    piece, numbered `0` in a folder where every other file was numbered
    `1`&ndash;`5` to match six given YouTube links (`0` through `5`).
    Sailor Take Me's own content (original English lyrics, not a
    translation) and Pritam's explicit separate instruction for it
    ("should be another song... a link to the song, which I will later
    put in the assets") both point away from it belonging in the
    Translations collection at all, so it was built as a standalone song
    post instead (matching `Hold You Somehow`'s pattern: a self-hosted
    `audio_src` placeholder, not a YouTube embed) — and Translations of
    Lyrics only got five entries (`1`&ndash;`5`), leaving link `0`
    (`https://www.youtube.com/watch?v=FuuC2rpC0HA`) unused anywhere. This
    is a real, unresolved ambiguity, not a confident call — flagged to
    Pritam directly rather than guessed past.

**UPDATE — a round of real fixes after Pritam actually used the batch
above: two genuine bugs (one pre-existing, one introduced by this
session), one structural change to how Homilies orders itself, and a
redo of every date this batch got wrong by defaulting to "today"
instead of the source's real year.**

1. **Homilies now orders chapters by their position in the Bible, not by
   when they were added.** `_data/books/homilies-chapters.yml`'s
   `chapters:` list is what actually drives rendering order — both
   `book.html` and `book-toc.html` iterate it directly (`{% for ch in
   chapters_data %}`), never deriving order from the subchapters'
   `order`/add-sequence — so reordering a book's chapters is just
   reordering entries in that YAML list, no template change needed. Fixed
   by moving Genesis's entry above Colossians's (Genesis is Bible book 1,
   Colossians is book 51) and swapping their `number` values ("1"→Genesis,
   "2"→Colossians) to match — which meant updating the matching `chapter:
   "1"`/`"2"` value in each book's own `_books/*.md` subchapter file
   too, since that's the field that ties a piece to its chapter entry.
   Files were also renamed to keep the `homilies-<order>-<slug>.md`
   naming convention meaningful (`homilies-1-genesis-1.md`,
   `homilies-2-colossians-1.md`). **When adding a new Homilies book**,
   insert its entry at its correct canonical position in the YAML list
   (not at the end) and renumber/relink whatever comes after it — this
   is now written directly into the data file's own header comment so
   it isn't lost again.

2. **New optional field: `sub.subtitle`**, rendered right under a
   subchapter's title (between the `<h2>`/`<h3>` and the optional date),
   in both the chaptered and chapterless branches of `book.html`. Added
   specifically so the Genesis piece could be titled "Chapter 1" (matching
   Colossians's own subchapter, since both are literally "chapter 1 of
   that Bible book") while still surfacing its real subject — "The
   Creation Narrative — Scripture vs Science" — as a subtitle line rather
   than folding it into the title. Styled as `.subchapter-subtitle`
   (`main.css`): serif italic, muted, deliberately *not* the sans-serif
   `.subchapter-date` treatment, so it still reads as part of the heading
   rather than as metadata.

3. **Real, pre-existing bug found: `hold-you-somehow-sad.m4a` was a
   non-fast-start 3GP-branded container and wouldn't play in-browser at
   all**, despite being a completely valid AAC recording — `file`
   reported it as "ISO Media, MPEG v4 system, 3GPP" (not the "M4A"/"mp4"
   branding browsers expect for an `<audio>` source) and `afinfo` showed
   `not optimized` (its `moov` metadata atom sits at the end of the file,
   not the front) — the standard "browser gives up before it finds the
   metadata" failure mode for progressively-served MPEG-4 family media.
   `audio.readyState` stayed `0` (`HAVE_NOTHING`) and `networkState`
   went to `3` (`NETWORK_NO_SOURCE`) with no fetch of the file ever even
   showing up in devtools — nothing about the site's own HTML/CSS/JS was
   at fault, it was purely the asset file itself, present since before
   this session's own edits touched this post. Fixed by remuxing with
   `afconvert -f m4af -d aac -b 256000 -q 127 -s 2` (macOS's own Core
   Audio tool — no re-encode-from-scratch needed, just re-container at
   a bitrate matching the original's ~256kbps so quality doesn't visibly
   drop) into a proper fast-start `m4af`-branded file, replacing the
   asset at the same path (no reason to touch the post's `audio_src` or
   rename the file — the *container*, not the location, was broken).
   Verified end-to-end in the browser: `readyState` reaches `4`
   (`HAVE_ENOUGH_DATA`), `duration` reports correctly (**249.7s ≈
   4:10**, which is also why `audio_duration: "3:5x"` in the post's own
   front matter was wrong — fixed to `"4:10"` while already in there),
   and `audio.play()` genuinely advances `currentTime`. **If a future
   audio upload ever silently "doesn't play" again, check the container
   with `afinfo` (`not optimized` output, or a `File type ID` that isn't
   `m4af`/`mp4a`) before assuming the site's HTML is at fault** — this
   is exactly the kind of failure that looks like a template bug but
   isn't.

4. **The `.gallery-video` iframe embed was missing the `allow`/
   `referrerpolicy` attributes YouTube's own embed code ships with.**
   Every `.gallery-video` on the site (`main.css`/EDITING-GUIDE.md's own
   documented example, plus the two posts that use it —
   "Spirals and Seeds" and the new RVSD exposition) had only `src`,
   `title`, `allowfullscreen`, and `loading="lazy"` — no `allow="..."`
   at all, unlike the *original* pre-migration HTML's embed
   (`exposition-on-rvsd.html`), which had the full attribute set. Added
   `allow="accelerometer; autoplay; clipboard-write; encrypted-media;
   gyroscope; picture-in-picture; web-share"` and
   `referrerpolicy="strict-origin-when-cross-origin"` to all three
   places (both existing posts' iframes, plus the EDITING-GUIDE.md
   template so future videos get it by default) — this is YouTube's own
   documented recommended embed markup, not a guess. **Caveat, stated
   plainly rather than papered over**: this was applied because it's
   objectively the more correct/complete embed, but the specific
   complaint that prompted it (clicking the in-player title/channel
   overlay to open the video on YouTube itself doesn't do anything) could
   not be confirmed fixed in this session's own testing — the automated
   browser tool used here appears unable to interact with the YouTube
   iframe at all (a simulated click on the play button didn't even start
   playback), so the click-through specifically needs verifying by
   Pritam on a real device/browser, not just trusted because the
   attributes now match YouTube's spec.

5. **A real batch of wrong dates, all following the same mistake: several
   posts built from source material that only had a *year* (or year +
   month) in its filename got dated with the day this batch was actually
   built (2026-09-05) instead of a placeholder within the source's own
   year.** This is a materially different, worse error than the
   already-documented "day/month placeholder within the right year"
   dates from the previous UPDATE (those were flagged and are still
   correct in spirit) — these three landed in the *wrong year entirely*,
   which is a much easier mistake to miss on a skim and a much worse one
   to leave wrong, since it visibly misplaces the piece on the blog
   home's chronological timeline by years. Caught only because Pritam
   spot-checked one (`basis-counting`, filename said 2020, published as
   2026) and asked for the rest to be re-verified. Fixed, each file
   renamed to match its corrected `date:`:
   - `_posts/2020-basis-counting.pdf` → the post was dated `2026-09-05`;
     source filename says `2020` only (no month) → corrected to
     `2020-01-01` (month/day assumed, year real), file renamed
     `2020-01-01-counting-special-basis-for-rn.md`.
   - `_posts/2026-06-klein.pdf` → the post was dated `2026-09-05`; the
     *filename* said `2026-06`, but the PDF's own first page says
     "Pritam Chandra, **October 2025**" — the content's stated date was
     trusted over the filename's (same precedent as `for-pippy.pdf` in
     the previous UPDATE, whose filename said April but its own opening
     line said "March 5") → corrected to `2025-10-01`, file renamed
     `2025-10-01-randomized-nearest-plane-by-klein.md`.
   - The merged RVSD exposition+slides post was dated `2026-09-05`
     (the day it was assembled) even though its core content is the
     *old* `2023-04-24-exposition-on-rvsd.html` post with a slide-deck
     walkthrough added underneath → corrected to `2023-04-24` (the
     original exposition's own date), file renamed accordingly. Flagged
     as a genuine judgment call, not a certainty: the slide deck itself
     carries its own date in its footer text ("Feb. 22, 2024"), so if
     Pritam considers the *talk* the more meaningful date than the
     *original short blog post*, `2024-02-22` is the other defensible
     choice — either way, `2026-09-05` (the date this Claude Code
     session happened to run) was never a real date for this content and
     shouldn't have been used.
   - `_books/hope-3-ressurection.md` had no `date:` field at all, even
     though its source filename says `2026` and its sibling pieces in
     the same collection (and Elegy's `self-reference`, from the exact
     same "year only" situation) all got an explicit placeholder date —
     added `date: 2026-01-01` for consistency; this one doesn't change
     the *collection's* own sort position (already `2026-01-01` from the
     original pass) but fixes the piece itself silently showing no date
     under its title while its neighbors do.
   - Checked every other new post/piece against this same failure mode
     (source year vs. assigned date) — everything else in this batch was
     already correct, including the collections (Elegy, Hope, the two
     "when I was much younger" collections, From the journal) which all
     used the source's real year from the start. Only the three
     already-flagged "day/month assumed within the right year" cases
     from the previous UPDATE remain open placeholders, not wrong-year
     ones.

**UPDATE — a share/copy-link button (new, site-wide feature), plus four
more fixes from another round of feedback.**

1. **New component: `.share-btn`, via `_includes/share-button.html` +
   `_includes/icon-copy-link.html`.** A small chain-link icon button
   that copies a URL to the clipboard — "nothing fancy," per Pritam's
   own framing, matching the theme toggle's icon-only treatment rather
   than a bordered `.nav-btn`. One appears next to a standalone post's
   tags row, next to a book's own tags row, and next to *every*
   chapter and subchapter heading inside a book — so any piece,
   however deep, is independently shareable and links straight to
   itself, not just the book. Mechanically: the URL is always built
   server-side in Liquid (`page.url | absolute_url`, with `#id`
   appended for a chapter/subchapter) and handed to the button as a
   `data-url` attribute — no client-side URL guessing. `main.js` wires
   a single delegated-by-`querySelectorAll` click handler
   (`[data-action="copy-link"]`, same pattern as every other button on
   the site) that calls `navigator.clipboard.writeText()`, with a
   `document.execCommand('copy')` fallback for browsers without the
   Clipboard API, and toggles an `.is-copied` class for 1.5s that shows
   a small "Copied" tooltip above the button (CSS-only, `opacity`
   transition). Opening a copied chapter/subchapter link relies on
   nothing but the browser's own native `#anchor` scroll-on-load
   behavior — no new JS needed — and both `.chapter` and `.subchapter`
   already carry `scroll-margin-top: 80px` from earlier work, so the
   sticky nav never covers the target. **A genuinely interesting Liquid
   bug hit while building this**: the include tag's own usage
   *documentation*, written as a `{% comment %}` block containing a
   literal `{% include share-button.html url=page.url | absolute_url %}`
   example (deliberately *invalid* syntax, meant only as an
   illustration of what *not* to pass directly), broke the entire site
   build — `{% comment %}...{% endcomment %}` in this Liquid version
   does **not** treat its contents as inert raw text; tags inside a
   comment are still tokenized and validated at parse time, so a
   malformed tag *in a comment* is exactly as fatal as one in real
   code. Fixed by writing the example without the `{% %}` delimiters
   (plain `assign ...` / `include ...` lines, prose-style) — if a
   future doc comment ever needs to show literal Liquid syntax as an
   example, this is the trap to avoid; use `{% raw %}...{% endraw %}`
   around the example instead, not a plain comment, if the literal
   delimiters are actually needed.

2. **Math in a post's *preview* text (the blog home listing snippet)
   wasn't rendering** — a different bug from the earlier title issue,
   caught only because Pritam pointed at the blog listing specifically.
   `preview:` is printed unfiltered (`{{ entry.preview }}`) directly
   into `.entry-preview` in `blog-home.html`, which *is* inside
   `document.body` and therefore *is* in scope for the site-wide
   `renderMathInElement(document.body, ...)` call — so real `$...$` in
   `preview:` renders exactly as well as it does in a title, it just
   hadn't been *used* there yet. `basis-counting`'s `preview` had
   `R^n`/`R^3` as bare text; switched to `$\mathbb{R}^n$`/`$\mathbb{R}^3$`
   (single-quoted YAML again, same reasoning as the title fix). Its
   `description:` field was deliberately left as plain `R^n` text and
   **not** given the same treatment — `description` only ever reaches a
   `<meta>` tag, never the visible DOM, so real LaTeX there would just
   be inert markup in a search engine's snippet, not rendered math (this
   is the same reasoning CLAUDE.md already has on record for why a
   book's `description:` field stays plain-text-only while `subtitle:`
   gets `markdownify`) — worth remembering as the general rule: any
   field that ends up in `document.body` can carry real `$...$` math,
   any field that only ever becomes an HTML *attribute* (`<meta
   content="...">`, `alt="..."`, `title="..."`) cannot and shouldn't be
   written as if it could.

3. **Real bug, not a false alarm this time: a numbered list broke
   itself by embedding a display equation, on the Klein post.** Section
   1.1 wrote steps 1–3 as a plain Markdown `1. / 2. / 3.` list, with a
   raw `<div>\[ ... \]</div>` display equation sitting inside step 2's
   own text (between two paragraphs of that same list item, no special
   indentation). kramdown's line-based list parser doesn't treat an
   unindented block-level raw-HTML element as "still part of the
   current list item" — it ends the list right there. Step 3's `3.`
   marker then starts a **second, independent** ordered list, which
   restarts numbering from 1 by default (this is why it visibly
   rendered as "1" instead of "3" — not a CSS issue, a real change in
   document structure) — and separately, something about how that
   break interacted with the surrounding raw HTML left step 3's inline
   math unrendered ("buggy appearance"), most likely the equation's own
   `<div>` boundaries no longer aligning with paragraph boundaries the
   way kramdown expected once list-parsing state was disrupted. This is
   the same underlying category of gotcha CLAUDE.md already documents
   for kramdown/raw-HTML interactions (the `\#`/`\!` escaping issue,
   the `markdown="1"` tradeoff for `.thm`/`.proof`) — a new instance of
   it, not a new mechanism: **don't mix a Markdown-syntax numbered list
   with a raw block-level element sitting inside one of its items.**
   Fixed the only way that's actually safe here, matching how the
   Algorithm 1/2 boxes *elsewhere in the same post* already handled
   numbered steps: rewrote the whole list as plain raw HTML
   (`<ol><li>...</li></ol>`), same as those boxes — inline math inside
   raw HTML list items is unaffected (KaTeX's client-side scan doesn't
   care whether kramdown touched the surrounding markup), only the
   *Markdown-list-syntax* version breaks. **If a numbered list ever
   needs to contain a display equation (or any other block-level raw
   HTML) in one of its steps, write that whole list as raw
   `<ol>`/`<li>` from the start** — don't reach for `1. 2. 3.` syntax
   and assume embedded HTML will just work inside it.

4. **Translated-song thumbnails, chucked entirely** — the box-styled
   `.song-thumb` component (added, then immediately re-styled once
   already, in the same batch) has been removed outright, CSS and all,
   per Pritam's explicit "keep it simple" call: no box, no YouTube
   thumbnail image, not even its own CSS class. Every "Translations of
   Lyrics" piece now opens with one plain italicized Markdown link —
   `*[Listen to Song Title](https://...)*` — nothing else. This is a
   genuine reversal, not a refinement: the lesson isn't "simplify the
   box," it's that a component built and shipped without the recipient
   seeing it first can miss the mark twice in a row even when each
   individual version was internally consistent with the site's design
   language — worth checking in with Pritam before investing further
   design effort in a *new* component next time, rather than iterating
   silently on assumptions.

5. **Homilies bug from the previous UPDATE only got half-fixed: the
   Genesis/Colossians reorder was right, but Pritam wants the *ordering
   mechanism itself* to be about Biblical canon, not chronology, going
   forward** — already covered by point 1 in the *previous* UPDATE
   (`chapters_data`'s own YAML list order is authoritative, so this was
   already the mechanism; no new change needed here beyond what's
   already on record) — noted here only so a future session doesn't
   re-litigate whether Homilies should ever sort by date. It shouldn't;
   "forget about the dates" for this collection specifically was
   Pritam's own explicit, standing instruction.

6. **"Confessions" (plural) retired to `for_later/retired-posts/
   confessions/`** — moved as a whole unit (`blog/confessions/index.md`,
   its 5 `_books/confessions-*.md` poems, and
   `_data/books/confessions-chapters.yml`), same pattern as every other
   retirement on this site: kept on disk, excluded from the build via
   `for_later/`'s standing exclude rule, nothing deleted. **Not** to be
   confused with "Confession" (singular, `blog/confession/`,
   Wicked Seed / Blemishes / Sensualists) — that one stays live and
   untouched; the two collections' near-identical names are a real,
   ongoing source of ambiguity worth double-checking against by slug
   (`confession` vs `confessions`) rather than by ear whenever either
   comes up again.

**UPDATE — the share button's visual design, redone per Pritam's direct
spec after seeing the first version.** The plain borderless icon from
the previous UPDATE is gone; `.share-btn` is now built on the existing
`.tag` pill (same border/background/`.74rem` sizing as a topic tag)
rather than novel chrome, in two presentations selected by a new
`variant` param on `share-button.html`:

- `variant` omitted (default) → `.share-btn--icon` — icon-only, used
  once per post/book header. Flushed to the *right* edge of that
  page's `.tags` row via `margin-left: auto` on the button itself
  (the tag pills stay left-aligned/wrapping as before; only the share
  button gets pulled to the opposite edge — `.tags` needed
  `align-items: center` added so it sits on the same baseline as the
  tags when the row wraps).
- `variant="labeled"` → `.share-btn--labeled` — a `.tag` pill reading
  literally "share" next to a copy glyph, used once per chapter
  heading *and* once per subchapter heading inside a book (both
  levels, not just subchapters).

New icons, matching Pritam's two specific references rather than
reusing `icon-copy-link.html` for both: `icon-share-arrow.html` (a
curved arrow sweeping up-and-right into an arrowhead — the "share"
glyph, used only in the icon-only variant) and `icon-copy.html` (two
overlapping document rectangles — the classic "copy" glyph, used only
in the labeled variant, paired with the word "share"). The original
`icon-copy-link.html` (a chain-link glyph) is now unused by either
variant and was left in place rather than deleted, in case a plain
"copy a link" icon is wanted somewhere else later — nothing currently
references it.

Because `.tag`'s own sizing is an *absolute* unit (`.74rem`), not
`1em`, this redesign also **removed** the `h1/h2/h3 .share-btn{
font-size: 1rem; }` override from the previous UPDATE — it's no longer
needed (the button doesn't inherit the heading's own large font-size
in the first place now, since it isn't sized in em to begin with), and
was actively wrong to leave in since it would have fought the new
`.tag`-based sizing instead of the old em-based one.

**UPDATE — the `.tag`-pill share design didn't land either; reverted the
post/book one, replaced the chapter/subchapter one with plain text, and
a real scrollspy regression fixed.**

1. **Post/book share button reverted to exactly its original design**
   (two UPDATEs back) — the plain borderless link-glyph icon
   (`icon-copy-link.html`), sitting right beside the tags, no box, no
   `.tag` styling, no flush-right push. The `.tag`-pill version and its
   `margin-left: auto` flush-right rule are gone. `icon-share-arrow.html`
   and `icon-copy.html` (added for the boxed version, one per icon
   variant) are deleted outright rather than left unused, since neither
   is used by anything else on the site — unlike `icon-copy-link.html`
   before it, which was kept once already because it might be reused;
   these two never were.

2. **Chapter/subchapter share is no longer attached to the heading at
   all** — titles are clean, no icon, no box, nothing next to "Genesis"
   or "Chapter 1". Instead, a single plain word, "share", appears once
   at the very end of *each subchapter's own content* (after its
   `gloss`, right before the `</section>` — which is to say, right
   before the `<hr class="chapter-divider">` that follows it, whenever
   one does), muted (`--text-faint`), no button chrome at all
   (`border: none; background: none; padding: 0`), turning full `--text`
   on hover. This is deliberately **subchapter-scoped only** — there's
   no separate chapter-level trailing share (the chapter heading itself
   lost its share button and nothing replaced it there) — because
   Homilies' two chapters currently have exactly one subchapter each,
   and a second "share" immediately after the first would have read as
   an obvious duplicate for the common case. If a future chapter
   genuinely has multiple subchapters and Pritam wants a way to share
   the *chapter* as a whole (not just each piece inside it), that's a
   real, deliberately-deferred gap, not an oversight — flag it if it
   comes up rather than silently adding a second share point back.
   Clicking it swaps its own text from "share" to "copied" in place
   (`.share-btn-label`/`.share-btn-feedback`, toggled via `display:
   none`/`inline`) rather than popping up a floating tooltip box like
   the icon variant does — a floating box, even a small one, would have
   undercut the whole "just text, nothing else" point of this variant.

3. **Real CSS regression, not a phone-only quirk this time: the
   scrollspy's "you are here" indicator had a left border stripe as
   well as the color change**, and Pritam explicitly wants color only.
   This wasn't a mobile-vs-desktop difference at all (same CSS renders
   identically on both) — the stripe itself was simply more than what
   was wanted, full stop. `.toc a`'s `border-left: 2px solid
   transparent` (previously reserving space so the stripe wouldn't
   nudge text sideways when it appeared) and `.toc a.current`'s
   `border-left-color: var(--accent)` are both gone; `.toc a.current`
   now only sets `color: var(--accent)`, with a plain `color`
   transition replacing the old `border-color, color` pair. Given this
   is the *second* round of "the phone highlighting still isn't right"
   feedback in this project's history, and this fix turned out to be a
   real, universal CSS change rather than another mobile-default-styling
   cause (tap-highlight-color, emoji presentation, focus rings — the
   three from earlier rounds) — worth genuinely double-checking with
   Pritam that this one is settled now, rather than assuming a fourth
   mobile-only cause exists somewhere if it isn't.

**UPDATE — the nav bar's cross-link is gone from both the portfolio and
the blog home; each now lives as a sidebar link styled after an existing
pattern instead.**

1. **Portfolio**: the "Blog" link no longer appears in the nav bar at
   all. It's now `<a class="tag resume-link">Blog</a>` (new
   `icon-blog.html`, a plain document-with-lines glyph) sitting right
   after the "Elsewhere" heading, before Google Scholar — reusing the
   exact `.tag.resume-link` treatment Resume already has, per Pritam's
   own comparison. Added a `.col-right .resume-link` margin rule (`.9rem
   0 1.3rem`) since the existing margin for that class was scoped to
   `.col-left` specifically (where Resume lives) and this new instance
   needed its own breathing room in the right sidebar instead. Both
   copies updated — `home.html`'s static aside and `drawer.html`'s
   `home` case.

2. **Blog home**: the "Pritam Chandra"/"PC" link is gone from the nav
   bar too. It's now `<a class="icon-link website-link">Pritam
   Chandra</a>` (new `icon-globe.html`) sitting directly *above*
   "Reading List" in the left sidebar, styled identically to it (same
   `.icon-link` class, no box). Both copies updated —
   `blog-home.html`'s static aside and `drawer.html`'s `blog-home` case.

3. **`nav.html`** — `home` and `blog-home` now set `cross_text = ""`,
   and the `<a class="nav-link">` render is wrapped in `{% if cross_text
   != "" %}` so an empty cross-link doesn't leave a stray anchor tag in
   the DOM. `.nav-spacer`'s `flex: 1 1 auto` already pushes `.nav-tools`
   to the right end of the bar regardless of whether the cross-link
   exists, so removing it left no gap to patch. The `book`/`reading`/
   `else` cases (still showing "All posts"/"Blog") are untouched —
   this request was scoped to exactly these two page types, not every
   cross-link on the site.

4. **Real bug caught while building this: `.icon-link` was
   `inline-flex`, not `flex`**, which had never mattered while Reading
   List was the only one in its sidebar slot. The moment a second
   `.icon-link` ("Pritam Chandra") was added right above it, inline-flex
   elements only wrap to their own line when the container happens to
   be too narrow to fit both side by side — which held by accident on
   the ~232px desktop sidebar (they stacked, looked correct) but broke
   in the wider drawer panel, where they sat side by side instead.
   Switched to plain `flex` (block-level) so both copies stack
   consistently regardless of container width — verified in both the
   desktop sidebar and the mobile drawer after the fix.

**UPDATE — tags can now carry their own capitalization (`CS`, `ML`,
`OpEd`), and a real gap this exposed between the blog home's tag-cloud
gap and one other spot has been closed too.**

Every tag display on the site (`.tags`/`.tag` pills on a post/book
header, the blog home's `.tag-cloud` sidebar list, and a tag page's own
`<h1>Tag: ...</h1>`) previously ran the raw tag string through Liquid's
`| capitalize` filter. That filter only uppercases the *first* letter
and lowercases everything after it — correct for an ordinary word
("realism" → "Realism") but wrong for anything that isn't simple title
case: "cs" → "Cs" instead of "CS", "ml" → "Ml" instead of "ML", "oped" →
"Oped" instead of "OpEd". There is no Liquid filter that gets this right
automatically, since the correct casing for an abbreviation is a fact
about the word, not a mechanical rule.

**Fix: remove `| capitalize` everywhere it was applied to a tag
(`_layouts/tag.html`'s `<h1>`, `_layouts/blog-home.html`'s and
`_includes/drawer.html`'s tag-cloud loops), and instead make the *stored*
tag string itself already be the desired display casing** — a post's
`tags: [...]` front matter and a tag page's `tag: "..."` front matter
are now typed exactly as they should display: `CS`, `ML`, `OpEd`,
`Post-Quantum-Crypto`, `Matrix Analysis`, etc., ordinary words in plain
title case as before. This means **every occurrence of a given logical
tag across every post/book, plus its `blog/tag/<slug>/index.md`'s own
`tag:` field, must use identical casing and punctuation** — tag matching
(`where_exp: "e.tags contains page.tag"` on a tag page, `group_by_exp`
for the tag-cloud) is a literal string comparison, so `"cs"` and `"CS"`
are different tags to Liquid, not the same tag differently cased. A
tag's *folder* name never needs to change when its casing does —
`slugify` already lowercases (`slugify("CS")` = `slugify("cs")` =
`"cs"`), so `blog/tag/cs/` stays `blog/tag/cs/` regardless of which
casing is stored in its `tag:` field.

Executed as a scripted find/replace (Python, run inline via Bash) across
every `_posts/*.md`/`blog/*/index.md`'s `tags:` line and every
`blog/tag/*/index.md`'s `tag:` field, using one canonical case map (the
full vocabulary in use at the time: Commentary, CS, Culture, Elegy,
Exposition, Faith, Film, Journal, Math, Mathematics, Matrix Analysis,
ML, Music, OpEd, Poetry, Post-Quantum-Crypto, Prose, Psalm, Realism,
Recording, Song, Teaching, Testimony, Theology, Translation, Video) —
**anyone adding a genuinely new tag in the future just needs to type it
consistently everywhere it appears, same as before this fix; there's no
map to maintain, the map above was only this one migration's tool.**

**Two real, independent bugs turned up during this pass, worth
recording since they're the kind of thing "add a new tag" could
reintroduce if not checked for:**
1. `blog/tag/post-quantum-crypto/index.md` had `tag: "post-quantum
   crypto"` (a space) while every post using it stored
   `post-quantum-crypto` (a hyphen) — a pre-existing mismatch, unrelated
   to casing, that silently meant this tag page never matched any post
   at all (`where_exp` doesn't fuzzy-match). Caught by cross-checking
   every tag page's `tag:` field against the actual vocabulary in use,
   not by looking for a casing problem specifically.
2. Three tag pages' `title:` front-matter field (used for the browser
   tab title, independent of the `tag:` field used for matching/`<h1>`)
   had drifted out of sync with their own `tag:` field:
   `matrix-analysis` (`"Tag: Matrix analysis"`), `oped`
   (`"Tag: Op-ed"`), and `post-quantum-crypto` (`"Tag: Post-quantum
   crypto"`) — all three fixed to match their corrected `tag:` value.
   **A tag page has two separate fields that both need to agree with
   the canonical casing — `tag:` (matching + `<h1>`) and `title:`
   (browser tab) — don't assume fixing one fixes both.**

**One script run silently under-converted one file, worth flagging as a
general caution about batch text edits rather than a specific mechanism
to avoid**: the first pass over
`_posts/2023-04-24-robust-vector-space-decomposition.md`'s `tags: [math,
cs, video, exposition, ml]` line came out as `tags: [math, CS, video,
exposition, ML]` — two of five tokens converted, three left lowercase —
despite the case map containing correct entries for all five, and
despite the same script correctly converting every other file's
multi-token `tags:` line in the same run. Re-running the identical
script a second time converted the remaining three tokens correctly and
made no changes to any other file, so this reads as a one-off, not a
systematic flaw in the matching logic. **Lesson: after any scripted
mass edit across many files, spot-check the actual rendered output (not
just the script's own "changed files" log) for at least the
highest-token-count case, and be prepared to simply re-run an idempotent
fixer a second time rather than assuming one clean pass was
sufficient** — confirmed clean here via the blog home's live tag-cloud
in the browser (`document.querySelectorAll('.tag-cloud a')`, deduplicated
and sorted), which showed all 24 in-use tags with correct, unique
casing and no stray lowercase duplicates after the second pass.

Separately, in the same sitting: the gap between the blog home's new
"Pritam Chandra" website link and "Reading List" right below it (both
`.icon-link`, added in the previous UPDATE) was slightly larger than
intended. `.icon-link` itself carries a `1.1rem` bottom margin (meant to
separate the last sidebar link from the "Tags" heading that follows
it), which was also firing between these two *adjacent* links. Added
`.website-link{ margin-bottom: .5rem; }` — scoped to just this one link,
not a change to `.icon-link` itself, since `.icon-link`'s own margin is
still correct for its original job of spacing out from whatever comes
after the *last* link in a sidebar group. Verified via
`getBoundingClientRect()` in the browser: 8px gap between "Pritam
Chandra" and "Reading List," down from the original spacing.

**UPDATE — a math-rendering bug fix, theorem/lemma headers no longer
forced to caps, dates abbreviated, date-aware chapter sorting, and a new
"Sailor Take Me" entry.**

1. **Real bug: bare inline `$...$` math in the RVSD post rendered `O(...)`
   (Big-O notation) as `O!(...)`.** Root cause is the kramdown escape-
   stripping gotcha this file already documents for `\#`/`\{`/`\}` — it
   also applies to `\!` (a cosmetic negative-thin-space command), and the
   RVSD post's four-step error-bound list (`_posts/2023-04-24-robust-
   vector-space-decomposition.md`) had three instances of `O\!\left(...`
   sitting in a plain Markdown numbered list (bare inline math, not a raw
   `<div>` block) — kramdown stripped the backslash, leaving a literal
   `!` right after the `O`. Fixed by simply dropping the `\!` (it's purely
   cosmetic spacing, not semantically needed) rather than wrapping the
   list items in raw HTML. The one occurrence of the same pattern inside
   a raw `<div>\[...\]</div>` block (line 164, same file) was already
   safe and untouched — raw HTML blocks are opaque to kramdown, per the
   established rule.

2. **Real bug: `.thm-label` (theorem/lemma/algorithm box headers) had
   `text-transform: uppercase` in `main.css`, which forced ALL of a
   label's text to caps — including any math variables typed as plain
   characters inside it.** This is what turned Klein's algorithm label
   "Algorithm 1 — NP(n, t)" into "Algorithm 1 — NP(N, T)" — CSS
   `text-transform` doesn't know or care that `n`/`t` are meant to be
   math, it just transforms every glyph in the box. Fixed by removing
   `text-transform: uppercase` from `.thm-label` entirely (bumped its
   `font-size` from `.82rem` to `.95rem` and eased `letter-spacing` from
   `.05em` to `.01em`, since wide tracking and small size were both
   compensating for all-caps and look wrong on mixed case). This is a
   global fix — every `.thm`/`.proof` box on the site is affected, not
   just Klein's. `.proof-label` (which only ever says the single word
   "Proof.") was deliberately left uppercase — it never carries embedded
   math, so the original bug doesn't apply there and there's no reason to
   change its look.

   Separately, converted Klein's two algorithm labels themselves from
   plain text to real inline math — `NP(n, t)` → `$\mathrm{NP}(n, t)$`,
   and the trickier `NP*<sub>A</sub>(n, t)` (hand-rolled raw-HTML
   subscript) → `$\mathrm{NP}^*_A(n, t)$` — so KaTeX properly italicizes
   the variables instead of leaving them as plain upright text. This is
   independent of the CSS fix above (removing the uppercase transform
   alone wouldn't have made `n`/`t` render as math; they were never
   wrapped in `$...$` in the first place) but was needed to fully satisfy
   the same complaint, since plain-text "NP(n, t)" still wouldn't read as
   proper notation once decapitalized.

3. **Dates display as abbreviated month + year, everywhere** (e.g. "Mar
   2026", not "March 2026" and not "15 March 2026") — changed
   `_layouts/post.html`'s and `_layouts/book.html`'s date filters from
   `"%-d %B %Y"`/`"%B %-d, %Y"` (day-level) or `"%B %Y"` (full month
   name) to `"%b %Y"`. `_layouts/tag.html` and `_layouts/blog-home.html`
   already omitted the day and just needed the month-name → month-
   abbreviation change, same filter swap.

4. **New feature: a book's pieces with a real `date` now sort themselves
   automatically, newest first — pieces with no date keep the existing
   plain `order:` convention and are appended after all the dated
   ones.** Previously every book (chaptered or flat) sorted purely by the
   manually-typed `order:` field, meaning a book like "From the journal"
   needed `order` hand-maintained to *mimic* newest-first chronological
   order — this automates that so `order` never needs to track real
   chronology again once real dates are known. Implemented in both
   `_layouts/book.html` and `_includes/book-toc.html` (which must stay in
   sync) by replacing the single `sort: "order"` call with a two-group
   split-and-concat:
   ```liquid
   {% assign subchapters_all = site.books | where: "book", page.book_slug %}
   {% assign subchapters_dated = subchapters_all | where_exp: "s", "s.date" | sort: "date" | reverse %}
   {% assign subchapters_undated = subchapters_all | where_exp: "s", "s.date == nil" | sort: "order" %}
   {% assign subchapters = subchapters_dated | concat: subchapters_undated %}
   ```
   (Liquid's `sort` filter has no descending option, hence sort-ascending-
   then-`reverse` for the dated group.) For a chaptered book, this same
   `subchapters` list is what gets filtered per-chapter via `where:
   "chapter", ch.number`, so the date-first ordering applies within each
   chapter too, automatically, with no separate change needed there.

   **This is a genuine, visible reordering for two existing books**,
   worth flagging explicitly rather than assuming it's a no-op: "Hope"
   (mixed dated/undated pieces) went from its old `order`-based sequence
   (Cliff → Before You Found Him → Ressurection) to date-first order
   (Ressurection [2026] → Cliff [2022] → Before You Found Him
   [undated, trails last]); "Poems from when I was much younger"
   similarly reordered from its old order-1-2-3-4 sequence to
   date-descending-then-undated-last. Two other books were unaffected in
   practice: "From the journal" (every piece already dated, and its
   existing manual `order` happened to already match date-descending
   exactly, per its own already-documented history — so this automation
   changes nothing visible there, only removes the future need to keep
   `order` hand-synced to real dates) and every dateless book
   (Confession, Elegy, Translations of Lyrics, the Stories collection,
   Homilies' subchapters) — with zero pieces carrying a `date`, the
   "dated" group is simply empty and behavior is byte-for-byte identical
   to the old pure-`order` sort. If "Hope"'s or "Poems..."'s new order
   isn't what's wanted (e.g. if the old order reflected a deliberate
   reading sequence unrelated to when a piece was written, not just an
   attempt at chronological order), the fix is to either adjust those
   pieces' `date` values or remove `date` from whichever piece should
   fall back to manual `order` control instead.

5. **"Sailor Take Me" added to "Translations of Lyrics" as a sixth,
   separate piece** (`_books/translations-of-lyrics-6-sailor-take-me.md`,
   `order: 6`), alongside its existing life as a standalone post
   (`_posts/2025-01-14-sailor-take-me.md`) — this resolves the "one
   deliberate non-decision" flagged in an earlier UPDATE (the unused
   YouTube link `0` in the original Publish batch, `https://
   www.youtube.com/watch?v=FuuC2rpC0HA`, matching the `youtu.be/
   FuuC2rpC0HA` link Pritam gave directly this round) — Pritam confirmed
   directly that yes, it belongs in both places. The book piece reuses
   the exact same verse text as the standalone post (Pritam's own
   original composition, not a translation) rather than inventing new
   content, and opens with the same `*[Listen to ...]*` plain-link
   pattern the other five translation pieces use, pointed at the given
   link with its tracking query param (`?si=...`) stripped, matching the
   plain-URL convention already in use for the other five. One judgment
   call, flagged rather than silently decided: `subtitle: null` for this
   piece, since every other entry in this book uses `subtitle` for the
   *original* artist's name (a field this piece doesn't really have, as
   it isn't a translation of anyone else's song) — Pritam can fill in
   something there (e.g. crediting the Bengali folk tune it's loosely
   inspired by) if he wants a subtitle to show.

6. **Chapter numbering decoupled from insertion order — the mechanism
   flagged as an open design question in the previous round is now
   built.** Previously, a chapter's `number:` field (in a book's
   `_data/books/<slug>-chapters.yml`) was BOTH the literal displayed
   numeral AND the join key subchapters use (`chapter: "1"` in their own
   front matter) to say which chapter they belong to — conflating
   "identity" and "display label" into one field meant inserting a new
   chapter anywhere but the very end required renumbering every
   subsequent chapter's `number` *and* updating every one of their
   subchapters' `chapter:` front-matter values to match, exactly the
   tedious process `homilies-chapters.yml`'s own header comment used to
   describe as the required steps.

   Fixed by decoupling the two roles: `book.html` and `book-toc.html` no
   longer print `{{ ch.number }}` as the visible numeral at all — they
   now compute it from the chapter's own position in the YAML list
   (`{% assign chapter_num = forloop.index %}`, right after the `{% for
   ch in chapters_data %}` line, then `{{ chapter_num }}` everywhere the
   numeral is shown, including the subchapter's compound "N.M" numeral).
   `ch.number` is still there and still used for the `where: "chapter",
   ch.number` join — but it's now purely an internal, never-displayed
   identifier, so it doesn't need to be sequential, doesn't need to match
   its position in the list, and never needs to change once assigned.
   Practical effect: inserting a new chapter anywhere in the YAML list
   (including at the very top) now only ever requires adding the new
   chapter's own entry (with a fresh, unique `number`) and setting that
   same value in its own subchapters' `chapter:` field — every *existing*
   chapter's `number`, and every existing subchapter's `chapter:`
   reference, is untouched, and the displayed numerals for everything
   after the insertion point simply recompute themselves from the new
   array position. Updated `homilies-chapters.yml`'s header comment to
   describe this (removed the old "renumber everything after it"
   instruction, which is now obsolete) — verified this is a complete
   no-op for Homilies' current rendering (Genesis still shows "1",
   Colossians still shows "2", since their positions already matched
   their old `number` values) even though the underlying mechanism
   changed entirely. Per Pritam's own explicit scoping, this fix removes
   only the *renumbering busywork* — for Homilies specifically, deciding
   *where* a new Bible book belongs in the list (canonical Bible order)
   is still a manual judgment call every time, unchanged and unaffected
   by this mechanism.

   Also added a matching "Reordering pieces or chapters after the fact"
   section to EDITING-GUIDE.md §4, covering all three cases in one place:
   plain `order:` edits for dateless books, `date:` edits for
   date-sorted books (point 4 above), and moving a whole chapter block
   in `_data/books/<slug>-chapters.yml` for chapter-level reordering.

**UPDATE — the blog home's hero blockquote rendered as an ugly synthetic
slant on phone, fine on desktop; root cause was `font-style: oblique
10deg` itself, not a font-loading bug.** `.prose blockquote` (used for
the Bible-verse quote at the top of the blog home, and any Markdown `>
blockquote` in a post) had `font-style: oblique 10deg` — the *original*
site-wide "oblique, not italic" design choice from the initial build,
predating the later, narrower decision to strip auto-oblique/auto-quotes
from `.epigraph p` specifically (see this file's own epigraph UPDATE
above — that change was scoped to epigraphs only, for a different
reason — wanting manual control over nested quotes — and never touched
`.prose blockquote`, which kept the original treatment untouched until
now).

`oblique <angle>` asks the browser to mechanically skew the font's
*upright* glyphs by that many degrees — a synthetic transform, not a
request for the font's own real italic design (a separate, hand-drawn
set of letterforms most serif fonts ship). Since none of this site's
serif font stack (`--font-serif: 'Source Serif 4', 'Iowan Old Style',
'Palatino Linotype', Georgia, Cambria, 'Times New Roman', serif`) is
self-hosted via `@font-face` — unlike KaTeX's fonts (§7), these rely
entirely on whatever's already installed as a system font on the
visitor's device — desktop and mobile Safari can each resolve this
stack to a *different* actual font file, and a mechanical 10° skew that
looks fine on one face can look distorted/"ugly" on another, which is
almost certainly why this looked fine on a Mac but not on a phone: not
a bug in the mechanism, but a real, inherent fragility of forcing a
synthetic transform on an unpredictable, un-vendored font stack.

Fixed by changing `font-style: oblique 10deg` to plain `font-style:
italic` — this asks for the font's own real italic design instead of a
synthetic skew, which every serif fallback in the stack actually ships
(Source Serif 4, Iowan Old Style, Palatino, Georgia, Times New Roman all
have real italic faces), so rendering is properly hinted and consistent
regardless of which one a given device resolves to. `.prose blockquote
cite` is unaffected (`font-style: normal` there was already explicit,
so the citation line stays upright either way).

**This is a real, deliberate departure from the original "oblique, not
italic" typographic choice documented at the top of §13** — same
category of tradeoff as the epigraph change above (a document decision
made when the mechanism was fully automatic doesn't necessarily survive
contact with a real cross-device rendering problem) — but this one
wasn't a request for more manual control, it was a straightforward
"this looks broken on my phone, fix it" bug report, so the fix is a
straight CSS correction, not a move toward more manual authoring
control. If a future report surfaces the same "fine on desktop, off on
phone" symptom anywhere else `font-style: oblique` or a bare unvendored
serif/sans font is doing real typographic work (not just chrome text),
this same root cause — a synthetic transform, or an unpinned system
font, applied inconsistently across platforms — is the first thing to
check, the same lesson already learned twice before in this file for
KaTeX's own fonts (§7) and for mobile-default browser chrome (emoji
presentation, tap-highlight-color, focus rings, all documented
elsewhere in this file). Fully self-hosting Source Serif 4/IBM Plex as
real `@font-face` webfonts, the way KaTeX's fonts already are, would
close this gap for good — flagged here as a real, known gap and a
reasonable next step, not undertaken in this pass since the immediate
reported symptom is fixed by the smaller, targeted change above.

**UPDATE — blog home's post/collection titles sized down, and a
mobile-only smaller default text size for that one page.**

1. **`.post-entry h2` (the blue post/collection title links) is one
   step smaller on blog home specifically** — `.page-blog-home
   .post-entry h2{ font-size: var(--step-1); }`, added right after the
   existing shared `.post-entry h2{ font-size: var(--step-2); }` rule
   rather than changing that rule directly, since `.post-entry` is also
   used by `_layouts/tag.html`'s listing and Pritam's request was
   scoped to blog home only ("everything else stays the same"). This
   needed a new body class: `_layouts/default.html`'s existing `{% if
   page.layout == "home" %} class="page-home"{% endif %}` became an
   `{% elsif page.layout == "blog-home" %} class="page-blog-home"`
   branch, following the exact pattern `page-home` already established
   for the portfolio. Verified tag pages still render their titles at
   the original `--step-2` size (21.6px at a 16px root) while blog
   home's are `--step-1` (18.4px) — at every viewport width, not just
   mobile, since this part of the request wasn't width-scoped.

2. **Blog home's default text size is one notch smaller on phone only**
   — same visual result as pressing the size control's "−" once,
   starting from the site's normal 100%/index-2 default, but only on
   this one page and only below the 700px mobile breakpoint:
   ```css
   @media (max-width: 700px){
     html:has(body.page-blog-home){ font-size: 90%; }
   }
   ```
   Targets `html`, not `body` — every `--step-*` value, and the
   text-size control's own mechanism (`main.js`'s `root.style.fontSize`,
   `root` being `document.documentElement`), both scale off the *root*
   element's font-size; `rem` ignores nearer ancestors, so setting this
   on `body` instead would have silently done nothing to any `rem`-sized
   text. `:has()` is what lets this rule live in the stylesheet scoped
   by a class down on `body` while still targeting `html` itself — same
   `:has()` mechanism already in production use for `.katex-display`'s
   tagged-equation padding (§7), so no new browser-support floor is
   introduced.

   **This is a true default, not a forced override** — confirmed by
   checking `main.js` first: it only ever writes an inline
   `root.style.fontSize` on page load when the resolved size index
   differs from its own default (`if (sizeIdx !== DEFAULT_IDX){
   root.style.fontSize = ...}` — a first-time visitor with no
   `localStorage` entry resolves to `DEFAULT_IDX` and gets **no** inline
   style at all). An inline style always wins over any stylesheet rule
   regardless of specificity, so a visitor who has ever actually touched
   the −/+ control keeps exactly what they chose, on this page and
   everywhere else — this CSS rule only ever supplies the *starting*
   value for someone who hasn't set a preference yet, which is precisely
   what "the default text size" was asking for, not a floor that fights
   the control.

   Verified in the browser at three widths on blog home: 1400px (`html`
   stays 16px, title still shrunk per point 1 above — the two changes
   are independent, one is width-scoped and one isn't), and confirmed
   the emulated Browser pane's own narrower width (497px, under the
   700px breakpoint) already showed `html` at 14.4px (16 × 0.9, exactly
   the expected 90%) with the title compounding correctly on top of that
   (16.56px = step-1 × 0.9). Also confirmed a completely different page
   (a tag page) shows `html` at a full, unshrunk 16px even at a true
   375px mobile width, proving the `:has(body.page-blog-home)` scoping
   holds and doesn't leak to any other page.
