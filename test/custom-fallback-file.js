var test = require('tap').test,
    http = require('http'),
    request = require('request'),
    ecstatic = require('../');

test('custom fallbackFile', function(t) {
  try {
    var server = http.createServer(ecstatic({
      root: __dirname + '/public/',
      fallbackFile: 'a.txt'
    }));
  } catch (e) {
    t.fail(e.message);
    t.end();
  }

  t.plan(4);

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/file-not-found', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200, 'status code should be ok');
      t.equal(res.headers['content-type'], 'text/plain; charset=UTF-8');
      server.close(function() { t.end(); });
      t.equal('A!!!\n', body);
    });
  });
});
