var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request');

test('should not add trailing slash when showDir and autoIndex are off', function (t) {
  t.plan(3);
  var server = http.createServer(
    ecstatic({
      root: __dirname + '/public',
      autoIndex: false,
      showDir: false
    })
  );
  t.on('end', function () { server.close() })
  server.listen(0, function () {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/subdir', function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 404);
      t.equal(res.body, 'File not found. :(');
    });
  });
});
