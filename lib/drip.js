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
exports.version = '0.1.2';

/*!
 * # isEmpty()
 * 
 * Determines if an object is empty.
 * 
 * @param {Object} object
 * @private
 */
 
function isEmpty (obj) {
  for (var name in obj) {
    return false;
  }
  return true;
}

/**
 * # Drip
 * 
 * Create new instance of drip. Can also be easily 
 * be used as the basis for other objects.
 * 
 *      var drip = new Drip();
 * 
 */

function Drip (options) {
  options = options || {};
  
  this._callbacks = {};
  this._drip = {};
  this._drip.delimeter = options.delimeter || ':';
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

Drip.prototype.on = function (ev, fn) {
  var evs = ev.split(this._drip.delimeter);
  
  var traverse = function (events, map) {
    var event = events.shift();
    map[event] = map[event] || {};
    
    if (events.length) {
      traverse(events, map[event]);
    } else {
      (map[event]._ = map[event]._ || []).push(fn);
    }
  };
  
  traverse(evs, this._callbacks);
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

Drip.prototype.once = function (ev, fn) {
  this.many(ev, 1, fn);
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
  var self = this
    , evs = ev.split(this._drip.delimeter);
  
  var clean = function (event, map) {
    if (fn && 'function' === typeof fn) {
      for (var i = 0; i < map[event]._.length; i++) {
        if (fn == map[event]._[i])
          map[event]._.splice(i, 1);
      }
    } else map[event]._ = [];
    if (!map[event]._.length) delete map[event]._;
    if (isEmpty(map[event])) delete map[event];
    return map;
  };
  
  var traverse = function (events, map) {
    var event = events.shift();
    if (map[event]._ && !events.length)
      map = clean(event, map);
    if (map['*'] && map['*']._)
      map = clean('*', map);
    if (events.length)
      traverse(events, map[event]);
  };
  
  traverse(evs, this._callbacks);
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
  var self = this
    , args = Array.prototype.slice.call(arguments, 1)
    , evs = ev.split(this._drip.delimeter);

  var execute = function (fns) {
    for (var i = 0; i < fns.length; ++i) {
      fns[i].apply(self, args);
    }
  };
  
  var traverse = function (events, map) {
    var event = events.shift();
    if (map[event] && map[event]._ && !events.length)
      execute(map[event]._);
    if (map['*'] && map['*']._ && !events.length)
      execute(map['*']._);
    if (events.length > 0) {
      if (map[event]) traverse(events.slice(0), map[event]);
      if (map['*']) traverse(events.slice(0), map['*']);
    }
  };
  
  traverse(evs, this._callbacks);
  return this;
};