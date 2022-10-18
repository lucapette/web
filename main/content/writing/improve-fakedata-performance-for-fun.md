---
title: "Improve Fakedata Performance for Fun"
date: 2022-10-17T08:53:37+02:00
tags:
  - go
  - fakedata
description: A good excuse to play around with some interesting tools
keywords: golang, fakedata, performance, strace, pprof, datasette
draft: true
---

If you're familiar with [fakedata](https://github.com/lucapette/fakedata/), skip
over to the [next section](#why-am-i-doing-this).

Fakedata is a small CLI (command-line application) that helps you generate data.

Say you need some data to test a feature that requires uuids, emails, and
country codes.

The way you do that with fakedata is this:

```sh
$ fakedata uuidv4 email country.code
b4469d8c-3097-4434-be74-270ce5fc6763 bassamology@test.pid JP
d7a09d09-af98-416f-ab62-ef85a5d172bf megdraws@example.edeka SZ
91420c81-da0b-4eb2-abaa-2d8a7cd6d543 operatino@test.booking NI
4949683d-85d1-4ffa-993f-ae2e11a631d8 mutlu82@test.sn CI
bd98fa15-c260-4b7c-93fb-837e53f2b3db unterdreht@example.channel NF
6a3754f4-5330-44e6-9b1a-5b166441e408 andrea211087@test.woodside TL
66d29e42-3ca8-42a8-a89f-28eefe5e25d2 anaami@test.nexus KH
4cbeff5d-2081-4cc9-926e-e5a5c1c034ad heyimjuani@test.network CF
233fd4e4-aef0-468e-a492-36a65c11f7d1 brajeshwar@example.mattel TG
2200fb5a-e3c0-4976-ba16-5ed01c501002 unterdreht@test.abudhabi LV
```

The app provides you with a number of "generators" (see the whole list with
`fakedata -G`) you can use to quickly generate data.

Fakedata supports a few formatters (including a SQL insert format) so it's also
quite flexible.

It has other features which you can read about in the official README. If you
can't find what you're looking for, open an issue and we take it from there.

Now that we know what fakedata does, we can talk about improving its
performance.

## Why am I doing this?

A few days ago, I found myself thinking "so how fast is fakedata, really?".

The question caught my attention immediately because it generated (pun _not_
intended) two intriguing follow-up questions:

- [How do I get a sense of fakedata performance?](#measure-it)
- [How do I speed this up?](#improve-it)

The program had always felt fast enough so I didn't know if fakedata could
generate hundreds, thousands, or millions of rows per second.

Also, fakedata is a glorified for loop that prints strings to the standard
output so I wondered what improving its performance meant in practice.

I had some guesses but, as one of my favourite programming principles goes,
[facts > assumptions]({{< ref
"/writing/my-programming-principles#facts--assumptions" >}} "my programming
principles - facts > assumptions"). Better to fact-check my assumptions before
changing any code.

What I'm trying to say here is that I had no practical reason to look into
fakedata performance, it just sounded _fun_.

That's also why I wrote this article. _For fun_.

That and the opportunity this experience would gave me to finally play around
with [datasette](https://datasette.io/).

## Measure it

The first thing I did was to measure fakedata current performance.

To keep things simple, I used [pv](http://www.ivarch.com/programs/pv.shtml):

```sh
$ fakedata noun -l 10000000 | pv -b -l -a -t -n >/dev/null
1.0001 1557682
2.0001 3129185
3.0003 4657761
4.0001 6248907
5.0001 7847980
6.0001 9439419
6.3562 10000000
```

What we're looking at here is a tuple "second, total_rows_count".

Yes, I agree. I misused pv. But this turned out to be a surprisingly simple way
to get a sense of how fast fakedata was.

In fact, what pv outputs here is already quite useful information: fakedata can
output roughly around 1.6 million rows per second.

Not bad for a totally un-optimised piece of code. Thanks Go!

It sounds really fast, right? Well, it depends 🙃

Let's compare fakedata to the yes command:

```sh
yes | pv -b -l -a -t -n >/dev/null
1.0001 79354880
2.0002 160619520
3.0000 242048000
4.0000 323410944
5.0002 404872192
6.0003 485579776
```

80 million rows per second! That's much much faster than fakedata.

Sure fakedata generates random output and the yes command just output yes. But
there are almost two orders of magnitude between the two programs: it's very
unlikely the random generation can explain all of this.

But, again, facts > assumptions.

I don't trust myself guessing. Even in such a trivial case like this one.

So I wrote this program:

```go
package main

import "fmt"

func main() {
	for i := 0; i < 10000000; i++ {
		fmt.Println("yes")
	}
}
```

and run it with pv:

```sh
./yes | pv -b -l -a -t -n >/dev/null
1.0000 1253526
2.0000 2810087
3.0000 4403191
4.0000 6087614
5.0000 7769993
6.0000 9448107
6.3433 10000000
```

12 million rows per second. Not quite as fast as yes but enough to tell us where
the problem is. No need for more elaborated diagnostic strategies.

It's quite obvious the data generation part doesn't contributed much to the
performance of the program.

It's writing to standard output that is "slow".

## Diagnose it

Because I was doing this for fun, I did run more elaborated diagnostics anyway.

Just an excuse to refresh my memory on Go tooling and check if there was
anything new.

I'm glad I did because I run into very interesting resources. More about this in
a second.

Right after writing the yes program, I decided to benchmark fakedata Generators.

Despite it's almost a decade old, [How to write benchmarks in
Go](https://dave.cheney.net/2013/06/30/how-to-write-benchmarks-in-go) was still
quite effective in refreshing my memory.

The benchmark confirmed generation time is a negligible part of the process.

After that, I decided to profile the program. Again, I didn't really need to.
The diagnosis was quite clear.

If you're not familiar with diagnostics in Go, you may want to start from
[here](https://go.dev/doc/diagnostics) for some basic decisions about profiling
and tracing.

Go offers a variety of profiler (CPU, memory, and so on). They produce
[profiling data](https://pkg.go.dev/runtime/pprof) you can then inspect with a
program called [pprof](https://github.com/google/pprof/blob/main/doc/README.md)
(the Go team recommends to use it via the tool command: `go tool pprof`).

I used the CPU profile to confirm that fakedata spends most of its time writing
to standard out.

The output looked like this:

```sh
$ go tool pprof cpu.pprof
Type: cpu
Time: Oct 17, 2022 at 2:58pm (CEST)
Duration: 7.57s, Total samples = 5.89s (77.80%)
Entering interactive mode (type "help" for commands, "o" for options)
(pprof) top5
Showing nodes accounting for 5.80s, 98.47% of 5.89s total
Dropped 37 nodes (cum <= 0.03s)
Showing top 5 nodes out of 23
      flat  flat%   sum%        cum   cum%
     5.76s 97.79% 97.79%      5.76s 97.79%  syscall.syscall
     0.04s  0.68% 98.47%      0.04s  0.68%  runtime.pthread_cond_wait
         0     0% 98.47%      5.76s 97.79%  fmt.Fprintln
         0     0% 98.47%      5.76s 97.79%  fmt.Println
         0     0% 98.47%      5.76s 97.79%  internal/poll.(*FD).Write
```

There are other things going on but fakedata spends almost 98% of its time
writing to standard output.

If you're looking to go deeper into profiling, [The Busy Developer's Guide to Go
Profiling, Tracing and
Observability](https://github.com/DataDog/go-profiler-notes/blob/main/guide/README.md)
is an amazing resource. The writing is very engaging. Highly recommended.

OK, now that we know this is an I/O problem, how do we improve fakedata
performance?

## Improve it

There are many ways to improve the performance of a program and a strategy that
stands out, especially while dealing with completely naive implementations, is
to do less of whatever you're doing.

This strategy fits perfectly in this context.

Since I had never even thought about performance while writing fakedata (it's
never been and still isn't a strict requirement), the implementation was as
naive as possible:

- Parse input to figure what we need to generate.
- For each loop step, print a "row" of generated data.

The problem with this approach is that the overhead of asking the host OS "hey
can I write this to stdout?" adds up pretty quickly.

When it comes to I/O, doing less often means buffering. The idea is that we hold
some of the data we want to write in a buffer so that we can ask the host OS
less often "hey can I write this to stdout?".

It's such a common strategy, most languages have buffered I/O standard
libraries. Go, being go, has one called [bufio](https://pkg.go.dev/bufio).

That's what I needed to do, a tiny change:

```diff
--- a/main.go
+++ b/main.go
@@ -1,6 +1,7 @@
 package main

 import (
+       "bufio"
        "bytes"
        "fmt"
        "io"
@@ -171,12 +172,15 @@ func main() {
                os.Exit(1)
        }

+       fOut := bufio.NewWriter(os.Stdout)
+       defer fOut.Flush()
+
        if *streamFlag {
                for {
-                       fmt.Println(columns.GenerateRow(formatter))
+                       columns.GenerateRow(fOut, formatter)
                }
        }
        for i := 0; i < *limitFlag; i++ {
-               fmt.Println(columns.GenerateRow(formatter))
+               columns.GenerateRow(fOut, formatter)
        }
 }
```

The [whole
commit](https://github.com/lucapette/fakedata/commit/4fdd1043234374121ddea555d34c3f229e625e33)
is not much longer than this.

So how much faster is fakedata now? Let's see:

```sh
fakedata noun -l 100000000 | pv -b -l -a -t -n >/dev/null
1.0000 12183541
2.0000 24461371
3.0000 36475245
4.0000 48809688
5.0000 61222503
6.0000 73528343
```

A pretty remarkable improvement for the effort. 12 million rows per second:
Fakedata is now almost 10 times faster than it was before.

It's enough of a change that it made we wonder how many less systems calls is
fakedata doing now compared to the previous naive implementation.

I used [strace](https://strace.io/) to count writes to stdout since the Go
profiler doesn't provide call counts (due its sampling nature).

Here's the writes count before the change:

```sh
$ strace -e write -c ./fakedata -l 100000 noun > /dev/null
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
100.00    0.333190          16     19785           write
------ ----------- ----------- --------- --------- ----------------
100.00    0.333190          16     19785           total
```

and after the change:

```sh
$ strace -e write -c ./fakedata -l 100000 noun > /dev/null
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
  0.00    0.000000           0       227           write
------ ----------- ----------- --------- --------- ----------------
100.00    0.000000           0       227           total
```

The difference between calls checks out!

## Visualise it

Using pv felt nice because it give me a good sense of fakedata throughput
without having to write a single line of code.

The output though was not very readable. I can't blame pv for this, it's
actually quite nice I could gather the data I needed in a few minutes with it.

Let's look at the output one more time:

```sh
fakedata noun -l 100000000 | pv -b -l -a -t -n >/dev/null
1.0000 12157884
2.0000 24448066
3.0000 36657310
4.0000 48953396
5.0000 61313893
6.0000 73745138
# more of this
```

This isn't very readable. The first column is just a "tick" every second and the
second column is a growing, large (therefore hard to read) number.

You don't really get a sense of how the throughput is evolving over time: is it
always the same? Are there big drops? Maybe spikes now and then?

It's hard to answer these questions at glance. But if I could plot this, it
would be much simpler.

Enter [datasette](https://datasette.io/).

Honestly it's not easy to describe what datasette does (I think even its own
author has trouble with that) but, in my words, it's an amazing tool that helps
with:

- Explore datasets you know nothing about
- Clean-up and visualise small datasets

It's pretty much perfect for this use-case so what I wrote a
[perf.sh](https://github.com/lucapette/fakedata/blob/4fdd1043234374121ddea555d34c3f229e625e33/scripts/perf.sh)
that does the following:

- It runs fakedata for a while (in different modes) with the pv command I used
  in this article.
- It loads pv output into a sqlite database using
  [sqlite-utils](https://sqlite-utils.datasette.io/en/stable/), an amazing
  little datasette companion tool which makes working with CSV data very easy.
- It also saves into the database two queries that make the data easier to plot.
  More about this in a second.

I plotted the data using
[datasette-vega](https://datasette.io/plugins/datasette-vega), a little plugin
that uses the amazing [Vega](https://vega.github.io/) library to plot data.

The graphs look like this:

![fakedata improved perf graph](/img/fakedata-improved-perf.svg)

and it's backed by the following query:

```sql
SELECT
  tick,
  rows_done - lag(rows_done, 1, 0) OVER (
    ORDER BY
      tick
  ) rows_done_so_far
FROM
  generator
ORDER BY
  tick
```

It a relatively simple query if you're familiar with the [lag
function](https://www.sqlite.org/windowfunctions.html).

I had never worked with datasette and its ecosystem before looking into fakedata
performance.

I'm very glad I did because Datasette turned out to be among the most productive
tools I have ever came across in my career.
