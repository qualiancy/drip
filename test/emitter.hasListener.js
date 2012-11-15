describe('emitter', function () {
  var noop = function () { 1 == 1 }
    , noop2 = function () { 1 == 1 };

  describe('.hasListener(\'event\')', function () {
    it('should return true if listener exists', function () {
      var emitter = new drip.EventEmitter();
      emitter.on('event', noop);
      emitter.hasListener('event').should.be.true;
    });

    it('should return false if listener does not exists', function () {
      var emitter = new drip.EventEmitter();
      emitter.on('event', noop);
      emitter.hasListener('nonevent').should.be.false;
    });
  });

  describe('.hasListener(\'event\', fn)', function () {
    it('should return true if listener exists', function () {
      var emitter = new drip.EventEmitter();
      emitter.on('event', noop);
      emitter.hasListener('event', noop).should.be.true;
    });

    it('should return false if listener does not exists', function () {
      var emitter = new drip.EventEmitter();
      emitter.on('event', noop);
      emitter.hasListener('event', noop2).should.be.false;
      emitter.hasListener('nonevent', noop).should.be.false;
    });
  });
});
