var path = require("path"),
    mime = require("mime"),
    fs = require("fs");

module.exports = function (dir) {
  var root = path.resolve(dir) + '/';
  
  return function (req, res, next) {
    // If there's a file, serve it up.
    var file = path.normalize(path.join(root, req.url));
    if (file.slice(0, root.length) !== root) {
      if (next) next()
      else {
        res.statusCode = 403;
        if (res.writable) res.end('ACCESS DENIED')
      }
    }
    
    path.exists(file, function (ex) {
      if (!ex) {
        if (typeof next === 'function') next()
        else {
          res.statusCode = 404;
          res.end('not found');
        }
      }
      else {
        res.setHeader('content-type', mime.lookup(file));
        var s = fs.createReadStream(file);
        s.pipe(res);
        s.on('error', function (err) {
          res.statusCode = 500;
          if (res.writable) res.end(err && err.stack || err.toString());
        });
      }
    });
  };
};
