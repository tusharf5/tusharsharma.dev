---
title: 'Git - Squash Multiple Commits Into One'
category: 'DevBits'
uid: 'git-squash'
draft: false
tags:
  - git
  - sourcetree
excerpt: 'A super useful git feature that I just learnt ⛳️'
---

A few days back I was working on a feature ⛳️ and I realized that I commit too often in git 😟. I don't know if it's bad or not but
My feature branch had only one big commit which had the major part of the feature and like 10 other small commits
and each one modified like one or max two lines.

I knew about the **Git Squash** feature but I had never really used it. So to
avoid the embarrassment on sending a PR with 12 one liner commits.
I first played around with it on another git repo and once I felt comfortable using it, I tried it on my feature branch which worked pretty well 💪🏼

## Git Squash

`git rebase -i HEAD~3` - If you want to squash last three commits

Then it will show an editable list of those commits as shown below:

```shell
pick small change
pick mini fix
pick task done
```

Now you need to rename `pick` everywhere to `squash` except for the commit that you want to keep.

```shell
squash small change
squash mini fix
pick task done
```

Save the file and that's it. Now instead of 3 different commits you only have one i.e `task done` and it has the work of all three of them.

If you have already pushed some work to remote you might **not want to** but still can do `git push -u -f origin feature/abc`.

**Be careful while using the -f parameter. It will force update your remote repository.**

## Thank you 👍🏻
