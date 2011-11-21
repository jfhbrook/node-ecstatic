var test = require('tap').test;
var ecstatic = require('../');
var express = require('express');
var request = require('request');

var root = __dirname + '/express';

var fs = require('fs');
var files = {
  'a.txt' : {
    type : 'text/plain',
    body : 'A!!!\n',
  },
  'b.txt' : {
    type : 'text/plain',
    body : 'B!!!\n',
  },
  'c.js' : {
    type : 'text/javascript',
    body : 'console.log(\'C!!!\');\n',
  },
  'd.js' : {
    type : 'text/javascript',
    body : 'console.log(\'C!!!\');\n',
  },
  'subdir/e.html' : {
    type : 'text/html',
    body : '<b>e!!</b>\n',
  },
  'subdir/index.html' : {
    type : 'text/html',
    body : 'index!!!\n',
  },
  'subdir' : {
    type : 'text/html',
    body : 'index!!!\n',
  },
};

test('express', function (t) {
  var filenames = Object.keys(files);
  t.plan(filenames.length);
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);
  
  var app = express.createServer();
  app.use(ecstatic(root));
  app.listen(port, function () {
    var pending = filenames.length;
    filenames.forEach(function (file) {
      var uri = 'http://localhost:' + port + '/' + file;
      request.get(uri, function (err, res, body) {
        if (err) t.fail(err);
        t.equal(
          files[file].type, res.headers['content-type'],
          'content-type differs for ' + file
        );
        t.equal(files[file].body, body, 'body differs for ' + file);
        
        if (--pending === 0) {
          app.close();
          t.end();
        }
      });
    });
  });
});
