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
    //drop.on('*', spy);
    
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
    
    assert.equal(drop._events['hello'].length, 2, 'both callbacks subscribed');
    
    setTimeout(function() {
      drop.off('hello', spy1);
      drop.emit('hello');
      
      test('Drip cleans up on `off`', function (test, done) {
        assert.equal(drop._events['hello'].length, 1, 'only one callback');
        drop.off('hello', spy2);
        console.log(drop);
        assert.isUndefined(drop._events['hello']);
        drop.on('hello', spy1);
        drop.on('hello', spy2);
        assert.equal(drop._events['hello'].length, 2, 'both callbacks subscribed');
        drop.off('hello');
        assert.isUndefined(drop._events['hello']);
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
  
  test('Drip#namespaces', function (test, done) {
    
    test('basic namespacing', function (test, done) {
      var drop = new drip()
        , spy1 = sherlock.Spy()
        , spy2 = sherlock.Spy()
        , spy3 = sherlock.Spy()
        , spy4 = sherlock.Spy()
        , spy5 = sherlock.Spy();
      
      drop.on('name:space', spy1);
      drop.on('name:universe', spy2);
      drop.on('name:*', spy3);
      drop.on('name', spy4);
      drop.on('*:universe', spy5);
      
      setTimeout(function() {
        drop.emit('name', {name: true});
        drop.emit('name:space', {name: 'space'});
        drop.emit('name:universe', {name: 'universe'});
        drop.emit('hello:universe', {hello: 'universe'});
        done();
      }, 100);
      
      this.on('exit', function() {
        assert.equal(spy1.calls.length, 1, 'simple - spy1 called once');
        assert.equal(spy2.calls.length, 1, 'simple - spy2 called once');
        assert.equal(spy3.calls.length, 2, 'simple - spy3 `namespaced wildcard` called twice');
        assert.equal(spy4.calls.length, 1, 'simple - spy4 `no wildcard` called once');
        assert.equal(spy5.calls.length, 2, 'simple - spy5 `ns is wildcard` called twice');
      });
    });
    
    test('complex scenarios', function (test, done) {
      var drop = new drip()
        , spy1 = sherlock.Spy()
        , spy2 = sherlock.Spy()
        , spy3 = sherlock.Spy()
        , spy4 = sherlock.Spy()
        , spy5 = sherlock.Spy();
      
      drop.on('name:space:*', spy1);
      drop.on('name:*:universe', spy2);
      
      setTimeout(function () {
        drop.emit('name:space:universe', {space: 'universe'});
        drop.emit('name:space:here', {space: 'here'});
        drop.emit('name:here:universe', {here: 'universe'});
        done();
      }, 100);
      
      this.on('exit', function() {
        assert.equal(spy1.calls.length, 2, 'spy1 called twice');
        assert.equal(spy2.calls.length, 2, 'spy2 called twice');
      });
    });
    
    done();
  });
  
  done();
});