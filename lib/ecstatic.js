var winston = require('winston'); // Built-in logger a la cliff

var path = require('path'),
    fs = require('fs'),
    url = require('url');

var version = JSON.parse(
      // pkginfo doesn't really do what I want here.
      fs.readFileSync(__dirname + '/../package.json').toString()
    ).version;

var optsParser = require('./ecstatic/opts'),
    common = require('./ecstatic/common'),
    router = require('./ecstatic/router'),
    error = require('./ecstatic/error'),
    serve = require('./ecstatic/serve');
    //showdir = require('./ecstatic/showdir');

// This is the middleware.
var ecstatic = module.exports = function ecstaticMiddleware (options) {

  // Parse the options.
  options = optsParser(options);

  return function routerMiddleware (req, res, next) {
    // Pass the options to the router
    router(common.mixin(options, {req: req, res: res}),
        function (err, route) {
      if (err) {
        route.statusCode = 500;
      }

      // The router figured out what code and stuff we have. So, let's
      // delegate accordingly.
      switch (route.statusCode) {
        case 200:
          if (route.showDir) {
            // TODO: Use the showDir helper!
            res.end();
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
            });
          }

          break;
        case 301:
          // Do the redirect.
          res.writeHead(301, {'Location': req.url + '/'});
          res.end();
          // Should not attempt to do anything else.
          //return;
          break;
        default:
          error(common.mixin(options, route, {req: req, res: res}), function (err) {
            if (err) {
              throw err;
            }
          });

          break;
      }
    });
  };

};

// This sets up a logger. It's basically copy-pasted from flatiron/cliff.
// TODO: Make this a reusable module.
// TODO: Make *actually work*
var logger;

ecstatic.__defineGetter__('logger', function () {
  return logger;
});

ecstatic.__defineSetter__('logger', function (val) {
  logger = val;

  if (logger.cli) {
    logger.cli();
  }
});

ecstatic.logger = new winston.Logger({
  transports: [new winston.transports.Console()]
});

ecstatic.logger.error = console.error;

// Expose the version
ecstatic.version = version;

// TODO: Expose the extra middlewares
