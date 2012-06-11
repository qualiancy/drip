var EE = require('events').EventEmitter
  , ee = new EE();

var drip = require('../lib/drip')
  , drop = new drip();

var noop = function () { 1 == 1 }
  , noop2 = function () { 2 == 2 };

suite('single listener off', function () {

  bench('node event emitter', function () {
    ee.on('test1', noop);
    ee.removeListener('test1', noop);
  });

  bench('drip simple', function () {
    drop.on('test1', noop);
    drop.off('test1', noop);
  });

});

suite('multiple listeners off', function () {

  bench('node event emitter', function () {
    ee.on('test1', noop);
    ee.on('test1', noop2);
    ee.removeListener('test1', noop);
    ee.removeListener('test1', noop2);
  });

  bench('drip simple', function () {
    drop.on('test1', noop);
    drop.on('test1', noop2);
    drop.off('test1', noop);
    drop.off('test1', noop2);
  });

});
