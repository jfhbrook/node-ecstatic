var test = require('tap').test;

var fs = require('fs'),
    path = require('path');

var clientTests = require('./client/client');

test('express', function (t) {
  require('./servers/express').startServer( {
    root: path.resolve(__dirname, 'public')
  }, function (port, app) {
    clientTests('localhost', port, t, function () {
      app.close();
      t.end();
    });
  });
});
