/*!
 * drip - Node.js event emitter.
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd  == 'object') define(definition);
  else this[name] = definition();
}('drip', function () {
  var module = {};

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
    // storage
    this._drip = {};
    this._drip.delimeter = opts.delimeter || ':';
    this._drip.wildcard = opts.wildcard || (opts.delimeter ? true : false);

    // toggle functions
    this.on = onWildcard;
    this.off = offWildcard;
    this.emit = emitWildcard;
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

Drip.prototype.on = onSimple;

function onSimple () {
  var map = this._events || (this._events = {})
    , ev = arguments[0]
    , fn = arguments[1];
  if (!map[ev]) map[ev] = fn;
  else if ('function' === typeof map[ev]) map[ev] = [ map[ev], fn ];
  else map[ev].push(fn);
  return this;
}

function onWildcard () {
  var map = this._events || (this._events = {})
    , ev = arguments[0]
    , fn = arguments[1]
    , evs = Array.isArray(ev)
      ? ev.slice(0)
      : ev.split(this._drip.delimeter)
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
  return this;
}

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

Drip.prototype.off = offSimple;

function offSimple (ev, fn) {
  if (!this._events || arguments.length == 0) {
    this._events = {};
    return this;
  }

  if (!fn) {
    this._events[ev] = null;
    return this;
  }

  var fns = this._events[ev];

  if (!fns) return this;
  else if ('function' === typeof fns && fns == fn) this._events[ev] = null;
  else {
    for (var i = 0; i < fns.length; i++)
      if (fns[i] == fn) fns.splice(i, 1);
    if (fns.length === 0) this._events[ev] = null;
    else if (fns.length === 1) this._events[ev] = fns[0];
  }

  return this;
}

function offWildcard (ev, fn) {
  if (!this._events || arguments.length === 0) {
    this._events = {};
    return this;
  }

  var evs = Array.isArray(ev)
      ? ev.slice(0)
      : ev.split(this._drip.delimeter);

  if (evs.length === 1 && !fn) {
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

  return this;
};

/**
 * # .removeListeners([event], [callback])
 *
 * This is an alias for `.off()`.
 *
 * @name removeListeners
 * @see Drip.prototype.off
 * @api public
 */

Drip.prototype.removeListener = Drip.prototype.off;

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

Drip.prototype.emit = emitSimple;

function emitSimple () {
  if (!this._events) return false;
  var ev = arguments[0]
    , fns = this._events[ev];
  if (!fns) return false;

  if ('function' == typeof fns) {
    if (arguments.length == 1) fns.call(this);
    else if (arguments.length == 2) fns.call(this, arguments[1]);
    else if (arguments.length == 3) fns.call(this, arguments[1], arguments[2]);
    else {
      var l = arguments.length
        , a = Array(l - 1);
      for (var i = 1; i < l; i++) a[i - 1] = arguments[i];
      fns.apply(this, a);
    }
  } else {
    var a;
    for (var i = 0, l = fns.length; i < l; i++) {
      if (arguments.length === 1) fns[i].call(this);
      else if (arguments.length === 2) fns[i].call(this, arguments[1]);
      else if (arguments.length === 3) fns[i].call(this, arguments[1], arguments[2]);
      else {
        if (!a) {
          var l = arguments.length
          a = Array(l - 1);
          for (var i2 = 1; i2 < l; i2++) a[i2 - 1] = arguments[i2];
        }
        fns[i].apply(this, a);
      }
    }
  }

  return true //emit.call(this, fns, a);
}

