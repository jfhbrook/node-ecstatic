var union = require('union');
var ecstatic = require('../');

union.createServer({
  before: [
    ecstatic(__dirname + '/public'),
    ecstatic.showDir(__dirname + '/public')
  ]
}).listen(8080);

console.log('Listening on :8080');
