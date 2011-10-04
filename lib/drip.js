/*!
 * drip - Node.js / browser event emitter.
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */


/*!
 * main module export
 */
exports = module.exports = Drip;

/*!
 * version export
 */
exports.version = '0.0.3';


/*!
 * # Drip
 * 
 * Create new drip object
 * 
 */
function Drip () {
  this._callbacks = {};
}


/**
 * # on
 * 
 *      drip.on(event, callback)
 * 
 * Bind to a `callback` function to all emits of `event`.
 * 
 * @param {String} event
 * @param {Function} callback
 * 
 */
Drip.prototype.on = function (event, fn) {
  (this._callbacks[event] = this._callbacks[event] || []).push(fn);

  return this;
};

/**
 * # many
 * 
 *      drip.many(event, tte, callback)
 * 
 * Bind to a `callback` function to count(`tte`) emits of `event`.
 * 
 * @param {String} event
 * @param {Integer} TTE Times to execute
 * @param {Function} callback
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
 * # once
 * 
 *      drip.once(event, callback)
 * 
 * Bind to a `callback` function to one emit of `event`.
 * 
 * @param {String} event
 * @param {Function} callback
 * 
 */
Drip.prototype.once = function (event, fn) {
  this.many(event, 1, fn);
  return this;
};


/**
 * # off
 * 
 *      drip#off(event, callback)
 * 
 * Unbind `callback` function from `event`. If no function is provided will unbind all callbacks from `event`.
 * 
 * @param {String} eventname
 * @param {Function} callback optional
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
 * # emit
 * 
 *      drip.emit(event, arg, ...)
 * 
 * Trigger `event`, passing any arguments to callback functions.
 * 
 * @param {String} eventname
 * @param {String|Object} arguments multiple parameters to pass to callback functions
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