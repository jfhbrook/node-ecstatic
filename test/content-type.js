var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http');

function do_test (t, server_options, result) {
  var server = http.createServer(ecstatic(__dirname + '/public/',
    server_options));
  t.on('end', function () { server.close() })
  server.listen(0, function () {
    http.get({
      host: 'localhost',
      port: server.address().port,
      path: '/f_f'
    }).on('response', function (res) {
      t.equal(res.headers['content-type'], result);
      t.end();
    });
  });
}

test('contentType Header return specified', function (t) {
  do_test(t, {contentType: 'text/html'}, 'text/html; charset=UTF-8');
});

test('contentType Header return default', function (t) {
  do_test(t, {}, 'application/octet-stream; charset=utf-8');
});
