// This is so you can have options aliasing and defaults in one place.

module.exports = function (opts) {

  var autoIndex = true,
      showDir = true,
      humanReadable = true,
      si = false,
      cache = 'max-age=3600',
      gzip = false,
      defaultExt = '.html',
      handleError = true,
      serverHeader = true,
      contentType = 'application/octet-stream',
      mimeTypes;

  function isDeclared(k) {
    return typeof opts[k] !== 'undefined' && opts[k] !== null;
  }

  if (opts) {
    [
      'autoIndex',
      'autoindex'
    ].some(function (k) {
      if (isDeclared(k)) {
        autoIndex = opts[k];
        return true;
      }
    });

    [
      'showDir',
      'showdir'
    ].some(function (k) {
      if (isDeclared(k)) {
        showDir = opts[k];
        return true;
      }
    });

    [
      'humanReadable',
      'humanreadable',
      'human-readable'
    ].some(function (k) {
      if (isDeclared(k)) {
        humanReadable = opts[k];
        return true;
      }
    });

    [
      'si',
      'index'
    ].some(function (k) {
      if (isDeclared(k)) {
        si = opts[k];
        return true;
      }
    });

    if (opts.defaultExt && typeof opts.defaultExt === 'string') {
      defaultExt = opts.defaultExt;
    }

    if (typeof opts.cache !== 'undefined' && opts.cache !== null) {
      if (typeof opts.cache === 'string') {
        cache = opts.cache;
      }
      else if(typeof opts.cache === 'number') {
        cache = 'max-age=' + opts.cache;
      }
    }

    if (typeof opts.gzip !== 'undefined' && opts.gzip !== null) {
      gzip = opts.gzip;
    }

    [
      'handleError',
      'handleerror'
    ].some(function (k) {
      if (isDeclared(k)) {
        handleError = opts[k];
        return true;
      }
    });

    [
      'serverHeader',
      'serverheader',
      'server-header'
    ].some(function (k) {
      if (isDeclared(k)) {
        serverHeader = opts[k];
        return true;
      }
    });

    [
      'contentType',
      'contenttype',
      'content-type'
    ].some(function (k) {
      if (isDeclared(k)) {
        contentType = opts[k];
        return true;
      }
    });

    [
      'mimetype',
      'mimetypes',
      'mimeType',
      'mimeTypes',
      'mime-type',
      'mime-types',
      'mime-Type',
      'mime-Types'
    ].some(function (k) {
      if (isDeclared(k)) {
        mimeTypes = opts[k];
        return true;
      }
    });

  }

  return {
    cache: cache,
    autoIndex: autoIndex,
    showDir: showDir,
    humanReadable: humanReadable,
    si: si,
    defaultExt: defaultExt,
    baseDir: (opts && opts.baseDir) || '/',
    gzip: gzip,
    handleError: handleError,
    serverHeader: serverHeader,
    contentType: contentType,
    mimeTypes: mimeTypes
  };
};
