var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request'),
    eol = require('eol');

test('escaping special characters', function (t) {
  var server = http.createServer(ecstatic(__dirname + '/public'));
 
  server.listen(0, function () {
    var port = server.address().port;
    request.get('http://localhost:' + port + "/curimit%40gmail.com%20(40%25)", function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(eol.lf(body), 'index!!!\n');
      server.close(function() { t.end(); });
    });
  });
});
