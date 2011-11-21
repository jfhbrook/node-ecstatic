var path = require('path');
var fs = require('fs');
var url = require('url');

var mime = require('mime');
var showDir = require('./lib/showdir');

module.exports = function (dir) {
  var root = path.resolve(dir) + '/';
  
  return function handler (req, res, next) {
    // If there's a file, serve it up.
    var u = url.parse(req.url);
    var file = path.normalize(path.join(root, u.pathname));
    
    if (file.slice(0, root.length) !== root) {
      if (next) next()
      else {
        res.statusCode = 403;
        if (res.writable) {
          res.setHeader('content-type', 'text/plain');
          res.end('ACCESS DENIED');
        }
      }
      return;
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
        var req_ = { url : path.join(u.pathname, '/index.html') };
        handler(req_, res, function () {
          showDir(file, u.pathname, res);
        });
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
