var ecstatic = require('../ecstatic'),
    fs = require('fs'),
    path = require('path'),
    ent = require('ent'),
    etag = require('./etag'),
    url = require('url'),
    common = require('./common'),
    error = require('./error');

module.exports = function createShowDirMiddleware (opts) {
  var from = opts.from, // directory to show
      to = opts.to, // route to show directory for
      cache = opts.cache || 3600;

  return function showDirMiddleware (req, res, next) {
    var html = [
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"'
        + '"http://www.w3.org/TR/html4/loose.dtd">',
      '<html>',
      '  <head>',
      '    <title>Index of ' + to +'</title>',
      '  </head>',
      '  <body>',
      '    <h1>Index of ' + to + '</h1>'
    ];

    // Intercept the case where req.url is NOT the right route.
    if (req.url !== to) {
      console.error(req.url + ' !== ' + to);
      res.statusCode = 404;
      return next(null, req, res);
    }

    fs.stat(from, function (err, stat) {
      if (err) {
        next(err, req, res);
      }

      fs.readdir(from, function (err, files) {
        if (err) {
          next(err, req, res);
        }

        res.setHeader('content-type', 'text/html');
        res.setHeader('etag', etag(stat));
        res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
        res.setHeader('cache-control', 'max-age='+cache);

        sortByIsDirectory(files, function (errs, dirs, files) {

          if (errs.length > 0) {
            // TODO: Use error handler
            throw err;
          }

          var writeRow = rowWriter(6);

          html.push('    <table>');
          dirs.sort().forEach(writeRow);
          files.sort().forEach(writeRow);
          html.push('    </table>');

          html.push('    <br>');
          html.push('    <address>Node.js '
            + process.version
            + '/<a href="https://github.com/jesusabdullah/node-ecstatic">ecstatic</a>'
            + ' server running @ '
            + ent.encode(req.headers.host) + '</address>'
          );

          html.push('  </body>');
          html.push('</html>');

          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(html.join('\n'));
        });
      });
    });

    // Write a file to the html table!
    function rowWriter (indent) {
      return function writeRow (file, i)  {
        html.push(Array(indent + 1).join(' ')
          + '<tr><td>'
          + '<a href="'
          + ent.encode(encodeURI(
            ((req.url == '/') ? '' : req.url)
            + '/'
            + file
          ))
          + '">'
          + ent.encode(file)
          + '</a></td></tr>'
        );
      }
    }

  }

  // Sorts a list of paths based on whether they represent directories or not.
  function sortByIsDirectory (paths, cb) {
    var pending = paths.length,
        errs = [],
        dirs = [],
        files = [];

    if (pending) {

      paths.forEach(function (file) {
        fs.stat(path.resolve(from, file), function (err, s) {
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
            cb(errs, dirs, files);
          }
        });
      });
    }
    else {
      cb(errs, dirs, files);
    }
  }
};
