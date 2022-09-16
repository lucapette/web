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
approach, let's define it:

> A monorepo is a single repository containing multiple distinct projects, with
> well-defined relationships.

The definition comes from [what's a
monorepo](https://monorepo.tools/#what-is-a-monorepo), a whole website dedicated
to monorepo.

It's a thoughtful definition as it underlines both co-location of different
projects and the fact there's a meaningful relationship between them.

I'm happy with this definition as long as `project=code+docs`. I never want to
forget about the documentation. Making documentation visible and easier to
change is my favourite side-effect of adopting a monorepo approach.

Here's a table of content of this article, in case you want to jump to a
specific topic:

- [Simple ain't easy](#simple-aint-easy)
  - [Setup costs](#setup-costs)
  - [CI & CD can get really smart](#ci--cd-can-get-really-smart)
- [Workflow](#workflow)
  - [Trunk based development](#trunk-based-development)
  - [Changes, changes, changes](#changes-changes-changes)
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

In reality, there is a variety of reasons why it's not exactly easy. There are a
lot of things to take into account.

If you have an old codebase with lots of project, the migration to a monorepo
will not be trivial.

There's obviously also an educational cost because, to be fair, monorepo is not
so common in early-stage startups.

To me personally, this is the most interesting aspect of the conversation
because I think these companies would benefit quite a bit from the simplicity of
having all the code into one place.

The most difficult part of going monorepo is the tooling. I structured this
article so that the discussion about tooling is toward the end.

Since that's a little complicated, it's easier to discuss tooling once I
mentioned some benefits of this approach.

### Setup costs

There's a lot going on when creating a new project. A typical setup involves:

- build scripts
- deployment scripts
- collaborators

It's not much but it adds up very quickly as an organisation grows and it's
mostly done by copy and paste of existing setup.

The problems with a poly-repo (stealing the naming from
[monorepo.tools](https://monrepo.tools)) is that the setup cost is constant.

Furthermore, updates to build and deployment processes may require a non-trivial
number of changes.

The monorepo approach is very different. First off, there's no setup costs for
collaboration. The new projects will end up in the same place the organisation
is already using.

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

### CI & CD can get really smart

- dependencies versions
- language versions
- automatically deploy all that changed
- generate docs of all kind


## Workflow

### Trunk based development

### Changes, changes, changes

#### Increased visibility

#### Atomicity

#### Small is easy, big is possible

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
