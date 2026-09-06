---
title: "Von Neumann's Trace Inequality — Notes with References"
description: "A short note on von Neumann's trace inequality, used as a formatting reference for citations and footnotes."
date: 2026-08-10
tags: [mathematics, matrix analysis]
preview: "A short note on von Neumann's trace inequality, doubling as a reference for how citations and footnotes are written on this site."
---
For $n\times n$ complex matrices $A, B$, let $\sigma_1(A) \ge \cdots \ge
\sigma_n(A) \ge 0$ denote the singular values of $A$ in decreasing order.
Von Neumann's trace inequality bounds $\lvert\operatorname{tr}(AB)\rvert$ in terms of
these singular values alone — a fact that turns out to be surprisingly
useful, since it reduces a statement about the full matrices to one about
two ordered lists of numbers.[^1]

<div class="thm">
  <span class="thm-label">Theorem (von Neumann, 1937)</span>
  <div class="thm-body">
    <p>For any $n\times n$ complex matrices $A$ and $B$,</p>
    <div>
    \[ \left|\operatorname{tr}(AB)\right| \;\le\; \sum_{i=1}^{n} \sigma_i(A)\,\sigma_i(B). \]
    </div>
    <p>Equality holds when $A$ and $B$ are simultaneously diagonalizable
    by the same pair of unitaries, with singular values sorted in the
    same order <a class="ref-link" href="#ref-1">[1]</a>.</p>
  </div>
</div>

The inequality is tight in a useful sense: the right-hand side is exactly
the maximum of $\lvert\operatorname{tr}(UAV^\ast B)\rvert$ over unitary $U, V$, so no
sharper *linear* bound in the singular values is possible.[^2] A short
corollary worth keeping close at hand:

<div class="thm">
  <span class="thm-label">Corollary</span>
  <div class="thm-body">
    <p>If $A, B \succeq 0$ are positive semidefinite, then $\operatorname{tr}(AB) \le \sigma_1(A)\operatorname{tr}(B)$.</p>
  </div>
</div>
<div class="proof">
  <p><span class="proof-label">Proof.</span> Apply the theorem with singular values equal to eigenvalues (both matrices are positive semidefinite), then bound $\sigma_1(A)$ outside the sum: $\sum_i \sigma_i(A)\sigma_i(B) \le \sigma_1(A)\sum_i \sigma_i(B) = \sigma_1(A)\operatorname{tr}(B)$.</p>
</div>

This corollary alone accounts for most of the times I actually reach for
von Neumann's inequality in practice — it's the standard way to bound a
trace inner product without needing the full simultaneous-diagonalization
machinery <a class="ref-link" href="#ref-2">[2]</a>.

<section class="references">
  <h2>References</h2>
  <ol>
    <li id="ref-1">Bhatia, R. (1997). <em>Matrix Analysis</em>. Graduate Texts in Mathematics, vol. 169. Springer.</li>
    <li id="ref-2">von Neumann, J. (1937). Some matrix-inequalities and metrization of matric space. <em>Tomsk Univ. Rev.</em> 1, 286–300.</li>
  </ol>
</section>

<hr class="rule" style="margin: 2.6em 0;">
<p style="color:var(--text-muted); font-size:.92rem;"><em>This note doubles as a formatting reference for citations and footnotes — see <a href="https://github.com/pritamchandra/pritamchandra.github.io/blob/main/EDITING-GUIDE.md">EDITING-GUIDE.md</a> for the exact Markdown that produces the numbered references and footnotes above.</em></p>

[^1]: This is what makes the inequality a genuinely useful tool rather than just a curiosity — sorting singular values is easy, and reduces a bound on a matrix product to a bound on two real sequences.
[^2]: Tightness matters here mainly as reassurance: it means there's no "better" von Neumann-style inequality quietly waiting to be discovered — any further improvement has to come from using more structure than just the singular values.
