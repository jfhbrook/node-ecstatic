var union = require('union');
var ecstatic = require('../')(__dirname + '/public');

union.createServer({
  before: [
    ecstatic
  ]
}).listen(8080);

console.log('Listening on :8080');
