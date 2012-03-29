// A collection of "helpers".
// god help me I will clean this up later.

// Let's start with utile's methods.
var common = module.exports = require('utile');

// Set headers used by all ecstatic-based responses.
common.setDefaultHeaders = function setDefaultHeaders (res) {
  res.setHeader('server', 'ecstatic-'+version);
  res.setHeader('date', (new Date()).toUTCString());

  return res;
};

// Set headers used by responses involving http caching.
common.setCacheHeaders = function setCacheHeaders (res, opts) {
  var stat = (opts && opts.stat) || opts,
      cache = (opts && opts.cache) || 3600;

  res.setHeader('etag', etag(stat));
  res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
  res.setHeader('cache-control', 'max-age='+cache);

  return res;
}

// Do a MIME lookup, fall back to octet-stream.
common.setContentType = function setMimeHeaders (res, file) {
  res.setHeader(
    'content-type',
    mime.lookup(file) || 'application/octet-stream'
  );
}

common.getLocalDirectory = function getLocalDirectory (root, basedir, f) {
  var path = require('path');

  return path.join(root, '/', path.relative(basedir, path.join('/', f)));
}

// Test to see if a response should be a 304
common.shouldBe304 = function shouldBe304 (req, stat) {
 return req.headers
   && ( (req.headers['if-none-match'] === etag)
     || (Date.parse(req.headers['if-none-match']) >= stat.mtime )
   );
}

common.mixin = function fixedMixin() {
  var target = {};
  var objs = Array.prototype.slice.call(arguments);
    objs.forEach(function (o) {
      Object.keys(o).forEach(function (attr) {
        var getter = o.__lookupGetter__(attr);
        if (!getter) {
          target[attr] = o[attr];
        }
        else {
          target.__defineGetter__(attr, getter);
        }
      });
    });

    return target;
}
