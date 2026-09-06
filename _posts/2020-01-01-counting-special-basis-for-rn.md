---
title: 'On Counting Special Basis for $\mathbb{R}^n$'
description: "Counting the basis sets of R^n whose vectors have only 0/1 coordinates."
date: 2020-01-01
tags: [Math]
preview: 'Counting the number of basis sets of $\mathbb{R}^3$ whose involved vectors have only 0 or 1 coordinates.'
---
We are interested in counting the number of basis sets (un-ordered) of $\mathbb{R}^n$ for which the coordinates of the involved vectors are either $0$s or $1$s. In this entry we will count (and prove) the same for $\mathbb{R}^3$ in two ways, and speculate a probable path to extend the count for the general case. The intent of this entry is to motivate a solution for the general case.

## Introduction

One can quickly see that the number of &ldquo;ordered&rdquo; basis sets of $\mathbb{R}^n$ with vectors involving only $0$s and $1$s is equivalent to counting the number of non-singular $n \times n$ matrices whose entries are only $0$s and $1$s. For convenience let us name these counts.

- $M(n)$: number of non-singular $n \times n$ matrices with entries in the set $\{0,1\}$.
- $m(n)$: number of basis-sets (un-ordered) of $\mathbb{R}^n$ whose involved vectors contain only $0$s and $1$s.

Since every un-ordered basis set gives rise to exactly $n!$ of these non-singular matrices with the columns permuted, one can quickly form the relation

<div>
\[ M(n) = m(n) \cdot n! \]
</div>

## Computer Data

The following has been calculated using a computer. What seems interesting is that the sequence $\{m(n)\}$ doesn't seem to follow any obvious patterns, and their occurrence appears strange and beautiful at the same time.

| $n$ | $M(n)$ | $m(n)$ | Factors of $m(n)$ |
|---|---|---|---|
| 1 | 1 | 1 | 1 |
| 2 | 6 | 3 | 3 |
| 3 | 174 | 29 | 29 |
| 4 | 22560 | 940 | $2 \cdot 2 \cdot 5 \cdot 47$ |
| 5 | 12514320 | 104286 | $2 \cdot 3 \cdot 7 \cdot 13 \cdot 191$ |

## Counting $m(3)$, looong explanation

The relevant bases for $\mathbb{R}$ is $\{1\}$, and for $\mathbb{R}^2$ is,

<div>
\[
\left\{ \begin{bmatrix}1\\0\end{bmatrix}, \begin{bmatrix}0\\1\end{bmatrix} \right\}, \quad
\left\{ \begin{bmatrix}1\\1\end{bmatrix}, \begin{bmatrix}0\\1\end{bmatrix} \right\}, \quad
\left\{ \begin{bmatrix}1\\0\end{bmatrix}, \begin{bmatrix}1\\1\end{bmatrix} \right\}
\]
</div>

and therefore the calculation of $m(1)$ and $m(2)$ are trivial. Let us come to $\mathbb{R}^3$ now. The vectors of $\mathbb{R}^3$ whose coordinates are either $0$s or $1$s sit at the vertices of a unit cube. Hence it is only fair to identify these vectors with vertices of the unit cube.

<figure class="gallery-full">
  <img src="/assets/img/basis-counting-cube.png" alt="A unit cube with vertices labelled A through H, identifying A with the zero vector and B, D, E with the standard basis vectors.">
</figure>

Recall finding a basis for $\mathbb{R}^3$ only requires finding 3 vectors which are linearly independent. Therefore,

**(i)** *Counting $M(3)$ boils down to the number of ways of choosing (in order) 3 linearly independent vertices from this cube.*

We will now identify the vertices $A, B, D, E$ with $0, \hat i, \hat j, \hat k$ respectively. There are 7 non-zero vertices, and therefore 7 choices for the first vector. The remaining 6 vertices are valid candidates for the second vector, as they are not a scalar multiple of the first. Hence there are $7 \cdot 6 = 42$ ordered choices for the first two vectors. Hence the third vertex we choose must lie outside the span of the first two.

**(ii)** *There are either 4 or 5 choices for the third vector of the basis.*

Any choice of two non-zero vertices with the origin $A$ forms a triangular cross-section of the cube. This triangle $T$ can be extended on all sides to span a plane $P$ (subspace) passing through the origin. The intersection $I$ of $P$ and the cube involves at least 3 vertices, namely the three vertices of the triangle $T$. Also from the orientation of a cube it is clear that no plane can contain 5 vertices of a cube. And hence $I$ contains at most 4 vertices. Or, $I$ contains 3 or 4 vertices of the cube, thereby leaving us with a choice of 5 or 4 vertices for the third vector of the basis.

The following is an illustration with $T = AEC$ and $P = AEGC$.

<figure class="gallery-full">
  <img src="/assets/img/basis-counting-triangle-cut.png" alt="The same cube with triangle AEC shaded, extended to the plane AEGC, showing the intersection with the cube.">
</figure>

**(iii)** *$I$ containing 4 vertices corresponds to the triangle $T$ containing a side of the cube.*

Since the vertices in $I$ and $T$ are vertices of the cube, their sides are either sides or diagonals of the cube. Hence the internal angles of $I$ and $T$ are at most $\pi/2$. But $I$ being a quadrilateral must have its internal angles sum to $2\pi$. Hence clearly, all internal angles of $I$ are $\pi/2$, or $I$ is a rectangle.

But $T$ shares three of its vertices with $I$, and hence shares at least two of its adjacent sides. And therefore $T$ has a right angle. Since the right angles in a cube are formed only between its sides, $T$ has a side of the cube.

**(iv)** *There are exactly 6 choices for which 3 vertices lie in the intersection $I$.*

From (ii) we have that in such cases $T$ must contain no side of the cube, and therefore its sides must be the diagonals. But $T$ contains the origin $A$, and hence two of these diagonals must begin at $A$, meaning these two diagonals are exactly the first two chosen vertices. But there are 4 vertices which are diagonally opposite to $A$: three, $C, H, F$, along the faces, and one $G$ through the cube.

<figure class="gallery-full">
  <img src="/assets/img/basis-counting-diagonals.png" alt="The cube with the four space and face diagonals from the origin drawn to C, H, F, and G.">
</figure>

Choosing two of these automatically determines the third side of $T$. But observe that $G$ is connected to the three other vertices via a side of the cube, and hence $AG$ cannot be a side of $T$ from (ii). Moreover, no two other vertices are connected via a side of the cube. Hence $T$ can be determined by choosing any 2 out of the remaining 3 vertices. Since we are also taking the order into account, the required number of choices of $T$ is ${}^3P_2 = 6$.

*Trivia*, these three planes (in these 6 choices) that cut obliquely through the cube to intersect at only 3 vertices form the surfaces of a tetrahedron at the origin.

<figure class="gallery-full">
  <img src="/assets/img/basis-counting-tetrahedra.png" alt="Three views of the cube, each with a tetrahedron formed by cutting obliquely through three of its vertices.">
</figure>

Finally, from (i) we know that each of the 42 choices of the first two vectors corresponds to leaving 4 or 5 options for the third. But, from (iii) we have exactly 6 of them leaving 5. And hence we have,

<div>
\[
M(3) = 6 \cdot 5 + (42 - 6) \cdot 4 = 174
\]
</div>
<div>
\[
m(3) = \frac{174}{3!} = 29
\]
</div>
