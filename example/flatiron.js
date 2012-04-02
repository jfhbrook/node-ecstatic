var flatiron = require('flatiron'),
    app = flatiron.app,
    ecstatic = require('../');

var path = require('path');

app.use(flatiron.plugins.http);

app.http.before.push(ecstatic({
  root: path.join(__dirname, 'public'),
  log: app.log
}));

app.start(8080, function (err) {
  if (err) {
    throw err;
  }

  app.log.info('Listening on :8080');
});
