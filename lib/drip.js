
//exports.version = '0.0.2';

function drip () {
  this._callbacks = {};
}

drip.prototype.on = function (event, fn) {
  (this._callbacks[event] = this._callbacks[event] || []).push(fn);

  return this;
};

drip.prototype.many = function (event, times, fn) {
  var callbacks = this._callbacks;
  var self = this;
  
  var wrap = function() {
    if (--times === 0) {
      self.off(event, wrap);
    }
    fn.apply(null, arguments);
  };
  
  this.on(event, wrap);
  
  return this;
};

drip.prototype.once = function (event, fn) {
  this.many(event, 1, fn);
  return this;
};

drip.prototype.off = function (event, fn) {
  var callbacks = this._callbacks;
  var events = callbacks[event];
  
  if (events) {
    if (fn && 'function' === typeof fn) {
      for (var i = 0; i < event.length; i++) {
        if (fn == events[i])
          events.splice(i, 1);
      }
      if (events.length === 0)
        delete callbacks[event];
    } else {
      delete callbacks[event];
    }
  }
  
  return this;
};

drip.prototype.emit = function (event) {
  var callbacks = this._callbacks,
      args = Array.prototype.slice.call(arguments, 1),
      events = callbacks[event];

  if (events) {
    for (var i = 0; i < events.length; ++i) {
      events[i].apply(this, args);
    }
  }

  return this;
};

module.exports = drip;