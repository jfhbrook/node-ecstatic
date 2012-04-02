var express = require('express');
var ecstatic = require('../../lib/ecstatic');
var path = require('path');

exports.type = 'express';

exports.startServer = function (root, cb) {

  // Just a randomized port
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);

  var app = express.createServer();

  app.use(ecstatic({
    root: root,
    log: console.error
  }));

  app.use(function (req, res) {
    res.end('Request fell through ecstatic.');
  });

  app.listen(port, function () {
    cb(port, app);
  });

}
