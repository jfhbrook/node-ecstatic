var path = require('path'),
    fs = require('fs'),
    url = require('url');

var equip = require('equip');

var version = require(__dirname + '/../package').version;

var optsParser = require('./ecstatic/opts'),
    common = require('./ecstatic/common'),
    router = require('./ecstatic/router'),
    error = require('./ecstatic/error'),
    serve = require('./ecstatic/serve'),
    showdir = require('./ecstatic/showdir');

// This is the middleware.
var ecstatic = module.exports = equip.configurable(function configurable (options) {

  // Parse the options.
  options = optsParser(options);

  var log = function (str) {
    if (options.log) {
      if (options.log.info) {
        options.log.info(str);
      }
      else {
        options.log(str);
      }
    }
  };

  var middleware = function routerMiddleware (req, res, next) {
    // Pass the options to the router
    router(common.mixin(options, {req: req, res: res}), function (err, route) {
      if (err) {
        log(err.stack);
        route.statusCode = 500;
      }

      log(req.url + ': ' + route.statusCode);

      // The router figured out what code and stuff we have. So, let's
      // delegate accordingly.
      switch (route.statusCode) {
        case 200:
          if (route.showDir) {
            showdir({
              from: route.file,
              to: req.url
            })(req, res, function (err, a, b, n) {

              if (err || res.statusCode == 404) {
                res.statusCode = 500;
                error(common.mixin(options, route, {
                  req: req,
                  res: res
                }, function (err) {
                  if (err) {
                    throw err;
                  }
                  next();
                }));
              }
            });
          }
          else if (route.file) {
            // Show the file as usual.
            serve(common.mixin(options, route, {
              req: req, res: res
            }));
            break;
          }
          else {
            // This shouldn't happen. Show a 500.
            route.statusCode = 500;
            error(common.mixin(options, route, {req: req, res: res}), function (err) {
              if (err) {
                throw err;
              }
              next();
            });
          }

          break;
        case 301:
          // Do the redirect.
          res.writeHead(301, {'Location': req.url + '/'});
          res.end();
          // Should not attempt to do anything else.
          break;
        default:
          error(common.mixin(options, route, {req: req, res: res}), function (err) {
            if (err) {
              throw err;
            }
            next();
          });

          break;
      }
    });
  };

  middleware.log = log;

  return middleware;

});

// This sets up a logger. It's basically copy-pasted from flatiron/cliff.
// TODO: Make this a reusable module.
// TODO: Make *actually work*
var logger;
