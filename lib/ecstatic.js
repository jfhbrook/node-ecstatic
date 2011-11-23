var path = require('path'),
    fs = require('fs'),
    url = require('url'),
    mime = require('mime'),
    showDir = require('./ecstatic/showdir');

// TODO:
//
// * Server info (ecstatic-0.0.0)

var cache = 3600; // cache-ing time in seconds

exports.showDir = showDir;

module.exports = function (dir) {
  var root = path.resolve(dir) + '/';
  
  return function middleware (req, res, next) {

    var parsed = url.parse(req.url),
        file = path.normalize(path.join(root, parsed.pathname));

    // 403 if the path goes outside the root.
    if (file.slice(0, root.length) !== root) {
      if (next) {
        next();
      }
      else {
        res.statusCode = 403;
        if (res.writable) {
          res.setHeader('content-type', 'text/plain');
          res.end('ACCESS DENIED');
        }
      }
      return;
    }

    // Read in the file!    
    fs.stat(file, function (err, stat) {
      if (err && err.code === 'ENOENT') {
        if (typeof next === 'function') {
          next();
        }
        else {
          res.statusCode = 404;
          if (res.writable) {
            res.setHeader('content-type', 'text/plain');
            // TODO: Make pluggable.
            res.end('File not found. :(');
          }
        }
      }
      else if (err) {
        res.statusCode = 500;
        // TODO: Don't share the error code with the user.
        res.end(err.stack || err.toString());
      }
      else if (stat.isDirectory()) {
        // Directory view!
        var req_ = {
          url : path.join(parsed.pathname, '/index.html')
        };

        // Pass the new url to our middleware.
        // Use 'next' if it exists, otherwise our fancy-schmancy
        // "showdir" middleware.
        var handler = (typeof next === 'function')
              ? next
              : function () {
                showDir(file, parsed.pathname, res);
              };

        middleware(req_, res, handler);
      }
      else {

        var etag = JSON.stringify([stat.ino, stat.size, stat.mtime].join('-'));

        res.setHeader('content-type', mime.lookup(file) || 'application/octet-stream');
        res.setHeader('etag', etag);
        res.setHeader('date', (new Date()).toUTCString());
        res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
        res.setHeader('cache-control', 'max-age='+cache);
        res.setHeader('server', 'ecstatic-0.0.0');


        // Return a 304 if necessary
        if ( (req.headers['if-none-match'] === etag)
          || (Date.parse(req.headers['if-none-match']) >= stat.mtime ) ) {
          res.statusCode = 304;
          res.end();
        }
        else {

          // Serve it up!
          var stream = fs.createReadStream(file);

          stream.pipe(res);
          stream.on('error', function (err) {
            res.statusCode = 500;
            if (res.writable) {
              res.end(err && err.stack || err.toString());
            }
          });
        }
      }
    });
  };
};
