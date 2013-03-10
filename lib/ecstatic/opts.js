// This is so you can have options aliasing and defaults in one place. 

module.exports = function (opts) {

  var autoIndex = true,
      showDir = false,
      cache = 'max-age=3600',
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

	if (opts.cache !== undefined) {
	  if (typeof opts.cache === 'string') {
		cache = opts.cache
	  } else if(typeof opts.cache === 'number') {
		cache = 'max-age=' + opts.cache;
	  }
	}
  }

  return {
    cache: cache,
    autoIndex: autoIndex,
    showDir: showDir,
    defaultExt: defaultExt,
    baseDir: (opts && opts.baseDir) || '/'
  }
}
