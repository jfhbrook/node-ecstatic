var test = require('tap').test,
    ecstatic = require('../lib/ecstatic'),
    http = require('http');

test('malformed showdir uri', function (t) {
  var server = http.createServer(ecstatic(__dirname, { showDir: true }));
  
  t.plan(1);
  
  server.listen(0, function () {
    var r = http.get({
      host: 'localhost',
      port: server.address().port,
      path: '/?%'
    });
    r.on('response', function (res) {
      t.equal(res.statusCode, 400);
      server.close(function() { t.end(); });
    });
  });
});
