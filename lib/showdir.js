var fs = require('fs');
var path = require('path');
var ent = require('ent');

module.exports = function (dir, pathname, res) {
  fs.readdir(dir, function (err, xs) {
    if (err) {
      res.statusCode = 500;
      res.end(err && err.stack || err.toString());
    }
    else {
      var pending = xs.length;
      var dirs = [], files = [], errs = [];
      
      function writeFile (file) {
        var p = path.join(pathname, file);
        res.write(
          '<div><a href="' + encodeURI(p) + '">'
          + ent.encode(file) + '</a></div>'
        );
      }
      
      function finish () {
        dirs.sort().forEach(function (file) {
          writeFile(file + '/');
        });
        files.sort().forEach(writeFile);
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
