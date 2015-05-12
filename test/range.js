var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request'),
    eol = require('eol');

test('range', function (t) {
  t.plan(4);
  var server = http.createServer(ecstatic(__dirname + '/public/subdir'));
  t.on('end', function () { server.close() })
 
  server.listen(0, function () {
    var port = server.address().port;
    var opts = {
      uri: 'http://localhost:' + port + '/e.html',
      headers: { range: '3-5' }
    };
    request.get(opts, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 206, 'partial content status code');
      t.equal(body, 'e!!');
      t.equal(parseInt(res.headers['content-length']), body.length);
    });
  });
});

test('range past the end', function (t) {
  t.plan(4);
  var server = http.createServer(ecstatic(__dirname + '/public/subdir'));
  t.on('end', function () { server.close() })
 
  server.listen(0, function () {
    var port = server.address().port;
    var opts = {
      uri: 'http://localhost:' + port + '/e.html',
      headers: { range: '3-500' }
    };
    request.get(opts, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 206, 'partial content status code');
      t.equal(eol.lf(body), 'e!!</b>\n');
      t.equal(parseInt(res.headers['content-length']), body.length);
    });
  });
});

test('NaN range', function (t) {
  t.plan(3);
  var server = http.createServer(ecstatic(__dirname + '/public/subdir'));
  t.on('end', function () { server.close() })
 
  server.listen(0, function () {
    var port = server.address().port;
    var opts = {
      uri: 'http://localhost:' + port + '/e.html',
      headers: { range: 'abc-def' }
    };
    request.get(opts, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 416, 'range error status code');
      t.equal(body, 'Requested range not satisfiable');
    });
  });
});

test('flipped range', function (t) {
  t.plan(3);
  var server = http.createServer(ecstatic(__dirname + '/public/subdir'));
  t.on('end', function () { server.close() })
 
  server.listen(0, function () {
    var port = server.address().port;
    var opts = {
      uri: 'http://localhost:' + port + '/e.html',
      headers: { range: '333-222' }
    };
    request.get(opts, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 416, 'range error status code');
      t.equal(body, 'Requested range not satisfiable');
    });
  });
});

test('partial range', function (t) {
  // 1 test is platform depedent "res.headers['content-range']"
  t.plan(5);
  var server = http.createServer(ecstatic(__dirname + '/public/subdir'));
  t.on('end', function () { server.close() })
 
  server.listen(0, function () {
    var port = server.address().port;
    var opts = {
      uri: 'http://localhost:' + port + '/e.html',
      headers: { range: '3-' }
    };
    request.get(opts, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 206, 'partial content status code');
      t.equal(eol.lf(body), 'e!!</b>\n');
      t.equal(parseInt(res.headers['content-length']), body.length);
      
      if (process.platform === 'win32') {
        t.equal(res.headers['content-range'], 'bytes 3-11/12');
      } else {
        t.equal(res.headers['content-range'], 'bytes 3-10/11');
      }
    });
  });
});
