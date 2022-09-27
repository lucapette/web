---
title: "Getting Started With Kafka Streams"
description: "A primer to help you write your first Kafka Streams application"
date: "2022-09-27T00:00:00Z"
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

If you're like me, you're probably asking your self "how does this work??".
Don't worry about it, I wrote a [whole section](#how-does-it-work) about it.

Now that we know what Kafka Streams is, it's time to find out what can it do.

## What can you do with it?

Simple you can do with consumers, "problems" start with state so kafka streams
comes in.

## How does it work?

## How do I ship it to production?

## Where do I go from here?
