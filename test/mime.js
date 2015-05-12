var test = require('tap').test,
	  mime;

function setup() {
  mime = require('mime');
}
function teardown(t) {
  t && t.end();
  mime = null;
}

test('mime package lookup', function(t) {
  setup();

  t.plan(4);

  t.equal(mime.lookup('/path/to/file.txt'), 'text/plain');
  t.equal(mime.lookup('file.txt'), 'text/plain');
  t.equal(mime.lookup('.TXT'), 'text/plain');
  t.equal(mime.lookup('htm'), 'text/html');

  teardown(t);
});

test('custom definition of mime-type with the mime package', function(t) {
  setup();

  t.plan(1);

  mime.define({
    'application/xml': ['opml']
  });
  t.equal(mime.lookup('.opml'), 'application/xml');

  teardown(t);
});

test('custom definition of mime-type with a .types file', function(t) {
  setup();

  t.plan(2);

  mime.load('public/custom_mime_type.types');
  t.equal(mime.lookup('.opml'), 'application/foo'); // see public/custom_mime_type.types

	t.throws( mime.load.bind(mime, 'public/this_file_does_not_exist.types') );

  teardown(t);
});
