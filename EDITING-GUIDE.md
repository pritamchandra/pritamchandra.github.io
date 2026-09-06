# Editing Guide — pritamchandra.github.io

This is your reference for updating the site after today. You never need to
write HTML or touch a template to add a post or a poem — everything below is
either plain text (Markdown, which just means normal writing with a few
light conventions like `**bold**`) or a short, obvious list of `key: value`
lines (YAML). If something ever looks like actual code, that's a sign
something's wrong — stop and ask, don't guess.

## 0. How a local edit becomes a live change on the internet

**The short version:** the folder on your Mac (this one — the one this
guide lives in) *is* the website's source. There's no separate "upload"
step, no FTP, no admin dashboard on some other site. You edit files here,
then run three commands to send those exact files to GitHub, and GitHub
rebuilds the live site from them automatically, usually within a minute
or two. That's the entire mechanism, every time, for every kind of
change in this guide — a new post, a tag fix, a typo, anything.

This folder is already fully set up and connected to your GitHub
account (to the repository `pritamchandra/pritamchandra.github.io`) —
you don't need to configure anything before following the steps below;
this section is about the routine you'll repeat every time you want to
publish a change, not a one-time setup task.

### The routine, every time

**Step 1 — make your edits.** Add a post, edit a data file, whatever
this guide walked you through. Save the file(s) like you would in any
text editor.

**Step 2 — preview locally (optional but recommended).** See §7 further
down for the full instructions (`jekyll serve`, then open
`http://127.0.0.1:4000`) — this shows you the change exactly as it'll
look live, *before* anyone else can see it, so you can catch a typo or a
formatting mistake first. Skip this if you're confident about a small,
low-risk change like fixing one word.

**Step 3 — publish, using three commands in Terminal.** Open Terminal,
navigate to this folder, and run these one at a time (press Return
after each, let it finish before typing the next):

```bash
cd ~/path/to/this/folder
```
(However you normally get here — if you're not sure where "here" is on
your Mac, this folder's path is shown in Terminal's own address/title,
or you can drag the folder itself onto the Terminal window after typing
`cd ` with a trailing space, which fills in the path for you.)

```bash
git add -A
```
This tells git "include every file I've changed or added since last
time." `-A` means "all of them" — you don't need to name files one by
one.

```bash
git commit -m "Describe what you changed, e.g. 'add October blog post'"
```
This saves a permanent snapshot of exactly what you just staged, labeled
with the message you wrote. Make the message a short, honest description
of what changed — it's for your own future reference (git keeps every
one of these forever, so you can always look back at what changed and
when), not for anyone else to read.

