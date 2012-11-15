describe('enhanced', function () {
  describe('.emit(\'event:nested\')', function () {
    it('should trigger a single listener', function () {
      var emitter = new drip.EnhancedEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event:nested', listener);
      emitter.on('event:noop', noop);
      emitter.on('noop:event', noop);
      emitter.emit('event:nested');
      listener.should.have.been.called.once;
      noop.should.not.have.been.called();
    });

    it('should trigger multiple listeners', function () {
      var emitter = new drip.EnhancedEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event:nested', listener);
      emitter.on('event:nested', listener);
      emitter.on('event:noop', noop);
      emitter.on('noop:event', noop);
      emitter.emit('event:nested');
      listener.should.have.been.called.twice;
      noop.should.not.have.been.called();
    });

    it('should trigger wildcard listeners', function () {
      var emitter = new drip.EnhancedEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event:*', listener);
      emitter.on('*:nested', listener);
      emitter.on('event:noop', noop);
      emitter.on('noop:event', noop);
      emitter.emit('event:nested');
      listener.should.have.been.called.twice;
      noop.should.not.have.been.called();
    });
  });

  describe('.emit([ \'event\', \'nested\' ])', function () {
    it('should trigger a single listener', function () {
      var emitter = new drip.EnhancedEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event:nested', listener);
      emitter.on('event:noop', noop);
      emitter.on('noop:event', noop);
      emitter.emit([ 'event', 'nested' ]);
      listener.should.have.been.called.once;
      noop.should.not.have.been.called();
    });

    it('should trigger multiple listeners', function () {
      var emitter = new drip.EnhancedEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event:nested', listener);
      emitter.on('event:nested', listener);
      emitter.on('event:noop', noop);
      emitter.on('noop:event', noop);
      emitter.emit([ 'event', 'nested' ]);
      listener.should.have.been.called.twice;
      noop.should.not.have.been.called();
    });

    it('should trigger wildcard listeners', function () {
      var emitter = new drip.EnhancedEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event:*', listener);
      emitter.on('*:nested', listener);
      emitter.on('event:noop', noop);
      emitter.on('noop:event', noop);
      emitter.emit([ 'event', 'nested' ]);
      listener.should.have.been.called.twice;
      noop.should.not.have.been.called();
    });
  });

  describe('.emit(\'event\', arg)', function () {
    it('should trigger listeners with one argument', function () {
      var emitter = new drip.EnhancedEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event:nested', listener);
      emitter.on('event:*', listener);
      emitter.on('*:nested', listener);
      emitter.on('event:noop', noop);
      emitter.on('noop:event', noop);
      emitter.emit('event:nested', { hello: 'universe' });
      listener.should.have.been.called(3);
      listener.should.have.always.been.called.with.exactly({ hello: 'universe' });
      noop.should.not.have.been.called();
    });
  });

  describe('.emit(\'event\', arg, arg)', function () {
    it('should trigger listeners with two arguments', function () {
      var emitter = new drip.EnhancedEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event:nested', listener);
      emitter.on('event:*', listener);
      emitter.on('*:nested', listener);
      emitter.on('event:noop', noop);
      emitter.on('noop:event', noop);
      emitter.emit('event:nested', 1, 'two');
      listener.should.have.been.called(3);
      listener.should.have.been.always.called.with.exactly(1, 'two');
      noop.should.not.have.been.called();
    });
  });

  describe('.emit(\'event\', arg, arg, arg, arg, arg)', function () {
    it('should trigger listeners with 3+ arguments', function () {
      var emitter = new drip.EnhancedEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event:nested', listener);
      emitter.on('event:*', listener);
      emitter.on('*:nested', listener);
      emitter.on('event:noop', noop);
      emitter.on('noop:event', noop);
      emitter.emit('event:nested', 1, 2, 'three', 4, 5);
      listener.should.have.been.called(3);
      listener.should.have.always.been.called.with.exactly(1, 2, 'three', 4, 5);
      noop.should.not.have.been.called();
    });
  });
});
