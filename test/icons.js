var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request'),
    eol = require('eol'),
    he = require('he');

test('icons', function (t) {
  t.plan(10);
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
    request.get('http://localhost:' + port, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
     
      t.assert(
        ( body.indexOf('<link href="/_ecstatic-assets/ecstatic-icons.css" rel="stylesheet" type="text/css" />') > -1 ),
        'HTML should link to icon CSS'
      );
      t.assert(
        ( body.indexOf('<link href="/_ecstatic-assets/ecstatic.css" rel="stylesheet" type="text/css" />') > -1 ),
        'HTML should link to CSS'    
      );
      t.assert(
        ( body.indexOf('<a href="http://www.famfamfam.com/lab/icons/silk/">Silk Icons</a>') > -1 ),
        'Should attribute Silk icons'
      );
      t.assert(
        ( body.indexOf('<i class="_7z"></i></td><td><a href="/duck.7z">duck.7z</a>') > -1 ),
        'Should generate .7z icon class on duck.7z'
      );
      t.assert(
        ( body.indexOf('<i class="txt"></i></td><td><a href="/duck.txt">duck.txt</a>') > -1 ),
        'Should generate .txt icon class on duck.txt'
      );
      t.assert(
        ( body.indexOf('<i class="txt"></i></td><td><a href="/duck.7z.txt">duck.7z.txt</a>') > -1 ),
        'Should generate .txt icon on duck.7z.txt'
      );
      t.assert(
        ( body.indexOf('<i class="__folder"></i>') > -1 ),
        'should generate folder icon class (__folder)'
      );      
      t.assert(
        ( body.toLowerCase().indexOf( '<i class="_' + he.encode('语').toLowerCase() + '">' ) > -1 ),
        'should generate icon class for unicode file extension ( _' + he.encode('语') + ' )'
      );
      
      server.close(function() { t.end(); });
    });
  });
});



test('no icons',function(t){
  t.plan(6);
    var server = http.createServer(
    ecstatic(
      __dirname + '/public/extensions',
      {
        showdir:true
      }
    )
  );
  server.listen(0, function () {
    var port = server.address().port;
    request.get('http://localhost:' + port, function (err, res, body) {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.assert(
        ( body.indexOf('ecstatic-icons.css') === -1 ),
        'HTML should not link to icon CSS'
      );
      t.assert(
        ( body.indexOf('<link href="/_ecstatic-assets/ecstatic.css" rel="stylesheet" type="text/css" />') > -1 ),
        'HTML should link to page CSS'    
      );
      t.assert(
        ( body.toLowerCase().indexOf('silk') === -1 ),
        'Should not attribute Silk icons'
      );
      t.assert(
        ( body.indexOf('<i class="') === -1 ),
        'Should not generate any icons'
      );
      
      server.close(function() { t.end(); });
    });
  });
  
  
});
