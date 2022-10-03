---
favourite: true
tags:
  - golang
  - testing
date: "2017-05-18T00:00:00Z"
description: how I do end-to-end testing of Go CLI applications
keywords: golang, testing, integration tests, end to end tests
title: Writing integration tests for a Go CLI application
aliases:
  - /writing-integration-tests-for-a-go-cli-application
---

I've recently open sourced a small Go CLI application for random data
generation.

I'm working on an application for which I continuously need testing data and
couldn't find exactly what I was looking for. So I did what every developer
would do in this situation, I decided to write myself.

CLI applications are my favourite use case for Go so I knew I'd enjoy writing
it.

A few weeks after I released [fakedata](https://github.com/lucapette/fakedata),
[Kevin Gimbel](https://twitter.com/_kevinatari) found a
[bug](https://github.com/lucapette/fakedata/issues/12).

The issue was a direct consequence of a feature we had introduced together a
few hours before.

It was an obvious regression: fakedata clearly had no tests covering the feature
end-to-end.

This situation made me think about how to test a CLI application end-to-end. I
wanted to do something like the following:

- Create a binary of the app.
- Run the binary with some specific argument.
- Assert correct behaviour.

I managed to get it done [here](https://github.com/lucapette/fakedata/pull/14)
and decided to share the key ingredients of this simple and effective way of
writing integration tests for a Go CLI application.

I created an example application for the sake of the discussion, it's available
[here](https://github.com/lucapette/go-cli-integration-tests).

I use `make` to build my Go applications, it suits the task well and it gives me
a very short command to build an entire project (as `build` is the de-facto
default target, building a project is as easy as typing `make` and hitting
enter).

In this case, the
[Makefile](https://github.com/lucapette/go-cli-integration-tests/blob/main/Makefile)
builds a tiny program called `echo-args`. The program works like this:

```sh
$ echo-args # no arguments, no output
$
$ echo-args ciao # it prints each argument on its own line
$ ciao
$ echo-args ciao hello
ciao
hello
$ echo -shout ciao # it shouts at you if you ask it to
CIAO
```

Four different test cases should cover everything. But first we need to build
the binary. Here is the code I used for that:

```go
func TestMain(m *testing.M) {
	err := os.Chdir("..")
	if err != nil {
		fmt.Printf("could not change dir: %v", err)
		os.Exit(1)
	}
	make := exec.Command("make")
	err = make.Run()
	if err != nil {
		fmt.Printf("could not make binary for %s: %v", binaryName, err)
		os.Exit(1)
	}

	os.Exit(m.Run())
}
```

Two things are worth mentioning:

- [TestMain](https://golang.org/pkg/testing/#hdr-Main) is the recommended way to
  do setup and teardown of tests.
- `os.Chdir("..")` is _ugly but practical_ (a bit like Go you may want to say).
  It works but it's neither a general nor a robust solution.

Since this code runs before any of the tests, I can assume there's going to be a
binary of the CLI application I can use to run the program and assert the
correctness of its output. Here is the test I wrote to cover the four cases:

```go
func TestCliArgs(t *testing.T) {
	tests := []struct {
		name    string
		args    []string
		fixture string
	}{
		{"no arguments", []string{}, "no-args.golden"},
		{"one argument", []string{"ciao"}, "one-argument.golden"},
		{"multiple arguments", []string{"ciao", "hello"}, "multiple-arguments.golden"},
		{"shout arg", []string{"--shout", "ciao"}, "shout-arg.golden"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			dir, err := os.Getwd()
			if err != nil {
				t.Fatal(err)
			}

			cmd := exec.Command(path.Join(dir, binaryName), tt.args...)
			output, err := cmd.CombinedOutput()
			if err != nil {
				t.Fatal(err)
			}

			if *update {
				writeFixture(t, tt.fixture, output)
			}

			actual := string(output)

			expected := loadFixture(t, tt.fixture)

			if !reflect.DeepEqual(actual, expected) {
				t.Fatalf("actual = %s, expected = %s", actual, expected)
			}
		})
	}
}
```

The tests use two of my favourite Go testing practices:

- Golden files.
- [TableDrivenTests](https://github.com/golang/go/wiki/TableDrivenTests).

While Table Driven tests officially documented, I couldn't find anything about
golden files. The basic idea is to:

- Store on disk (in so-called golden files) the expected (and possibly complex)
  output of the code under test.
- Then use a simple comparison of the actual output and the content of
  corresponding golden file.

It's a good practice to use a command line flag to automatically update the
golden file when the specified behaviour changes:

```sh
go test integration/cli_test.go -update
```

and then check the golden file before running the tests again. Here is the
output on my machine:

```sh
go-cli-integration-tests main ➜ make test
go test ./...
?       github.com/lucapette/go-cli-integration-tests/cmd       [no test files]
ok      github.com/lucapette/go-cli-integration-tests/integration       0.267s
```

While this is a trivial example, I think it's still pretty amazing that building
the binary, running it four times, loading four files, and asserting the
correctness of the problem takes as little time as `0.267s`.

The integration tests run nicely on [GitHub
Actions](https://github.com/lucapette/go-cli-integration-tests/actions) as well.

Thanks to TableDrivenTests, covering more use cases is simple. Say `echo-args`
now accepts a `reverse` flag, we can test the new behaviour with one more line:

```go
tests := []struct {
		name    string
		args    []string
		fixture string
	}{
        // existing tests not shown
		{"reversed", []string{"--reverse", "ciao", "hello"}, "reversed.golden"},
	}
```

I **really** like it takes so little to test a relatively complex behaviour.

The tests make only two assumptions: how to build the binary (running `make` in
a specific directory) and the name of the binary.

If you would change the internals of the program completely, the tests would
still be untouched:

> The tests need to change only if the behaviour of the program changes

Which is the **only** kind of testing I'm comfortable with.

To stress the point of this benefit even more: the binary doesn't even have to
be a Go program :)

I enjoy using this technique, hopefully you will too. Happy testing with Go!
