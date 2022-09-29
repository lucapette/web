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
{{</ message >}}

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
- [How does it work?](#how-does-it-work)
- [How do I ship it to production?](#how-do-i-ship-it-to-production)
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
  events have some specific property, you need to store (therefore maintain some
  state) data about past events.

Of course things get really interesting when you need to compute data on more than one topic at the same time (meaning you're combining both time and state).

Kafka Streams provides elegant APIs to help you write performant and reliable
streaming applications that deal with most real-world scenarios.

Often enough though, the computation we need to do on some stream is simple
enough you don't need to deal with time nor state. For example, if you need to
filter out some events you do not need to look at any past event. It's _per
record_ computation.

In these situations, the official client libraries would do it. After all, the
consumer group API is powerful and it allows you to write production-grade
applications.

Now, for the sake of the conversation, let's imagine we have a `tweets` topic
where each record is (surprise!) a tweet. Our job is to extract useful
information from tweets and send that information downstream via some other
topics.

A fair warning before we dig into some code samples: I wouldn't read too much
into the design of this streaming apps. The examples are deliberately trivial
and purposely designed to discuss Kafka Streams concepts.

Having said that, the code in this article is available here
[here](https://github.com/lucapette/getting-started-with-kafka-streams/).

Each snippet I will share is a self-contained example so it should be easy
enough to play around with it (the header comment should help).

The README contains some instructions to load the testing data I've been using
for this article into a local Kafka installation if you want to follow along.

Let's start with a trivial example that makes all the incoming tweet shout:

```kotlin {linenos=table}
# Ex1.kt
val streamsBuilder = StreamsBuilder()

streamsBuilder
  .stream<String, String>("tweets")
  .mapValues { tweet -> tweet.uppercase() }
  .to("tweets.shouting")

val kafkaStreams = KafkaStreams(streamsBuilder.build(), streamsConfig("ex1"))

kafkaStreams.start()
```

Since it's the first example, let me point out a few things.

First of all, it's worth noticing how little code it is compared to the consumer
group API. Kafka Streams is obviously abstracting away a lot of details and, by
doing that, taking some decisions for you.

Because of this, I often found myself defaulting to Kafka Streams even when it
isn't strictly necessary. My strategy has become "Always use Kafka Streams
unless there are very stringent requirements" because of how much more
productive it is than the "vanilla" consumer group API. More about this in the
[production](#how-do-i-ship-it-to-production) section.

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
Here's how the code looks like:

```kotlin
# Ex2.kt

streamsBuilder
  .stream<String, String>("tweets")
  .filter { _, v -> extractor.extractMentionedScreennames(v).isEmpty() }
  .mapValues { tweet -> tweet.uppercase() }
  .to("tweets.shouting")
```

## How does it work?

## How do I ship it to production?

## Where do I go from here?
