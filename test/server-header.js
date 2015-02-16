var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request');

test('serverHeader should exist', function (t) {
  t.plan(2);
  var server = http.createServer(ecstatic(__dirname + '/public/subdir'));
  t.on('end', function () { server.close() })
  server.listen(0, function () {
    var port = server.address().port;
    request.get('http://localhost:' + port, function (err, res, body) {
      t.ifError(err);
      t.equal(res.headers.server, 'ecstatic-' + ecstatic.version);
    });
  });
});

test('serverHeader should not exist', function (t) {
  t.plan(2);
  var server = http.createServer(ecstatic(__dirname + '/public/subdir', {
    serverHeader: false
  }));
  t.on('end', function () { server.close() })
  server.listen(0, function () {
    var port = server.address().port;
    request.get('http://localhost:' + port, function (err, res, body) {
      t.ifError(err);
      t.equal(res.headers.server, undefined);
    });
  });
});
