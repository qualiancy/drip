describe('enhanced', function () {
  var noop = function () { 1 == 1 }
    , noop2 = function () { 2 == 2 };

  function hasListener (ev) {
    return function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.should.not.have.property('_events');
      emitter.on(ev, noop);
      emitter.should.have.property('_events')
        .and.have.property('event')
          .an('object')
          .and.have.property('nested')
            .an('object')
            .and.have.property('_')
              .a('function')
              .equal(noop);
    }
  }

  function hasListeners (ev) {
    return function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.should.not.have.property('_events');
      emitter.on(ev, noop);
      emitter.on(ev, noop2);
      emitter.should.have.property('_events')
        .and.have.property('event')
          .an('object')
          .and.have.property('nested')
            .an('object')
            .and.have.property('_')
              .an('array')
              .deep.equal([ noop, noop2 ]);
    }
  }

  describe('.on(\'event:nested\', fn)', function () {
    it('should have storage after a listener is added', hasListeners('event:nested'));
    it('should change stack to array when listeners > 1', hasListeners('event:nested'));
  });

  describe('.on([ \'event\', \'nested\' ], fn)', function () {
    it('should have storage after a listener is added', hasListeners([ 'event', 'nested' ]));
    it('should change stack to array when listeners > 1', hasListeners( ['event', 'nested' ]));
  });
});
