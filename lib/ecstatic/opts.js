// This is so you can have options aliasing and defaults in one place. 

module.exports = function (opts) {

  var autoIndex = !opts
    || [
      'autoIndex',
      'autoindex'
    ].some(function (k) {
      return opts[k];
    });

  var showDir = !opts
    || [
      'showDir',
      'showdir'
    ].some(function (k) {
      return opts[k];
    });

  var defaultExt;

  if (opts && opts.defaultExt) {
    if (opts.defaultExt === true) {
      defaultExt = 'html';
    }
    else {
      defaultExt = opts.defaultExt;
    }
  }

  return {
    cache: (opts && opts.cache) || 3600,
    autoIndex: autoIndex,
    showDir: showDir,
    defaultExt: defaultExt,
    baseDir: (opts && opts.baseDir) || '/'
  }
}
