var request = require('request');

// With autoindexing, showDir and error handling all turned off, each of these
// should pass through our middleware no sweat...right?
var files = {
  'subdir/index.html' : {
    code : 500,
    type : 'text/plain',
    body : 'Request fell through ecstatic.'
  },
  'subdir/' : {
    code : 500,
    type : 'text/plain',
    body : 'Request fell through ecstatic.'
  },
  'thisIsA404.txt' : {
    code : 500,
    type : 'text/plain',
    body : 'Request fell through ecstatic.'
  },
  'emptyDir': {
    code : 500,
    type : 'text/plain',
    body : 'Request fell through ecstatic.'
  }
};

module.exports = function (host, port, t, cb) {

  var filenames = Object.keys(files),
      pending = filenames.length;

  t.plan(16);

  filenames.forEach(function (file) {
    var uri = 'http://localhost:' + port + '/' + file;

    request.get(uri, function (err, res, body) {
      if (err) {
        console.error(err.stack);
      }
      t.notOk(err, 'should not have a request error');

      var r = files[file];

      if (!res) {
        t.fail(new Error('`res` is undefined.'));
      }

      t.equal( res.statusCode, r.code, 'code for ' + file);

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
        cb();
      }
    });
  });
};
