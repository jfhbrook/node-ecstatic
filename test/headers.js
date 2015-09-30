var test = require('tap').test,
    ecstatic = require('../lib/ecstatic'),
    http = require('http'),
    request = require('request');

var root = __dirname + '/public',
    baseDir = 'base';

test('headers object', function (t) {
  t.plan(4);

  var server = http.createServer(
    ecstatic({
      root: root,
      headers: {
        Wow: 'sweet',
        Cool: 'beans'
      },
      autoIndex: true,
      defaultExt: 'html'
    })
  );

  server.listen(function () {
    var port = server.address().port,
        uri = 'http://localhost:' + port + '/subdir';
    request.get({ uri: uri }, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200)
      t.equal(res.headers.wow, 'sweet')
      t.equal(res.headers.cool, 'beans')
    });
  });
  t.once('end', function () {
    server.close();
  });
});

test('header string', function (t) {
  t.plan(3);

  var server = http.createServer(
    ecstatic({
      root: root,
      header: 'beep: boop', // for command-line --header 'beep: boop'
      autoIndex: true,
      defaultExt: 'html'
    })
  );

  server.listen(function () {
    var port = server.address().port,
        uri = 'http://localhost:' + port + '/subdir';
    request.get({ uri: uri }, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200)
      t.equal(res.headers.beep, 'boop')
    });
  });
  t.once('end', function () {
    server.close();
  });
});

test('header array', function (t) {
  t.plan(3);

  var server = http.createServer(
    ecstatic({
      root: root,
      header: [
        'beep: boop', // --header 'beep: boop'
        'what: ever' // --header 'what: ever'
      ],
      autoIndex: true,
      defaultExt: 'html'
    })
  );

  server.listen(function () {
    var port = server.address().port,
        uri = 'http://localhost:' + port + '/subdir';
    request.get({ uri: uri }, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200)
      t.equal(res.headers.beep, 'boop')
    });
  });
  t.once('end', function () {
    server.close();
  });
});

test('H array', function (t) {
  t.plan(3);

  var server = http.createServer(
    ecstatic({
      root: root,
      H: [
        'beep: boop', // -H 'beep: boop'
        'what: ever' // -H 'what: ever'
      ],
      autoIndex: true,
      defaultExt: 'html'
    })
  );

  server.listen(function () {
    var port = server.address().port,
        uri = 'http://localhost:' + port + '/subdir';
    request.get({ uri: uri }, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200)
      t.equal(res.headers.beep, 'boop')
    });
  });
  t.once('end', function () {
    server.close();
  });
});
