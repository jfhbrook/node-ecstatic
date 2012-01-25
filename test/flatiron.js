var flatiron = require('flatiron'),
    app = flatiron.app,
    ecstatic = require('../lib/ecstatic');

app.use(flatiron.plugins.http);

exports.type = 'flatiron';

exports.startServer = function (dir, cb) {

  var host = 'localhost';

  // Just a randomized port
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);

  app.router.get('*', ecstatic(dir, {
    logger: console.error
  }));

  server.listen(host, port);

  cb(host, port, server);

}
