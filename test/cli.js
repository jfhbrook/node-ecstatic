"use strict";

/* this test suit is incomplete  2015-12-14 */

var test = require('tap').test,
    request = require('request'),
    spawn = require('child_process').spawn,
    node = process.execPath,
    defaultUrl = 'http://localhost',
    portRegex = /(\d{4,5})/,
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
    var expected = port,
        actual = portRegex.test(data) && portRegex.exec(data)[0]|0;
    t.equal(actual, expected, 'The default port number should be 8000');
  });
  
  checkServerIsRunning(defaultUrl + ':' + port, t);
});

test('setting port via cli - custom port', function(t) {
  t.plan(2);

  var port = getRandomPort();
  var options = ['.', '--port', port];
  var ecstatic = startEcstatic(options);

  tearDown(ecstatic, t);
  
  ecstatic.stdout.on('data', function(data) {
    var expected = port,
        actual = portRegex.test(data) && portRegex.exec(data)[0]|0;
    t.equal(actual, expected, 'The port number should be ' + port);
  });
  
  checkServerIsRunning(defaultUrl + ':' + port, t);
});

test('setting mimeTypes via cli', function(t) {
  t.plan(2);
  
  var port = getRandomPort();
  var options = ['.', '--port', port];
  var ecstatic = startEcstatic(options);
  
  tearDown(ecstatic, t);
  
  ecstatic.stdout.on("data", function(data) {
    t.ok(true, 'test something');
  });
  
  //TODO: remove error handler
  ecstatic.stderr.setEncoding('utf8');
  ecstatic.stderr.on("data", console.log.bind(console, "error:"))
  ecstatic.stdin.on("data", console.log.bind(console, "in:"))
  
  checkServerIsRunning(defaultUrl + ':' + port, t);
});

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startEcstatic(args, options) {
  console.log("args", args);
  return spawn(node, [require.resolve('../lib/ecstatic.js')].concat(args));
}

function checkServerIsRunning (url, t) {
  request(url, function (err, res, body) {
    if (!err && res.statusCode !== 500) {
      t.pass('a successful request from the server was made');
    } else {
      t.fail('the server could not be reached');
    }
  })
}

function tearDown(ps, t) {
  t.tearDown(function() {
    console.log("KILL!")
    ps.kill('SIGTERM');    
  });
}
