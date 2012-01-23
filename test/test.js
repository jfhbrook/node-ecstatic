var test = require('tap').test;

var root = __dirname + '/public';

console.log(root);

var fs = require('fs');
var clientTests = require('./client');

test('express', function (t) {
  require('./express').startServer( root, function (port, app) {
    clientTests('localhost', port, t, function () {
      app.close();
      t.end();
    });
  });
});
