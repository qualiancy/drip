if (!chai) {
  var chai = require('chai')
    , chaiSpies = require('chai-spies');
  chai.use(chaiSpies);
}

var expect = chai.expect;

if (!drip) {
  var drip = require('..');
}

describe('Drip simple', function () {

  it('should have a version', function () {
    expect(drip.version).to.exist;
  });

  describe('construction', function () {

    it('should not have wildcards active by default', function () {
      var drop = new drip();
      expect(drop._drip).to.not.exist;
    });

    it('should not have an event queue before adding listeners', function () {
      var drop = new drip();
      expect(drop._events).to.not.exist;
    });
  });

  describe('#on', function () {
    var drop = new drip()
      , noop = function () { 1 == 1 }
      , noop2 = function () { 2 == 2 };

    it('should have _events after an event is added', function() {
      expect(drop._events).to.not.exist;
      drop.on('test', noop);
      expect(drop._events).to.exist;
      expect(drop._events['test']).to.be.a('function');
    });

    it('should change callback stack to array on second function', function () {
      drop.on('test', noop2);
      expect(drop._events['test']).to.be.instanceof(Array);
      expect(drop._events['test']).to.have.length(2);
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
      expect(drop._events['test']).to.have.length(2);
      drop.off('test');
      expect(drop._events['test']).to.not.exist;
    });

    it('should empty _events if no event given', function () {
      expect(drop._events['test2']).to.be.an('function');
      expect(drop._events['test3']).to.be.an('function');
      drop.off();
      expect(Object.keys(drop._events)).to.have.length(0);
    });

    it('should ignore removing events that dont exist', function () {
      drop.off('hello world');
      expect(drop._events['test']).to.have.length(2);
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
      expect(drop._events['test']).to.be.an('function');

      drop.off('test', noop);
      expect(drop._events['test']).to.not.exist;
    });

    it('should remove a fn from stack if stack is an array', function () {
      var noop = function () {}
        , noop2 = function () {};

      drop.on('test', noop);
      drop.on('test', noop2);

      expect(drop._events['test']).to.be.instanceof(Array);
      expect(drop._events['test']).to.have.length(2);

      drop.off('test', noop);

      expect(drop._events['test']).to.be.a('function');
      expect(drop._events['test']).to.not.equal(noop);
      expect(drop._events['test']).to.equal(noop2);
    });
  });

  describe('#emit', function () {
    var drop = new drip();

    beforeEach(function () {
      drop.removeAllListeners();
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

    it('can emit events that do not have listeners', function () {
      expect(function () {
        drop.on('test', function () {});
        drop.emit('universe', 1);
      }).to.not.throw();
    });
  });

  describe('#hasListenerListener', function () {
    var drop = new drip();

    beforeEach(function () {
      drop.off();
    });

    it('can determine if there are callbacks for an event', function () {
      drop.on('hello', function () {});

      expect(drop.hasListener('hello')).to.be.true;
      expect(drop.hasListener('universe')).to.be.false;
    });

    it('can determine if a specific function is a callback for an event', function () {
      var fn = function () { return 1 === 1 }
        , fn2 = function () { return 2 === 2 };

      drop.on('hello', fn);

      expect(drop.hasListener('hello', fn)).to.be.true;
      expect(drop.hasListener('universe', fn)).to.be.false;
      expect(drop.hasListener('hello', fn2)).to.be.false;
    });

  });

  describe('event bind', function () {
    var drop = new drip()
      , proxy = new drip();

    beforeEach(function ()  {
      drop.off();
      proxy.off();
    });

    it('can bind to an event to another event emitter', function () {
      var spy = chai.spy(function (proxied) {
        expect(proxied).to.be.true;
      });

      drop.on('proxyme', spy);

      proxy.bindEvent('proxyme', drop);
      proxy.emit('proxyme', true);

      expect(spy).to.have.been.called.once;
    });

    it('can remove a bind to another event emitter', function () {
      var spy = chai.spy(function (proxied) {
        expect(proxied).to.be.true;
      });

      drop.on('proxyme', spy);

      proxy.bindEvent('proxyme', drop);
      proxy.emit('proxyme', true);

      expect(spy).to.have.been.called.once;

      proxy.unbindEvent('proxyme', drop);
      proxy.emit('proxyme', true);

      expect(spy).to.have.been.called.once;
    });

  });

  describe('event proxy', function () {

    var drop = new drip()
      , orig = new drip();

    beforeEach(function () {
      drop.off();
      orig.off();
    });

    it('can proxy to the events of another event emitter', function () {
      var spy = chai.spy();

      drop.on('orig', spy);

      drop.proxyEvent('orig', orig);
      orig.emit('orig');

      expect(spy).to.have.been.called.once;
    });

    it('can unprox from the events of another event emitter', function () {
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

  });
});
