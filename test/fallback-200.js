var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request'),
    eol = require('eol');

function runTest(path, expectedBody) {
  return function (t) {
    t.plan(3);
    var server = http.createServer(ecstatic(__dirname + '/public/containsFallback'));

    server.listen(0, function () {
      var port = server.address().port;
      request.get('http://localhost:' + port + path, function (err, res, body) {
        t.ifError(err);
        t.equal(res.statusCode, 200);
        t.equal(eol.lf(body), expectedBody);
        server.close(function() { t.end(); });
      });
    });
  };
}

test('fallback showsIndex', runTest('/', 'index!!!\n'));
test('fallback showsNonIndex', runTest('/pageTwo.html', 'pageTwo!!!\n'));
test('fallback showsSubDir', runTest('/subdir', 'subdir index!!!\n'));
test('fallback fallsBack 1', runTest('/something', '200.html fallback!!!\n'));
test('fallback fallsBack 2', runTest('/else.html', '200.html fallback!!!\n'));
test('fallback fallsBack 3', runTest('/with/multiple/paths', '200.html fallback!!!\n'));
