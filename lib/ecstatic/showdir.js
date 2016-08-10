var ecstatic = require('../ecstatic'),
    fs = require('fs'),
    path = require('path'),
    he = require('he'),
    etag = require('./etag'),
    url = require('url'),
    status = require('./status-handlers');

module.exports = function (opts, stat) {
  // opts are parsed by opts.js, defaults already applied
  var cache = opts.cache,
      root = path.resolve(opts.root),
      baseDir = opts.baseDir,
      humanReadable = opts.humanReadable,
      handleError = opts.handleError,
      showDotfiles = opts.showDotfiles,
      si = opts.si,
      weakEtags = opts.weakEtags;

  return function middleware (req, res, next) {

    // Figure out the path for the file from the given url
    var parsed = url.parse(req.url),
        pathname = decodeURIComponent(parsed.pathname),
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
        return handleError ? status[500](res, next, { error: err }) : next();
      }

      // files are the listing of dir
      fs.readdir(dir, function (err, files) {
        if (err) {
          return handleError ? status[500](res, next, { error: err }) : next();
        }

        // Optionally exclude dotfiles from directory listing.
        if (!showDotfiles) {
          files = files.filter(function(filename){
            return filename.slice(0,1) !== '.';
          });
        }

        res.setHeader('content-type', 'text/html');
        res.setHeader('etag', etag(stat, weakEtags));
        res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
        res.setHeader('cache-control', cache);

        sortByIsDirectory(files, function (lolwuts, dirs, files) {
          // It's possible to get stat errors for all sorts of reasons here.
          // Unfortunately, our two choices are to either bail completely,
          // or just truck along as though everything's cool. In this case,
          // I decided to just tack them on as "??!?" items along with dirs
          // and files.
          //
          // Whatever.

          // if it makes sense to, add a .. link
          if (path.resolve(dir, '..').slice(0, root.length) == root) {
            return fs.stat(path.join(dir, '..'), function (err, s) {
              if (err) {
                return handleError ? status[500](res, next, { error: err }) : next();
              }
              dirs.unshift([ '..', s ]);
              render(dirs, files, lolwuts);
            });
          }
          render(dirs, files, lolwuts);
        });

        function sortByIsDirectory(paths, cb) {
          // take the listing file names in `dir`
          // returns directory and file array, each entry is
          // of the array a [name, stat] tuple
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
                errs.push([file, err]);
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

        function render(dirs, files, lolwuts) {
          // each entry in the array is a [name, stat] tuple

          // TODO: use stylessheets?
          var html = [
            '<!doctype html>',
            '<html>',
            '  <head>',
            '    <meta charset="utf-8">',
            '    <meta name="viewport" content="width=device-width">',
            '    <title>Index of ' + he.encode(pathname) +'</title>',
            '    <style>@import url(https://fonts.googleapis.com/css?family=Open+Sans); * { margin:0; padding:0; -webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; } html { min-height:100%; border:10px solid #ECEEF1; color:#61666c; font-weight:400; font-size:1em; font-family:"Open Sans", sans-serif; line-height:2em; } body { margin:0 auto; max-width:80%; padding:20px; -webkit-backface-visibility:hidden; } h1 { color:#2a2a2a; font-weight:400; margin-bottom:1.3em; font-size: 2em; } h1 a { color:#2a2a2a; } h1 a:hover { color:#f32236; } a { color:#61666c; text-decoration:none; } a:hover { color:#2a2a2a; } table { width:100%; table-layout:fixed; border-collapse:collapse; font-size:.925em; } tr:hover td { background:#f6f6f6; } td { padding:5px 0; outline:0; border:0; overflow:hidden; border-bottom:1px solid #edf1f5; vertical-align:middle; text-align:left; -webkit-transition:background 196ms ease; -moz-transition:background 196ms ease; -ms-transition:background 196ms ease; -o-transition:background 196ms ease; transition:background 196ms ease; } td a { display:block; } address { font-size:80%; text-align:left; font-style:normal; } address a { color:#f32236; text-decoration:none; } address a:hover { color:#f37c4c; } .folder { width: 0px; height: 0px; padding: 8px; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEISURBVDiNrZGxSgNREEXPCw/S7EZIZWelYqFlvsDKQhC0ssoPmCIfYG1hoWCXP7C3Si+ksBJEtBHE2JhgdgvNm5lnIQYkuLAbb3/vnHvHxRjpdbYugX1+62qpaXsHx7dTCuRixPU6m7a2voFzNQBijAxfnsnzLAA2Z4JYr/v+4cnNrru+2DlrrG4fNZdXig7NafT6xOShf+6DWjtJEj7eh6UCkiThTa3tg2gaPvNSZgCVKUE09aKGSSgdACBq+CCKVgwIongRw6TwU38TyA+BLkAQRCtvMKtQdYNZhaobfBPoAgRq/7CBig3G41GrkaalzJMsQ8UGPljs3t0/nkZolQlwMKBW634BV/GiU2qcKJgAAAAASUVORK5CYII=") } .default { width: 0px; height: 0px; padding: 8px; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAC0SURBVDiN7Y8tjsMwGESn1kgBAQEGoSELs7fojdpb9FShYd4gh4TmCt+PXVReV4U70sD3NHNZ1/VqZo9Syi8aEkJIJG+XZVnSNE3zOI4IIbwFl1JwnieO4/ijiMwxRohIywDEGJFznunucPcmGABeHM0MtdZmAQCYGaiqHwtUFXT3jwXfufAv+JJAVUGyGTYzBJI5pQQRQa31rYoIUkogmdn3/X3f98e2bT8tC7qu24dhuD8BD6e7SzzK9MwAAAAASUVORK5CYII=") }</style>',
            '  </head>',
            '  <body>',
            '<h1>Index of ' + he.encode(pathname) + '</h1>'
          ].join('\n') + '\n';

          html += '<table>';

          var failed = false;
          var writeRow = function (file, i) {
            // render a row given a [name, stat] tuple
            var isDir = file[1].isDirectory && file[1].isDirectory();
            var href = parsed.pathname.replace(/\/$/, '') + '/' + encodeURIComponent(file[0]);

            // append trailing slash and query for dir entry
            if (isDir) {
              href += '/' + he.encode((parsed.search)? parsed.search:'');
            }

            var displayName = he.encode(file[0]) + ((isDir)? '/':'');

            // TODO: use stylessheets?
            html += '<tr>' +
              '<td style="width:2.4em"><img class="' + (isDir ? "folder" : "default") + '"/></td>' +
              '<td style="text-align:left"><a href="' + href + '">' + displayName + '</a></td>' +
              '<td style="text-align:right;padding-right:2em"><code>' + sizeToString(file[1], humanReadable, si) + '</code></td>' +
              '<td style="text-align:right;width:6em"><code>(' + permsToString(file[1]) + ')</code></td>' +
              '</tr>\n';
          };

          dirs.sort(function (a, b) { return a[0].toString().localeCompare(b[0].toString()); }).forEach(writeRow);
          files.sort(function (a, b) { return a.toString().localeCompare(b.toString()); }).forEach(writeRow);
          lolwuts.sort(function (a, b) { return a[0].toString().localeCompare(b[0].toString()); }).forEach(writeRow);

          html += '</table>\n';
          html += '<br><address>Node.js ' +
            process.version +
            '/ <a href="https://github.com/jfhbrook/node-ecstatic">ecstatic</a> ' +
            'server running @ ' +
            he.encode(req.headers.host || '') + '</address>\n' +
            '</body></html>'
          ;

          if (!failed) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
          }
        }
      });
    });
  };
};

function permsToString(stat) {

  if (!stat.isDirectory || !stat.mode) {
    return '???!!!???';
  }

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
    ][parseInt(n, 10)];
  }).join('');
}

// given a file's stat, return the size of it in string
// humanReadable: (boolean) whether to result is human readable
// si: (boolean) whether to use si (1k = 1000), otherwise 1k = 1024
// adopted from http://stackoverflow.com/a/14919494/665507
function sizeToString(stat, humanReadable, si) {
    if (stat.isDirectory && stat.isDirectory()) {
      return '';
    }

    var sizeString = '';
    var bytes = stat.size;
    var threshold = si ? 1000 : 1024;

    if (!humanReadable || bytes < threshold) {
      return bytes + 'B';
    }

    var units = [ 'k','M','G','T','P','E','Z','Y' ];
    var u = -1;
    do {
        bytes /= threshold;
        ++u;
    } while (bytes >= threshold);

    var b = bytes.toFixed(1);
    if (isNaN(b)) b = '??';

    return b + units[u];
}
