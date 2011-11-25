exports['304'] = function (res, next) {
  res.statusCode = 304;
  res.end();
};

exports['403'] = function (res, next) {
  if (next) {
    next();
  }
  else {
    res.statusCode = 403;
    if (res.writable) {
      res.setHeader('content-type', 'text/plain');
      res.end('ACCESS DENIED');
    }
  }
};

exports['405'] = function (res, next, opts) {
  res.statusCode = 405;

  res.setHeader('allow', (opts && opts.allow) || 'GET, HEAD');
  res.end();
};

exports['404'] = function (res, next) {
  if (typeof next === "function") {
    next();
  }
  else {

    if (res.writable) {
      res.setHeader('content-type', 'text/plain');
      res.end('File not found. :(');
    }
  }
};

exports['500'] = function (res, next, opts) {
  res.statusCode = 500;
  // TODO: Return nicer messages
  res.end(opts.error.stack || opts.error.toString() || "No specified error");
};
