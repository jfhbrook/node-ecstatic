var test = require('tap').test,
  ecstatic = require('../lib/ecstatic'),
  http = require('http'),
  request = require('request'),
  path = require('path');

var root = __dirname + '/public',
  baseDir = 'base';

test('external stylesheet in directory listing', function (t) {
  var port = Math.floor(Math.random() * ((1 << 16) - 1e4) + 1e4);

  var uri = 'http://localhost:' + port + '/base/';

  var server = http.createServer(
    ecstatic({
      root: root,
      baseDir: baseDir,
      showDir: true,
      autoIndex: false
    })
  );

  server.listen(port, function () {
    request.get({
      uri: uri
    }, function (err, res, body) {
      t.ok(!err && res.statusCode == 200, 'Successful response for directory listing page');
      t.ok(/<title>Index of \/base\/<\/title>/.test(body), 'Directory listing of the right page');

      var cssLinkMatch = /<link[^>]*href="([^"]*)"[^>]*>/.exec(body);
      t.ok(cssLinkMatch, 'Found the css link');
      var cssLinkUri = uri + cssLinkMatch[1];

      request.get({uri: cssLinkUri}, function(err, res, body) {
        t.ok(!err && res.statusCode == 200, 'Successful response for css link');
        t.ok(res.headers['content-type'] == 'text/css', 'ContentType is text/css for css link');

        server.close();
        t.end();
      });
    });
  });
});
