var express = require('express');
var ecstatic = require('../lib/ecstatic');

exports.type = 'express';

exports.startServer = function (dir, cb) {
  var host = 'localhost';

  // Just a randomized port
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);

  var app = express.createServer();

  app.use(ecstatic(dir, {
    logger: console.error
  }));

  app.use(function (req, res) {
    res.end('Request fell through ecstatic.');
  });

  app.listen(host, port);

  cb(null, host, port, app);

}
