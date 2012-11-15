
var EE = require('events').EventEmitter
  , ee = new EE();

var drip = require('../lib/drip')

suite('wildcard emit', function () {

  var drop = new drip({ wildcard: true });
  drop.on('foo', function () { 1==1; });
  bench('drip emit: single events', function () {
    drop.emit('foo');
  });

  var drop2 = new drip({ wildcard: true });
  drop2.on('foo:bar', function () { 1==1; });
  bench('drip emit: namespace events', function () {
    drop.emit('foo:bar');
  });

  var drop3 = new drip({ wildcard: true });
  drop3.on('foo:*', function () { 1==1; });
  bench('drip emit: wildcarded events', function () {
    drop3.emit('foo:bar');
  });

  var drop4 = new drip({ wildcard: true });
  drop4.on('foo:*:bar', function () { 1==1; });
  bench('drip emit: nested wildcarded events', function () {
    drop4.emit('foo:drip:bar');
  });

});
