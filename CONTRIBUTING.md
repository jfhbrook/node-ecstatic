# Contributing Guidelines

## Code of Conduct

This is probably way overkill, but this is by far my most active project in
terms of contributions, and somewhere along the way I was convinced that it
was a good idea to have this in place sooner rather than later:

I want to provide a safe, healthy environment for all contributors/participants
regardless of gender, sexual orientation, disability, race, religion, etc.
As such, I don't tolerate harassment of participants in any form. In particular
this applies to my issues tracker, but also to any other means of communication
associated with this project that might come up. Anyone who violates these
basic rules may be sanctioned/banned/have-their-comments-deleted/etc by my
discretion.

Glad we cleared that up.

## Windows Users

Before you clone ecstatic you unfortunately have to configure git to not pull
certain files.

The test suite has a
[test](https://github.com/jfhbrook/node-ecstatic/blob/master/test/showdir-pathname-encoding.js#L28-L29)
for proper HTML entities encoding which depends on a character which is
[illegal in Windows](https://github.com/jfhbrook/node-ecstatic/issues/172).
This breaks `git clone` in Windows.

Until someone has an epiphany and thinks up of a character which is acceptable
on multiple platforms and effectively tests this behavior, here's how to get
around it:

1) Create and initialize your new repository (`<url>` is your fork):

```bash
mkdir node-ecstatic
cd node-ecstatic
git init
git remote add –f origin <url>
```

2) Enable sparse-checkout:

```bash
git config core.sparsecheckout true
```

3) Configure sparse-checkout by listing your desired and excluded sub-trees
   in .git/info/sparse-checkout (paste this into notepad):

```winbatch
/*
!test/public/<dir>
!test/showdir-search-encoding.js
!test/showdir-pathname-encoding.js
```

This configures git to pull everything but the offending directory and tests which depend on it being there.

4) Checkout from the remote:

```bash
git pull origin master
```

You can read all the details about sparse-checkout in the
[git documentation](https://git-scm.com/docs/git-read-tree#_sparse_checkout).

## Branching

Before working on your fix/feature/whatever, you should create a new branch to
work on. Do something like:

```sh
$ git checkout -b 'my-sweet-new-pull-request'
```

## Please Please Please Start With A Test

ecstatic has some pretty gnarly branching/logic underneath. Tests are extremely
important because they (a) prove that your feature/fix works, and (b) avoid
regressions in the future. Even if your patch is problematic enough to not be
merged, a test will still be very helpful for confirming any future fix.

I won't reject your patch outright if it's missing new tests, but it sure
helps!

## Code Style

Ecstatic's code base follows a relatively consistent style. The closer your
patch blends in with the status quo, the better.

A few PROTIPS off the top of my head:

1. Variables don't need to all be declared at the top, BUT variable *blocks*
should do the whole one-var, tons-of-commas thing.
2. Look at how spacing is done around conditionals and functions. Do it like
that. 
3. `else`'s and similar should be on the line *after* the preceding bracket.

We can refine this as the need arises.

## A Few Other Minor Guidelines

1. Keep your pull requests on-topic. A pull request purporting to tackle A
shouldn't also have commits changing B and C. Feel free to make separate pull
requests. For instance: A pull request should generally only update
dependencies when doing so is required to add the feature or fix the bug. This
feature can, of course, consist of updating dependencies.
2. I prefer maintaining the changelog and package.json version myself. This is
because I try to make a single commit for a tagged release contain all
changelog additions and the version bump, and this breaks down when there are
interstitial commits making updates to either.
3. In case you were wondering about dependencies, you may find this helpful:
[![dependencies status](https://david-dm.org/jfhbrook/node-ecstatic.svg)](https://david-dm.org/jfhbrook/node-ecstatic)
4. Please add yourself to CONTRIBUTORS.md if you haven't done so! Fill in as
much as makes you comfortable.

## Pull Request

Make a pull request against master with your new branch. Explain briefly what
the patch does to the code, along with any concerns.

(If you don't have a description, it's hard for me to put the changes in
context. That makes it more difficult for me to merge!)

## Keep It Moving

I don't always notice new PRs, and sometimes I will forget to follow up on
them. If this happens to you, you can bump the PR thread or find me on
IRC or twitter.

## LAST RULE

HAVE FUN :v :v

