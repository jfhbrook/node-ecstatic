var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request');

test('escaping special characters', function (t) {
  t.plan(3);
  
  var server = http.createServer(ecstatic(__dirname + "/public", { showDir: true }));
  t.on('end', function () { server.close() })
 
  server.listen(0, function () {
    var port = server.address().port;
    request.get('http://localhost:' + port + "/curimit%40gmail.com%20(40%25)", function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(body, 'index!!!\n');
    });
  });
});
