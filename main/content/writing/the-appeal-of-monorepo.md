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
  - [Continuos deployment](#continuos-deployment)
  - [Auto-generation](#auto-generation)
  - [Increased visibility](#increased-visibility)
  - [Atomicity](#atomicity)
  - [Small is easy, big is possible](#small-is-easy-big-is-possible)
- [A rant about build tools](#a-rant-about-build-tools)
  - [Bazel is the worst build tool](#bazel-is-the-worst-build-tool)
  - [Except all others](#except-all-others)
- [How to structure a monorepo](#how-to-structure-a-monorepo)

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

- dependencies versions
- language versions

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

In other words, I think you can't actually do continuos integration in a
polyrepo setup.

## Changes, changes, changes

### Continuos deployment

### Auto-generation

### Increased visibility

### Atomicity

### Small is easy, big is possible

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

## How to structure a monorepo
