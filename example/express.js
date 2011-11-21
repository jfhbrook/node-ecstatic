var express = require('express');
var ecstatic = require('../')(__dirname + '/public');

var app = express.createServer();
app.use(ecstatic);
app.listen(8080);

console.log('Listening on :8080');
