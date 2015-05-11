/// <reference path="../typings/node/node.d.ts"/>
var test = require('tap').test,
    http = require('http'),
    request = require('request'),
    ecstatic;

function setup(opts) {
  ecstatic = require('../');
  return http.createServer(ecstatic(opts));
}
function teardown(t) {
  t && t.end();
  ecstatic = null;
}

test('default default contentType', function(t) {
  var server = setup({
    root: __dirname + '/public/',
    contentType: 'text/plain'
  });

  t.plan(3);

  t.on('end', function() { server.close(); });

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/f_f', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'text/plain; charset=UTF-8');
      teardown(t);
    });
  });
});

test('custom contentType', function(t) {
  var server = setup({
    root: __dirname + '/public/',
    mimetype: {
      'application/xml': ['opml']
    }
  });

  t.plan(3);

  t.on('end', function() { server.close(); });

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/custom_mime_type.opml', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'application/xml; charset=utf-8');
      teardown(t);
    });
  });
});

test('custom contentType via .types file', function(t) {
  var server = setup({
    root: __dirname + '/public/',
    'mime-types': 'custom_mime_type.types'
  });

  t.plan(3);

  t.on('end', function() { server.close(); });

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/custom_mime_type.opml', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'application/xml; charset=utf-8');
      teardown(t);
    });
  });
});

test('throws when custom contentType .types file does not exist', function(t) {
  t.plan(1);

  t.throws(
    setup.bind(null, {
      root: __dirname + '/public/',
      'mime-types': 'this_file_does_not_exist.types'
    })
  );

  teardown(t);
});
