describe('enhanced', function () {
  var noop = function () { 1 == 1 }
    , noop2 = function () { 1 == 1 };

  describe('.hasListener(\'event:nested\')', function () {
    it('should return true if listener exists', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:nested', noop);
      emitter.hasListener('event:nested').should.be.true;
    });

    it('should return false if listener does not exists', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:nested', noop);
      emitter.hasListener('nonevent:nested').should.be.false;
      emitter.hasListener('event:notnested').should.be.false;
    });

    it('should return true for a wildcard listener', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:*', noop);
      emitter.hasListener('event:nested').should.be.true;
    });
  });

  describe('.hasListener([ \'event\', \'nested\' ])', function () {
    it('should return true if listener exists', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:nested', noop);
      emitter.hasListener([ 'event', 'nested' ]).should.be.true;
    });

    it('should return false if listener does not exists', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on([ 'event', 'nested' ], noop);
      emitter.hasListener([ 'nonevent', 'nested' ]).should.be.false;
      emitter.hasListener([ 'event', 'notnested' ]).should.be.false;
    });
  });

  describe('.hasListener(\'event:*\')', function () {
    it('should return true if any listener exists', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:*', noop);
      emitter.hasListener('event:*').should.be.true;
    });

    it('should return false if any listener does not exists', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.hasListener('event:*').should.be.false;
      emitter.hasListener('nonevent:*').should.be.false;
    });
  });

  describe('.hasListener(\'event:nested\', fn)', function () {
    it('should return true if listener exists', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:nested', noop);
      emitter.hasListener('event:nested', noop).should.be.true;
    });

    it('should return false if listener does not exists', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:nested', noop);
      emitter.hasListener('event:nested', noop2).should.be.false;
      emitter.hasListener('nonevent:nested', noop).should.be.false;
      emitter.hasListener('event:notnested', noop).should.be.false;
    });

    it('should return true for a wildcard listener', function () {
      var emitter = new drip.EnhancedEmitter();
      emitter.on('event:*', noop);
      emitter.hasListener('event:nested', noop).should.be.true;
    });
  });
});
