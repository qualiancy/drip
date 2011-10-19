var sherlock = require('sherlock')
  , assert = sherlock.assert;

var drip = require('..');

module.exports = new sherlock.Investigation('Drip Event Emitter', function (test, done) {
  
  test('Drip#version', function (test, done) {
    assert.isNotNull(drip.version);
    done();
  });
  
  test('Drip#on', function (test, done) {
    var drop = new drip()
      , spy = sherlock.Spy(function (what) {
          assert.equal(what.msg, 'hello');
        });
    
    drop.on('say', spy);
    drop.on('say', spy);
    
    setTimeout(function() {
      drop.emit('say', {msg: 'hello'});  
      done();
    }, 100);
    
    this.on('exit', function() {
      assert.equal(spy.calls.length, 2, 'both events fired');
    });
  });
  
  test('Drip#off', function (test, done) {
    var drop = new drip()
      , spy1 = sherlock.Spy()
      , spy2 = sherlock.Spy();
    
    drop.on('hello', spy1);
    drop.on('hello', spy2);
    
    assert.equal(drop._callbacks['hello'].length, 2, 'both callbacks subscribed');
    
    setTimeout(function() {
      drop.off('hello', spy1);
      drop.emit('hello');
      
      test('Drip cleans up on `off`', function (test, done) {
        assert.equal(drop._callbacks['hello'].length, 1, 'only one callback');
        drop.off('hello', spy2);
        assert.isUndefined(drop._callbacks['hello']);
        drop.on('hello', spy1);
        drop.on('hello', spy2);
        assert.equal(drop._callbacks['hello'].length, 2, 'both callbacks subscribed');
        drop.off('hello');
        assert.isUndefined(drop._callbacks['hello']);
        done();
      });
      
      done();
    }, 100);
    
    this.on('exit', function() {
      assert.isFalse(spy1.called, 'spy1 not called');
      assert.isTrue(spy2.called, 'spy2 called');
    });
  });
  
  test('Drip#many/once', function (test, done) {
    var drop = new drip()
      , spy1 = sherlock.Spy()
      , spy2 = sherlock.Spy();
    
    drop.many('hello', 2, spy1);
    drop.once('hi', spy2);
    
    setTimeout(function() {
      drop.emit('hi');
      drop.emit('hi');
      drop.emit('hello');
      drop.emit('hello');
      drop.emit('hello');
      done();
    }, 100);
    
    this.on('exit', function() {
      assert.equal(spy1.calls.length, 2, 'spy1 callback called only twice');
      assert.equal(spy2.calls.length, 1, 'spy2 callback only called once');
    });
  });
  
  done();
});