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
 * concat (arr1, arr2(
 *
 * A much faster concat for two arrays.
 * Returns a new array.
 *
 * @param {Array} first array
 * @param {Array} second array
 * @returns {Array} combined
 * @api private
 */

function concat (arr1, arr2) {
  var l1 = arr1.length
    , l2 = arr2.length
    , res = Array(l1 + l2);
  for (var i = 0; i < l1; i++) res[i] = arr1[i];
  for (var i2 = 0; i2 < l2; i2++) res[i + i2] = arr2[i2];
  return res;
}


/*!
 * primary module export
 */

var exports = module.exports = Drip;

/*!
 * version export
 */

exports.version = '0.3.0';

/**
 * ## Drip API
 *
 * Create new instance of drip. Can also be easily
 * be used as the basis for other objects.
 *
 *     var drop = new Drip();
 *
 *
 * Namespacing is off by default. To turn it on, use
 * the `delimeter` option, indicating what delimeter will
 * be used if you choose to listen by string. The recommended
 * standard is `:` or `::`.
 *
 *     // for namespaced events
 *     var drop = new Drip({ delimeter: ':' });
 *
 * You can also use drip as the basis for your own objects.
 * To do so, simply call the drip function on construction
 * inherit it's methods. This node pattern is the recommended
 * method.
 *
 *     function MyConstructor () {
 *       Drip.call(this, { delimeter: '::' });
 *       // etc
 *     }
 *
 *     util.inherits(MyConstructor, Drip);
 *
 * @header Drip API
 */

function Drip (opts) {
  /*!
   * @param {Object} options
   * @api public
   */

  if (opts) {
    // storage
    this._drip = {};
    this._drip.delimeter = opts.delimeter || ':';
    this._drip.wildcard = opts.wildcard || (opts.delimeter ? true : false);

    // toggle functions
    if (this._drip.wildcard) {
      this.on = onWildcard;
      this.off = offWildcard;
      this.emit = emitWildcard;
      this.hasListener  = hasWildcard;
    }
  }
}

/**
 * ### .on (event, callback)
 *
 * Bind a `callback` function to all emits of `event`.
 * Wildcards `*`, will be executed for every event at
 * that level of heirarchy.
 *
 *     // for simple drips
 *     drop.on('foo', callback);
 *
 *     // for delimeted drips
 *     drop.on('foo:bar', callback);
 *     drop.on([ 'foo', 'bar' ], callback);
 *     drop.on('foo:*', callback);
 *     drop.on([ 'foo', '*' ], callback);
 *
 * An array can be passed for event when a delimeter has been
 * defined. Events can also have as many levels as you like.
 *
 * @param {String|Array} event
 * @param {Function} callback
 * @name on
 * @alias addListener
 * @api public
 */

Drip.prototype.on = onSimple;

/*!
 * `on` for non-wildcard drip instances
 */

function onSimple () {
  var map = this._events || (this._events = {})
    , ev = arguments[0]
    , fn = arguments[1];
  if (!map[ev]) map[ev] = fn;
  else if ('function' === typeof map[ev]) map[ev] = [ map[ev], fn ];
  else map[ev].push(fn);
  return this;
}

/*!
 * `on` for wildcard drip instances
 */

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

/*!
 * alias for on
 */

Drip.prototype.addListener = function () {
  this.on.apply(this, arguments);
};

/**
 * ### .many (event, ttl, callback)
 *
 * Bind a `callback` function to count(`ttl`) emits of `event`.
 *
 *     // 3 times then auto turn off callback
 *     drop.many('event', 3, callback)
 *
 * @param {String|Array} event
 * @param {Integer} TTL Times to listen
 * @param {Function} callback
 * @name many
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
 * ### .once (event, callback)
 *
 * Bind a `callback` function to one emit of `event`.
 *
 *      drip.once('event', callback)
 *
 * @param {String|Array} event
 * @param {Function} callback
 * @name once
 * @api public
 */

Drip.prototype.once = function (ev, fn) {
  this.many(ev, 1, fn);
  return this;
};

/**
 * ### .off ([event], [callback])
 *
 * Unbind `callback` function from `event`. If no function
 * is provided will unbind all callbacks from `event`. If
 * no event is provided, event store will be purged.
 *
 *     drop.off('event', callback);
 *
 * @param {String|Array} event optional
 * @param {Function} callback optional
 * @name off
 * @alias removeListener
 * @alias removeAllListeners
 * @api public
 */

Drip.prototype.off = offSimple;

/*!
 * off for simple drip instances
 */

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

/*!
 * off for wildcard drip instances
 */

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

/*!
 * ### .removeListener ([event], [callback])
 *
 * This is an alias for `.off()`.
 *
 * @see Drip.prototype.off
 * @api public
 */

Drip.prototype.removeListener = function () {
  this.off.apply(this, arguments);
};

/*!
 * ### .removeAllListeners([event], [callback])
 *
 * This is an alias for `.off()`.
 *
 * @see Drip.prototype.off
 * @api public
 */

Drip.prototype.removeAllListeners = function () {
  this.off.call(this);
};

/**
 * ### .emit (event[, args], [...])
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
 * @param {String|Array} eventname
 * @param {String|Object} arguments multiple parameters to pass to callback functions
 * @name emit
 * @api public
 */

Drip.prototype.emit = emitSimple;

/*!
 * emit for simple drip instances
 */

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

  return true;
}

/*!
 * emit for wildcard drip instances
 */

function emitWildcard () {
  if (!this._events) return false;

  var ev = arguments[0]
    , evs = Array.isArray(ev)
      ? ev.slice(0)
      : ev.split(this._drip.delimeter)
    , fns = traverse(evs, this._events);

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

/*!
 * traverse (lookup, events)
 *
 * Traverse through a wildcard event tree
 * and determin which callbacks match the
 * given lookup. Recursive. Returns array
 * of events at that level and all subsequent
 * levels.
 *
 * @param {Array} event lookup
 * @param {Object} events tree to serch
 * @api private
 */

function traverse (events, map) {
  var event = events.shift()
    , fns = [];

  if (event !== '*' && map[event] && map[event]._ && !events.length) {
    if ('function' == typeof map[event]._) fns.push(map[event]._);
    else fns = concat(fns, map[event]._);
  }

  if (map['*'] && map['*']._ && !events.length) {
    if ('function' == typeof map['*']._) fns.push(map['*']._);
    else fns = concat(fns, map['*']._);
  }

  if (events.length && (map[event] || map['*'])) {
    var l = events.length
      , arr1 = Array(l)
      , arr2 = Array(l);
    for (var i = 0; i < l; i++) {
      arr1[i] = events[i];
      arr2[i] = events[i];
    }
    if (map[event]) {
      var trav = traverse(arr1, map[event]);
      fns = concat(fns, trav);
    }
    if (map['*']) {
      var trav = traverse(arr2, map['*']);
      fns = concat(fns, trav);
    }
  }

  return fns;
};

/**
 * ### .hasListener (ev[, function])
 *
 * Determine if an event has listeners. If a function
 * is proved will determine if that function is a
 * part of the listeners.
 *
 * @param {String|Array} event key to seach for
 * @param {Function} optional function to check
 * @returns {Boolean} found
 * @name hasListeners
 * @api public
 */

Drip.prototype.hasListener = hasSimple;

/*!
 * has for simple drip instances
 */

function hasSimple (ev, fn) {
  if (!this._events) return false;
  var fns = this._events[ev];
  if (!fns) return false;
  return hasListener(fns, fn);
}

/*!
 * has for wildcard drip instances
 */

function hasWildcard (ev, fn) {
  if (!this._events) return false;
  var evs = Array.isArray(ev)
      ? ev.slice(0)
      : ev.split(this._drip.delimeter)
    , fns = traverse(evs, this._events);
  if (fns.length === 0) return false;
  return hasListener(fns, fn);
}

/*!
 * has common
 */

function hasListener (fns, fn) {
  if (!fn && 'function' === typeof fns) return true;
  else if (fn && 'function' === typeof fns && fn == fns) return true;
  else if (fns.length === 0) return false;
  else if (fn && fns.indexOf(fn) > -1) return true;
  else if (fn) return false;
  else return true;
};

/**
 * ### .bindEvent (event, target)
 *
 * An event proxy will listen for events on the current drip
 * instance and emit them on the target when they occur. This
 * functionality is compable with node event emitter. Wildcarded
 * events on this instance will be emitted using the delimeter
 * on the target.
 *
 * Note that proxies will also be removed if a generic `off` call
 * is used.
 *
 * @param {String|Array} event key to bind
 * @param {Object} target drip or node compatible event emitter
 * @name bindEvent
 * @api public
 */

Drip.prototype.bindEvent = function (ev, target) {
  this.on(ev, eventProxy.call(this, ev, target));
  return this;
};

/**
 * ### .unbindEvent (event, target)
 *
 * Remove a boudn event listener. Event and target
 * must be provied the same as in `proxy`.
 *
 * @param {String|Array} event key to bind
 * @param {Object} target drip or node compatible event emitter
 * @name unbindEvent
 * @api public
 */

Drip.prototype.unbindEvent = function (ev, target) {
  this.off(ev, eventProxy.call(this, ev, target));
  return this;
};

/**
 * ### .proxyEvent (event, [namespace], target)
 *
 * An event proxy will listen for events on a different
 * event emitter and emit them on the current drip instance
 * when they occur. An optional namespace will be pre-pended
 * to the event when they are emitted on the current drip
 * instance.
 *
 * For example, the following will demonstrate a
 * namspacing pattering for node.
 *
 *     function ProxyServer (port) {
 *       Drip.call(this, { delimeter: ':' });
 *       this.server = http.createServer().listen(port);
 *       this.bindEvent('request', 'server', this.server);
 *     }
 *
 * Anytime `this.server` emits a `request` event, it will be
 * emitted on the constructed ProxyServer as `server:request`.
 * All arguments included in the original emit will also be
 * available.
 *
 *     var proxy = new ProxyServer(8080);
 *     proxy.on('server:request', function (req, res) {
 *       // ..
 *     });
 *
 * If you decide to use the namespace option, you can namespace
 * as deep as you like using either an array or a string that
 * uses your delimeter. The following examples are also valid.
 *
 *     drop.bindEvent('request', 'proxy:server', server);
 *     drop.bindEvent('request', [ 'proxy', 'server' ], server);
 *
 *     drop.on('proxy:server:request', cb);
 *
 * And so forth...
 *
 * @param {String|Array} event key to proxy
 * @param {String} namespace to prepend to this emit
 * @param {Object} target event emitter
 * @name proxyEvent
 * @api public
 */

Drip.prototype.proxyEvent = function (ev, ns, target) {
  if ('string' !== typeof ns) target = ns, ns = null;
  var listen = (!ns || !this._drip.delimeter)
    ? ev
    : (Array.isArray(ns)
      ? ns.concat(ev)
      : ns.split(this._drip.delimeter).concat(ev));

  target.on(ev, eventProxy.call(this, listen, this));
  return this;
};

/**
 * ### .unproxyEvent (event, [namespace], target)
 *
 * Remove an event proxy by removing the listening event
 * from the target. Don't forget to include a namespace
 * if it was used during `bindEvent`.
 *
 *     proxy.unbindEvent('request', 'request', proxy.server);
 *
 * @param {String|Array} event key to proxy
 * @param {String} namespace to prepend to this emit
 * @param {Object} target event emitter
 * @name unproxyEvent
 * @api public
 */

Drip.prototype.unproxyEvent = function (ev, ns, target) {
  if ('string' !== typeof ns) target = ns, ns = null;
  var listen = (!ns || !this._drip.delimeter)
    ? ev
    : (Array.isArray(ns)
      ? ns.concat(ev)
      : ns.split(this._drip.delimeter).concat(ev));

  target.removeListener(ev, eventProxy.call(this, listen, this));
  return this;
};

/*!
 * eventProxy (event, target)
 *
 * Create a function to use as a listener for bind/unbind or
 * proxy/unproxy calls. It will memoize the result to always
 * ensure the name function is provided for subequent calls.
 * This ensure that the the listener is correctly removed during
 * the un(bind|proxy) variants
 *
 * @param {String} event
 * @param {Object} target
 * @returns {Function} new or found callback
 * @api private
 */

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

/*!
 * makeProxy (event, target)
 *
 * Provide a context independant proxy function
 * for using with `eventProxy` construction.
 *
 * @param {String} event
 * @param {Object} target
 * @returns {Function} to be used callback
 * @api private
 */

function makeProxy(ev, target) {
  return function proxy () {
    var args = Array.prototype.slice.call(arguments)
      , evs = [ ev ].concat(args);
    target.emit.apply(target, evs);
  };
}



  return exports;
});