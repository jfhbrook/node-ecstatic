# Ecstatic

A simple static file server middleware that works with both Express and Flatiron

* Built-in simple directory listings
* Shows index.html files at directory roots when they exist
* Use it with a raw http server, express/connect, or flatiron/union!

# Examples:

## express

``` js
var express = require('express');
var ecstatic = require('../');;

var app = express.createServer();
app.use(ecstatic(__dirname + '/public'));
app.listen(8080);

console.log('Listening on :8080');
```

## union

``` js
var union = require('union');
var ecstatic = require('../');

union.createServer({
  before: [
    ecstatic(__dirname + '/public'),
  ]
}).listen(8080);

console.log('Listening on :8080');
```

# API:

## ecstatic(folder, opts={});

Pass ecstatic a folder, and it will return your middleware!

Turn on cache-control with `opts.cache`, in seconds.

Turn on directory listings from `ecstatic.showdir` with `opts.showdir === true`.

### middleware(req, res, next);

This works more or less as you'd expect.

## ecstatic.showdir(folder);

This returns another middleware which will attempt to show a directory view. At the moment, you must add this explicitly for union and connect middleware stacks, so that one may chose actions other than showing a directory view if desired.

# Tests:

    npm test

# Contributing:

This is still "beta" quality, and you may find bugs. Please give me a heads-up if you find any! Pull requests encouraged.

# License:

MIT/X11.
