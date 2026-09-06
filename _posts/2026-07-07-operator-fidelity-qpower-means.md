---
title: "On the Incomparability of Operator Fidelity and <span class=\"mono\">Q</span>-Power Means in the Near Order"
description: "A short note on matrix means in the near order."
date: 2026-07-07
tags: [Math, Matrix Analysis]
preview: "A short note showing that operator fidelity and the power means of two positive matrices are incomparable in the near order, for any choice of exponent."
---
Let $\mathbb{P}$ and $\mathbb{P}_0$ be the cones of $n\times n$ positive definite and positive semidefinite matrices over $\mathbb{C}$, respectively. We define

<div>
\[ F(A,B) = \left(A^{1/2} B A^{1/2}\right)^{1/2} \]
</div>

and call this the **operator fidelity** of $A$ and $B$. For $p\in\mathbb{R}$, define

<div>
\[ Q_p(A,B) = \left(\frac{A^p+B^p}{2}\right)^{1/p} \]
</div>

with the identification that $Q_0(A,B)$ is the log-Euclidean mean of $A$ and $B$.

<div class="thm">
  <span class="thm-label">Lemma 1 &mdash; Properties of the geometric mean</span>
  <div class="thm-body">
    <p>Let $A, B \in \mathbb{P}_0$. Then</p>
    <ol style="margin:0; padding-left:1.3em;">
      <li>$A \# (\alpha B) = \alpha^{1/2}(A \# B)$ for every $\alpha > 0$.</li>
      <li>$\det(A \# B) = (\det A \, \det B)^{1/2}$.</li>
    </ol>
  </div>
</div>

<div class="thm">
  <span class="thm-label">Lemma 2</span>
  <div class="thm-body">
    <p>Let $X$ be a $2\times 2$ positive definite matrix. Then $X \succeq I$ implies that $\operatorname{tr} X \le 1 + \det X$.</p>
  </div>
</div>
<div class="proof">
  <p><span class="proof-label">Proof.</span> Let $\lambda_1, \lambda_2 \ge 0$ be the eigenvalues of $X$. The condition $X \succeq I$ is equivalent to saying $\lambda_1, \lambda_2 \ge 1$. This implies that $(\lambda_1 - 1)(\lambda_2 - 1) \ge 0$. This inequality expands to the required condition.</p>
</div>

<div class="thm">
  <span class="thm-label">Lemma 3</span>
  <div class="thm-body">
    <p>Let $X \in \mathbb{P}_0$ be a matrix of rank 1. Then $X^{1/2} = (\operatorname{tr} X)^{-1/2} X$.</p>
  </div>
</div>

<div class="thm">
  <span class="thm-label">Lemma 4</span>
  <div class="thm-body">
    <p>Let $A \in \mathbb{P}$ and $B \in \mathbb{P}_0$ such that $B$ is of rank 1. Then</p>
    \[ A \# B = \left(\operatorname{tr} A^{-1}B\right)^{-1/2} B. \]
  </div>
</div>
<div class="proof">
  <p><span class="proof-label">Proof.</span> Use Lemma 3 to get</p>
  \[
  A\#B = A^{1/2}\!\left(A^{-1/2}BA^{-1/2}\right)^{1/2}\!A^{1/2}
  = \left(\operatorname{tr} A^{-1}B\right)^{-1/2}\!A^{1/2}\!\left(A^{-1/2}BA^{-1/2}\right)\!A^{1/2}
  = \left(\operatorname{tr} A^{-1}B\right)^{-1/2}\!B.
  \]
</div>

<div class="thm">
  <span class="thm-label">Proposition 1</span>
  <div class="thm-body">
    <p>There exist $A, B \in \mathbb{P}$ such that $F(A,B) \npreceq Q_p(A,B)$ for all $p > 0$.</p>
  </div>
</div>
<div class="proof">
  <p><span class="proof-label">Proof.</span> Suppose $F(A,B) \preceq Q_p(A,B)$ for all $A, B$ and some $p \ge 0$; we use this assumption to produce a contradiction. When $A$ and $B$ are clear from context, write $F = F(A,B)$ and $Q = Q_p(A,B)$.</p>

  <p>Notice that, just as choosing $A$ and $B$ fixes $F$, choosing $A$ and $F$ fixes $B$. That is, let $A, F \in \mathbb{P}$ and let $H = F^2$. With $B = A^{-1/2}HA^{-1/2}$, we have $F(A,B) = F$. Further, let $T = HA^{-1}$. Then $B$ is similar to $T$, as $B = A^{-1/2}TA^{1/2}$.</p>

  <p>For $\gamma \in (0,1)$ let</p>
  \[ A = \begin{pmatrix} \gamma^2 & 0 \\ 0 & 1 \end{pmatrix}. \]

  <p>Due to Lemma 2 and Lemma 1, the inequality</p>
  \[ \gamma\,\operatorname{tr}\!\left[F^{-1}\# Q\right] \;\le\; \gamma + \gamma\left[\frac{\det Q}{\det F}\right]^{1/2} \tag{1} \]
  <p>must be true for all $\gamma$. Thus the inequality must also hold in the limit $\gamma \to 0$. Note that $F$ is independent of $\gamma$, but $Q$ is not, so $\gamma$ can be collected with $Q$. To do this define</p>
  \[ L = \lim_{\gamma \to 0} \gamma^2 Q, \qquad \ell = \lim_{\gamma \to 0} \gamma^2 \det Q. \]
  <p>Using again the properties of the geometric mean and determinants, inequality (1) in the limit $\gamma \to 0$, after squaring, becomes</p>
  \[ \operatorname{tr}^2\!\left(F^{-1}\# L\right) \;\le\; \frac{\ell}{\det F}. \tag{2} \]

  <p>Our effort now will be in computing $L$ and $\ell$. Note that</p>
  \[ L = \lim_{\gamma \to 0} \gamma^2 Q_p(A,B) = \lim_{\gamma \to 0} Q_p(\gamma^2 A, \gamma^2 B) = Q_p\!\left(\lim_{\gamma \to 0}\gamma^2 A,\ \lim_{\gamma \to 0}\gamma^2 B\right). \]
  <p>The limit of the first argument is $0$. And</p>
  \[ \lim_{\gamma \to 0}\gamma^2 B = \lim_{\gamma \to 0}\left(\gamma A^{-1/2}\right) H \left(\gamma A^{-1/2}\right) = \begin{pmatrix} h_{11} & 0 \\ 0 & 0 \end{pmatrix}, \]
  <p>which is a rank 1 matrix. This immediately gives</p>
  \[ L = 2^{-1/p}\begin{pmatrix} h_{11} & 0 \\ 0 & 0 \end{pmatrix}. \]
  <p>Therefore we apply Lemma 4 to evaluate the left-hand side of equation (2) as</p>
  \[ \operatorname{tr}^2\!\left(F^{-1}\# L\right) = \left(\operatorname{tr} FL\right)^{-1}\left(\operatorname{tr} L\right)^2 = \left(2^{-1/p}f_{11}h_{11}\right)^{-1}h_{11}^2\,2^{-2/p} = 2^{-1/p}\,\frac{h_{11}}{f_{11}}. \]

  <p>Now let us focus on $\ell$. Note that</p>
  \[
  \gamma^2\det Q_p(A,B) = \gamma^2\det Q_p(A,T) = \gamma^{-2}\det Q_p(\gamma^2A,\gamma^2T)
  = 2^{-2/p}\gamma^{-2}\Big(\det\!\left[(\gamma^2A)^p+(\gamma^2T)^p\right]\Big)^{1/p}.
  \]
  <p>In the first equality we have used that $B$ is similar to $T$ via the transformation $A^{1/2}$, which keeps $A$ unchanged. Let $K = (\gamma^2T)^p$. Then we compute</p>
  \[
  \det\!\left[(\gamma^2A)^p+K\right] = k_{11}\gamma^{2p}+k_{22}\gamma^{4p}+\gamma^{6p}+\det K
  = \gamma^{2p}\Big[k_{11}+k_{22}\gamma^{2p}+\gamma^{4p}+(\det H)^p\Big],
  \]
  <p>using $\det K = \gamma^{4p}(\det H)^p$. So this gives</p>
  \[ \ell = 2^{-2/p}\lim_{\gamma \to 0}\Big[k_{11}+k_{22}\gamma^{2p}+\gamma^{4p}+(\det H)^p\Big]^{1/p}. \]
  <p>Note here that $k_{11}$ and $k_{22}$ are functions of $\gamma$, but $H$ is not. We compute their limit using</p>
  \[
  \lim_{\gamma\to0}K = \left(\lim_{\gamma\to0}\gamma^2T\right)^{\!p} = \begin{pmatrix} h_{11}^p & 0 \\ \ast & 0 \end{pmatrix},
  \]
  <p>leveraging the lower-triangular form of $\lim_{\gamma \to 0}\gamma^2T$ to easily calculate the $p$-th power. Finally we get</p>
  \[ \ell = 2^{-2/p}\left[h_{11}^p + (\det H)^p\right]^{1/p}. \]

  <p>Thus inequality (2) reduces to</p>
  \[ 2^{-1/p}\,\frac{h_{11}}{f_{11}} \;\le\; 2^{-2/p}\,\frac{\left[h_{11}^p+(\det H)^p\right]^{1/p}}{\det F}, \]
  <p>which can be further rearranged as</p>
  \[ 2\left(h_{11}\det F\right)^p \;\le\; f_{11}^p\left[h_{11}^p+(\det H)^p\right]. \tag{3} \]

  <p>Our assumption is that this holds for every $F$ and $H = F^2$. But choose</p>
  \[ H = \begin{pmatrix} 1 & 1 \\ 1 & 2 \end{pmatrix} \qquad\text{and}\qquad F = \begin{pmatrix} \tfrac{2}{\sqrt5} & \ast \\ \ast & \ast \end{pmatrix}. \]
  <p>Then inequality (3) says</p>
  \[ 1 \;\le\; \left(\frac{2}{\sqrt5}\right)^{p}, \]
  <p>which is false for every $p > 0$. This is a contradiction.</p>
</div>

<hr class="rule" style="margin: 2.6em 0;">
