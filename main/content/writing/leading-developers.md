---
title: "Leading Developers"
description: "or how I wrote a book and didn't hate it"
date: 2023-02-22T07:20:53+01:00
draft: true
tags:
  - writing
  - books
  - "engineering management"
keywords:
  - "engineering management"
  - ePUB
  - PDF
  - pandoc
  - mdbook
  - writing
  - self-publishing
---

Last week (21 Feb, 2023), I self-published a book called [Leading
developers](https://leadthe.dev). In the process of getting the book out the
door, I took notes knowing I'd want to reflect on the experience as soon as I
was done with it. So here I am.

- [Writing the book](#writing-the-book)
- [Reviewing the book](#reviewing-the-book)
- [Publishing the book](#publishing-the-book)
  - [Pandoc](#pandoc)
    - [Filters](#filters)
  - [Basic customisation](#basic-customisation)
  - [Why mdbook](#why-mdbook)
- [Marketing the book](#marketing-the-book)

## Writing the book

First of all a confession, I published the book in February 2023 but I wrote it
on a speed run in the spring of 2017. I'm not sure how long it took as I have
almost no memories left of the actual "writing experience".

I remember how I approached the structure of the book. I pretty much dumped on
paper all I knew about leading developers and let the design of the chapters
emerge from the content. I think this approached worked for me because I was
deeply familiar with the subject and had already lots of writing I could use as
starting point.

Nowadays, I'm also convinced I speed-ran the writing because I wanted to free
myself of my own leadership ideas. Time for another confession (I have already
mentioned this publicly though): I don't enjoy leading teams anymore. To be
fair, I think I never did.

Writing the book was a fantastic introspection activity. It helped me realise
that yes, I loved the teams I build, I loved the way they worked together, what
the people had achieved, their professional growth. But no, I didn't like the
job. In fact, I hated my everyday job.

I had never realised there was a difference between what the outcomes of my job
and the job as a daily routine. By the time I got this, I also "finished" the
book. I was tired. I did not have the willpower to get it over the finish line.

It turns out "finishing" the book is the hardest bit, hence the quotes. The last
20% took 80% of the time. It's such an obvious cliche; I can't stand how true it
is in my case 🙃

The realisation I didn't really want to lead teams anymore is why I parked the
book a little more than 4 years. Sure, there was a pandemic in the middle that
changed all time equations but, to be honest, I think it had no impact on this.

I picked up the book again because, and I can't make this up, I want to write
_more_ books. My dumb brain works like this: "Yo! You can't do that unless you
ship the one you already wrote 4 years ago. Remember that book?".

I don't think that's a good reason to go through the process I went through
(which I'll cover in detail throughout the rest of the article) but I'm glad I
couldn't get myself to start another book before shipping this one.

Two reasons:

- I learned a lot about the process of going from a decent draft to an actual
  book. I cover that in the next paragraph.
- I build a little of infrastructure for self-publishing which I'm sure it'll
  come handy next time. I cover that in [publishing the
  book](#publishing-the-book), including why I went down the road of
  self-publishing.

## Reviewing the book

As a writer, the review process was by far the most valuable experience. I write
a lot and also love writing about writing (yes, I know but TODO: ref on writing
is a good article🙃) so I went into this phase confident I knew how to do this.

Compared to my usual article review process, there were two complications:

First of all, five years had passed since I first wrote the book. Do I still
agree with 2017 Luca? Legit question, half a decade is a significant amount of
time. I overestimated this problem a little. The time distance made it very easy
for me to update the content. I had no memory of writing most of it so there was
no emotional attachment.

This experience gave a whole new perspective to what Stephen King does when he
writes a book. He always takes a break of a few weeks between the first draft of
a new book and the review process. I _understand_ this now.

The other, way too obvious, complication is that my book is much longer than my
average article. My usual workflow didn't work at this scale.

In retrospect, this looks funny. Let me explain.

The first two times I went over the whole book, I did one or two chapters a day
in the order they're published. By the time I got to the last two chapters, I
was tired. I had depleted my willpower to rethink sentences, trim words out,
simplify, or delete. Both sessions took a few days and by the end of it I was
totally unsatisfied with the result.

So I tried to review chapters out of order. Or better put, I prioritized
chapters I was the most unhappy with. I did two more passed this way and the
results were much more satisfying. I was doing the hard work first so by the end
of these days long sessions I was literally checking commas and formatting.

What's funny to me here is that I was reviewing a whole book from start to
finish like it was an article. No process works as well at two different order
of magnitudes. I should have known better, I've said this myself to other people
hundreds of times.

## Publishing the book

Before I dive into which tools I chose and why, I should mention with I decided
to self-publish. The answer is trivial: no one wanted it. I sent the book to four different publishing companies:

- I got one "real" rejection: someone actually explained me why the book didn't work for them.
- Two automated rejections.
- One publishing company didn't answer (of course, my favourite of the four did
  this!).

This was the most obvious outcome and I knew that before sending them a pitch. I
did so anyway because "you miss 100% of the shots you don't take". Also, I'll
expand in [marketing the book](#marketing-the-book), I knew the exercise
wouldn't be lost.

Once all the rejections came in, I started looking into self-publishing. Here
are my requirements:

- I wanted HTML, ePUB, and PDF versions. I assumed ePUB and PDF the required
  formats because it's what most publishing companies sell (at least in tech). I
  added the HTML version because I wanted this book to be freely available.
- I did not want to deal with latex. My uni thesis scarred me for life.
- One folder with a markdown file per each chapter. This seems to be the less
  stringent requirement of the three but, in fact, it came with a bunch of
  problems.

With this in mind, I started to search for possible solutions and quickly
discovered that it's a bazaar out there when it comes to self-publishing,
there's way too much marketing material and way too little concrete information
(one of the main reasons why I'm writing this article). In my research I came
across:

- Way too many "lead generation" articles. Infuriatingly useless.
- [Leanpub](https://leanpub.com/). A platform I'm very fond of as I was a very
  early tester. I think it's a great choice but I couldn't convince myself a
  subscription model would work for me.
- Ulysses.app. A beautiful macOS application. It has a polished UI and the
  default PDF/ePUB output is nice. I was tempted by I didn't want to put my
  customization efforts into a proprietary solution.

I wasn't comfortable enough with any of the existing solutions and "lucky"
available solutions are developer "friendly". This is how I ended up with a
custom pandoc toolchain.

### Pandoc

Seems too good to be true. In 15 minutes I got a working book.
I can add css in no time. That’s pretty amazing
Pdf also seems one command away (just need to find the right pdf converter)

Unfortunately going from decent to good is very hard.
Here’s the requirements:

- html,epub,pdf formats
- internal links work everywhere
- toc as well
- page numbers in pdf

Doesn’t seem much but it’s surprisingly hard to get right

#### Filters

Two kind. JSON and lua. Lua filters seem nice but of course you need to know the
language a bit. The idea of filters is based on how pandoc works in general.
It’s basically a data pipeline with a reader on one side, an ast in the middle,
and a writer on the other side Filters act on the middle ast. You can look at
the AST with this command pandoc -s -t native assets/example.md

### Basic customisation

Better to do with css. It goes a lot way. Especially if you have constraints
(one h1 per chapter to do page breaks) The pipeline doesn’t get css variables so
I stitched together make postcss and pandoc. Nice pipeline. Seems to me the
whole thing could have better defaults. For example, I can’t get page numbers to
show Turns out default latex with the intermediate html5 (to option) step is the
nicest tradeoff for me.

Had to tweak wkhtmltopdf a lot for the table of contents. None of this is user
friendly. And it also doesn’t work very well. The page numbers look bad and I
have to fight with too many things to make this work

So I went for weasyprint. Because it supports modern css features and the output
is very nice. Only have a problem with links. internal links refer to the file
on disk which is useless. But anchor links I can transform so I wrote a Lua
filter for that (which also fixes links in the ePub version)

The customisation was really easy because weasyprint supports very fancy css so
I could style pages with very little code

### Why mdbook

I decided to go for mdbook because I love its default output. It’s a little
inflexible in terms of structure (but I understand the trade-off so I’m good with
it) which made me write a ruby script to convert my “one file one chapter”
structure into folders. I like it this way as well. I’m considering moving the
pandoc stuff to that (it shouldn’t be that hard?)

## Marketing the book

It’s really really hard for me to market myself. There’s also the thing I wrote
this book 5 years ago and parked it. Back then books weren’t good, now there’s a
bunch.
