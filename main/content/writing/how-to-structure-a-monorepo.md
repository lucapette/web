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

While writing [the appeal of monorepo]({{< ref "/writing/the-appeal-of-monorepo" >}} "the appeal of monorepo"), I also wanted discuss how to structure a monorepo.

I left that out of it because of a few reasons:

- The article was already long.
- Structuring a monorepo is its own self-contained challenge and deserves its
  own article.
- Writing about this topic is a challenge in itself because this discussion is,
  in my view, mostly a naming discussion. Naming is so hard and so it's writing
  about it.

So here I am with a whole article about structuring monorepos.

Over the years, I came to think of monorepos as an engineering leadership
communication tool. In a monorepo:

- Everyone sees all the commits.
- Everyone can find any project on their own. After all, they're all somewhere
  in the monorepo, right?

Both points are interesting for leadership but, in the context of this
conversation, the second one is relevant.

Yes, the monorepo will automatically increase the discoverability of your
projects. You may not know where a project is or even what's its name but you do
know it's in the monorepo.

That means the discoverability of your monorepo is only as good as your naming.

While I don't think discoverability is not the most important technical benefit
of adopting a monorepo, focusing on it can be an intriguing leadership tool.

The idea is simple: you can draw some parallels between the structure of your
monorepo and the structure of your organisation and use them to design both.

Organisations are living structures that change all the time. A monorepo could
follow a similar lifecycle.

But enough with abstract talk, let me provide an example.

Say your startup just launched. It's the tiniest team: one developer. Your
product is a web application. Your product is a subscription service for some
physical good. Customers come on your website, subscribe to your service, and
you start sending them things once per month.

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
projects, you can ship an infrastructure change with its code configuration in
one commit.

The structure is as flat as it gets, after all you're working alone on this.

Fast-forward a few months. Your team grew. You're now a small team. You project
is successful, you now have an iOS app (android coming soon!) and your monorepo
looks like this:

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

It looks different already. There's a young platform team now that is
responsible both for your api and for your subscriptions jobs. You're not super
happy with the naming of the teams (and the folders in your monorepo) but you
know things will change soon again and you'll get a chance to improve the naming
a little.

The structure now is still somewhat flat but you're starting to see some
patterns. There's an overlap between the way you organise your teams and how the
monorepo looks like.

It's [Conway's law](https://en.wikipedia.org/wiki/Conway%27s_law) at play and
you can see you can use it to your advantage and you do.

Two years have passed, you're now very successful. Your monorepo looks very
different now:

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
your monorepo looks like. But now it is much more structured because the
monorepo needed to scale and so did your teams.

One thing that stands out is that the structure of the monorepo now is a mix of
platforms, programming languages, and domain terms.

It's a difficult balance to achieve but, again, you know difficult problems
often become good opportunities.

In this structure, it's clear what kind of UIs your organisation is working on.
The mix of tech and domain terms actually helps.

The monorepo also reflects the way some of your teams are split: subscription,
marketing, shipping. Different classes of problems with their own solutions.

Last but not least, there is a `lib` directory now. Your company is big enough
you have your own internal libraries. They are clustered by programming
languages to increase discoverability.

Of course this is not the only way you can organise a monorepo but it helps me
illustrate some abstract arguments in a more concrete way.

I think it's clear that my main argument is to organise a monorepo so that it
loosely reflects the way teams are split. But the subtitle of this argument is
also interesting: don't make technical choices too present in your structure.

For example, I like the `lib/lang` approach a lot but I wouldn't advise to do
that for the top-level folders. Meaning that grouping projects by the language
they're written in is a bad idea. It would be a structured monorepo but its
structure would have no actual meaning.

This is the key insight in my opinion: structuring a monorepo _is_ both a
technical _and_ an organisational challenge. To me, it's where the conversation
between engineering leadership and engineering management should happen.
