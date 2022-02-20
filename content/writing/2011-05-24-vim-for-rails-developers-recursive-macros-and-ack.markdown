---
categories:
- vim
date: "2011-05-24T00:00:00Z"
description: How to use vim macros and ack.vim to get done repetitive tasks
keywords: vim, rails, recursive macros, macro, ack, ack.vim
title: 'Vim for Rails developers: Recursive macros and Ack.vim'
---

Programmers are [lazy](http://c2.com/cgi/wiki?LazinessImpatienceHubris). We all
are. I think Rails programmers are lazier than others. I mean, Rails is an
opinionated software, that's why we all love it. It has made many choices for
us, so we can think about our problems. Now, if you're reading this article
there are chances you use Vim AND Rails. Well, you are my favourite kind of
programmers. You love simple ways to get things done but it's not enough to go
home on time. You want the
[pleasure](http://twitter.com/#!/lucapette/status/70826861772550144) too. And
one of the things I hate more is doing repetitive tasks. So, for example,
imagine the situation: you are refactoring some code and realize you don't
like a name of a method anymore because it doesn't express its intent in a
good manner. So, you think, OK if I rename this method I will have to change
it in many files: WTF. I know you could say "Hey, I can do that with the xxx
tool!". Yep, I know but I love Vim. And I think I'll use recursive macros
combined with ack.vim.

So, for those of us who are not familiar with this stuff I wrote down an
introduction to both topics:

## Macros

The story is simple: Vim gives you three wonderful commands to achieve the
execution of repetitive tasks:

- *q{0-9a-zA-Z"}*
  The q command stands for start to record and, as many other Vim commands, is
  register based. That means you can type qq to start recording a macro called
  q.

- *q*
  That stands for stop recording.

- *@{0-9a-zA-Z"}*
  That stands for execute the macro stored in the given register.

There is a command to re-execute the last executed macro, i.e. *@@*.
It's very useful and I recommend to map it, I've used _map Q @@_.

Well, just to make things as clear as possible. You have something like:

{{< highlight ruby >}}
@collection=@collection.map { |e| e.a_method }
@collection=@collection.map { |e| e.another_method }
@collection=@collection.map { |e| e.yep_another_again }
{{< / highlight >}}

and you want to get

{{< highlight ruby >}}
@collection.map! { |e| e.a_method }
@collection.map! { |e| e.another_method }
@collection.map! { |e| e.yep_another_again }
{{< / highlight >}}

Well, you can do it in a huge number of ways. A good way, without counting
macros, is (consider the cursor on the first line):

- *^df=3ea!&lt;esc&gt;* go to start of line ^ delete until an =, go to end of the third word and insert a !.
- j
- *^df=3ea!&lt;esc&gt;*
- j
- *^df=3ea!&lt;esc&gt;*

It is quite efficient and, as you have already noticed, there is a pattern
repeated three times, each per line. Obviously, this is a perfect situation
for macro and you can reach this:

- *qq*
_start recording_
- *^df=3ea!&lt;esc&gt;j*
_record the command_
- *q* stop recording
- j
- *@q*
_execute the macro recorded_
- j
- *@@*
_re-execute the macro_

OK, if you like Vim you'll like that. But we can do it better because Vim is
so wonderful to offer you the opportunity to store a recursive macro. So, you
can store a sequence of vim commands that includes the current macro like the
following:

- *qqq*
_clear the q register_
- *qq*
_start recording_
- *^df=3ea&lt;esc&gt;!j@q*
_record the recursive macro, note the @q_
- *q*
_stop recording_

And you get a recursive macro. It's very simple to use it, just put it on the
second line and type *@q*.

A very important thing you have to care about is _end of recursion_. A
recursive macro will end only if it reaches the end of file or runs into an
error. So when you think about a recursive macro don't forget to write in a
proper way. Thinking about our example I could have written the first part of
the command in the following way:

- *3dw*

but, because of recursion, I could have deleted things I did not mean to. I
used *df=* because it will end the recursion when Vim can't find a = in the
current line.

## Ack.vim

[Ack](http://betterthangrep.com) is grep for programmers. I won't stop
repeating it. If you don't use it you should stop reading this post and go to
install it. Well, Ack.vim is a very well-done interface plugin for ack, it
gives you some commands to work with and it opens a quickfix window when you
perform a search. Furthermore, I strongly suggest you map *:cn* and *:cp* in
normal mode, I have mapped them to &lt;c-n&gt; and &lt;c-p&gt; respectively.
Personally, I use ack a lot. It's a perfect tool, while you dig into source
code written by others. Another perfect use for ack is code maintenance.

## Recursive macros and Ack.vim together

Actually, I use Ack especially when I have to rename methods or take a look to
how a particular thing is used in a project. Just a couple of days ago, I
realized that we ([@g2d](http://www.twitter.com/g2d) and I) called a method
has_role? But we should have called it has_roles?. It's the perfect situation
for lazy programmers. You won't go through code just to rename a method. But
you know you have to :)

By the way, in that situation I choose to solve the problem in the following
way:

- vim app
Ack.vim searches, by default, in the current directory
- :Ack has_role \\?
I searched for has_role? references with ack.vim. (codepath.vim)
- *qqqeas&lt;esc&gt;:cn@qq*

I recorded a recursive macro that adds an s to the end of the current word,
searches for the next reference through ack and reapplies the macro. The end
of recursion in this case is the end of references, if you type :cn when there
isn't a next occurrence in the quickfix window then the macro will stop.

I made a very tiny video to give a better idea of how it works:

<iframe src="http://player.vimeo.com/video/24110806?title=0&amp;byline=0&amp;portrait=0&amp;color=80ceff" width="680" height="535" frameborder="0"></iframe>
