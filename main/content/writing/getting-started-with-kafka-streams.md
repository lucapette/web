---
title: "Getting Started With Kafka Streams"
description: "A primer to help you write your first Kafka Streams application"
date: "2022-09-29T00:00:00Z"
tags:
  - kafka
  - kafka streams
  - kotlin
keywords: kafka, kafka streams, kotlin
draft: true
---

{{< message class="is-info">}} This article assumes the reader has a good grasp
of Kafka basic concepts: topics, consumers, consumer groups, offset management.

It's also a long read. You will find a table of contents right after the
introduction.{{</ message >}}

Ever since I started working with Kafka Streams I have been noticing an
interesting, somewhat polarising phenomenon around it. The developers I talk to
about Kafka Streams fall in two extreme categories.

They're either experts and really get the power of this technology, its
beautiful design, and its powerful ideas. Or they're intrigued by the praises
but they never managed get into it so their understanding of the basics of Kafka
Streams is not sufficient.

By talking with many people in the second group, I collected a number of
questions I'm hoping to answer with this article but, before we dive into it, a
quick note about [Kotlin](https://kotlinlang.org/).

While I personally enjoy working with Kotlin, I'm not trying to make some point
about it by using it here. There's nothing special about it in the context of
Kafka Streams applications.

The main reason I chose it for this article is that it's syntax is much terser
than Java so the few snippets I'll share may even look like pseudo-code.

Having said that, let's dive into the wonderful world of Kafka Streams
applications together, shall we?

- [What is it?](#what-is-it)
- [What can you do with it?](#what-can-you-do-with-it)
  - [The need for state](#the-need-for-state)
- [How does it work?](#how-does-it-work)
  - [Topologies and nodes](#topologies-and-nodes)
  - [Tasks and Threads](#tasks-and-threads)
- [Where do I go from here?](#where-do-i-go-from-here)

## What is it?

The starting point of this conversation should be pretty straight-forward but
it's not. There's some confusion around what exactly Kafka Streams is.

Most resources, for a reason I ignore, call Kafka Streams a DSL (domain specific
language) but that's not only inaccurate but also a little misleading.

Kafka Streams is a Java library (Scala is also officially supported) for writing
streaming applications.

Yes, it's that simple. Kafka Streams is _just_ a Java library.

Beware I'm not trying to undermine the effort that went into building it. It's a
remarkable piece of technology. I'm its biggest fan for the longest time.

I mean that _just_ as very high praise. I value simplicity and Kafka Streams
gives its users the simplest programming model. You write your app, you run it.
Just like any other app.

It's worth underlining because most of the tooling out there with similar
capabilities have a very different programming model. Generally, you have to
write an app and "give it" to a system to run.

When I first defined Kafka Streams I was deliberately vague about the second
part of the sentence. Meaning that "for streaming applications".

I often see resources jumping directly to use-cases and what you can actually do
with this library. I get it but it doesn't give you a _feel_ for its API. That's
a pity because Kafka Streams API is wonderfully familiar.

The basic idea of the core API is that it gives you the same methods you're
already used to use for manipulating collections. Most high-level programming
languages nowadays have methods to `map` collections, `filter` them, `groupBy`
them, and so on.

What Kafka Streams does is to take these familiar concepts and apply them to
stream processing. It just works! And this means you can express non-trivial
computations with a few lines of code.

If you're like me, you're probably asking your self "how does this work?". Don't
worry about it, I wrote a [whole section](#how-does-it-work) about it.

Now that we know what Kafka Streams is, it's time to find out what it can do.

## What can you do with it?

Before showing any sample code, I'd like to dig a little into the why Kafka
Streams exists in the first place. It's hard to make its core ideas "click"
without a bit of context.

The main goal of Kafka Streams is to simplify the development and the operation
of streaming applications so the question is what's the deal with streaming
applications?

The most prominent concepts are:

- `Time` - You're dealing with "data in movement". As in the opposite of "data
  at rest" which is what you deal with when working with data in a traditional
  relational database.
- `State` - Since data is always moving, some common computation you want to do
  with it needs to deal with state. For example: if you want to count how many
  events have some specific property, you need to store data about past events.

Things get really interesting when you need to compute data on more than one
topic at the same time (meaning you're combining both time and state). We will
also look at that.

Kafka Streams provides elegant APIs to help you write performant and reliable
streaming applications that deal with most real-world scenarios.

Often enough though, the computation we need to do on some stream is simple
enough you don't need to deal with time nor state. For example, if you need to
filter out some events you do not need to look at any past event. It's _per
record_ computation.

In these situations, the official client libraries would do it. After all, the
consumer group API is powerful and it allows you to write production-grade
applications.

A fair warning before we dig into some code samples: I wouldn't read too much
into the design of these streaming apps. The examples are deliberately trivial
and purposely designed to discuss Kafka Streams concepts.

In the section [how do I ship it to
production?](#how-do-i-ship-it-to-production), I'll be sharing a list of
pointers to make your applications production-ready.

Having said that, the code in this article is available here
[here](https://github.com/lucapette/getting-started-with-kafka-streams/).

Each snippet I will share is a self-contained example so it should be easy
enough to play around with it (the header comment should help).

The README contains some instructions to load the testing data I've been using
for this article into a local Kafka installation if you want to follow along.

Now, for the sake of the conversation, let's imagine we have a `tweets` topic
where each record is (surprise!) a tweet. Our job is to extract useful
information from tweets and send that information downstream via some other
topics.

Let's start with a trivial example that takes all the incoming tweets and shouts
them:

```kotlin
# Ex1.kt

streamsBuilder
  .stream<String, String>("tweets")
  .mapValues { tweet -> tweet.uppercase() }
  .to("tweets.shouting")
```

For now, we'll ignored what's a streamsBuilder and focus on `stream`. This
method creates an instance of a `KStream` which is a core abstraction of Kafka
Streams.

A `KStream` is what Kafka Streams calls a "record stream". It's the natural way
we think about streams of data. Each incoming record is appended to the stream
therefore "flows" through the computation.

Since it's the first example, let me point out a few more general things.

First of all, it's worth noticing how little code it is compared to the consumer
group API. Kafka Streams is obviously abstracting away a lot of details.

Because the abstraction is so comfortable, I often find myself defaulting to
Kafka Streams even when it isn't strictly necessary. My strategy has become
"Always use Kafka Streams unless there are very stringent requirements" because
of how much more productive it is than the "vanilla" consumer group API. More
about this in the [production](#how-do-i-ship-it-to-production) section.

Since the API is so familiar and concise, it's easy to reason about what's
happening here. There's no polling, no offset management, no loops.

It reads like "we're reading from a tweets stream, we're uppercasing each tweet,
and finally send the result to a shouting tweets topic". Almost plain English.

This is the core idea of Kafka Streams: it abstracts away from you enough that
you can focus on your streaming computations. The more complicated examples, the
more evident how much more productive using Kafka Streams can be.

Now say that, for reasons, you need to filter out all the tweets with mentions
before shouting them. How would that look like?

We'll use the official Java
[twitter-text](https://github.com/twitter/twitter-text) library to parse tweets.
Here's the code:

```kotlin
# Ex2.kt

val extractor = Extractor()

streamsBuilder
  .stream<String, String>("tweets")
  .filter { _, v -> extractor.extractMentionedScreennames(v).isEmpty() }
  .mapValues { tweet -> tweet.uppercase() }
  .to("tweets.no-mentions.shouting")
```

It only took one (two if you count the val declaration) line of code to
implement this requirement. The code still reads like plain English. This
library feels nice.

If you're new to Kafka Streams, you may be thinking "OK this is all nice but is
it really worth the trouble? I can do this with the official clients and it
would only look a little more verbose" though.

You'd be right. If we'd stop here, Kafka Streams would feel like a nice-to-have.
So let's introduce some use cases where we can't get away with simple
"per-record" computations.

### The need for state

Say we need to keep track of which topics are more discussed by people because
we want to display a "The most discussed topics" list.

For the sake of our conversation, we'll only consider tweets with hashtags and
also assume each hashtag is a different topic.

Before we discuss how a Kafka Streams application that solves this problem,
let's take a moment to think about how would we approach this requirement if we
were to solve it without Kafka Streams.

We can meet the requirement with a group and count operation:

1. Only consider tweets with hashtags
2. Extract a list hashtags from a tweet
3. For each hashtag increase a counter
4. Output the updated value for each tuple hashtag, counter

`1.` and `2.` seem pretty straightforward. We can the official twitter to
extract hashtags. Maintaining a counter for each hashtag also seems pretty easy.
For example, we can do something like this:

```kotlin
val tweets = listOf(
        "incoming tweet #example #kafka",
        "another tweet with an #example hashtag",
        "#kafka is amazing",
    )
    val extractor = Extractor()

    val countByHashtag = mutableMapOf<String, Long>()

    tweets.flatMap { tweet ->
        extractor.extractHashtags(tweet)
    }.forEach { hashtag -> countByHashtag[hashtag] = countByHashtag.getOrDefault(hashtag, 0) + 1 }

    println(countByHashtag)
```

The core idea is that we maintain a map of the counts of the hashtags we have seen so far
(the variable `countByHashtag`). Every time we see an hashtag, we increment its counter.

Very easy, right?

Well, not if we're doing this in the context of a streaming application. The
problem is that we're maintaining state in memory and that isn't a viable
solution for all kind of reasons.

The most obvious problem is restarts. If our application goes down for whatever
reason, we lose track of all the tweets we have seen so far.

I can think of three ways of solving this problem:

1. You ignore the problem.

This may work in some situations depending on the nature of the data and the
exact requirements you need to meet.

2. You start over every time.

You re-process all the tweets you have already seen so your `countByHashtag` is
up-to-date.

This only works with very small dataset with is not so common in streaming.

It's not a "future-proof" solution given restart times will grow linearly with
the size of the tweets topics.

3. You use a persistent database.

You back your `countByHashtag` variable with a persistent database so it can
resume work on restarts.

This is the most desirable solution and, life being life, it's also the most
challenging of the three.

There are some pretty challenging questions you need an answer for:

- Which database is a good fit for this problem?
- What's a good strategy to store which offsets of which partitions have been
  already consumed? (otherwise we can't resume on restart)
- When the application restarts, how does the restoration process look like? How
  fast is it?
- What are we supposed to do when the database is unavailable?

I've seen lots of "solutions" for this problem, especially before Kafka Streams
went public. I think you can guess why I used quotes :)

It's interesting to see how a relatively simple problem became tricky as soon as
we needed to deal with state.

To be fair, this is pretty pervasive problem in our industry which somewhat
justifies the "X-less" trend of the past decade. That's a story for another
article thought.

If you spend a minute pondering these questions, one interesting but
odd-sounding thought may cross your mind.

The challenge here is that we want to maintain state into a different database.
But Kafka is also a database... isn't it?

It does things its way but it can _definitely_ store things. So what happens if
we use Kafka to keep track of things?

Kafka Streams _is_ the answer to this question. That's the selling point: if you
use Kafka Streams, you won't have to deal with any of these questions. Kafka
Streams will elegantly and transparently take care of all of it for you.

But wait, there's more. It's the best part too. The code looks like this:

```kotlin
streamsBuilder.stream<String, String>("tweets")
  .flatMapValues { tweet -> extractor.extractHashtags(tweet) }
  .groupBy { _, hashtag -> hashtag }
  .count().toStream()
  .to("tweets.trends.by-topic")
```

All these questions we asked ourselves have been answered in the most elegant
way. They're all transparently handled by Kafka Streams.

This application correctly and automatically resumes on restarts. It can scale
horizontally by adding more instances of the same app (you'll find an "appId" in
the code samples).

The API still feels pretty familiar and still has that English-like feel to it.
It's a pretty remarkable library.

You can focus on designing your computations and let Kafka Streams deal with the
details.

There's is one more basic (in the true sense of the word) streaming thing that
Kafka Streams can do we didn't discuss yet.

I purposely omitted scenarios that involve more than one topic because I wanted
to keep the focus on stateless vs stateful computation.

While time is somewhat always present when discussing streaming applications
(due the nature of the paradigm itself), things get much more interesting when
our computations involve multiple streams.

Joining two datasets is a common operation in relational databases but that
familiarity may not be so helpful when we try to translate the concept to
streaming.

A one-to-one translation is not possible because, in streaming, we mostly deal
with unbound datasets (data is "in motion" after all).

That means a join operation needs to deal with the concept of window. The idea
being you join datasets on a condition (like the on clause of a SQL join) over a
specific time-frame (since the data in unbounded).

Windowed joins are complex enough though I won't discuss them here as a good
introduction to them would take as much as the rest of the article making the
"getting started" idea behind this article a lot less meaningful.

But we'll look at a simpler un-windowed join because it gives us the opportunity
to get a feel for how joining looks like and to point out a few other important
details.

For the sake of this discussion, say we need to show, somewhere in our UI, a
"current standing" of "hot topics" that looks like this:

| Hashtag   | Description                  | Tweet count |
| --------- | ---------------------------- | ----------- |
| Kafka     | The best database out there! | 2           |
| Book      | Reading improves your life   | 2           |
| Severance | Sci-fi at its best           | 1           |

We have the "hashtag" and the "tweet count" data. We'll introduce a new topic
called `hashtags` for the descriptions so that we can join the data.

Here's how the code looks like:

```kotlin
val descriptions = streamsBuilder.table<String, String>("hashtags")

val hashtagsCount = streamsBuilder.stream<String, String>("tweets")
  .flatMapValues { tweet -> extractor.extractHashtags(tweet) }
  .groupBy { _, hashtag -> hashtag }
  .count()

hashtagsCount.join(descriptions) { count, description ->
  "$description - $count"
}.toStream().to("tweets.trends.by-topic-description")
```

As in the previous examples, the Kafka Streams API almost feels like plain
English. But there are a couple of details worth discussing.

First of all, there's a `table` method which creates an instance of `KTable`.

A `KTable` is a powerful abstraction Kafka Streams calls a changelog stream.

While record streams (what `KStream` abstract) always append new records to
their dataset, changelog streams only do so if the record isn't present in the
dataset (it uses the record key to check presence).

When a record already exists, its value is updated with the most recent version.

This abstraction is really powerful and useful and you'll be using `KTable` all
the times once you start writing your own Kafka Streams application.

`KTable` is perfect for our use case because we want to join each hashtag with
their up-to-date description.

The rest of the code is familiar to us because we're reusing the computation
from the previous example. The only difference is that, before streaming out
results, we're now joining our group and count (which is also a `KTable`!) with
our description `KTable`.

It's also worth noticing that mapping the join results to a String for the sake
of simplicity. It's a way to defer discussing serialization to the last section
of this article and keep ourselves focused.

Last but not least, Kafka Streams, once again, takes care of managing state and
time for us.

Think for a minute about how many things you'd need to take care of if you
didn't have a join API. It's a cool mental exercise that helps understand how
valuable Kafka Streams really is.

These few I presented in this section merely scratch the surface of what Kafka
Streams can actually do. I tried my best to keep it short (and obviously failed
at that) so I'll provide some pointers on [where to go from
here](#where-do-i-go-from-here).

## How does it work?

So far I put a conscious effort into avoiding some "official" and "formal" terms
that are everywhere in the official docs and other online resources.

These terms are important but, in my opinion, they're too specific for a first
introduction to what you can do with Kafka Streams.

Now that we've gone over that, we're ready to dig a little deeper into Kafka
Streams vocabulary.

### Topologies and nodes

What's a better excuse than looking under the hood and see how Kafka Streams
does things?

When you write a Kafka Streams application, there are a few required steps to
put it together. The skeleton of the code looks like this:

```kotlin
val streamsBuilder = StreamsBuilder()

// your stream processing goes here

val topology = streamsBuilder.build()

val kafkaStreams = KafkaStreams(topology, streamsConfig)

kafkaStreams.start()
```

Let's go over these steps in detail:

- You create an instance of `StreamsBuilder`
- You create and connect stream processing **nodes** by calling a fluent API.
  Not shown here to keep the example light.
- You build a **topology** by calling `streamsBuilder.build()`
- You create a `KafkaStreams`
- You call `streams.start()` to run your application.

Unsurprisingly the examples we've already seen follow these steps but now we've
just introduced two new terms: topology and node.

Instead of coming up with my own definition, let me share the official
definition from the official [Java
Docs](https://kafka.apache.org/33/javadoc/org/apache/kafka/streams/Topology.html):

> A topology is an acyclic graph of sources, processors, and sinks. A source is
> a node in the graph that consumes one or more Kafka topics and forwards them
> to its successor nodes. A processor is a node in the graph that receives input
> records from upstream nodes, processes the records, and optionally forwarding
> new records to one or all of its downstream nodes. Finally, a sink is a node
> in the graph that receives records from upstream nodes and writes them to a
> Kafka topic.

What the official docs are telling us is that when we create a Kafka Streams
application we're building a topology.

A bunch of streaming nodes we connect together (via fluent API calls) _is_ our
streaming computation.

With these definitions in mind, we're ready to zoom in a little more.

### Tasks and Threads

When you start a Kafka Streams application, the library does a lot of
"administrative" work for you.

Things like checking all input topics are there, checking they're correctly
co-partitioned.

It creates internal topics if needed, and starts a bunch of "admin" threads to
handle state stores (more on this later), stand-by replicas, and so on.

Once the "admin" stuff is done, Kafka Streams starts processing incoming
records.

In order to achieve high-performance, the library breaks down the topology in
tasks (`StreamTask`) using the number of input topics partitions (remember
topics don't really exist, it's all about partitions).

The number of tasks is fixed and the assignment of partitions to tasks never
changes. That simplifies the programming model since no coordination is needed
to work on these tasks.

The actual work is done by `StreamThread`. Each thread is responsible for a
number of tasks. The number of threads can be configured and the upper limit
(not enforced by the library) is the number of tasks.

This makes sense because you can't be doing more parallelism than the number of
input partitions you have.

When started each StreamThread goes into a two-phase loop:

- First it does a familiar "poll phase". It consumes a number of records from input
  partitions and queues them for processing.
- Then it does the actual processing.

This last step is where the abstraction ties everything together. If you look at
the source of Kafka Streams, you'll see that each node implements a `process`
method.

That means Kafka Streams uses the definition of the topology to correct route
"new records to process" to the right node and call the right processing method.

## Where do I go from here?

Kafka Streams is very well designed but because it solves a pretty complex
problem the amount of new concepts you run into when you first approach the
official docs can feel pretty overwhelming.

So I wrote this article with the precise goal of extracting the most basic
concepts out of Kafka Streams so that newcomers could get a sense of how much
the library can do for them.

I can't say if I succeeded or not (but you can and your feedback would be highly
appreciated) but I know I left very relevant things out of the conversation.

All the examples I provided are "real" Kafka Streams application, meaning that
you can download the source code, run a local Kafka cluster, and run them.

But there's of course quite a gap between these applications and a "real world"
production-grade application.

The first thing that comes to mind is that we only worked with strings. In
reality, you're more likely to run into more complex data structures and need to
learn about
[Serdes](https://kafka.apache.org/33/documentation/streams/developer-guide/datatypes.html).

In our last example I showcased a very specific type of join called `KTable` to
`KTable` join. There's much more to joining streams and the [official
docs](https://kafka.apache.org/33/documentation/streams/developer-guide/dsl-api.html#joining)
have a detailed explanation of join semantics.

I also only briefly mentioned
[windowing](https://kafka.apache.org/33/documentation/streams/developer-guide/dsl-api.html#windowing).
It's a complex and fascinating topic which, as I already said, would need its
own "getting started" article (nudge me about this, please!).

When we talked about state, we didn't discuss where Kafka Streams stores this
information. The place is called [local
store](https://kafka.apache.org/33/documentation/streams/architecture.html#streams_architecture_state).

Kafka Streams exposes an API to access these local stores. You can expose this local store via [interactive queries](https://kafka.apache.org/33/documentation/streams/developer-guide/interactive-queries.html).

I wrote about how to write [HTTP endpoints with Kafka Streams Interactive
Queries]({{< ref
"/writing/http-endpoints-with-kafka-streams-interactive-queries" >}}. It's an
exciting feature that unlocks interesting use-cases.

All the examples I shared in this article are "real", meaning you can download the [source code](https://github.com/lucapette/getting-started-with-kafka-streams/), start a Kafka cluster, and play around with the example.

It's working code but it's far from being production grade.

While "production-grade Kafka Streams application" is its own article, I think I
can at least provide a bit of information here that may take a while for you to
come across otherwise.

The easiest way to improve our examples would be to
[name](https://kafka.apache.org/33/documentation/streams/developer-guide/dsl-topology-naming.html)
all the nodes of your topology.

If you don't name them, Kafka Streams will generate the names itself and while
they're somewhat helpful, the names are not exactly human readable.

This is very important as your topologies grow, especially during debugging
sessions.

Kafka Streams application can scale horizontally pretty nicely. We got a glimpse
of that when we discussed [tasks and threads](#tasks-and-threads).

You can start more threads on your Kafka Streams application but you can also
start [more
instances](https://kafka.apache.org/33/documentation/streams/developer-guide/running-app.html).

When I saw down the first time to write this article, my goal was to make it as
short as possible. Over the few writing sessions I needed to write what you just
read, it became increasingly clear the article wouldn't be so short.

After all, the topic is so vast there are whole books about Kafka Streams (my
personal recommendation is [Kafka Streams in
action](https://www.manning.com/books/kafka-streams-in-action)).

In fact, there's much more about it that what I covered. I would probably start
from reading the whole [developer
guide](https://kafka.apache.org/33/documentation/streams/developer-guide/).
Hopefully things will be easier to understand because of the article you just
read!
