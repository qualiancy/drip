var drip = require('../lib/drip')
  , EE = require('events').EventEmitter;

bench('construction: drip on/off single', function (next) {
  var drop = new drip();
  drop.on('test', function () { 1 == 1; });
  drop.removeAllListeners('test');
  next();
});

bench('construction: ee on/off single', function (next) {
  var ee = new EE();
  ee.on('test', function () { 1 == 1; });
  ee.removeAllListeners('test');
  next();
});
