var status = require('./status-handlers'),
    fs = require('fs'),
    etag = require('./etag'),
    mime = require('./mime');

module.exports = function (req, res, next, stat) {

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
    status[304](res, next);
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
      status[500](res, next, { error: err });
    });

    stream.on('end', function () {
      res.statusCode = req.statusCode || opts.statusCode || 200;
      res.end();
    });
  };
};
