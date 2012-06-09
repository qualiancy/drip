/*!
 * drip - Node.js event emitter.
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * primary module export
 */

var exports = module.exports = Drip;

/*!
 * version export
 */

exports.version = '0.2.4';

/**
 * # Drip#constructor
 *
 * Create new instance of drip. Can also be easily
 * be used as the basis for other objects.
 *
 *      // for normal events
 *      var drop = new Drip();
 *
 *      // for namespaced/wildcarded events
 *      var drop = new Drip({ wildcard: true });
 *
 * Wildcards and namespacing are off by default. By sending
 * the `wildcard` option as `true`, drip will enable both
 * wildcards and namespacing.
 *
 * ### Options
 *
 * * _delimeter_ {String} defaults to `:`
 * * _wildcard_ {Boolean} defaults to false
 *
 * @name constructor
 * @param {Object} options
 * @api public
 */

function Drip (opts) {
  if (opts) {
    this._drip = {};
    this._drip.delimeter = opts.delimeter || ':';
    this._drip.wildcard = opts.wildcard || (opts.delimeter ? true : false);
  }
}

/**
 * # .on(event, callback)
 *
 * Bind a `callback` function to all emits of `event`.
 * Wildcards `*`, will be executed for every event at
 * that heirarchy.
 *
 *      // normal events
 *      drop.on('foo', callback);
 *
 *      // namespaced events as string
 *      drop.on('foo:bar', callback);
 *
 *      // namespaced events as array
 *      drop.on(['foo', 'bar', '*', 'fu'], callback);
 *
 * An array can be passed for event when namespacing is enabled
 * if that is your preference.
 *
 * @name on
 * @param {String|Array} event
 * @param {Function} callback
 * @api public
 */

Drip.prototype.on = function (ev, fn) {
  if (!this._drip || (this._drip && !this._drip.wildcard)) {
    var map = this._events || (this._events = {});
    if (!map[ev]) map[ev] = [ fn ];
    else map[ev].push(fn);
  } else if (this._drip && this._drip.wildcard) {
    var evs = Array.isArray(ev) ? ev : ev.split(this._drip.delimeter)
      , store = this._events || (this._events = {});

    function traverse (events, map) {
      var event = events.shift();
      map[event] = map[event] || {};

      if (events.length) {
        traverse(events, map[event]);
      } else {
        if (!map[event]._) map[event]._= [ fn ];
        else map[event]._.push(fn);
      }
    };

    traverse(evs, store);
  }

  return this;
};

/**
 * # .many(event, ttl, callback)
 *
 * Bind a `callback` function to count(`ttl`) emits of `event`.
 *
 *      // 3 times then auto turn off callback
 *      drop.many('event', 3, callback)
 *
 * @name many
 * @param {String|Array} event
 * @param {Integer} TTL Times to listen
 * @param {Function} callback
 * @api public
 */

Drip.prototype.many = function (ev, times, fn) {
  var self = this;

  function wrap () {
    if (--times === 0) self.off(ev, wrap);
    fn.apply(null, arguments);
  };

  this.on(ev, wrap);
  return this;
};

/**
 * # .once(event, callback)
 *
 * Bind a `callback` function to one emit of `event`.
 *
 *      drip.once('event', callback)
 *
 * @name once
 * @param {String|Array} event
 * @param {Function} callback
 * @api public
 */

Drip.prototype.once = function (ev, fn) {
  this.many(ev, 1, fn);
  return this;
};

/**
 * # .off([event], [callback])
 *
 * Unbind `callback` function from `event`. If no function
 * is provided will unbind all callbacks from `event`. If
 * no event is provided, event store will be purged.
 *
 *      drop.off('event', callback);
 *
 * @name off
 * @param {String|Array} event optional
 * @param {Function} callback optional
 * @api public
 */

