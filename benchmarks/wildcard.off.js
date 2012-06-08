var drip = require('../lib/drip')
  , drop = new drip({ wildcard: true });

bench('wc: remove listener: drip single', function (next) {
  drop.on('test', function () { 1 == 1; });
  drop.off('test');
  next();
});

bench('wc: remove listener: drip wildcard', function (next) {
  drop.on([ 'foo', 'bar' ], function () { 1 == 1; });
  drop.off('foo:bar');
  next();
});
