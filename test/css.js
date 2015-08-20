var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request'),
    eol = require('eol');

test('css', function (t) {
  t.plan(5);
  var server = http.createServer(
  ecstatic(
    __dirname + '/public/extensions',
    {
      icons:true,
      showdir:true
    }
  )
  );
 
  server.listen(0, function () {
    var port = server.address().port;
    request.get('http://localhost:' + port + '/_ecstatic-assets/ecstatic.css', function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200, 'should serve up ecstatic.css');
      t.assert(body.indexOf('{') >= 0, 'should serve up CSS file') // simple (and imperfect) check for CSS
        
      request.get('http://localhost:' + port + '/_ecstatic-assets',function(err,res,body){
        t.ifError(err);
        t.equal(body.indexOf('<html>'), -1, 'should not serve asset directory contents');
        server.close(function() { t.end(); });
      });
    });
  });
});

