var status = require('./status-handlers'),
    fs = require('fs'),
    helpers = require('./helpers'),
    fileServer = require('./file-server'),
    etag = require('./etag');

module.exports = function serve (opts) {
  opts = opts || {};

  var stat = opts.stat,
      file = opts.file,
      statusCode = opts.statusCode;

  if (file) {
    // a middleware that only does files. Delegates to status middlewares
    // as necessary.
    return fileServer({
      file: file,
      stat: stat,
      cache: opts.cache
    });
  }
  else if (statusCode) {
    switch (statusCode) {
      case 304:
        return status[304](opts);
      break;

      case 403:
        return status[403](opts);
      break;

      case 404:
        return status[404](opts);
      break;

      case 500:
      default:
        return status[500](opts);
      break;
    }
  }

  return function () {
    throw new Error('Options should include either a file '
      + 'or a statusCode. Object properties: '+JSON.stringify(opts)
    );
  }
};
