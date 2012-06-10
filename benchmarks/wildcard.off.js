var drip = require('../lib/drip')
  , drop = new drip({ wildcard: true });

var noop = function () { 1 == 1 }
  , noop2 = function () { 2 == 2 };

suite('wildcard single listeners off', function () {

  bench('drip one level', function () {
    drop.on('test', noop);
    drop.off('test', noop);
  });

  bench('drip two levels', function () {
    drop.on('foo:bar', noop);
    drop.off('foo:bar', noop);
  });

  bench('drip three levels', function () {
    drop.on('foo:bar:baz', noop);
    drop.off('foo:bar:baz', noop);
  });

});
