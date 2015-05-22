'use strict';

var test = require('tap').test,
  ecstatic = require('../lib/ecstatic'),
  union = require('union'),
  request = require('request'),
  path = require('path'),
  eol = require('eol');

var subdir = __dirname + '/public/subdir',
    anotherSubdir = __dirname + '/public/another-subdir',
    baseDir = 'base';

var cases = require('./fixtures/union-multiple-folders-cases');

test('union', function(t) {
  var filenames = Object.keys(cases);
  var port = Math.floor(Math.random() * ((1 << 16) - 1e4) + 1e4);

  var server = union.createServer({
    before: [
      ecstatic({
        root: subdir,
        gzip: true,
        baseDir: baseDir,
        autoIndex: true,
        showDir: true,
        defaultExt: 'html',
        handleError: true
      }), ecstatic({
        root: anotherSubdir,
        gzip: true,
        baseDir: baseDir,
        autoIndex: true,
        showDir: true,
        defaultExt: 'html',
        handleError: true
      })
    ]
  });

  server.listen(port, function() {
    var pending = filenames.length;

    t.plan(pending * 3);

    filenames.forEach(function(file) {
      var uri = 'http://localhost:' + port + path.join('/', baseDir, file),
        headers = cases[file].headers || {};

      request.get({
        uri: uri,
        followRedirect: false,
        headers: headers
      }, function(err, res, body) {
        if (err) t.fail(err);
        var r = cases[file];
        t.equal(res.statusCode, r.code, 'status code for `' + file + '`');

        if (r.type !== undefined) {
          t.equal(
            res.headers['content-type'].split(';')[0], r.type,
            'content-type for `' + file + '`'
          );
        }

        if (r.body !== undefined) {
          t.equal(eol.lf(body), r.body, 'body for `' + file + '`');
        }

        if (--pending === 0) {
          server.close();
          t.end();
        }
      });
    });
  });
});