Drip.prototype.off = function (ev, fn) {
  if (!this._events || arguments.length === 0) {
    this._events = {};
    return this;
  }

  if (!this._drip || (this._drip && !this._drip.wildcard)) {
    if ('function' !== typeof fn) {
      this._events[ev] = null;
      return this;
    }

    var fns = this._events[ev];

    if (!fns) {
      return this;
    } else if ('function' === typeof fns && fns == fn) {
      this._events[ev] = null;
    } else if (Array.isArray(fns)) {
      for (var i = 0; i < fns.length; i++)
        if (fns[i] == fn) fns.splice(i, 1);
      if (fns.length === 0) this._events[ev] = null;
      else if (fns.length === 1) this._events[ev] = fns[0];
    }
  } else {
    var evs = Array.isArray(ev) ? ev : ev.split(this._drip.delimeter);

    if (evs.length === 1) {
      if (this._events[ev]) this._events[ev]._ = null;
      return this;
    } else {
      function isEmpty (obj) {
        for (var name in obj)
          if (obj[name] && name != '_') return false;
        return true;
      };

      function clean (event) {
        if (fn && 'function' === typeof fn) {
          for (var i = 0; i < event._.length; i++)
            if (fn == event._[i]) event._.splice(i, 1);
          if (event._.length === 0) event._ = null;
          if (event._ && event._.length == 1) event._ = event._[0];
        } else {
          event._ = null;
        }

        if (!event._ && isEmpty(event)) event = null;
        return event;
      };

      function traverse (events, map) {
        var event = events.shift();
        if (map[event] && map[event]._ && !events.length) map[event] = clean(map[event]);
        if (map[event] && events.length) map[event] = traverse(events, map[event]);
        if (!map[event] && isEmpty(map)) map = null;
        return map;
      };

      this._events = traverse(evs, this._events);
    }
  }

  return this;
};

/**
 * # .removeAllListeners([event], [callback])
 *
 * This is an alias for `.off()`.
 *
 * @name removeAllListeners
 * @see Drip.prototype.off
 * @api public
 */

Drip.prototype.removeAllListeners = Drip.prototype.off;

/**
 * # .emit(event, [args], [...])
 *
 * Trigger `event`, passing any arguments to callback functions.
 *
 *      // normal event
 *      drop.emit('event', arg, ...);
 *
 *      // namespaced as string
 *      drop.emit('foo:bar', arg, ...)
 *
 *      // namespaced as array
 *      drop.emit(['foo', 'bar'], arg, ...);
 *
 * @name emit
 * @param {String|Array} eventname
 * @param {String|Object} arguments multiple parameters to pass to callback functions
 * @api public
 */

Drip.prototype.emit = function () {
  if (!this._events) return this;

  var ev = arguments[0]
    , fns = getCallbacks.call(this, ev)
    , la = arguments.length
    , _a = new Array(la - 1);

  if (!fns || fns.length === 0) return this;
  for (var ia = 1; ia < la; ia++) _a[ia - 1] = arguments[ia];
  for (var i = 0, l = fns.length; i < l; i++) {
    if (_a.length === 0) fns[i].call(this);
    else if (_a.length === 1) fns[i].call(this, _a[0]);
    else if (_a.length === 2) fns[i].call(this, _a[0], _a[1]);
    else if (_a.length === 3) fns[i].call(this, _a[0], _a[1], _a[2]);
    else fns[i].apply(this, _a);
  }

  return this;
};


Drip.prototype.has = function () {
  if (!this._events) return false;
  var ev = arguments[0]
    , fns = getCallbacks.call(this, ev);
  return fns.length > 0;
}

function getCallbacks () {
  var ev = arguments[0]
    , fns;

  if (!this._drip || (this._drip && !this._drip.wildcard)) {
    fns = this._events[ev];
  } else if (this._drip && this._drip.wildcard) {
    var evs = Array.isArray(ev) ? ev : ev.split(this._drip.delimeter);
    fns = [];

    function traverse (events, map) {
      var event = events.shift();

      if (map[event] && map[event]._ && !events.length) {
        if ('function' == typeof map[event]._) fns.push(map[event]._);
        else fns = fns.concat(map[event]._);
      }

      if (map['*'] && map['*']._ && !events.length) {
        if ('function' == typeof map['*']._) fns.push(map['*']._);
        else fns = fns.concat(map['*']._);
      }

      if (events.length) {
        if (map[event]) traverse(events.slice(0), map[event]);
        if (map['*']) traverse(events.slice(0), map['*']);
      }
    };

    traverse(evs, this._events);
  }

  return fns;
}

/**
 * .proxyEvent(event, target);
 */

Drip.prototype.proxyEvent = function (ev, target, context) {
  context = context || target;
  this.on(ev, function () {
    var args = Array.prototype.slice.call(arguments)
      , event = [ ev ].concat(args);
    target.emit.apply(context, event);
  });
};
