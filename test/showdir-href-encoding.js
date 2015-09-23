var test = require('tap').test,
    ecstatic = require('../lib/ecstatic'),
    http = require('http'),
    request = require('request'),
    path = require('path');

var root = __dirname + '/public',
    baseDir = 'base';

test('url encoding in href', function (t) {
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);

  var uri = 'http://localhost:' + port + path.join('/', baseDir, 'show-dir%24%24href_encoding%24%24');

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
      t.match(body, /href="\/base\/show-dir%24%24href_encoding%24%24\/aname%2Baplus.txt"/, 'We found the right href');
      server.close();
      t.end();
    });
  });
});
