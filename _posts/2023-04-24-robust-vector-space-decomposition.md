---
title: "Exposition on Robust Vector Space Decomposition (RVSD)"
description: "A walkthrough of the RVSD algorithm and its applications to learning arithmetic formulas and unsupervised learning."
date: 2023-04-24
tags: [Math, CS, Video, Exposition, ML]
preview: "A brief explainer of Robust Vector Space Decomposition (RVSD), a meta-algorithm for unsupervised learning tasks like subspace clustering and mixtures of Gaussians, along with a short video lecture."
---
The following is a brief explainer to the algorithm *Robust Vector Space Decomposition (RVSD)* introduced in our ITCS 2024 [paper](https://arxiv.org/abs/2311.07284). RVSD in its generality is a powerful meta-algorithm that is able to tackle various important unsupervised learning tasks, such as subspace clustering, mixtures of Gaussians, and tensor decompositions. The specifics of these reductions are discussed in detail in the paper. For subspace clustering we provide a complete smoothed analysis of this algorithm.

<figure class="gallery-video">
  <div class="video-frame">
    <iframe src="https://www.youtube-nocookie.com/embed/sY7Oim8DGB0" title="Robust Vector Space Decomposition (RVSD)" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>
  </div>
</figure>

Below is a full walkthrough of the talk, following its slides section by section.

## 1. Robust Vector Space Decomposition (RVSD)

**Setting.** Let $U$ and $V$ be subspaces of some ambient space. Let $\mathcal{B}$ be a (finite) collection of operators in $\mathrm{Lin}(U,V)$ such that it respects a certain direct sum decomposition of $U$ and $V$. That is

<div>
\[
U = U_1 \oplus \cdots \oplus U_s, \qquad V = V_1 \oplus \cdots \oplus V_s, \qquad BU_j \subseteq V_j \ \ \forall j, \ \forall B \in \mathcal{B}.
\]
</div>

**Problem.** Given $U, V, \mathcal{B}$, find the $U_j$'s (and $V_j$'s) up to re-ordering.

**Robust version.** Given $\tilde U, \tilde V, \tilde{\mathcal{B}}$ close to $U, V, \mathcal{B}$, find the $\tilde U_j$'s close to $U_j$'s up to re-ordering.

### Intuition

Let $\mathcal{B} = (B_1, \ldots, B_m)$. Consider the matrix $M$ whose columns are a basis of $U$ that respects the above decomposition &mdash; that is, the first few columns are a basis for $U_1$, the next few columns for $U_2$, and so on. Similarly, consider $N$ for $V$.

**Observation.** Each matrix $B_i$ is block diagonal in these bases. That is,

<div>
\[
B_i = N \begin{pmatrix} B_{i1} & & \\ & \ddots & \\ & & B_{is} \end{pmatrix} M^{-1}.
\]
</div>

Consider $P_j$, the projection onto $U_j$ along $U_1 \oplus \cdots \oplus U_{j-1} \oplus U_{j+1} \oplus \cdots \oplus U_s$. Similarly, consider $\Pi_j$ for the projection onto $V_j$. Then we have

<div>
\[
P_j = M \begin{pmatrix} 0 & & \\ & I & \\ & & 0 \end{pmatrix} M^{-1}, \qquad \Pi_j = N \begin{pmatrix} 0 & & \\ & I & \\ & & 0 \end{pmatrix} N^{-1}
\]
</div>

(here the $I$ is in the $j$-th diagonal block, and is of appropriate dimension in each case). Then

<div>
\[
B_i P_j = \Pi_j B_i = N \begin{pmatrix} 0 & & \\ & B_{ij} & \\ & & 0 \end{pmatrix} M^{-1}, \qquad \forall i,j.
\]
</div>

Note that $U_j$ is the column space of $P_j$, so finding $P_j$ is sufficient. As $B_i P_j - \Pi_j B_i = 0$, finding $P_j$ connects to finding matrices $D$ and $E$ such that $B_i D - EB_i = 0$ for all $i$. This leads to the notion of the **adjoint algebra**.

<div class="thm">
  <span class="thm-label">Adjoint Algebra of B</span>
  <div class="thm-body">
    <p>
    \[
    \mathrm{Adj}(\mathcal{B}) = \{ (D,E) \in \mathrm{Lin}(U,U) \times \mathrm{Lin}(V,V) \mid B_iD - EB_i = 0,\ \forall i \}
    \]
    </p>
  </div>
</div>

**Facts.**

- $\mathrm{Adj}$ is an algebra.
- We saw earlier that $(P_j, \Pi_j) \in \mathrm{Adj}$ for all $j$.
- We say that the adjoint algebra is **non-degenerate** if $\dim \mathrm{Adj} = s$. That is, $\mathrm{Adj} = \mathrm{span}\{(P_1,\Pi_1), \ldots, (P_s,\Pi_s)\}$.

### How to solve the problem (without noise)?

**Adjoint Algebra Operator.** $A_{\mathcal{B}} : \mathrm{Lin}(U,U) \times \mathrm{Lin}(V,V) \to \mathrm{Lin}(U,V)^m$ defined as

<div>
\[
A_{\mathcal{B}}(D,E) = (B_1D - EB_1, \ldots, B_mD - EB_m).
\]
</div>

