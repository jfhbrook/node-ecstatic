"use strict";

/* this test suit is incomplete  2015-12-14 */

var test = require('tap').test,
    request = require('request'),
    spawn = require('child_process').spawn,
    node = process.execPath,
    defaultUrl = 'http://localhost',
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
  var port = defaultPort;
  var options = ['.'];
  var ecstatic = startEcstatic(options)
  var portRegex = /(\d{4})/;

ecstatic.stderr.setEncoding('utf8');
ecstatic.stderr.on("data", console.log.bind(console, "error:"))

  ecstatic.stdout.on("data", function(data) {
    var expected = port,
        actual = portRegex.test(data) && portRegex.exec(data)[0]|0;
    t.equal(actual, expected, 'The default port number should be 8000');
    ecstatic.kill('SIGTERM');
    t.end();
  });
  
  /*ecstatic.stderr.on("data", console.log.bind(console, "error:"))
  ecstatic.stdin.on("data", console.log.bind(console, "in:"))*/
});
function startEcstatic(args, options) {
  console.log("args", args);
  return spawn(node, [require.resolve('../lib/ecstatic.js')].concat(args));
}

test('setting port via cli - custom port', function(t) {
  var port = getRandomPort();
  var options = ['.', '--port', port];
  var ecstatic = startEcstatic(options);

ecstatic.stderr.setEncoding('utf8');
ecstatic.stderr.on("data", console.log.bind(console, "error:"))

  
  ecstatic.stdout.on("data", function(data) {
    var portRegex = /(\d{4})/;
    var expected = port,
        actual = portRegex.test(data) && portRegex.exec(data)[0]|0;
    t.equal(actual, expected, 'The port number should be ' + port);
    ecstatic.kill('SIGTERM');
  });
});

function startEcstatic_OLD(options) {
  t.plan(1 + options.tests.length);
  var tests = options.tests;
  var ecstatic = spawn(node, [require.resolve('../lib/ecstatic.js')].concat(options));
  
  checkServerIsRunning(url, t);
  ecstatic.stdout.on('data', function(data) {
    tests.forEach(function(test) {
      test(data, t);
    });
    ecstatic.kill('SIGTERM');
  });
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkServerIsRunning (url, ps, t) {
  request(url, function (err, res, body) {
    if (!err && res.statusCode !== 500) {
      t.pass('a successful request from the server was made');
    } else {
      t.fail('the server could not be reached');
    }
  })
}


/*

test('setting mimeTypes via cli', function(t) {
  t.plan(1);
  
  var port = 1213;
  var options = ['.', '--p ' + port];
  var ecstatic = startEcstatic(options);
  
  ecstatic.stdout.on("data", function(data) {
    t.ok(true, 'test something', true);
    ecstatic.kill('SIGTERM');
  });
  ecstatic.stderr.setEncoding('utf8');
  ecstatic.stderr.on("data", console.log.bind(console, "error:"))
  ecstatic.stdin.on("data", console.log.bind(console, "in:"))
});*/
