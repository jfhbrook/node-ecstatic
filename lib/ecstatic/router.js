var ecstatic = require('../ecstatic');

var url = require('url'),
    path = require('path'),
    fs = require('fs');

var log = function () {};

var helpers = require('./common');

var opts = ecstatic.options;

// callbacks with error, code, etc.
module.exports = function router (opts, cb) {
  var req = opts.req,
      res = opts.res;

  // Figure out the path for the file from the given url
  var parsed = url.parse(req.url),
      pathname = decodeURI(parsed.pathname),
      file = helpers.getLocalDirectory(opts.root, opts.baseDir, pathname);

  opts.pathname = pathname;

  log('[get] '+pathname);
  //log('[get] '+pathname+' :: Resolved to: file://'+file);

  // Guard against going outside the root directory.
  if (file.slice(0, opts.root.length) !== opts.root) {
    //log('[get] '+pathname+' :: Outside root directory: file://'+file);
    cb(null, {
      statusCode: 403
    });
  }

  // Only 'get' and 'head' are allowed.
  // TODO: This should fall through by default.
  if (req.method && (req.method !== 'GET' && req.method !== 'HEAD' )) {
    //log('[get] '+pathname+' :: Only GET and HEAD are allowed.');
    cb(null, {
      statusCode: 405
    });
  }

  // Let's see if this file exists...
  fs.stat(file, function (err, stat) {

    // File/directory straight up does not exist. In this case we should
    // return a 404 (possibly with the contents of 404.html inside it).
    if (err && err.code === 'ENOENT') {
      //log('[get] '+pathname+' :: 404 not found');
      cb(null, {
        statusCode: 404,
        file: file,
        stat: stat
      });

    }
    // Other types of errors are not expected.
    else if (err) {
      //log('[get] '+pathname+' :: Unexpected error.');
      cb(err, {
        statusCode: 500,
        file: file,
        stat: stat
      });
    }
    // This is a directory, meaning we might want to autoindex it.
    else if (stat.isDirectory()) {
      //log('[get] '+pathname+' :: Is a directory.');

      // Check for trailing / in original query
      if (req.url.substring(req.url.length - 1) !== '/') {
        cb(err, {
          statusCode: 301,
          file: file,
          stat: stat
        });
      }
      else {
        if (opts.autoIndex) {
          //look for the index.html
          var indexPath = path.join(file, '/', 'index.html');

          // log('[get] '+pathname+' :: AutoIndex: '+indexPath);

          fs.stat(indexPath, function (err, stat) {
            if ((err && err.code === 'ENOENT') || stat.isDirectory()) {
              // log('[get] '+pathname+' :: AutoIndex not found: '+indexPath);

              if (opts.showDir) {
                // log('[get] '+pathname+' :: ShowDir');
                cb(null, {
                  statusCode: 200,
                  showDir: true,
                  file: file,
                  stat: stat
                });
              }
            }
            else if (err) {
              // log('[get] '+pathname+' :: AutoIndex error `'+err.code+'`');
              cb(err, { statusCode: 500 });
            }
            else {
              // log('[get] '+pathname+' :: AutoIndex successful: '+indexPath);
              // Serve the index.html
              cb(null, {
                statusCode: 200,
                file: indexPath,
                stat: stat
              });
            }
          });
        }
        else {
          // No autoindexing means this should fall through to the next
          // middleware.
          // log('[get] '+pathname+' :: AutoIndex disabled; Falling though.');
          cb(null, {
            statusCode: 404,
            file: file
          });
        }
      }
    }
    // This is a regular file. Serve it!
    else {
      // log('[get] '+pathname+' :: Serve: file://'+file);
      cb(null, {
        statusCode: 200,
        file: file,
        stat: stat
      });
    }
  });
};
