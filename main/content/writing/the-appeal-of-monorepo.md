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
  - [CD & CI can get really smart](#cd--ci-can-get-really-smart)
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

In reality, there is a variety of reasons why it's not exactly easy.

The first consideration is that your experience may vary a lot depending on how
many programming languages and which ones your organisation uses.

The reason is that the tooling support for monorepo is wildly different

### Setup costs

### CD & CI can get really smart

## Workflow

### Trunk based development

### Changes, changes, changes

#### Increased visibility

#### Atomicity

#### Small is easy, big is possible

## A rant about build tools

### Bazel is the worst build tool

### Except all others

## How to structure a monorepo
