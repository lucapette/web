# Kotlin

Starting in March 2022, I've been learning [kotlin](https://kotlinlang.org).

## General observations

There are too many testing libraries. I guess you could say it's a young language.


The Inheritance syntax felt a little strange at first:

```kotlin
class Thing(words: List<String>)

class Subthing(words: List<String>, more: String): Thing(words)
```

There's some confusion around logging but I blame Java for it. [Kotlin
logging](https://github.com/MicroUtils/kotlin-logging) seems nice.

## Idioms

### Class methods

```kotlin
class Thing {
  companion object {
    fun hello() {
       println("hello")
    }
  }
}

Thing.hello() // hello
```

### Block method

I don't know if I have _invented_ this name but here's what I mean:

```kotlin
fun thing() = blockMethod {
}
```
It makes function definitions (especially with coroutines) very readable

## gRPC

I knew this was going to be a little painful. But in the end I got the thing up
and running in a couple of hours.

I also run into this: [Netty 4.1.75.Final HTTP/2 connection closures · Issue
#8981 · grpc/grpc-java · GitHub](https://github.com/grpc/grpc-java/issues/8981)
yay

## Ktor

This framework looks very interesting. Some ideas are fresh especially for the
java world. It feels like kotlin itself: in a sweet spot between rails (ruby)
and spring (java).

## Meta-programming

I wrote a configuration library (source is not open yet). Here’s how the API looks like:

```kotlin
@KonfigSource(prefix = "server")
data class ServerConfig(val host: String, val port: Int)

@Test
fun `can load a simple config`() {
  class App(konfig: Konfig) {
    val serverConfig by konfig.inject<ServerConfig>()
  }

  val konfig  = Konfig("src/test/resources/application.properties")
  val app = App(konfig)

  assertThat(app.serverConfig.host, `is`("localhost"))
  assertThat(app.serverConfig.port, `is`(4242))
}
```

The library can also do "fancy" nested configs. Writing it has been pretty
interesting but I had to figure out too much on my own. Docs aren't great for
meta-programming.

I played around with method extensions: [klogger.kt ·
GitHub](https://gist.github.com/lucapette/3dd7eca10c47de69864bac844b8d0d04).

## Coroutines

Coming from go didn't help. Maybe it even actively made it worse for me.

Goroutines felt much easier to start with (the pitch "add go to a function call"
is strong) but coroutines seem well thought through once you start to grasp what
structured concurrency is about