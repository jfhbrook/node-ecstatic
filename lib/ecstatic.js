var path = require('path'),
    fs = require('fs'),
    url = require('url'),
    showDir = require('./ecstatic/showdir'),
    version = JSON.parse(
      // pkginfo doesn't really do what I want here.
      fs.readFileSync(__dirname + '/../package.json').toString()
    ).version,
    status = require('./ecstatic/status-handlers'),
    serve = require('./ecstatic/serve'),
    optsParser = require('./ecstatic/opts');

var ecstatic = module.exports = function ecstatic (dir, options) {
  var root = path.resolve(dir) + '/',
      opts = optsParser(options),
      cache = opts.cache,
      autoIndex = opts.autoIndex;
  
  return function router (req, res, next) {

    // Figure out the path for the file from the given url
    var parsed = url.parse(req.url),
        pathname = decodeURI(parsed.pathname),
        file = path.normalize(path.join(root, pathname));

    // Guard against going outside the root directory.
    if (file.slice(0, root.length) !== root) {
      return serve({ statusCode: 403 })(req, res, next);
    }

    // Only 'get' and 'head' are allowed.
    if (req.method && (req.method !== 'GET' && req.method !== 'HEAD' )) {
      return serve({ statusCode: 405})(req, res, next);
    }

    // Let's see if this file exists...
    fs.stat(file, function (err, stat) {

      // File/directory straight up does not exist. In this case we should
      // return a 404 (possibly with the contents of 404.html inside it).
      if (err && err.code === 'ENOENT') {

        serve({
          statusCode: 404,
          root: root,
          pathname: pathname,
          stat: stat,
          cache: cache
        })(req, res, next);

      }
      // Other types of errors are not expected.
      else if (err) {
        serve({ statusCode: 500, error: err })(req, res, next);
      }
      // This is a directory, meaning we might want to autoindex it.
      else if (stat.isDirectory()) {

        if (autoIndex) {
          //look for the index.html
          fs.stat(path.resolve(file, 'index.html'), function (err, stat) {
            if ((err && err.code === 'ENOENT') || stat.isDirectory()) {
              // Go for the showdir.
              showDir({
                root: root,
                pathname: pathname,
                stat: stat,
                cache: cache
              })(req, res, next)
            }
            else if (err) {
              serve({ statusCode: 500, error: err })(req, res, next);
            }
            else {
              // Serve the index.html
              serve({ stat: stat })(req, res, next);
            }
          });
        }
        else {
          // No autoindexing means this should fall through to the next
          // middleware.
          next();
        }
      }
      // This is a regular file. Serve it!
      else {
        serve({ stat: stat })(req, res, next);
      }
    });
  };
};

ecstatic.version = version;
ecstatic.showDir = showDir;

