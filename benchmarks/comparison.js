var EE = require('events').EventEmitter
  , ee = new EE();

var EE1 = require('events').EventEmitter
  , ee1 = new EE1();

var EE2 = require('eventemitter2').EventEmitter2
  , ee2 = new EE2();

var ee2wc = new EE2({
  wildcard: true
});

var drip = require('../lib/drip')
  , drop = new drip();

var drop2 = new drip({
  wildcards: true
});

bench('events heating up', function (next) {
  ee.on('test1', function () { 1==1; });
  ee.emit('test1');
  ee.removeAllListeners('test1');
  next();
});

bench('nodejs native events', function (next) {
  ee1.on('test1', function () { 1==1; });
  ee1.emit('test1');
  ee1.removeAllListeners('test1');
  next();
});

bench('eventemitter2 standard events', function (next) {
  ee2.on('test2', function () { 1==1; });
  ee2.emit('test2');
  ee2.removeAllListeners('test2');
  next();
});

bench('eventemitter2 wildcard events', function (next) {
  ee2wc.on('test2.foo', function () { 1==1; });
  ee2wc.emit('test2.foo');
  ee2wc.removeAllListeners('test2.foo');
  next();
});

bench('drip standard events', function (next) {
  drop.on('test3', function () { 1==1; });
  drop.emit('test3');
  drop.removeAllListeners('test3');
  next();
});

bench('drip wildcard events', function (next) {
  drop2.on('test3:foo', function () { 1==1; });
  drop2.emit('test3:foo');
  drop2.off('test3:foo');
  next();
});