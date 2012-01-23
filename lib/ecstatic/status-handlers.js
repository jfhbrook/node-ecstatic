var serve = require('./serve');

// 304 not modified. Not much else to say.
exports['304'] = function (req, res, next) {
  res.statusCode = 304;
  res.end();
};

// Access denied.
exports['403'] = function (req, res, next) {
  if (next) {
    // I disagree. Is this really the right behavior?
    next();
  }
  else {
    res.statusCode = 403;
    // Why would res not be writable?
    if (res.writable) {
      // TODO: serve()
      res.setHeader('content-type', 'text/plain');
      res.end('ACCESS DENIED');
    }
  }
};

// Allow: GET, HEAD
exports['405'] = function (res, next, opts) {
  res.statusCode = 405;

  // opts.allow? Why?
  res.setHeader('allow', (opts && opts.allow) || 'GET, HEAD');
  res.end();
};

// File not found.
exports['404'] = function (res, next) {
  if (typeof next === "function") {
    next();
  }
  else {
    // TODO: SERVE
    res.statusCode = 404;
    if (res.writable) {
      res.setHeader('content-type', 'text/plain');
      res.end('File not found. :(');
    }
  }
};

// Unspecified error.
exports['500'] = function (res, next, opts) {
  res.statusCode = 500;
  // TODO: Return nicer messages
  // TODO: SERVE
  res.end(opts.error.stack || opts.error.toString() || "No specified error");
};
