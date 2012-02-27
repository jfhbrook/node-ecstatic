var request = require('request');

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
  'subdir' : { //no 301 here because request will redirect
    code : 200,
    type : 'text/html',
    body : 'index!!!\n',
  },
  'subdir/' : {
    code : 200,
    type : 'text/html',
    body : 'index!!!\n',
  },
  'thisIsA404.txt' : {
    code : 404,
    body: '<h1>404\'d!</h1>\n'
  }
  /*, 'emptyDir': { // This one seems to time out.
    code: 200
  }*/
};

module.exports = function (host, port, t, cb) {

  var filenames = Object.keys(files),
      pending = filenames.length;

  t.plan(filenames.length * 4 - 1);

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
      } else { console.error('BODY: '+body); }

      if (--pending === 0) {
        cb();
      }
    });
  });
};
