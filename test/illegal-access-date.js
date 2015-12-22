var test = require('tap').test,
    ecstatic = require('../lib/ecstatic'),
    http = require('http'),
    path = require('path'),
    request = require('request');

test('if-modified-since illegal access date', function (t) {
  var dir = path.join(__dirname, 'public');
  var server = http.createServer(ecstatic(dir))
  
  t.plan(2);
  
  server.listen(0, function () {
    var opts = {
      url: 'http://localhost:' + server.address().port + '/a.txt',
      headers: { 'if-modified-since': '275760-09-24' }
    };
    request.get(opts, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      server.close(function() { t.end(); });
    });
  });
});
