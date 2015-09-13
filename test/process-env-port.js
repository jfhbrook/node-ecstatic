var test = require('tap').test,
    request = require('request'),
    spawn = require('child_process').spawn,
    sanePort = getRandomInt(1025, 65536),
    floatingPointPort = 9090.86,
    insanePorts = [-Infinity, 1023, 65537, Infinity, 'wow', null, undefined]

test('sane port', function (t) {
  startServer('http://0.0.0.0:' + sanePort, sanePort, t)
})

test('floating point port', function (t) {
  startServer('http://0.0.0.0:9090', floatingPointPort, t)
})

insanePorts.forEach(function (port) {
  test('insane port: ' + port, function (t) {
    startServer('http://0.0.0.0:8000', port, t)
  })
})

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function checkServerIsRunning (url, ps, t) {
  request(url, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      t.pass('a successful request from the server was made')
      ps.kill('SIGINT')
    } else {
      t.fail('the server could not be reached')
    }
  })
}

function startServer (url, port, t) {
  t.plan(2)
  var ecstatic = spawn(process.execPath, [__dirname + '/../lib/ecstatic.js'], {
    env: {
      PORT: port
    }
  })
  ecstatic.stdout.on('data', function (data) {
    t.pass('ecstatic should be started')
    checkServerIsRunning(url, ecstatic, t)
  })
}
