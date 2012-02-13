var fs = require('fs'),
    etag = require('./etag'),
    mime = require('mime'),
    status = require('./status-handlers');

var util = require('util');

module.exports = function (opts) {
  var file = opts.file,
      stat = opts.stat,
      cache = opts.cache || 3600;

  console.error('\n## OPTS\n');
  Object.keys(opts).forEach(function (k) {
    console.error(k+': '+util.inspect(opts[k]).split('\n').slice(0, 4).join('\n'));
  });

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
    return function fileServer (req, res, next) {

      // Headers all of these sorts of requests handle.
      // TODO: Helper for this, with default headers.
      try {
        res.setHeader('etag', etag(stat));
        res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
        res.setHeader('cache-control', 'max-age='+cache);
      } catch (e) {
        console.error('\n## REQ\n');
        Object.keys(req).forEach(function (k) {
          console.error(k+': '+util.inspect(req[k]).split('\n').slice(0, 4).join('\n'));
        });
        console.error('\n## RES\n');
        Object.keys(res).forEach(function (k) {
          console.error(k+': '+util.inspect(res[k]).split('\n').slice(0, 4).join('\n'));
        });
        throw e;
      }

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
          res.statusCode = opts.statusCode || 200;
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
            console.error('[get] '+opts.req.url+' :: Status '+opts.statusCode);
            res.statusCode = opts.statusCode || 200;
            res.end();
          });
        };
      };
    };
  }
  else {
    throw new Error('Stat object does not correspond to a readable file.')
  }
};
