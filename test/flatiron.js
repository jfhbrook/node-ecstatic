var test = require('tap').test;

var fs = require('fs'),
    path = require('path');

var clientTests = require('./client/client');

test('flatiron', function (t) {
  require('./servers/flatiron').startServer(path.resolve(__dirname, 'public'),
  function (port, app) {
    clientTests('localhost', port, t, function () {
      app.server.close();
      t.end();
    });
  });
});
