---
title: "How to structure a monorepo"
description: "A discussion on how to approach organising a monorepo"
tags:
  - programming
  - monorepo
keywords:
  - programming
  - monorepo
date: 2022-09-24T09:09:51+02:00
draft: true
---

While writing [the appeal of monorepo]({{< ref "/writing/the-appeal-of-monorepo" >}} "the appeal of monorepo"), I also wanted to discuss how to structure a monorepo.

I left that out of it because of a few reasons:

- The article was already long.
- Structuring a monorepo is its own self-contained challenge and deserves its
  own article.
- Writing about this topic is a challenge in itself because this discussion is,
  in my view, mostly a naming discussion.

So here I am with a whole article about structuring monorepos.

When I sat down to write this article, my intention was to provide some sort of
"starting template" for a monorepo. The deeper I got into the topic, the more
obvious it felt to me that was a meaningless goal.

I need too much contextual information in order to come up with a good, useful
structure for a monorepo so instead of providing a template that may not make
sense to you, I will explain how I think about this problem. Hoping it will be a
good starting point for monorepo adoption.

Over the years, I started to appreciate monorepos also as an engineering
leadership communication tool. In a monorepo:

- Everyone sees all the commits.
- Everyone can find any project on their own. After all, they're all somewhere
  in the monorepo, right?

Both points are interesting but, in the context of this conversation, the second
one is relevant.

The discoverability of your monorepo is only as good as your naming.

And while I don't think discoverability is not the most important technical
benefit of adopting a monorepo, focusing on it can be an intriguing leadership
tool.

The idea is simple: you can draw some parallels between the structure of your
monorepo and the structure of your organisation and use these analogies to
achieve both a better structure for your monorepo and a simpler organisational
one.

Organisations are living organisms that change all the time. A monorepo can
follow a similar lifecycle.

To illustrate this relationship between the monorepo and the organisation, let
me provide an example.

Say your startup just launched. It's the tiniest team: you're the only
developer. Your product is a web application. Your product is a subscription
service for some physical good. Customers come on your website, subscribe to
your service, and you start sending them things once per month.

Your monorepo right now looks like this:

```sh
├── api
├── docs
├── infra
└── web
```

It's just three projects and the docs. You've got your web application, your
infrastructure-as-code project, and an API project.

You already see some benefits of the monorepo. No need to jump over multiple
repositories, you can already do atomic changes, soon you'll need to share some
assets and you'll just add one more directory.

The structure of the monorepo right now is as flat as it gets, after all you're
working alone on this.

Fast-forward a few months. Your team grew a little. You're now a small team. You
project is successful, you now have an iOS app (android coming soon!) and your
monorepo looks like this:

```sh
├── android
├── assets
│   ├── i18n
│   └── images
├── docs
├── infra
├── ios
├── platform
│   ├── api
│   └── workers
└── web
```

It looks different now. There's a young platform team that is responsible both
for your api endpoints and for your subscriptions jobs. You're not super happy
with the naming of the teams (therefore the folders in your monorepo) but you
know things will change soon (they always do) and you'll get a chance to improve
the naming a little.

The structure is still somewhat flat but you're starting to see it: there's some
overlap between the way you organise your teams and how the monorepo looks like.

Fast-forward again.

Two years have passed. You're now very successful! Your monorepo looks very
different:

```sh
├── assets
│   ├── i18n
│   └── images
├── docs
├── infra
├── lib
│   ├── kt
│   │   └── i18n
│   └── ts
│       └── i18n
├── platform
│   ├── marketing
│   │   └── api
│   ├── shipping
│   │   ├── api
│   │   └── workers
│   └── subscription
│       ├── api
│       └── workers
├── proto
└── ui
    ├── back-office
    │   └── web
    ├── main
    │   ├── android
    │   ├── ios
    │   └── web
    └── warehouse
        ├── dashboard
        └── tablet
```

There's still an overlap between the way you organised your teams and the way
your monorepo looks like. But it is much more structured because the monorepo
needed to scale and so did your teams.

One thing that stands out is that the structure of the monorepo is now a mix of
platform, programming language, and domain terms.

It's a difficult balance to achieve but, again, you know difficult problems
often become good opportunities.

In this structure, it's clear what kind of UIs your organisation is working on.
The mix of tech and domain terms actually helps!

The monorepo also reflects the way some of your teams are split: subscription,
marketing, shipping. Different classes of problems with their own solutions.
Since "backend problems" are more specialised than UI ones, it feels natural the
overlap between code and team structure is more evident.

Last but not least, there is a `lib` directory now. Your company is big enough
you have your own internal libraries. They are clustered by programming
languages to increase discoverability. To be honest, there was no better place
too.

This example I provided isn't meant to be exhaustive. Of course this is not the
only way you can organise a monorepo but it helps me illustrate some abstract
arguments in a more concrete way.

My main argument is that you should organise a monorepo so that it loosely
reflects the way teams are split. You don't want a one to one relation but you
also don't want total disconnection.

In the example I provided, you can't really say how the "frontend" teams are
organised. I did that intentionally so I could make this point: the structure I
suggest works if you use different languages for each of your platform as well
as if you're using something like React Native. In the react native scenario,
you'd probably have the common code in `lib/ts`.

But the subtitle of this argument is also interesting: don't make technical
choices too present in your structure. It's just the other side of the coin.

For example, I like the `lib/lang` approach a lot but I wouldn't advise to do
that for the top-level folders. Meaning that grouping projects by the language
they're written in is a bad idea. It would be a structured monorepo but its
structure would have no actual meaning.

This is the key insight in my opinion: structuring a monorepo _is_ both a
technical _and_ an organisational challenge. To me, it's where the conversation
between engineering leadership and engineering management should happen.

You want a structure that works technically _and_ that has organisational
meaning.
