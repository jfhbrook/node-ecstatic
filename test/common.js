var test = require('tap').test;

var common = require('../lib/ecstatic/common');

test('helpers', function (t) {
  t.equal('/foo/bar/baz/pow.js', common.getLocalDirectory('/foo/bar/baz', '/biff', '/biff/pow.js'), 'Local directory handler correctly resolves directories');
  t.end();
});
