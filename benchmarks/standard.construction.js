var drip = require('../lib/drip')
  , EE = require('events').EventEmitter;

suite('construction', function () {

  bench('node eventemitter', function () {
    var ee = new EE();
  });

  bench('drip simple', function () {
    var drop = new drip();
  });

  bench('drip wildcard', function () {
    var drop = new drip({ wildcard: true });
  });

});
