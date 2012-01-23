var fs = require('fs'),
    status = require('./status-handlers');

module.exports = function (file, stat) {
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
      helpers.setCacheHeaders(res, { stat: stat, cache: cache });

      // If appropriate, return a 304 (Not modified)
      if ( helpers.shouldBe304(req, stat) ) {
        status[304]()(req, res, next);
      }
      else {

g        helper.setContentType(res, file);

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
