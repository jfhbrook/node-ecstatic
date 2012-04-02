# Ecstatic

A simple static file server middleware that works with both Express and Flatiron

* Built-in simple directory listings
* Shows index.html files at directory roots when they exist
* Use it with a raw http server, express/connect, or flatiron/union!

# Examples:

## express

``` js
var path = require('path');

var express = require('express'),
    app = express.createServer(),
    ecstatic = require('ecstatic');

app.use(ecstatic({
  root: path.resolve(__dirname, 'public')
});
app.listen(8080);

console.log('Listening on :8080');
```

## flatiron

``` js
var path = require('path');

var flatiron = require('flatiron'),
    app = flatiron.app,
    ecstatic = require('ecstatic');

app.use(app.plugins.http);
app.use(ecstatic, {
  root: path.resolve(__dirname, 'public')
});
app.start(8080, function (err) {
  if (err) {
    throw err;
  }
  app.log.info('Listening on :8080');
});
```

# API:

## `expressApp.use(ecstatic(options))` and `flatironApp.use(ecstatic, options)`

Pass ecstatic a hash of options, and it will return a middleware! Use ecstatic as a flatiron plugin, and it works similarly. The only required option is `root`.

ecstatic was written as a middleware configuration function wrapped with [`equip.configurable`], and as such has the same api.

## options

* **root** (required): This is the root of the folder you want to serve with ecstatic.
* **urlRoot**: The root path as seen in the url. Defaults to *'/'*.
* **cache**: The amount of time used for client-side caching in seconds. Default is *3600* (1 hr).
* **autoIndex**: If this is turned off, folder/ will not automatically read folder/index.html . Defaults to *true*.
* **showDir**: If this is turned off, ecstatic will not automatically generate folder views for empty directories. Defaults to *true*.
* **handleErrors**: If this is turned off, ecstatic will call the next middleware instead of showing error pages. For fine-grained control, pass in a list of http status codes that you would like ecstatic to handle. Defaults to *false*.
* **gzip**: If this is turned on, ecstatic will attempt to serve gzipped versions of files (if they exist in the directory) for clients that support it. For example, requesting 'some/file.js' would actually return 'some/file.js.gz', which would be deflated by the client. Defaults to *false*.

# Tests:

    npm test

# License:

MIT/X11.
