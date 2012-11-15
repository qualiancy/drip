describe('emitter', function () {
  describe('.bindEvent(\'event\', target)', function () {
    it('should emit event on target from self', function () {
      var emitter = new drip.EventEmitter()
        , target = new drip.EventEmitter()
        , listener = chai.spy('listener')
        , noop = chai.spy('noop');
      target.on('event', listener);
      target.on('noop', noop);
      emitter.bindEvent('event', target);
      emitter.emit('event', 1, 2);
      listener.should.have.been.called(1);
      listener.should.have.always.been.called.with.exactly(1, 2);
      noop.should.not.have.been.called();
    });
  });

  describe('.unbindEvent(\'event\', target)', function () {
    it('should not emit event on target from self', function () {
      var emitter = new drip.EventEmitter()
        , target = new drip.EventEmitter()
        , listener = chai.spy('listener')
        , noop = chai.spy('noop');
      target.on('event', listener);
      target.on('noop', noop);
      emitter.bindEvent('event', target);
      emitter.emit('event', 1, 2);
      listener.should.have.been.called(1);
      listener.should.have.always.been.called.with.exactly(1, 2);
      noop.should.not.have.been.called();

      emitter.unbindEvent('event', target);
      emitter.emit('event', 3, 4);
      listener.should.have.been.called(1);
      listener.should.have.always.been.called.with.exactly(1, 2);
      noop.should.not.have.been.called();
    });
  });
});
