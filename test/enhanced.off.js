describe('enhanced', function () {
  var noop = function () { 1 == 1 }
    , noop2 = function () { 2 == 2 };

  describe('.off()', function () {
    it('should remove all listeners', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('one', noop);
      emitter.on('two:three', noop);
      emitter.hasListener('one').should.be.true;
      emitter.hasListener('two:three').should.be.true;
      emitter.off();
      emitter.hasListener('one').should.be.false;
      emitter.hasListener('two:three').should.be.false;
    });
  });

  describe('.off(\'event:nested\')', function () {
    it('should remove all listeners for event', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:nested', noop);
      emitter.on('event:*', noop);
      emitter.on('two:three', noop);
      emitter.hasListener('event:nested').should.be.true;
      emitter.hasListener('event:*').should.be.true;
      emitter.hasListener('two:three').should.be.true;
      emitter.off('event:*');
      emitter.hasListener('event:nested').should.be.true;
      emitter.hasListener('event:*').should.be.false;
      emitter.hasListener('two:three').should.be.true;
      emitter.off('event:nested');
      emitter.hasListener('event:nested').should.be.false;
      emitter.hasListener('event:*').should.be.false;
      emitter.hasListener('two:three').should.be.true;
    });
  });

  describe('.off(\'event:nested\', fn)', function () {
    it('should remove all listeners matching fn for event', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:nested', noop);
      emitter.on('event:*', noop2);
      emitter.on('one:two', noop);
      emitter.hasListener('event:nested', noop).should.be.true;
      emitter.hasListener('event:*', noop2).should.be.true;
      emitter.hasListener('one:two', noop).should.be.true;
      emitter.off('event:*', noop);
      emitter.hasListener('event:nested', noop).should.be.true;
      emitter.hasListener('event:*', noop2).should.be.true;
      emitter.hasListener('one:two', noop).should.be.true;
      emitter.off('event:*', noop2);
      emitter.hasListener('event:nested', noop).should.be.true;
      emitter.hasListener('event:*', noop2).should.be.false;
      emitter.hasListener('one:two', noop).should.be.true;
      emitter.off('event:nested', noop);
      emitter.hasListener('event:nested', noop).should.be.false;
      emitter.hasListener('event:*', noop2).should.be.false;
      emitter.hasListener('one:two', noop).should.be.true;
    });
  });

  describe('.removeListener()', function () {
    it('should be an alias of .off()', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.should.respondTo('removeListener');
      emitter.removeListener.should.equal(emitter.off);
    });
  });

  describe('.removeAllListener()', function () {
    it('should be an alias of .off()', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.should.respondTo('removeListener');
      emitter.removeListener.should.equal(emitter.off);
    });
  });
});
