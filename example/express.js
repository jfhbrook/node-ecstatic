var express = require('express');
var ecstatic = require('../lib/ecstatic');

var app = express.createServer();
app.use(ecstatic({ root : __dirname + '/public', showdir : false }));
app.listen(8080);

console.log('Listening on :8080');
