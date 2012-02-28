

var defaultError = module.exports = function defaultError (opts, cb) {

  var req = opts.req,
      res = opts.res;

  // This process is actually syncronous so a callback isn't necessary.

  try {
    switch (opts.statusCode) {

      case 403:
        // Access denied.
        // TODO: Be less lame about it.
        res.writeHead(403, { 'content-type': 'text/plain' });
        res.end('ACCESS DENIED');
      case 404:
        // Not found.
        // TODO: Be less lame about it.
        res.writeHead(404, { 'content-type': 'text/plain'});
        res.end("404 NOT FOUND");
        break;
      case 405:
        // `Allow` error.
        res.writeHead(405, { 'allow': 'GET, HEAD' });
        res.end();
        break;
      case 500:
      default:
        //Server error.
        // TODO: Be less lame about it.
        res.writeHead(500, { 'content-type': 'text/plain'});
        res.end("500 INTERNAL SERVER ERROR");
        break;
    }
  }
  catch (err) {
    cb(err);

    return;
  }

  cb(null);

};
