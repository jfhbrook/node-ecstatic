var test = require('tap').test;
var ecstatic = require('../lib/ecstatic');
var express = require('express');
var request = require('request');

var root = __dirname + '/public';

var fs = require('fs');
var files = {
  'a.txt' : {
    code : 200,
    type : 'text/plain',
    body : 'A!!!\n',
  },
  'b.txt' : {
    code : 200,
    type : 'text/plain',
    body : 'B!!!\n',
  },
  'c.js' : {
    code : 200,
    type : 'application/javascript',
    body : 'console.log(\'C!!!\');\n',
  },
  'd.js' : {
    code : 200,
    type : 'application/javascript',
    body : 'console.log(\'C!!!\');\n',
  },
  'subdir/e.html' : {
    code : 200,
    type : 'text/html',
    body : '<b>e!!</b>\n',
  },
  'subdir/index.html' : {
    code : 200,
    type : 'text/html',
    body : 'index!!!\n',
  },
  'subdir' : {
    code : 302
  },
  'subdir/' : {
    code : 200,
    type : 'text/html',
    body : 'index!!!\n',
  },
  '404' : {
    code : 404
  }
};

test('express', function (t) {
  var filenames = Object.keys(files);
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);
  
  var app = express.createServer();
  app.use(ecstatic({ root: root, gzip: true }));
  app.listen(port, function () {
    var pending = filenames.length;
    filenames.forEach(function (file) {
      var uri = 'http://localhost:' + port + '/' + file;
      request.get({
        uri: uri,
        followRedirect: false
      }, function (err, res, body) {
        if (err) t.fail(err);
        var r = files[file];
        t.equal(r.code, res.statusCode, 'code for ' + file);
        
        if (r.type !== undefined) {
          t.equal(
            res.headers['content-type'], r.type,
            'content-type for ' + file
          );
        }
        
        if (r.body !== undefined) {
          t.equal(body, r.body, 'body for ' + file);
        }
        
        if (--pending === 0) {
          app.close();
          t.end();
        }
      });
    });
  });
});
