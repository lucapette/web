# Rust

Starting in December 2022, I've been learning
[Rust](https://www.rust-lang.org/).

## General observations

Docs immediately feel nice (this is very different from last I looked into this).

Cargo, the package manager, drives everything. I like that a lot.

`let mut` reads strange if you're used to Kotlin's `var` and `val` keywords.

Compiler errors and warnings feel very ergonomic. The best I've seen so far in
any language.
[Here](https://blog.rust-lang.org/2018/12/06/Rust-1.31-and-rust-2018.html#non-lexical-lifetimes)
is an amazing example of how the team cares about it.

The VS code extension seems very good (but a strange name eh).

prelude is a very intriguing name.

The syntax to declare arrays can contain capacity. That's very interesting!

Really interesting feature (words from the official book):

> Expressions do not include ending semicolons. If you add a semicolon to the
> end of an expression, you turn it into a statement, and it will then not
> return a value.

The First impact with ownership was not so bad. I was ready for not getting it
at all but it mostly makes sense to me:

- I'm also impressed with dangling pointers handling
- The slice type paragraph of the official has too many ref about upcoming chapters
- A little confused why slice is the ownership section. I guess I'm not getting everything after all.

Structs make a lot of sense to me. It looks a little odd how you define methods
on them at first but everything makes sense to me.

The way Rust does Option is so much better than other languages I'm used to.

Pattern matching is very nice. Of course it’s exhaustive!

The way code is organises in Rust feels Ruby-like (in a good way). I _love_ the
`src/main` vs `src/lib` convention.

OK, one thing does annoy me about Rust. It's the abbreviation mania a là Golang. WHY.

Adding strings together feels a little cumbersome. I guess it’s a trade off of the powerful borrow checker.

Rust infers the type of maps from the first insert operation? That’s interesting :)

Strings feel strange. So that’s the first weird things about Rust in 8 chapters

The way error handling works feels just right to me. Syntax is again a little
verbose but I love the way propagation works.

Lifetimes are not clicking:

- the syntax confuses me because I've done lots of Java/Kotlin/TypeScript.
- I see the reasoning behind it. Makes me think code can be "actually safe" but
  also feel like I have to practice a lot. Note to self: research for some good
  blog post about it.
- It's also the first totally new concept. So there's that.

Colocating tests feels strange? I don’t really care much (and I like the
distinction between public and private testing) but files are gonna get long
aren't they?

The cargo test runner is really fast and it has a nice api.

The [CLI chapter](https://doc.rust-lang.org/book/ch12-00-an-io-project.html) of the official book is really fun to follow along.

`eprintln!` such a practical approach.

The closure syntax feels familiar (because ruby?) but I'm confused by the fact I have to declare a closure as mutable. That doesn’t make sense to me. Feels like a borrowed concept. Pun intended.

But move is a funny keyword :)

Smart pointers seem though to get. Especially this whole defer coercion thing.
Surely I’ll have to do another pass at this.
