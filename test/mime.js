'use strict';

const test = require('tap').test;
const mime = require('../lib/ecstatic/mime');

test('mime package lookup', (t) => {
  t.plan(7);

  t.equal(mime.getType('/path/to/file.css'), 'text/css');
  t.equal(mime.getType('/path/to/file.js'), 'application/javascript');
  t.equal(mime.getType('/path/to/file.mjs'), 'application/javascript');
  t.equal(mime.getType('/path/to/file.txt'), 'text/plain');
  t.equal(mime.getType('file.txt'), 'text/plain');
  t.equal(mime.getType('.TXT'), 'text/plain');
  t.equal(mime.getType('htm'), 'text/html');

  t.end();
});

test('charset lookup', (t) => {
  t.plan(1);
  t.equal(mime.lookupCharset('application/wasm'), null);
});

test('custom definition of mime-type', (t) => {
  t.plan(1);

  mime.define({
    'application/xml': ['opml'],
  });
  t.equal(mime.getType('.opml'), 'application/xml');

  t.end();
});

test('custom mime-type lookup function', (t) => {
  t.plan(1);

  mime.setCustomGetType(() => 'application/pony');

  t.equal(mime.getType('whatever'), 'application/pony');
});
