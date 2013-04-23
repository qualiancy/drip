describe('enhanced', function () {
  var noop = function () { 1 == 1 }
    , noop2 = function () { 1 == 1 };

  describe('.listeners(\'event:nested\')', function () {
    it('should return an array if listener exists', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:nested', noop);
      var listeners = emitter.listeners('event:nested');
      listeners.should.be.an('array');
      listeners.should.have.length(1);
    });

    it('should return an empty array if listener does not exists', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:nested', noop);
      emitter.listeners('nonevent:nested').should.deep.equal([]);
      emitter.listeners('event:notnested').should.deep.equal([]);
    });

    it('should return an array for a wildcard listener', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:*', noop);
      var listeners = emitter.listeners('event:nested');
      listeners.should.be.an('array')
      listeners.should.have.length(1);
    });
  });
});
