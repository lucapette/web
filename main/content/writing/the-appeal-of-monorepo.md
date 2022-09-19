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

{{< message class="is-info">}} This is a _long_ read. You will find a table of
 contents right after the introduction. {{</ message >}}

Before I dive into what appeals me and what doesn't about a monorepo approach,
let me share a definition from
[https://monorepo.tools](https://monorepo.tools/#what-is-a-monorepo):

> A monorepo is a single repository containing multiple distinct projects, with
> well-defined relationships.

It's a thoughtful sentence as it underlines both co-location of different
projects and the meaningful relationship among them.

I'm happy with this definition as long as `project=code+docs`. I never forget
about the docs.

Fundamentally, what I find most compelling about a monorepo approach is a
combination of two ideas:

- Less is more.
- Co-locating all the project in the same repo eases our ability to impose
  constraints on the whole codebase.

These two ideas are powerful in their simplicity but, as mentioned in the wonderful
book [How to take smart
notes](https://www.goodreads.com/book/show/34507927-how-to-take-smart-notes),
"Taking simple ideas seriously" is a not as easy as it sounds.

Often enough when someone says simple, we hear easy and this is the perfect
starting point for this discussion.

Here's the table of content if you prefer to jump to a specific section:
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

Conceptually, going monorepo seems pretty straightforward. You only need to put
all your code into one repository, right?

In reality, there are many things to take into account so it's not exactly easy.

If you have an old codebase with lots of project, the migration to a monorepo
will not be trivial because each repository is its own little world of
configuration, version control history, and so on.

In most cases, there's also an educational cost because monorepo is not as
common as it could be so many developers, especially those that only worked in
early stage startups, have never worked with a monorepo before.

The irony of this being early-stage startups would benefit quite a bit from the
simplicity of having all the code into one place even if they would not use any
particular technique or tool. Literally just having all the code in one place
would help. More on this later.

The most difficult part of going monorepo is the tooling which is why I
structured the article so that the discussion about tooling is toward the end.

It's easier to discuss what you're looking for from tooling once you're familiar
with some benefits of this approach.

Let's start from where a new project would start: setting it up.

## Setup costs

There's a lot going on when creating a new project. A typical setup involves
lots of what I call "project infrastructure":

- build scripts
- test scripts
- deployment scripts
- collaborators

It doesn't seem much but it adds up very quickly as an organisation grows. The
best part: it's mostly done by copy and paste of existing setup.

The problems with a polyrepo (as in the opposite of a monorepo. I stole the
naming from [https://monorepo.tools](https://monorepo.tools)) is that the setup
cost doesn't decrease as much as you'd expect from a copy and paste process (or
maybe exactly because it works like that :)).

Furthermore, any update to the project infrastructure needs to be manually
replicated to any relevant project.

The monorepo approach is quite different.

First off, there's no setup costs for collaboration. The new projects ends up in
the same repository you're already using.

Project infrastructure costs are high if the project introduced new languages or
frameworks (often less of a problem that a language) to the repo.

This is a side-effect I love about monorepo: only widely approved languages and
frameworks receive "official" support in the monorepo.

It makes organisational design of growing teams easier so you don't run into
surprises like "that new project is build in X" where X is a 3 weeks old
language or framework anymore.

Monorepo tend to be more conservative regarding new technology because everyone
wants to move fast but no one wants to spend days (sometimes weeks) _before_
they can write a single line of code using shiny new tech.

## One version to rule them all

As soon as a codebase is made of more than one project, questions about versions
arise:

- Should project B use the same version of library X used in project A?
- Should we allow a new version of language Y in project B?

I say "questions arise" but, in my personal experience, they're never really
asked in a polyrepo setup. After all in a polyrepo each project is its own
little world.

The larger the organisation (therefore the codebase), the more frequent
diverging versions are.

To be fair you may run into the same problem with a monorepo if you do nothing
about it. But the beauty of a monorepo approach is that you can put simple
constraints in place with a relatively low effort. So you can ensure version
management doesn't get out of hand.

You can have your build tools only support one version of library X and language
Y. In the end, these questions about versions do not rise in this context either
but the reasons and the  end results are different.

If your build tools only support, say, Java 17 then all the projects will to
support Java 17. Yes, it's that simple.

This idea is often met with some resistance by developers because they find the
constraint too strong. In practice though, I haven't met any strong arguments in
favour of multiple versions of the same dependency or language.

It gets even more interesting with internal dependencies. In a polyrepo setup,
internal libraries must be treated like they were a public library. They need a
release cycle.

In a monorepo setup, you can have keep the whole company on the latest (and
only) version of a given library.

This constraint is pretty strong. But that's the point.

It makes sure that whoever changes the API of an internal library is also
responsible for changing all caller sites. People have to feel strongly about
some API for paying that cost.

One version of everything in the codebase will slow down adoption of new shiny
things. Which, of course, is a good thing.

On the other hand, some version upgrades have to happen really fast. The most
obvious example is security upgrades of external dependencies.

In a polyrepo, you'd have to do the same things in every single project relying
on a dependency.

In a monorepo, you bump the version and you're good to go.

## Ch-ch-ch-ch-changes

I don't really need an excuse to squeeze the genius of [David
Bowie](https://www.youtube.com/watch?v=4BgF7Y3q-as) in a conversation about
monorepo but I was genuinely thinking about him when I first drafted this
paragraph. So here we are.

Changing code is the most common operation any organisation executes on a daily
basis in their code base.

In my opinion, this is where a monorepo really shines.

### Atomicity

If all the code is in the same repo then atomically executing a change becomes a
trivial operation compared to the same change in a polyrepo.

As already mentioned, versions are a perfect example of this difference. You
upgrade a library to a newer version with one commit for the whole code base.
Which allows you to execute the change much faster than you would in a polyrepo
setup.

It's easy to underestimate the value of atomic changes but they really simplify
many operations.

An example I like is code style conventions. Historically, I have been always
reluctant to discuss styling because these conversations felt goalless in a
polyrepo. It's often so expensive to change all the codebase to a different
convention, you're just not going to do it.

In a monorepo, these conversations feel different. If the team agrees on a new
convention, you're one commit away from changing the _whole_ code base to it.

The point here is not that monorepo will allow you to change code conventions
quickly, the point is atomic changes give you options you don't really have in a
polyrepo.

Another situation in which I've seen a staggering difference is ops-driven
changes.

Let me provide a concrete example to illustrate this difference.

Say you're deploying your applications on some Kubernetes clusters and co-locate
your deployment descriptors (fancy name for "ugly, big yml file") with the code
of each project.

One day your operations team comes up with some custom resource definitions that
greatly improve the operations of your apps (think health checks, logs,
metrics). The challenge is that you need to change all your deployment
descriptors to benefit from these improvements.

In a polyrepo, you'd start thinking about some migration strategy. Deprecate the
current descriptors, make a list of descriptors to change, change them one by
one. It's possible but it's also not comfortable.

In a monorepo, your strategy would be very different. You'd prepare a commit
with all the new descriptors and ship it. No migration strategy, no deprecation
policy, no transition period. Yes, it's that easy.

### Small is easy, big is possible

The fact you can make however large atomic changes in a monorepo makes
impossibly large changes possible.

My favourite example of this is how Stripe [migrated millions of lines of code
to TypeScript](https://stripe.com/blog/migrating-to-typescript).

Can you imagine adding on top of the intrinsic complexity of this migration
having to do it in hundreds of repositories with as many pull-requests?

I can't really picture it.

The point is more general than the example I provided though.

A monorepo is a number of known constraints about a codebase. Things like
"libraries are here", "all our JavaScript projects use yarn", "docs are always
valid markdown and in a `docs` directory at root of each project" allow you to
design big changes to your code base you wouldn't even begin to imagine in a
polyrepo setup.

Constrains unlock creativity. That's the general point. I believe this is valid
well outside of the boundaries of a monorepo, but that's a different story.

There's more. Small changes also benefit from a monorepo approach.

Because all projects use the same project infrastructure, a developer can go in
a project, make a small change, run its tests, lints its code, and finally
submit a change request without having to learn anything specific about the
project apart from its actual code.

### Auto-generation

The most important constraint of a monorepo gives you is that the code is all in
the same place. It is so obvious you must be wondering why I'm bringing it up
again.

Well, it's because the fact is obvious but its long-term consequences aren't.
Especially to those that have never worked in a monorepo.

Auto-generated artifacts are my favourite example of "the somewhat unintended
consequences of co-locating all the projects in the same repo".

You wouldn't even think to solve some problem with auto-generated code if you
didn't have access to all the code at the same time from the same tools.

Once again, let me provide a concrete example to illustrate the point.

When I was working at [airy.co](https://airy.co/), we often run into a trivial
but annoying operations problem.

Our applications were heavily based on Kafka so, often enough, we shipped
applications producing or consuming data using topics that didn't exist yet in
our production clusters.

These applications would crash on start (obviously 🙃) so we had to stop the
them, create the necessary topics manually (with the right config!), and restart
the applications every time this happened.

We solved the problem iby introducing a small application that found all our
topics used in the code base and generated topics creation scripts for us (with
the right config!).

You can check out its code
[here](https://github.com/airyhq/airy/blob/1b9874cf123c7531cf5cddbb3e52b3801557d5cf/infrastructure/tools/topics/src/main/java/co/airy/tools/topics/TopicsFinder.java)
(yay open source!).

This isn't rocket science but the point stands: we could only solve the problem
with a trivial approach (it's literally one Java class) because of the existing
constraints the monorepo gave us.

You can apply this idea to many things, not just code. It works well with assets
(like image optimisation), translations (generating code friendly `I18n`
assets), documentation, and so on. The applications are literally endless.

### Increased visibility

When working in an organisation with multiple teams, it's only natural to lose
some visibility over what other teams are doing.

There's nothing intrinsically wrong with this and you could argue that it's
often a welcomed limitation. It allows team members to focus better on their own
challenges.

On the other hand though, the more teams in an organisation the more common it
is for different teams to solve the same problems multiple times, the more
communication infrastructure is needed (internal blog posts, lighting talks, and
so on) to keep a coherent vision going.

A polyrepo approach makes this problem more evident because it's pretty easy to
miss work in repositories you don't have anything to do with. Sometimes, even
unintentionally, you may not even ever see a repo because no one gives you
access to it.

In monorepo, visibility works very differently. Everything is visible by default
so you tend to have the opposite problem: too much information coming your way.

In my experience, this is a far better trade-off because it allows for more
granular choices.

People can follow along a part of the system they don't work with with minimal
effort. If they don't want to, they don't need to.

Putting all the code in the same repo also makes projects, libraries, docs more
discoverable.

You may not want to follow how your organisation does, say,
infrastructure-as-code on a daily basis but it's great to have the option to
`cd` into `/infrastructure` and read the "internal" documentation.

This increased visibility also makes team members more emphatic with the rest of
the organisation because they can see, for example, the effort that went in that
feature that just shipped.

### CI & CD

In theory, it may be possible to continuously integrate a large code base in a
polyrepo setup. I haven't seen that work in practice though.

Every CI solution I have seen in a polyrepo has been some variation of an orchestration
tool for integration tests.

These "test all the things from all other repos" tools are fun to write. I
learned a lot building a couple of them. But they don't work very well due the
very nature of the problem they're trying to solve.

In a monorepo setup, continuous integration is significantly simpler.

First of all, if the languages involved are statically typed, feedback loops
tend to be really fast. Broken code won't even compile after all.

Writing "test all the things" tools also becomes much easier because you can
rely on some specific constraints provided by the monorepo. Things like "all
Java code builds this way", "all the language X libraries are in `lib/x`", or
"you can run any web apps locally with this command" help a lot writing code for
your test infrastructure.

In my experience, the simplest approach to continuous integration is [trunk based
development](https://trunkbaseddevelopment.com/) in a monorepo.

Honestly speaking, I don't think you can practically do continuous integration
in a polyrepo setup. And this alone is enough to me to _always_ choose monorepo.

The difference between polyrepo and monorepo is also evident with CD.

In a polyrepo, CD is fine when you're working with one project. You push your
code, the CD pipeline picks up, and deploys it. Simple enough.

This process isn't as good when multiple projects are involved.

It becomes somewhat of a manual process in which you deploy the different
projects involved in a specific order one after the other.

It's worth noticing the underlining problem is that you can't really do atomic
changes to a system when multiple projects live in different repositories.

In a monorepo, your workflow could look like this:

- A new "atomic" commit hits the main branch.
- The CD pipeline finds all the code the commit affected.
- It calculates which projects that depend on the affected code.
- It automatically deploys the projects in the right order.

A monorepo-friendly build tool can calculate [reverse
dependencies](https://bazel.build/query/language#rdeps) which is the hardest
part. Then A few lines of bash will glue the rest together and this "smart"
pipeline would be 15 lines of code or so. Some tools, like
[gradle](https://gradle.org/), can even detect changes automatically and react
accordingly.

On the other hand, I can't really think of a simple way to build this workflow
in a polyrepo setup.

Whatever idea I come up with, my brain immediately dismisses as too expensive,
too complicated. It's just not worth it.

## To mono or not to mono? Which build tool is the question.

Over the course of my career, I chose setup my teams with a monorepo _almost_
every time I got the chance.

I say _almost_ because twice, even though I had already been pretty much
convinced a monorepo yields better long-term results than a polyrepo, I decided
against adopting a monorepo. It goes without saying I regret both decisions.

Every decision is contextual though and here the context is how many languages
and which languages specifically the monorepo will contain. This is what the
conversation around tooling boils down to.

The experience will vary a lot depending on which programming languages are at
play in the monorepo. Let me examine the possible scenarios.

The simplest scenario is everything is written in the same language.

If that's the case, then the support for monorepo may be pretty good out of the
box. For example, TypeScript and Java for example have excellent tooling. Even
if it's not as good as that, a little scripting goes a long way.

It gets more complicated the more languages are involved. I see two different
scenarios:

- You have only two languages and both have excellent tooling. You can get away
  gluing together the respective build tools with some scripting. It works, it's
  practical and you get most of the monorepo benefits.
- You have too many languages so you need a build tool that is monorepo-friendly
  and polyglot at the same time.

Now we're at core of the question: which build tool should you choose if you
were to adopt a monorepo approach today?

My answer is quite grim. None of them is good enough for a clear cut answer
because of their polarised JavaScript support: they either support _only_
JavaScript or they don't support it _at all_.

A somewhat "traditional" early stage startup with a web product, an Android
application, and an iOS one would run into some complications adopting a
monorepo because of this.

On the other hand, using one build tool for the whole monorepo isn't a strict requirement.

If you can do that, it's definitely better. Less is more.

But if you can't, you can (and my point is you should) still go for a monorepo.
You can slowly glue together different parts as the need arises.

In my experience, the most difficult challenge of adopting a monorepo in a truly
polyglot environment is being able to provide a consistent high quality
developer experience regardless of the language.

Since build tools have different degrees of support for different languages, the
everyday experience will reflect that difference and it will be your job to
cover that gap.

I need to stress one more time though that even just putting all the code in the
same repo and call it a monorepo yields better long-term results than a
polyrepo. Its simplicity will show its strength in the little details of the
every day tasks anyway.

