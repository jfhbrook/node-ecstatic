var test = require('tap').test,
    ecstatic = require('../lib/ecstatic'),
    http = require('http'),
    request = require('request');

test('malformed showdir uri', function (t) {
  var server = http.createServer(ecstatic(__dirname, { showDir: true }));
  
  t.plan(2);
  
  server.listen(0, function () {
    
    request.get('http://localhost:' + server.address().port + '/?%', function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 400);
      server.close(function() { t.end(); });
    });

  });
});
