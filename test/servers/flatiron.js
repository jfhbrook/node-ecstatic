var flatiron = require('flatiron');
var ecstatic = require('../../lib/ecstatic');
var path = require('path');

exports.type = 'flatiron';

exports.startServer = function (root, cb) {

  // Just a randomized port
  var port = Math.floor(Math.random() * ((1<<16) - 1e4) + 1e4);

  var app = new flatiron.App;

  app.use(flatiron.plugins.http);

  // ecstatic
  app.use(ecstatic, {
    root: root,
    log: console.error
  });

  // oilpan
  app.use({
    attach: function () {

      console.error(this);

      this.http.before.push(function (req, res) {
        res.setHeader('content-type', 'text/plain');
        res.end('Request fell through ecstatic.');
      });
    }
  });

  app.use({ attach: closer });
  function closer () {
    var self = this;


  }

  app.listen(port, function () {
    cb(port, app);
  });

}
