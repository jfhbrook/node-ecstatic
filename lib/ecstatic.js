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
    status = require('./ecstatic/status-handlers'),
    serve = require('./ecstatic/serve');

// This is the middleware.
var ecstatic = module.exports = function ecstaticMiddleware (options) {

  // Parse the options.
  options = optsParser(options);

  // Print the options if you need some debugging.
  Object.keys(options).forEach(function (k) {
    console.error('[opts] '+k+': '+JSON.stringify(options[k]));
  });

  return function routerMiddleware (req, res, next) {
    // Pass the options to the router
    router(common.mixin(options, {req: req, res: res}), function (err, route) {
      if (err) {
        route.statusCode = 500;
      }

      // The router figured out what code and stuff we have. So, let's
      // delegate accordingly.
      switch (route.statusCode) {
        case 200:
          if (route.showDir) {
            // use the showDir helper
          }
          else if (route.file) {
            // show the file as usual
            serve(common.mixin(options, route))(req, res, next);
          }
          else {
            // This shouldn't happen. Show a 500.
            route.statusCode = 500;
            status[500](common.mixin(options, route))(req, res, next);
          }
        break;
        case 403:
          // Outside root. Either show error page or fall through.
         status[403](common.mixin(options, route))(req, res, next);
        break;
        case 404:
          // Not found. Either show error page or fall through.
          status[404](common.mixin(options, route))(req, res, next);
        break;
        case 405:
          // This means the request was not a GET or HEAD. Either show error page or fall through.
          status[405](common.mixin(options, route))(req, res, next);
        break;
        case 500:
          // Something broke pretty major. Either show error page or fall through.
          status[500](common.mixin(options, route))(req, res, next);
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
