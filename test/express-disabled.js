var test = require('tap').test;

var fs = require('fs'),
    path = require('path');

var clientTests = require('./client/client-disabled');

test('express', function (t) {
  require('./servers/express-disabled').startServer(path.resolve(__dirname, 'public'),
  function (port, app) {
    clientTests('localhost', port, t, function () {
      app.close();
      t.end();
    });
  });
});
