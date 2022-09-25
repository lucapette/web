---
title: "How to structure a monorepo"
description: "A brief discussion on how to approach organising a monorepo"
tags:
  - programming
  - monorepo
keywords:
  - programming
  - monorepo
date: 2022-09-24T09:09:51+02:00
draft: true
---

While writing [the appeal of monorepo]({{< ref "/writing/the-appeal-of-monorepo" >}} "the appeal of monorepo"), I also wanted discuss how to structure a monorepo.

I left that out of it because of two reasons:

- The article was already long.
- Structuring a monorepo is its own self-contained challenge and deserves its
  own article. So here we go.

Structuring a monorepo is a tricky problem.

The challenge is not intrinsically connected with the monorepo approach. It has
more to do with naming things (notoriously hard) and organisational design.

Let's start with naming things.

Among other things, I consider the monorepo part of my leadership strategy. It's
a communication tool:

- By default, everyone sees all the commits.
- Everyone can find any project on their own. After all, they're all somewhere
  in the monorepo, right?

In the context of this conversation, the second point is relevant. Yes, the
monorepo will automatically increase the discoverability of your projects. You
may not know where a project is or even what's its name but you do know it's in
the monorepo.

The discoverability of your monorepo is only as good as your naming.

Now the challenge of writing this article is that discussing naming in the
abstract is really hard.

Subscription business example?
