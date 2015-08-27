var test = require('tap').test,
    ecstatic = require('../lib/ecstatic'),
    http = require('http'),
    request = require('request'),
    path = require('path');

var root = __dirname + '/public',
    baseDir = 'base';

test('directory listing with pathname including HTML characters', function (t) {
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);

  var uri = 'http://localhost:' + port + path.join('/', baseDir, '/%3Cdir%3E');

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
    }, function(err, res, body) {
      t.notMatch(body, /<dir>/, 'We didn\'t find the unencoded pathname');
      t.match(body, /&#x3C;dir&#x3E;/, 'We found the encoded pathname');
      server.close();
      t.end();
    });
  });
});
