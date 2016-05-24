describe('emitter', function () {
  describe('.emit(\'event\')', function () {
    it('should trigger a single listener', function () {
      var emitter = new drip.EventEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event', listener);
      emitter.on('noop', noop);
      emitter.emit('event');
      listener.should.have.been.called.once;
      noop.should.not.have.been.called();
    });

    it('should trigger a multiple listener', function () {
      var emitter = new drip.EventEmitter()
        , listener = chai.spy()
        , listener2 = chai.spy()
        , noop = chai.spy();
      emitter.on('event', listener);
      emitter.on('event', listener2);
      emitter.on('noop', noop);
      emitter.emit('event');
      listener.should.have.been.called.once;
      listener2.should.have.been.called.once;
      noop.should.not.have.been.called();
    });
  });

  describe('.emit(\'event\', arg)', function () {
    it('should trigger listeners with one argument', function () {
      var emitter = new drip.EventEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event', listener);
      emitter.on('noop', noop);
      emitter.emit('event', { hello: 'universe' });
      listener.should.have.been.called.once;
      listener.should.have.always.been.called.with.exactly({ hello: 'universe' });
      noop.should.not.have.been.called();
    });
  });

  describe('.emit(\'event\', arg, arg)', function () {
    it('should trigger listeners with two arguments', function () {
      var emitter = new drip.EventEmitter()
        , listener = chai.spy()
        , noop = chai.spy();
      emitter.on('event', listener);
      emitter.on('noop', noop);
      emitter.emit('event', 1, 'two');
      listener.should.have.been.called.once;
      listener.should.have.been.always.called.with.exactly(1, 'two');
      noop.should.not.have.been.called();
    });
  });

  describe('.emit(\'event\', arg, arg, arg, arg, arg)', function () {
    it('should trigger multiple listeners with 3+ arguments', function () {
      var emitter = new drip.EventEmitter()
        , listener = chai.spy()
        , listener2 = chai.spy()
        , noop = chai.spy();
      emitter.on('event', listener);
      emitter.on('event', listener2);
      emitter.on('noop', noop);
      emitter.emit('event', 1, 2, 'three', 4, 5);
      listener.should.have.been.called.once;
      listener.should.have.always.been.called.with.exactly(1, 2, 'three', 4, 5);
      listener2.should.have.been.called.once;
      listener2.should.have.always.been.called.with.exactly(1, 2, 'three', 4, 5);
      noop.should.not.have.been.called();
    });
  });
});
