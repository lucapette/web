---
categories:
  - books
date: "2011-10-07T00:00:00Z"
description:
  A review of Crafting Rails Applications by José Valim. Published by The
  Pragmatic Programmer in March 2011
keywords:
  a review of Crafting Rails Applications, ruby, book review, rails, enginex,
  José Valim
title: A review of Crafting Rails Applications
---

As usual, my considerations grouped by chapter:

### Creating our own renderer

Very interesting way of starting a book. The author presents a gem used
throughout the book called [enginex](https://github.com/josevalim/enginex).
It’s an executable used to create bare rails engines. In this chapter he use
it for creating an engine to add pdf rendering capabilities to Rails.

### Building Models with Active Models

The topic is nice. José is nice too. He covers the ActiveModel APIs in a very
clear and deep way. Following the rule “Test first”, the author wrote a
compliance test for ActiveModel, reading the evolving of the test you’ll be
able to understand what an ActiveModel really is. The example of the chaper is
building a flexible mail form using the Rails APIs. Very, very enjoyable
chapter.

### Retrieving View Templates From Custom Stored

Once again nice topic. The author guides you though a complete understanding
of how rails magically retrieves view template and gives view a wonderful
explanation of what is the view_context object and how it works. Then, he
introduces you to the resolver API and will show you how you can use that API
to write an sqlresolver. The latest part of the chapter describes how to run
your resolver in production. This part contains an enjoyable and detailed
explanation of ruby hashes. A [nice guy](http://andreapavoni.com/) created a
[gem](https://github.com/apeacox/panoramic) after reading this chapter.

### Sending Multipart Emails Using Template Handlers

The chapter concludes the trip trough the rendering stack presenting the
Template Resolver API. The example used is very nice, the chapter is build
around the writing of a markdown erb template handler for emails. First of
all, the author gives you a couple on nice handlers, just to clarify how they
really work. Then he pass to write the handler that gave the name to the
chapter. At the end, the author explains how to use rails 3 generators to turn
his example into a gem.

### Managing Application Events with Rails Engines

Another great topic. The chapter starts with a clear explanation of the
reasons behind ActiveSupport::Notifications API. Then the author guides you
though these APIs with a very nice example. The aim of the chapter is writing
a gem to store all the SQL queries done by a rails project in a
[mongodb](http://www.mongodb.org/) database. Later in the chapter, you read
how to visualize all the stored queries with a rails engine and then how to
store notifications asynchronously. The chapter contains also a very good
explanation of the relationship between Rails and Rack.

### Writing DRY Controllers with Responders

To be honest, I didn’t know what responder are before reading this chapter.
So, I was really excited to read it. As always, José Valim doesn’t disappoint
the reader. The chapter suddenly presents how responders works. The first part
of the chapter contains a very clever table that summarizes how Rails
controllers work with HTTP verbs. It’s a very interesting topic and the
author’s approach to the topics covered makes the topics themselves even more
interesting.

### Translating Applications Using Key-Value Backends

Another great topic. The chapter starts with a brief description of the
history of I18n and focuses on the necessity of giving people the chance to
translate application without dealing with yaml files, maybe using another
application and storing translation in the database. But dealing with a
database could give performance problems and then the author gives use a super
awesome example. You’ll learn how to store translations using
[Redis](http://redis.io/) and manage them with a
[sinatra](http://www.sinatrarb.com/) interface.

## What I liked most

Generally speaking, when a book is difficult to read it isn’t a good sign. But
this one is difficult to read for very good reasons. The topics are deeply
covered, the example are great. It’s absolutely fair to say that this book is
actually the most advanced Rails book on the market. So, **you have to read it
if you’re not a rails beginner**. And I would to say just another thing. We
need other books like this one. Imagine to read something like “Rails
internals” written by _choose-your-favourites-rails-core-member_.

## What I disliked most

I can’t dislike a book like this one. But I have to confess that there are a
lot of “let’s”. Well, I’m not a native speaker so I can’t suggest a better way
to make that kind of sentences. But, you know, I’m just saying a stupid thing.
**This book is just awesome**.
