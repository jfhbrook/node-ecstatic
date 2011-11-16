var path = require("path"),
    mime = require("mime"),
    fs = require("fs");

module.exports = function (p) {

  return function (req, res, next) {

    // If there's a file, serve it up.
    if (path.existsSync(p + req.url) && !fs.statSync(p + req.url).isDirectory()) {
      fs.readFile(p + req.url, function (err, buff) {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end();
          return;
        }

        res.writeHead(200, { "Content-Type": mime.lookup(p + req.url) });
        res.end(buff);
      });
    }
    else {
      // There's no file to return; Keep digging.
      // Style decision here: calling 'next()' keeps backwards compat. with
      // connect.
      next();
    }
  };
}
