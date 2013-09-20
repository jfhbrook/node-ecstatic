var test = require('tap').test,
    ecstatic = require('../lib/ecstatic'),
    http = require('http'),
    request = require('request'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    path = require('path');

var root = __dirname + '/public',
    baseDir = 'base';

mkdirp.sync(root + '/emptyDir');

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
    code : 302,
    location: 'subdir/'
  },
  'subdir?foo=bar': {
    code: 302,
    location: 'subdir/?foo=bar'
  },
  'subdir/' : {
    code : 200,
    type : 'text/html',
    body : 'index!!!\n'
  },
  '404' : {
    code : 200,
    type : 'text/html',
    body : '<h1>404</h1>\n'
  },
  'something-non-existant' : {
    code : 200,
    type : 'text/html',
    body : '<h1>404</h1>\n'
  },
  'compress/foo.js' : {
    code : 200,
    file: 'compress/foo.js.gz',
    headers: {'accept-encoding': 'compress, gzip'}
  },
  // no accept-encoding of gzip, so serve regular file
  'compress/foo_2.js' : {
    code : 200,
    file: 'compress/foo_2.js' 
  },
  'emptyDir/': {
    code: 200
  },
  'subdir_with space' : {
    code: 302,
    location: 'subdir_with space/'
  },
  'subdir_with space/index.html' : {
    code: 200,
    type: 'text/html',
    body: 'index :)\n'
  }
};

test('core', function (t) {
  var filenames = Object.keys(files);
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);
  
  var server = http.createServer(
    ecstatic({
      root: root,
      gzip: true,
      baseDir: baseDir,
      autoIndex: true,
      showDir: true,
      handleError: true
    })
  );

  server.listen(port, function () {
    var pending = filenames.length;
    filenames.forEach(function (file) {
      var uri = 'http://localhost:' + port + path.join('/', baseDir, file),
          headers = files[file].headers || {};

      request.get({
        uri: uri,
        followRedirect: false,
        headers: headers
      }, function (err, res, body) {
        if (err) t.fail(err);
        var r = files[file];
        t.equal(res.statusCode, r.code, 'status code for `' + file + '`');
        
        if (r.type !== undefined) {
          t.equal(
            res.headers['content-type'].split(';')[0], r.type,
            'content-type for `' + file + '`'
          );
        }
        
        if (r.body !== undefined) {
          t.equal(body, r.body, 'body for `' + file + '`');
        }

        if (r.location !== undefined) {
          t.equal(res.headers.location, path.join('/', baseDir, r.location), 'location for `' + file + '`');
        }
        
        if (--pending === 0) {
          server.close();
          t.end();
        }
      });
    });
  });
});
