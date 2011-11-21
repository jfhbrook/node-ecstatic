var path = require('path');
var mime = require('mime');
var fs = require('fs');
var showDir = require('./lib/showdir');

module.exports = function (dir) {
  var root = path.resolve(dir) + '/';
  
  return function handler (req, res, next) {
    // If there's a file, serve it up.
    var file = path.normalize(path.join(root, req.url));
    if (file.slice(0, root.length) !== root) {
      if (next) next()
      else {
        res.statusCode = 403;
        if (res.writable) {
          res.setHeader('content-type', 'text/plain');
          res.end('ACCESS DENIED');
        }
      }
    }
    
    fs.stat(file, function (err, s) {
      if (err && err.code === 'ENOENT') {
        if (typeof next === 'function') next()
        else {
          res.statusCode = 404;
          if (res.writable) {
            res.setHeader('content-type', 'text/plain');
            res.end('not found');
          }
        }
      }
      else if (err) {
        res.statusCode = 500;
        res.end(err && err.stack || err.toString());
      }
      else if (s.isDirectory()) {
        handler({ url : req.url + '/index.html' }, res, function () {
          showDir(file, res);
        });
        res.end();
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
