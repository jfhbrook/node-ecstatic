// This is so you can have options aliasing and defaults in one place. 

module.exports = function (opts) {

  var autoIndex = true,
      showDir = false,
      defaultExt;

  if (opts) {
    [
      'autoIndex',
      'autoindex'
    ].some(function (k) {
      if (typeof opts[k] !== undefined && opts[k] !== null) {
        autoIndex = opts[k];
        return true;
      }
    });

    [
      'showDir',
      'showdir'
    ].some(function (k) {
      if (typeof opts[k] !== undefined && opts[k] !== null) {
        showDir = opts[k];
        return true;
      }
    });


    if (opts.defaultExt) {
      if (opts.defaultExt === true) {
        defaultExt = 'html';
      }
      else {
        defaultExt = opts.defaultExt;
      }
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
