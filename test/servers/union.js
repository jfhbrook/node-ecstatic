var union = require('union');
var ecstatic = require('../lib/ecstatic');

exports.type = 'union';

exports.startServer = function (opts, cb) {

  // Just a randomized port
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);

  var server = union.createServer({
    before: [
      ecstatic(opts)
    ]
  });

  server.listen(port, function () {
    cb(port, server);
  });

}
