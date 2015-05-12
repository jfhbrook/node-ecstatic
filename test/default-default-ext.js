var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request'),
    eol = require('eol');

test('default defaultExt', function (t) {
  t.plan(3);
  var server = http.createServer(ecstatic(__dirname + '/public/subdir'));
 
  server.listen(0, function () {
    var port = server.address().port;
    request.get('http://localhost:' + port, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(eol.lf(body), 'index!!!\n');
      server.close(function() { t.end(); });
    });
  });
});
