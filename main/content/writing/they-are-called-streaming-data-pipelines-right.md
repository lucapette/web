---
title: "They are called streaming data \"pipe\"lines... right?"
date: 2023-11-27T14:32:28+01:00
draft: true
---

TODO say this a brief history of typestream. From the idea to the running code.

Almost a decade ago, I was the CTO at a small and very cool startup called
Marley Spoon, the best (I'm not biased here, it's just true :)) meal kit delivery
kit service out there.

One day, this must have been late spring of 2016, I was in a meeting with the
engineering and product leadership. We were discussing how to leverage Kafka so
that our teams, with their very different needs and pace, could move more
independently.

 We had a web store and some batch jobs "producing" orders and a variety of
services "consuming" orders and implement a variety of use-cases. Kafka acted as
a transport layer and a "api" between the two worlds via a primitive change data
capture pipeline. I'm sure this architecture is familiar to many of you,
especially now that change data capture is widely known. Back then, it was a bit
more novel (I think we had to rely on a postgres extension to get it done
because [debezium](https://debezium.io) wasn't around yet).

The way we intended to consume orders really intrigued me in this meeting. I
remember trying to explain how I would go about it and failing pretty
spectacularly: the rest of the team looked at me lost. But the core intuition I
had that day stayed never left me. We were having a conversation at a certain
level of abstraction but our tooling was several levels away from it. Let me
explain.

Our web store and our batch jobs produced orders which we streamed to Kafka.
Almost no consumer needed the "raw orders", most of them needed either a subset
of orders (things like "orders to ship", "orders to pack in NL") or parts of
each "raw order" (things like "customer's emails of orders to ship", "list of
ingredients of orders to pack in NL").

While we were looking at the diagrams on a whiteboard I couldn't help but think
that most of our data pipelines were highly composable little functions. You
could combine by calling each function on the result of the previous one. Now a
more mathematically inclined mind would explore this concept further but I'm a
programmer so I saw a different, dare to say, obvious metaphor at play. These
little functions you can call one after the other looked a lot like UNIX
pipelines. Each function type is a UNIX command that does one thing and the idea
of calling them in sequence is just a command pipe.

Here I want to stop a second and notice that these two "metaphors" only work
well when you can thing of these functions as little. That adjective is subtly
important there. Conceptually, if I have "raw orders", getting to "orders to
ship" is a trivial operation simple operation. Same goes for getting
"customers's emails of orders to ship" from "orders to ship". In practice
thought, there was a lot of detail to take into account. The functions didn't
feel little. At the time, I attributed the failure of communicating this idea to
my team well to this. Now I'm a better leader and I know that, at the time, my
idea wasn't even clear to me. I had had it during the meeting after all. Now I
know better: I'd note it down and develop it first before exposing a number of
people to it.

I was saying: UNIX pipelines. I realised I could express our data needs as.
simple, composable, UNIX pipelines.

You get orders to ship like this:

```sh
let orders_to_ship=$(cat orders | grep [.state == 'to_ship'])
```

Then you get emails like this:

```sh
cat $orders_to_ship | cut .email
```

I remember feeling confused about this idea. For the first time in my career, I
wanted to build something that I found both really obvious to conceptualize on
it and hard to build. A strange combination.

The core idea that data pipelines are UNIX pipelines is one of the three
foundational ideas behind TypeStream. More on the other two later. Back then I
didn't even try building a prototype for this. Thinking about it felt a little
like good sci-fi feels to me: conceptually feasible but pretty far in practice.

This was spring of 2016, so working with data in Kafka felt to me very low
level.

Nowadays, things got much better. Thanks to amazing technology like [Kafka
Streams](https://kafka.apache.org/documentation/streams/),
[ksqlDB](https://ksqldb.io/), and [flink](https://flink.apapche.org) you can
reason about streaming data pipelines at a much higher level. The thing is
though that it's not high-level enough :)

Now, before I go deeper into explaining why I think TypeStream is a thing and
why it should be a bigger thing, a little of personal detour. I find discussing
these ideas in public quite overwhelming. There's a part of my brain that
constantly asks questions like:

- This gotta be a bad idea if no one else sees it your way.
- It's probably too hard to get these idea into practice for you.

Maybe you'll call it impostor syndrome, maybe not. But the reason why I'm
sharing this is not to find an answer to this doubt together. It's because I
need to clarify that I _genuinely_ don't understand why approaching data
pipelines the way I'm thinking about them (aka the UNIX way) isn't more common.
I'd go as far as saying this should be the default way. I mean, there's the word
"pipe" in "data pipelines", isn't there? This abstraction feels so good I feel
weird "stealing" it for TypeStream. While I'm having this conversation with
myself I'm always overwhelmed by the (no word play intended) question "How is it
possible that no one sees how obvious this is?"

Honestly, just pushing through the writing here trying to ignore myself. It's
hard because I speak a lot (if you're my friend, you know I do. I'm sure you
also know that I'm not sorry about it. _You_ are my friend, that's _your_
problem. I'm even speaking too much right now? No, I'm not sorry right now
either). That includes myself as well. So I'm annoying and it's hard to ignore
me.

All right, where were we? I was saying that the Kafka community made great
progress for "here is the consumer group api javadoc, go" to Kafka Streams,
ksqlDB, flink (and other). I was also saying that it's not high level enough.

So what's high level enough then? That's the question. Well, UNIX pipelines are
almost English. That'd be close enough me.

I was telling myself this last year when I decided I had to look at Kotlin more
closely. This feels completely unrelated and in a way it is. Because there's no
direct connection between Kotlin and TypeStream. The thing is I can't learn a
new programming language through fictional exercises. I need something complex
enough I can go at it for a few weeks in a row. That's how I learned any
language (a limiting approach in certain settings). So the project "write a
bash-like pipe to Kafka Streams compiler" felt rightly sized.

That's how I got myself into TypeStream. The first few weeks were really fun. I
got to put in practice a big chunk of the first part of the book "Crafting
interpreters". A magnificent book that gets you started on actually writing a
programming language and not talking about writing one.

By the time, my program could compile simple pipelines with a handful of "data
operators"/commands I had spent quite some time thinking about `TypeStream`.

Because you see, I'm also a pretty sceptical person that likes to sabotage their
own plans. I'm fun like that. So I kept thinking something along the lines of
"well if TypeStream were a good idea, then you could X but sure you can't,
right?" and constantly finding the "UNIX metaphor" to give me ways to say that,
in fact, X was easy with `TypeStream`.

This is were the second foundational ideas behind `TypeStream` comes in place.
See, when I had the intuition of expressing "filter book by word count > 20k", I
didn't put go any further than imagining this:

```sh
cat /dev/kafka/cluster1/topics/books | grep [.word_count >]
```

But when I had a working compiler and was finally ready to run my pipelines, I
realized there's a second powerful idea hiding in play sight here: a virtual
filesystem. In UNIX, everything is a file. In `TypeStream`, everything is a data
stream.

Addressing data sources as filesystem paths felt really so natural I didn't
realize its profound implications until my brain started annoying me with
questions about how to invalidate `TypeStream` first foundational idea by trying
to find things you can't properly express. Some pipeline were the "UNIX
metaphor" just breaks. This is precisely how I discovered that the virtual
filesystem was indeed so natural, I didn't need to explain.

For example, how would you expect to address a postgres table? Does
`/dev/postgres/db1/tables/customers` look reasonable?

Most times I don't really need to explain this when I pitch `TypeStream` to
backend developers or data engineers. It's completely obvious.

What's maybe a little harder to see is how well the virtual filesystem pairs
with typical data operations. For example, you may want to expose data via a
websocket this way:

```sh
cat /dev/kafka/cluster1/topics/books | grep The | cut .id .title > /media/websocket/server1/books_notifications
```

the "media mounting" works well right? Think of
`/media/elastic/cluster1/index_01` or `/media/http/server1/endpoint`. Why not?

Things get really interesting for me when I put those two foundational ideas
together and I imagine I've seen a lot: stream data out of a relational data
base, apply some trivial business filtering to it, send the data to a bunch of
places. A common real-world application: sign-up flow processes.

Here's how I'd imagine `TypeStream` taking care of capturing new users out of a
postgres database, publish them to some Kafka topic for later consumption, and
send a welcome email to new users via a transactional email service:

```sh
let new_users = $(cat /dev/postgres/tables/users | grep [.op == 'insert'])

cat $new_users > /dev/kafka/topics/users.new
cat $new_users | cut .id .email > /media/email/welcome
```

It's surprisingly succinct. But it's not brevity over clarity that interests me
the most. To me, the real deal is that it feels like this is the closer you can
get to plain English that is still machine code.

Funnily, there's already tech out there covering the gap between `TypeStream`
and English. GitHub Copilot most times produces valid `TypeStream` pipelines
from plain English comments! A testament to the simplicity and validity of the
core ideas behind `TypeStream`. After all, I invented nothing and I take no
credit here. UNIX pipes were there long before I was born.

At this point, if this intrigues you I think you may be wondering what's the
secret ingredient here? How does `TypeStream` take care of things like `cat
$new_users | cut .id .email`?

This is where the third foundational idea comes in. It may seem less relevant to
the conversation because it's the only idea in `TypeStream` that doesn't
directly borrow (I mean steal) from UNIX. On the other hand though, it gave
`TypeStream` its name and it's the most interesting (I mean challenging) part of
the project.

`TypeStream` operates on data of different nature (a postgres table, a Kafka
avro topic, a protobuf gRPC message, and so on...) which means it knows the
schema types of data involved in a pipeline. It maintains a catalog of these
types and, as most `TypeStream` ideas, it relies on the virtual filesystem:
`TypeStream` has a k/v store where a key is a path (say
`/dev/kafka/cluster1/topics/books`) and a value is schema type (say
`Struct[title: String, wordCount: Int]`).


The catalog allows `TypeStream` to type-check pipelines like:

```sh
cat /dev/kafka/cluster/books | grep [.name ~= "the"]
```

`TypeStream` will tell you "hey there's no name on books". Which seems already a
non trivial feature for a data pipeline platform.

Now the beauty of programming to me is that you can build whatever you want.
There are no limitations: if you can imagine it you can build it. So soon after
I found myself imagining that `TypeStream` could do "type inference", I build
it. It's called _`Type`_-`Stream` after all, types are crucial to the
experience. In practice, "type inference" means that TypeStream has a variety of
rules to infer (surprise!) the resulting type of data operations.

To make pipelines always typed, `TypeStream` also does some "type inference". Say you have:

```sh
join /dev/postgres/
```

## the power of abstraction

When I started outlining this article, I collected a bunch of links around "the
power of abstraction" (draft title of this article) which I thought would be
part of the article. But the writing took me a different way and now it's just a
list. It feels a little strange to just share the list now so I'll also add a
little commentary to it.

- a bit of history (Cobol, kubernetes good examples)
- What’s the _real_ deal with TypeStream (hint: abstraction)
  - [X](https://twitter.com/gunnarmorling/status/1716878504044998914) core idea is the same as protocols. We want TypeStream to outlive its runtimes. TypeStream is about expressing data pipelines in a simple way regardless of the actual runtime that runs them
  - [Sarah Catanzaro on X](https://twitter.com/sarahcat21/status/1719025058734379196) why this is great in TypeStream case: there’s no new concepts on the surface. Pipeline you know, types are what you expect
  - Sometimes abstractions that put together known, proven ideas together are misunderstood
    - see [React, a JavaScript library for building user interfaces | Hacker News](https://news.ycombinator.com/item?id=5789055&ck_subscriber_id=1931003009)
    - [Kelsey Hightower on X](https://twitter.com/kelseyhightower/status/1724116005151216077) and TypeStream to data