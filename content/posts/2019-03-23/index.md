---
title: 'Managing your Command Line Like a Boss 😎'
category: 'DevBits'
uid: 'managing-command-line-like-a-boss'
draft: false
tags:
  - shell
  - bash
  - bash_profile
  - bashrc
excerpt: "A handful of gotchas that I've learned over the years working with command shells 🐚 on a regular basis"
---

I'm no command line expert but I use it daily. For almost a year and a half
I was using it in a way which I assume most of us would be using it.

- Run commands 🤴
- Run scripts 📜
- Git related stuff 📟
- Login to remote servers 🗄
- View files 📋
- Quick editing files 📠

But there is so much more that we can do with our terminals.
Even with a few one time customizations you can do the following.

- Run startup scripts for shell ⛓
- Create aliases or shortcuts 🎏
- Store environment variables 🔑
- To give it a more personalized touch 🏯

> Your tools are one of the most important factors which make you more efficient in your everyday work.
> You should definitely use more and more tools to up your game.

Whenever a user logs into a system a lot of background processes and **initialization files** are loaded into the system.
A user has a home directory to create and store files that belongs to that user. But a lot of times a we also need
to load some user specific configurations and processes to create its **working environment** which is determined by **initialization files**.
These initialization files are defined by the user’s startup shell, which can vary depending on the operating system.
The default initialization files in your home directory enable you to customize your **working environment**.

> **Important** - The following blog is written for OS X. It might not work for other OS.

## How to create your own initialization files ?

You don't have to create your own initialization files. We get a number of different files located in hour user's home directory.
For example `~/.bash_profile`, `~/.profile` , `~/.bashrc`, `~/.bash_aliases`, etc. We can edit these files to add our initialization
scripts, environment variables, aliases, etc.

The only thing we need to know is **when do we use which file?** as each file serves a different purpose and is loaded
in a slightly different way from other files. In order to understand that we need to know how these configuration files are loaded.

## Types of shells and How they are loaded ?

_Login Shell_ - A Login shell is started after a successful login, using `/bin/login`, by reading the `/etc/passwd` file. Login shell is the first process that executes
under our user ID when we log in to a session.

When **Bash** is invoked as a Login shell;

1. Login process calls `/etc/profile`
2. `/etc/profile` calls the scripts in `/etc/profile.d/`
3. Login process calls one of `~/.bash_profile`, `~/.profile` and `~/.bash_login`

_Non Login Shell_ - A Non login shell is started by a program without a login. In this case, the program just passes the name of the shell executable.
For example, for a Bash shell it will be simply **bash**.

When **bash** is invoked as a Non login shell;

1. Non-login process(shell) calls `~/.bashrc`

> In OS X, Terminal by default runs a login shell every time
> **Sourcing** a file (by typing either `source` filename or `.` filename at the command line), the lines of code
> in the file are executed as if they were printed at the command line.

## When to use .bash_profile ?

Your `.bash_profile` should simply source your `.bashrc` so you don't have to repeat configurations in different files.
It can also contain stuff(commands, env variables, etc) that you want to run during the startup of a login shell.

```shell
# Add stuff here which you want to run when a new login shell(session) starts

# It should load .bashrc file
if [ -f ~/.bashrc ]; then
   source ~/.bashrc
fi

```

## When to use .bashrc ?

Your `.bashrc` should source your `.profile` and `.bash_aliases` and contain stuff that you want to
run during the startup of a non login shell.

```shell
# Add stuff here which you want to run when a new non-login login shell starts
# It should now output anything

# Loads .profile
if [ -f ~/.profile ]; then
   source ~/.profile
fi

# Loads .bash_aliases
if [ -f ~/.bash_aliases ]; then
   source ~/.bash_aliases
fi
```

## When to use .bash_aliases ?

You should put all your bash _alias_ definitions into a separate file like `~/.bash_aliases`, instead of
adding them in the `~/.bashrc` or `~/.bash_profile` file directly.

```shell
#.bash_aliases

alias update='sudo -- sh -c "/root/bin/chk_disk && dnf update'
alias ec2-prod='ssh ec2-user@ec2.amazon.com -i /path/to/special/privatekey/amazon.pem'
alias check-brew='brew upgrade && brew update && brew cleanup -s'

# EOF
```

Now you can type `check-brew` in your shell and it will run the corresponding command(s) defined above.

```shell
> check-brew
... upgrading brew
... updating brew packages
... cleanup brew
>
```

## When to use .profile ?

The `.profile` should contain all the env variables and you can also modify the path variable here.

```shell
# Set Path Variable here
export PATH="$HOME/.cargo/bin:$PATH"

# nvm initialization should also come here

# set variable only for current shell
NODE_ENV="development"

# set it for current shell and all processes started from current shell
export NODE_CONFIG_ENV="local"

# EOF
```

> Bash only reads the first one out of three files (**.bash_profile**, **.profile**, **.bash_login**).
> Meaning, if you have a **.bash_login**, then both **.profile** and **.bash_profile** will
> be mysteriously ignored. So make sure you don't have a **.bash_login** file.

---

| Filename      |                              Tasks                               |
| ------------- | :--------------------------------------------------------------: |
| .bash_profile |           loads login shell stuff, calls .bashrc file            |
| .bash_aliases |                  command aliases and shortcuts                   |
| .bashrc       | loads .profile and loads .bash_profile and non login shell stuff |
| .profile      |                  env variables, path variables                   |

---

#### References

- [.bash_profile and .bashrc difference](https://apple.stackexchange.com/questions/51036/what-is-the-difference-between-bash-profile-and-bashrc)
- [difference between login shell and non-login shell](http://howtolamp.com/articles/difference-between-login-and-non-login-shell/)
