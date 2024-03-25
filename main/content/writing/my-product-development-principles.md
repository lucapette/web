---
title: "My product development principles"
description: "Core, practical ideas about product development I have a strong opinion about. d"
date: 2024-01-24T10:12:13+02:00
tags:
  - programming
  - "engineering management"
keywords:
  - "engineering management"
  - principles
  - values
  - programming
draft: true
---

The outline for this article has sat in my private notes for quite a while. My
intention was to call it "if I had to start a team today", inspired by some
twitter thread I can't find anymore about a few things someone had a very strong
opinion if they were to start a new team.

I quite like the angle as it offers me the opportunity to reiterate on my
programming principles and my engineering management values from a more
practical, probably more useful standpoint.

Th challenge to precisely define the context of these ideas may be the number
one reason why it took me so long to get to write it. It's not entirely clear to
me why some of my guiding principles made the list and others didn't. I suspect
it's mostly regret: every time I started a team (which I've done a lot) and did
compromise of any of these ideas, I deeply regretted it.

This means two things:

- If I had to start a product development team today, I would not compromise on
  any of them were it my choice.
- If I had to join an existing one, I'd work hard to get closer to operate via
  the principles presented in this article.

Both scenarios are interesting to me so I called the article "my product
development principles" to signify to broader context of the discussion.
Furthermore, the ideas I'm discussing here do make the most sense in the context
of a typical engineering organization that builds products. These ideas, in my
view, live on the intersection of programming as a craft and engineering
leadership.



- [monorepo](#monorepo)
- [trunk based development](#trunk-based-development)
- [feature flags](#feature-flags)
- [Types, types, types](#types-types-types)
  - [Grpc](#grpc)
- [No history chats](#no-history-chats)
- [Written communication](#written-communication)
- [Naming things](#naming-things)

## monorepo

I discuss these principles in no particular order but starting from monorepo
feels right because the principle behind is very representative of the whole
article. First off, I compromised on this (as the first CTO at Marley Spoon) and
never regretted a technical/leadership decision more. On the bright side, it's
with that experience that I refined my views on monorepo. Back then (spring of
2014), the tooling was much worse than it now and that's how I justified the
compromise to myself. Now I know that tooling, while very relevant to developer
experience, is a secondary argument for monorepo adoption.

The core argument is simplicity. _Especially_ when starting a new project. One
repo, one CI pipeline, all code flows through the same place, sharing a library
has no friction.

I know there are counterarguments to these points I'm making here. I intend to
write about that soon (™). I will link the article back here when it's out. It
goes without saying I don't think there are reasonable arguments for a polyrepo
organization.

As I was saying, the core argument is simplicity. Now, since it's the first time
I mention it, it's worth underlining a couple of points:

- Simplicity will come up a lot in this article. After running I don't know how
  many teams, I can sum up my job as "the guy that tells people to do _less_
  work to solve their problems". In the context of monorepo, especially when
  starting, it's literally just less work to have the code in one place. Yes,
  the argument is that obvious. And yes there's lots of people that will
  disagree with this. I don't care.
- Most of the principles I discuss here are strongly interconnected. You can
  probably follow one without following the others but they work so well
  together, they may as well be one principle. But we'd have to call it Luca
  Driven Product Development. And while I do like how my name sounds, I'm not
  that much into ego. Also, the acronym sounds like police (and you know, fuck
  the police).


## trunk based development

## feature flags

## Types, types, types

### Grpc

## No history chats

## Written communication

## Naming things
