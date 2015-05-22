var test = require('tap').test,
    http = require('http'),
    request = require('request'),
    ecstatic = require('../');

test('custom contentType', function(t) {
  try {
    var server = http.createServer(ecstatic({
      root: __dirname + '/public/',
      mimetype: {
        'application/jon': ['opml']
      }
    }));
  } catch (e) {
    t.fail(e.message);
    t.end();
  }

  t.plan(3);

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/custom_mime_type.opml', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200, 'custom_mime_type.opml should be found');
      t.equal(res.headers['content-type'], 'application/jon; charset=utf-8');
      server.close(function() { t.end(); });
    });
  });
});
