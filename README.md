# Ecstatic

A simple static file server middleware that works with both Express and Flatiron

* simple directory listings
* show index.html files at directory roots when they exist
* use it with a raw http server, connect/express, or flatiron/union

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

This project's implementation is pretty much g2g (thanks @substack) but currently does not work in Union. This is because Union's response piping is currently broken.

Once Union is fixed, this will work there as well.

# License:

MIT/X11.
