var vows = require('vows'),
    assert = require('assert'),
    utile = require('utile'),
    util = require('util');

var root = __dirname + '/public';

var fs = require('fs');
var basic = require('./basic');

var tests = basic(root, require('./union'));

vows.describe('Ecstatic tests').addBatch(
  basic(root, require('./express'))
).addBatch(
  basic(root, require('./union'))
).export(module);
