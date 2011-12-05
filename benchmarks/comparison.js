var matcha = require('matcha');

var EE = require('events').EventEmitter
  , ee = new EE();

var EE1 = require('events').EventEmitter
  , ee1 = new EE1();

var EE2 = require('eventemitter2').EventEmitter2
  , ee2 = new EE2()

var drip = require('../lib/drip')
  , ee3 = new drip()

var suite = new matcha.Suite({
  iterations: 10000,
});

suite.bench('events heating up', function (next) {
  ee.on('test1', function () { 1==1; });
  ee.emit('test1');
  ee.removeAllListeners('test1');
  next();
});

suite.bench('nodejs native events', function (next) {
  ee1.on('test1', function () { 1==1; });
  ee1.emit('test1');
  ee1.removeAllListeners('test1');
  next();
});

suite.bench('eventemitter2 standard events', function (next) {
  ee2.on('test2', function () { 1==1; });
  ee2.emit('test2');
  ee2.removeAllListeners('test2');
  next();
});

suite.bench('eventemitter2 wildcard events', function (next) {
  ee2.on('test2.foo', function () { 1==1; });
  ee2.emit('test2.foo');
  ee2.removeAllListeners('test2.foo');
  next();
});

suite.bench('drip standard events', function (next) {
  ee3.on('test3', function () { 1==1; });
  ee3.emit('test3');
  ee3.off('test3');
  next();
});

suite.bench('drip wildcard events', function (next) {
  ee3.on('test3.foo', function () { 1==1; });
  ee3.emit('test3.foo');
  ee3.off('test3.foo');
  next();
});

module.exports = suite;