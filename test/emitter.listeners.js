describe('emitter', function () {
  var noop = function () { 1 == 1 }
    , noop2 = function () { 1 == 1 };

  describe('.listeners(\'event\')', function () {
    it('should return array if listener exists', function () {
      var emitter = new drip.EventEmitter();
      emitter.on('event', noop);
      var listeners = emitter.listeners('event');
      listeners.should.be.an('array');
      listeners.should.have.length(1);
    });

    it('should return empty array if listener does not exists', function () {
      var emitter = new drip.EventEmitter();
      emitter.on('event', noop);
      var listeners = emitter.listeners('noevent');
      listeners.should.be.an('array');
      listeners.should.have.length(0);
    });
  });
});
