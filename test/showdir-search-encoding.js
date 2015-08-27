var test = require('tap').test,
    ecstatic = require('../lib/ecstatic'),
    http = require('http'),
    request = require('request'),
    path = require('path');

var root = __dirname + '/public',
    baseDir = 'base';

test('directory listing with query string specified', function (t) {
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);

  var uri = 'http://localhost:' + port + path.join('/', baseDir, '?a=1&b=2');

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
      t.match(body, /href="\/base\/subdir\/\?a=1&#x26;b=2"/, 'We found the encoded href');
      t.notMatch(body, /a=1&b=2/, 'We didn\'t find the unencoded query string value');
      server.close();
      t.end();
    });
  });
});
