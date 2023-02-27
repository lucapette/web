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

[Leading developers](https://leadthe.dev) is a short book about engineering
management I self-published on 21 February 2023.

In the process of writing and publishing it, I took notes knowing I would want
to reflect on the experience as soon as I was done with it. So here I am.

- [Writing the book](#writing-the-book)
- [Reviewing the book](#reviewing-the-book)
- [Publishing the book](#publishing-the-book)
  - [Pandoc](#pandoc)
  - [Why mdBook](#why-mdbook)
- [Marketing the book](#marketing-the-book)

## Writing the book

First of all, a confession. I published the book in February 2023 but I wrote it
on a speed run in the spring of 2017 and parked it till late summer of 2022.
That means I'm not sure how long it took to write a first as I have almost no
memories left of the actual "writing experience" and can't speak to that.

I remember how I approached the structure of the book though. Instead of coming
out with some meaningful structure, I dumped on paper everything I knew about
leading developers and let the design of the chapters emerge from the content.
This approach made sense to me because I was deeply familiar with the subject
and had already lots of writing I could use as starting point.

Nowadays, I'm also convinced I speed-ran the writing because I wanted to free
myself of my own leadership ideas. OK, time for another confession. I don't
enjoy leading teams anymore. To be fair, I think I never did.

Writing the book helped me realise that yes, I loved the teams I built, I loved
the way they worked together, what the people had achieved, their professional
growth. But no, I didn't like my job. To tell you the truth, I kind of hated it.

Until I sat down to write the book, it wasn't clear to me that there was a
difference between what the outcomes of my job and the job as a daily routine.
By the time this difference clicked, I had also finished a first draft of the
book.

Realising I didn't really want to lead teams anymore is one of the main reasons
why I parked the book for years.

I only picked up the book again because, and I really can't make this up, I want
to write _more_ books 🙃

My dumb brain works like this: "Yo! You can't do that unless you ship the one
you already wrote 4 years ago. Remember that book?"

I don't think that's a good reason to go through the process I went through
(which I'll cover in detail throughout the rest of the article) but I'm glad I
couldn't get myself to start another book before shipping this one.

Two reasons:

- I learned a lot about the process of going from a first draft to a finished
  book. I cover that in the next paragraph.
- I build a little of infrastructure for self-publishing which I'm sure it'll
  come handy in the near future (yes, I'm writing _another_ book already). I
  cover that in [publishing the book](#publishing-the-book), including why I
  went down the road of self-publishing.

## Reviewing the book

As a writer, the review process was by far the most valuable experience in the
whole process. I write a lot and also love writing about writing (yes, I know
but [On writing]({{< ref "/writing/on-writing" >}} "On writing") is a good
article 🙃) so I went into this phase a little too confident I knew how to do
this.

Compared to my usual article review process, there were two complications.

First of all, five years had passed since I first wrote the book. Do I still
agree with 2017 Luca? Legit question, half a decade is a significant amount of
time. I overestimated the problem a little. The time distance helped me update
the content: I had no memory of writing any of it so there was no emotional
attachment. I just changed whatever I needed to.

This experience gave a whole new perspective to what Stephen King does when he
writes a book. He always takes a break of a few weeks after he'd done with the
first draft of a new book. I _understand_ this now.

The other complication is that my book is much longer than my average article.
My usual workflow didn't work at this scale which, in retrospect, looks funny.
Let me explain.

The first two times I went over the whole book, I reviewed one or two chapters a
day in the order they're published. Both times I was too tired while reviewing
the last two chapters. I had depleted my willpower to rethink sentences, trim
words out, simplify, or delete. By the end of these two sessions, I was totally
unsatisfied with the result.

So I tried to review chapters out of order. Or better put, I prioritized the
chapters I was the most unhappy with. I did two more passed this way and the
results were much more satisfying. I was doing the hard work first so by the end
of these days long sessions I was only checking commas

What's funny to me is that I was reviewing a whole book from start to finish
like it was an article. No process works as well at two different order of
magnitudes. I should have known better, I've said this myself hundreds of times.

## Publishing the book

Before I dive into which tools I chose and why, I should mention why I decided
to self-publish.

Well, no one wanted it 😀

I sent the book to four different publishing companies. Here's what happened:

- I got one "real" rejection: someone actually explained me why the book didn't
  work for them.
- Two automated rejections.
- One publishing company didn't answer (of course, my favourite of the four did
  this!).

This was the most likely outcome of course and I knew that before pitching them
my book. I did so anyway because "you miss 100% of the shots you don't take".
Also, I'll expand in [marketing the book](#marketing-the-book), I knew the
effort I had to put into pitching the book wouldn't go lost.

Once the rejections came in, I started looking into self-publishing. Here are my
initial requirements:

- I wanted HTML, ePUB, and PDF versions. I assumed ePUB and PDF as required
  formats because it's what most publishing companies sell (at least in tech). I
  added the HTML version because I wanted the book to be freely available.
- I did not want to deal with LaTeX. My uni thesis scarred me for life.

With this in mind, I started to search for possible solutions and quickly
discovered that it's a bazaar out there when it comes to self-publishing.
There's way too much marketing material and way too little concrete information
(one of the main reasons why I'm writing this article). In my research I came
across:

- Too many "lead generation" articles about self-publishing. Infuriatingly
  useless.
- [Leanpub](https://leanpub.com/). A platform I'm very fond of as I was a very
  early tester. I think it's a great choice but I couldn't convince myself that
  a subscription model would work for me.
- [Ulysses.app](https://ulysses.app/). A beautiful macOS application. It has a
  polished UI and the default PDF/ePUB output is nice. I was tempted I didn't
  want to put my customization efforts into a proprietary solution.

I decided I wasn't comfortable enough with any of the alternatives which is how
I ended up with a custom [pandoc](https://pandoc.org/) toolchain.

### Pandoc

At first sight, pandoc seemed to good to be true. I got decent ePUB and PDF
formats in no more than 15 minutes. Unfortunately, going from decent to good
took much longer than that.

In case you have never heard of pandoc, here's how the official docs describe
it:

> If you need to convert files from one markup format into another, pandoc is
> your swiss-army knife.

In practice, pandoc is a command line application that allows you to do things like this:

```sh
pandoc -o book.epub *-*.md
```

and just like that you get a decent ePUB document! You can do the same with another format:

```sh
pandoc -o book.pdf *-*.md
```

which gives you a decent PDF document. I think you could also do HTML documents
this way but I didn't dive into this because [mdbook](#why-mdbook)'s default
output was great so I decided to use that for HTML. More about this later.

As you can see, pandoc has an impressive out of the box experience but,
understandably, the defaults didn't work for me. Here's what I wanted to
achieve:

- HTML, ePUB, PDF formats.
- Internal links work in all formats.
- The documents have a working table of contents.
- I have page numbers in the PDF format.
- I want to style font, line height, page size, and so on.

After some research I realized that, apart from internal links, I could do
everything else with CSS. So let's talk about that first.

Here's how the "styling pipeline" looks like:

- A [PostCSS](https://postcss.org/) pre-processor step. Nothing too fancy but I
  wanted to use variables. I processed my CSS styles with PostCSS and passed the
  processed file to pandoc. Easy.
- [WeasyPrint](https://weasyprint.org/) as a PDF engine. It supports modern CSS
  features so I could get things like "alternating-sides page numbers" with 2
  lines of code. Really cool!

Once this pipeline was in place, I could focus on internal links. By default,
internal links don't work in PDF or ePUB documents because they point to the
physical name of the input document:

- What I have: `[when to split teams](5-teams.md#when-to-split-teams)`
- What I need: `[when to split teams](teams#when-to-split-teams)`

That's where [filters](https://pandoc.org/filters.html) come in. But before we
can dive into that, let's have a quick look at how pandoc works.

In short, pandoc is a data pipeline that looks like this:

![pandoc data pipeline](/img/pandoc.svg)

A simple idea.

For the sake of this conversation, let's consider the markdown to ePUB example
again:

```sh
pandoc -o book.epub *-*.md
```

When you run this command, pandoc uses its markdown reader to read and convert
the input documents into a "pandoc AST (abstract syntax tree)". Then it passes
the AST to the ePUB writer which converts it into an ePUB document. It's an
elegant solution to the "convert between all markup formats" problem. You can
check out the AST yourself:

```sh
$ echo "# Hello\n[World](http://example.com)" | pandoc -t native
[ Header 1 ( "hello" , [] , [] ) [ Str "Hello" ]
, Para
    [ Link
        ( "" , [] , [] )
        [ Str "World" ]
        ( "http://example.com" , "" )
    ]
]
```

Filters act on the AST. In the words of the official docs:

> Pandoc provides an interface for users to write programs (known as filters)
> which act on pandoc’s AST.

A simple idea again: you can write little programs (in
[Lua](http://www.lua.org/)) that hook into the AST and let you manipulate its
nodes before the writing stage. Here's how I fixed links:

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

which fixed links and I was good to go!

I have not made the pipeline code public yet but reach out to me if you're
interested and I will do so.

### Why mdBook

In the words of the official docs, [mdBook](https://rust-lang.github.io/mdBook/) is:

> a command line tool to create books with Markdown.

I decided to use it for the free version of the book because I love its default
output. It's very readable and has a nice navigation. I think I was also a
little tired of the work I had done to get ePUB and PDF formats to an acceptable
quality level.

The only customization I had to do here is about the file structure. My one
chapter per markdown file approach didn't produce a navigable structure (I'm not
complaining, I understand mdBook approach here). So I wrote a small Ruby script
to convert the structure of the input files. You can check out the the free
online version at [https://book.leadthe.dev](https://book.leadthe.dev).

## Marketing the book

This was the hardest part for me. Writing a bit of copy on
[https://leadthe.dev](https://leadthe.dev) to convince readers to buy something
I wrote proved to be quite the psychological challenge.

I wrote a book about a job I don't really look forward to having again. That's
awkward to me.

So what I ended up doing is reading all the engineering management books I could
get my hands on. I was looking for excuses like "the books out there cover
everything, they're so good! No need for one more!".

But I couldn't prove that. In fact, reading these books ultimately convinced me
to ship mine because I think I covered a gap in the market with my _build your
own leadership framework_ approach and my CTOs at early-stage startup audience.
More importantly, I learned a lot on the way, and now have a good understanding
of what it takes to ship a book. I wish I had it done it sooner :)
