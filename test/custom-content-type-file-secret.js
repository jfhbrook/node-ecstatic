var test = require('tap').test,
    http = require('http'),
    request = require('request'),
    ecstatic = require('../');

function setup(opts) {
  return http.createServer(ecstatic(opts));
}
function teardown(opts) {
  opts = opts || {};
  opts.server.close(function() {
    opts.t && opts.t.end();
    process.stderr.write('# server not closing; slaughtering process.\n');
    process.exit(0);
  });
}

test('custom contentType via .types file', function(t) {
  var server = setup({
    root: __dirname + '/public/',
    'mime-types': 'secret/custom_mime_type.types'
  });

  t.plan(3)

  server.listen(0, function() {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/custom_mime_type.opml', function(err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'application/secret; charset=utf-8');
      teardown({ t:t, server:server });
    });
  });
});
