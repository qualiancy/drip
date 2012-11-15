describe('emitter', function () {
  var noop = function () { 1 == 1 }
    , noop2 = function () { 2 == 2 };

  describe('.on(\'event\', fn)', function () {
    it('should have storage after a listener is added', function() {
      var emitter = new drip.EventEmitter();
      emitter.should.not.have.property('_events');
      emitter.on('event', noop);
      emitter.should.have.property('_events')
        .and.have.property('event')
          .equal(noop);
    });

    it('should change stack to array when listeners > 1', function () {
      var emitter = new drip.EventEmitter();
      emitter.on('event', noop);
      emitter.on('event', noop2);
      emitter.should.have.property('_events')
        .and.have.property('event')
          .an('array')
          .deep.equal([ noop, noop2 ]);
    });
  });
});
