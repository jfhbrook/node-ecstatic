var fs = require('fs'),
    path = require('path');

module.exports = {
  'index.html' : {
    code : 200,
    type : 'text/html',
    body : 'index!!!\n',
  },
  'scripts.js' : {
    code : 200,
    type : 'application/javascript',
    body : 'var foo = bar;\n',
  }
};

if (require.main === module) {
  console.log("ok 1 - test cases included");
}
