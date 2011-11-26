var path = require('path'),
    fs = require('fs'),
    url = require('url'),
    mime = require('mime'),
    showDir = require('./ecstatic/showdir'),
    version = JSON.parse(
      fs.readFileSync(__dirname + '/../package.json').toString()
    ).version,
    status = require('./ecstatic/status-handlers'),
    etag = require('./ecstatic/etag');

var ecstatic = module.exports = function (dir, opts) {
  var root = path.resolve(dir) + '/',
      cache = (opts && opts.cache) || 3600, // cache-ing time in seconds.
      shouldShowDir = (opts && (opts.showDir || opts.showdir));
  
  return function middleware (req, res, next) {

    var parsed = url.parse(req.url),
        pathname = decodeURI(parsed.pathname),
        file = path.normalize(path.join(root, parsed.pathname));

    // Set common headers.
    res.setHeader('server', 'ecstatic-'+version);
    res.setHeader('date', (new Date()).toUTCString());

    if (file.slice(0, root.length) !== root) {
      return status[403](res, next);
    }

    if (req.method && (req.method !== 'GET' && req.method !== 'HEAD' )) {
      return status[405](res, next);
    }

    fs.stat(file, function (err, stat) {
      if (err && err.code === 'ENOENT') {
        status[404](res, next);
      }
      else if (err) {
        status[500](res, next, { error: err });
      }
      else if (stat.isDirectory()) {
        var handler = (typeof next === 'function' && !shouldShowDir)
              ? next
              : function () {
                showDir(file, pathname, stat, cache)(req, res);
              };

        middleware({
          url: path.join(pathname, '/index.html')
        }, res, handler);
      }
      else {

        // TODO: Helper for this, with default headers.
        res.setHeader('etag', etag(stat));
        res.setHeader('last-modified', (new Date(stat.mtime)).toUTCString());
        res.setHeader('cache-control', 'max-age='+cache);

        // Return a 304 if necessary
        if ( req.headers
          && ( (req.headers['if-none-match'] === etag)
            || (Date.parse(req.headers['if-none-match']) >= stat.mtime )
          )
        ) {
          status[304](res, next);
        }
        else {

          res.setHeader(
            'content-type',
            mime.lookup(file) || 'application/octet-stream'
          );

          if (req.method === "HEAD") {
            res.statusCode = 200;
            res.end();
          }
          else {

            var stream = fs.createReadStream(file);

            stream.pipe(res);
            stream.on('error', function (err) {
              status['500'](res, next, { error: err });
            });

            stream.on('end', function () {
              res.statusCode = 200;
              res.end();
            });
          }
        }
      }
    });
  };
};

ecstatic.version = version;
ecstatic.showDir = showDir;

