/*!
 * drip - Node.js / browser event emitter.
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */
 

/**
 * main module export
 */
exports = module.exports = Drip;

/**
 * version export
 */
exports.version = '0.0.2';


/**
 * # Drip
 * 
 * Create new drip object
 * 
 */
function Drip () {
  this._callbacks = {};
}


/**
 * # Drip#on(event, function)
 * 
 * Bind to a `fn` to all emits of `event`.
 * 
 * @param {String} Event name
 * @param {Function} Callback function
 * 
 */
Drip.prototype.on = function (event, fn) {
  (this._callbacks[event] = this._callbacks[event] || []).push(fn);

  return this;
};

/**
 * # Drip#many(event, times, function)
 * 
 * Bind to a `fn` to count(times) emits of `event`.
 * 
 * @param {String} Event name
 * @param {Integer} Times to execute
 * @param {Function} Callback function
 * 
 */
Drip.prototype.many = function (event, times, fn) {
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


/**
 * # Drip#once(event, function)
 * 
 * Bind to a `fn` to one emit of `event`.
 * 
 * @param {String} Event name
 * @param {Function} Callback function
 * 
 */
Drip.prototype.once = function (event, fn) {
  this.many(event, 1, fn);
  return this;
};


/**
 * # Drip#off(event, function)
 * 
 * Unbind `function` from `event`. If no function is provided 
 * will unbind all `functions` from `event`.
 * 
 * @param {String} Event name
 * @param {Function} (optional) Callback function
 * 
 */
Drip.prototype.off = function (event, fn) {
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


/**
 * # Drip#emit(event, arg, ...)
 * 
 * Trigger `event`, passing any arguments to
 * callback functions.
 * 
 * @param {String} Event name
 * @param(s) (optional) multiple paramters to pass to callback functions.
 * 
 */
Drip.prototype.emit = function (event) {
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