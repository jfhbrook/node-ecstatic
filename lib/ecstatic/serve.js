var fs = require('fs'),
    etag = require('./etag'),
    mime = require('mime'),
    util = require('util');

module.exports = function fileServer (opts, cb) {
  var file = opts.file,
      stat = opts.stat,
      cache = opts.cache || 3600,
      req = opts.req,
      res = opts.res;

  if (typeof(file) !== 'string') {
    throw new Error('No file path provided.');
  }

  try {
    // If a stat's not provided, get one.
    if (!stat) {
      stat = fs.statSync(file);
    }
  }
  catch (e) {
    throw e;
  }

  if (stat && stat.isFile()) {
    // Headers all of these sorts of requests handle.
    // TODO: Helper for this, with default headers.
    // TODO: In certain cases, these
    try {
      res.setHeader('etag', etag(stat));
    } catch (e) {
      console.error(new Error('etag already set').message);
      res.end(opts.statusCode || 200);
    }
    try {
      res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
    } catch (e) {
      console.error(new Error('last-modified already set').message);
    }
    try {
      res.setHeader('cache-control', 'max-age='+cache);
    } catch (e) {
      console.error(new Error('cache-control already set').message);
    }

    // If appropriate, return a 304 (Not modified)
    if ( req.headers
      && ( (req.headers['if-none-match'] === etag)
        || (Date.parse(req.headers['if-none-match']) >= stat.mtime )
      )
    ) {
      res.writeHead(304);
      res.end();
    }
    else {

      // Do a MIME lookup, fall back to octet-stream.
      // TODO: Make a helper.
      // TODO: Clear up the constructor bug nonsense.
      res.setHeader(
        'content-type',
        mime.lookup(file) || 'application/octet-stream'
      );

      res.statusCode = opts.statusCode || 200;

      // In the case of HEAD requests, we're done here.
      if (req.method === "HEAD") {
        res.end();
      }
      else {
        // Yes, we're really reading the file!
        var stream = fs.createReadStream(file);

        stream.pipe(res);
        stream.on('error', function (err) {
          // TODO: FIX
          status[500]({ error: err })(req, res, next);
        });

        stream.on('end', function () {
          res.statusCode = opts.statusCode || 200;
          res.end();
        });
      };
    };
  }
  else {
    throw new Error('Stat object does not correspond to a readable file.')
  }
};
