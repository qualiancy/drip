var should = require('should');

var drip = require('..')
  , wc = { wildcard: true };

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

describe('Drip wildcard', function () {

  it('should have a version', function () {
    should.exist(drip.version);
  });

  describe('construction', function () {

    if('should accept the wildcard option', function () {
      var drop = new drip(wc);

      should.exist(drop._drip);
      drop._drip.wildcards.should.be.ok;
      drop._drip.delimeter.should.equal(':');
    });

    it('should accept the delimeter option', function () {
      var drop = new drip({
        delimeter: '.'
      });

      should.exist(drop._drip);
      drop._drip.wildcard.should.be.ok;
      drop._drip.delimeter.should.equal('.');
    });

    it('should not have an event queue before adding listeners', function () {
      var drop = new drip(wc);
      should.not.exist(drop._events);
    });
  });

  describe('#on', function () {

    describe('simple', function () {
      var drop = new drip(wc)
        , noop = function () { 1 == 1 }
        , noop2 = function () { 2 == 2 };

      beforeEach(function () {
        drop.removeAllListeners();
      });

      it('should have _events after an event is added', function() {
        should.not.exist(drop._events);
        drop.on('test', noop);
        should.exist(drop._events);
      });

      it('should have a single function as callback for first event', function () {
        drop.on('test', noop);
        drop._events['test']._.should.be.a('function');
        drop._events['test']._.should.eql(noop);
      });

      it('should change callback stack to array on second function', function () {
        drop.on('test', noop);
        drop.on('test', noop2);
        drop._events['test']._.should.be.instanceof(Array);
        drop._events['test']._.length.should.equal(2);
      });
    });

    describe('wildcarded', function () {
      var drop = new drip(wc)
        , noop = function () { 1 == 1 }
        , noop2 = function () { 2 == 2 };

      beforeEach(function () {
        drop.removeAllListeners();
      });

      it('should have _events after an array event is added', function() {
        should.not.exist(drop._events);
        drop.on([ 'test', '*' ], noop);
        should.exist(drop._events);
      });

      it('should have _events after a string event is added', function() {
        should.not.exist(drop._events);
        drop.on('test:*', noop);
        should.exist(drop._events);
      });

      it('should have a single function as callback for first event', function () {
        drop.on('test:*', noop);
        drop._events['test']['*']._.should.be.a('function');
        drop._events['test']['*']._.should.eql(noop);
      });

      it('should change callback stack to array on second function', function () {
        drop.on('test:*', noop);
        drop.on([ 'test', '*' ], noop2);
        drop._events['test']['*']._.should.be.instanceof(Array);
        drop._events['test']['*']._.length.should.equal(2);
      });
    });

  });

  describe('#off (without functions)', function () {
    var drop = new drip(wc)
      , noop = function () { 1 == 1 }
      , noop2 = function () { 2 == 2 };

    beforeEach(function() {
      drop.off();
      drop.on('test:*', noop);
      drop.on('test:*', noop2);
      drop.on('test:hello', noop);
      drop.on('*:test', noop2);
    });

    it('should remove all listeners for a given event', function () {
      drop._events['test']['*']._.length.should.equal(2);
      drop.off('test:*');
      should.not.exist(drop._events['test']._);
    });

    it('should empty _events if no event given', function () {
      drop._events['test']['hello']._.should.be.a('function');
      drop._events['*']['test']._.should.be.a('function');
      drop.off();
      should.not.exist(drop._events);
    });

    it('should ignore removing events that dont exist', function () {
      drop.off('hello world');
      drop.off('hello:world');
      drop._events['test']['*']._.length.should.equal(2);
    });
  });

  describe('#off (with functions)', function () {
    var drop = new drip(wc);

    beforeEach(function () {
      drop.off();
    });

    it('should remove an event if the fn passed is the only callback', function () {
      var noop = function () {};

      drop.on('foo:bar', noop);
      drop._events['foo']['bar']._.should.be.a('function');

      drop.off('foo:bar', noop);
      should.not.exist(drop._events);
    });

    it('should remove a fn from stack if stack is an array', function () {
      var noop = function () {}
        , noop2 = function () {};

      drop.on('foo:bar', noop);
      drop.on('foo:bar', noop2);

      drop._events['foo']['bar']._.should.be.instanceof(Array);
      drop._events['foo']['bar']._.length.should.equal(2);

      drop.off('foo:bar', noop);

      drop._events['foo']['bar']._.should.be.a('function');
      drop._events['foo']['bar']._.should.not.equal(noop);
      drop._events['foo']['bar']._.should.equal(noop2);
    });
  });

  describe('#emit', function () {

    describe('simple', function () {
      var drop = new drip(wc);

      beforeEach(function () {
        drop.off();
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

    describe('wildcarded', function () {
      var drop = new drip(wc);

      beforeEach(function () {
        drop.off();
      });

      it('should emit a single event without arguments', function () {
        var spy = Spy();

        drop.on('foo:bar', spy);
        drop.on('*:bar', spy);
        drop.on('foo:*', spy);

        drop.emit('foo:bar');

        spy.called.should.be.ok;
        spy.calls.length.should.equal(3);
      });

      it('should emit events and pass single argument to callbacks', function () {
        var spy = Spy(function () {
          arguments.length.should.equal(1);
        });

        drop.on('foo:bar', spy);
        drop.on('*:bar', spy);
        drop.on('foo:*', spy);

        drop.emit('foo:bar', 'one');

        spy.called.should.be.ok;
        spy.calls.length.should.equal(3);
      });

      it('should emit events and pass 2 arguments to callbacks', function () {
        var spy = Spy(function () {
          arguments.length.should.equal(2);
        });

        drop.on('foo:bar', spy);
        drop.on('*:bar', spy);
        drop.on('foo:*', spy);

        drop.emit('foo:bar', 'one', 'two');

        spy.called.should.be.ok;
        spy.calls.length.should.equal(3);
      });

      it('should emit events and pass 3+ arguments to callbacks', function () {
        var spy = Spy(function () {
          arguments.length.should.equal(5);
        });

        drop.on('foo:bar', spy);
        drop.on('*:bar', spy);
        drop.on('foo:*', spy);

        drop.emit('foo:bar', 'one', 'two', 'three', 'four', 'five');

        spy.called.should.be.ok;
        spy.calls.length.should.equal(3);
      });
    });

  });

});