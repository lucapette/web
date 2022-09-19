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
times. In fact, I chose to setup my teams with a monorepo almost every time I
got the chance.

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
- [Ch-ch-ch-ch-changes](#ch-ch-ch-ch-changes)
  - [Atomicity](#atomicity)
  - [Small is easy, big is possible](#small-is-easy-big-is-possible)
  - [Auto-generation](#auto-generation)
  - [Increased visibility](#increased-visibility)
  - [CI & CD](#ci--cd)
- [To mono or not to mono? Which build tool is the question.](#to-mono-or-not-to-mono-which-build-tool-is-the-question)

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
things. Which, of course, will make everything more stable.

On the other hand, some version upgrades have to happen really fast. The most
obvious example is security upgrades to external dependencies. In a polyrepo,
you'd have to do the same things in every single project relying on a
dependency. In a monorepo, you're doing that once.

## Ch-ch-ch-ch-changes

I don't really need an excuse to squeeze the genius of [David
Bowie](https://www.youtube.com/watch?v=4BgF7Y3q-as) in a conversation about
monorepo but I was genuinely thinking about him when I first drafted this
paragraph. So here we are.

Changing code is the most common operation any organisation makes on a daily
basis in any code base.

It's where a monorepo really shines in my opinion. There's a lot to discuss so
let's get on with it right away.

### Atomicity

If all the code is in the same repo then atomically executing a change becomes a
trivial operation compared to the same change in a polyrepo.

As already mentioned, versions are a perfect example of this difference. You can
upgrade a library to a newer version with one commit for the whole code base.
Which allows you to execute the change much faster than you would in a polyrepo
setup.

It's easy to underestimate the value of atomic changes but they simplify many
operations.

An example I like is code style conventions. Historically, I have been always
reluctant to discuss styling because these conversations felt goalless in a
polyrepo. It's often so expensive to change all the codebase to a different
convention, you're just not going to do it.

In a monorepo, these conversations feels different. If the team agrees on a new
convention, you're one commit away from changing the _whole_ codebase to it.

The point here is not that monorepo will allow you to change code conventions
quickly, the point is atomic changes give you options you just don't have in a
polyrepo.

Another situation in which I've seen a staggering difference between monorepo
and polyrepo is ops-driven changes. Let me provide a concrete example to
illustrate the difference.

Say you're deploying your applications on some Kubernetes clusters and co-locate
your deployment descriptor (fancy name for "ugly, big yml file") with the code
of each project.

One day your operations team comes up with some custom resource definitions that
greatly improve the operations of your apps (think health checks, logs,
metrics). The challenge is that you need to change all your deployment
descriptors.

In a polyrepo, you'd start thinking about some migration strategy. Deprecate the
current descriptors, make a list of descriptors to change, change them one by
one. It's not impossible but also not comfortable.

In a monorepo, your strategy would be very different. You'd prepare a commit
with all the new descriptors and ship it. No migration strategy needed.

### Small is easy, big is possible

The fact you can make large atomic changes within a monorepo makes impossibly
large changes possible.

My favourite example of this is how Stripe [migrated millions of lines of code
to TypeScript](https://stripe.com/blog/migrating-to-typescript).

Can you imagine adding on top of the complexity of this migration having to do
it in hundreds of repositories with as many pull-requests? I can't really
picture it.

The point is more general than the example I provided though.

A monorepo is a number of known constraints about a codebase. Things like
"libraries are here", "all our JavaScript projects use yarn", "docs are always
valid markdown and in a `docs` directory at root of each project" allow you to
design big changes to your code base you wouldn't even begin to imagine in a
polyrepo setup.

There's more. Small changes also benefit from a monorepo approach.

Because all projects use the same building scripts, a developer can go in a
project, make a small change, run its tests, lints its code, and submit a change
request without having to learn anything specific about the project apart from
the actual code.

### Auto-generation

The most important constraint of a monorepo is that the code is all in the same
place. It sounds so obvious you must be wondering why I'm bringing it up again.
Well, it's because the fact is obvious but its long term consequences not so
much. Especially if you never worked in a monorepo before.

Auto-generated artifacts are my favourite example of this. The point being that
you wouldn't even think to solve some problem with auto-generated code if you
weren't using a monorepo.

Once again, let me provide a concrete example to illustrate the point. When I
was working at [airy.co](https://airy.co/), we often run into a trivial but
annoying operations problem.

Our applications were heavily based on Kafka so often enough we shipped
applications producing or consuming data using topics that didn't exist yet in
our production clusters. These applications would crash on start so we had to
create the topics manually, and restart the applications to fix them.

The way we solved this problem is by introducing a small application that found
all our topics used in the code base and generated topics creation scripts for
us. You can check out its code
[here](https://github.com/airyhq/airy/blob/1b9874cf123c7531cf5cddbb3e52b3801557d5cf/infrastructure/tools/topics/src/main/java/co/airy/tools/topics/TopicsFinder.java)
(yay open source!).

This isn't rocket science but the point stands: we could only solve the problem
with a trivial approach (it's literally one Java class) because of the existing
constraints the monorepo gave us.

You can apply this idea to many things not just code. It works well with assets
(like image optimisation), translations (generating code friendly `I18n`
assets), documentation.

### Increased visibility

When working in an organisation with multiple teams, it's only natural to lose
some visibility over what other teams are doing. There's nothing intrinsically
wrong with it and you could argue it's often a welcomed limitation since it
allows team members to focus on their slice of the problem.

On the other hand though, the more teams in an organisation the more common it
is for teams to solve the same problems twice, the more communication
infrastructure is needed (internal blog posts, lighting talks, and so on).

A polyrepo approach makes this problem more evident because it's pretty easy to
miss work in repositories you don't have anything to do with. Sometimes, even
unintentionally, you may not even have the rights to see a repo.

In monorepo, visibility works very differently. Everything is visible by default
so you tend to have the opposite problem: too much information coming your way.

In my experience, this is a better trade-off because it allows for more granular
choices. People can follow along a part of the system they don't work with with
minimal effort. If they don't want to, they don't need to.

Putting all the code in the same repo also makes things more discoverable. You
may not want to follow how your organisation does infrastructure-as-code on a
daily basis but it's great to actually have the option to `cd` into
`/infrastructure` and read the "internal" documentation.

This increased visibility also makes team members more emphatic with the rest of
the organisation because they can see, for example, the effort that went in that
feature that just shipped.

### CI & CD

In theory, it may be possible to continuously integrate a large code base in a
polyrepo setup. I just haven't seen that work in practice.

Every CI solution I have seen in a polyrepo was a variation of an orchestration
tool for integration tests.

These "test all the things from all the repos" tools are fun to write. I learned
a lot building a couple of them. But they don't work very well due the very
nature of the problem they're trying to solve.

In a monorepo setup, continuous integration is significantly simpler.

First of all, if the languages involved are statically typed, feedback loops
tend to be really fast.

Writing "test all the things" tools also becomes much easier because it's
possible to rely on a variety of constraints provided by the monorepo.

Things like "all Java code builds this way" or "all the language X libraries are
in `lib/x` help a lot.

In my experience, the simplest approach to continuous integration is [trunk based
development](https://trunkbaseddevelopment.com/) in a monorepo.

In other words, I don't think you can practically do continuous integration in a
polyrepo setup.

The difference between polyrepo and monorepo is also evident with CD.

In a polyrepo, CD is fine when we're working with one project. You push your
code, the CD pipeline picks up and deploys it. Simple enough.

This process isn't as good when multiple projects are involved though.

It becomes somewhat of a manual process in which a team deploys the different
projects involved in a specific order one after the other.

It's worth noticing the underlining problem is that you can't really do atomic
changes to a system when multiple projects are involved and they live in
different repositories.

In a monorepo, the CD pipeline can look like this:

- A new "atomic" commit hits the main branch.
- The CD pipeline finds all the code the commit affected.
- It calculates which projects that depend on the affected code.
- It automatically deploys the projects in the right order.

A monorepo-friendly build tool can calculate [reverse
dependencies](https://bazel.build/query/language#rdeps) which is the hardest
part. Then A few lines of bash will glue the rest together and this "smart"
pipeline would be 15 lines of code or so. Some tools, like
[gradle](https://gradle.org/), can actually detect changes automatically and
react accordingly.

On the other hand, I personally can't really think of a simple way to build this
pipeline in the polyrepo setup. Whatever idea I have, my brain immediately
dismisses as too expensive, too complicated, not worth it.

## To mono or not to mono? Which build tool is the question.

In the introduction of this article I wrote:

> In fact, I chose to setup my teams with a monorepo almost every time I got the
chance.

Now it's time to expand on that almost. In a couple of occasions, even though I
was already pretty much convinced monorepo yields better long term results than
a polyrepo, I decided against adopting a monorepo.

Every decision is contextual and in a discussion about monorepo adoption, the
context is how many languages and which languages specifically the monorepo will
contain.

In fact, the experience of building multiple projects in a monorepo will vary a
lot depending on which programming languages the projects in the monorepo use.

The easiest scenario is everything is written in the same language. If that's
the case, then the support for monorepo may be pretty good out of the box. For
example, TypeScript and Java for example have excellent tooling.

It gets more complicated the more languages are involved. I consider two
different scenarios:

- You have only two languages and both have excellent build tooling. You can get
  away gluing together the respective build tools with some bash scripting. It
  works, it's practical and you get most of the monorepo benefits.
- You have too many languages and need a build tool that is monorepo friendly.

Now we get to the core of the question: which build tool should you choose if
you were to adopt a monorepo approach?

My answer is quite grim. None of them is good enough because of their polarised
JavaScript support: they either support _only_ JavaScript or they don't support
it _at all_.

That means that a somewhat "traditional" early stage startup with a web product,
an Android application, and an iOS one would have a harder time adapting a
monorepo because of this.

On the other hand, you do not need to use the same build tool for the whole
monorepo. If you can do that, it's definitely better. Less is more. But if you
can't, you can still go for a monorepo and slowly glue together different parts
as the need arises.

In my experience, the most difficult part of going monorepo is being able to
provide the same developer experience to all team members.

Since build tools have different degrees of support for different languages, the
everyday experience will reflect that.

It had to be said though that even just putting all the code in the same repo
and call that a monorepo would yield better long term results than a polyrepo.
Because its simplicity will show its strength in the little details of the every
day tasks anyway.

