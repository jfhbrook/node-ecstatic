var test = require('tap').test,
    request = require('request'),
    spawn = require('child_process').spawn,
    sanePort = getRandomInt(1025, 65536),
    insanePorts = [-Infinity, 1023, 65537, Infinity, 'wow', null, undefined]

test('sane port', function (t) {
  t.plan(2)
  var ecstatic = spawn(process.execPath, [__dirname + '/../lib/ecstatic.js'], {
    env: {
      PORT: sanePort
    }
  })
  ecstatic.stdout.on('data', function (data) {
    t.pass('ecstatic should be started')
    checkServerIsRunning('http://0.0.0.0:' + sanePort, ecstatic, t)
  })
})

insanePorts.forEach(function (port) {
  test('insane port: ' + port, function (t) {
    t.plan(2)
    var ecstatic = spawn(process.execPath, [__dirname + '/../lib/ecstatic.js'], {
      env: {
        PORT: port
      }
    })
    ecstatic.stdout.on('data', function (data) {
      t.pass('ecstatic should be started')
      checkServerIsRunning('http://0.0.0.0:8000', ecstatic, t)
    })
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
