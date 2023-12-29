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

- [Event-driven microservices](#event-driven-microservices)
- [Kafka Streams](#kafka-streams)
- [TypeStream](#typestream)


This article answers a question that comes up a lot when I'm talking about
[TypeStream](https://github.com/typestreamio/typestream):

> How does it compare to Kafka Streams?

It's more than a fair question; the functional overlap between the two
technologies is large. After all, Kafka Streams is the default (and, at the
moment, also the only) runtime available in TypeStream.

To keep things as concrete as possible, I'll compare the two in the context of
event-driven microservices.

So before I start comparing them, let me clarify what I mean with event-driven
microservices.


## Event-driven microservices

I don't mean to be troll-ish about this but there's no other way of saying this:
I think the naming "event-driven microservices" is a off and it has been forced
into our conversations by a larger trend (read cult) about microservices.

I prefer "streaming applications" because I like to call things what they are
and what they do but I will use "event-driven microservice" since I know this
naming reaches a wider audience and who wouldn't want that?

All right, you now know I'm reluctantly saying "event-driven microservice" but
what do I mean anyway? What's an "event-driven microservice"?

It's a ~~small streaming application~~ microservice that does its job by
consuming and producing off an event broker. More often than not, the event
broker of choice is a Kafka cluster. The core characteristic of an event-driven
microservice architecture is that the events are durable and can be consumed
many times by many different services. Kafka has that and is an obvious choice
to unlock the full potential of this approach. From this point on, when I say
event-driven microservice, I'm always talking about a small application (see?)
that consumes data via one or more Kafka topics, does its thing, and may send
its result back to a Kafka Topic (more about this later).

I'm ignoring how tricky it is to define what a "small" application is. I could
probably write a whole article about it (people wrote books about slightly, ehm,
larger topics) so it's out of scope here.

## Kafka Streams

Now that (hopefully) the context is clearer, I can define Kafka Streams and
TypeStream. Let's start with Kafka Streams using the words of the official docs:

> Kafka Streams is a client library for building applications and microservices,
> where the input and output data are stored in Kafka clusters. It combines the
> simplicity of writing and deploying standard Java and Scala applications on
> the client side with the benefits of Kafka's server-side cluster technology.

The Kafka Streams authors believe that the library is a good fit for our use
case. It goes without saying that I agree with them. Kafka Streams is a
fantastic library. It has a very usable API and covers a lot of ground with its
features. I wrote about it in [Getting started with Kafka Streams]({{< ref
"/writing/getting-started-with-kafka-streams" >}}) which, I feel weird saying
this myself, is the best introduction to the library if you know nothing about
it.

For the sake of the discussion, let's assume we have a `application.books` topic
where records look like this:

```json
{"id":"392ff175-6f93-4228-8620-fba20b6a4f73","title":"Station Eleven","word_count":45000,"author_id":"743626be-8380-40e9-ab1b-44dfc398cde0"}
{"id":"9ba6893e-2980-4316-b9c3-605799a08bde","title":"Sea of Tranquility","word_count":40000,"author_id":"743626be-8380-40e9-ab1b-44dfc398cde0"}
{"id":"a8c6a266-2827-4b87-873a-f1fcf3f9b138","title":"Purple Hibiscus","word_count":35000,"author_id":"da68bea8-4a8e-4f96-bc39-25b0b697d94b"}
```

Note that I'm using JSON for readability but, in a production system, I'd expect
Avro (or Protocol Buffers) to be the serialization format of choice.

Now imagine we only need novels into a different topic. Right now, the way we
define novel is trivial (more than 40K words) but we expect this to change over
time. So we'll build a small event-driven microservice that is responsible to
extract novels from the `application.books` topic into a `application.novels`
topic. Here's a Java program that solves this problem:

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

Apart from the imports and the main definition, this is pretty much all the code
we need for this microservice. Pretty marvelous.

## TypeStream

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