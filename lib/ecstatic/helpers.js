// A collection of "helpers".
// god help me I will clean this up later.

// Set headers used by all ecstatic-based responses.
exports.setDefaultHeaders = function setDefaultHeaders (res) {
  res.setHeader('server', 'ecstatic-'+version);
  res.setHeader('date', (new Date()).toUTCString());

  return res;
};

// Set headers used by responses involving http caching.
exports.setCacheHeaders = function setCacheHeaders (res, opts) {
  var stat = (opts && opts.stat) || opts,
      cache = (opts && opts.cache) || 3600;

  res.setHeader('etag', etag(stat));
  res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
  res.setHeader('cache-control', 'max-age='+cache);

  return res;
}

// Do a MIME lookup, fall back to octet-stream.
exports.setContentType = function setMimeHeaders (res, file) {

  // TODO: Clear up the constructor bug nonsense.
  res.setHeader(
    'content-type',
    mime.lookup(file) || 'application/octet-stream'
  );
}

// Test to see if a response should be a 304
exports.shouldBe304 = function shouldBe304 (req, stat) {
 return req.headers
   && ( (req.headers['if-none-match'] === etag)
     || (Date.parse(req.headers['if-none-match']) >= stat.mtime )
   );
}
