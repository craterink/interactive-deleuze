# Interactive Deleuze

The goal of this project is to make Deleuzian concepts more intuitive using MNIST digits as a visual analogy. Each concept is oversimplified for now but the hope is to build a more accurate and holistic picture over time.

See it in action [here](https://interactive-deleuze.vercel.app/).

## Glossary of concepts

- the **Body without Organs** (BwO) is like random noise - disorganized nothingness
- **strata** are coherent organizations of a BwO, in our case recognizable digits
- a **face** (within the broader concept of faciality) is the substance of meaning transmission; here, the pixel canvas
- **de-/re-territorialization** can be thought of as an _unary_ operation `y reterritorializes` taking something from a noisy version of `y` towards a truer version
- **becoming** is a binary operation `x becoming-y`, which makes a thing `x` look/behave more like `y`. this operation doesn't necessarily detract from `x`'s "x-ness" but always increases its "y-ness". In our analogy, this could be like taking a step in a class-conditioned latent space. TBD how this will work :)

## Becoming: technical details

We implement `becoming` using a pre-trained discriminator $p(y|x)$. Training code can be found [here](https://colab.research.google.com/drive/19i_uEgbRDOD19EPyaJ9Jz1LXq8DnlkR9?authuser=1#scrollTo=fCWCETvS-upu)).

- First, for each pair of unique digits $\{a, b\}$, we found $x_r \in X_r$ real examples such that $y_r = a$ but $p(y=b|x_r)$ is high.
- When a user is exploring strata $a$, we implement `a becoming-b` by cycling through $x_r$ in order of increasing probability.
