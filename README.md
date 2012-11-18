# Ecstatic [![build status](https://secure.travis-ci.org/jesusabdullah/node-ecstatic.png)](http://travis-ci.org/jesusabdullah/node-ecstatic)

![](http://imgur.com/vhub5.png)

A simple static file server middleware. Use it with a raw http server,
express/connect, or flatiron/union!

# Examples:

## express 3.0.x

``` js
var http = require('http');
var express = require('express');
var ecstatic = require('ecstatic');

var app = express();
app.use(ecstatic({ root: __dirname + '/public' }));
http.createServer(app).listen(8080);

console.log('Listening on :8080');
```

## union

``` js
var union = require('union');
var ecstatic = require('ecstatic');

union.createServer({
  before: [
    ecstatic({ root: __dirname + '/public' }),
  ]
}).listen(8080);

console.log('Listening on :8080');
```

## stock http server

``` js
var http = require('http');
var ecstatic = require('ecstatic');

http.createServer(
  ecstatic({ root: __dirname + '/public' })
).listen(8080);

console.log('Listening on :8080');
```
### fall through
To allow fall through to your custom routes:

```js
ecstatic({ root: __dirname + '/public', handleError: false })
```

# API:

## ecstatic(opts);

Pass ecstatic an options hash, and it will return your middleware!

`opts.root` is the directory you want to serve up.

`opts.baseDir` is `/` by default, but can be changed to allow your static files
to be served off a specific route. For example, if `opts.baseDir === "blog"`
and `opts.root = "./public"`, requests for `localhost:8080/blog/index.html` will
resolve to `./public/index.html`.

Customize cache control with `opts.cache`, in seconds. Time defaults to 3600 s
(ie, 1 hour).

Turn **on** directory listings with `opts.showDir === true`. Turn **on**
autoIndexing with `opts.autoIndex === true`. Defaults to **false**.

Turn on default file extensions with `opts.defaultExt`. If `opts.defaultExt` is
true, it will default to `html`. For example if you want a request to `/a-file`
to resolve to `./public/a-file.html`, set this to `true`. If you want
`/a-file` to resolve to `./public/a-file.json` instead, set `opts.defaultExt` to
`json`.

Set `opts.gzip === true` in order to turn on "gzip mode," wherein ecstatic will
serve `./public/some-file.js.gz` in place of `./public/some-file.js` when the
gzipped version exists and ecstatic determines that the behavior is appropriate.

### middleware(req, res, next);

This works more or less as you'd expect.

## ecstatic.showDir(folder);

This returns another middleware which will attempt to show a directory view. Turning on auto-indexing is roughly equivalent to adding this middleware after an ecstatic middleware with autoindexing disabled.

# Tests:

    npm test

# License:

MIT/X11.
