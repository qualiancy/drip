
var EE = require('events').EventEmitter
  , ee = new EE();

var drip = require('../lib/drip')
  , drop = new drip();

var test = 2;

ee.on('test', function () { 1==1; });
bench('nodejs native events', function () {
  ee.emit('test');
});

drop.on('test', function () { 1==1; });
bench('drip standard events', function () {
  drop.emit('test');
});
