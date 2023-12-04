---
title: "They are called streaming data \"pipe\"lines... right?"
description: A brief history of TypeStream
date: 2023-11-27T14:32:28+01:00
draft: true
---

The (long but what's new) article you're reading is the tale of how an intuition
I had almost a decade ago developed into the three foundational ideas that make
TypeStream. That is an open-source streaming platform (debatable naming, more on
this at the end of the article) that allows you to write and run typed data
pipelines in a familiar, UNIX-like syntax.

In general I prefer articles with independent sections so I tried my best to
separated them here as well but it makes the most sense to read the article in
the presented order (as the ideas presented are connected that way) the first
time you're around:

- [The first intuition](#the-first-intuition)
- [Data pipelines are UNIX pipelines](#data-pipelines-are-unix-pipelines)
- [A virtual filesystem](#a-virtual-filesystem)
- [It is called TypeStream for a reason](#it-is-called-typestream-for-a-reason)
- [The power of abstraction](#the-power-of-abstraction)
  - [Abstractions outlive implementations](#abstractions-outlive-implementations)
  - [I don't want to bash SQL but](#i-dont-want-to-bash-sql-but)

As you can see, lots of talk about so let me dive straight into it.

## The first intuition

Almost a decade ago, I was the CTO at a small and very cool startup called
Marley Spoon, the best (I'm not biased here, it's just true :)) meal kit
delivery kit service out there.

One day, this must have been late spring of 2016, I was in a meeting with the
engineering and product leadership. We were discussing how to leverage Kafka so
that our teams, with their very different needs and pace, could move more
independently.

We had a web store and some batch jobs "producing" orders and a variety of
services "consuming" orders and implement a variety of use-cases. Kafka acted as
a transport layer and a "api" between the two worlds via a primitive change data
capture pipeline. I'm sure this architecture is familiar to many of you,
especially now that change data capture is widely known. Back then, it was a bit
more novel (I think we had to rely on a postgres extension to get it done maybe
[debezium](https://debezium.io) wasn't around yet?).

The way we intended to consume orders intrigued me. I remember trying to explain
how I would go about it and failing pretty spectacularly: the rest of the team
looked at me lost. The core intuition I had that day never left me: we were
having a conversation at a certain level of abstraction but our tooling was
several levels away from it, it felt clumsy and inefficient to me. Let me
explain.

Our web store and our batch jobs produced orders which we streamed "raw" to
Kafka with a rudimental (by todays standards) change data capture pipeline.
Almost no consumer needed "raw orders", most needed either a subset of orders
(things like "orders to ship", "orders to pack in NL") or parts of each "raw
order" (things like "customer's emails of orders to ship", "list of ingredients
of orders to pack in NL").

While we were looking at the diagrams on a whiteboard I couldn't help but think
that most of our data pipelines were highly composable little functions. You
would combine them by calling each function on the result of the previous one.
Now a more mathematically inclined mind would explore this concept further but
I'm a programmer so I saw a different, dare to say, more obvious metaphor at
play. These little functions you can call one after the other looked a lot like
UNIX pipelines. Each function type is a UNIX command that does one thing and
calling them in sequence is just a command pipe.

## Data pipelines are UNIX pipelines

You get orders to ship like this:

```sh
let orders_to_ship=$(cat orders | grep [.state == 'to_ship'])
```

Then you get emails like this:

```sh
cat $orders_to_ship | cut .email
```

After the meeting, I felt confused about this idea. For the first time in my
career, I wanted to build something that I found both really obvious to
conceptualize and hard to build. A strange combination.

Back then I didn't even try building a prototype for this. The idea felt
conceptually feasible but pretty far in practice. I had no conception of writing
my own programming language and the Kafka ecosystem wasn't what it is today.
Remember that this was spring of 2016 so working with Kafka felt very low level
compared to, say, working with Postgres.

Nowadays, the experience got much better. Thanks to amazing technology like
[Kafka Streams](https://kafka.apache.org/documentation/streams/),
[ksqlDB](https://ksqldb.io/), and [flink](https://flink.apapche.org), you can
reason about streaming data pipelines at a much higher level. The thing is
though that it's not high-level enough 🙃

Now, before I go deeper into explaining why TypeStream is a thing and why I
think that it should be a bigger thing, allow me a short personal detour.

I find discussing these ideas in public quite overwhelming. There's a part of me
that constantly nudges me with:

- This gotta be a bad idea if no one else sees it _your_ way.
- It's probably too hard to get these idea into practice _for you_.

Maybe you'll call it impostor syndrome, maybe not. It doesn't matter. I'm not
sharing this so we can fight my doubts together. It's because I need to clarify
that, while my arguments may not come across as strong as they could because of
the above self-doubts, I _genuinely_ don't understand why approaching data
pipelines the way I'm thinking about them (aka the UNIX way) isn't more common.
Hell, I'd go as far as saying this should be the _default_ way. After all,
there's the word "pipe" in "data pipelines", isn't there? This abstraction feels
so good I feel weird "stealing" it for TypeStream.

All right, done with that. Where were we? Yes, I was saying that the Kafka
community made great progress. We made big abstraction jumps, so to speak, from
"here is the consumer group api javadoc, go" to Kafka Streams, ksqlDB, flink (to
name a few). And, yes, I was also saying that it's not high level enough.

What is high level enough then? Well, UNIX pipelines are almost English. That is
high level enough for me.

At some point last year, I decided I had to look at Kotlin more closely. There's
no direct connection between Kotlin and TypeStream. The story is that I can't
learn a new programming language through fictional exercises. I need something
complex enough I can go at it for a few weeks in a row. The project "write a
bash-like pipe to Kafka Streams applications compiler" felt rightly sized.

The first few weeks were really fun. I got to put in practice a big chunk of the
"Crafting interpreters", a magnificent book that gets you started on writing a
programming language and not on talking about writing one.

By the time I could compile simple pipelines with a handful of "data
operators"/commands I had spent quite some time thinking about TypeStream.
That's why you may hear me say "I stumbled upon TypeStream". One out of three
foundational ideas was within me for a long time, the other two were part of the
discovery process of understanding the problem space better while building a
solution for it.

## A virtual filesystem

Because I'm a pretty sceptical person that likes to sabotage their own plans
(I'm fun like that), while prototyping TypeStream I found myself in a strange
two-step self-feeding feedback loop:

1. I ask something along the lines of "well if TypeStream were a good idea, then
you could X but sure you can't, right?"
1. I constantly find solid answers via the "UNIX metaphor". Immediately go back
   to 1.

This is were the second foundational ideas behind TypeStream comes in place.
See, when I had the intuition of expressing "filter book by word count > 20k" as
a UNIX pipe, I didn't put go any further than imagining this:

```sh
cat /dev/kafka/cluster1/topics/books | grep [.word_count > 20_000]
```

By the time I had a working compiler and was ready to run my pipelines, I
realized there's a second powerful idea hiding in play sight here: a virtual
filesystem. In UNIX, everything is a file. In TypeStream, everything is a data
stream. The core of the metaphor doesn't work without a filesystem.

Addressing data sources as filesystem paths felt really so natural I didn't
immediately realize its profound implications.

For example, how would you expect to address a postgres table? Does
`/dev/postgres/db1/tables/customers` look reasonable? I think it does. When I
pitch TypeStream to backend developers or data engineers, this is completely
obvious for them. There are no questions about the general idea of how a "data
mesh filesystem" should look like.

What's maybe a little harder to see is how well the virtual filesystem pairs
with typical data operations and what makes this obvious idea more profound than
its looks. For example, you may want to expose data via a websocket this way:

```sh
cat /dev/kafka/cluster1/topics/books | grep The | cut .id .title > /media/websocket/server1/books_notifications
```

"mounting" external "media" works great, right? Think of
`/media/elastic/cluster1/index_01` or `/media/http/server1/endpoint`. Why not?
It looks so natural.

Things get really interesting when I put those two foundational ideas together
and imagine how TypeStream would deal with something scenarios I've seen a lot.
For example: stream data out of a relational database, apply some business
filtering to it, send the data to around to a number of places. Let's make it
concrete via a common, trivial, real-world application: sign-up flow processes.

Here's how I'd imagine TypeStream taking care of capturing new users out of a
postgres database, publish them to some Kafka topic for later consumption, and
send a welcome email to new users via a transactional email service:

```sh
let new_users = $(cat /dev/postgres/tables/users | grep [.op == 'insert'])

cat $new_users > /dev/kafka/topics/users.new
cat $new_users | cut .id .email > /media/email/welcome
```

It's surprisingly succinct. But it's not brevity that interests me the most. To
me, the real deal is that it feels like this is the closer you can get to plain
English that is still machine code. After all, you want clarity over brevity.
This example is very succinct but lost almost none of the clarity of the English
description.

There's already tech out there covering the gap between TypeStream and English.
GitHub Copilot, for example, produces valid TypeStream pipelines from plain
English comments very often! A testament to the simplicity and validity of the
core ideas behind TypeStream. After all, I invented nothing and I take no credit
here. UNIX pipes were there long before I was born.

## It is called TypeStream for a reason

At this point, if you may be wondering what's the secret ingredient here? How
does TypeStream take care of things like `cat $new_users | cut .id .email`?

This is where the third foundational idea comes in. It may seem less relevant to
the conversation because it's the only idea in TypeStream that doesn't directly
borrow (I mean steal) from UNIX. On the other hand though, it's so important to
the experience it gave TypeStream its name.

TypeStream can type-check pipelines before you run them. It has a key-value
store where keys are filesystem paths (say `/dev/kafka/cluster1/topics/books`)
and values are serialization format independent schema types (say `Struct[title:
String, wordCount: Int]`).

So if you're trying to run the following pipeline:

```sh
cat /dev/kafka/cluster1/topics/books | grep [.name ~= "the"]
```

the compiler gives you an error like "hey there's no name field on books" and
spare you the pain to find out later.

There's a notable omission in TypeStream pipelines. There's no mention of
serialization formats anywhere. Is this books topic avro, protobuf, json schema?
The question feels like irrelevant to designing a data pipeline. If you know the
shape of the data you're working with, its serialization format is indeed
irrelevant for you. That's one of the main reasons why I say that the available
solutions aren't high level enough.

There's a little more to types. One day, while working on the first version of
the type checker, I realized I had enough metadata information to make
TypeStream a little clever and do some type inference on data pipelines.

Since the compiler knows the schema type of each "path" and knows the effect of
each data operator on a schema type, it can infer the resulting schema types of
each pipeline. Let me make this more concrete with some examples.

```sh
cat /dev/kafka/cluster1/topics/books | cut .id .title > /media/http/server1/endpoint
```

TypeStream can infer that the resulting schema type is something like
`Struct[id: String, title: String]` and produce reasonable JSON for the "HTTP
media". You don't need to specify the shape of the resulting data set,
TypeStream can figure it out on its own. It also works with more complex
pipelines. Take a "typical" enrichment pipeline like:

```js
cat /dev/kafka/cluster1/topics/page_views                  |
enrich {p -> http "https://api.country.is" | cut .country} |
wc --by .country
```

Here, the compiler calculates the resulting type by "merging" the same of page
views with "something with a country field" that the enrichment block produces
which can then use for typechecking `--by .country`. If we'd be redirecting this
pipeline to, say, a redis store, TypeStream would use the resulting schema type
to make an informed decision on which which data structure to create inside the
redis store. It's all about developer experience: TypeStream abstracts so many
irrelevant details away by leveraging "ancient" programming ideas like UNIX
pipelines and filesystem paths.

## The power of abstraction

When I started outlining this article, the draft title was "the power of
abstraction". I thought I'd approach TypeStreams background by the perspective
of how abstraction is the most powerful tool in the hands of programmers.

But writing took me through a different path and I realised it would be easier
to conclude the article spending a few words on powerful abstractions TypeStream
enables that are not obvious in the context of the previous discussion.

### Abstractions outlive implementations

A [tweet](https://twitter.com/gunnarmorling/status/1716878504044998914) by
[Gunnar Morling](https://morling.dev):

> An interesting recurring theme in data infra: protocols/APIs outliving
> specific implementations. E.g. #Kafka wire protocol (#RedPanda, #WarpStream as
> alternative providers), S3 API (#MinIO, #Ceph, etc.), #Postgres protocol (too
> many to list even).

applies perfectly well to TypeStream but I believe it's not obvious unless we
consider the implication of its technical implementation. At its very core,
TypeStream is a "remote compiler": you give it some bash-like code and the
compiler will transform it into a Kafka Streams application and run it for you.

The key is that TypeStream could compile pipelines into flink jobs, pulsar
applications, google pub/sub pipelines, whatever. TypeStream can outlive its
runtime exactly because it's thought and built as a programming language Kafka
Streams is _just_ a runtime. Right now it's also the only runtime but adding
more runtimes is feasible (interested? Reach out to me! I have some private
notes for google pub/sub already).

### I don't want to bash SQL but

As Sarah Catanzaro once said: [abstractions
matter](https://twitter.com/sarahcat21/status/1719025058734379196). And I think
the point of her tweet is that they greatly contribute to the building
experience.

This is why, despite not being a fan of the bash-like programming languages, I
still went for it with TypeStream. You know UNIX pipelines, you know most of
TypeStream. There's no new abstraction for you. Pipes and redirections apply to
data naturally. Files are data. Streams are data.

There's also a bolder claim hidden in this and I think I must make it explicit.
I'm also saying that UNIX pipelines are a _better_ abstraction for data
pipelines than SQL like languages are. The keyword is _pipe_ of course. To be
 clear, I **love** SQL. There's nothing better in the scenario "I got this data
 question, give me the answer?". I apply this principle to code too. Meaning,
 no-orm for me please. So I'm not trying to bash SQL here, as I said pretty
 early in this article, I'm _genuinely_ convinced data pipelines are _just_ a
 generalisation of UNIX pipelines. That's the "humble" long-term vision behind
 TypeStream.
