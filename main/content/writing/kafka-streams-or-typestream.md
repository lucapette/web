---
title: "Kafka Streams or TypeStream?"
description: "A comparative analysis in the context of event-driven architectures"
tags:
date: 2024-01-05T10:12:55+01:00
tags:
  - kafka
  - kafka streams
  - typestream
keywords: kafka, kafka streams, typestream
---

This article answers a question that comes up a lot when I'm talking about
[TypeStream](https://github.com/typestreamio/typestream):

> How does it compare to Kafka Streams?

It's more than a fair question; the functional overlap between the two
technologies is large. After all, Kafka Streams is TypeStream's default runtime.

To keep things as concrete as possible, I compare them in the context of an
event-driven microservices architecture because that's a common use case for
both.

- [Event-driven microservices](#event-driven-microservices)
- [Kafka Streams](#kafka-streams)
- [TypeStream](#typestream)
- [The developer experience](#the-developer-experience)
- [The deployment model](#the-deployment-model)
- [When to use what](#when-to-use-what)

## Event-driven microservices

I don't mean to be troll-ish but there's no other way of saying this: I think
the naming "event-driven microservices" is off and it has been forced into our
conversations by a larger trend (read cult) about microservices.

I prefer the term "streaming applications" because I like to call things what
they are and what they do but I will stick with "event-driven microservice"
because this naming has a wider reach and who doesn't want that?

All right, you now know I'm reluctantly saying "event-driven microservice" but
what do I mean anyway? What's an "event-driven microservice"?

It's a ~~small streaming application~~ microservice that does its job by
consuming and producing off an event broker. More often than not, the event
broker of choice is a Kafka cluster because the main characteristic of an
event-driven microservice architecture is that the events are durable and can be
consumed many times by many different services (as opposed as messages passed
around using a "traditional" queue). Kafka has that and is an obvious choice to
unlock the full potential of this approach.

Here's a trivial example diagram of this architecture:

![event-driven sample architecture diagram](/img/event-driven.svg)

From this point on, when I say event-driven microservice, I'm always talking
about a small application (see?) that consumes data from one or more Kafka
topics, does its thing, and (often) sends its result back to a Kafka Topic.

I'm ignoring how tricky it is to define what a "small" application is. I could
probably write a whole article about it (people wrote books about slightly, ehm,
larger topics) so it's out of scope here.

For the sake of the discussion, let's assume we have a `application.books` topic
where records look like this:

```json
{"id":1,"title":"Station Eleven","word_count":45000,"author_id":"743626be-8380-40e9-ab1b-44dfc398cde0"}
{"id":2,"title":"Sea of Tranquility","word_count":40000,"author_id":"743626be-8380-40e9-ab1b-44dfc398cde0"}
{"id":3,"title":"Purple Hibiscus","word_count":35000,"author_id":"da68bea8-4a8e-4f96-bc39-25b0b697d94b"}
```

Note that I'm using JSON for readability but, in a production system, I'd expect
Avro (or Protocol Buffers) to be the serialization format of choice (and would
also use UUID for ids).

Let's also imagine we need novels into a different topic so that other
microservices can solve novel specific problems.

Initially, the way we define novel is trivial (> 40K words) but we expect this
to change over time so an event-driven microservice that is responsible to
extract novels from the `application.books` topic into a `application.novels`
topic is a perfect fit.

Now that (hopefully) the context is clearer and we also have a trivial example
to work with, let's look at what Kafka Streams and TypeStream are and how they
can solve such a problem.

## Kafka Streams

In the words of the official docs:

> Kafka Streams is a client library for building applications and microservices,
> where the input and output data are stored in Kafka clusters. It combines the
> simplicity of writing and deploying standard Java and Scala applications on
> the client side with the benefits of Kafka's server-side cluster technology.

The Kafka Streams authors believe that the library is a good fit for our use
case. It goes without saying that I agree with them.

Kafka Streams is a fantastic library! It has a very usable API and covers a lot
of ground with its features. I wrote about it in [Getting started with Kafka
Streams]({{< ref "/writing/getting-started-with-kafka-streams" >}}) which,
believe me I feel weird saying this myself, is the best introduction to the
library if you know nothing about it.

Here's a Java program that solves this problem:

```java
final StreamsBuilder builder = new StreamsBuilder();

final Properties streamsConfiguration = new Properties();
streamsConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, "me.lucapette.novels");
streamsConfiguration.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
streamsConfiguration.put(AbstractKafkaSchemaSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, "http://localhost:8081");
streamsConfiguration.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
streamsConfiguration.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, SpecificAvroSerde.class);

final KStream<String, Book> source = builder.stream("application.books");

source.filter((key, book) -> book.getWordCount() > 40_000).to("application.novels");

final KafkaStreams streams = new KafkaStreams(builder.build(), streamsConfiguration);
streams.cleanUp();
streams.start();
```

Apart from the imports and some function definitions, this is pretty much all
the code we need for a production grade microservice that extracts novels from a
stream of books. Sweet. If you'd like to play around with this code, I have an
example repo on GitHub:
[lucapette/kafka-streams-example](https://github.com/lucapette/kafka-streams-vs-typestream).

## TypeStream

TypeStream is an open-source streaming platform that allows you to write and
run *typed* data pipelines with a minimal, familiar UNIX-like syntax. I wrote
about the fundamental ideas that drive the project in [they're called streaming
data "pipe"lines... right?]({{< ref
"/writing/they-are-called-streaming-data-pipelines-right" >}}).

TypeStream is a remote compiler: you send it some code and TypeStream will take
care of compiling it into a Kafka Streams application and then runs that
application for you.

Here's how filtering novels looks like in TypeStream:

```sh
cat /dev/kafka/cluster/topics/application.books |
grep [ .wordCount > 40000] > /dev/kafka/cluster/topics/application.novels
```

This looks very different of course and I think we're read to dive into a
comparison even with such a trivial example.

## The developer experience

The most obvious thing is that we're talking about two different programming
languages here so the developer experience *is* different.

Kafka Streams is a Java library so anything jvm works for you. That's not a
limiting choice if you like at least one jvm language, I've done Kafka Streams
with Java and Kotlin and the experience is very pleasant. JVM programming
languages are always a solid choice: great communities, great tooling. Of
course, if you're not familiar or willing to work with any of the jvm languages
then you're out of luck.

TypeStream, on the other hand, is almost bash. If you're familiar with UNIX
systems, you're already familiar with TypeStream. Now I think that's a great
selling point especially for beginners. You may know nothing about streaming and
still be able write an event-driven microservice with TypeStream. Bash may not
be the most solid language out there for large applications but:

- Everyone knows enough to write a small data pipeline with it.
- We're talking about microservices so we expect our applications to be small
  anyway.

The developer workflow is also different. With Kafka Streams, you're in a
traditional "backend workflow". You write your app, you write your tests, then
you package it and ship it. Nothing wrong with it. In fact, since it's JVM, the
tooling is pretty amazing (one of my fav examples: test containers).

In TypeStream, you have a REPL you can use to quickly verify your code. Once
you're ready, you run `typestream run <source-code>` and TypeStream will deploy
the microservice for you. More about the deployment model later. In general,
it's clear that TypeStream's workflow is more data oriented than application
oriented.

There's one more difference that it's not obvious but pretty profound. Let's
look at the "core" code in both tech one more time. The Kafka Streams version:

```kotlin
final KStream<String, Book> source = builder.stream("application.books");

source.filter((key, book) -> book.getWordCount() > 40_000).to("application.novels");
```

and the TypeStream one:

```javascript
cat /dev/kafka/cluster/topics/application.books | grep [ .word_count > 40000] > /dev/kafka/cluster/topics/application.novels
```

Since these two pieces of code solve the same problem, they obviously look very
similar. The key difference is that, in the Kafka Streams version, you're
responsible for the serialization yourself. That `KStream<String, Book>` looks
innocent but I've seen lots of newcomers trip up on this specific point. You
have to instruct Kafka Streams to do the correct serialization. While that's
obviously fair from the API perspective, it gives a burden on developer
experience that often feels unneeded. Avro and Protocol Buffer (to cite the most
used ones) are fantastic at what they do but also involve lots of machinery with
generated code and build setup. Furthermore, you have to point Kafka Streams to
your schema registry so it often feels "unfair" that you still have to do all
the serialization work "manually".

The TypeStream code has no mention of serialization. You still have to tell your
TypeStream server where your schema registry is but there's no step two.
TypeStream will associate the schema of a topic with its path and can use that
metadata to "type check" your pipeline. That simplicity is reflected in the
TypeStream code: less configuration, no explicit types.

## The deployment model

Since Kafka Streams is *just* a library (that "just" is meant as a huge
compliment), the deployment model is whatever way you deploy jvm applications.
Since Kafka Streams applications can be stateful, you may need to pay attention
to the local disks (a bit tricky in Kubernetes). All in all, it's a very
flexible solution.

Technically speaking, TypeStream is a "remote compiler" that uses a Kubernetes
cluster for running jobs. That means two things:

- You must deploy TypeStream in a Kubernetes cluster that access your Kafka
  clusters.
- TypeStream will manage the lifecycle of your pipeline.

If you have a lot of very small services, this approach may be more convenient
because yes you give up on flexibility (there's one way to deploy TypeStream
application and TypeStream will decide for you how to run them) but gain quite
some velocity (once you wrote the pipeline, you're done).

## When to use what

Comparing two technologies that can solve similar problems is always a little
tricky because the differences may boil down to taste which doesn't lead to
constructive conversations. In this case, the design goals of the two can guide
us toward a constructive approach.

Kafka Streams is a jvm library. It's a fully-featured streaming processing
library and has lots of advanced features (like interactive queries. Check out
my [HTTP endpoints with Kafka Streams Interactive Queries]({{< ref
"/writing/http-endpoints-with-kafka-streams-interactive-queries" >}})) so you
can solve a vast number of problems with it.

TypeStream is a streaming platform that compiles your code into Kafka Streams
applications. One of the non-goal of TypeStream is critical to this
conversation: TypeStream doesn't aim to cover every Kafka Streams feature. The
project is concerned with what kind of problems can be expressed as UNIX
pipelines and with improving the developer experience of writing simple
streaming applications.

This tells us there are scenarios in which you won't be able to use TypeStream
even if you wanted to. On the other hand, the scenario we discussed in this
article, event-driven microservices fits TypeStream well. Most microservices do
one small thing (they should, no?) and can be expressed as a one-liner in
TypeStream.

What I'm saying is that I would use TypeStream for trivial event-driven
microservices (they often are) and leave Kafka Streams for the more advanced
problems.
