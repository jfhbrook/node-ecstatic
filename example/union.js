var union = require('union');
var ecstatic = require('ecstatic')(__dirname + '/public');

union.createServer({
  before: [
    ecstatic
  ]
}).listen(8080);
