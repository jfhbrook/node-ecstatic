"use strict";

/* this test suit is incomplete  2015-12-14 */

var test = require('tap').test,
    request = require('request'),
    spawn = require('child_process').spawn,
    node = process.execPath

function startEcstatic(options) {
  options = options || [];
  return spawn(node, [require.resolve('../lib/ecstatic.js')].concat(options));
}

test('setting port via cli - default port', function(t) {
  t.plan(1);
  var ecstatic = startEcstatic();
  
  ecstatic.stdout.on("data", function(data) {
    var portRegex = /(\d{4})/;
    var expected = 8000,
        actual = portRegex.test(data) && portRegex.exec(data)[0]|0;
    t.equal(actual, expected, 'The default port number should be 8000');
    ecstatic.kill('SIGTERM');
  });  
  /*ecstatic.stderr.on("data", console.log.bind(console, "error:"))
  ecstatic.stdin.on("data", console.log.bind(console, "in:"))*/
});

test('setting port via cli - custom port', function(t) {
  t.plan(1);
  var ecstatic = startEcstatic(['--port ' + 1213]);
  
  ecstatic.stdout.on("data", function(data) {
    var portRegex = /(\d{4})/;
    var expected = 1213,
        actual = portRegex.test(data) && portRegex.exec(data)[0]|0;
    t.equal(actual, expected, 'The port number should be 1213');
    ecstatic.kill('SIGTERM');
  });
});

test('setting mimeTypes via cli', function(t) {
  t.plan(1);
  
  var port = 1213;
  var options = ['.', '--p ' + port];
  var ecstatic = startEcstatic(options);
  
  ecstatic.stdout.on("data", function(data) {
    t.ok(true, 'test something', true);
    ecstatic.kill('SIGTERM');
  });
  /*ecstatic.stderr.setEncoding('utf8');
  ecstatic.stderr.on("data", console.log.bind(console, "error:"))
  ecstatic.stdin.on("data", console.log.bind(console, "in:"))*/
});
