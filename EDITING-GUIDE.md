# Editing Guide — pritamchandra.github.io

This is your reference for updating the site after today. You never need to
write HTML or touch a template to add a post or a poem — everything below is
either plain text (Markdown, which just means normal writing with a few
light conventions like `**bold**`) or a short, obvious list of `key: value`
lines (YAML). If something ever looks like actual code, that's a sign
something's wrong — stop and ask, don't guess.

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
└── CLAUDE.md               → the full design spec this site was built from;
                               harmless to ignore, useful if a future
                               developer (including a future AI session)
                               needs the reasoning behind a design choice
```

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

**The structured lists** (Journal Publications, Preprints, Notes, Academic
Service, Teaching) don't live in `index.md` at all — they're generated
automatically from the files in `_data/`:

- `_data/publications.yml`
- `_data/preprints.yml`
- `_data/notes.yml`
- `_data/service.yml`
- `_data/teaching.yml`

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
`_data/teaching.yml` and `_data/service.yml` work the same way, just with
different fields (look at an existing entry to see which).

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
passes through untouched:

```html
<div class="thm">
  <span class="thm-label">Lemma 1</span>
  <div class="thm-body">
    <p>State the lemma. Inline math like $A \succeq B$ works here too.</p>
  </div>
</div>
```

**If you want math**, inline math is just `$...$` right in your sentence,
e.g. `the matrix $A$ is positive definite`. For a standalone, centered
equation, wrap it in a plain `<div>` like this (the `<div>` is required —
without it, Markdown can accidentally mangle the backslashes):

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
  easiest to just count 1, 2, 3... across every piece in the book.
- `slug` becomes the anchor in the URL (`#i-1`) — keep it matching
  `chapter-num.chapter_order` in lowercase, like the example.
- `epigraph` is optional: delete the `null` and replace with
  `epigraph:` then two indented lines `text: "..."` and `cite: "..."` if
  you want one (copy the format from an existing Confessions file if
  unsure).
- `gloss` is an optional short note after the piece — leave as `null` to
  skip it.
- **If your book has no chapters**, just omit `chapter:` and
  `chapter_order:` entirely, and skip Step 3 — the piece will render as a
  flat entry with no chapter grouping.

For the piece's actual text, use `<p class="verse">...</p>` for
poetry/lyrics (see §3 above), or just ordinary paragraphs for prose.

That's it — once these files exist, the book automatically shows up on the
blog home's timeline, gets a working table of contents, and its tags
become real links.

## 5. Previewing changes before publishing

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

## 6. Publishing

This site is a **git repository** connected to GitHub — GitHub is where
the live copy lives, and `git` is how you send your changes there.

Once you're happy with a change:

```bash
cd ~/path/to/this/folder
git add -A
git commit -m "Describe what you changed, e.g. 'add October blog post'"
git push
```

That's the whole publishing step. A minute or two after `git push`
finishes, [pritamchandra.github.io](https://pritamchandra.github.io) will
show your update — GitHub rebuilds the site automatically, you don't need
to run `jekyll build` yourself for the live site (that's only for local
preview).

If `git push` ever asks you to log in, use your GitHub username and,
instead of your password, a
[personal access token](https://github.com/settings/tokens) — GitHub
stopped accepting plain passwords for this a while back. This should only
come up once; after that your computer remembers it.
