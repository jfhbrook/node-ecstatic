var test = require('tap').test,
    ecstatic = require('../lib/ecstatic'),
    spawn = require('child_process').spawn

test('sane port', function (t) {
  t.plan(2)
  process.env.PORT = getRandomInt(1025, 65536)
  var ecstatic = spawn(process.execPath, [__dirname + '/../lib/ecstatic.js'])
  ecstatic.stdout.on('data', function (data) {
    t.pass('ecstatic should be started')
    var curl = spawn('curl', ['http://0.0.0.0:' + process.env.PORT])
    curl.stdout.on('error', function (err) {
      console.error(err)
      t.fail('curl did not get back a response from the server')
    })
    curl.stdout.on('end', function () {
      t.pass('curl should get a response from the server')
      curl.kill('SIGINT')
      ecstatic.kill('SIGINT')
    })
  })
})

test('insane ports', function (t) {
  var insanePorts = [ -Infinity, 1023, 9090.8, 65537, Infinity, 'wow', null, undefined]
  insanePorts.forEach(function (port) {
    process.env.PORT = port
    var ecstatic = spawn(process.execPath, [__dirname + '/../lib/ecstatic.js'])
    ecstatic.stdout.on('data', function (data) {
      t.pass('ecstatic should be started')
      var curl = spawn('curl', ['http://0.0.0.0:8080'])
      curl.stdout.on('error', function (err) {
        console.error(err)
        t.fail('curl did not get back a response from the server')
      })
      curl.stdout.on('end', function () {
        t.pass('curl should get a response from the server on port 8080')
        if (port === insanePorts[insanePorts.length - 1]) t.end()
        curl.kill('SIGINT')
        ecstatic.kill('SIGINT')
      })
    })
  })
})

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
