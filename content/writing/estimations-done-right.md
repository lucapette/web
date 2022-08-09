---
title: "Estimations Done Right"
date: 2022-08-09T23:39:03+02:00
draft: true
---

Individual contributors often have problems with estimations. The reasons are
well known: software is hard, there are too many details to take into account,
and no one can consistently consider every aspect at estimation time.

Because of these well-know problems, both individual contributors and their
leaders tend to overestimate _everything_. It is only human to do so but, over
time, teams stop trusting the accuracy of their own estimates.

The lack of trust in estimations is tragi-comically common in our industry and
no strategy works better than removing the process completely.

If no one trusts estimates, what's the point, right?

The problem is that whoever is asking for an estimate, be that product managers,
the marketing department, the actual customers (that's the best option!), they
ask because having a proper timeline is relevant to their work.

So how does one find a balance between stakeholders needs and the hard truth
that estimations are an unpleasant, non-sense, unproductive process?

At latin class, the teacher would tell me _virtus in media stat_. It translates
to "virtue stands in the middle".

It is a nice principle which always comes to my mind when I discuss estimation
processes. You can design a process that removes estimations from your daily
operations and still gives a somewhat accurate estimation to whoever needs it.


The key is to focus on what makes estimates hard: product development is not
predictable therefore our estimation capabilities are bad.

I invite you to take a minute or two to think about the situations in which you
can safely say "this feature will take X effort" and you were actually right.

Done? Good.

I have spent a great deal of time thinking about this and I found that
predicable features show the following characteristics:

- The effort is the smallest possible in the given context.
- During the development phase, there was no back and forth between whoever
  specified the feature and whoever built it. The input was clear enough, no
  questions arose. After all, the feature was so small input was minimal.
- After the feature was deployed, there were no hot-fixes. The deployment was
  smooth, the system just kept working. After all, the diff was so small the
  system _almost did not change_.

Unfortunately most features do not check these marks.

They _should_ though.

A feature built via "a small diff" that went from start to rollout without any
problem _is_ the perfect scenario.

The sceptical here would say: it is called perfect scenario because it never
happens. I do not disagree with that, but I prefer to apply the following
principle instead:

> Strive for perfection, but accept that done is better than perfect

The balance between ideal and real world scenario is important and it should
always be taken into account. _Virtus in media stat_.

In the ideal world, all features would require "a small diff", have a perfectly
understandable input, and ship to production with no problems.

I know reality is not so simple, but the ideal scenario is giving us a clear
indication: small diffs are better than large diffs. They lead to short work in
progress, and easy deployment. So striving for perfection in this context means:

> What if all features we develop were as small as possible?

Well all the features would check the three marks I just discussed... right?
That would result in a perfectly predictable flow!

Here is a trivial example:

- You have to develop a large feature.
- After discussing how to split it, you break it out in 10 "small standard
  features".
- You know your "small standard feature" takes half a day.
- You are looking at a week of work.

This splitting process guarantees predictability: if every single feature we
build takes half a day, we know exactly how long anything takes.

The challenge moves away from guesswork and it becomes getting better at
breaking up work in small, coherent, deployable chunks of work.

That is the process you want to use to mitigate the unpredictable nature of
product development.

Focusing on splitting features has interesting side-effects on the communication
infrastructure of a team.

Continuously breaking up big features is such small parts requires a lot of
communication. It is a gym for empathy too.

It may be hard to break a big feature down for a specific reason: be that the
product angle, the design one, the technical feasibility, and so on.

These situations help team members to put others people shoes on and brings
everyone closer.

They can finally see each other problems and then, with some practice, start
anticipating them.

Team get closer and collaborate better if they have to split up features all the
time.

If that will get you a predictable flow, why wouldn't you do it? I personally
see no downsides.
