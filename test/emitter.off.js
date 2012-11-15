describe('emitter', function () {
  var noop = function () { 1 == 1 }
    , noop2 = function () { 2 == 2 };

  describe('.off()', function () {
    it('should remove all listeners', function () {
      var emitter = new drip.EventEmitter();
      emitter.on('one', noop);
      emitter.on('two', noop);
      emitter.hasListener('one').should.be.true;
      emitter.hasListener('two').should.be.true;
      emitter.off();
      emitter.hasListener('one').should.be.false;
      emitter.hasListener('two').should.be.false;
    });
  });

  describe('.off(\'event\')', function () {
    it('should remove listener for event', function () {
      var emitter = new drip.EventEmitter();
      emitter.on('event', noop);
      emitter.on('two', noop);
      emitter.hasListener('event').should.be.true;
      emitter.hasListener('two').should.be.true;
      emitter.off('event');
      emitter.hasListener('event').should.be.false;
      emitter.hasListener('two').should.be.true;
    });
  });

  describe('.off(\'event\', fn)', function () {
    it('should remove listener matching fn for event', function () {
      var emitter = new drip.EventEmitter();
      emitter.on('event', noop);
      emitter.on('event', noop2);
      emitter.on('two', noop);
      emitter.hasListener('event', noop).should.be.true;
      emitter.hasListener('event', noop2).should.be.true;
      emitter.hasListener('two').should.be.true;
      emitter.off('event', noop);
      emitter.hasListener('event', noop).should.be.false;
      emitter.hasListener('event', noop2).should.be.true;
      emitter.hasListener('two').should.be.true;
    });
  });

  describe('.removeListener()', function () {
    it('should be an alias of .off()', function () {
      var emitter = new drip.EventEmitter();
      emitter.should.respondTo('removeListener');
      emitter.removeListener.should.equal(emitter.off);
    });
  });

  describe('.removeAllListener()', function () {
    it('should be an alias of .off()', function () {
      var emitter = new drip.EventEmitter();
      emitter.should.respondTo('removeListener');
      emitter.removeListener.should.equal(emitter.off);
    });
  });
});
