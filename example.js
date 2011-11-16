var union = require("union"),
    express = require("express"),
    expressStatic = express.static(__dirname + '/public'),
    ecstatic = require("./ecstatic")(__dirname + '/public');

union.createServer({
  before: [
    ecstatic
  ]
}).listen(8080);

express.createServer(ecstatic).listen(8081);

console.log("union: localhost:8080");
console.log("express: localhost:8081");
