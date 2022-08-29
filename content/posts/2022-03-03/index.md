---
uid: 'golang-packages-modules-part-one'
title: 'Golang Modules And Packages'
category: 'Golang'
draft: false
tags:
  - golang
  - go
  - golang packages
  - golang modules
excerpt: 'A quick introduction to using modules and packages in golang.'
---

I am learning Golang for the past few months whenever I get some free time. The excitement of exploring a whole new world of
a programming language is amazing, especially because I've been only working with JS/TS for the last
5 years.

A big difference that I felt coming from JS was that a module in Go is a set of files and directories (called packages) whereas a module in JS can be used for a file, a library, or an application. It took me some time to get used to this.

To start a new project in Go, you initiate a new module like this.

```shell
mkdir my-project
cd my-project
go mod init github.com/tusharf5/my-project
```

This would create a new file at the root of the project named `go.mod`, this is like package.json for javascript projects and is
used to track all the dependencies. This is what the file would look like (The Go version might be different for you).

```go
// go.mod
module github.com/tusharf5/my-project

go 1.17
```

To group files together, you use Go `packages` and a directory is automatically considered as a package by Go.

Apparently, it's not a common practice in Go projects to start with a nested directory structure that you might find in some other languages. For eg. `src/modules/users/models.js`. It is also recommended to keep the directory structure as flat as possible.

```
<my-project>
  -<cli>
    --cli.go
  -<internals>
    --internals.go
  --main.go
  --go.mod
```

By creating two directories, cli and internals you've basically created two packages to your `my-project` module.

When you create a new file in any of those two directories, you'd use that directory name as the package name.

```go
// internals.go
package internals

import "fmt"

func HelloFromInternals() {
 fmt.Println("HelloFromInternals")
}
```

You can import local packages in other packages. All the exported members of that package are visible to the file that's importing it.

```go
// cli.go

package cli

import (
 "fmt"

 "github.com/tusharf5/my-project/internals"
)

func HelloFromCli() {
 fmt.Println("HelloFromCli")

 internals.HelloFromInternals()
}
```

Here, we are importing the cli package.

```go
// main.go
package main

import "github.com/tusharf5/my-project/cli"

func main() {
 cli.HelloFromCli()
}
```

If you run `go run main.go` now, it will output -

```shell
HelloFromCli
HelloFromInternals
```

That was a quick introduction to using modules and packages in Go. We've not even scratched the surface yet. There's much more to
and we'll explore it in a different blog post leaving this one short and simple.

Thanks for reading :)
