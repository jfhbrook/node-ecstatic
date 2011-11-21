var express = require('express');
var ecstatic = require('./ecstatic')(__dirname + '/public');

var app = express.createServer();
app.use(ecstatic);
app.listen(8080);
