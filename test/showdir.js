var test = require('tap').test;

var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    showDir = require('../lib/ecstatic/showdir'),
    request = require('request');

test('showDir', function (t) {

  // Randomized port
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);

  port = 8080;

  // We'll just test this with express for now
  var app = express.createServer();

  app.use(showDir({
    from: path.resolve(__dirname, 'public'),
    to: '/'
  }));

  app.use(function (req, res) {
    res.end('Request fell through showDir.');
  });

  app.listen(port, function () {
    var planned = 3;

    t.plan(planned);

    //test for showed directory properly
    request.get('http://localhost:' + port + '/', function (err, res, body) {
      t.equal(res.statusCode, 200);
      t.equal(body, [
        '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN""http://www.w3.org/TR/html4/loose.dtd">',
          '<html>',
          '  <head>',
          '    <title>Index of /</title>',
          '  </head>',
          '  <body>',
          '    <h1>Index of /</h1>',
          '    <table>',
          '      <tr><td><a href="/compress">compress</a></td></tr>',
          '      <tr><td><a href="/emptyDir">emptyDir</a></td></tr>',
          '      <tr><td><a href="/subdir">subdir</a></td></tr>',
          '      <tr><td><a href="/404.html">404.html</a></td></tr>',
          '      <tr><td><a href="/a.txt">a.txt</a></td></tr>',
          '      <tr><td><a href="/b.txt">b.txt</a></td></tr>',
          '      <tr><td><a href="/c.js">c.js</a></td></tr>',
          '      <tr><td><a href="/d.js">d.js</a></td></tr>',
          '    </table>',
          '    <br>',
          '    <address>Node.js v0.6.14/<a href="https://github.com/jesusabdullah/node-ecstatic">ecstatic</a> server running @ localhost:8080</address>',
          '  </body>',
          '</html>'
      ].join('\n'));

      planned -= 2;
      if (!planned) {
        finish();
      }
    });

    request.get('http://localhost:' + port + '/butts', function (err, res, body) {
      t.equal(body, 'Request fell through showDir.');

      if (!--planned) {
        finish();
      }
    });

    function finish () {
      app.close();
      t.end();
    }


  });
});
