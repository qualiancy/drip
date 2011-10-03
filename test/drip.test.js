var assert = require('assert'),
    drip = require('drip');

module.exports = {
  'simple drip': function() {
    var n = 0;
    var drop = new drip();
    
    drop.on('hello', function() {
      n++;
    });
    
    drop.on('hello', function() {
      n++;
    });
    
    setTimeout(function() {
      drop.emit('hello');
    }, 200);
    
    this.on('exit', function() {
      assert.equal(n, 2, 'both events fired');
    });
  },
  'drip with data': function() {
    var n = 0;
    var drop = new drip();
    
    drop.on('say', function (what) {
      n++;
      assert.equal(what.msg, 'hello');
    });
    
    setTimeout(function() {
      drop.emit('say', {msg: 'hello'});  
    }, 200);
    
    this.on('exit', function() {
      assert.equal(n, 1, 'event fired');
    });
  },
  'drip turned off': function() {
    var n = 0;
    var drop = new drip();
    var fn1 = function() { n++; };
    var fn2 = function() { n++; };
    
    drop.on('hello', fn1);
    drop.on('hello', fn2);
    
    assert.equal(drop._callbacks['hello'].length, 2, 'both callbacks subscribed');
    
    setTimeout(function() {
      drop.off('hello', fn1);
      drop.emit('hello');
    }, 200);
    
    this.on('exit', function() {
      assert.equal(n, 1, 'only one event fired');
    });
  },
  'when event has no callbacks it is deleted': function() {
    var drop = new drip();
    var fn1 = function() { n++; };
    var fn2 = function() { n++; };
    
    drop.on('hello', fn1);
    drop.on('hello', fn2);
    
    assert.equal(drop._callbacks['hello'].length, 2, 'both callbacks subscribed');
    
    drop.off('hello', fn1);
    drop.off('hello', fn2);
    
    assert.isUndefined(drop._callbacks['hello']);
    
    drop.on('hello', fn1);
    drop.on('hello', fn2);
    
    assert.equal(drop._callbacks['hello'].length, 2, 'both callbacks subscribed');
    
    drop.off('hello');
    
    assert.isUndefined(drop._callbacks['hello']);
  }
};