$\mathrm{Adj}(\mathcal{B})$ is the null-space of $A_{\mathcal{B}}$.

Let $(P,\Pi)$ be a random element of a non-degenerate $\mathrm{Adj}$. Then we know that $P = \lambda_1 P_1 + \cdots + \lambda_s P_s$.

**How to find the $P_j$'s from $P$?**

- Look at the map $\hat P : \mathrm{Adj} \to \mathrm{Adj}$ such that $\hat P(X) = PX$.
- As $\dim \mathrm{Adj} = s$, the map $\hat P$ has at most $s$ eigenvectors.
- As $P_j$'s are disjoint projections, we have $\hat P(P_j) = \lambda_j P_j$.
- Therefore, $P_j$'s are exactly the eigenvectors of $\hat P$.

<div class="thm">
  <span class="thm-label">Problem (noiseless)</span>
  <div class="thm-body">
    <p>
    Given $U, V$ and $\mathcal{B} = \{B_1, \ldots, B_m\}$ such that
    \[
    U = U_1 \oplus \cdots \oplus U_s, \qquad V = V_1 \oplus \cdots \oplus V_s, \qquad B_iU_j \subseteq V_j \ \ \forall i,j,
    \]
    find the $U_i$'s.
    </p>
  </div>
</div>

**Algorithm.**

1. Construct the map $A_{\mathcal{B}}$.
2. Pick a random element $(P,\Pi)$ from its null space $\mathrm{Adj}(\mathcal{B})$.
3. Construct the map $\hat P$.
4. Output the column spaces of the eigenvectors of $\hat P$.

### Solving the robust version

<div class="thm">
  <span class="thm-label">Theorem &mdash; Eigenvector Perturbation</span>
  <div class="thm-body">
    <p>
    Let $A = X\Lambda X^{-1}$ be the eigendecomposition of $A$. Suppose $A$ has distinct eigenvalues with a minimum eigenvalue gap of $\delta > 0$. Let $\tilde A = A + E$. Further, let $\kappa(X)\lVert E \rVert \ge \frac{\delta}{2}$. Then for each eigenpair $(\lambda, x)$ of $A$ there is an eigenpair $(\tilde\lambda, \tilde x)$ such that
    \[
    \lvert \lambda - \tilde\lambda \rvert < \kappa(X)\lVert E \rVert, \qquad \lVert x - \tilde x \rVert \le \frac{4\kappa(X)\lVert E \rVert}{\delta}.
    \]
    </p>
  </div>
</div>

<div class="thm">
  <span class="thm-label">Lemma &mdash; Null Space Perturbation</span>
  <div class="thm-body">
    <p>
    Suppose $A$ has rank $r$, and let $\tilde A = A + E$. Let $S, \tilde S$ be the subspaces spanned by the top $r$ right singular vectors of $A$ and $\tilde A$ respectively. Then we have
    \[
    \mathrm{dist}(S, \tilde S) \le \frac{2\lVert E \rVert}{\sigma_r(A)}.
    \]
    </p>
  </div>
</div>

**Algorithm.**

1. Construct the map $A_{\tilde{\mathcal{B}}}$.
2. Pick a random element $(\tilde P, \tilde \Pi)$ from the space $\widehat{\mathrm{Adj}(\mathcal{B})}$ spanned by the $s$ smallest singular vectors of $A_{\tilde{\mathcal{B}}}$.
3. Construct the map $\hat{\tilde P}$. Here $\hat{\tilde P}(X) = \mathrm{Proj}_{\widehat{\mathrm{Adj}(\mathcal{B})}}(\tilde P X)$.
4. Output the span of the top singular vectors of $\hat{\tilde P}$.

This is analyzed in four steps, each error bound feeding the next:

1. $\lVert A_{\mathcal{B}} - A_{\tilde{\mathcal{B}}} \rVert$ depends on $\lVert \mathcal{B} - \tilde{\mathcal{B}} \rVert$.
2. $\lVert P - \tilde P \rVert_F \le \mathrm{dist}\left(\mathrm{Adj}(\mathcal{B}), \widehat{\mathrm{Adj}(\mathcal{B})}\right) \le O\left(\lVert A_{\mathcal{B}} - A_{\tilde{\mathcal{B}}} \rVert, \dfrac{1}{\sigma_{-(s+1)}(A_{\mathcal{B}})}\right)$.
3. $\lVert P_j - \tilde P_j \rVert_F \le O\left(\lVert P - \tilde P \rVert_F, \kappa(M), \mathrm{eigengap}(P)\right)$.
4. $\mathrm{dist}(U_j, \tilde U_j) \le O\left(\lVert P_j - \tilde P_j \rVert_F, \dfrac{1}{\sigma_{d_j}(P_j)}\right)$.

Finally, we get

<div>
\[
\mathrm{dist}(U_j, \tilde U_j) \le \mathrm{poly}\!\left(\lVert \mathcal{B} - \tilde{\mathcal{B}} \rVert,\ \kappa(M),\ \mathrm{eigengap}(P),\ \frac{1}{\sigma_{d_j}(P_j)},\ \frac{1}{\sigma_{-(s+1)}(A_{\mathcal{B}})}\right).
\]
</div>

 