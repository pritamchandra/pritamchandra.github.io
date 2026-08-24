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
- **`.epigraph`** — centered, both-sides-indented, **oblique, not
  italic** (`font-style: oblique 10deg`) — the user was specific about this
  distinction; don't substitute `font-style: italic`.
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
- Oblique (not italic) quotes.
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
