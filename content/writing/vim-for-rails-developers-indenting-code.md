---
tags:
  - vim
  - rails
date: "2011-03-31T00:00:00Z"
description:
  How you can indent your code preserving the cursor position with a Vim
  mapping
keywords: vim, rails, indenting code, tip, map, mapping
title: "Vim for rails developers: indenting code"
---

I use Vim mainly to write code and, in order to maintain some sanity, I like
my code indented. I like to have a mapping for indenting the entire file I'm
editing. My first attempt to solve this simple problem was:

{{< highlight vim >}}
map <silent> <F5> gg=G<CR>
imap <silent> <F5> <Esc> gg=G<CR>
{{< / highlight >}}

When I pressed &#060;f5&#062;, both in normal and insert mode, I got all the
current file indented. The process is very simple, basically it works in the
following way:

- _gg_

  [go to the first line](http://vimdoc.sourceforge.net/htmldoc/motion.html#gg")

- _=G_

  [indent](http://vimdoc.sourceforge.net/htmldoc/change.html#=) until
  [G](http://vimdoc.sourceforge.net/htmldoc/motion.html#G") that is the
  [motion](http://vimdoc.sourceforge.net/htmldoc/motion.html) parameter of the
  _&#061;_ command.

Well this was cool. It just worked fine and made all the current file
indented. I was used to the just mentioned mappings for a long time but,
recently, I was annoyed by a little issue this mapping had. Practically, when
I pressed &#060;f5&#062; I lost the cursor position and I did not like that.
So, yesterday I reached the WTF point and decided to solve this problem. After
a few attempts with the
[jumplist](http://vimdoc.sourceforge.net/htmldoc/motion.html#jumplist) and
with the
[changelist](http://vimdoc.sourceforge.net/htmldoc/motion.html#changelist), I
found a solution I really like. Eventually, I came up with the following:

{{< highlight vim >}}
map <silent> <F5> mmgg=G`m^ imap <silent> <F5> <Esc> mmgg=G`m^
{{< / highlight >}}

that works exactly as the previous solution but, in addition, it brings the
cursor back where it was before you pressed &#060;f5&#062;. Now I use the
[mark](http://vimdoc.sourceforge.net/htmldoc/motion.html#mark) command, and
the sequence is:

- _mm_

  Put the current position in the _m_ mark.

- _gg_

  As the previous solution.

- _=G_

  Here too.

- _`m_

  Bring the cursor to the position stored in the _m_ mark.

- _^_

  Go to [the first non-blanck character of the
  line](http://vimdoc.sourceforge.net/htmldoc/motion.html#^)

So, nothing magical but useful. And I'd be glad to see other possible
solutions.

_Update:_

Thanks to a comment, the above mentioned mapping can be
refactored in the following way:

```vim
map <silent> <F5> mmgg=G'm
imap <silent> <F5> <Esc> mmgg=G'm
```

Indeed, I've already [updated](https://github.com/lucapette/vimfiles/commit/9c1bafee15be2a4b47e3421e0537ff9ed1e3fb4f) my vimrc.
