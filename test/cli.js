"use strict";

/* this test suit is incomplete  2015-12-18 */

var test = require('tap').test,
    request = require('request'),
    spawn = require('child_process').spawn,
    path = require('path'),
    node = process.execPath,
    defaultUrl = 'http://127.0.0.1',
    defaultPort = 8000,
    getRandomPort = (function() {
      var usedPorts = [];
      return function() {
        var port = getRandomInt(1025, 65536);
        if(usedPorts.indexOf(port) > -1)
          return getRandomPort();

        usedPorts.push(port);
        return port;
      }
    }());


test('setting port via cli - default port', function(t) {
  t.plan(2);

  var port = defaultPort;
  var options = ['.'];
  var ecstatic = startEcstatic(options)

  tearDown(ecstatic, t);

  ecstatic.stdout.on("data", function(data) {
    t.pass('ecstatic should be started');
  });

  checkServerIsRunning(defaultUrl + ':' + port + '/', t);
});

test('setting port via cli - custom port', function(t) {
  t.plan(2);

  var port = getRandomPort();
  var options = ['.', '--port', port];
  var ecstatic = startEcstatic(options);

  tearDown(ecstatic, t);

  ecstatic.stdout.on('data', function(data) {
    t.pass('ecstatic should be started');
  });

  checkServerIsRunning(defaultUrl + ':' + port + '/', t);
});

test('setting mimeTypes via cli - .types file', function(t) {
  t.plan(2);

  var port = getRandomPort();
  var root = path.resolve(__dirname, 'public/');
  var pathMimetypeFile = path.resolve(__dirname, 'fixtures/custom_mime_type.types');
  var options = [root, '--port', port, '--mimetypes', pathMimetypeFile];
  var ecstatic = startEcstatic(options);

  tearDown(ecstatic, t);

  ecstatic.stdout.on('data', function(data) {
    t.pass('ecstatic should be started');
    checkServerIsRunning(defaultUrl + ':' + port + '/custom_mime_type.opml', t);
  });

});

test('setting mimeTypes via cli - directly', function(t) {
  t.plan(3);

  var port = getRandomPort();
  var root = path.resolve(__dirname, 'public/');
  var mimeType = ['--mimeTypes', '{ "application/x-my-type": ["opml"] }'];
  var options = [root, '--port', port, '--mimetypes'].concat(mimeType);
  var ecstatic = startEcstatic(options);

  //TODO: remove error handler
  /*ecstatic.stderr.pipe(process.stderr);
  ecstatic.stdout.pipe(process.stderr);*/

  tearDown(ecstatic, t);

  ecstatic.stdout.on('data', function(data) {
    t.pass('ecstatic should be started');
    checkServerIsRunning(defaultUrl + ':' + port + '/custom_mime_type.opml', t)
      .then(function(res) {
        t.equal(res.headers['content-type'], 'application/x-my-type; charset=utf-8');
      });
  });

});

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startEcstatic(args, options) {
  return spawn(node, [require.resolve('../lib/ecstatic.js')].concat(args));
}

function checkServerIsRunning (url, t) {
  var cb;
  var p = { then: function(f) { cb = f; }, resolve: function(v) { (cb && cb(v)); }};
  request(url, function (err, res, body) {
    if (!err && res.statusCode !== 500) {
      t.pass('a successful request from the server was made');
      p.resolve(res);
    } else {
      t.fail('the server could not be reached @ ' + url);
      p.resolve(err);
    }
  })
  return p;
}

function tearDown(ps, t) {
  t.tearDown(function() {
    ps.kill('SIGTERM');
  });
}