function emitWildcard () {
  if (!this._events) return false;

  var ev = arguments[0]
    , fns = []
    , evs = Array.isArray(ev)
      ? ev.slice(0)
      : ev.split(this._drip.delimeter);

  function traverse (events, map) {
    var event = events.shift();

    if (event !== '*' && map[event] && map[event]._ && !events.length) {
      if ('function' == typeof map[event]._) fns.push(map[event]._);
      else {
        var l1 = fns.length
          , l2 = map[event]._.length
          , arr = Array(l1 + l2);
        for (var i = 0; i < l1; i++) arr[i] = fns[i];
        for (var i2 = 0; i2 < l2; i2++) arr[i + i2] = map[event]._[i2];
        fns = arr;
      }
    }

    if (map['*'] && map['*']._ && !events.length) {
      if ('function' == typeof map['*']._) fns.push(map['*']._);
      else {
        var l1 = fns.length
          , l2 = map['*']._.length
          , arr = Array(l1 + l2);
        for (var i = 0; i < l1; i++) arr[i] = fns[i];
        for (var i2 = 0; i2 < l2; i2++) arr[i + i2] = map['*']._[i2];
        fns = arr;
      }
    }

    if (events.length && (map[event] || map['*'])) {
      var l = events.length
        , arr1 = Array(l)
        , arr2 = Array(l);
      for (var i = 0; i < l; i++) {
        arr1[i] = events[i];
        arr2[i] = events[i];
      }
      if (map[event]) traverse(arr1, map[event]);
      if (map['*']) traverse(arr2, map['*']);
    }
  };

  traverse(evs, this._events);
  if (!fns.length) return false;

  var a;
  for (var i = 0, l = fns.length; i < l; i++) {
    if (arguments.length === 1) fns[i].call(this);
    else if (arguments.length === 2) fns[i].call(this, arguments[1]);
    else if (arguments.length === 3) fns[i].call(this, arguments[1], arguments[2]);
    else {
      if (!a) {
        var la = arguments.length
        a = Array(la - 1);
        for (var i2 = 1; i2 < la; i2++) a[i2 - 1] = arguments[i2];
      }
      fns[i].apply(this, a);
    }
  }

  return true;
}

Drip.prototype.has = function (ev, fn) {
  if (!this._events) return false;
  var ev = arguments[0]
    , fns;

  if (!this._drip || (this._drip && !this._drip.wildcard)) {
    fns = this._events[ev];
  } else {
    var evs = Array.isArray(ev)
      ? ev.slice(0)
      : ev.split(this._drip.delimeter);

    function traverse (events, map) {
      var event = events.shift();

      if (event !== '*' && map[event] && map[event]._ && !events.length) {
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

    fns = [];
    traverse(evs, this._events);
  }

  if (!fns) return false;
  else if (!fn && 'function' === typeof fns) return true;
  else if (fn && 'function' === typeof fns && fn == fns) return true;
  else if (fns.length === 0) return false;
  else if (fn && fns.indexOf(fn) > -1) return true;
  else if (fn) return false;
  else return true;
};

/**
 * .proxyEvent(event, target);
 */

Drip.prototype.proxy = function (ev, target) {
  this.on(ev, eventProxy.call(this, ev, target));
  return this;
};

Drip.prototype.unproxy = function (ev, target) {
  this.off(ev, eventProxy.call(this, ev, target));
  return this;
};

Drip.prototype.bind = function (ev, ns, target) {
  if ('string' !== typeof ns) target = ns, ns = null;
  var listen = (!ns || !this._drip.delimeter)
    ? ev
    : (Array.isArray(ns)
      ? ns.concat(ev)
      : ns.split(this._drip.delimeter).concat(ev));

  target.on(ev, eventProxy.call(this, listen, this));
};

Drip.prototype.unbind = function (ev, ns, target) {
  if ('string' !== typeof ns) target = ns, ns = null;
  var listen = (!ns || !this._drip.delimeter)
    ? ev
    : (Array.isArray(ns)
      ? ns.concat(ev)
      : ns.split(this._drip.delimeter).concat(ev));

  target.removeListener(ev, eventProxy.call(this, listen, this));
};

function eventProxy (ev, target) {
  var _drip = this._drip || (this._drip = {})
    , _memoize = _drip.memoize || (_drip.memoize = {})
    , event = (_drip.delimeter && Array.isArray(ev))
      ? ev.join(_drip.delimeter)
      : ev
    , mem = _memoize[event]
    , proxy = null;

  if (!mem) {
    proxy = makeProxy(event, target);
    _memoize[event] = [ [ target, proxy ] ];
  } else {
    for (var i = 0, l = mem.length; i < l; i++)
      if (mem[i][0] === target) return mem[i][1];
    proxy = makeProxy(event, target);
    mem.push([ target, proxy ]);
  }

  return proxy;
}

function makeProxy(ev, target) {
  return function proxy () {
    var args = Array.prototype.slice.call(arguments)
      , evs = [ ev ].concat(args);
    target.emit.apply(target, evs);
  };
}



  return exports;
});