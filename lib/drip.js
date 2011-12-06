/*!
 * drip - Node.js / browser event emitter.
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */


/*!
 * main module export
 */
var exports = module.exports = Drip;

/*!
 * version export
 */
exports.version = '0.1.3';

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

function Drip (opts) {
  if (opts) {
    this._drip = {};
    this._drip.delimeter = opts.delimeter || ':';
    this._drip.wildcards = opts.wildcards || (opts.delimeter ? true : false);
  }
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

  if (!this._drip.wildcards) {
    var map = this._events || (this._events = {});
    if (!map[ev]) {
      map[ev] = fn;
    } else if ('function' === typeof map[ev]) {
      map[ev] = [ map[ev], fn ];
    } else {
      map[ev].push(fn);
    }
  } else {
    var evs = ev.split(this._drip.delimeter)
      , store = this._events || (this._events = {});

    var traverse = function (events, map) {
      var event = events.shift();
      map[event] = map[event] || {};

      if (events.length) {
        traverse(events, map[event]);
      } else {
        (map[event]._ = map[event]._ || []).push(fn);
      }
    };

    traverse(evs, store);
  }

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
  var self = this;

  if (!this._events) return false;

  var clean = function (event, map) {
    var wc = self._drip.wildcards
      , ee = wc ? map[event]._ : map[event];

    if (fn && 'function' === typeof fn) {
      for (var i = 0; i < ee.length; i++) {
        if (fn == ee[i]) ee.splice(i, 1);
      }

      if (!ee.length) wc = null;
      if (wc && isEmpty(map[event])) map[event] = null;
    } else {
      map[event] = null;
    }

    return map;
  };

  if (!this._drip.wildcards) {
    clean(ev, this._events);
  } else {
    var evs = ev.split(this._drip.delimeter);

    var traverse = function (events, map) {
      var event = events.shift();
      if (map[event]._ && !events.length)
        map = clean(event, map);
      if (map['*'] && map['*']._)
        map = clean('*', map);
      if (events.length)
        traverse(events, map[event]);
    };

    traverse(evs, this._events);
  }

  return this;
};

Drip.prototype.removeAllListeners = function (ev) {

  if (!this._events) return false;

  if (!this._drip.wildcards) {
    this._events[ev] = null;
  } else {

  }
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

Drip.prototype.emit = function () {
  var self = this
    , ev = arguments[0];

  if (!this._events) return false;

  if (!this._drip.wildcards) {
    var fns = this._events[ev];

    if ('function' === typeof fns) {
      if (arguments.length === 1) {
        fns.call(this);
      } else {
        var _a = Array.prototype.slice.call(arguments, 1);
        fns.apply(this, _a);
      }
    } else if (fns) {
      for (var i = 0; i < fns.length; ++i) {
        fns[i].apply(this, arguments);
      }
    }
  } else {
    var evs = ev.split(this._drip.delimeter)
      , args = arguments;

    var execute = function (fns) {
      if ('function' === typeof fns) {
        if (args.length === 1) {
          fns.call(self);
        } else {
          var _a = Array.prototype.slice.call(args, 1);
          fns.apply(self, _a);
        }
      } else {
        for (var i = 0; i < fns.length; ++i) {
          fns[i].apply(self, args);
        }
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

    traverse(evs, this._events);
  }

  return true;
};