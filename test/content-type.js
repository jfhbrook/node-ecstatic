var test = require('tap').test,
    http = require('http'),
    request = require('request'),
    ecstatic = require('../');

test('default default contentType', function(t) {
  try {
    var server = http.createServer(ecstatic({
      root: __dirname + '/public/',
      contentType: 'text/plain'
    }));
  } catch (e) {
    t.fail(e.message);
    t.end();
  }

  t.plan(3);

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/f_f', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'text/plain; charset=UTF-8');
      server.close(function() { t.end(); });
    });
  });
});
