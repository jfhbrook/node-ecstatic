var test = require('tap').test,
express = require('express'),
app = express(),
http = require('http'),
hyperstream = require('hyperstream'),
request = require('request'),
path = require('path'),
queue = require('queuelib')
test('passthrough', function(t) {
    var val = 0;
    gen_hs = function() {
        return hyperstream({
            '#count' : {
                _html : val 
            }
        })
    }
    var ecstatic = require('../lib/ecstatic')(path.join(__dirname, '/public'), { 
        passthrough : {
           'passthrough.html' : gen_hs  
        }})

    var server = http.createServer(function(req,res) {
        val++
        ecstatic(req,res)
    })
    var q = new queue
    server.listen(5150, function() {
        console.log("server listening on 5150")
        q.forEach([1,2,3,4], function(val,idx,lib) {
            request('http://localhost:5150/passthrough.html',
            function(err, resp, body) {
            t.ok(body.indexOf("id='count'>"+val+"<") != -1)
            lib.done()
            })
        },
        function() {
            server.close();
            t.end()
        })
    })
})