```bash
git push
```
This is the actual "publish" step — it sends your snapshot from this
folder up to GitHub. GitHub then rebuilds the live site from what it
just received, automatically, with no further action from you. Give it
a minute or two, then reload
[pritamchandra.github.io](https://pritamchandra.github.io) to see your
change live. If the page looks unchanged, a hard-refresh (Shift+reload,
or Cmd+Shift+R on a Mac) rules out your browser just showing you a
cached older copy.

**Checking what you're about to publish, before you do:** running
`git status` (no arguments) at any point shows you which files have
changed and which are new, without changing anything — a good habit to
run right before `git add -A` if you want to double check exactly
what's about to go out, especially if it's been a while since your last
edit and you don't remember everything you touched.

**If `git push` ever asks you to log in:** use your GitHub username and,
instead of your normal password, a [personal access
token](https://github.com/settings/tokens) — GitHub stopped accepting
plain account passwords for this a few years ago. Generating one is a
one-time setup (GitHub's own page walks you through it — "generate new
token," give it a name, check the "repo" permission box, copy the long
string it gives you), and after you paste it in once, your Mac
remembers it and won't ask again on this computer.

**If `git push` is ever rejected** with a message mentioning the remote
having work you don't have locally — this generally only happens if
you'd edited the site from a second computer, or through GitHub's own
website, without pulling those changes down here first. Run `git pull`
once (fetches and merges in whatever's on GitHub), then `git push`
again. For a one-person project edited from a single folder like this,
you're unlikely to ever see this — it's here so you recognize the
message and know it's not a broken repository, not a step you'll
probably ever need.

### A friendlier alternative to the Terminal: GitHub Desktop

If typing git commands ever feels like more friction than you want, 
[GitHub Desktop](https://desktop.github.com) is a free, official app
that does the exact same three-step publish routine with buttons
instead of commands: it shows you a visual list of every file you've
changed, a box to type your commit message into, a "Commit" button,
and then a "Push origin" button. Point it at this same folder once
(File → Add Local Repository) and from then on, publishing a change is
just: open the app, glance at what changed, type a short message, click
twice. Nothing about the rest of this guide changes if you use it — the
folder, the files, and everything you edit are identical either way;
Desktop is just a different way to do Step 3 above. Worth trying if you
ever want to publish a change without opening Terminal at all; the
command-line version above is worth keeping in mind too, since that's
what a future Claude Code session (like this one) will use on your
behalf when you ask for help with a change directly.

## 1. Where things live, and why

```
/
├── index.md              → the portfolio homepage ("/")
├── blog/
│   ├── index.md           → the blog homepage ("/blog/")
│   ├── confessions/index.md → the "Confessions" collection page
│   └── tag/<name>/index.md  → one small file per tag (auto-linked, you
│                               shouldn't need to touch these)
├── _posts/                → one file per ordinary blog post
├── _books/                → one file per poem/chapter, across all collections
├── _data/                 → the structured lists (publications, teaching, etc.)
│   └── books/              → chapter titles for each collection
├── assets/
│   ├── img/                → author photo goes here
│   ├── audio/               → song recordings go here
│   └── pritam-chandra-cv.pdf → your CV, once you have one to upload
├── _layouts/ and _includes/ → the actual templates (the "how it looks" —
│                               you shouldn't need to open these)
├── for_later/              → a dumping ground for source material (drafts,
│                               PDFs, notes) you want to post eventually but
│                               haven't processed into a real post yet — see
│                               the note right below this tree
└── CLAUDE.md               → the full design spec this site was built from;
                               harmless to ignore, useful if a future
                               developer (including a future AI session)
                               needs the reasoning behind a design choice
```

**`for_later/` is not part of the site at all** — it's excluded from the
Jekyll build (`_config.yml`'s `exclude:` list), so nothing you put there
ever shows up on the live site, no matter what it contains or how it's
named. Use it as a staging area: drop a document in (a rough draft, a
PDF, a voice-memo transcript, whatever), and later ask me in a chat
message to look in `for_later/` and turn a specific file into a real
post — same as how the Homilies entries and this guide's own PDF-to-post
examples were built. Nothing in this folder needs front matter, a
particular filename format, or any site convention at all; it's yours
until you ask for it to become a page.

**Why posts go in `_posts/`, named with the date first:** Jekyll (the tool
that turns these files into the actual website) uses the filename to figure
out a post's publish date and its web address. A file must be named
`YYYY-MM-DD-some-title.md` — e.g. `2026-09-01-a-new-proof.md` — or Jekyll
won't recognize it as a post at all.

**Why the structured lists (publications, teaching, etc.) are separate
files in `_data/`, not part of `index.md`:** you asked for this — it keeps
every publication as one small, consistent block that's easy to copy and
edit, rather than a hand-formatted list where it's easy to make one entry
look slightly different from the rest.

**Leaving a field blank — use `key:` with nothing after it, not
`key: ""`.** This comes up anywhere you see a `null` in an example
below (a book's `subtitle`, a publication's `link`, a reading-list
book's `year`, and so on) — if you don't want that field at all, just
write the key with nothing after the colon:

```yaml
subtitle:
```

not

```yaml
subtitle: ""
```

These look almost the same but aren't: the first means "this field has
no value," which the page correctly reads as "don't show this" and
skips it cleanly. The second means "this field's value is an empty bit
of text," which the page can't tell apart from "show an empty line" —
so instead of the field just disappearing, you can end up with an odd
gap where a blank line was rendered. If you're ever unsure which one you
typed, the safe move is to delete everything after the colon, including
any quote marks.

## 2. Editing the portfolio (`index.md`)

Open `index.md`. The top part, between the two `---` lines, is called
**front matter** — a few `key: value` settings for the page. Leave
`layout:` and `description:` alone. The one thing you might fill in there:

```yaml
bhatia_link: null
```

Once you have a real link for Rajendra Bhatia, change `null` to the link in
quotes, e.g. `bhatia_link: "https://example.edu/~bhatia"`. Until then it
just shows his name as plain text, not a broken link.

Everything **below** the second `---` is your "About" text — three
ordinary paragraphs. Edit that like you'd edit any document. Leave blank
lines between paragraphs.

**Your photo**: save it as `assets/img/author-photo.jpg` (that exact
filename) and it appears automatically — the page checks whether that
file exists and switches from the placeholder "PC" box to your actual
photo on its own, nothing else to edit. It's cropped to a square-ish box,
so a roughly square source photo looks best. It only ever shows on the
full desktop width (≥1000px) — dropped entirely on narrower screens and
in the drawer, by design, not a bug if you don't see it on your phone.

**Sidebar content exists in two places — edit both, or narrow screens
won't match.** The portfolio's left/right sidebars (`_layouts/home.html`)
each have a mirrored copy in the mobile drawer (`_includes/drawer.html`,
the `{% when "home" %}` case) — that copy is what phones and narrow
windows actually show, since the static sidebars are hidden there. There
is no single source of truth the two are generated from; they're just
two separate blocks of text that need to say the same thing. This has
already caused real, live bugs (see CLAUDE.md's most recent UPDATE) —
concretely:

- **"Interests"** (the `matrix analysis · operator inequalities · ...`
  line) — reorder or reword it in `home.html`'s `.col-left` aside, then
  copy the exact same text into `drawer.html`.
- **"Elsewhere"** (the social links list, `.link-list`) — covered below;
  same rule applies, both copies need the same `<li>`s in the same order.

After editing either, check both a wide window *and* a narrow one (or
the mobile drawer) before considering the edit done.

**Social/"Elsewhere" links** live in `_data/social.yml`, not hardcoded in
`home.html` — add or change a URL there (`scholar`, `github`, `orcid`,
`letterboxd`, `youtube`) and it updates in both the sidebar and the
drawer automatically, since both read from the same data file. Leaving a
value as `null` hides that link entirely rather than rendering a dead
one — that's how `youtube` behaves right now. To add an entirely new
link (one `social.yml` doesn't already have a field for), you do need to
touch both `.link-list`s in `home.html` and `drawer.html` by hand — see
the two-places rule above.

**The structured lists** (Journal Publications, Preprints, Select
Lecture Notes, Academic Service) don't live in `index.md` at all —
they're generated automatically from the files in `_data/`:

- `_data/publications.yml`
- `_data/preprints.yml`
- `_data/notes.yml`
- `_data/service.yml`

To add a publication, open `_data/publications.yml`, copy one existing
entry (the block starting with `- year:`), paste it as a new block, and
change the fields. For example:

```yaml
- year: 2027
  title: "Your New Paper Title"
  authors: "<strong>Pritam Chandra</strong>, Some Coauthor"
  venue: "Journal Name"
  link: "https://link-to-the-paper.com"
```

If you don't have a link yet, just write `link: null` — the title will
show as plain text instead of a dead link, and you can fill it in later.
`_data/service.yml` works the same way, just with different fields (look
at an existing entry to see which).

**`authors`, `venue`, and `description` all understand Markdown**, so you
can put a link inside them the normal way — `[Falcon](https://...)` — not
just in `title`/`link`. `<strong>`/`<em>` also still work if you'd rather
write raw HTML for emphasis (both styles can be mixed in the same field).
This isn't only for new entries — `_data/preprints.yml`'s "Fast Fourier
Orthogonalization" venue already had a `[Falcon](...)` link sitting in it
unrendered before this was wired up, which is what prompted adding it.

**Teaching Experience is the one exception** — it's plain prose, not a
data-driven list. Edit `_includes/teaching-description.md` directly, like
any Markdown document (it's included into the Teaching section and run
through Markdown, so `[Name](url)`-style links work normally there). The
old table (`_data/teaching.yml` + the `.teaching-table` markup in
`home.html`) still exists underneath, just commented out with `{%
comment %}...{% endcomment %}` rather than deleted, in case you want a
table again later — ask for it to be switched back rather than trying to
uncomment Liquid by hand.

## 3. Adding an ordinary blog post

Create a new file in `_posts/`, named like this:

```
_posts/2026-09-01-my-new-post-title.md
```

Start it with front matter, then your content below:

```markdown
---
title: "My New Post Title"
description: "One sentence for search engines and link previews."
date: 2026-09-01
tags: [some-tag, another-tag]
preview: "One or two sentences shown on the blog home's list of posts."
---
Your post text starts here, written as normal Markdown. Use blank lines
between paragraphs, `**bold**`, `*italic*`, and so on.
```

Tags are free-form — if you use a new tag that doesn't have a page yet
under `blog/tag/`, ask (or use this guide's own file structure as a
model — an existing tag folder like `blog/tag/mathematics/index.md` is a
three-line file you can copy and rename).

**If you want a theorem/lemma/proof box** (like in the math sample post),
paste this directly into your post — it's plain HTML, which Markdown
passes through completely untouched (that's the whole reason it's
written this way — more on that below):

```html
<div class="thm">
  <span class="thm-label">Lemma 1</span>
  <div class="thm-body">
    <p>State the lemma. Inline math like $A \succeq B$ works here too.</p>
  </div>
</div>
```

**Why every paragraph inside a box like this needs its own `<p>` tag,
instead of just being plain text like the rest of your post:** it's not
arbitrary — it's what keeps LaTeX commands from getting silently
corrupted. Markdown treats `<div>...</div>` as a sealed unit and doesn't
touch anything inside it — no auto-`<p>`-wrapping, but also, critically,
**no chance of Markdown misreading a LaTeX command as its own syntax**.
Outside a sealed `<div>` (i.e. in ordinary paragraph text, including
plain `$...$` math sitting directly in a sentence), Markdown actively
looks for characters like `*`, `_`, `#`, and a few others and tries to
do something with them — which can reach *inside* your math and corrupt
it, invisibly, with no error message. This is the single most important
thing to know about writing math on this site, so it's worth being
concrete about exactly what's safe and what isn't.

**Inside a `$...$` or a `<div>\[ ... \]</div>` display equation, avoid
these bare characters — use the LaTeX word-command instead of typing the
symbol directly:**

| Avoid (bare) | Use instead | Why |
|---|---|---|
| `*` | `\ast` | Markdown reads `*` as italics |
| `\|` | `\lvert`, `\rvert` | Markdown reads `\|` as a table column |
| `\#` | (rewrite, see below) | Markdown strips the backslash |
| `\!` | (rewrite, see below) | Markdown strips the backslash |
| `\{`, `\}` | plain `{`, `}` (no backslash) | Markdown strips the backslash |

The last three are about a **literal backslash immediately followed by
one of those characters** — this is Markdown's own escape syntax (`\#`
normally means "print a literal #, don't treat it as a heading"), and it
fires even inside math, silently eating the backslash your LaTeX command
actually needed. Concretely:

```
Wrong:  $A \# B$              (the \# for Ando's geometric-mean symbol)
Wrong:  $A^{1/2}\!B$          (the \! for a negative thin space)
Wrong:  $\{x : x > 0\}$       (escaped braces for a literal set)

Right:  wrap the whole equation in a plain <div>\[ ... \]</div> instead —
        display equations are always 100% safe, this issue is specific
        to bare $...$ math sitting directly in a sentence.
```

**Bare `{` and `}` with no backslash are always fine** (e.g. `A^{-1}`,
`\frac{1}{2}`) — it's only the *escaped* `\{`/`\}` form (for printing a
literal curly brace) that's at risk, and that's rare enough in normal
use that the simplest fix is usually to just avoid it or move that one
equation into a `<div>` block. A single, lone `*` or `\|` with no
matching second one later in the same paragraph is also harmless —
the risk is specifically when Markdown finds a *pair* of them to match
up, which is exactly what happened with `\!`/`\#` too (they're
Markdown's own escape sequences, not a pairing issue, but the fix is the
same: keep them out of bare inline math).

**If a piece of inline math needs any of these**, the reliable fix is
the same one already used for standalone equations: wrap it in a plain
`<div>...</div>`, even for something short and inline-looking:

```html
The geometric mean, written <div>$A \# B$</div>, satisfies...
```

This is a little more HTML than ideal, admittedly — but it's the
difference between math that's *guaranteed* correct and math that's
*usually* correct, and for a site whose whole reason for self-hosting
KaTeX in the first place was "never let a rendering bug hide silently,"
guaranteed wins. If you'd rather not think about any of this on a
case-by-case basis, the simplest blanket rule is: **any theorem/lemma/
proof box, or any paragraph with more than trivial math in it, just use
`<p>` tags for its text like the example above** — that's what makes it
a sealed `<div>`, immune to all of this by construction, at the cost of
typing `<p>` yourself instead of a blank line.

**A note on a fancier alternative, and why it's not the default here:**
kramdown (the Markdown engine this site uses) has a feature where adding
`markdown="1"` to a `<div>` tells it to keep processing Markdown *inside*
that div — meaning you'd get automatic `<p>` tags, `**bold**`, numbered
lists, and so on, without writing raw HTML for any of it. It looks
tempting for exactly this situation. The problem: turning Markdown
processing back on inside the box also turns the *escaping bug above*
back on for anything inside it — so `markdown="1"` trades "less typing"
for "your `\#`/`\!` math can silently break," which for a math-heavy
site is the wrong trade more often than not. If you want to try it
anyway for a specific box you're sure has no risky math in it, ask and
I'll set it up — just don't expect it as the default, and don't be
surprised if I steer a request back toward the safer `<p>` version when
the content has real LaTeX in it.

**If you want math**, inline math is just `$...$` right in your sentence,
e.g. `the matrix $A$ is positive definite`. A standalone equation on its
own line is automatically **centered** if it fits within the text column,
and becomes **left-aligned with its own horizontal scrollbar** if it's too
wide — you don't need to do anything for either case, it's handled
automatically. Wrap it in a plain `<div>` like this (the `<div>` is
required — without it, Markdown can accidentally mangle the backslashes,
per the whole discussion above):

```html
<div>
\[ F(A,B) = \left(A^{1/2} B A^{1/2}\right)^{1/2} \]
</div>
```

**If you want lyrics or a poem-style block**, wrap it in a `<p
class="verse">` tag directly — this preserves your line breaks exactly as
typed:

```html
<p class="verse">Line one of the poem,
line two of the poem,

a new stanza after a blank line.</p>
```

For italic curly quotes/apostrophes and em-dashes inside a verse block,
just type them directly (`'` `"` `—`) rather than typing straight quotes —
unlike regular paragraph text, Markdown won't auto-convert them for you
inside a raw block like this.

**If you want an audio player** (see the song post for a full example):

```liquid
{% include audio-player.html src="/assets/audio/your-file.m4a" duration="3:42" instruments="guitar, voice" caption="Recorded at home." %}
```

**If you want images** (see "Spirals and Seeds: A Small Gallery" for a
full example), there are three layouts, all plain HTML you paste directly
into your Markdown:

A full-width image, spanning the whole text column:

```html
<figure class="gallery-full">
  <img src="/assets/img/your-image.jpg" alt="A short description for accessibility/screen readers">
  <figcaption>An optional caption, shown small and centered underneath.</figcaption>
</figure>
```

A smaller image with text wrapping around it — use `gallery-float-left`
or `gallery-float-right` depending on which side you want it on:

```html
<figure class="gallery-float-right">
  <img src="/assets/img/your-image.jpg" alt="A short description">
  <figcaption>An optional caption.</figcaption>
</figure>
```
Put this figure right before the paragraph you want it to sit alongside
— the text will flow around it automatically. On a phone, it automatically
switches to full-width and stacks above the text instead (there's no room
to wrap around on a narrow screen). Save your image file into
`assets/img/` first, then point `src` at it, e.g.
`/assets/img/your-image.jpg`.

**If you want video**, embed it — self-hosting a video file isn't
practical for a personal blog the way self-hosting audio is (video files
are much larger), so this is the one place on the site where an external
embed (YouTube, Vimeo) is the normal, expected approach rather than
something to avoid:

```html
<figure class="gallery-video">
  <div class="video-frame">
    <iframe src="https://www.youtube-nocookie.com/embed/YOUR-VIDEO-ID" title="A short title" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>
  </div>
  <figcaption>An optional caption, e.g. attribution/license.</figcaption>
</figure>
```
Use `youtube-nocookie.com` (not the regular `youtube.com` embed URL) —
it's YouTube's own privacy-friendlier embed domain, doesn't set tracking
cookies until someone actually presses play. The video ID is the part
after `watch?v=` in a normal YouTube URL.

**If you want references (a numbered bibliography)**, write a plain
numbered list at the end of your post, and link to each entry from the
text with a small `[1]`-style tag:

```html
In the text: this is a known result <a class="ref-link" href="#ref-1">[1]</a>.

At the end of the post:
<section class="references">
  <h2>References</h2>
  <ol>
    <li id="ref-1">Author, A. (Year). <em>Title of the work</em>. Publisher.</li>
    <li id="ref-2">Another Author, B. (Year). Title of a paper. <em>Journal Name</em>, volume, pages.</li>
  </ol>
</section>
```
The `id="ref-1"` on each list item has to match the `href="#ref-1"` on
its in-text link, and the numbering is automatic (just the position in
the list) — you never type the number `1` yourself, only the matching
`ref-1`/`ref-2`/... ids.

**If you want footnotes**, these use Markdown's own built-in footnote
syntax — no HTML needed at all. Write `[^1]` right where you want the
little numbered marker to appear in your sentence, then anywhere else in
the same file (the bottom is the natural place) write what it says:

```markdown
This claim needs a little more support than I can give it here.[^1]

[^1]: Here's the fuller explanation, as long as you like.
```
Jekyll collects every `[^...]` in the post automatically into a numbered
list at the very bottom, each with a small arrow that jumps back to where
you were reading — you don't build any of that by hand, just write the
`[^1]` marker and its matching `[^1]: text` definition. See "Von
Neumann's Trace Inequality" for a working example of both references and
footnotes side by side.

## 4. Adding a new collection (a multi-chapter "book," like Confessions)

This is the least obvious of the three, so here's the full walkthrough.

**Step 1 — decide on a slug.** A short, URL-safe name for the book, e.g.
`watched-mostly-alone`. This will become the address
`pritamchandra.github.io/blog/watched-mostly-alone/`.

**Step 2 — create the book's own index page.** Make a new folder under
`blog/` named after your slug, with an `index.md` inside:

```
blog/watched-mostly-alone/index.md
```

```yaml
---
layout: book
title: "Watched, Mostly Alone"
description: "One sentence about the collection."
book_slug: watched-mostly-alone
book_title: "Watched, Mostly Alone"
subtitle: "notes on film, 2025"
tags: [film]
date: 2025-12-01 12:00:00 +0530
note: null
preview: "One or two sentences shown on the blog home's list of posts."
---
```

**Important:** the `date:` must include a time (like `12:00:00 +0530`
above), not just a bare date. If you leave the time off, the blog home's
sorting can break because of a quirk in how the site's building tool reads
dates — always copy the exact format above and just change the numbers.

**`subtitle:` is shown right under the book's title** (e.g. Confessions'
"poems, 2024–2026"). It's also ordinary Markdown now — `*italic*`,
`**bold**`, and literal quotation marks all work directly, same as
`note` just below. Leave it out (`subtitle:` with nothing after it) if
you don't want one.

**`note:` is a short editorial note shown right below the collection's
title/tags, above the first chapter** (used on Confessions for the
"these are placeholder poems" disclaimer). Leave it `note: null` if you
don't want one. When you do want one, it's written as ordinary Markdown
— `**bold**`, `*italic*`, even multiple paragraphs — same rules as the
body of any post. The one thing to know is *how* to write it, since it
lives on one YAML line by default:

- **A short, single-line note** can just go in quotes on the same line:
  ```yaml
  note: "A short note, with a \"quoted phrase\" if you escape the quotes like this."
  ```
  Note the backslash before each inner `"` — easy to forget, easy to get
  wrong on a long line.
- **Anything longer, or with quotation marks, or more than one
  paragraph** is much easier written as a YAML "block" instead — put a
  `|` after `note:`, then indent every following line by two spaces.
  Nothing on those lines needs escaping, including `"` quotes:
  ```yaml
  note: |
    A longer editorial note. You can use "quotation marks" here freely,
    apostrophes like it's or don't, and *italic* or **bold** too.

    A blank line like the one above starts a new paragraph.
  ```
  This is the recommended way to write `note:` any time it's more than
  a short sentence — copy this block form and just change the wording.

**Step 3 — add the chapter titles.** Make a new file:

```
_data/books/watched-mostly-alone-chapters.yml
```

```yaml
chapters:
  - number: "I"
    id: "i"
    title: "Your Chapter Title"
    intro: "An optional sentence introducing the chapter. Delete this line if you don't want one."
  - number: "II"
    id: "ii"
    title: "Second Chapter Title"
    intro: null
```

If your book has no chapters at all — just a flat list of pieces — skip
this file and skip the `chapter:`/`chapter_order:` fields below too (see
Step 4's note).

**Step 4 — write each piece as its own file in `_books/`.** One file per
poem/entry, named however you like, e.g.:

```
_books/watched-mostly-alone-i-1-some-film.md
```

```yaml
---
book: watched-mostly-alone
chapter: "I"
chapter_order: 1
order: 1
title: "Some Film"
slug: i-1
epigraph: null
gloss: null
---
Your piece's text goes here.
```

- `chapter` must match a `number:` from the chapters file exactly (`"I"`,
  `"II"`, ...).
- `chapter_order` is this piece's position within its chapter (1, 2, 3...)
  — it becomes the "I.1", "I.2" numbering.
- `order` is this piece's position in the whole book, top to bottom —
  easiest to just count 1, 2, 3... across every piece in the book. **This
  is only consulted for pieces that have no `date` at all** — see the
  `date` bullet just below, and "Reordering pieces or chapters" further
  down for how the two interact.
- `slug` becomes the anchor in the URL (`#i-1`) — keep it matching
  `chapter-num.chapter_order` in lowercase, like the example.
- `epigraph` is optional: delete the `null` and replace with
  `epigraph:` then two indented lines `text: "..."` and `cite: "..."` if
  you want one (copy the format from an existing Confessions file if
  unsure). **Nothing is added automatically** — no quotation marks, no
  italics. Write `text` to look exactly the way you want it to appear:
  type your own `"..."` if you want quotation marks (including a
  quote-within-a-quote, e.g. someone's own words quoted inside the
  passage you're quoting — the whole reason this is manual), and wrap
  words in `*...*` if you want italics, `**...**` for bold. `text` is
  processed the same as `note` (§4 above and the block below) — same
  two ways to write it:
  ```yaml
  epigraph:
    text: "A short one-liner, with \"escaped\" quotes if you keep it on one line."
    cite: "Author, Source"
  ```
  or, easier once there's any real punctuation in it, the block-scalar
  form (recommended):
  ```yaml
  epigraph:
    text: |
      *"As if this were the last thing," she said* — no escaping needed
      for the quotes here, and this line is italicized because it's
      wrapped in *asterisks*, not because the site does it for you.
    cite: "Author, Source"
  ```
  `cite` is a plain attribution line, not run through Markdown — write
  it in ordinary quotes and escape any inner `"` the usual way. It's
  shown exactly as typed, with nothing added — if you want a dash
  before it (like "&mdash; John 12:23&ndash;25"), type it yourself
  (`cite: "&mdash; John 12:23&ndash;25"`); leave it off for just the
  attribution on its own.
- **An epigraph, when present, always appears *above* the piece's
  title** — title immediately followed by the piece's own text, epigraph
  first. This isn't something you control per-piece; it's how every
  epigraph on the site is placed.
- `gloss` is an optional short note after the piece — leave as `null` to
  skip it.
- **If your book has no chapters**, just omit `chapter:` and
  `chapter_order:` entirely, and skip Step 3 — the piece will render as a
  flat entry with no chapter grouping. Its number (shown above the
  title, and in Contents) is just its position in the book — `order: 1`
  shows as "1", `order: 2` as "2", and so on — and `slug` for a
  chapterless book is just that same plain number (`slug: 1`, `slug: 2`,
  ...), not the `i-1`-style slug a chaptered book uses. "From the
  journal" (`_books/from-the-journal-*.md`) is a working example of this
  — three entries, no chapters at all.
- `date` is optional on any piece, chaptered or not — add it
  (`date: 2026-03-15`) and it's shown right under the piece's title,
  small and muted, as an abbreviated month and year (e.g. "Mar 2026") —
  never the day, even though you type the full date. Leave it out
  entirely if you don't want a date shown — there's no blank
  placeholder, the line just doesn't appear. **Adding a real `date` also
  changes how the piece is sorted** — see the next section.

For the piece's actual text, use `<p class="verse">...</p>` for
poetry/lyrics (see §3 above), or just ordinary paragraphs for prose.

### Reordering pieces or chapters after the fact

**If a book's pieces have no `date` field at all** (Translations of
Lyrics, Confession, Elegy, and most others), the reading order is just
whatever you set with `order:` — to move a song up, give it a lower
`order` number than the piece you want it to come before. You don't
need to keep every file's `order` perfectly sequential (no gaps, no
duplicates) — Jekyll just sorts by whatever numbers are there, so to
swap two adjacent songs you only ever need to edit those two files'
`order` values, not renumber the whole book. For example, in
Translations of Lyrics, to move "Bahu Manaratha" (currently `order: 4`)
above "Phir Le Aya Dil" (currently `order: 3`), just change Bahu
Manaratha's `order` to `3` and Phir Le Aya Dil's to `4` — nothing else
in the book needs to change.

**If a book's pieces *do* carry real `date` fields** (like "From the
journal," or the two poems collections with real dates), any piece with
a date sorts itself automatically, newest first, ahead of any piece with
no date — you don't set an `order` for these at all to control their
relative position, the date does it for you. To reorder two dated
pieces, correct their `date` values rather than their `order` (their
`order` is ignored as long as they have a date). A book can mix the two:
dated pieces always float to the top, newest first, with any undated
pieces trailing after them in plain `order` sequence — so if a piece
mysteriously isn't where you expect, check whether it (or its neighbor)
has a `date` before touching `order` at all.

**To reorder the top-level *chapters* of a chaptered book** (like
Homilies — the numbered "1", "2", ... groupings, not the pieces inside
them), the pieces' own `order`/`date` don't come into it at all. Open
that book's `_data/books/<slug>-chapters.yml` file and move the whole
chapter block (the `- number: ...` through the next chapter's `-
number:`) to wherever you want it in the list — the file's own top-to-
bottom order is exactly the page's rendering order. You don't need to
renumber anything: each chapter's displayed numeral is computed from its
position in this list automatically, and the `number:` field is just an
internal label a chapter's pieces use to say which chapter they belong
to (their `chapter:` front-matter field) — moving a chapter's block
around, or inserting a brand-new one anywhere including the very top,
never requires touching that field or any piece's front matter.

**If the piece is a translated song** (like "Translations of Lyrics"),
add a plain italicized link to the original recording right above the
text — just ordinary Markdown, nothing to paste or style:

```markdown
*[Listen to Song Title](https://youtu.be/VIDEO_ID)*
```

Replace `Song Title` with the song's actual name and `VIDEO_ID` with a
link to the recording (YouTube or anywhere else). That's the whole
pattern — one line, no thumbnail, no box.

That's it — once these files exist, the book automatically shows up on the
blog home's timeline, gets a working table of contents, and its tags
become real links.

## 5. Bible verse links (hover or tap to preview the verse)

Used on the Homilies posts. Any Bible citation you write can become a
small interactive link — hovering it on a computer, or tapping it on a
phone, pops up a small box showing the verse itself (NIV text), without
leaving the page. Tapping/clicking anywhere else closes it again.

**Two steps, both required, in either order:**

1. **Write the citation as a link, directly in your Markdown**, using this
   exact HTML (raw HTML like this passes straight through, same as the
   `.thm`/`.proof` boxes in §3):
   ```html
   As <a href="#" class="verse-ref" data-verse="Colossians 1:17">Colossians 1:17</a> puts it...
   ```
   The `data-verse="..."` value is the lookup key — it must match a key
   in the file from step 2, exactly, including the colon and spacing
   (`"Colossians 1:17"`, not `"Colossians 1: 17"` or `"colossians 1:17"`).
   The visible link text (between the `>` and `</a>`) can say whatever
   you like — it doesn't have to match the key.

2. **Add the verse text to `_data/bible_verses.yml`**, one line per verse:
   ```yaml
   "Colossians 1:17": "He is before all things, and in him all things hold together."
   ```
   If you cite a verse that isn't in this file yet, the link just won't
   pop anything up — it fails quietly, not with an error — so it's safe
   to add the link first and the text later, just don't forget the
   second step or the link will look inert.

The file already has a short comment at the top explaining that this is
NIV text, used under the license terms that allow quoting individual
verses with attribution — keep that comment if you ever edit the file,
and keep quoting single verses (not long passages) the same way the
existing entries do.

## 6. The reading list — adding, editing, and favorites

Your reading list lives at `pritamchandra.github.io/reading/`. It has two
parts: the **favorites shelf** at the top (up to a handful of covers,
side by side) and the **full list** below it (every book, newest first).
Every book is just one file in `_reading/`, named however you like, e.g.:

```
_reading/the-name-of-the-wind.md
```

```yaml
---
title: "The Name of the Wind"
author: "Patrick Rothfuss"
cover: "https://covers.openlibrary.org/b/isbn/9780756404079-M.jpg"
goodreads: "https://www.goodreads.com/book/show/186074.The_Name_of_the_Wind"
year: 2027          # the year you finished it — leave as `null` while reading
status: null         # set to `reading` (no quotes) while you're partway through, instead of a year
order: 10            # one higher than whatever your last book's order was
favorite: null       # see "Favorites" below — leave null unless it's one of your handful of favorites
---
Your review goes here, if you want to write one — completely optional,
ordinary Markdown. Leave this blank (just the front matter, nothing
below the second `---`) for a book you don't want to write about; it'll
still show up in the list with no "Review" link next to it.
```

**Editing a book already on the list** (fixing a year, adding a review
later, swapping a cover) is just opening its file in `_reading/` and
changing the field — nothing else to update, the list and the favorites
shelf both rebuild from these files automatically.

### Getting the cover, title, and author

**The easiest way**: find the book on Goodreads, copy its URL, and just
ask me (Claude Code) in a chat message to add it — paste the Goodreads
link plus the year (or "still reading") and I'll look up the cover image
and pull the author's name for you, then write the file myself. This
isn't something the site does automatically on its own (a plain Jekyll
site like this one can't reach out to the internet while it's building)
— it's a "ask Claude to do it" step each time you add a book, same as
asking me to add a blog post.

**If you already have a specific cover image you want** (a photo of your
own copy, a nicer scan, a particular edition) — just give me that image,
or a direct link to it, and tell me to use it instead of looking one up.
The `cover` field is just a URL; whatever you hand me becomes that URL,
and I only go looking on Goodreads/Open Library when you *don't* give me
one. If you're doing this yourself rather than asking me: drop the image
file in `assets/img/` and point `cover` at it, e.g. `cover:
"/assets/img/my-photo-of-this-book.jpg"`.

**If you'd rather look up a generic cover yourself**: the `cover` field
just needs to be a URL to an image. [Open Library's cover
service](https://covers.openlibrary.org) is a reliable free source —
search for your book at [openlibrary.org](https://openlibrary.org), open
its page, and the image URL follows the pattern
`https://covers.openlibrary.org/b/id/<some number>-M.jpg` (right-click
the cover on the book's page → "Copy Image Address" gets you this). One
thing worth checking: Open Library sometimes surfaces a foreign-language
or blank-cover scan as the top result for a classic with many editions —
if a cover ever looks wrong once it's live, that's almost always why;
just search again for your specific edition/translation.

If you ever leave `cover` blank entirely, a small placeholder box (with
the same book icon used for "currently reading") shows in its place
instead of a broken image — nothing breaks, it just looks obviously
unfinished until you fill it in.

### "Currently reading" and ordering

A book with `status: reading` shows a small book icon instead of a year
in the list — that's automatic, you don't pick the icon yourself. `order`
only controls sorting (newest at the top) — it doesn't need to be exactly
sequential, just higher than whatever came before it chronologically.

### Favorites

The shelf of covers at the top of the page shows whichever books have a
`favorite:` number set, in that order — `favorite: 1` first, `favorite:
2` second, and so on. This is completely independent of `order` (which
is about when you read something) — favorites is about which ones you'd
recommend. To change your favorites: edit the `favorite:` field on the
relevant book files (set it to `null` to remove one, or give a new book
a number to add it). There's no fixed limit, but the shelf is one row
that just gets narrower as you add more — four or five is about right
before it gets cramped on a phone.

## 7. Previewing changes before publishing

You'll need [Ruby](https://www.ruby-lang.org) and Jekyll installed once —
if you're not sure whether you have them, open Terminal and run:

```bash
jekyll -v
```

If that prints a version number, you're set. If not, ask for help
installing Ruby + Jekyll (a one-time setup).

To preview the site on your own computer before publishing:

```bash
cd ~/path/to/this/folder
jekyll serve
```

Then open `http://127.0.0.1:4000` in your browser. Leave that terminal
window running while you look around; press Ctrl+C to stop it. Every time
you save a file, refresh the browser to see the change — no need to
restart the server.

**To preview on your phone instead** (useful for checking anything
phone-specific, like the drawer or the mobile-only icon rendering) — your
Mac and phone need to be on the **same Wi-Fi network**. Start the server
so it listens for other devices, not just itself:

```bash
cd ~/path/to/this/folder
jekyll serve --host 0.0.0.0
```

Then find your Mac's local network address — open a second Terminal tab
and run:

```bash
ipconfig getifaddr en0
```

That prints something like `192.168.1.15`. On your phone's browser, go to
`http://192.168.1.15:4000` (using whatever number your Mac actually
printed). This address can change if your Mac reconnects to Wi-Fi or
switches networks, so re-run the `ipconfig` command if the page stops
loading on your phone after a while. Ctrl+C in the Terminal stops the
server, same as the plain `jekyll serve` case above.

## 8. Publishing

See §0 at the very top of this guide for the full walkthrough (the
three-command git routine, what to do if `git push` asks you to log in,
and the GitHub Desktop alternative). Once you're happy with a change,
the short version is:

```bash
cd ~/path/to/this/folder
git add -A
git commit -m "Describe what you changed, e.g. 'add October blog post'"
git push
```

A minute or two after `git push` finishes,
[pritamchandra.github.io](https://pritamchandra.github.io) will show
your update — GitHub rebuilds the site automatically, you don't need to
run `jekyll build` yourself for the live site (that's only for local
preview, §7 above).
