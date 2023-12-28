---
title: "Kafka Streams or TypeStream?"
description: "A comparative analysis in the context of event-driven architectures"
tags:
date: 2023-12-28T10:12:55+01:00
draft: true
tags:
  - kafka
  - kafka streams
  - typestream
keywords: kafka, kafka streams, typestream
---

In this article, I give a long answer to a question that comes up a lot when I'm
talking about [TypeStream](https://github.com/typestreamio/typestream):

> How does it compare to Kafka Streams?

It's more than a fair question; the functional overlap between the two
technologies is large. After all, Kafka Streams is the default (and, at the
moment, only) runtime available in TypeStream.

To keep things as concrete as possible, I'll compare the two in the context of
event-driven microservices.

So before I define them, let me clarify what I mean with event-driven
microservices.

Before I even do that, quick aside. I don't mean to be troll-ish about this (I
can enjoy a good rant but I'm not a big fan of public rants) but I'm afraid
there's no other way of saying this: I think the naming "event-driven
microservices" is a little off and forced into our conversations by a larger
trend (read cult) about microservices.

I want to say "streaming applications" because I like to call things what they
are and what they do but I use "event-driven microservice" since I know this
naming reaches a wider audience and who wouldn't want that?

All right, you now know I'm reluctantly saying "event-driven microservice" but
what is it anyway?

It's a ~~small streaming application~~ microservice that does its job by
consuming and producing off an event broker. More often than not, the event
broker of choice is a Kafka cluster since the core property you need to unlock
the potential of an event-driven microservice architecture is that the events
are durable and can be consumed many times by many different services. From this
point on, when I say event-driven microservice, I'm always talking about a small
application (see?) that consumes data via one or more Kafka topics, does its
thing, and often sends its result back to a Kafka Topic (more about this later).

I'm ignoring how tricky the adjective "small" is in the previous sentence. I
could probably write a whole article (people wrote books about slightly, ehm,
larger topics) about it so it's out of scope here.

Now that (hopefully) the context is clear, I can define Kafka Streams and
TypeStream. Let's start with Kafka Streams using the words of the official docs:

> Kafka Streams is a client library for building applications and microservices,
> where the input and output data are stored in Kafka clusters. It combines the
> simplicity of writing and deploying standard Java and Scala applications on
> the client side with the benefits of Kafka's server-side cluster technology.

Clearly the Kafka Streams authors believe that the library is a good fit for our
use case. It goes without saying that I agree with them. Kafka Streams is a
fantastic library. It has a very usable API and covers a lot of ground with its
features. I wrote about it in [Getting started with Kafka Streams]({{< ref
"/writing/getting-started-with-kafka-streams" >}}) which, I feel weird saying
this myself, is the best introduction to the library if you know nothing about
it.

TypeStream is an open-source streaming platform that allows you to write and
run *typed* data pipelines with a minimal, familiar UNIX-like syntax. I wrote
about the fundamental ideas that drive the project forward in [they're called
streaming data "pipe"lines... right?]({{< ref
"/writing/they-are-called-streaming-data-pipelines-right" >}})

Both technologies can be leveraged in the context of an event-driven
microservice architecture but they have different strengths and trade-offs.

How do TypeStream's intuitive UNIX-like approach and the power of Kafka Streams
compare?

analyzing when and why to favor one over the other. We explore key differences
in usability and deployment model. The goal is to provide you with actionable
insights on choosing the right tool for the job