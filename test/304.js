var test = require('tap').test,
    ecstatic = require('../lib/ecstatic'),
    http = require('http'),
    request = require('request'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    path = require('path');

var root = __dirname + '/public',
    baseDir = 'base';

test('304_not_modified', function (t) {
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4),
      file = 'a.txt';
  
  var server = http.createServer(
    ecstatic({
      root: root,
      gzip: true,
      baseDir: baseDir,
      autoIndex: true,
      showDir: true
    })
  );

  server.listen(port, function () {
    var uri = 'http://localhost:' + port + path.join('/', baseDir, file),
        now = (new Date()).toString();

    request.get({
      uri: uri,
      followRedirect: false,
    }, function (err, res, body) {
      if (err) t.fail(err);

      t.equal(res.statusCode, 200, 'first request should be a 200');

      request.get({
        uri: uri,
        followRedirect: false,
        headers: { 'if-modified-since': now }
      }, function (err, res, body) {
        if (err) t.fail(err);

        t.equal(res.statusCode, 304, 'second request should be a 304');
        t.equal(res.headers['etag'].indexOf('"'), 0, 'should return a strong etag');
        server.close();
        t.end();
      });
    });
  });
});

test('304_not_modified_weak', function (t) {
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4),
      file = 'b.txt';
  
  var server = http.createServer(
    ecstatic({
      root: root,
      gzip: true,
      baseDir: baseDir,
      autoIndex: true,
      showDir: true,
      weakEtags: true,
    })
  );

  server.listen(port, function () {
    var uri = 'http://localhost:' + port + path.join('/', baseDir, file),
        now = (new Date()).toString();

    request.get({
      uri: uri,
      followRedirect: false,
    }, function (err, res, body) {
      if (err) t.fail(err);

      t.equal(res.statusCode, 200, 'first request should be a 200');

      request.get({
        uri: uri,
        followRedirect: false,
        headers: { 'if-modified-since': now }
      }, function (err, res, body) {
        if (err) t.fail(err);

        t.equal(res.statusCode, 304, 'second request should be a 304');
        t.equal(res.headers['etag'].indexOf('W/'), 0, 'should return a weak etag');
        server.close();
        t.end();
      });
    });
  });
});

test('304_not_modified_strong_compare', function (t) {
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4),
      file = 'b.txt';
  
  var server = http.createServer(
    ecstatic({
      root: root,
      gzip: true,
      baseDir: baseDir,
      autoIndex: true,
      showDir: true
    })
  );

  server.listen(port, function () {
    var uri = 'http://localhost:' + port + path.join('/', baseDir, file),
        now = (new Date()).toString(),
        etag;

    request.get({
      uri: uri,
      followRedirect: false,
    }, function (err, res, body) {
      if (err) t.fail(err);

      t.equal(res.statusCode, 200, 'first request should be a 200');

      etag = res.headers['etag'];

      request.get({
        uri: uri,
        followRedirect: false,
        headers: { 'if-modified-since': now, 'if-none-match': etag }
      }, function (err, res, body) {
        if (err) t.fail(err);

        t.equal(res.statusCode, 304, 'second request with a strong etag should be 304');

        request.get({
          uri: uri,
          followRedirect: false,
          headers: { 'if-modified-since': now, 'if-none-match': 'W/' + etag }
        }, function (err, res, body) {
          if (err) t.fail(err);

          // Note that if both if-modified-since and if-none-match are provided, the server MUST NOT
          // return a response status of 304 unless doing so is consistent with all of the conditional
          // header fields in the request
          // https://www.ietf.org/rfc/rfc2616.txt
          t.equal(res.statusCode, 200, 'third request with a weak etag should be 200');
          server.close();
          t.end();
        });
      });
    });
  });
});


test('304_not_modified_weak_compare', function (t) {
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4),
      file = 'c.js';
  
  var server = http.createServer(
    ecstatic({
      root: root,
      gzip: true,
      baseDir: baseDir,
      autoIndex: true,
      showDir: true,
      weakCompare: true
    })
  );

  server.listen(port, function () {
    var uri = 'http://localhost:' + port + path.join('/', baseDir, file),
        now = (new Date()).toString(),
        etag;

    request.get({
      uri: uri,
      followRedirect: false,
    }, function (err, res, body) {
      if (err) t.fail(err);

      t.equal(res.statusCode, 200, 'first request should be a 200');

      etag = res.headers['etag'];

      request.get({
        uri: uri,
        followRedirect: false,
        headers: { 'if-modified-since': now, 'if-none-match': etag }
      }, function (err, res, body) {
        if (err) t.fail(err);

        t.equal(res.statusCode, 304, 'second request with a strong etag should be 304');

        request.get({
          uri: uri,
          followRedirect: false,
          headers: { 'if-modified-since': now, 'if-none-match': 'W/' + etag }
        }, function (err, res, body) {
          if (err) t.fail(err);

          t.equal(res.statusCode, 304, 'third request with a weak etag should be 304');
          server.close();
          t.end();
        });
      });
    });
  });
});