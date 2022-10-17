---
title: "Improve Fakedata Performance for Fun"
date: 2022-10-17T08:53:37+02:00
tags:
  - go
  - fakedata
description: A good excuse to play around with some interesting tooling
keywords: golang, fakedata, performance, strace, pprof, datasette
draft: true
---

## Why am I doing this?

## Fakedata quick primer

- we know it’s not optimised
  - template vs not via perf script
    - template is half as fast. I think because of functions but no point in guessing
    - 1.2m sounds really fast but have you seen the yes command? It’s 80x faster (not accurate, we care about ballpark).
    - So how faster can we make fakedata? That’s the question
  - so we’ll look for things using profiling (reason comes from definition link literature). A quick aside on pprof:
    - Go runtime provide pprof data. What’s pprof?
      - cli app in go that viz data in profile.proto files
      - we’ll use to create a graph call

## Measure

- profile
  - I tried to profile both but all I got was waiting time in sys calls. Of course.
  - Because it’s mostly I/o calls, buffered I/o will give us less sys calls
    - [Workshop material on optimizing go programs](https://github.com/sathishvj/optimizing-go-programs#file-io)
    - [strace run for fakedata · GitHub](https://gist.github.com/lucapette/526147688a1b4f3c0e77f5294429cfd7)

## Improve

- Use bufio and call it a day works
- show results with datasette

- literature
  - good starting point for definitions [Diagnostics - The Go Programming Language](https://go.dev/doc/diagnostics)
  - this is old but useful in practice [Profiling Go Programs - The Go Programming Language](https://go.dev/blog/pprof)
  - the writing is very engaging [go-profiler-notes/README.md at main · DataDog/go-profiler-notes · GitHub](https://github.com/DataDog/go-profiler-notes/blob/main/guide/README.md)
