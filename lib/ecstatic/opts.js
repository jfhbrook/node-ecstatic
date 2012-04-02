// This is so you can have options aliasing and defaults in one place.

var path = require('path');

module.exports = function optsParser (opts) {

  function setOpt (prop, def) {
    return (opts && opts[prop]) || def;
  }

  if (!opts.root) {
    throw new Error('You must explicitly set the root path to be served with ecstatic.');
  }

  return {
    // The root file:// directory
    root: path.join(opts.root, '/'),
    // The base url directory.
    baseDir: path.join(setOpt('urlRoot') || setOpt('baseDir', ''), '/'),
    // Cache time, in seconds. Default is 3600.
    cache: setOpt('cache', 3600),
    // If false, does not redirect folder/ to folder/index.html
    autoIndex: setOpt('autoIndex', true),
    // If false, does not attempt to make directory listings.
    showDir: setOpt('showDir', true),
    // If false, do not show error pages. If list, only show *those* types
    // of errors.
    handleErrors: setOpt('handleErrors', true),
    // If true, then attempt to serve gzipped files if they exist
    gzip: setOpt('gzip', false),
    log: setOpt('log', function () {})
  }
};
