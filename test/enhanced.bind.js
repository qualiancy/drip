describe('enhanced', function () {
  describe('.bindEvent([ \'event\', \'nested\' ], target)', function () {
    var emitter = new drip.EnhancedEmitter()
      , target = new drip.EventEmitter()
      , listener = chai.spy('listener')
      , noop = chai.spy('noop');
    target.on('event:nested', listener);
    target.on('event:noop', noop);
    emitter.bindEvent([ 'event', 'nested' ], target);
    emitter.emit([ 'event', 'nested' ], 1, 2);
    listener.should.have.been.called(1);
    listener.should.have.always.been.called.with.exactly(1, 2);
    noop.should.not.have.been.called();
  });

  describe('.unbindEvent([ \'event\', \'nested\' ], target)', function () {
    var emitter = new drip.EnhancedEmitter()
      , target = new drip.EventEmitter()
      , listener = chai.spy('listener')
      , noop = chai.spy('noop');
    target.on('event:nested', listener);
    target.on('event:noop', noop);
    emitter.bindEvent([ 'event', 'nested' ], target);
    emitter.emit([ 'event', 'nested' ], 1, 2);
    listener.should.have.been.called(1);
    listener.should.have.always.been.called.with.exactly(1, 2);
    noop.should.not.have.been.called();

    emitter.unbindEvent([ 'event', 'nested' ], target);
    emitter.emit([ 'event', 'nested' ], 1, 2);
    listener.should.have.been.called(1);
    listener.should.have.always.been.called.with.exactly(1, 2);
    noop.should.not.have.been.called();
  });
});
