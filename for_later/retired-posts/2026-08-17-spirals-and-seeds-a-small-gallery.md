---
title: "Spirals and Seeds: A Small Gallery"
description: "A short, image-heavy note on the golden spiral and phyllotaxis, doubling as a formatting reference for images and video."
date: 2026-08-17
tags: [Mathematics, Culture]
preview: "A short, image-heavy note on the golden spiral and phyllotaxis — mostly an excuse to show what a gallery-style post can look like here."
---
The golden ratio $\varphi = \frac{1+\sqrt5}{2}$ shows up in more places than
its reputation deserves, but one appearance is genuinely load-bearing
rather than decorative: the logarithmic spiral with growth rate tied to
$\varphi$, which turns up whenever a system grows by adding new material
at a constant angle to what's already there.

<figure class="gallery-full">
  <img src="{{ '/assets/img/gallery-golden-spiral.svg' | relative_url }}" alt="A golden spiral, drawn as a single continuous line opening outward across three turns">
  <figcaption>A golden spiral — each quarter turn scales the radius by $\varphi$. Original line drawing, self-hosted, same technique as the fish on the blog home.</figcaption>
</figure>

The clearest everyday version of this is **phyllotaxis** — the arrangement
of seeds in a sunflower head, or scales on a pinecone. Each new seed is
placed at a fixed angle (the *golden angle*, $\approx 137.5°$) from the
last one, then pushed outward. Do that a couple hundred times and the
seeds self-organize into two families of interleaving spirals, with no
central planning required:

<figure class="gallery-float-right">
  <img src="{{ '/assets/img/gallery-seedhead.svg' | relative_url }}" alt="A phyllotaxis point pattern showing the spiral seed arrangement of a sunflower head">
  <figcaption>199 points, each placed at 137.5° from the last.</figcaption>
</figure>

What makes 137.5° special is that it's the angle you get from $\varphi$
itself — specifically, it's the fraction of a full turn *least well
approximated* by any simple fraction. Any angle that's close to a clean
fraction like $\frac{1}{3}$ or $\frac{2}{5}$ of a turn produces seeds that
line up into obvious straight rows, wasting the space between rows. The
golden angle is, in a precise sense, the angle that avoids this most
stubbornly — which is exactly why it wins out evolutionarily: it's the
packing that leaves the least room going spare.

None of this is unique to sunflowers. The same growth-by-constant-angle
process, at a much coarser scale, is why a lot of natural silhouettes —
tree branches, coastlines, mountain ridgelines — read as "organic" rather
than geometric: not because they're random, but because they're built the
same way, one small addition at a time, at an angle that never quite
repeats.

<figure class="gallery-float-left">
  <img src="{{ '/assets/img/gallery-mountains.svg' | relative_url }}" alt="A simple line drawing of layered mountain ridges under a small sun">
  <figcaption>Two ridgelines, drawn by hand rather than generated — the point being that "organic" doesn't require a formula, just irregularity that doesn't repeat.</figcaption>
</figure>

That contrast — a process that's simple and exact (the spiral) producing
something that looks organic and irregular (the seed head, the
ridgeline) — is most of why I find this pattern worth coming back to. It
isn't that nature is "doing math." It's that a small number of very
simple rules, applied patiently, are enough to produce almost everything
that looks complicated.

For a change of pace from spirals drawn by hand, here's a short,
freely-licensed film that's a fixture of exactly this kind of
"here's what an embed looks like" post — used constantly for that purpose
precisely because the license allows it:

<figure class="gallery-video">
  <div class="video-frame">
    <iframe src="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ" title="Big Buck Bunny — Blender Foundation" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>
  </div>
  <figcaption><em>Big Buck Bunny</em> (2008), Blender Foundation — CC BY 3.0. An external embed, not self-hosted like the audio on this site; see the note below.</figcaption>
</figure>

<hr class="rule" style="margin: 2.6em 0;">
<p style="color:var(--text-muted); font-size:.92rem;"><em>This post is mostly a formatting reference for images and video — the three illustrations above are original line art made for this post (self-hosted, same as everything else on the site), but the embedded film is the one deliberate exception to the site's usual self-hosting rule: video is heavy enough that self-hosting it isn't practical for a personal blog, so an embed is the standard, expected approach here — unlike the KaTeX/font situation this site otherwise avoids CDNs for. See <a href="https://github.com/pritamchandra/pritamchandra.github.io/blob/main/EDITING-GUIDE.md">EDITING-GUIDE.md</a> for the exact Markdown/HTML for all three layouts.</em></p>
