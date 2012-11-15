describe('emitter', function () {
  describe('.proxyEvent(\'event\', source)', function () {
    it('should emit event on target from self', function () {
      var emitter = new drip.EventEmitter()
        , source = new drip.EventEmitter()
        , listener = chai.spy('listener')
        , noop = chai.spy('noop');
      emitter.on('event', listener);
      emitter.on('noop', noop);
      emitter.proxyEvent('event', source);
      source.emit('event', 1, 2);
      listener.should.have.been.called(1);
      listener.should.have.always.been.called.with.exactly(1, 2);
      noop.should.not.have.been.called();
    });
  });

  describe('.unproxyEvent(\'event\', source)', function () {
    it('should not emit event on target from self', function () {
      var emitter = new drip.EventEmitter()
        , source = new drip.EventEmitter()
        , listener = chai.spy('listener')
        , noop = chai.spy('noop');
      emitter.on('event', listener);
      emitter.on('noop', noop);
      emitter.proxyEvent('event', source);
      source.emit('event', 1, 2);
      listener.should.have.been.called(1);
      listener.should.have.always.been.called.with.exactly(1, 2);
      noop.should.not.have.been.called();

      emitter.unproxyEvent('event', source);
      source.emit('event', 3, 4);
      listener.should.have.been.called(1);
      listener.should.have.always.been.called.with.exactly(1, 2);
      noop.should.not.have.been.called();
    });
  });

  describe('.proxyEvent(\'event\', \'ns\', source)', function () {
    it('should emit event on target from self', function () {
      var emitter = new drip.EventEmitter()
        , source = new drip.EventEmitter()
        , listener = chai.spy('listener')
        , noop = chai.spy('noop');
      emitter.on('ns:event', listener);
      emitter.on('ns:noop', noop);
      emitter.on('noop', noop);
      emitter.on('event', noop);
      emitter.proxyEvent('event', 'ns', source);
      source.emit('event', 1, 2);
      listener.should.have.been.called(1);
      listener.should.have.always.been.called.with.exactly(1, 2);
      noop.should.not.have.been.called();
    });
  });

  describe('.unproxyEvent(\'event\', \'ns\', source)', function () {
    it('should not emit event on target from self', function () {
      var emitter = new drip.EventEmitter()
        , source = new drip.EventEmitter()
        , listener = chai.spy('listener')
        , noop = chai.spy('noop');
      emitter.on('ns:event', listener);
      emitter.on('ns:noop', noop);
      emitter.on('noop', noop);
      emitter.on('event', noop);
      emitter.proxyEvent('event', 'ns', source);
      source.emit('event', 1, 2);
      listener.should.have.been.called(1);
      listener.should.have.always.been.called.with.exactly(1, 2);
      noop.should.not.have.been.called();

      emitter.unproxyEvent('event', 'ns', source);
      source.emit('event', 3, 4);
      listener.should.have.been.called(1);
      listener.should.have.always.been.called.with.exactly(1, 2);
      noop.should.not.have.been.called();
    });
  });
});
