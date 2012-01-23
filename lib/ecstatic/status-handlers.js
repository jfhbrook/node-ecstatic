var serve = require('./serve'),
    serveFile = require('./serve-file'),
    path = require('path'),
    fs = require('fs'),
    util = require('utile');

// 304 not modified. Not much else to say.
exports['304'] = function () {
  return function (req, res, next) {
    res.statusCode = 304;
    res.end();
  };
};

// Access denied.
exports['403'] = function (opts) {
  return function (req, res, next) {
    res.statusCode = 403;

    res.setHeader('content-type', 'text/plain');
    res.end('ACCESS DENIED');
  }
};

// File not found.
exports['404'] = function (opts) {

  var file = opts.file,
      stat = opts.stat;

  if (!file && opts && opts.root) {
    file = path.resolve(opts.root, '404.html');
  }

  if (!stat) {
    stat = fs.statSync(file);
  }

  if (stat.isFile()) {

    // Attempt to serve 404.html.
    return serveFile(util.mixin(opts, {
      statusCode: 404,
    });

  }
  else {

    return function (req, res, next) {
      res.statusCode = 404;
      res.setHeader('content-type', 'text/plain');
      res.end('Error 404: File not found.');
    }

  };
};

// Allow: GET, HEAD
exports['405'] = function (opts) {
  return function (req, res, next) {
    res.statusCode = 405;

    // opts.allow? Why?
    res.setHeader('allow', (opts && opts.allow) || 'GET, HEAD');
    res.end();
  };
};

// Unspecified error.
exports['500'] = function (opts) {
  var file = opts.file,
      stat = opts.stat;

  if (!file && opts && opts.root) {
    file = path.resolve(opts.root, '500.html');
  }

  if (!stat) {
    stat = fs.statSync(file);
  }

  if (stat.isFile()) {

    // Attempt to serve 500.html.
    return serveFile(util.mixin(opts, {
      statusCode: 500,
    });

  }
  else {
    return function (req, res, next) {
      res.statusCode = 500;
      // TODO: Return "nicer" messages
      res.end(opts.error.stack || String(opts.error) || "No specified error");
    };
  };
};
