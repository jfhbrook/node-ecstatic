var ecstatic = require('../ecstatic'),
    fs = require('fs'),
    path = require('path'),
    ent = require('ent'),
    etag = require('./etag'),
    error = require('./error-handlers');

module.exports = function (dir, pathname, stat, cache) {
  return function (req, res, next) {

    fs.readdir(dir, function (err, xs) {
      if (err) {
        error['500'](res, next, { error: err });
      }
      else {

        res.setHeader('content-type', 'text/html');
        res.setHeader('etag', etag(stat));
        res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
        res.setHeader('cache-control', 'max-age='+cache);

        // Write out a reasonable directory view.
        // TODO: Moar betters.

        var pending = xs.length,
            dirs = [],
            files = [],
            errs = [];
        
        function writeFile (file) {
          var p = path.join(pathname, file);
          res.write(
            '<div><a href="' + encodeURI(p) + '">'
            + ent.encode(file) + '</a></div>'
          );
        }
        
        function finish () {
          dirs.sort().forEach(function (file) {
            writeFile(file + '/');
          });
          files.sort().forEach(writeFile);
          res.write('<p>Powered by ecstatic version '+ecstatic.version);
          res.end();
        }

        xs.forEach(function (file) {
          fs.stat(dir + '/' + file, function (err, s) {
            if (err) {
              errs.push(err);
            }
            else if (s.isDirectory()) {
              dirs.push(file);
            }
            else {
              files.push(file);
            }
            
            if (--pending === 0) {
              finish();
            }
          });
        });
      }
    });
  }
};
