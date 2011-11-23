var path = require('path'),
    fs = require('fs'),
    url = require('url'),
    mime = require('mime'),
    showDir = require('./ecstatic/showdir');

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
    fs.stat(file, function (err, s) {
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
      else if (s.isDirectory()) {
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

        // Serve it up!
        res.setHeader('content-type', mime.lookup(file));

        var stream = fs.createReadStream(file);

        stream.pipe(res);
        stream.on('error', function (err) {
          res.statusCode = 500;
          if (res.writable) {
            res.end(err && err.stack || err.toString());
          }
        });
      }
    });
  };
};
