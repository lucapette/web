---
title: "The Appeal of Monorepo"
description: "or how I learned to stop worrying and love monorepo."
tags:
  - programming
keywords:
  - programming
  - monorepo
date: 2022-09-12T16:00:51+02:00
draft: true
---

Over the course of my career, I had the chance to work with a monorepo many
times. In fact, I chose to setup my teams with a monorepo every time I got the
chance.

Before I move on to the discussion of what appeals me to choose a monorepo
approach, let's define it. Here's the definition from
[https://monorepo.tools](https://monorepo.tools/#what-is-a-monorepo):

> A monorepo is a single repository containing multiple distinct projects, with
> well-defined relationships.

It's a thoughtful definition as it underlines both co-location of different
projects and a meaningful relationship among them.

I'm happy with this definition as long as `project=code+docs`. Making
documentation visible and easier to change is my favourite side-effect of
adopting a monorepo approach.

Here's a table of content of this article, in case you want to jump to a
specific topic:

- [Simple ain't easy](#simple-aint-easy)
- [Setup costs](#setup-costs)
- [One version to rule them all](#one-version-to-rule-them-all)
- [Continuos integration](#continuos-integration)
- [Changes, changes, changes](#changes-changes-changes)
  - [Atomicity](#atomicity)
  - [Continuos deployment](#continuos-deployment)
  - [Small is easy, big is possible](#small-is-easy-big-is-possible)
  - [Auto-generation](#auto-generation)
  - [Increased visibility](#increased-visibility)
- [A rant about build tools](#a-rant-about-build-tools)
  - [Bazel is the worst build tool](#bazel-is-the-worst-build-tool)
  - [Except all others](#except-all-others)
- [To mono or not to mono?](#to-mono-or-not-to-mono)

## Simple ain't easy

Conceptually, going monorepo seems pretty straightforward. All you need to do is
to put all your code into one repository, right?

In reality, there are many things to take into account so it's not exactly easy.

If you have an old codebase with lots of project, the migration to a monorepo
will not be trivial.

There's also an educational cost because monorepo is not so common in
early-stage startups.

To me personally, this is a very interesting aspect of the conversation. I think
early-stage startups would benefit quite a bit from the simplicity of having all
the code into one place.

Since the most difficult part of going monorepo is the tooling, I structured the
article so that the discussion about tooling is toward the end.

It's easier to discuss tooling once I mentioned some benefits of this approach.
Let's start from where a new project would start: setting it up.

## Setup costs

There's a lot going on when creating a new project. A typical setup involves:

- build scripts
- deployment scripts
- collaborators

It doesn't seem much but it adds up very quickly as an organisation grows and
it's mostly done by copy and paste of existing setup.

The problems with a polyrepo (stealing the naming from
[https://monorepo.tools](https://monorepo.tools)) is that the setup cost is
constant.

Furthermore, updates to build and deployment processes may require a non-trivial
number of changes.

The monorepo approach is very different.

First off, there's no setup costs for collaboration. The new projects will end
up in the same place the organisation is already using.

Build and deployment scripts costs are high only if a new programming language
is introduced.

This is a side-effect I love about monorepo: specific languages and frameworks
are officially supported by the monorepo. It makes organisational design of
growing teams easier.

It's harder to run into surprises like "that new project is build in X" where X
is a 3 weeks old language or framework.

Monorepo actively discourages the introduction of new languages because everyone
wants to move fast and no one wants to spend days (sometimes weeks) _before_
they can write a single line of code.

## One version to rule them all

As soon as a codebase is made of more than one project, questions about versions arise:

- Should project B use the same version of library X used in project A?
- Should we allow a new version of language Y in project B?

I say "questions arise" but, in my personal experience, they're not really asked
in a polyrepo setup. After all in a polyrepo each project is its own things.

The larger is the organisation (therefore the codebase) the more freedom people
will take when starting new projects. It's cool to use new shiny features of
languages and framework and it's pretty hard to ensure people make reasonable
choices at scale.

Depending on how a monorepo is organised, you may run into the same problem. But
the beauty of a monorepo approach is that you can put simple constraints in
place to ensure version management doesn't get out of hand.

You can have your build tools only support one version of library X and language
Y. So these questions do not rise in this context either but the end result is
very different.

If your build tools only support, say, Java 17 then all the projects will have
to support Java 17. Yes it's that simple.

This idea is often met with some resistance by developers because they find the
constraint too strong. In practice though, I haven't met any strong arguments in
favour of multiple versions of the same dependency or language.

It gets even more interesting with internal dependencies. In a polyrepo setup,
internal libraries must be treated like they were a public library. They need a
release cycle.

In a monorepo setup, you can have keep the whole company on the latest (and
only) version of a given library.

This constraint is pretty strong and that's the point. It makes people wanting
to change the API of an internal library responsible for changing all caller
sites as well. People have to feel strongly about some API for paying that cost.

One version of everything in the codebase will slow down adoption of new shiny
things. Which, of course, will make everything a little more stable.

On the other hand, some version upgrades have to happen really fast. The most
obvious example is security upgrades to external dependencies. In a polyrepo,
you'd have to do the same things in every single project relying on a
dependency. In a monorepo, you're doing that once.

## Continuos integration

In theory, I think it's possible to continuously integrate a large code base in
a polyrepo setup. I just haven't seen that work in practice.

Every CI solution I have seen in a polyrepo was a variation of an orchestration
tool for integration tests.

These "test all the things from all the repos" tools are fun to write. I learned
a lot building a couple of them. But they don't work very well due the very
nature of the problem they're trying to solve.

In a monorepo setup, continuos integration is significantly simpler.

First of all, if the languages involved are statically typed, feedback loops
tend to be really fast.

Writing "test all the things" tools also becomes much easier because it's
possible to rely on a variety of constraints provided by the monorepo.

Things like "all Java code builds this way" or "all the language X libraries are
in `lib/x` help a lot.

In my experience, the simplest approach to continuos integration is [trunk based
development](https://trunkbaseddevelopment.com/) in a monorepo.

In other words, I don't think you can actually do continuos integration in a
polyrepo setup.

## Changes, changes, changes

### Atomicity

### Continuos deployment

### Small is easy, big is possible

### Auto-generation

### Increased visibility

## A rant about build tools

The experience of building multiple projects in a monorepo will vary a lot
depending on which programming languages the projects in the monorepo use.

The easiest scenario is everything is written in the same language. If that's
the case, then the support for monorepo may be pretty good out of the box. For
example, TypeScript and Java for example have excellent tooling.

It gets more complicated the more languages are involved. I consider two
different scenarios:

- You have only two languages and both have excellent build tooling. You can get
  away glueing together the respective build tools with some bash scripting. It
  works, it's practical and you get most of the monorepo benefits.
- You have too many languages and need a build tool that is monorepo friendly.

### Bazel is the worst build tool

### Except all others

## To mono or not to mono?