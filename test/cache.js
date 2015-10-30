var test = require('tap').test,
    http = require('http'),
    request = require('request'),
    ecstatic = require('../');

test('custom cache-content number', function(t) {
  try {
    var server = http.createServer(ecstatic({
      root: __dirname + '/public/',
      cache: 3600
    }));
  } catch (e) {
    t.fail(e.message);
    t.end();
  }

  t.plan(3);

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/a.txt', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200, 'a.txt should be found');
      t.equal(res.headers['cache-control'], 'max-age=3600');
      server.close(function() { t.end(); });
    });
  });
});

test('custom cache-content string', function(t) {
  try {
    var server = http.createServer(ecstatic({
      root: __dirname + '/public/',
      cache: 'max-whatever=3600'
    }));
  } catch (e) {
    t.fail(e.message);
    t.end();
  }

  t.plan(3);

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/a.txt', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200, 'a.txt should be found');
      t.equal(res.headers['cache-control'], 'max-whatever=3600');
      server.close(function() { t.end(); });
    });
  });
});

test('custom cache-content function returning a number', function(t) {
  var i = 0
  try {
    var server = http.createServer(ecstatic({
      root: __dirname + '/public/',
      cache: function() {
        i++
        return i
      }
    }));
  } catch (e) {
    t.fail(e.message);
    t.end();
  }

  t.plan(6);

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/a.txt', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200, 'a.txt should be found');
      t.equal(res.headers['cache-control'], 'max-age=1');
      server.close(function() {

        server.listen(0, function() {
          var port = server.address().port;
          request.get('http://localhost:' + port + '/a.txt', function(err, res, body) {
            t.ifError(err);
            t.equal(res.statusCode, 200, 'a.txt should be found');
            t.equal(res.headers['cache-control'], 'max-age=2');
            server.close(function() { t.end(); });
          });
        });

      });
    });
  });
});

test('custom cache-content function returning a string', function(t) {
  var i = 0
  try {
    var server = http.createServer(ecstatic({
      root: __dirname + '/public/',
      cache: function() {
        i++
        return 'max-meh=' + i
      }
    }));
  } catch (e) {
    t.fail(e.message);
    t.end();
  }

  t.plan(6);

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/a.txt', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200, 'a.txt should be found');
      t.equal(res.headers['cache-control'], 'max-meh=1');
      server.close(function() {

        server.listen(0, function() {
          var port = server.address().port;
          request.get('http://localhost:' + port + '/a.txt', function(err, res, body) {
            t.ifError(err);
            t.equal(res.statusCode, 200, 'a.txt should be found');
            t.equal(res.headers['cache-control'], 'max-meh=2');
            server.close(function() { t.end(); });
          });
        });

      });
    });
  });
});
