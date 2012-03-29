var path = require('path'),
    fs = require('fs'),
    util = require('util');

var common = require('./common'),
    router = require('./router'),
    serve = require('./serve'),
    defaultError = require('./default-error');

// This is now async, not a middleware.
module.exports = function serveError (opts, callback) {

  // Handle errors? If so, all or just some?
  // Defaults to handling errors.
  var shouldHandle = (
    (
      opts.handleErrors && typeof opts.handleErrors !== 'undefined'
    ) && (
      opts.handleErrors === true || (
        Array.isArray(opts.handleErrors)
        && -~handleErrors.indexOf(opts.statusCode)
      )
    )
  );
      
  if (!shouldHandle) {
    callback();
  }

  // Set the req.url to get, say, `/404.html`.
  opts.req.url = path.join('/', (opts.statusCode || '500')+'.html');

  // Reuse the router to try serving the `{{ statusCode }}.html`
  router(opts, function routeError (err, route) {
    if (err) {
      opts.statusCode = route.statusCode = 500;
    }

      switch (route.statusCode) {

        // Serve up the page but with the correct statusCode.
        case 200:

          if (route.file) {

            // Show the file as usual
            serve(common.mixin(opts, route, {
              statusCode: opts.statusCode
            }));

            break;
          }
          else {
            // fall through to default case
          }
        case 404:

          // Page not found. Show a default version based on the statusCode.

          defaultError(common.mixin(opts, route, {
            statusCode: opts.statusCode
          }), callback);

          break;

        default:

          // Something broke pretty major. Show the default 500.

          defaultError(common.mixin(opts, route, {
            statusCode: 500
          }), callback);

          break;
      }

  });
};
