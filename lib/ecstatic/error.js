var path = require('path'),
    fs = require('fs'),
    util = require('util');

var common = require('./common'),
    router = require('./router'),
    serve = require('./serve'),
    defaultError = require('./default-error');


// This is now async, not a middleware.
module.exports = function serveError (opts, callback) {

  // Set the req.url to get, say, `/404.html`.
  opts.req.url = path.join('/', (opts.statusCode || '500')+'.html');

  // Print the options if you need some debugging.
  // Typical:["root","baseDir","cache","autoIndex","showDir",
  //   "handleErrors","req","res","pathname","statusCode","file","stat"]
  Object.keys(opts).forEach(function (k) {
    var v = util.inspect(opts[k]);

    if (v.split('\n').length > 4) {
      v = v.split('\n').slice(0, 4).concat(['***snip***']).join('\n');
    }

    console.error('[get] '+opts.pathname+':: serveError [opts] '+v);
  });

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
            console.error('[get] '+opts.file+' :: Error '+opts.statusCode+': Serving file '+route.file);

            serve(common.mixin(opts, route, {
              statusCode: opts.statusCode
            }))(opts.req, opts.res, callback);

            break;
          }
          else {
            // fall through to default case
          }
        case 404:

          // Page not found. Show a default version based on the statusCode.
          console.error('[get] '+route.file+' :: 404 Not Found.');

          defaultError(common.mixin(route, {
            statusCode: opts.statusCode
          }), callback);

          break;

        default:

          // Something broke pretty major. Show the default 500.
          console.error('[get] '+route.file+' :: 500 ☠ ☠ ☠ THIS SHOULD NOT HAPPEN ☠ ☠ ☠ '+(err.message || ''));

          defaultError(common.mixin(route, {
            statusCode: 500
          }), callback);

          break;
      }

  });
};
