var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request');

test('default default contentType', function(t) {
  var server = http.createServer(ecstatic({
    root: __dirname + '/public/',
    contentType: 'text/plain'
  }));

  t.plan(3);

  t.on('end', function() { server.close(); });

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/f_f', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'text/plain; charset=UTF-8');
      t.end();
    });
  });
});

test('custom contentType', function(t) {
  var server = http.createServer(ecstatic({
    root: __dirname + '/public/'
  }));

  t.plan(3);

  t.on('end', function() { server.close(); });

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/custom_mime_type.opml', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'application/xml; charset=UTF-8');
      t.end();
    });
  });
});