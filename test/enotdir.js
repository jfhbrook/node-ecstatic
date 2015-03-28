var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request');

test('should handle ENOTDIR as 404', function (t) {
  t.plan(3);
  var server = http.createServer(ecstatic(__dirname + '/public/subdir'));
  t.on('end', function () { server.close() })
  server.listen(0, function () {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/index.html/hello', function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 404);
      t.equal(res.body, 'File not found. :(');
    });
  });
});