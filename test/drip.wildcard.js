if (!chai) {
  var chai = require('chai')
    , chaiSpies = require('chai-spies');
  chai.use(chaiSpies);
}

var expect = chai.expect;

if (!drip) {
  var drip = require('..');
}

var wc = { wildcard: true };

describe('Drip wildcard', function () {

  it('should have a version', function () {
    expect(drip.version).to.exist;
  });

  describe('construction', function () {

    if('should accept the wildcard option', function () {
      var drop = new drip(wc);

      expect(drop._drip).to.exist;
      expect(drop._drip.wildcards).to.be.true;
      expect(drop._drip.delimeter).to.equal(':');
    });

    it('should accept the delimeter option', function () {
      var drop = new drip({
        delimeter: '.'
      });

      expect(drop._drip).to.exist;
      expect(drop._drip.wildcard).to.be.true;
      expect(drop._drip.delimeter).to.equal('.');
    });

    it('should not have an event queue before adding listeners', function () {
      var drop = new drip(wc);
      expect(drop._events).to.not.exist;
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
        expect(Object.keys(drop._events)).to.have.length(0);
        drop.on('test', noop);
        expect(drop._events).to.exist.and.to.be.a('object');
      });

      it('should have a single function as callback for first event', function () {
        drop.on('test', noop);
        expect(drop._events['test']._).to.be.an('array');
        expect(drop._events['test']._[0]).to.equal(noop);
      });

      it('should change callback stack to array on second function', function () {
        drop.on('test', noop);
        drop.on('test', noop2);
        expect(drop._events['test']._).to.be.an('array');
        expect(drop._events['test']._).to.have.length(2);
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
        expect(Object.keys(drop._events)).to.have.length(0);
        drop.on([ 'test', '*' ], noop);
        expect(drop._events).to.exist.and.be.a('object');
      });

      it('should have _events after a string event is added', function() {
        expect(Object.keys(drop._events)).to.have.length(0);
        drop.on('test:*', noop);
        expect(drop._events).to.exist.and.be.a('object');
      });

      it('should have a single function as callback for first event', function () {
        drop.on('test:*', noop);
        expect(drop._events['test']['*']._).to.be.an('array');
        expect(drop._events['test']['*']._[0]).to.equal(noop);
      });

      it('should change callback stack to array on second function', function () {
        drop.on('test:*', noop);
        drop.on([ 'test', '*' ], noop2);
        expect(drop._events['test']['*']._).to.be.an('array');
        expect(drop._events['test']['*']._).to.have.length(2);
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
      expect(drop._events['test']['*']._).to.have.length(2);
      drop.off('test:*');
      expect(drop._events['test']._).to.not.exist;
    });

    it('should empty _events if no event given', function () {
      expect(drop._events['test']['hello']._).to.be.an('array');
      expect(drop._events['*']['test']._).to.be.an('array');
      drop.off();
      expect(Object.keys(drop._events)).to.have.length(0);
    });

    it('should ignore removing events that dont exist', function () {
      drop.off('hello world');
      drop.off('hello:world');
      expect(drop._events['test']['*']._).to.have.length(2);
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
      expect(drop._events['foo']['bar']._).to.be.an('array');

      drop.off('foo:bar', noop);
      expect(drop._events).to.not.exist;
    });

    it('should remove a fn from stack if stack is an array', function () {
      var noop = function () {}
        , noop2 = function () {};

      drop.on('foo:bar', noop);
      drop.on('foo:bar', noop2);

      expect(drop._events['foo']['bar']._).to.be.instanceof(Array);
      expect(drop._events['foo']['bar']._).to.have.length(2);

      drop.off('foo:bar', noop);

      expect(drop._events['foo']['bar']._).to.be.a('function');
      expect(drop._events['foo']['bar']._).to.not.equal(noop);
      expect(drop._events['foo']['bar']._).to.equal(noop2);
    });
  });

  describe('#emit', function () {

    describe('simple', function () {
      var drop = new drip(wc);

      beforeEach(function () {
        drop.off();
      });

      it('should emit a single event without arguments', function () {
        var spy = chai.spy();

        drop.on('test', spy);
        drop.emit('test');

        expect(spy).to.have.been.called.once;
      });

      it('should emit events and pass single argument to callbacks', function () {
        var spy = chai.spy(function () {
          expect(arguments).to.have.length(1);
        });

        drop.on('test', spy);
        drop.emit('test', 'one');

        expect(spy).to.have.been.called.once;
      });

      it('should emit events and pass 2 arguments to callbacks', function () {
        var spy = chai.spy(function () {
          expect(arguments).to.have.length(2);
        });

        drop.on('test', spy);
        drop.emit('test', 'one', 'two');

        expect(spy).to.have.been.called.once;
      });

      it('should emit events and pass 3+ arguments to callbacks', function () {
        var spy = chai.spy(function () {
          expect(arguments).to.have.length(5);
        });

        drop.on('test', spy);
        drop.emit('test', 'one', 'two', 'three', 'four', 'five');
        expect(spy).to.have.been.called.once;
      });

      it('should allow for `only` to function correctly', function () {
        var spy = chai.spy();

        drop.once('test', spy);
        drop.emit('test');
        drop.emit('test');

        expect(spy).to.have.been.called.once;
      });

      it('should allow for `many` to function correctly', function () {
        var spy = chai.spy();

        drop.many('test', 2, spy);
        drop.emit('test');
        drop.emit('test');
        drop.emit('test');

        expect(spy).to.have.been.called.twice;
      });

    });

    describe('wildcarded', function () {
      var drop = new drip(wc);

      beforeEach(function () {
        drop.off();
      });

      it('should emit a single event without arguments', function () {
        var spy = chai.spy();

        drop.on('foo:bar', spy);
        drop.on('*:bar', spy);
        drop.on('foo:*', spy);

        drop.emit('foo:bar');

        expect(spy).to.have.been.called.exactly(3);
      });

      it('should emit events and pass single argument to callbacks', function () {
        var spy = chai.spy(function () {
          expect(arguments).to.have.length(1);
        });

        drop.on('foo:bar', spy);
        drop.on('*:bar', spy);
        drop.on('foo:*', spy);

        drop.emit('foo:bar', 'one');

        expect(spy).to.have.been.called.exactly(3);
      });

      it('should emit events and pass 2 arguments to callbacks', function () {
        var spy = chai.spy(function () {
          expect(arguments).to.have.length(2);
        });

        drop.on('foo:bar', spy);
        drop.on('*:bar', spy);
        drop.on('foo:*', spy);

        drop.emit('foo:bar', 'one', 'two');

        expect(spy).to.have.been.called.exactly(3);
      });

      it('should emit events and pass 3+ arguments to callbacks', function () {
        var spy = chai.spy(function () {
          expect(arguments).to.have.length(5);
        });

        drop.on('foo:bar', spy);
        drop.on('*:bar', spy);
        drop.on('foo:*', spy);

        drop.emit('foo:bar', 'one', 'two', 'three', 'four', 'five');

        expect(spy).to.have.been.called.exactly(3);
      });
    });

  });

  describe('#hasListenerListener', function () {
    var drop = new drip(wc);

    beforeEach(function () {
      drop.off();
    });

    it('can determine if there are callbacks for an event', function () {
      drop.on('universe', function () {});
      drop.on('hello:universe', function () {});
      drop.on('world:*', function () {});

      expect(drop.hasListener('universe')).to.be.true;
      expect(drop.hasListener('hello:universe')).to.be.true;
      expect(drop.hasListener('world:universe')).to.be.true;
      expect(drop.hasListener('universe:hello')).to.be.false;
      expect(drop.hasListener('*:hello')).to.be.false;
      expect(drop.hasListener('universe:*')).to.be.false;
    });

    xit('can determine if a specific function is a callback for an event', function () {
      var fn = function () { return 1 === 1 }
        , fn2 = function () { return 2 === 2 };

      drop.on('hello:universe', fn);

      expect(drop.hasListener('hello:universe', fn)).to.be.true;
      expect(drop.hasListener('hello:universe', fn2)).to.be.false;
    });
  });

  describe('event bind', function () {
    var drop = new drip(wc)
      , proxy = new drip(wc);

    beforeEach(function ()  {
      drop.off();
      proxy.off();
    });

    it('can bind an event to another event emitter', function () {
      var spy = chai.spy(function (proxied) {
        expect(proxied).to.be.true;
      });

      drop.on('proxy:me', spy);

      proxy.bindEvent('proxy:me', drop);
      proxy.emit('proxy:me', true);

      expect(spy).to.have.been.called.once;
    });

    it('can remove a bind to another event emitter', function () {
      var spy = chai.spy(function (proxied) {
        expect(proxied).to.be.true;
      });

      drop.on('proxy:me', spy);

      proxy.bindEvent('proxy:me', drop);
      proxy.emit('proxy:me', true);

      expect(spy).to.have.been.called.once;

      proxy.unbindEvent('proxy:me', drop);
      proxy.emit('proxy:me', true);

      expect(spy).to.have.been.called.once;
    });

  });

  describe('event proxy', function () {

    var drop = new drip(wc)
      , orig = new drip();

    beforeEach(function () {
      drop.off();
      orig.off();
    });

    it('can proxy the events of another event emitter', function () {
      var spy = chai.spy();

      drop.on('orig', spy);

      drop.proxyEvent('orig', orig);
      orig.emit('orig');

      expect(spy).to.have.been.called.once;
    });

    it('can unproxy from the events of another event emitter', function () {
      var spy = chai.spy();

      drop.on('orig', spy);

      drop.proxyEvent('orig', orig);
      orig.emit('orig');

      expect(spy).to.have.been.called.once;

      drop.unproxyEvent('orig', orig);
      orig.emit('orig');

      expect(spy).to.have.been.called.once;

      drop.proxyEvent('orig', orig);
      orig.emit('orig');

      expect(spy).to.have.been.called.twice;
    });

    it('can proxy with ns to event of another event emitter', function () {
      var spy = chai.spy();

      drop.on('server:orig', spy);

      drop.proxyEvent('orig', 'server', orig);
      orig.emit('orig');

      expect(spy).to.have.been.called.once;
    });

    it('can unproxy with ns to event of another event emitter', function () {
      var spy = chai.spy();

      drop.on('server:orig', spy);

      drop.proxyEvent('orig', 'server', orig);
      orig.emit('orig');

      expect(spy).to.have.been.called.once;

      drop.unproxyEvent('orig', 'server', orig);
      orig.emit('orig');

      expect(spy).to.have.been.called.once;

      drop.proxyEvent('orig', 'server', orig);
      orig.emit('orig');

      expect(spy).to.have.been.called.twice;
    });

  });
});
