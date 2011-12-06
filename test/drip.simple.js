var should = require('should');

var drip = require('..');

function Spy (fn) {
  if (!fn) fn = function() {};

  function proxy() {
    var args = Array.prototype.slice.call(arguments);
    proxy.calls.push(args);
    proxy.called = true;
    fn.apply(this, args);
  }

  proxy.prototype = fn.prototype;
  proxy.calls = [];
  proxy.called = false;

  return proxy;
}

describe('Drip simple', function () {

  it('should have a version', function () {
    should.exist(drip.version);
  });

  describe('construction', function () {

    it('should not have wildcards active by default', function () {
      var drop = new drip();
      should.not.exist(drop._drip);
    });

    it('should not have an event queue before adding listeners', function () {
      var drop = new drip();
      should.not.exist(drop._events);
    });
  });

  describe('#on', function () {
    var drop = new drip()
      , noop = function () { 1 == 1 }
      , noop2 = function () { 2 == 2 };

    it('should have _events after an event is added', function() {
      should.not.exist(drop._events);
      drop.on('test', noop);
      should.exist(drop._events);
    });

    it('should have a single function as callback for first event', function () {
      drop._events['test'].should.be.a('function');
      drop._events['test'].should.eql(noop);
    });

    it('should change callback stack to array on second function', function () {
      drop.on('test', noop2);
      drop._events['test'].should.be.instanceof(Array);
      drop._events['test'].length.should.equal(2);
    });
  });

  describe('#off (without functions)', function () {
    var drop = new drip()
      , noop = function () { 1 == 1 }
      , noop2 = function () { 2 == 2 };

    beforeEach(function() {
      drop.off();
      drop.on('test', noop);
      drop.on('test', noop2);
      drop.on('test2', noop);
      drop.on('test3', noop2);
    });

    it('should remove all listeners for a given event', function () {
      drop._events['test'].length.should.equal(2);
      drop.off('test');
      should.not.exist(drop._events['test']);
    });

    it('should empty _events if no event given', function () {
      drop._events['test2'].should.be.a('function');
      drop._events['test3'].should.be.a('function');
      drop.off();
      should.not.exist(drop._events);
    });

    it('should ignore removing events that dont exist', function () {
      drop.off('hello world');
      drop._events['test'].length.should.equal(2);
    });
  });

  describe('#off (with functions)', function () {
    var drop = new drip();

    beforeEach(function () {
      drop.removeAllListeners();
    });

    it('should remove an event if the fn passed is the only callback', function () {
      var noop = function () {};

      drop.on('test', noop);
      drop._events['test'].should.be.a('function');

      drop.off('test', noop);
      should.not.exist(drop._events['test']);
    });

    it('should remove a fn from stack if stack is an array', function () {
      var noop = function () {}
        , noop2 = function () {};

      drop.on('test', noop);
      drop.on('test', noop2);

      drop._events['test'].should.be.instanceof(Array);
      drop._events['test'].length.should.equal(2);

      drop.off('test', noop);

      drop._events['test'].should.be.a('function');
      drop._events['test'].should.not.equal(noop);
      drop._events['test'].should.equal(noop2);
    });
  });

  describe('#emit', function () {
    var drop = new drip();

    beforeEach(function () {
      drop.removeAllListeners();
    });

    it('should emit a single event without arguments', function () {
      var spy = Spy();

      drop.on('test', spy);
      drop.emit('test');

      spy.called.should.be.ok;
      spy.calls.length.should.equal(1);
    });

    it('should emit events and pass single argument to callbacks', function () {
      var spy = Spy(function () {
        arguments.length.should.equal(1);
      });

      drop.on('test', spy);
      drop.emit('test', 'one');

      spy.called.should.be.ok;
      spy.calls.length.should.equal(1);
    });

    it('should emit events and pass 2 arguments to callbacks', function () {
      var spy = Spy(function () {
        arguments.length.should.equal(2);
      });

      drop.on('test', spy);
      drop.emit('test', 'one', 'two');

      spy.called.should.be.ok;
      spy.calls.length.should.equal(1);
    });

    it('should emit events and pass 3+ arguments to callbacks', function () {
      var spy = Spy(function () {
        arguments.length.should.equal(5);
      });

      drop.on('test', spy);
      drop.emit('test', 'one', 'two', 'three', 'four', 'five');

      spy.called.should.be.ok;
      spy.calls.length.should.equal(1);
    });
  });
});