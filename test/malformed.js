var test = require('tap').test,
    ecstatic = require('../lib/ecstatic'),
    http = require('http')
;

test('malformed uri', function (t) {
  t.plan(1);
  var server = http.createServer(ecstatic(__dirname));
  t.on('end', function () {
    server.close();
  });
  
  server.listen(0, function () {
    var r = http.get({
      host: 'localhost',
      port: server.address().port,
      path: '/%'
    });
    r.on('response', function (res) {
      t.equal(res.statusCode, 400);
    });
  });
});
