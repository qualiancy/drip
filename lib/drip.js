
exports.version = '0.0.1';

function drip () {}

drip.prototype.on = function (event, fn) {
  var callbacks = this._callbacks || (this._callbacks = {});
  (callbacks[event] = callbacks[event] || []).push(fn);

  return this;
};

drip.prototype.off = function (event, fn) {
  var callbacks = this._callbacks || (this._callbacks = {});
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
  var callbacks = this._callbacks || (this._callbacks = {}),
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