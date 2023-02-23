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
  - [Why mdBook](#why-mdbook)
- [Marketing the book](#marketing-the-book)

## Writing the book

First of all a confession: I published the book in February 2023 but I wrote it
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

I wasn't comfortable enough with any of the existing solutions and "luckily"
available solutions are developer "friendly". This is how I ended up with a
custom pandoc toolchain.

### Pandoc

At first sight, pandoc seems to good to be true. I got decent ePUB and PDF
formats in no more than 15 minutes. Unfortunately, going from decent to good
took much longer than that.

In case you have never heard of pandoc, here's what their official docs say:

> If you need to convert files from one markup format into another, pandoc is
> your swiss-army knife.

In practice, pandoc is a command line application that allows you to do things like this:

```sh
pandoc -o book.epub *-*.md
```

and just like that you get a decent ePUB document. You can do the same with another format:

```sh
pandoc -o book.pdf *-*.md
```

and, again, just like that you get a decent PDF document. I think you could also
do HTML documents this way but I didn't dive into this because
[mdbook](#why-mdbook)'s default output was great so I decided to use that for
HTML. More about this later.

As you can see, pandoc has impressive out of the box experience but,
understandably, the defaults didn't work for me. Here's what I wanted to
achieve:

- HTML, ePUB, PDF formats.
- Internal links work in all formats.
- The documents have a working table of contents.
- I have page numbers in the PDF format.
- I want to style font, line height, page size, and son.

It doesn't seem like much, and to be frank it isn't, but I had to learn how
pandoc works to achieve these goals.

So let's start by saying how pandoc works. In short, pandoc is a data pipeline
that looks like this:

![pandoc data pipeline](/img/pandoc.svg)

A simple idea!

For the sake of this conversation, let's consider the markdown to ePUB example again:

```sh
pandoc -o book.epub *-*.md
```

When you run this command, pandoc uses its markdown reader to read and convert
the input documents into a "pandoc AST (abstract syntax tree)". Then it passes
the AST to the ePUB writer which converts it into an ePUB document. It's an
elegant solution to the "convert between all formats" problem.

I wanted to make two kinds of customizations: styles (font, sizes) and content
(links). I used CSS for style which felt very good, and "pandoc filters" for
links which also felt good but I had to learn one more thing before I could do
this.

Let's talk about CSS first. The reason why I ended up with CSS is two-fold:

- ePUB customization works out of the box with CSS.
- PDF customization in pandoc is possible with latex and CSS. I don't do latex.

After some research, here's what I ended up with:

- A [postcss](https://postcss.org/) pre-processor step for both PDF and ePUB
  format. I wanted to use variables. Nothing fancy.
- [WeasyPrint](https://weasyprint.org/) as a PDF engine. It supports modern CSS
  features so I could get things like "alternating-sides page numbers" with 2
  lines of code.

Once this build pipeline was in place, I only needed to make internal links work
everywhere. By default, internal links don't work in PDF or ePUB documents
because they point to the physical name of the input document:

- What I have: `[when to split teams](5-teams.md#when-to-split-teams)`
- What I need: `[when to split teams](teams#when-to-split-teams)`

That's where [filters](https://pandoc.org/filters.html) come in. In the words of
the official docs:

> Pandoc provides an interface for users to write programs (known as filters)
> which act on pandoc’s AST.

A simple idea again: you can write little programs (in
[Lua](http://www.lua.org/)) that hook you into the AST stage and let you
manipulate its nodes before the writing stage. To make links work, here's what I wrote:

```lua
function Link(el)
  if string.match(el.target, "^%d") then
    print(el.target)
    title = string.find(el.target, "#.*")
    if (title ~= nil) then
      el.target = string.sub(el.target, title)
    else
      el.target = "#" .. string.sub(el.target, 3, -4)
    end
  end
  return el
end
```

Since the function is called like the AST node it acts upon, this will work with
no additional code (the beauty and the curse of "convention over
configuration"). Then I passed the filter to pandoc:

```sh
pandoc --lua-filter links.lua *_*.md -o book.pdf
```

which fixed links in both formats.

### Why mdBook

In the words of the official docs, [mdBook](https://rust-lang.github.io/mdBook/) is:

> a command line tool to create books with Markdown.

As I said, I decided to go for it because I love its default output. It's very
readable and has a nice default navigation. I think I was also a little tired of
all the work I had to do to get ePUB and PDF formats to an acceptable quality
level.

The only customization I had to do here is about the file structure. My one
chapter per markdown file approach didn't produce a navigable structure (I'm not
complaining, I understand mdBook approach here). So I write a small Ruby script
that converts the structure of the input files for me. You can check out the
free online version at [https://book.leadthe.dev](https://book.leadthe.dev).

## Marketing the book

This was the hardest part for me. Writing a little copy on
[https://leadthe.dev](https://leadthe.dev) to convince readers to buy something
I wrote has proved to be quite the psychological challenge for me.

I think there's more than one reason at play here but the core problem is that I
wrote a book about a job I don't really look forward to having again.

So what I did is I read all the engineering management books I could get my
hands on. I'm sure I was just looking for excuses _not_ to ship the book.
Something along the lines of "the books out there cover everything, they're so
good. No need for one more".

But I couldn't prove that. In fact, reading all these books ultimately convinced
me to ship mine because I think I covered a gap in the market. More importantly,
I shipped it, learned a ton on the way, and now have a good understanding of
what it takes to ship a book. I wish I had it done it sooner :)
