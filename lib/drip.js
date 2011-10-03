
exports.version = '0.0.1';

function drip () {}

drip.prototype.on = function (event, fn) {
  var callbacks = this._callbacks || (this._callbacks = {});
  (callbacks[event] = callbacks[event] || []).push(fn);

  return this;
};

drip.prototype.off = function (event, fn) {
  var callbacks = this._callbacks || (this._callbacks = {});
  var events = callbacks[event],
      len;
  
  if (events) {
    len = events.length;
    if (fn && 'function' === typeof fn) {
      var new_events = [];
      for (var i = 0; i < len; i++) {
        if (fn != events[i])
          new_events.push(events[i]);
      }
      if (new_events.length > 0) {
        callbacks[event] = new_events;
      } else {
        delete callbacks[event];
      }
    } else {
      delete callbacks[event];
    }
  }
  
  return this;
};

drip.prototype.emit = function (event) {
  var callbacks = this._callbacks || (this._callbacks = {}),
      args = Array.prototype.slice.call(arguments, 1),
      events = callbacks[event],
      len;

  if (events) {
    len = events.length;
    for (var i = 0; i < len; ++i) {
      events[i].apply(this, args);
    }
  }

  return this;
};

module.exports = drip;