var test = require('tap').test;

var fs = require('fs'),
    path = require('path');

// TODO: These tests need more coverage.
var files = {
  '/' : {
    statusCode : 200,
    file: '',
    showDir: true
  },
  'a.txt' : {
    statusCode : 200,
    file: 'a.txt'
  },
  'b.txt' : {
    statusCode : 200,
    file: 'b.txt'
  },
  'c.js' : {
    statusCode : 200,
    file: 'c.js'
  },
  'd.js' : {
    statusCode : 200,
    file: 'd.js'
  },
  'subdir/e.html' : {
    statusCode : 200,
    file: 'subdir/e.html'
  },
  'subdir/index.html' : {
    statusCode : 200,
    file: 'subdir/index.html'
  },
  'subdir' : {
    statusCode : 301,
    file: 'subdir' //just so it passes
  },
  'thisIsA404.txt' : {
    statusCode : 404,
    file: 'thisIsA404.txt'
  }
};

var router = require('../lib/ecstatic/router');

test('router', function (t) {
  t.plan(19);

  Object.keys(files).forEach(function(f) {
    router({
      req: {
        url: f
      },
      res: {},
      root: path.resolve(__dirname, './public'),
      baseDir: '/',
      autoIndex: true,
      showDir: true
    }, function (err, received) {
      var expected = files[f];

      t.equal(received.statusCode, expected.statusCode,
        f+' should route with a code '+expected.statusCode);

      var filePath = path.resolve(__dirname, 'public', expected.file);

      // Special case.
      if (expected.file == '') {
        filePath = filePath + '/';
      }

      t.equal(received.file, filePath,
        f+' should route to local file '+filePath);

      if (typeof (expected.showDir) !== 'undefined') {
        console.error('showDir: '+expected.showDir);
        t.equal(received.showDir, expected.showDir,
          f+' should have showdir status '+JSON.stringify(expected.showDir));
      }
    });
  });

});
