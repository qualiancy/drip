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
exports.version = '0.0.6';

/**
 * # Drip
 * 
 * Create new instance of drip. Can also be easily 
 * be used as the basis for other objects.
 * 
 *      var drip = new Drip();
 * 
 */

function Drip () {
  this._callbacks = {};
}

/**
 * # .on()
 * 
 * Bind a `callback` function to all emits of `event`.
 * Wildcards `*`, will be executed for every event.
 * 
 *      drip.on(event, callback)
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
 * # .many()
 * 
 * Bind a `callback` function to count(`tte`) emits of `event`.
 * 
 *      drip.many(event, tte, callback)
 * 
 * @param {String} event
 * @param {Integer} TTE Times to execute
 * @param {Function} callback
 * 
 */

Drip.prototype.many = function (ev, times, fn) {
  var self = this;
  
  var wrap = function() {
    if (--times === 0) {
      self.off(ev, wrap);
    }
    fn.apply(null, arguments);
  };
  
  this.on(ev, wrap);
  
  return this;
};

/**
 * # .once()
 * 
 * Bind a `callback` function to one emit of `event`.
 * 
 *      drip.once(event, callback)
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
 * # .off()
 * 
 * Unbind `callback` function from `event`. If no function is provided will unbind all callbacks from `event`.
 * 
 *      drip.off(event, callback)
 * 
 * @param {String} eventname
 * @param {Function} callback optional
 * 
 */

Drip.prototype.off = function (ev, fn) {
  var cb = this._callbacks,
      evs = this._callbacks[ev];
  
  if (evs) {
    if (fn && 'function' === typeof fn) {
      for (var i = 0; i < evs.length; i++) {
        if (fn == evs[i])
          evs.splice(i, 1);
      }
      if (evs.length === 0)
        delete cb[ev];
    } else {
      delete cb[ev];
    }
  }
  
  return this;
};

/**
 * # .emit()
 * 
 * Trigger `event`, passing any arguments to callback functions.
 * 
 *      drip.emit(event, arg, ...)
 * 
 * @param {String} eventname
 * @param {String|Object} arguments multiple parameters to pass to callback functions
 * 
 */

Drip.prototype.emit = function (ev) {
  var args = Array.prototype.slice.call(arguments, 1),
      evs = this._callbacks[ev],
      wc = this._callbacks['*'];

  // named events
  if (evs) {
    for (var i = 0; i < evs.length; ++i) {
      evs[i].apply(this, args);
    }
  }
  
  // wildcards
  if (wc) {
    for (var j = 0; j < wc.length; ++j) {
      wc[j].apply(this, args);
    }
  } 

  return this;
};