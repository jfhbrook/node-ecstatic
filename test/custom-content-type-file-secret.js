var test = require('tap').test,
    http = require('http'),
    request = require('request'),
    ecstatic = require('../');

test('custom contentType via .types file', function(t) {
  try {
    var server = http.createServer(ecstatic({
      root: __dirname + '/public/',
      mimetypes: __dirname + '/fixtures/custom_mime_type.types'
    }));
  } catch (e) {
    t.fail(e.message);
    t.end();
  }

  t.plan(3)

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/custom_mime_type.opml', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200, 'custom_mime_type.opml should be found');
      t.equal(res.headers['content-type'], 'application/secret; charset=utf-8');
      server.close(function() { t.end(); });
    });
  });
});
