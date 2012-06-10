
var EE = require('events').EventEmitter
  , ee = new EE();

var drip = require('../lib/drip')
  , drop = new drip();

suite('simple emit', function () {

  ee.on('test', function () { 1==1; });
  bench('nodejs native events', function () {
    ee.emit('test');
  });

  drop.on('test', function () { 1==1; });
  bench('drip standard events', function () {
    drop.emit('test');
  });

});
