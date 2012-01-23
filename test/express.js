var express = require('express');
var ecstatic = require('../lib/ecstatic');
var assert = require('assert');

exports.type = 'express';

exports.startServer = function (dir, cb) {

  // Just a randomized port
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);

  var app = express.createServer();

  app.use(ecstatic(dir));

  app.listen(port, function () {
    cb(port, app);
  });

}
