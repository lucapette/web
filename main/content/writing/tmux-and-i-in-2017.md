---
tags:
  - tmux
date: "2017-03-26T00:00:00Z"
description: Why and how I use tmux in 2017
keywords: tmux, productivity, programming
title: Tmux and I in 2017
aliases:
  - /tmux-and-i-in-2017
---

Writing [Getting started with Vim](/writing/getting-started-with-vim) taught me
an interesting lesson. I had some notes on the subject and I spent more time
trying to decide if it was worth turning them into an article than actually
doing so. I did publish it and the response was great, many people read the
article and I got good feedback. It made me happy because it was unexpected. My
takeaway is that I should not try to guess if people would care or not about
what I write. I'm not good at it and, after all, I enjoy writing so much I can
afford not to care about the success of my writing. The joy of writing makes it
all worth it. A few weeks ago I had a look at my tmux configuration and workflow
after a long time and took some notes along the way. This article is an expanded
version of those notes.

## What's tmux?

[tmux](https://tmux.github.io/) is a terminal multiplexer. To be honest, if I'd
be hearing this for the first time, my reaction would be "OK, what is it?". I
like [wikipedia](https://en.wikipedia.org/wiki/Tmux)'s definition:

> tmux is a software application that can be used to multiplex several virtual
> consoles, allowing a user to access multiple separate terminal sessions inside
> a single terminal window or remote terminal session.

You can create new sessions, attach to existing ones and detach from the current
session. Tmux keeps track of your detached sessions in the background so that
you can attach to them at a later point. The feature comes handy if you think of
sessions as projects; I'll explore this more later in the article.

## Why tmux?

When it comes to tooling, why use X instead of Y is pretty personal, so all I
can offer is _my_ answer. As a young programmer, I had a fanatic aversion to the
mouse. I stayed away from it as much as I could. We're creatures of habit and,
even though my childish aversion is gone, the habit is not. Programming still
means using _only_ the keyboard for me. And when I write code, I always change
the smallest amount of code. That came with experience. I change one line at a
time or less if I can. I need feedback at every change: most of the times that
means running a specific command or executing tests. Even though I tried many
automated runners for Vim, I can't help but manually switch windows to check
things. It's a simple workflow and I like to craft the commands on my own. I
don't want my editor to cleverly decide for me what happens when I save a file
(only one exception: automating reloading of React applications. For some
reason, I love that). I use Vim for everything I program and I do everything
else from a zsh shell. As my workflow for programming consists of:

- one vim instance and,
- one or more zsh instances,

tmux is what makes this workflow possible for me nowadays. That's why I consider
it _indispensable_. It allows me to move shell sessions around, rearrange them,
open new ones on the fly. I can resize windows when I need more space. And I
only need the keyboard for that. I may spend an entire pomodoro session (in
English that's a 25-minute session) without ever touching the mouse. Since I can
scroll windows up and down with the keyboard only, I find myself creating tmux
sessions even when I don't need multiple windows. I can stay mouse free as long
as I'm in the terminal.

That's in short why _I_ use tmux. If you're new to tmux and you want to give it
a try, my advice is to do so only if your workflow is heavily based on shell
sessions. I don't think I would invest in learning it otherwise.

## Modern configuration with tmp

Recently I've ran into a project called [Tmux Plugin
Manager](https://github.com/tmux-plugins/tpm) and I'm happy it happened. The
tool is easy to install and it simplifies your existing tmux configuration a
great deal. For those who are new to tmux, it can act as a guide. Over the past
few years, some patterns on how to configure tmux emerged. Some plugins are
helpful in that sense, because they're built with those patterns in mind.

Installing the plugin manager is a simple procedure, you can read it
[here](https://github.com/tmux-plugins/tpm#installation). Once you're setup, I
suggest you install the following plugins:

- [sensible](https://github.com/tmux-plugins/tmux-sensible) It's inspired by the
  interesting [vim plugin](https://github.com/tpope/vim-sensible) and, as the
  documentation explains, it's a set of basic settings "everyone can agree on".
- [pain control](https://github.com/tmux-plugins/tmux-pain-control) Being able
  to control panes with comfort is important for tmux users; tmux wouldn't be
  tmux without panes. Despite the strange name, pain control provides you with a
  good set of pane navigation bindings. These bindings are widely used in the
  tmux community. If you're a tmux user, chances are you're already using them,
  so installing the plugin will simplify your configuration. The bindings are
  inspired by Vim navigations which makes the context switch for Vim user
  effortless.
- [battery](https://github.com/tmux-plugins/tmux-battery) Battery is a small
  plugin that shows battery percentage (or fancy icons) in tmux `status-right`.
  It's a little plugin but it's annoying to have the same feature without it, as
  you need a small script to extract the information from your system. Most tmux
  users rely on such a feature because they end up spending most of their time
  in a tmux session. Being able to check the battery status without dealing with
  scripting is a big plus.

The GitHub organisation [tmux-plugins](https://github.com/tmux-plugins) has many
other plugins you can find interesting, so I suggest you have a look.

## Handling projects with tmux

My workflow is based on the concept of project folder. At least, I'm used to
calling it so; I guess you can call the same concept with different names.
Workspace comes to my mind. The idea is that all the code related to the same
project lives under the same root folder. Ideally, that's one repository for
your version control system of choice. My projects, including my writing, are
all organised around this idea. I assume it's a pretty common way of handling
different projects. Please let me know if you're doing it differently, I find
the topic fascinating.

Since the concept is so central to my workflow, I wrote a small shell script to
handle my projects. Here is the script:

```sh
#!/bin/bash

set -e

source ~/.zsh/functions.zsh

if [ -z "$1" ];
then
  tmux ls 2>/dev/null
  exit
fi

if [ -z "$TMUX" ]
then
  for project in $(projects)
  do
    name=`basename $project`
    if ! tmux has-session -t $name 2>/dev/null; then
      tmux new-session -s $name -c $project -d
      tmux send-keys "cd $project" 'C-m' 'C-l'
    fi
  done
  tmux a -t $1
else
  tmux switch -t $1
fi
```

Calling the script with no arguments lists the available tmux sessions. I use it
rarely, but it's still kind of useful. If you pass `foo` as an argument, `t`
will switch to the session `foo`. As you can see, it's rudimentary: it creates
all the sessions at once. I see no point in complicating it as the output of
`$(project)` changes rarely. It does the job for me: I can switch between
projects using a simple command. And, since all the sessions are created at
once, the switch is instantaneous. In my experience, speed is a common trait of
simple solutions with reasonable constraints.

Sourcing the `functions.zsh` is necessary because I need the following function:

```sh
# List all my code dirs
projects() {
  ls -d ~/src/*/ ~/src/github.com/lucapette/*/ | grep -E -w -v '(bin|pkg|[^/]+\.[^/]+)\/'
}
```

The function returns all the directories of what I consider projects. With the
exception of [Go](https://golang.org) code (which leads to some ugly grepping
too), I have all my projects in `$HOME/src`. I'm a zsh user and I'm used to
autocompleting _everything_, so I wrote a small script for `t`:

```sh
#compdef t

lines=("${(@f)$(projects | xargs -n1 basename)}")

_arguments "1: :($lines)"
```

I don't remember how this works , as I wrote it a while ago. It does work
so I thought it was good enough to share. My
[dotfiles](https://github.com/lucapette/dotfiles) repository contains all my tmux
configuration if you're curious. The `projects` function, the `t` script and the
`CDPATH` feature give me the comfort I need to jump around projects.
