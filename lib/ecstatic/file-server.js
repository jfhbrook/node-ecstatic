var fs = require('fs'),
    etag = require('./etag'),
    mime = require('mime'),
    status = require('./status-handlers');

module.exports = function (opts) {
  var file = opts.file,
      stat = opts.stat,
      cache = opts.cache || 3600;

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
    return status[500]({ error: e });
  }

  if (stat && stat.isFile()) {
    return function fileServer (req, res, next) {

      // Headers all of these sorts of requests handle.
      // TODO: Helper for this, with default headers.
      res.setHeader('etag', etag(stat));
      res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
      res.setHeader('cache-control', 'max-age='+cache);

      // If appropriate, return a 304 (Not modified)
      if ( req.headers
        && ( (req.headers['if-none-match'] === etag)
          || (Date.parse(req.headers['if-none-match']) >= stat.mtime )
        )
      ) {
        status[304]()(req, res, next);
      }
      else {

        // Do a MIME lookup, fall back to octet-stream.
        // TODO: Make a helper.
        // TODO: Clear up the constructor bug nonsense.
        res.setHeader(
          'content-type',
          mime.lookup(file) || 'application/octet-stream'
        );

        // In the case of HEAD requests, we're done here.
        if (req.method === "HEAD") {
          res.statusCode = req.statusCode || opts.statusCode || 200;
          res.end();
        }
        else {

        // Yes, we're really reading the file!
        var stream = fs.createReadStream(file);

          stream.pipe(res);
          stream.on('error', function (err) {
            status[500]({ error: err })(req, res, next);
          });

          stream.on('end', function () {
            res.statusCode = req.statusCode || opts.statusCode || 200;
            res.end();
          });
        };
      };
    };
  }
  else {
    return status[500]({
      error: new Error('Stat object does not correspond to a readable file.')
    });
  }
};
