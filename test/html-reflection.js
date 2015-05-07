var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request');

var server;

test('html reflection prevented', function (t) {
  server = http.createServer(ecstatic(__dirname + '/public/containsSymlink'));

  server.listen(0, function () {
    var port = server.address().port;
    var attack = '<script>alert(\'xss\')</script>';
    request.get('http://localhost:' + port + '/more-problematic/' + attack, function (err, res, body) {
      if ((!res.headers['content-type'] || res.headers['content-type'] == 'text/html') &&
          body.indexOf(attack) != -1) {
        t.fail('Unescaped HTML reflected with vulnerable or missing content-type.');
      }
      t.end();
    });
  });
});

test('server teardown', function (t) {
  server.close();

  var to = setTimeout(function () {
    process.stderr.write('# server not closing; slaughtering process.\n');
    process.exit(0);
  }, 5000);
  t.end();
});
