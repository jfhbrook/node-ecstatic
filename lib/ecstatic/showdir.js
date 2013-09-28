var ecstatic = require('../ecstatic'),
    fs = require('fs'),
    path = require('path'),
    ent = require('ent'),
    etag = require('./etag'),
    url = require('url'),
    status = require('./status-handlers');

module.exports = function (opts, stat) {
  var cache = opts.cache || 3600,
      root = path.resolve(opts.root),
      baseDir = opts.baseDir || '/';

  return function middleware (req, res, next) {

    // Figure out the path for the file from the given url
    var parsed = url.parse(req.url),
        pathname = decodeURI(parsed.pathname),
        dir = path.normalize(
          path.join(root,
            path.relative(
              path.join('/', baseDir),
              pathname
            )
          )
        );

    fs.stat(dir, function (err, stat) {
      if (err) {
        return status[500](res, next, { error: err });
      }

      fs.readdir(dir, function (err, files) {
        if (err) {
          return status[500](res, next, { error: err });
        }
        res.setHeader('content-type', 'text/html');
        res.setHeader('etag', etag(stat));
        res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
        res.setHeader('cache-control', cache);

        sortByIsDirectory(files, function (errs, dirs, files) {

          if (errs.length > 0) {
            return status[500](res, next, { error: errs[0] });
          }

          // if it makes sense to, add a .. link
          if (path.resolve(dir, '..').slice(0, root.length) == root) {
            return fs.stat(path.join(dir, '..'), function (err, s) {
              if (err) {
                return status[500](res, next, { error: err });
              }
              dirs.unshift([ '..', s ]);
              render(dirs, files);
            });
          }
          render(dirs, files);
        });

        function sortByIsDirectory(paths, cb) {
          var pending = paths.length,
              errs = [],
              dirs = [],
              files = [];

          if (!pending) {
            return cb(errs, dirs, files);
          }

          paths.forEach(function (file) {
            fs.stat(path.join(dir, file), function (err, s) {
              if (err) {
                errs.push(err);
              }
              else if (s.isDirectory()) {
                dirs.push([file, s]);
              }
              else {
                files.push([file, s]);
              }

              if (--pending === 0) {
                cb(errs, dirs, files);
              }
            });
          });
        }

        function render(dirs, files) {
          // Lifted from nodejitsu's http server.
          var html = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"\
            "http://www.w3.org/TR/html4/loose.dtd">\
            <html> \
              <head> \
                <title>Index of ' + pathname +'</title> \
              </head> \
              <body> \
            <h1>Index of ' + pathname + '</h1>\n';

          html += '<table>';

          var failed = false
          var writeRow = function (file, i)  {
            try {
              var decoded = decodeURI(
                req.url.replace(/\/$/, '')
                + '/'
                + file[0]
              );
            }
            catch (err) {
              failed = true;
              res.statusCode = 400;
              return res.end(err + '\n')
            }
            html += '<tr><td><code>(' + perms(file[1]) + ')</code> <a href="'
              + ent.encode(decoded)
              + '">' + ent.encode(file[0]) + '</a></td></tr>\n';
          }

          dirs.sort(function (a, b) { return b[0] - a[0] }).forEach(writeRow);
          files.sort(function (a, b) { return b.toString().localeCompare(a.toString()) }).forEach(writeRow);

          html += '</table>\n';
          html += '<br><address>Node.js '
            + process.version
            + '/<a href="https://github.com/jesusabdullah/node-ecstatic">ecstatic</a>'
            + ' server running @ '
            + ent.encode(req.headers.host || '') + '</address>\n'
            + '</body></html>'
          ;

          if (!failed) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
          }
        }
      });
    });
  }
};

function perms(stat) {
  var dir = stat.isDirectory() ? 'd' : '-',
      mode = stat.mode.toString(8);

  return dir + mode.slice(-3).split('').map(function (n) {
    return [
      '---',
      '--x',
      '-w-',
      '-wx',
      'r--',
      'r-x',
      'rw-',
      'rwx'
    ][parseInt(n, 10)]
  }).join('');
}
