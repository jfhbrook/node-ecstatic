var status = require('./status-handlers'),
    fs = require('fs'),
    helpers = require('./helpers'),
    fileServer = require('./file-server'),
    etag = require('./etag'),
    mime = require('./mime');

module.exports = function (opts) {
  var stat = opts.stat,
      file = opts.file,
      statusCode = opts.statusCode;

  if (file) {
    // a middleware that only does files. Delegates to status middlewares
    // as necessary.
    return fileServer(file, stat);
  }
  else if (statusCode) {
    switch (statusCode) {
      case 304:
        status[304](opts)(req, res, next);
      break;

      case 403:
        status[403](opts)(req, res, next);
      break;

      case 404:
        status[404](opts)(req, res, next);
      break;

      case 500:
      default:
        status[500](opts)(req, res, next);
      break;
      }
    }
  }
};
