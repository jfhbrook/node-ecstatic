# Ecstatic

A simple static file server middleware that works with both Express and Flatiron

* Built-in simple directory listings
* Shows index.html files at directory roots when they exist
* Use it with a raw http server, express/connect, or flatiron/union!

# Examples:

## express

``` js
var express = require('express');
var ecstatic = require('../')(__dirname + '/public');

var app = express.createServer();
app.use(ecstatic);
app.listen(8080);

console.log('Listening on :8080');
```

## union

``` js
var union = require('union');
var ecstatic = require('../')(__dirname + '/public');

union.createServer({
  before: [
    ecstatic
  ]
}).listen(8080);

console.log('Listening on :8080');
```

# API:

## ecstatic(folder);

Pass ecstatic a folder, and it will return your middleware!

## middleware(req, res, next);

This works more or less as you'd expect.

# Tests:

    npm test

# Contributing:

This is still "beta" quality, and you may find bugs. Please give me a heads-up if you find any! Pull requests encouraged.

# License:

MIT/X11.
