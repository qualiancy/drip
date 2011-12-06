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
    this._drip.wildcard = opts.wildcard || (opts.delimeter ? true : false);
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

  if (!this._drip || (this._drip && !this._drip.wildcard)) {
    var map = this._events || (this._events = {});

    if (!map[ev]) {
      map[ev] = fn;
    } else if ('function' === typeof map[ev]) {
      map[ev] = [ map[ev], fn ];
    } else {
      map[ev].push(fn);
    }

  } else if (this._drip && this._drip.wildcard) {
    var evs = Array.isArray(ev) ? ev : ev.split(this._drip.delimeter)
      , store = this._events || (this._events = {});

    var traverse = function (events, map) {
      var event = events.shift();
      map[event] = map[event] || {};

      if (events.length) {
        traverse(events, map[event]);
      } else {

        if (!map[event]._) {
          map[event]._= fn;
        } else if ('function' === typeof map[event]._) {
          map[event]._ = [ map[event]._, fn ];
        } else {
          map[event]._.push(fn);
        }

      }
    };

    traverse(evs, store);
  }

  return true;
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
  if (!this._events) return false;

  if (arguments.length === 0) {
    delete this._events;
    return true;
  }

  if (!this._drip || (this._drip && !this._drip.wildcard)) {
    if ('function' !== typeof fn) {
      this._events[ev] = null;
      return true;
    }

    var fns = this._events[ev];

    if (!fns) {
      return false;
    } else if ('function' === typeof fns && fns == fn) {
      this._events[ev] = null;
    } else if (Array.isArray(fns)) {
      for (var i = 0; i < fns.length; i++) {
        if (fns[i] == fn) fns.splice(i, 1);
      }

      if (fns.length === 0)
        this._events[ev] = null;

      if (fns.length == 1)
        this._events[ev] = fns[0];
    }
  } else {
    var evs = Array.isArray(ev) ? ev : ev.split(this._drip.delimeter);

    if (evs.length === 1) {
      if (this._events[ev]) this._events[ev]._ = null;
      return true;
    } else {
      var isEmpty = function (obj) {
        for (var name in obj) {
          if (obj[name] && name != '_') return false;
        }
        return true;
      };

      var clean = function (event) {
        if (fn && 'function' === typeof fn) {
          for (var i = 0; i < event._.length; i++) {
            if (fn == event._[i]) {
              event._.splice(i, 1);
            }
          }

          if (event._.length === 0)
            event._ = null;

          if (event._ && event._.length == 1)
            event._ = event._[0];
        } else {
          event._ = null;
        }

        if (!event._ && isEmpty(event))
          event = null;

        return event;
      };

      var traverse = function (events, map) {
        var event = events.shift();

        if (map[event] && map[event]._ && !events.length)
          map[event] = clean(map[event]);

        if (map[event] && events.length)
          map[event] = traverse(events, map[event]);

        if (!map[event]) {
          if (isEmpty(map)) map = null;
        }

        return map;
      };

      this._events = traverse(evs, this._events);
    }
  }

  return this;
};

/**
 * Alias
 */

Drip.prototype.removeAllListeners = Drip.prototype.off;

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
  var ev = arguments[0]
    , fns;

  if (!this._events) return false;

  if (!this._drip || (this._drip && !this._drip.wildcard)) {
    fns = this._events[ev];
  } else if (this._drip && this._drip.wildcard) {
    var evs = Array.isArray(ev) ? ev : ev.split(this._drip.delimeter)
      , fns = [];

    var traverse = function (events, map) {
      var event = events.shift();
      if (map[event] && map[event]._ && !events.length)
        fns = fns.concat(map[event]._);
      if (map['*'] && map['*']._ && !events.length)
        fns = fns.concat(map['*']._);
      if (events.length > 0) {
        if (map[event]) traverse(events.slice(0), map[event]);
        if (map['*']) traverse(events.slice(0), map['*']);
      }
    };

    traverse(evs, this._events);
  }

  if ('function' === typeof fns) {
    switch (arguments.length) {
      case 1:
        fns.call(this);
        break;
      case 2:
        fns.call(this, arguments[1]);
        break;
      case 3:
        fns.call(this, arguments[1], arguments[2]);
        break;
      default:
        var l = arguments.length
          , _a = new Array(l - 1);

        for (var i = 1; i < l; i++) {
          _a[i - 1] = arguments[i];
        }

        fns.apply(this, _a);
        break;
    }
  } else if (Array.isArray(fns)) {
    var l = arguments.length
      , _a = new Array(l - 1);

    for (var i = 1; i < l; i++) {
      _a[i - 1] = arguments[i];
    }

    for (var i = 0; i < fns.length; ++i) {
      fns[i].apply(this, _a);
    }
  }

  return true;
};