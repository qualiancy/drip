var drip = require('../lib/drip')
  , drop = new drip();

var EE = require('events').EventEmitter
  , ee = new EE();

var EE2 = require('eventemitter2').EventEmitter2
  , ee2 = new EE2();

bench('drip on/off single', function (next) {
  drop = new drip();
  drop.on('test', function () { 1 == 1; });
  drop.removeAllListeners('test');
  next();
});

bench('ee on/off single', function (next) {
  ee = new EE();
  ee.on('test', function () { 1 == 1; });
  ee.removeAllListeners('test');
  next();
});

bench('ee2 on/off single', function (next) {
  ee2 = new EE2();
  ee2.on('test', function () { 1 == 1; });
  ee2.removeAllListeners('test');
  next();
});