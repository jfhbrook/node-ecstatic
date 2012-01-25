var union = require('union');
var ecstatic = require('../lib/ecstatic');

exports.type = 'union';

exports.startServer = function (dir, cb) {
  var host = 'localhost';

  // Just a randomized port
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);

  var server = union.createServer({
    before: [
      ecstatic(dir, {
        logger: console.error
      }),
      function (req, res) {
        res.end('Request fell through ecstatic.');
      }
    ]
  });

  server.listen(host, port);

  cb(host, port, server);

}
