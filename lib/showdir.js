var fs = require('fs');
var ent = require('ent');

module.exports = function (dir, res) {
  fs.readdir(dir, function (err, xs) {
    if (err) {
      res.statusCode = 500;
      res.end(err && err.stack || err.toString());
    }
    else {
      var pending = xs.length;
      var dirs = [], files = [], errs = [];
      
      function finish () {
        dirs.sort().forEach(function (file) {
          res.write(
            '<a href="' + encodeURI(file) + '">'
            + ent.encode(file) + '/'
            + '</a>'
          );
        });
        
        files.sort().forEach(function (file) {
          res.write(
            '<a href="' + encodeURI(file) + '">'
            + ent.encode(file)
            + '</a>'
          );
        });
        
        res.end();
      }
      
      xs.forEach(function (file) {
        fs.stat(dir + '/' + file, function (err, s) {
          if (err) errs.push(err)
          else if (s.isDirectory()) dirs.push(file)
          else files.push(file)
          
          if (--pending === 0) finish()
        });
      });
    }
  });
};
