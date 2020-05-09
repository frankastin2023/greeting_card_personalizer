
$ = jQuery;

/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Vue = factory());
  }(this, function () { 'use strict';
  
    /*  */
  
    var emptyObject = Object.freeze({});
  
    // These helpers produce better VM code in JS engines due to their
    // explicitness and function inlining.
    function isUndef (v) {
      return v === undefined || v === null
    }
  
    function isDef (v) {
      return v !== undefined && v !== null
    }
  
    function isTrue (v) {
      return v === true
    }
  
    function isFalse (v) {
      return v === false
    }
  
    /**
     * Check if value is primitive.
     */
    function isPrimitive (value) {
      return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        // $flow-disable-line
        typeof value === 'symbol' ||
        typeof value === 'boolean'
      )
    }
  
    /**
     * Quick object check - this is primarily used to tell
     * Objects from primitive values when we know the value
     * is a JSON-compliant type.
     */
    function isObject (obj) {
      return obj !== null && typeof obj === 'object'
    }
  
    /**
     * Get the raw type string of a value, e.g., [object Object].
     */
    var _toString = Object.prototype.toString;
  
    function toRawType (value) {
      return _toString.call(value).slice(8, -1)
    }
  
    /**
     * Strict object type check. Only returns true
     * for plain JavaScript objects.
     */
    function isPlainObject (obj) {
      return _toString.call(obj) === '[object Object]'
    }
  
    function isRegExp (v) {
      return _toString.call(v) === '[object RegExp]'
    }
  
    /**
     * Check if val is a valid array index.
     */
    function isValidArrayIndex (val) {
      var n = parseFloat(String(val));
      return n >= 0 && Math.floor(n) === n && isFinite(val)
    }
  
    function isPromise (val) {
      return (
        isDef(val) &&
        typeof val.then === 'function' &&
        typeof val.catch === 'function'
      )
    }
  
    /**
     * Convert a value to a string that is actually rendered.
     */
    function toString (val) {
      return val == null
        ? ''
        : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
          ? JSON.stringify(val, null, 2)
          : String(val)
    }
  
    /**
     * Convert an input value to a number for persistence.
     * If the conversion fails, return original string.
     */
    function toNumber (val) {
      var n = parseFloat(val);
      return isNaN(n) ? val : n
    }
  
    /**
     * Make a map and return a function for checking if a key
     * is in that map.
     */
    function makeMap (
      str,
      expectsLowerCase
    ) {
      var map = Object.create(null);
      var list = str.split(',');
      for (var i = 0; i < list.length; i++) {
        map[list[i]] = true;
      }
      return expectsLowerCase
        ? function (val) { return map[val.toLowerCase()]; }
        : function (val) { return map[val]; }
    }
  
    /**
     * Check if a tag is a built-in tag.
     */
    var isBuiltInTag = makeMap('slot,component', true);
  
    /**
     * Check if an attribute is a reserved attribute.
     */
    var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
  
    /**
     * Remove an item from an array.
     */
    function remove (arr, item) {
      if (arr.length) {
        var index = arr.indexOf(item);
        if (index > -1) {
          return arr.splice(index, 1)
        }
      }
    }
  
    /**
     * Check whether an object has the property.
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function hasOwn (obj, key) {
      return hasOwnProperty.call(obj, key)
    }
  
    /**
     * Create a cached version of a pure function.
     */
    function cached (fn) {
      var cache = Object.create(null);
      return (function cachedFn (str) {
        var hit = cache[str];
        return hit || (cache[str] = fn(str))
      })
    }
  
    /**
     * Camelize a hyphen-delimited string.
     */
    var camelizeRE = /-(\w)/g;
    var camelize = cached(function (str) {
      return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
    });
  
    /**
     * Capitalize a string.
     */
    var capitalize = cached(function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    });
  
    /**
     * Hyphenate a camelCase string.
     */
    var hyphenateRE = /\B([A-Z])/g;
    var hyphenate = cached(function (str) {
      return str.replace(hyphenateRE, '-$1').toLowerCase()
    });
  
    /**
     * Simple bind polyfill for environments that do not support it,
     * e.g., PhantomJS 1.x. Technically, we don't need this anymore
     * since native bind is now performant enough in most browsers.
     * But removing it would mean breaking code that was able to run in
     * PhantomJS 1.x, so this must be kept for backward compatibility.
     */
  
    /* istanbul ignore next */
    function polyfillBind (fn, ctx) {
      function boundFn (a) {
        var l = arguments.length;
        return l
          ? l > 1
            ? fn.apply(ctx, arguments)
            : fn.call(ctx, a)
          : fn.call(ctx)
      }
  
      boundFn._length = fn.length;
      return boundFn
    }
  
    function nativeBind (fn, ctx) {
      return fn.bind(ctx)
    }
  
    var bind = Function.prototype.bind
      ? nativeBind
      : polyfillBind;
  
    /**
     * Convert an Array-like object to a real Array.
     */
    function toArray (list, start) {
      start = start || 0;
      var i = list.length - start;
      var ret = new Array(i);
      while (i--) {
        ret[i] = list[i + start];
      }
      return ret
    }
  
    /**
     * Mix properties into target object.
     */
    function extend (to, _from) {
      for (var key in _from) {
        to[key] = _from[key];
      }
      return to
    }
  
    /**
     * Merge an Array of Objects into a single Object.
     */
    function toObject (arr) {
      var res = {};
      for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
          extend(res, arr[i]);
        }
      }
      return res
    }
  
    /* eslint-disable no-unused-vars */
  
    /**
     * Perform no operation.
     * Stubbing args to make Flow happy without leaving useless transpiled code
     * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
     */
    function noop (a, b, c) {}
  
    /**
     * Always return false.
     */
    var no = function (a, b, c) { return false; };
  
    /* eslint-enable no-unused-vars */
  
    /**
     * Return the same value.
     */
    var identity = function (_) { return _; };
  
    /**
     * Generate a string containing static keys from compiler modules.
     */
    function genStaticKeys (modules) {
      return modules.reduce(function (keys, m) {
        return keys.concat(m.staticKeys || [])
      }, []).join(',')
    }
  
    /**
     * Check if two values are loosely equal - that is,
     * if they are plain objects, do they have the same shape?
     */
    function looseEqual (a, b) {
      if (a === b) { return true }
      var isObjectA = isObject(a);
      var isObjectB = isObject(b);
      if (isObjectA && isObjectB) {
        try {
          var isArrayA = Array.isArray(a);
          var isArrayB = Array.isArray(b);
          if (isArrayA && isArrayB) {
            return a.length === b.length && a.every(function (e, i) {
              return looseEqual(e, b[i])
            })
          } else if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime()
          } else if (!isArrayA && !isArrayB) {
            var keysA = Object.keys(a);
            var keysB = Object.keys(b);
            return keysA.length === keysB.length && keysA.every(function (key) {
              return looseEqual(a[key], b[key])
            })
          } else {
            /* istanbul ignore next */
            return false
          }
        } catch (e) {
          /* istanbul ignore next */
          return false
        }
      } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b)
      } else {
        return false
      }
    }
  
    /**
     * Return the first index at which a loosely equal value can be
     * found in the array (if value is a plain object, the array must
     * contain an object of the same shape), or -1 if it is not present.
     */
    function looseIndexOf (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (looseEqual(arr[i], val)) { return i }
      }
      return -1
    }
  
    /**
     * Ensure a function is called only once.
     */
    function once (fn) {
      var called = false;
      return function () {
        if (!called) {
          called = true;
          fn.apply(this, arguments);
        }
      }
    }
  
    var SSR_ATTR = 'data-server-rendered';
  
    var ASSET_TYPES = [
      'component',
      'directive',
      'filter'
    ];
  
    var LIFECYCLE_HOOKS = [
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed',
      'activated',
      'deactivated',
      'errorCaptured',
      'serverPrefetch'
    ];
  
    /*  */
  
  
  
    var config = ({
      /**
       * Option merge strategies (used in core/util/options)
       */
      // $flow-disable-line
      optionMergeStrategies: Object.create(null),
  
      /**
       * Whether to suppress warnings.
       */
      silent: false,
  
      /**
       * Show production mode tip message on boot?
       */
      productionTip: "development" !== 'production',
  
      /**
       * Whether to enable devtools
       */
      devtools: "development" !== 'production',
  
      /**
       * Whether to record perf
       */
      performance: false,
  
      /**
       * Error handler for watcher errors
       */
      errorHandler: null,
  
      /**
       * Warn handler for watcher warns
       */
      warnHandler: null,
  
      /**
       * Ignore certain custom elements
       */
      ignoredElements: [],
  
      /**
       * Custom user key aliases for v-on
       */
      // $flow-disable-line
      keyCodes: Object.create(null),
  
      /**
       * Check if a tag is reserved so that it cannot be registered as a
       * component. This is platform-dependent and may be overwritten.
       */
      isReservedTag: no,
  
      /**
       * Check if an attribute is reserved so that it cannot be used as a component
       * prop. This is platform-dependent and may be overwritten.
       */
      isReservedAttr: no,
  
      /**
       * Check if a tag is an unknown element.
       * Platform-dependent.
       */
      isUnknownElement: no,
  
      /**
       * Get the namespace of an element
       */
      getTagNamespace: noop,
  
      /**
       * Parse the real tag name for the specific platform.
       */
      parsePlatformTagName: identity,
  
      /**
       * Check if an attribute must be bound using property, e.g. value
       * Platform-dependent.
       */
      mustUseProp: no,
  
      /**
       * Perform updates asynchronously. Intended to be used by Vue Test Utils
       * This will significantly reduce performance if set to false.
       */
      async: true,
  
      /**
       * Exposed for legacy reasons
       */
      _lifecycleHooks: LIFECYCLE_HOOKS
    });
  
    /*  */
  
    /**
     * unicode letters used for parsing html tags, component names and property paths.
     * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
     * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
     */
    var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
  
    /**
     * Check if a string starts with $ or _
     */
    function isReserved (str) {
      var c = (str + '').charCodeAt(0);
      return c === 0x24 || c === 0x5F
    }
  
    /**
     * Define a property.
     */
    function def (obj, key, val, enumerable) {
      Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
      });
    }
  
    /**
     * Parse simple path.
     */
    var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
    function parsePath (path) {
      if (bailRE.test(path)) {
        return
      }
      var segments = path.split('.');
      return function (obj) {
        for (var i = 0; i < segments.length; i++) {
          if (!obj) { return }
          obj = obj[segments[i]];
        }
        return obj
      }
    }
  
    /*  */
  
    // can we use __proto__?
    var hasProto = '__proto__' in {};
  
    // Browser environment sniffing
    var inBrowser = typeof window !== 'undefined';
    var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
    var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    var isIE = UA && /msie|trident/.test(UA);
    var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
    var isEdge = UA && UA.indexOf('edge/') > 0;
    var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
    var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
    var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
    var isPhantomJS = UA && /phantomjs/.test(UA);
    var isFF = UA && UA.match(/firefox\/(\d+)/);
  
    // Firefox has a "watch" function on Object.prototype...
    var nativeWatch = ({}).watch;
  
    var supportsPassive = false;
    if (inBrowser) {
      try {
        var opts = {};
        Object.defineProperty(opts, 'passive', ({
          get: function get () {
            /* istanbul ignore next */
            supportsPassive = true;
          }
        })); // https://github.com/facebook/flow/issues/285
        window.addEventListener('test-passive', null, opts);
      } catch (e) {}
    }
  
    // this needs to be lazy-evaled because vue may be required before
    // vue-server-renderer can set VUE_ENV
    var _isServer;
    var isServerRendering = function () {
      if (_isServer === undefined) {
        /* istanbul ignore if */
        if (!inBrowser && !inWeex && typeof global !== 'undefined') {
          // detect presence of vue-server-renderer and avoid
          // Webpack shimming the process
          _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
        } else {
          _isServer = false;
        }
      }
      return _isServer
    };
  
    // detect devtools
    var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
  
    /* istanbul ignore next */
    function isNative (Ctor) {
      return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
    }
  
    var hasSymbol =
      typeof Symbol !== 'undefined' && isNative(Symbol) &&
      typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);
  
    var _Set;
    /* istanbul ignore if */ // $flow-disable-line
    if (typeof Set !== 'undefined' && isNative(Set)) {
      // use native Set when available.
      _Set = Set;
    } else {
      // a non-standard Set polyfill that only works with primitive keys.
      _Set = /*@__PURE__*/(function () {
        function Set () {
          this.set = Object.create(null);
        }
        Set.prototype.has = function has (key) {
          return this.set[key] === true
        };
        Set.prototype.add = function add (key) {
          this.set[key] = true;
        };
        Set.prototype.clear = function clear () {
          this.set = Object.create(null);
        };
  
        return Set;
      }());
    }
  
    /*  */
  
    var warn = noop;
    var tip = noop;
    var generateComponentTrace = (noop); // work around flow check
    var formatComponentName = (noop);
  
    {
      var hasConsole = typeof console !== 'undefined';
      var classifyRE = /(?:^|[-_])(\w)/g;
      var classify = function (str) { return str
        .replace(classifyRE, function (c) { return c.toUpperCase(); })
        .replace(/[-_]/g, ''); };
  
      warn = function (msg, vm) {
        var trace = vm ? generateComponentTrace(vm) : '';
  
        if (config.warnHandler) {
          config.warnHandler.call(null, msg, vm, trace);
        } else if (hasConsole && (!config.silent)) {
          console.error(("[Vue warn]: " + msg + trace));
        }
      };
  
      tip = function (msg, vm) {
        if (hasConsole && (!config.silent)) {
          console.warn("[Vue tip]: " + msg + (
            vm ? generateComponentTrace(vm) : ''
          ));
        }
      };
  
      formatComponentName = function (vm, includeFile) {
        if (vm.$root === vm) {
          return '<Root>'
        }
        var options = typeof vm === 'function' && vm.cid != null
          ? vm.options
          : vm._isVue
            ? vm.$options || vm.constructor.options
            : vm;
        var name = options.name || options._componentTag;
        var file = options.__file;
        if (!name && file) {
          var match = file.match(/([^/\\]+)\.vue$/);
          name = match && match[1];
        }
  
        return (
          (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
          (file && includeFile !== false ? (" at " + file) : '')
        )
      };
  
      var repeat = function (str, n) {
        var res = '';
        while (n) {
          if (n % 2 === 1) { res += str; }
          if (n > 1) { str += str; }
          n >>= 1;
        }
        return res
      };
  
      generateComponentTrace = function (vm) {
        if (vm._isVue && vm.$parent) {
          var tree = [];
          var currentRecursiveSequence = 0;
          while (vm) {
            if (tree.length > 0) {
              var last = tree[tree.length - 1];
              if (last.constructor === vm.constructor) {
                currentRecursiveSequence++;
                vm = vm.$parent;
                continue
              } else if (currentRecursiveSequence > 0) {
                tree[tree.length - 1] = [last, currentRecursiveSequence];
                currentRecursiveSequence = 0;
              }
            }
            tree.push(vm);
            vm = vm.$parent;
          }
          return '\n\nfound in\n\n' + tree
            .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
                ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
                : formatComponentName(vm))); })
            .join('\n')
        } else {
          return ("\n\n(found in " + (formatComponentName(vm)) + ")")
        }
      };
    }
  
    /*  */
  
    var uid = 0;
  
    /**
     * A dep is an observable that can have multiple
     * directives subscribing to it.
     */
    var Dep = function Dep () {
      this.id = uid++;
      this.subs = [];
    };
  
    Dep.prototype.addSub = function addSub (sub) {
      this.subs.push(sub);
    };
  
    Dep.prototype.removeSub = function removeSub (sub) {
      remove(this.subs, sub);
    };
  
    Dep.prototype.depend = function depend () {
      if (Dep.target) {
        Dep.target.addDep(this);
      }
    };
  
    Dep.prototype.notify = function notify () {
      // stabilize the subscriber list first
      var subs = this.subs.slice();
      if (!config.async) {
        // subs aren't sorted in scheduler if not running async
        // we need to sort them now to make sure they fire in correct
        // order
        subs.sort(function (a, b) { return a.id - b.id; });
      }
      for (var i = 0, l = subs.length; i < l; i++) {
        subs[i].update();
      }
    };
  
    // The current target watcher being evaluated.
    // This is globally unique because only one watcher
    // can be evaluated at a time.
    Dep.target = null;
    var targetStack = [];
  
    function pushTarget (target) {
      targetStack.push(target);
      Dep.target = target;
    }
  
    function popTarget () {
      targetStack.pop();
      Dep.target = targetStack[targetStack.length - 1];
    }
  
    /*  */
  
    var VNode = function VNode (
      tag,
      data,
      children,
      text,
      elm,
      context,
      componentOptions,
      asyncFactory
    ) {
      this.tag = tag;
      this.data = data;
      this.children = children;
      this.text = text;
      this.elm = elm;
      this.ns = undefined;
      this.context = context;
      this.fnContext = undefined;
      this.fnOptions = undefined;
      this.fnScopeId = undefined;
      this.key = data && data.key;
      this.componentOptions = componentOptions;
      this.componentInstance = undefined;
      this.parent = undefined;
      this.raw = false;
      this.isStatic = false;
      this.isRootInsert = true;
      this.isComment = false;
      this.isCloned = false;
      this.isOnce = false;
      this.asyncFactory = asyncFactory;
      this.asyncMeta = undefined;
      this.isAsyncPlaceholder = false;
    };
  
    var prototypeAccessors = { child: { configurable: true } };
  
    // DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */
    prototypeAccessors.child.get = function () {
      return this.componentInstance
    };
  
    Object.defineProperties( VNode.prototype, prototypeAccessors );
  
    var createEmptyVNode = function (text) {
      if ( text === void 0 ) text = '';
  
      var node = new VNode();
      node.text = text;
      node.isComment = true;
      return node
    };
  
    function createTextVNode (val) {
      return new VNode(undefined, undefined, undefined, String(val))
    }
  
    // optimized shallow clone
    // used for static nodes and slot nodes because they may be reused across
    // multiple renders, cloning them avoids errors when DOM manipulations rely
    // on their elm reference.
    function cloneVNode (vnode) {
      var cloned = new VNode(
        vnode.tag,
        vnode.data,
        // #7975
        // clone children array to avoid mutating original in case of cloning
        // a child.
        vnode.children && vnode.children.slice(),
        vnode.text,
        vnode.elm,
        vnode.context,
        vnode.componentOptions,
        vnode.asyncFactory
      );
      cloned.ns = vnode.ns;
      cloned.isStatic = vnode.isStatic;
      cloned.key = vnode.key;
      cloned.isComment = vnode.isComment;
      cloned.fnContext = vnode.fnContext;
      cloned.fnOptions = vnode.fnOptions;
      cloned.fnScopeId = vnode.fnScopeId;
      cloned.asyncMeta = vnode.asyncMeta;
      cloned.isCloned = true;
      return cloned
    }
  
    /*
     * not type checking this file because flow doesn't play well with
     * dynamically accessing methods on Array prototype
     */
  
    var arrayProto = Array.prototype;
    var arrayMethods = Object.create(arrayProto);
  
    var methodsToPatch = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse'
    ];
  
    /**
     * Intercept mutating methods and emit events
     */
    methodsToPatch.forEach(function (method) {
      // cache original method
      var original = arrayProto[method];
      def(arrayMethods, method, function mutator () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
  
        var result = original.apply(this, args);
        var ob = this.__ob__;
        var inserted;
        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break
          case 'splice':
            inserted = args.slice(2);
            break
        }
        if (inserted) { ob.observeArray(inserted); }
        // notify change
        ob.dep.notify();
        return result
      });
    });
  
    /*  */
  
    var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
  
    /**
     * In some cases we may want to disable observation inside a component's
     * update computation.
     */
    var shouldObserve = true;
  
    function toggleObserving (value) {
      shouldObserve = value;
    }
  
    /**
     * Observer class that is attached to each observed
     * object. Once attached, the observer converts the target
     * object's property keys into getter/setters that
     * collect dependencies and dispatch updates.
     */
    var Observer = function Observer (value) {
      this.value = value;
      this.dep = new Dep();
      this.vmCount = 0;
      def(value, '__ob__', this);
      if (Array.isArray(value)) {
        if (hasProto) {
          protoAugment(value, arrayMethods);
        } else {
          copyAugment(value, arrayMethods, arrayKeys);
        }
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    };
  
    /**
     * Walk through all properties and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    Observer.prototype.walk = function walk (obj) {
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        defineReactive$$1(obj, keys[i]);
      }
    };
  
    /**
     * Observe a list of Array items.
     */
    Observer.prototype.observeArray = function observeArray (items) {
      for (var i = 0, l = items.length; i < l; i++) {
        observe(items[i]);
      }
    };
  
    // helpers
  
    /**
     * Augment a target Object or Array by intercepting
     * the prototype chain using __proto__
     */
    function protoAugment (target, src) {
      /* eslint-disable no-proto */
      target.__proto__ = src;
      /* eslint-enable no-proto */
    }
  
    /**
     * Augment a target Object or Array by defining
     * hidden properties.
     */
    /* istanbul ignore next */
    function copyAugment (target, src, keys) {
      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        def(target, key, src[key]);
      }
    }
  
    /**
     * Attempt to create an observer instance for a value,
     * returns the new observer if successfully observed,
     * or the existing observer if the value already has one.
     */
    function observe (value, asRootData) {
      if (!isObject(value) || value instanceof VNode) {
        return
      }
      var ob;
      if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
      } else if (
        shouldObserve &&
        !isServerRendering() &&
        (Array.isArray(value) || isPlainObject(value)) &&
        Object.isExtensible(value) &&
        !value._isVue
      ) {
        ob = new Observer(value);
      }
      if (asRootData && ob) {
        ob.vmCount++;
      }
      return ob
    }
  
    /**
     * Define a reactive property on an Object.
     */
    function defineReactive$$1 (
      obj,
      key,
      val,
      customSetter,
      shallow
    ) {
      var dep = new Dep();
  
      var property = Object.getOwnPropertyDescriptor(obj, key);
      if (property && property.configurable === false) {
        return
      }
  
      // cater for pre-defined getter/setters
      var getter = property && property.get;
      var setter = property && property.set;
      if ((!getter || setter) && arguments.length === 2) {
        val = obj[key];
      }
  
      var childOb = !shallow && observe(val);
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
          var value = getter ? getter.call(obj) : val;
          if (Dep.target) {
            dep.depend();
            if (childOb) {
              childOb.dep.depend();
              if (Array.isArray(value)) {
                dependArray(value);
              }
            }
          }
          return value
        },
        set: function reactiveSetter (newVal) {
          var value = getter ? getter.call(obj) : val;
          /* eslint-disable no-self-compare */
          if (newVal === value || (newVal !== newVal && value !== value)) {
            return
          }
          /* eslint-enable no-self-compare */
          if (customSetter) {
            customSetter();
          }
          // #7981: for accessor properties without setter
          if (getter && !setter) { return }
          if (setter) {
            setter.call(obj, newVal);
          } else {
            val = newVal;
          }
          childOb = !shallow && observe(newVal);
          dep.notify();
        }
      });
    }
  
    /**
     * Set a property on an object. Adds the new property and
     * triggers change notification if the property doesn't
     * already exist.
     */
    function set (target, key, val) {
      if (isUndef(target) || isPrimitive(target)
      ) {
        warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
      }
      if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        return val
      }
      if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val
      }
      var ob = (target).__ob__;
      if (target._isVue || (ob && ob.vmCount)) {
        warn(
          'Avoid adding reactive properties to a Vue instance or its root $data ' +
          'at runtime - declare it upfront in the data option.'
        );
        return val
      }
      if (!ob) {
        target[key] = val;
        return val
      }
      defineReactive$$1(ob.value, key, val);
      ob.dep.notify();
      return val
    }
  
    /**
     * Delete a property and trigger change if necessary.
     */
    function del (target, key) {
      if (isUndef(target) || isPrimitive(target)
      ) {
        warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
      }
      if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, 1);
        return
      }
      var ob = (target).__ob__;
      if (target._isVue || (ob && ob.vmCount)) {
        warn(
          'Avoid deleting properties on a Vue instance or its root $data ' +
          '- just set it to null.'
        );
        return
      }
      if (!hasOwn(target, key)) {
        return
      }
      delete target[key];
      if (!ob) {
        return
      }
      ob.dep.notify();
    }
  
    /**
     * Collect dependencies on array elements when the array is touched, since
     * we cannot intercept array element access like property getters.
     */
    function dependArray (value) {
      for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
        e = value[i];
        e && e.__ob__ && e.__ob__.dep.depend();
        if (Array.isArray(e)) {
          dependArray(e);
        }
      }
    }
  
    /*  */
  
    /**
     * Option overwriting strategies are functions that handle
     * how to merge a parent option value and a child option
     * value into the final value.
     */
    var strats = config.optionMergeStrategies;
  
    /**
     * Options with restrictions
     */
    {
      strats.el = strats.propsData = function (parent, child, vm, key) {
        if (!vm) {
          warn(
            "option \"" + key + "\" can only be used during instance " +
            'creation with the `new` keyword.'
          );
        }
        return defaultStrat(parent, child)
      };
    }
  
    /**
     * Helper that recursively merges two data objects together.
     */
    function mergeData (to, from) {
      if (!from) { return to }
      var key, toVal, fromVal;
  
      var keys = hasSymbol
        ? Reflect.ownKeys(from)
        : Object.keys(from);
  
      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        // in case the object is already observed...
        if (key === '__ob__') { continue }
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
          set(to, key, fromVal);
        } else if (
          toVal !== fromVal &&
          isPlainObject(toVal) &&
          isPlainObject(fromVal)
        ) {
          mergeData(toVal, fromVal);
        }
      }
      return to
    }
  
    /**
     * Data
     */
    function mergeDataOrFn (
      parentVal,
      childVal,
      vm
    ) {
      if (!vm) {
        // in a Vue.extend merge, both should be functions
        if (!childVal) {
          return parentVal
        }
        if (!parentVal) {
          return childVal
        }
        // when parentVal & childVal are both present,
        // we need to return a function that returns the
        // merged result of both functions... no need to
        // check if parentVal is a function here because
        // it has to be a function to pass previous merges.
        return function mergedDataFn () {
          return mergeData(
            typeof childVal === 'function' ? childVal.call(this, this) : childVal,
            typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
          )
        }
      } else {
        return function mergedInstanceDataFn () {
          // instance merge
          var instanceData = typeof childVal === 'function'
            ? childVal.call(vm, vm)
            : childVal;
          var defaultData = typeof parentVal === 'function'
            ? parentVal.call(vm, vm)
            : parentVal;
          if (instanceData) {
            return mergeData(instanceData, defaultData)
          } else {
            return defaultData
          }
        }
      }
    }
  
    strats.data = function (
      parentVal,
      childVal,
      vm
    ) {
      if (!vm) {
        if (childVal && typeof childVal !== 'function') {
          warn(
            'The "data" option should be a function ' +
            'that returns a per-instance value in component ' +
            'definitions.',
            vm
          );
  
          return parentVal
        }
        return mergeDataOrFn(parentVal, childVal)
      }
  
      return mergeDataOrFn(parentVal, childVal, vm)
    };
  
    /**
     * Hooks and props are merged as arrays.
     */
    function mergeHook (
      parentVal,
      childVal
    ) {
      var res = childVal
        ? parentVal
          ? parentVal.concat(childVal)
          : Array.isArray(childVal)
            ? childVal
            : [childVal]
        : parentVal;
      return res
        ? dedupeHooks(res)
        : res
    }
  
    function dedupeHooks (hooks) {
      var res = [];
      for (var i = 0; i < hooks.length; i++) {
        if (res.indexOf(hooks[i]) === -1) {
          res.push(hooks[i]);
        }
      }
      return res
    }
  
    LIFECYCLE_HOOKS.forEach(function (hook) {
      strats[hook] = mergeHook;
    });
  
    /**
     * Assets
     *
     * When a vm is present (instance creation), we need to do
     * a three-way merge between constructor options, instance
     * options and parent options.
     */
    function mergeAssets (
      parentVal,
      childVal,
      vm,
      key
    ) {
      var res = Object.create(parentVal || null);
      if (childVal) {
        assertObjectType(key, childVal, vm);
        return extend(res, childVal)
      } else {
        return res
      }
    }
  
    ASSET_TYPES.forEach(function (type) {
      strats[type + 's'] = mergeAssets;
    });
  
    /**
     * Watchers.
     *
     * Watchers hashes should not overwrite one
     * another, so we merge them as arrays.
     */
    strats.watch = function (
      parentVal,
      childVal,
      vm,
      key
    ) {
      // work around Firefox's Object.prototype.watch...
      if (parentVal === nativeWatch) { parentVal = undefined; }
      if (childVal === nativeWatch) { childVal = undefined; }
      /* istanbul ignore if */
      if (!childVal) { return Object.create(parentVal || null) }
      {
        assertObjectType(key, childVal, vm);
      }
      if (!parentVal) { return childVal }
      var ret = {};
      extend(ret, parentVal);
      for (var key$1 in childVal) {
        var parent = ret[key$1];
        var child = childVal[key$1];
        if (parent && !Array.isArray(parent)) {
          parent = [parent];
        }
        ret[key$1] = parent
          ? parent.concat(child)
          : Array.isArray(child) ? child : [child];
      }
      return ret
    };
  
    /**
     * Other object hashes.
     */
    strats.props =
    strats.methods =
    strats.inject =
    strats.computed = function (
      parentVal,
      childVal,
      vm,
      key
    ) {
      if (childVal && "development" !== 'production') {
        assertObjectType(key, childVal, vm);
      }
      if (!parentVal) { return childVal }
      var ret = Object.create(null);
      extend(ret, parentVal);
      if (childVal) { extend(ret, childVal); }
      return ret
    };
    strats.provide = mergeDataOrFn;
  
    /**
     * Default strategy.
     */
    var defaultStrat = function (parentVal, childVal) {
      return childVal === undefined
        ? parentVal
        : childVal
    };
  
    /**
     * Validate component names
     */
    function checkComponents (options) {
      for (var key in options.components) {
        validateComponentName(key);
      }
    }
  
    function validateComponentName (name) {
      if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'should conform to valid custom element name in html5 specification.'
        );
      }
      if (isBuiltInTag(name) || config.isReservedTag(name)) {
        warn(
          'Do not use built-in or reserved HTML elements as component ' +
          'id: ' + name
        );
      }
    }
  
    /**
     * Ensure all props option syntax are normalized into the
     * Object-based format.
     */
    function normalizeProps (options, vm) {
      var props = options.props;
      if (!props) { return }
      var res = {};
      var i, val, name;
      if (Array.isArray(props)) {
        i = props.length;
        while (i--) {
          val = props[i];
          if (typeof val === 'string') {
            name = camelize(val);
            res[name] = { type: null };
          } else {
            warn('props must be strings when using array syntax.');
          }
        }
      } else if (isPlainObject(props)) {
        for (var key in props) {
          val = props[key];
          name = camelize(key);
          res[name] = isPlainObject(val)
            ? val
            : { type: val };
        }
      } else {
        warn(
          "Invalid value for option \"props\": expected an Array or an Object, " +
          "but got " + (toRawType(props)) + ".",
          vm
        );
      }
      options.props = res;
    }
  
    /**
     * Normalize all injections into Object-based format
     */
    function normalizeInject (options, vm) {
      var inject = options.inject;
      if (!inject) { return }
      var normalized = options.inject = {};
      if (Array.isArray(inject)) {
        for (var i = 0; i < inject.length; i++) {
          normalized[inject[i]] = { from: inject[i] };
        }
      } else if (isPlainObject(inject)) {
        for (var key in inject) {
          var val = inject[key];
          normalized[key] = isPlainObject(val)
            ? extend({ from: key }, val)
            : { from: val };
        }
      } else {
        warn(
          "Invalid value for option \"inject\": expected an Array or an Object, " +
          "but got " + (toRawType(inject)) + ".",
          vm
        );
      }
    }
  
    /**
     * Normalize raw function directives into object format.
     */
    function normalizeDirectives (options) {
      var dirs = options.directives;
      if (dirs) {
        for (var key in dirs) {
          var def$$1 = dirs[key];
          if (typeof def$$1 === 'function') {
            dirs[key] = { bind: def$$1, update: def$$1 };
          }
        }
      }
    }
  
    function assertObjectType (name, value, vm) {
      if (!isPlainObject(value)) {
        warn(
          "Invalid value for option \"" + name + "\": expected an Object, " +
          "but got " + (toRawType(value)) + ".",
          vm
        );
      }
    }
  
    /**
     * Merge two option objects into a new one.
     * Core utility used in both instantiation and inheritance.
     */
    function mergeOptions (
      parent,
      child,
      vm
    ) {
      {
        checkComponents(child);
      }
  
      if (typeof child === 'function') {
        child = child.options;
      }
  
      normalizeProps(child, vm);
      normalizeInject(child, vm);
      normalizeDirectives(child);
  
      // Apply extends and mixins on the child options,
      // but only if it is a raw options object that isn't
      // the result of another mergeOptions call.
      // Only merged options has the _base property.
      if (!child._base) {
        if (child.extends) {
          parent = mergeOptions(parent, child.extends, vm);
        }
        if (child.mixins) {
          for (var i = 0, l = child.mixins.length; i < l; i++) {
            parent = mergeOptions(parent, child.mixins[i], vm);
          }
        }
      }
  
      var options = {};
      var key;
      for (key in parent) {
        mergeField(key);
      }
      for (key in child) {
        if (!hasOwn(parent, key)) {
          mergeField(key);
        }
      }
      function mergeField (key) {
        var strat = strats[key] || defaultStrat;
        options[key] = strat(parent[key], child[key], vm, key);
      }
      return options
    }
  
    /**
     * Resolve an asset.
     * This function is used because child instances need access
     * to assets defined in its ancestor chain.
     */
    function resolveAsset (
      options,
      type,
      id,
      warnMissing
    ) {
      /* istanbul ignore if */
      if (typeof id !== 'string') {
        return
      }
      var assets = options[type];
      // check local registration variations first
      if (hasOwn(assets, id)) { return assets[id] }
      var camelizedId = camelize(id);
      if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
      var PascalCaseId = capitalize(camelizedId);
      if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
      // fallback to prototype chain
      var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
      if (warnMissing && !res) {
        warn(
          'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
          options
        );
      }
      return res
    }
  
    /*  */
  
  
  
    function validateProp (
      key,
      propOptions,
      propsData,
      vm
    ) {
      var prop = propOptions[key];
      var absent = !hasOwn(propsData, key);
      var value = propsData[key];
      // boolean casting
      var booleanIndex = getTypeIndex(Boolean, prop.type);
      if (booleanIndex > -1) {
        if (absent && !hasOwn(prop, 'default')) {
          value = false;
        } else if (value === '' || value === hyphenate(key)) {
          // only cast empty string / same name to boolean if
          // boolean has higher priority
          var stringIndex = getTypeIndex(String, prop.type);
          if (stringIndex < 0 || booleanIndex < stringIndex) {
            value = true;
          }
        }
      }
      // check default value
      if (value === undefined) {
        value = getPropDefaultValue(vm, prop, key);
        // since the default value is a fresh copy,
        // make sure to observe it.
        var prevShouldObserve = shouldObserve;
        toggleObserving(true);
        observe(value);
        toggleObserving(prevShouldObserve);
      }
      {
        assertProp(prop, key, value, vm, absent);
      }
      return value
    }
  
    /**
     * Get the default value of a prop.
     */
    function getPropDefaultValue (vm, prop, key) {
      // no default, return undefined
      if (!hasOwn(prop, 'default')) {
        return undefined
      }
      var def = prop.default;
      // warn against non-factory defaults for Object & Array
      if (isObject(def)) {
        warn(
          'Invalid default value for prop "' + key + '": ' +
          'Props with type Object/Array must use a factory function ' +
          'to return the default value.',
          vm
        );
      }
      // the raw prop value was also undefined from previous render,
      // return previous default value to avoid unnecessary watcher trigger
      if (vm && vm.$options.propsData &&
        vm.$options.propsData[key] === undefined &&
        vm._props[key] !== undefined
      ) {
        return vm._props[key]
      }
      // call factory function for non-Function types
      // a value is Function if its prototype is function even across different execution context
      return typeof def === 'function' && getType(prop.type) !== 'Function'
        ? def.call(vm)
        : def
    }
  
    /**
     * Assert whether a prop is valid.
     */
    function assertProp (
      prop,
      name,
      value,
      vm,
      absent
    ) {
      if (prop.required && absent) {
        warn(
          'Missing required prop: "' + name + '"',
          vm
        );
        return
      }
      if (value == null && !prop.required) {
        return
      }
      var type = prop.type;
      var valid = !type || type === true;
      var expectedTypes = [];
      if (type) {
        if (!Array.isArray(type)) {
          type = [type];
        }
        for (var i = 0; i < type.length && !valid; i++) {
          var assertedType = assertType(value, type[i]);
          expectedTypes.push(assertedType.expectedType || '');
          valid = assertedType.valid;
        }
      }
  
      if (!valid) {
        warn(
          getInvalidTypeMessage(name, value, expectedTypes),
          vm
        );
        return
      }
      var validator = prop.validator;
      if (validator) {
        if (!validator(value)) {
          warn(
            'Invalid prop: custom validator check failed for prop "' + name + '".',
            vm
          );
        }
      }
    }
  
    var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;
  
    function assertType (value, type) {
      var valid;
      var expectedType = getType(type);
      if (simpleCheckRE.test(expectedType)) {
        var t = typeof value;
        valid = t === expectedType.toLowerCase();
        // for primitive wrapper objects
        if (!valid && t === 'object') {
          valid = value instanceof type;
        }
      } else if (expectedType === 'Object') {
        valid = isPlainObject(value);
      } else if (expectedType === 'Array') {
        valid = Array.isArray(value);
      } else {
        valid = value instanceof type;
      }
      return {
        valid: valid,
        expectedType: expectedType
      }
    }
  
    /**
     * Use function string name to check built-in types,
     * because a simple equality check will fail when running
     * across different vms / iframes.
     */
    function getType (fn) {
      var match = fn && fn.toString().match(/^\s*function (\w+)/);
      return match ? match[1] : ''
    }
  
    function isSameType (a, b) {
      return getType(a) === getType(b)
    }
  
    function getTypeIndex (type, expectedTypes) {
      if (!Array.isArray(expectedTypes)) {
        return isSameType(expectedTypes, type) ? 0 : -1
      }
      for (var i = 0, len = expectedTypes.length; i < len; i++) {
        if (isSameType(expectedTypes[i], type)) {
          return i
        }
      }
      return -1
    }
  
    function getInvalidTypeMessage (name, value, expectedTypes) {
      var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
        " Expected " + (expectedTypes.map(capitalize).join(', '));
      var expectedType = expectedTypes[0];
      var receivedType = toRawType(value);
      var expectedValue = styleValue(value, expectedType);
      var receivedValue = styleValue(value, receivedType);
      // check if we need to specify expected value
      if (expectedTypes.length === 1 &&
          isExplicable(expectedType) &&
          !isBoolean(expectedType, receivedType)) {
        message += " with value " + expectedValue;
      }
      message += ", got " + receivedType + " ";
      // check if we need to specify received value
      if (isExplicable(receivedType)) {
        message += "with value " + receivedValue + ".";
      }
      return message
    }
  
    function styleValue (value, type) {
      if (type === 'String') {
        return ("\"" + value + "\"")
      } else if (type === 'Number') {
        return ("" + (Number(value)))
      } else {
        return ("" + value)
      }
    }
  
    function isExplicable (value) {
      var explicitTypes = ['string', 'number', 'boolean'];
      return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
    }
  
    function isBoolean () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];
  
      return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
    }
  
    /*  */
  
    function handleError (err, vm, info) {
      // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
      // See: https://github.com/vuejs/vuex/issues/1505
      pushTarget();
      try {
        if (vm) {
          var cur = vm;
          while ((cur = cur.$parent)) {
            var hooks = cur.$options.errorCaptured;
            if (hooks) {
              for (var i = 0; i < hooks.length; i++) {
                try {
                  var capture = hooks[i].call(cur, err, vm, info) === false;
                  if (capture) { return }
                } catch (e) {
                  globalHandleError(e, cur, 'errorCaptured hook');
                }
              }
            }
          }
        }
        globalHandleError(err, vm, info);
      } finally {
        popTarget();
      }
    }
  
    function invokeWithErrorHandling (
      handler,
      context,
      args,
      vm,
      info
    ) {
      var res;
      try {
        res = args ? handler.apply(context, args) : handler.call(context);
        if (res && !res._isVue && isPromise(res) && !res._handled) {
          res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
          // issue #9511
          // avoid catch triggering multiple times when nested calls
          res._handled = true;
        }
      } catch (e) {
        handleError(e, vm, info);
      }
      return res
    }
  
    function globalHandleError (err, vm, info) {
      if (config.errorHandler) {
        try {
          return config.errorHandler.call(null, err, vm, info)
        } catch (e) {
          // if the user intentionally throws the original error in the handler,
          // do not log it twice
          if (e !== err) {
            logError(e, null, 'config.errorHandler');
          }
        }
      }
      logError(err, vm, info);
    }
  
    function logError (err, vm, info) {
      {
        warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
      }
      /* istanbul ignore else */
      if ((inBrowser || inWeex) && typeof console !== 'undefined') {
        console.error(err);
      } else {
        throw err
      }
    }
  
    /*  */
  
    var isUsingMicroTask = false;
  
    var callbacks = [];
    var pending = false;
  
    function flushCallbacks () {
      pending = false;
      var copies = callbacks.slice(0);
      callbacks.length = 0;
      for (var i = 0; i < copies.length; i++) {
        copies[i]();
      }
    }
  
    // Here we have async deferring wrappers using microtasks.
    // In 2.5 we used (macro) tasks (in combination with microtasks).
    // However, it has subtle problems when state is changed right before repaint
    // (e.g. #6813, out-in transitions).
    // Also, using (macro) tasks in event handler would cause some weird behaviors
    // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
    // So we now use microtasks everywhere, again.
    // A major drawback of this tradeoff is that there are some scenarios
    // where microtasks have too high a priority and fire in between supposedly
    // sequential events (e.g. #4521, #6690, which have workarounds)
    // or even between bubbling of the same event (#6566).
    var timerFunc;
  
    // The nextTick behavior leverages the microtask queue, which can be accessed
    // via either native Promise.then or MutationObserver.
    // MutationObserver has wider support, however it is seriously bugged in
    // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
    // completely stops working after triggering a few times... so, if native
    // Promise is available, we will use it:
    /* istanbul ignore next, $flow-disable-line */
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
      var p = Promise.resolve();
      timerFunc = function () {
        p.then(flushCallbacks);
        // In problematic UIWebViews, Promise.then doesn't completely break, but
        // it can get stuck in a weird state where callbacks are pushed into the
        // microtask queue but the queue isn't being flushed, until the browser
        // needs to do some other work, e.g. handle a timer. Therefore we can
        // "force" the microtask queue to be flushed by adding an empty timer.
        if (isIOS) { setTimeout(noop); }
      };
      isUsingMicroTask = true;
    } else if (!isIE && typeof MutationObserver !== 'undefined' && (
      isNative(MutationObserver) ||
      // PhantomJS and iOS 7.x
      MutationObserver.toString() === '[object MutationObserverConstructor]'
    )) {
      // Use MutationObserver where native Promise is not available,
      // e.g. PhantomJS, iOS7, Android 4.4
      // (#6466 MutationObserver is unreliable in IE11)
      var counter = 1;
      var observer = new MutationObserver(flushCallbacks);
      var textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
        characterData: true
      });
      timerFunc = function () {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
      };
      isUsingMicroTask = true;
    } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
      // Fallback to setImmediate.
      // Technically it leverages the (macro) task queue,
      // but it is still a better choice than setTimeout.
      timerFunc = function () {
        setImmediate(flushCallbacks);
      };
    } else {
      // Fallback to setTimeout.
      timerFunc = function () {
        setTimeout(flushCallbacks, 0);
      };
    }
  
    function nextTick (cb, ctx) {
      var _resolve;
      callbacks.push(function () {
        if (cb) {
          try {
            cb.call(ctx);
          } catch (e) {
            handleError(e, ctx, 'nextTick');
          }
        } else if (_resolve) {
          _resolve(ctx);
        }
      });
      if (!pending) {
        pending = true;
        timerFunc();
      }
      // $flow-disable-line
      if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
          _resolve = resolve;
        })
      }
    }
  
    /*  */
  
    var mark;
    var measure;
  
    {
      var perf = inBrowser && window.performance;
      /* istanbul ignore if */
      if (
        perf &&
        perf.mark &&
        perf.measure &&
        perf.clearMarks &&
        perf.clearMeasures
      ) {
        mark = function (tag) { return perf.mark(tag); };
        measure = function (name, startTag, endTag) {
          perf.measure(name, startTag, endTag);
          perf.clearMarks(startTag);
          perf.clearMarks(endTag);
          // perf.clearMeasures(name)
        };
      }
    }
  
    /* not type checking this file because flow doesn't play well with Proxy */
  
    var initProxy;
  
    {
      var allowedGlobals = makeMap(
        'Infinity,undefined,NaN,isFinite,isNaN,' +
        'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
        'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
        'require' // for Webpack/Browserify
      );
  
      var warnNonPresent = function (target, key) {
        warn(
          "Property or method \"" + key + "\" is not defined on the instance but " +
          'referenced during render. Make sure that this property is reactive, ' +
          'either in the data option, or for class-based components, by ' +
          'initializing the property. ' +
          'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
          target
        );
      };
  
      var warnReservedPrefix = function (target, key) {
        warn(
          "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
          'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
          'prevent conflicts with Vue internals. ' +
          'See: https://vuejs.org/v2/api/#data',
          target
        );
      };
  
      var hasProxy =
        typeof Proxy !== 'undefined' && isNative(Proxy);
  
      if (hasProxy) {
        var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
        config.keyCodes = new Proxy(config.keyCodes, {
          set: function set (target, key, value) {
            if (isBuiltInModifier(key)) {
              warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
              return false
            } else {
              target[key] = value;
              return true
            }
          }
        });
      }
  
      var hasHandler = {
        has: function has (target, key) {
          var has = key in target;
          var isAllowed = allowedGlobals(key) ||
            (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
          if (!has && !isAllowed) {
            if (key in target.$data) { warnReservedPrefix(target, key); }
            else { warnNonPresent(target, key); }
          }
          return has || !isAllowed
        }
      };
  
      var getHandler = {
        get: function get (target, key) {
          if (typeof key === 'string' && !(key in target)) {
            if (key in target.$data) { warnReservedPrefix(target, key); }
            else { warnNonPresent(target, key); }
          }
          return target[key]
        }
      };
  
      initProxy = function initProxy (vm) {
        if (hasProxy) {
          // determine which proxy handler to use
          var options = vm.$options;
          var handlers = options.render && options.render._withStripped
            ? getHandler
            : hasHandler;
          vm._renderProxy = new Proxy(vm, handlers);
        } else {
          vm._renderProxy = vm;
        }
      };
    }
  
    /*  */
  
    var seenObjects = new _Set();
  
    /**
     * Recursively traverse an object to evoke all converted
     * getters, so that every nested property inside the object
     * is collected as a "deep" dependency.
     */
    function traverse (val) {
      _traverse(val, seenObjects);
      seenObjects.clear();
    }
  
    function _traverse (val, seen) {
      var i, keys;
      var isA = Array.isArray(val);
      if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
        return
      }
      if (val.__ob__) {
        var depId = val.__ob__.dep.id;
        if (seen.has(depId)) {
          return
        }
        seen.add(depId);
      }
      if (isA) {
        i = val.length;
        while (i--) { _traverse(val[i], seen); }
      } else {
        keys = Object.keys(val);
        i = keys.length;
        while (i--) { _traverse(val[keys[i]], seen); }
      }
    }
  
    /*  */
  
    var normalizeEvent = cached(function (name) {
      var passive = name.charAt(0) === '&';
      name = passive ? name.slice(1) : name;
      var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
      name = once$$1 ? name.slice(1) : name;
      var capture = name.charAt(0) === '!';
      name = capture ? name.slice(1) : name;
      return {
        name: name,
        once: once$$1,
        capture: capture,
        passive: passive
      }
    });
  
    function createFnInvoker (fns, vm) {
      function invoker () {
        var arguments$1 = arguments;
  
        var fns = invoker.fns;
        if (Array.isArray(fns)) {
          var cloned = fns.slice();
          for (var i = 0; i < cloned.length; i++) {
            invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
          }
        } else {
          // return handler return value for single handlers
          return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
        }
      }
      invoker.fns = fns;
      return invoker
    }
  
    function updateListeners (
      on,
      oldOn,
      add,
      remove$$1,
      createOnceHandler,
      vm
    ) {
      var name, def$$1, cur, old, event;
      for (name in on) {
        def$$1 = cur = on[name];
        old = oldOn[name];
        event = normalizeEvent(name);
        if (isUndef(cur)) {
          warn(
            "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
            vm
          );
        } else if (isUndef(old)) {
          if (isUndef(cur.fns)) {
            cur = on[name] = createFnInvoker(cur, vm);
          }
          if (isTrue(event.once)) {
            cur = on[name] = createOnceHandler(event.name, cur, event.capture);
          }
          add(event.name, cur, event.capture, event.passive, event.params);
        } else if (cur !== old) {
          old.fns = cur;
          on[name] = old;
        }
      }
      for (name in oldOn) {
        if (isUndef(on[name])) {
          event = normalizeEvent(name);
          remove$$1(event.name, oldOn[name], event.capture);
        }
      }
    }
  
    /*  */
  
    function mergeVNodeHook (def, hookKey, hook) {
      if (def instanceof VNode) {
        def = def.data.hook || (def.data.hook = {});
      }
      var invoker;
      var oldHook = def[hookKey];
  
      function wrappedHook () {
        hook.apply(this, arguments);
        // important: remove merged hook to ensure it's called only once
        // and prevent memory leak
        remove(invoker.fns, wrappedHook);
      }
  
      if (isUndef(oldHook)) {
        // no existing hook
        invoker = createFnInvoker([wrappedHook]);
      } else {
        /* istanbul ignore if */
        if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
          // already a merged invoker
          invoker = oldHook;
          invoker.fns.push(wrappedHook);
        } else {
          // existing plain hook
          invoker = createFnInvoker([oldHook, wrappedHook]);
        }
      }
  
      invoker.merged = true;
      def[hookKey] = invoker;
    }
  
    /*  */
  
    function extractPropsFromVNodeData (
      data,
      Ctor,
      tag
    ) {
      // we are only extracting raw values here.
      // validation and default values are handled in the child
      // component itself.
      var propOptions = Ctor.options.props;
      if (isUndef(propOptions)) {
        return
      }
      var res = {};
      var attrs = data.attrs;
      var props = data.props;
      if (isDef(attrs) || isDef(props)) {
        for (var key in propOptions) {
          var altKey = hyphenate(key);
          {
            var keyInLowerCase = key.toLowerCase();
            if (
              key !== keyInLowerCase &&
              attrs && hasOwn(attrs, keyInLowerCase)
            ) {
              tip(
                "Prop \"" + keyInLowerCase + "\" is passed to component " +
                (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
                " \"" + key + "\". " +
                "Note that HTML attributes are case-insensitive and camelCased " +
                "props need to use their kebab-case equivalents when using in-DOM " +
                "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
              );
            }
          }
          checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
        }
      }
      return res
    }
  
    function checkProp (
      res,
      hash,
      key,
      altKey,
      preserve
    ) {
      if (isDef(hash)) {
        if (hasOwn(hash, key)) {
          res[key] = hash[key];
          if (!preserve) {
            delete hash[key];
          }
          return true
        } else if (hasOwn(hash, altKey)) {
          res[key] = hash[altKey];
          if (!preserve) {
            delete hash[altKey];
          }
          return true
        }
      }
      return false
    }
  
    /*  */
  
    // The template compiler attempts to minimize the need for normalization by
    // statically analyzing the template at compile time.
    //
    // For plain HTML markup, normalization can be completely skipped because the
    // generated render function is guaranteed to return Array<VNode>. There are
    // two cases where extra normalization is needed:
  
    // 1. When the children contains components - because a functional component
    // may return an Array instead of a single root. In this case, just a simple
    // normalization is needed - if any child is an Array, we flatten the whole
    // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
    // because functional components already normalize their own children.
    function simpleNormalizeChildren (children) {
      for (var i = 0; i < children.length; i++) {
        if (Array.isArray(children[i])) {
          return Array.prototype.concat.apply([], children)
        }
      }
      return children
    }
  
    // 2. When the children contains constructs that always generated nested Arrays,
    // e.g. <template>, <slot>, v-for, or when the children is provided by user
    // with hand-written render functions / JSX. In such cases a full normalization
    // is needed to cater to all possible types of children values.
    function normalizeChildren (children) {
      return isPrimitive(children)
        ? [createTextVNode(children)]
        : Array.isArray(children)
          ? normalizeArrayChildren(children)
          : undefined
    }
  
    function isTextNode (node) {
      return isDef(node) && isDef(node.text) && isFalse(node.isComment)
    }
  
    function normalizeArrayChildren (children, nestedIndex) {
      var res = [];
      var i, c, lastIndex, last;
      for (i = 0; i < children.length; i++) {
        c = children[i];
        if (isUndef(c) || typeof c === 'boolean') { continue }
        lastIndex = res.length - 1;
        last = res[lastIndex];
        //  nested
        if (Array.isArray(c)) {
          if (c.length > 0) {
            c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
            // merge adjacent text nodes
            if (isTextNode(c[0]) && isTextNode(last)) {
              res[lastIndex] = createTextVNode(last.text + (c[0]).text);
              c.shift();
            }
            res.push.apply(res, c);
          }
        } else if (isPrimitive(c)) {
          if (isTextNode(last)) {
            // merge adjacent text nodes
            // this is necessary for SSR hydration because text nodes are
            // essentially merged when rendered to HTML strings
            res[lastIndex] = createTextVNode(last.text + c);
          } else if (c !== '') {
            // convert primitive to vnode
            res.push(createTextVNode(c));
          }
        } else {
          if (isTextNode(c) && isTextNode(last)) {
            // merge adjacent text nodes
            res[lastIndex] = createTextVNode(last.text + c.text);
          } else {
            // default key for nested array children (likely generated by v-for)
            if (isTrue(children._isVList) &&
              isDef(c.tag) &&
              isUndef(c.key) &&
              isDef(nestedIndex)) {
              c.key = "__vlist" + nestedIndex + "_" + i + "__";
            }
            res.push(c);
          }
        }
      }
      return res
    }
  
    /*  */
  
    function initProvide (vm) {
      var provide = vm.$options.provide;
      if (provide) {
        vm._provided = typeof provide === 'function'
          ? provide.call(vm)
          : provide;
      }
    }
  
    function initInjections (vm) {
      var result = resolveInject(vm.$options.inject, vm);
      if (result) {
        toggleObserving(false);
        Object.keys(result).forEach(function (key) {
          /* istanbul ignore else */
          {
            defineReactive$$1(vm, key, result[key], function () {
              warn(
                "Avoid mutating an injected value directly since the changes will be " +
                "overwritten whenever the provided component re-renders. " +
                "injection being mutated: \"" + key + "\"",
                vm
              );
            });
          }
        });
        toggleObserving(true);
      }
    }
  
    function resolveInject (inject, vm) {
      if (inject) {
        // inject is :any because flow is not smart enough to figure out cached
        var result = Object.create(null);
        var keys = hasSymbol
          ? Reflect.ownKeys(inject)
          : Object.keys(inject);
  
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          // #6574 in case the inject object is observed...
          if (key === '__ob__') { continue }
          var provideKey = inject[key].from;
          var source = vm;
          while (source) {
            if (source._provided && hasOwn(source._provided, provideKey)) {
              result[key] = source._provided[provideKey];
              break
            }
            source = source.$parent;
          }
          if (!source) {
            if ('default' in inject[key]) {
              var provideDefault = inject[key].default;
              result[key] = typeof provideDefault === 'function'
                ? provideDefault.call(vm)
                : provideDefault;
            } else {
              warn(("Injection \"" + key + "\" not found"), vm);
            }
          }
        }
        return result
      }
    }
  
    /*  */
  
  
  
    /**
     * Runtime helper for resolving raw children VNodes into a slot object.
     */
    function resolveSlots (
      children,
      context
    ) {
      if (!children || !children.length) {
        return {}
      }
      var slots = {};
      for (var i = 0, l = children.length; i < l; i++) {
        var child = children[i];
        var data = child.data;
        // remove slot attribute if the node is resolved as a Vue slot node
        if (data && data.attrs && data.attrs.slot) {
          delete data.attrs.slot;
        }
        // named slots should only be respected if the vnode was rendered in the
        // same context.
        if ((child.context === context || child.fnContext === context) &&
          data && data.slot != null
        ) {
          var name = data.slot;
          var slot = (slots[name] || (slots[name] = []));
          if (child.tag === 'template') {
            slot.push.apply(slot, child.children || []);
          } else {
            slot.push(child);
          }
        } else {
          (slots.default || (slots.default = [])).push(child);
        }
      }
      // ignore slots that contains only whitespace
      for (var name$1 in slots) {
        if (slots[name$1].every(isWhitespace)) {
          delete slots[name$1];
        }
      }
      return slots
    }
  
    function isWhitespace (node) {
      return (node.isComment && !node.asyncFactory) || node.text === ' '
    }
  
    /*  */
  
    function normalizeScopedSlots (
      slots,
      normalSlots,
      prevSlots
    ) {
      var res;
      var hasNormalSlots = Object.keys(normalSlots).length > 0;
      var isStable = slots ? !!slots.$stable : !hasNormalSlots;
      var key = slots && slots.$key;
      if (!slots) {
        res = {};
      } else if (slots._normalized) {
        // fast path 1: child component re-render only, parent did not change
        return slots._normalized
      } else if (
        isStable &&
        prevSlots &&
        prevSlots !== emptyObject &&
        key === prevSlots.$key &&
        !hasNormalSlots &&
        !prevSlots.$hasNormal
      ) {
        // fast path 2: stable scoped slots w/ no normal slots to proxy,
        // only need to normalize once
        return prevSlots
      } else {
        res = {};
        for (var key$1 in slots) {
          if (slots[key$1] && key$1[0] !== '$') {
            res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
          }
        }
      }
      // expose normal slots on scopedSlots
      for (var key$2 in normalSlots) {
        if (!(key$2 in res)) {
          res[key$2] = proxyNormalSlot(normalSlots, key$2);
        }
      }
      // avoriaz seems to mock a non-extensible $scopedSlots object
      // and when that is passed down this would cause an error
      if (slots && Object.isExtensible(slots)) {
        (slots)._normalized = res;
      }
      def(res, '$stable', isStable);
      def(res, '$key', key);
      def(res, '$hasNormal', hasNormalSlots);
      return res
    }
  
    function normalizeScopedSlot(normalSlots, key, fn) {
      var normalized = function () {
        var res = arguments.length ? fn.apply(null, arguments) : fn({});
        res = res && typeof res === 'object' && !Array.isArray(res)
          ? [res] // single vnode
          : normalizeChildren(res);
        return res && (
          res.length === 0 ||
          (res.length === 1 && res[0].isComment) // #9658
        ) ? undefined
          : res
      };
      // this is a slot using the new v-slot syntax without scope. although it is
      // compiled as a scoped slot, render fn users would expect it to be present
      // on this.$slots because the usage is semantically a normal slot.
      if (fn.proxy) {
        Object.defineProperty(normalSlots, key, {
          get: normalized,
          enumerable: true,
          configurable: true
        });
      }
      return normalized
    }
  
    function proxyNormalSlot(slots, key) {
      return function () { return slots[key]; }
    }
  
    /*  */
  
    /**
     * Runtime helper for rendering v-for lists.
     */
    function renderList (
      val,
      render
    ) {
      var ret, i, l, keys, key;
      if (Array.isArray(val) || typeof val === 'string') {
        ret = new Array(val.length);
        for (i = 0, l = val.length; i < l; i++) {
          ret[i] = render(val[i], i);
        }
      } else if (typeof val === 'number') {
        ret = new Array(val);
        for (i = 0; i < val; i++) {
          ret[i] = render(i + 1, i);
        }
      } else if (isObject(val)) {
        if (hasSymbol && val[Symbol.iterator]) {
          ret = [];
          var iterator = val[Symbol.iterator]();
          var result = iterator.next();
          while (!result.done) {
            ret.push(render(result.value, ret.length));
            result = iterator.next();
          }
        } else {
          keys = Object.keys(val);
          ret = new Array(keys.length);
          for (i = 0, l = keys.length; i < l; i++) {
            key = keys[i];
            ret[i] = render(val[key], key, i);
          }
        }
      }
      if (!isDef(ret)) {
        ret = [];
      }
      (ret)._isVList = true;
      return ret
    }
  
    /*  */
  
    /**
     * Runtime helper for rendering <slot>
     */
    function renderSlot (
      name,
      fallback,
      props,
      bindObject
    ) {
      var scopedSlotFn = this.$scopedSlots[name];
      var nodes;
      if (scopedSlotFn) { // scoped slot
        props = props || {};
        if (bindObject) {
          if (!isObject(bindObject)) {
            warn(
              'slot v-bind without argument expects an Object',
              this
            );
          }
          props = extend(extend({}, bindObject), props);
        }
        nodes = scopedSlotFn(props) || fallback;
      } else {
        nodes = this.$slots[name] || fallback;
      }
  
      var target = props && props.slot;
      if (target) {
        return this.$createElement('template', { slot: target }, nodes)
      } else {
        return nodes
      }
    }
  
    /*  */
  
    /**
     * Runtime helper for resolving filters
     */
    function resolveFilter (id) {
      return resolveAsset(this.$options, 'filters', id, true) || identity
    }
  
    /*  */
  
    function isKeyNotMatch (expect, actual) {
      if (Array.isArray(expect)) {
        return expect.indexOf(actual) === -1
      } else {
        return expect !== actual
      }
    }
  
    /**
     * Runtime helper for checking keyCodes from config.
     * exposed as Vue.prototype._k
     * passing in eventKeyName as last argument separately for backwards compat
     */
    function checkKeyCodes (
      eventKeyCode,
      key,
      builtInKeyCode,
      eventKeyName,
      builtInKeyName
    ) {
      var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
      if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
        return isKeyNotMatch(builtInKeyName, eventKeyName)
      } else if (mappedKeyCode) {
        return isKeyNotMatch(mappedKeyCode, eventKeyCode)
      } else if (eventKeyName) {
        return hyphenate(eventKeyName) !== key
      }
    }
  
    /*  */
  
    /**
     * Runtime helper for merging v-bind="object" into a VNode's data.
     */
    function bindObjectProps (
      data,
      tag,
      value,
      asProp,
      isSync
    ) {
      if (value) {
        if (!isObject(value)) {
          warn(
            'v-bind without argument expects an Object or Array value',
            this
          );
        } else {
          if (Array.isArray(value)) {
            value = toObject(value);
          }
          var hash;
          var loop = function ( key ) {
            if (
              key === 'class' ||
              key === 'style' ||
              isReservedAttribute(key)
            ) {
              hash = data;
            } else {
              var type = data.attrs && data.attrs.type;
              hash = asProp || config.mustUseProp(tag, type, key)
                ? data.domProps || (data.domProps = {})
                : data.attrs || (data.attrs = {});
            }
            var camelizedKey = camelize(key);
            var hyphenatedKey = hyphenate(key);
            if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
              hash[key] = value[key];
  
              if (isSync) {
                var on = data.on || (data.on = {});
                on[("update:" + key)] = function ($event) {
                  value[key] = $event;
                };
              }
            }
          };
  
          for (var key in value) loop( key );
        }
      }
      return data
    }
  
    /*  */
  
    /**
     * Runtime helper for rendering static trees.
     */
    function renderStatic (
      index,
      isInFor
    ) {
      var cached = this._staticTrees || (this._staticTrees = []);
      var tree = cached[index];
      // if has already-rendered static tree and not inside v-for,
      // we can reuse the same tree.
      if (tree && !isInFor) {
        return tree
      }
      // otherwise, render a fresh tree.
      tree = cached[index] = this.$options.staticRenderFns[index].call(
        this._renderProxy,
        null,
        this // for render fns generated for functional component templates
      );
      markStatic(tree, ("__static__" + index), false);
      return tree
    }
  
    /**
     * Runtime helper for v-once.
     * Effectively it means marking the node as static with a unique key.
     */
    function markOnce (
      tree,
      index,
      key
    ) {
      markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
      return tree
    }
  
    function markStatic (
      tree,
      key,
      isOnce
    ) {
      if (Array.isArray(tree)) {
        for (var i = 0; i < tree.length; i++) {
          if (tree[i] && typeof tree[i] !== 'string') {
            markStaticNode(tree[i], (key + "_" + i), isOnce);
          }
        }
      } else {
        markStaticNode(tree, key, isOnce);
      }
    }
  
    function markStaticNode (node, key, isOnce) {
      node.isStatic = true;
      node.key = key;
      node.isOnce = isOnce;
    }
  
    /*  */
  
    function bindObjectListeners (data, value) {
      if (value) {
        if (!isPlainObject(value)) {
          warn(
            'v-on without argument expects an Object value',
            this
          );
        } else {
          var on = data.on = data.on ? extend({}, data.on) : {};
          for (var key in value) {
            var existing = on[key];
            var ours = value[key];
            on[key] = existing ? [].concat(existing, ours) : ours;
          }
        }
      }
      return data
    }
  
    /*  */
  
    function resolveScopedSlots (
      fns, // see flow/vnode
      res,
      // the following are added in 2.6
      hasDynamicKeys,
      contentHashKey
    ) {
      res = res || { $stable: !hasDynamicKeys };
      for (var i = 0; i < fns.length; i++) {
        var slot = fns[i];
        if (Array.isArray(slot)) {
          resolveScopedSlots(slot, res, hasDynamicKeys);
        } else if (slot) {
          // marker for reverse proxying v-slot without scope on this.$slots
          if (slot.proxy) {
            slot.fn.proxy = true;
          }
          res[slot.key] = slot.fn;
        }
      }
      if (contentHashKey) {
        (res).$key = contentHashKey;
      }
      return res
    }
  
    /*  */
  
    function bindDynamicKeys (baseObj, values) {
      for (var i = 0; i < values.length; i += 2) {
        var key = values[i];
        if (typeof key === 'string' && key) {
          baseObj[values[i]] = values[i + 1];
        } else if (key !== '' && key !== null) {
          // null is a special value for explicitly removing a binding
          warn(
            ("Invalid value for dynamic directive argument (expected string or null): " + key),
            this
          );
        }
      }
      return baseObj
    }
  
    // helper to dynamically append modifier runtime markers to event names.
    // ensure only append when value is already string, otherwise it will be cast
    // to string and cause the type check to miss.
    function prependModifier (value, symbol) {
      return typeof value === 'string' ? symbol + value : value
    }
  
    /*  */
  
    function installRenderHelpers (target) {
      target._o = markOnce;
      target._n = toNumber;
      target._s = toString;
      target._l = renderList;
      target._t = renderSlot;
      target._q = looseEqual;
      target._i = looseIndexOf;
      target._m = renderStatic;
      target._f = resolveFilter;
      target._k = checkKeyCodes;
      target._b = bindObjectProps;
      target._v = createTextVNode;
      target._e = createEmptyVNode;
      target._u = resolveScopedSlots;
      target._g = bindObjectListeners;
      target._d = bindDynamicKeys;
      target._p = prependModifier;
    }
  
    /*  */
  
    function FunctionalRenderContext (
      data,
      props,
      children,
      parent,
      Ctor
    ) {
      var this$1 = this;
  
      var options = Ctor.options;
      // ensure the createElement function in functional components
      // gets a unique context - this is necessary for correct named slot check
      var contextVm;
      if (hasOwn(parent, '_uid')) {
        contextVm = Object.create(parent);
        // $flow-disable-line
        contextVm._original = parent;
      } else {
        // the context vm passed in is a functional context as well.
        // in this case we want to make sure we are able to get a hold to the
        // real context instance.
        contextVm = parent;
        // $flow-disable-line
        parent = parent._original;
      }
      var isCompiled = isTrue(options._compiled);
      var needNormalization = !isCompiled;
  
      this.data = data;
      this.props = props;
      this.children = children;
      this.parent = parent;
      this.listeners = data.on || emptyObject;
      this.injections = resolveInject(options.inject, parent);
      this.slots = function () {
        if (!this$1.$slots) {
          normalizeScopedSlots(
            data.scopedSlots,
            this$1.$slots = resolveSlots(children, parent)
          );
        }
        return this$1.$slots
      };
  
      Object.defineProperty(this, 'scopedSlots', ({
        enumerable: true,
        get: function get () {
          return normalizeScopedSlots(data.scopedSlots, this.slots())
        }
      }));
  
      // support for compiled functional template
      if (isCompiled) {
        // exposing $options for renderStatic()
        this.$options = options;
        // pre-resolve slots for renderSlot()
        this.$slots = this.slots();
        this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
      }
  
      if (options._scopeId) {
        this._c = function (a, b, c, d) {
          var vnode = createElement(contextVm, a, b, c, d, needNormalization);
          if (vnode && !Array.isArray(vnode)) {
            vnode.fnScopeId = options._scopeId;
            vnode.fnContext = parent;
          }
          return vnode
        };
      } else {
        this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
      }
    }
  
    installRenderHelpers(FunctionalRenderContext.prototype);
  
    function createFunctionalComponent (
      Ctor,
      propsData,
      data,
      contextVm,
      children
    ) {
      var options = Ctor.options;
      var props = {};
      var propOptions = options.props;
      if (isDef(propOptions)) {
        for (var key in propOptions) {
          props[key] = validateProp(key, propOptions, propsData || emptyObject);
        }
      } else {
        if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
        if (isDef(data.props)) { mergeProps(props, data.props); }
      }
  
      var renderContext = new FunctionalRenderContext(
        data,
        props,
        children,
        contextVm,
        Ctor
      );
  
      var vnode = options.render.call(null, renderContext._c, renderContext);
  
      if (vnode instanceof VNode) {
        return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
      } else if (Array.isArray(vnode)) {
        var vnodes = normalizeChildren(vnode) || [];
        var res = new Array(vnodes.length);
        for (var i = 0; i < vnodes.length; i++) {
          res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
        }
        return res
      }
    }
  
    function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
      // #7817 clone node before setting fnContext, otherwise if the node is reused
      // (e.g. it was from a cached normal slot) the fnContext causes named slots
      // that should not be matched to match.
      var clone = cloneVNode(vnode);
      clone.fnContext = contextVm;
      clone.fnOptions = options;
      {
        (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
      }
      if (data.slot) {
        (clone.data || (clone.data = {})).slot = data.slot;
      }
      return clone
    }
  
    function mergeProps (to, from) {
      for (var key in from) {
        to[camelize(key)] = from[key];
      }
    }
  
    /*  */
  
    /*  */
  
    /*  */
  
    /*  */
  
    // inline hooks to be invoked on component VNodes during patch
    var componentVNodeHooks = {
      init: function init (vnode, hydrating) {
        if (
          vnode.componentInstance &&
          !vnode.componentInstance._isDestroyed &&
          vnode.data.keepAlive
        ) {
          // kept-alive components, treat as a patch
          var mountedNode = vnode; // work around flow
          componentVNodeHooks.prepatch(mountedNode, mountedNode);
        } else {
          var child = vnode.componentInstance = createComponentInstanceForVnode(
            vnode,
            activeInstance
          );
          child.$mount(hydrating ? vnode.elm : undefined, hydrating);
        }
      },
  
      prepatch: function prepatch (oldVnode, vnode) {
        var options = vnode.componentOptions;
        var child = vnode.componentInstance = oldVnode.componentInstance;
        updateChildComponent(
          child,
          options.propsData, // updated props
          options.listeners, // updated listeners
          vnode, // new parent vnode
          options.children // new children
        );
      },
  
      insert: function insert (vnode) {
        var context = vnode.context;
        var componentInstance = vnode.componentInstance;
        if (!componentInstance._isMounted) {
          componentInstance._isMounted = true;
          callHook(componentInstance, 'mounted');
        }
        if (vnode.data.keepAlive) {
          if (context._isMounted) {
            // vue-router#1212
            // During updates, a kept-alive component's child components may
            // change, so directly walking the tree here may call activated hooks
            // on incorrect children. Instead we push them into a queue which will
            // be processed after the whole patch process ended.
            queueActivatedComponent(componentInstance);
          } else {
            activateChildComponent(componentInstance, true /* direct */);
          }
        }
      },
  
      destroy: function destroy (vnode) {
        var componentInstance = vnode.componentInstance;
        if (!componentInstance._isDestroyed) {
          if (!vnode.data.keepAlive) {
            componentInstance.$destroy();
          } else {
            deactivateChildComponent(componentInstance, true /* direct */);
          }
        }
      }
    };
  
    var hooksToMerge = Object.keys(componentVNodeHooks);
  
    function createComponent (
      Ctor,
      data,
      context,
      children,
      tag
    ) {
      if (isUndef(Ctor)) {
        return
      }
  
      var baseCtor = context.$options._base;
  
      // plain options object: turn it into a constructor
      if (isObject(Ctor)) {
        Ctor = baseCtor.extend(Ctor);
      }
  
      // if at this stage it's not a constructor or an async component factory,
      // reject.
      if (typeof Ctor !== 'function') {
        {
          warn(("Invalid Component definition: " + (String(Ctor))), context);
        }
        return
      }
  
      // async component
      var asyncFactory;
      if (isUndef(Ctor.cid)) {
        asyncFactory = Ctor;
        Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
        if (Ctor === undefined) {
          // return a placeholder node for async component, which is rendered
          // as a comment node but preserves all the raw information for the node.
          // the information will be used for async server-rendering and hydration.
          return createAsyncPlaceholder(
            asyncFactory,
            data,
            context,
            children,
            tag
          )
        }
      }
  
      data = data || {};
  
      // resolve constructor options in case global mixins are applied after
      // component constructor creation
      resolveConstructorOptions(Ctor);
  
      // transform component v-model data into props & events
      if (isDef(data.model)) {
        transformModel(Ctor.options, data);
      }
  
      // extract props
      var propsData = extractPropsFromVNodeData(data, Ctor, tag);
  
      // functional component
      if (isTrue(Ctor.options.functional)) {
        return createFunctionalComponent(Ctor, propsData, data, context, children)
      }
  
      // extract listeners, since these needs to be treated as
      // child component listeners instead of DOM listeners
      var listeners = data.on;
      // replace with listeners with .native modifier
      // so it gets processed during parent component patch.
      data.on = data.nativeOn;
  
      if (isTrue(Ctor.options.abstract)) {
        // abstract components do not keep anything
        // other than props & listeners & slot
  
        // work around flow
        var slot = data.slot;
        data = {};
        if (slot) {
          data.slot = slot;
        }
      }
  
      // install component management hooks onto the placeholder node
      installComponentHooks(data);
  
      // return a placeholder vnode
      var name = Ctor.options.name || tag;
      var vnode = new VNode(
        ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
        data, undefined, undefined, undefined, context,
        { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
        asyncFactory
      );
  
      return vnode
    }
  
    function createComponentInstanceForVnode (
      vnode, // we know it's MountedComponentVNode but flow doesn't
      parent // activeInstance in lifecycle state
    ) {
      var options = {
        _isComponent: true,
        _parentVnode: vnode,
        parent: parent
      };
      // check inline-template render functions
      var inlineTemplate = vnode.data.inlineTemplate;
      if (isDef(inlineTemplate)) {
        options.render = inlineTemplate.render;
        options.staticRenderFns = inlineTemplate.staticRenderFns;
      }
      return new vnode.componentOptions.Ctor(options)
    }
  
    function installComponentHooks (data) {
      var hooks = data.hook || (data.hook = {});
      for (var i = 0; i < hooksToMerge.length; i++) {
        var key = hooksToMerge[i];
        var existing = hooks[key];
        var toMerge = componentVNodeHooks[key];
        if (existing !== toMerge && !(existing && existing._merged)) {
          hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
        }
      }
    }
  
    function mergeHook$1 (f1, f2) {
      var merged = function (a, b) {
        // flow complains about extra args which is why we use any
        f1(a, b);
        f2(a, b);
      };
      merged._merged = true;
      return merged
    }
  
    // transform component v-model info (value and callback) into
    // prop and event handler respectively.
    function transformModel (options, data) {
      var prop = (options.model && options.model.prop) || 'value';
      var event = (options.model && options.model.event) || 'input'
      ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
      var on = data.on || (data.on = {});
      var existing = on[event];
      var callback = data.model.callback;
      if (isDef(existing)) {
        if (
          Array.isArray(existing)
            ? existing.indexOf(callback) === -1
            : existing !== callback
        ) {
          on[event] = [callback].concat(existing);
        }
      } else {
        on[event] = callback;
      }
    }
  
    /*  */
  
    var SIMPLE_NORMALIZE = 1;
    var ALWAYS_NORMALIZE = 2;
  
    // wrapper function for providing a more flexible interface
    // without getting yelled at by flow
    function createElement (
      context,
      tag,
      data,
      children,
      normalizationType,
      alwaysNormalize
    ) {
      if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children;
        children = data;
        data = undefined;
      }
      if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE;
      }
      return _createElement(context, tag, data, children, normalizationType)
    }
  
    function _createElement (
      context,
      tag,
      data,
      children,
      normalizationType
    ) {
      if (isDef(data) && isDef((data).__ob__)) {
        warn(
          "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
          'Always create fresh vnode data objects in each render!',
          context
        );
        return createEmptyVNode()
      }
      // object syntax in v-bind
      if (isDef(data) && isDef(data.is)) {
        tag = data.is;
      }
      if (!tag) {
        // in case of component :is set to falsy value
        return createEmptyVNode()
      }
      // warn against non-primitive key
      if (isDef(data) && isDef(data.key) && !isPrimitive(data.key)
      ) {
        {
          warn(
            'Avoid using non-primitive value as key, ' +
            'use string/number value instead.',
            context
          );
        }
      }
      // support single function children as default scoped slot
      if (Array.isArray(children) &&
        typeof children[0] === 'function'
      ) {
        data = data || {};
        data.scopedSlots = { default: children[0] };
        children.length = 0;
      }
      if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children);
      } else if (normalizationType === SIMPLE_NORMALIZE) {
        children = simpleNormalizeChildren(children);
      }
      var vnode, ns;
      if (typeof tag === 'string') {
        var Ctor;
        ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
        if (config.isReservedTag(tag)) {
          // platform built-in elements
          if (isDef(data) && isDef(data.nativeOn)) {
            warn(
              ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
              context
            );
          }
          vnode = new VNode(
            config.parsePlatformTagName(tag), data, children,
            undefined, undefined, context
          );
        } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
          // component
          vnode = createComponent(Ctor, data, context, children, tag);
        } else {
          // unknown or unlisted namespaced elements
          // check at runtime because it may get assigned a namespace when its
          // parent normalizes children
          vnode = new VNode(
            tag, data, children,
            undefined, undefined, context
          );
        }
      } else {
        // direct component options / constructor
        vnode = createComponent(tag, data, context, children);
      }
      if (Array.isArray(vnode)) {
        return vnode
      } else if (isDef(vnode)) {
        if (isDef(ns)) { applyNS(vnode, ns); }
        if (isDef(data)) { registerDeepBindings(data); }
        return vnode
      } else {
        return createEmptyVNode()
      }
    }
  
    function applyNS (vnode, ns, force) {
      vnode.ns = ns;
      if (vnode.tag === 'foreignObject') {
        // use default namespace inside foreignObject
        ns = undefined;
        force = true;
      }
      if (isDef(vnode.children)) {
        for (var i = 0, l = vnode.children.length; i < l; i++) {
          var child = vnode.children[i];
          if (isDef(child.tag) && (
            isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
            applyNS(child, ns, force);
          }
        }
      }
    }
  
    // ref #5318
    // necessary to ensure parent re-render when deep bindings like :style and
    // :class are used on slot nodes
    function registerDeepBindings (data) {
      if (isObject(data.style)) {
        traverse(data.style);
      }
      if (isObject(data.class)) {
        traverse(data.class);
      }
    }
  
    /*  */
  
    function initRender (vm) {
      vm._vnode = null; // the root of the child tree
      vm._staticTrees = null; // v-once cached trees
      var options = vm.$options;
      var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
      var renderContext = parentVnode && parentVnode.context;
      vm.$slots = resolveSlots(options._renderChildren, renderContext);
      vm.$scopedSlots = emptyObject;
      // bind the createElement fn to this instance
      // so that we get proper render context inside it.
      // args order: tag, data, children, normalizationType, alwaysNormalize
      // internal version is used by render functions compiled from templates
      vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
      // normalization is always applied for the public version, used in
      // user-written render functions.
      vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };
  
      // $attrs & $listeners are exposed for easier HOC creation.
      // they need to be reactive so that HOCs using them are always updated
      var parentData = parentVnode && parentVnode.data;
  
      /* istanbul ignore else */
      {
        defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
          !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
        }, true);
        defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
          !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
        }, true);
      }
    }
  
    var currentRenderingInstance = null;
  
    function renderMixin (Vue) {
      // install runtime convenience helpers
      installRenderHelpers(Vue.prototype);
  
      Vue.prototype.$nextTick = function (fn) {
        return nextTick(fn, this)
      };
  
      Vue.prototype._render = function () {
        var vm = this;
        var ref = vm.$options;
        var render = ref.render;
        var _parentVnode = ref._parentVnode;
  
        if (_parentVnode) {
          vm.$scopedSlots = normalizeScopedSlots(
            _parentVnode.data.scopedSlots,
            vm.$slots,
            vm.$scopedSlots
          );
        }
  
        // set parent vnode. this allows render functions to have access
        // to the data on the placeholder node.
        vm.$vnode = _parentVnode;
        // render self
        var vnode;
        try {
          // There's no need to maintain a stack because all render fns are called
          // separately from one another. Nested component's render fns are called
          // when parent component is patched.
          currentRenderingInstance = vm;
          vnode = render.call(vm._renderProxy, vm.$createElement);
        } catch (e) {
          handleError(e, vm, "render");
          // return error render result,
          // or previous vnode to prevent render error causing blank component
          /* istanbul ignore else */
          if (vm.$options.renderError) {
            try {
              vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
            } catch (e) {
              handleError(e, vm, "renderError");
              vnode = vm._vnode;
            }
          } else {
            vnode = vm._vnode;
          }
        } finally {
          currentRenderingInstance = null;
        }
        // if the returned array contains only a single node, allow it
        if (Array.isArray(vnode) && vnode.length === 1) {
          vnode = vnode[0];
        }
        // return empty vnode in case the render function errored out
        if (!(vnode instanceof VNode)) {
          if (Array.isArray(vnode)) {
            warn(
              'Multiple root nodes returned from render function. Render function ' +
              'should return a single root node.',
              vm
            );
          }
          vnode = createEmptyVNode();
        }
        // set parent
        vnode.parent = _parentVnode;
        return vnode
      };
    }
  
    /*  */
  
    function ensureCtor (comp, base) {
      if (
        comp.__esModule ||
        (hasSymbol && comp[Symbol.toStringTag] === 'Module')
      ) {
        comp = comp.default;
      }
      return isObject(comp)
        ? base.extend(comp)
        : comp
    }
  
    function createAsyncPlaceholder (
      factory,
      data,
      context,
      children,
      tag
    ) {
      var node = createEmptyVNode();
      node.asyncFactory = factory;
      node.asyncMeta = { data: data, context: context, children: children, tag: tag };
      return node
    }
  
    function resolveAsyncComponent (
      factory,
      baseCtor
    ) {
      if (isTrue(factory.error) && isDef(factory.errorComp)) {
        return factory.errorComp
      }
  
      if (isDef(factory.resolved)) {
        return factory.resolved
      }
  
      var owner = currentRenderingInstance;
      if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
        // already pending
        factory.owners.push(owner);
      }
  
      if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
        return factory.loadingComp
      }
  
      if (owner && !isDef(factory.owners)) {
        var owners = factory.owners = [owner];
        var sync = true;
        var timerLoading = null;
        var timerTimeout = null
  
        ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });
  
        var forceRender = function (renderCompleted) {
          for (var i = 0, l = owners.length; i < l; i++) {
            (owners[i]).$forceUpdate();
          }
  
          if (renderCompleted) {
            owners.length = 0;
            if (timerLoading !== null) {
              clearTimeout(timerLoading);
              timerLoading = null;
            }
            if (timerTimeout !== null) {
              clearTimeout(timerTimeout);
              timerTimeout = null;
            }
          }
        };
  
        var resolve = once(function (res) {
          // cache resolved
          factory.resolved = ensureCtor(res, baseCtor);
          // invoke callbacks only if this is not a synchronous resolve
          // (async resolves are shimmed as synchronous during SSR)
          if (!sync) {
            forceRender(true);
          } else {
            owners.length = 0;
          }
        });
  
        var reject = once(function (reason) {
          warn(
            "Failed to resolve async component: " + (String(factory)) +
            (reason ? ("\nReason: " + reason) : '')
          );
          if (isDef(factory.errorComp)) {
            factory.error = true;
            forceRender(true);
          }
        });
  
        var res = factory(resolve, reject);
  
        if (isObject(res)) {
          if (isPromise(res)) {
            // () => Promise
            if (isUndef(factory.resolved)) {
              res.then(resolve, reject);
            }
          } else if (isPromise(res.component)) {
            res.component.then(resolve, reject);
  
            if (isDef(res.error)) {
              factory.errorComp = ensureCtor(res.error, baseCtor);
            }
  
            if (isDef(res.loading)) {
              factory.loadingComp = ensureCtor(res.loading, baseCtor);
              if (res.delay === 0) {
                factory.loading = true;
              } else {
                timerLoading = setTimeout(function () {
                  timerLoading = null;
                  if (isUndef(factory.resolved) && isUndef(factory.error)) {
                    factory.loading = true;
                    forceRender(false);
                  }
                }, res.delay || 200);
              }
            }
  
            if (isDef(res.timeout)) {
              timerTimeout = setTimeout(function () {
                timerTimeout = null;
                if (isUndef(factory.resolved)) {
                  reject(
                    "timeout (" + (res.timeout) + "ms)"
                  );
                }
              }, res.timeout);
            }
          }
        }
  
        sync = false;
        // return in case resolved synchronously
        return factory.loading
          ? factory.loadingComp
          : factory.resolved
      }
    }
  
    /*  */
  
    function isAsyncPlaceholder (node) {
      return node.isComment && node.asyncFactory
    }
  
    /*  */
  
    function getFirstComponentChild (children) {
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          var c = children[i];
          if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
            return c
          }
        }
      }
    }
  
    /*  */
  
    /*  */
  
    function initEvents (vm) {
      vm._events = Object.create(null);
      vm._hasHookEvent = false;
      // init parent attached events
      var listeners = vm.$options._parentListeners;
      if (listeners) {
        updateComponentListeners(vm, listeners);
      }
    }
  
    var target;
  
    function add (event, fn) {
      target.$on(event, fn);
    }
  
    function remove$1 (event, fn) {
      target.$off(event, fn);
    }
  
    function createOnceHandler (event, fn) {
      var _target = target;
      return function onceHandler () {
        var res = fn.apply(null, arguments);
        if (res !== null) {
          _target.$off(event, onceHandler);
        }
      }
    }
  
    function updateComponentListeners (
      vm,
      listeners,
      oldListeners
    ) {
      target = vm;
      updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
      target = undefined;
    }
  
    function eventsMixin (Vue) {
      var hookRE = /^hook:/;
      Vue.prototype.$on = function (event, fn) {
        var vm = this;
        if (Array.isArray(event)) {
          for (var i = 0, l = event.length; i < l; i++) {
            vm.$on(event[i], fn);
          }
        } else {
          (vm._events[event] || (vm._events[event] = [])).push(fn);
          // optimize hook:event cost by using a boolean flag marked at registration
          // instead of a hash lookup
          if (hookRE.test(event)) {
            vm._hasHookEvent = true;
          }
        }
        return vm
      };
  
      Vue.prototype.$once = function (event, fn) {
        var vm = this;
        function on () {
          vm.$off(event, on);
          fn.apply(vm, arguments);
        }
        on.fn = fn;
        vm.$on(event, on);
        return vm
      };
  
      Vue.prototype.$off = function (event, fn) {
        var vm = this;
        // all
        if (!arguments.length) {
          vm._events = Object.create(null);
          return vm
        }
        // array of events
        if (Array.isArray(event)) {
          for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
            vm.$off(event[i$1], fn);
          }
          return vm
        }
        // specific event
        var cbs = vm._events[event];
        if (!cbs) {
          return vm
        }
        if (!fn) {
          vm._events[event] = null;
          return vm
        }
        // specific handler
        var cb;
        var i = cbs.length;
        while (i--) {
          cb = cbs[i];
          if (cb === fn || cb.fn === fn) {
            cbs.splice(i, 1);
            break
          }
        }
        return vm
      };
  
      Vue.prototype.$emit = function (event) {
        var vm = this;
        {
          var lowerCaseEvent = event.toLowerCase();
          if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
            tip(
              "Event \"" + lowerCaseEvent + "\" is emitted in component " +
              (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
              "Note that HTML attributes are case-insensitive and you cannot use " +
              "v-on to listen to camelCase events when using in-DOM templates. " +
              "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
            );
          }
        }
        var cbs = vm._events[event];
        if (cbs) {
          cbs = cbs.length > 1 ? toArray(cbs) : cbs;
          var args = toArray(arguments, 1);
          var info = "event handler for \"" + event + "\"";
          for (var i = 0, l = cbs.length; i < l; i++) {
            invokeWithErrorHandling(cbs[i], vm, args, vm, info);
          }
        }
        return vm
      };
    }
  
    /*  */
  
    var activeInstance = null;
    var isUpdatingChildComponent = false;
  
    function setActiveInstance(vm) {
      var prevActiveInstance = activeInstance;
      activeInstance = vm;
      return function () {
        activeInstance = prevActiveInstance;
      }
    }
  
    function initLifecycle (vm) {
      var options = vm.$options;
  
      // locate first non-abstract parent
      var parent = options.parent;
      if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
          parent = parent.$parent;
        }
        parent.$children.push(vm);
      }
  
      vm.$parent = parent;
      vm.$root = parent ? parent.$root : vm;
  
      vm.$children = [];
      vm.$refs = {};
  
      vm._watcher = null;
      vm._inactive = null;
      vm._directInactive = false;
      vm._isMounted = false;
      vm._isDestroyed = false;
      vm._isBeingDestroyed = false;
    }
  
    function lifecycleMixin (Vue) {
      Vue.prototype._update = function (vnode, hydrating) {
        var vm = this;
        var prevEl = vm.$el;
        var prevVnode = vm._vnode;
        var restoreActiveInstance = setActiveInstance(vm);
        vm._vnode = vnode;
        // Vue.prototype.__patch__ is injected in entry points
        // based on the rendering backend used.
        if (!prevVnode) {
          // initial render
          vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
        } else {
          // updates
          vm.$el = vm.__patch__(prevVnode, vnode);
        }
        restoreActiveInstance();
        // update __vue__ reference
        if (prevEl) {
          prevEl.__vue__ = null;
        }
        if (vm.$el) {
          vm.$el.__vue__ = vm;
        }
        // if parent is an HOC, update its $el as well
        if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
          vm.$parent.$el = vm.$el;
        }
        // updated hook is called by the scheduler to ensure that children are
        // updated in a parent's updated hook.
      };
  
      Vue.prototype.$forceUpdate = function () {
        var vm = this;
        if (vm._watcher) {
          vm._watcher.update();
        }
      };
  
      Vue.prototype.$destroy = function () {
        var vm = this;
        if (vm._isBeingDestroyed) {
          return
        }
        callHook(vm, 'beforeDestroy');
        vm._isBeingDestroyed = true;
        // remove self from parent
        var parent = vm.$parent;
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
          remove(parent.$children, vm);
        }
        // teardown watchers
        if (vm._watcher) {
          vm._watcher.teardown();
        }
        var i = vm._watchers.length;
        while (i--) {
          vm._watchers[i].teardown();
        }
        // remove reference from data ob
        // frozen object may not have observer.
        if (vm._data.__ob__) {
          vm._data.__ob__.vmCount--;
        }
        // call the last hook...
        vm._isDestroyed = true;
        // invoke destroy hooks on current rendered tree
        vm.__patch__(vm._vnode, null);
        // fire destroyed hook
        callHook(vm, 'destroyed');
        // turn off all instance listeners.
        vm.$off();
        // remove __vue__ reference
        if (vm.$el) {
          vm.$el.__vue__ = null;
        }
        // release circular reference (#6759)
        if (vm.$vnode) {
          vm.$vnode.parent = null;
        }
      };
    }
  
    function mountComponent (
      vm,
      el,
      hydrating
    ) {
      vm.$el = el;
      if (!vm.$options.render) {
        vm.$options.render = createEmptyVNode;
        {
          /* istanbul ignore if */
          if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
            vm.$options.el || el) {
            warn(
              'You are using the runtime-only build of Vue where the template ' +
              'compiler is not available. Either pre-compile the templates into ' +
              'render functions, or use the compiler-included build.',
              vm
            );
          } else {
            warn(
              'Failed to mount component: template or render function not defined.',
              vm
            );
          }
        }
      }
      callHook(vm, 'beforeMount');
  
      var updateComponent;
      /* istanbul ignore if */
      if (config.performance && mark) {
        updateComponent = function () {
          var name = vm._name;
          var id = vm._uid;
          var startTag = "vue-perf-start:" + id;
          var endTag = "vue-perf-end:" + id;
  
          mark(startTag);
          var vnode = vm._render();
          mark(endTag);
          measure(("vue " + name + " render"), startTag, endTag);
  
          mark(startTag);
          vm._update(vnode, hydrating);
          mark(endTag);
          measure(("vue " + name + " patch"), startTag, endTag);
        };
      } else {
        updateComponent = function () {
          vm._update(vm._render(), hydrating);
        };
      }
  
      // we set this to vm._watcher inside the watcher's constructor
      // since the watcher's initial patch may call $forceUpdate (e.g. inside child
      // component's mounted hook), which relies on vm._watcher being already defined
      new Watcher(vm, updateComponent, noop, {
        before: function before () {
          if (vm._isMounted && !vm._isDestroyed) {
            callHook(vm, 'beforeUpdate');
          }
        }
      }, true /* isRenderWatcher */);
      hydrating = false;
  
      // manually mounted instance, call mounted on self
      // mounted is called for render-created child components in its inserted hook
      if (vm.$vnode == null) {
        vm._isMounted = true;
        callHook(vm, 'mounted');
      }
      return vm
    }
  
    function updateChildComponent (
      vm,
      propsData,
      listeners,
      parentVnode,
      renderChildren
    ) {
      {
        isUpdatingChildComponent = true;
      }
  
      // determine whether component has slot children
      // we need to do this before overwriting $options._renderChildren.
  
      // check if there are dynamic scopedSlots (hand-written or compiled but with
      // dynamic slot names). Static scoped slots compiled from template has the
      // "$stable" marker.
      var newScopedSlots = parentVnode.data.scopedSlots;
      var oldScopedSlots = vm.$scopedSlots;
      var hasDynamicScopedSlot = !!(
        (newScopedSlots && !newScopedSlots.$stable) ||
        (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
        (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
      );
  
      // Any static slot children from the parent may have changed during parent's
      // update. Dynamic scoped slots may also have changed. In such cases, a forced
      // update is necessary to ensure correctness.
      var needsForceUpdate = !!(
        renderChildren ||               // has new static slots
        vm.$options._renderChildren ||  // has old static slots
        hasDynamicScopedSlot
      );
  
      vm.$options._parentVnode = parentVnode;
      vm.$vnode = parentVnode; // update vm's placeholder node without re-render
  
      if (vm._vnode) { // update child tree's parent
        vm._vnode.parent = parentVnode;
      }
      vm.$options._renderChildren = renderChildren;
  
      // update $attrs and $listeners hash
      // these are also reactive so they may trigger child update if the child
      // used them during render
      vm.$attrs = parentVnode.data.attrs || emptyObject;
      vm.$listeners = listeners || emptyObject;
  
      // update props
      if (propsData && vm.$options.props) {
        toggleObserving(false);
        var props = vm._props;
        var propKeys = vm.$options._propKeys || [];
        for (var i = 0; i < propKeys.length; i++) {
          var key = propKeys[i];
          var propOptions = vm.$options.props; // wtf flow?
          props[key] = validateProp(key, propOptions, propsData, vm);
        }
        toggleObserving(true);
        // keep a copy of raw propsData
        vm.$options.propsData = propsData;
      }
  
      // update listeners
      listeners = listeners || emptyObject;
      var oldListeners = vm.$options._parentListeners;
      vm.$options._parentListeners = listeners;
      updateComponentListeners(vm, listeners, oldListeners);
  
      // resolve slots + force update if has children
      if (needsForceUpdate) {
        vm.$slots = resolveSlots(renderChildren, parentVnode.context);
        vm.$forceUpdate();
      }
  
      {
        isUpdatingChildComponent = false;
      }
    }
  
    function isInInactiveTree (vm) {
      while (vm && (vm = vm.$parent)) {
        if (vm._inactive) { return true }
      }
      return false
    }
  
    function activateChildComponent (vm, direct) {
      if (direct) {
        vm._directInactive = false;
        if (isInInactiveTree(vm)) {
          return
        }
      } else if (vm._directInactive) {
        return
      }
      if (vm._inactive || vm._inactive === null) {
        vm._inactive = false;
        for (var i = 0; i < vm.$children.length; i++) {
          activateChildComponent(vm.$children[i]);
        }
        callHook(vm, 'activated');
      }
    }
  
    function deactivateChildComponent (vm, direct) {
      if (direct) {
        vm._directInactive = true;
        if (isInInactiveTree(vm)) {
          return
        }
      }
      if (!vm._inactive) {
        vm._inactive = true;
        for (var i = 0; i < vm.$children.length; i++) {
          deactivateChildComponent(vm.$children[i]);
        }
        callHook(vm, 'deactivated');
      }
    }
  
    function callHook (vm, hook) {
      // #7573 disable dep collection when invoking lifecycle hooks
      pushTarget();
      var handlers = vm.$options[hook];
      var info = hook + " hook";
      if (handlers) {
        for (var i = 0, j = handlers.length; i < j; i++) {
          invokeWithErrorHandling(handlers[i], vm, null, vm, info);
        }
      }
      if (vm._hasHookEvent) {
        vm.$emit('hook:' + hook);
      }
      popTarget();
    }
  
    /*  */
  
    var MAX_UPDATE_COUNT = 100;
  
    var queue = [];
    var activatedChildren = [];
    var has = {};
    var circular = {};
    var waiting = false;
    var flushing = false;
    var index = 0;
  
    /**
     * Reset the scheduler's state.
     */
    function resetSchedulerState () {
      index = queue.length = activatedChildren.length = 0;
      has = {};
      {
        circular = {};
      }
      waiting = flushing = false;
    }
  
    // Async edge case #6566 requires saving the timestamp when event listeners are
    // attached. However, calling performance.now() has a perf overhead especially
    // if the page has thousands of event listeners. Instead, we take a timestamp
    // every time the scheduler flushes and use that for all event listeners
    // attached during that flush.
    var currentFlushTimestamp = 0;
  
    // Async edge case fix requires storing an event listener's attach timestamp.
    var getNow = Date.now;
  
    // Determine what event timestamp the browser is using. Annoyingly, the
    // timestamp can either be hi-res (relative to page load) or low-res
    // (relative to UNIX epoch), so in order to compare time we have to use the
    // same timestamp type when saving the flush timestamp.
    // All IE versions use low-res event timestamps, and have problematic clock
    // implementations (#9632)
    if (inBrowser && !isIE) {
      var performance = window.performance;
      if (
        performance &&
        typeof performance.now === 'function' &&
        getNow() > document.createEvent('Event').timeStamp
      ) {
        // if the event timestamp, although evaluated AFTER the Date.now(), is
        // smaller than it, it means the event is using a hi-res timestamp,
        // and we need to use the hi-res version for event listener timestamps as
        // well.
        getNow = function () { return performance.now(); };
      }
    }
  
    /**
     * Flush both queues and run the watchers.
     */
    function flushSchedulerQueue () {
      currentFlushTimestamp = getNow();
      flushing = true;
      var watcher, id;
  
      // Sort queue before flush.
      // This ensures that:
      // 1. Components are updated from parent to child. (because parent is always
      //    created before the child)
      // 2. A component's user watchers are run before its render watcher (because
      //    user watchers are created before the render watcher)
      // 3. If a component is destroyed during a parent component's watcher run,
      //    its watchers can be skipped.
      queue.sort(function (a, b) { return a.id - b.id; });
  
      // do not cache length because more watchers might be pushed
      // as we run existing watchers
      for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        if (watcher.before) {
          watcher.before();
        }
        id = watcher.id;
        has[id] = null;
        watcher.run();
        // in dev build, check and stop circular updates.
        if (has[id] != null) {
          circular[id] = (circular[id] || 0) + 1;
          if (circular[id] > MAX_UPDATE_COUNT) {
            warn(
              'You may have an infinite update loop ' + (
                watcher.user
                  ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                  : "in a component render function."
              ),
              watcher.vm
            );
            break
          }
        }
      }
  
      // keep copies of post queues before resetting state
      var activatedQueue = activatedChildren.slice();
      var updatedQueue = queue.slice();
  
      resetSchedulerState();
  
      // call component updated and activated hooks
      callActivatedHooks(activatedQueue);
      callUpdatedHooks(updatedQueue);
  
      // devtool hook
      /* istanbul ignore if */
      if (devtools && config.devtools) {
        devtools.emit('flush');
      }
    }
  
    function callUpdatedHooks (queue) {
      var i = queue.length;
      while (i--) {
        var watcher = queue[i];
        var vm = watcher.vm;
        if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'updated');
        }
      }
    }
  
    /**
     * Queue a kept-alive component that was activated during patch.
     * The queue will be processed after the entire tree has been patched.
     */
    function queueActivatedComponent (vm) {
      // setting _inactive to false here so that a render function can
      // rely on checking whether it's in an inactive tree (e.g. router-view)
      vm._inactive = false;
      activatedChildren.push(vm);
    }
  
    function callActivatedHooks (queue) {
      for (var i = 0; i < queue.length; i++) {
        queue[i]._inactive = true;
        activateChildComponent(queue[i], true /* true */);
      }
    }
  
    /**
     * Push a watcher into the watcher queue.
     * Jobs with duplicate IDs will be skipped unless it's
     * pushed when the queue is being flushed.
     */
    function queueWatcher (watcher) {
      var id = watcher.id;
      if (has[id] == null) {
        has[id] = true;
        if (!flushing) {
          queue.push(watcher);
        } else {
          // if already flushing, splice the watcher based on its id
          // if already past its id, it will be run next immediately.
          var i = queue.length - 1;
          while (i > index && queue[i].id > watcher.id) {
            i--;
          }
          queue.splice(i + 1, 0, watcher);
        }
        // queue the flush
        if (!waiting) {
          waiting = true;
  
          if (!config.async) {
            flushSchedulerQueue();
            return
          }
          nextTick(flushSchedulerQueue);
        }
      }
    }
  
    /*  */
  
  
  
    var uid$2 = 0;
  
    /**
     * A watcher parses an expression, collects dependencies,
     * and fires callback when the expression value changes.
     * This is used for both the $watch() api and directives.
     */
    var Watcher = function Watcher (
      vm,
      expOrFn,
      cb,
      options,
      isRenderWatcher
    ) {
      this.vm = vm;
      if (isRenderWatcher) {
        vm._watcher = this;
      }
      vm._watchers.push(this);
      // options
      if (options) {
        this.deep = !!options.deep;
        this.user = !!options.user;
        this.lazy = !!options.lazy;
        this.sync = !!options.sync;
        this.before = options.before;
      } else {
        this.deep = this.user = this.lazy = this.sync = false;
      }
      this.cb = cb;
      this.id = ++uid$2; // uid for batching
      this.active = true;
      this.dirty = this.lazy; // for lazy watchers
      this.deps = [];
      this.newDeps = [];
      this.depIds = new _Set();
      this.newDepIds = new _Set();
      this.expression = expOrFn.toString();
      // parse expression for getter
      if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
      } else {
        this.getter = parsePath(expOrFn);
        if (!this.getter) {
          this.getter = noop;
          warn(
            "Failed watching path: \"" + expOrFn + "\" " +
            'Watcher only accepts simple dot-delimited paths. ' +
            'For full control, use a function instead.',
            vm
          );
        }
      }
      this.value = this.lazy
        ? undefined
        : this.get();
    };
  
    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    Watcher.prototype.get = function get () {
      pushTarget(this);
      var value;
      var vm = this.vm;
      try {
        value = this.getter.call(vm, vm);
      } catch (e) {
        if (this.user) {
          handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
        } else {
          throw e
        }
      } finally {
        // "touch" every property so they are all tracked as
        // dependencies for deep watching
        if (this.deep) {
          traverse(value);
        }
        popTarget();
        this.cleanupDeps();
      }
      return value
    };
  
    /**
     * Add a dependency to this directive.
     */
    Watcher.prototype.addDep = function addDep (dep) {
      var id = dep.id;
      if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if (!this.depIds.has(id)) {
          dep.addSub(this);
        }
      }
    };
  
    /**
     * Clean up for dependency collection.
     */
    Watcher.prototype.cleanupDeps = function cleanupDeps () {
      var i = this.deps.length;
      while (i--) {
        var dep = this.deps[i];
        if (!this.newDepIds.has(dep.id)) {
          dep.removeSub(this);
        }
      }
      var tmp = this.depIds;
      this.depIds = this.newDepIds;
      this.newDepIds = tmp;
      this.newDepIds.clear();
      tmp = this.deps;
      this.deps = this.newDeps;
      this.newDeps = tmp;
      this.newDeps.length = 0;
    };
  
    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    Watcher.prototype.update = function update () {
      /* istanbul ignore else */
      if (this.lazy) {
        this.dirty = true;
      } else if (this.sync) {
        this.run();
      } else {
        queueWatcher(this);
      }
    };
  
    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    Watcher.prototype.run = function run () {
      if (this.active) {
        var value = this.get();
        if (
          value !== this.value ||
          // Deep watchers and watchers on Object/Arrays should fire even
          // when the value is the same, because the value may
          // have mutated.
          isObject(value) ||
          this.deep
        ) {
          // set new value
          var oldValue = this.value;
          this.value = value;
          if (this.user) {
            try {
              this.cb.call(this.vm, value, oldValue);
            } catch (e) {
              handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
            }
          } else {
            this.cb.call(this.vm, value, oldValue);
          }
        }
      }
    };
  
    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    Watcher.prototype.evaluate = function evaluate () {
      this.value = this.get();
      this.dirty = false;
    };
  
    /**
     * Depend on all deps collected by this watcher.
     */
    Watcher.prototype.depend = function depend () {
      var i = this.deps.length;
      while (i--) {
        this.deps[i].depend();
      }
    };
  
    /**
     * Remove self from all dependencies' subscriber list.
     */
    Watcher.prototype.teardown = function teardown () {
      if (this.active) {
        // remove self from vm's watcher list
        // this is a somewhat expensive operation so we skip it
        // if the vm is being destroyed.
        if (!this.vm._isBeingDestroyed) {
          remove(this.vm._watchers, this);
        }
        var i = this.deps.length;
        while (i--) {
          this.deps[i].removeSub(this);
        }
        this.active = false;
      }
    };
  
    /*  */
  
    var sharedPropertyDefinition = {
      enumerable: true,
      configurable: true,
      get: noop,
      set: noop
    };
  
    function proxy (target, sourceKey, key) {
      sharedPropertyDefinition.get = function proxyGetter () {
        return this[sourceKey][key]
      };
      sharedPropertyDefinition.set = function proxySetter (val) {
        this[sourceKey][key] = val;
      };
      Object.defineProperty(target, key, sharedPropertyDefinition);
    }
  
    function initState (vm) {
      vm._watchers = [];
      var opts = vm.$options;
      if (opts.props) { initProps(vm, opts.props); }
      if (opts.methods) { initMethods(vm, opts.methods); }
      if (opts.data) {
        initData(vm);
      } else {
        observe(vm._data = {}, true /* asRootData */);
      }
      if (opts.computed) { initComputed(vm, opts.computed); }
      if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch);
      }
    }
  
    function initProps (vm, propsOptions) {
      var propsData = vm.$options.propsData || {};
      var props = vm._props = {};
      // cache prop keys so that future props updates can iterate using Array
      // instead of dynamic object key enumeration.
      var keys = vm.$options._propKeys = [];
      var isRoot = !vm.$parent;
      // root instance props should be converted
      if (!isRoot) {
        toggleObserving(false);
      }
      var loop = function ( key ) {
        keys.push(key);
        var value = validateProp(key, propsOptions, propsData, vm);
        /* istanbul ignore else */
        {
          var hyphenatedKey = hyphenate(key);
          if (isReservedAttribute(hyphenatedKey) ||
              config.isReservedAttr(hyphenatedKey)) {
            warn(
              ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
              vm
            );
          }
          defineReactive$$1(props, key, value, function () {
            if (!isRoot && !isUpdatingChildComponent) {
              warn(
                "Avoid mutating a prop directly since the value will be " +
                "overwritten whenever the parent component re-renders. " +
                "Instead, use a data or computed property based on the prop's " +
                "value. Prop being mutated: \"" + key + "\"",
                vm
              );
            }
          });
        }
        // static props are already proxied on the component's prototype
        // during Vue.extend(). We only need to proxy props defined at
        // instantiation here.
        if (!(key in vm)) {
          proxy(vm, "_props", key);
        }
      };
  
      for (var key in propsOptions) loop( key );
      toggleObserving(true);
    }
  
    function initData (vm) {
      var data = vm.$options.data;
      data = vm._data = typeof data === 'function'
        ? getData(data, vm)
        : data || {};
      if (!isPlainObject(data)) {
        data = {};
        warn(
          'data functions should return an object:\n' +
          'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
          vm
        );
      }
      // proxy data on instance
      var keys = Object.keys(data);
      var props = vm.$options.props;
      var methods = vm.$options.methods;
      var i = keys.length;
      while (i--) {
        var key = keys[i];
        {
          if (methods && hasOwn(methods, key)) {
            warn(
              ("Method \"" + key + "\" has already been defined as a data property."),
              vm
            );
          }
        }
        if (props && hasOwn(props, key)) {
          warn(
            "The data property \"" + key + "\" is already declared as a prop. " +
            "Use prop default value instead.",
            vm
          );
        } else if (!isReserved(key)) {
          proxy(vm, "_data", key);
        }
      }
      // observe data
      observe(data, true /* asRootData */);
    }
  
    function getData (data, vm) {
      // #7573 disable dep collection when invoking data getters
      pushTarget();
      try {
        return data.call(vm, vm)
      } catch (e) {
        handleError(e, vm, "data()");
        return {}
      } finally {
        popTarget();
      }
    }
  
    var computedWatcherOptions = { lazy: true };
  
    function initComputed (vm, computed) {
      // $flow-disable-line
      var watchers = vm._computedWatchers = Object.create(null);
      // computed properties are just getters during SSR
      var isSSR = isServerRendering();
  
      for (var key in computed) {
        var userDef = computed[key];
        var getter = typeof userDef === 'function' ? userDef : userDef.get;
        if (getter == null) {
          warn(
            ("Getter is missing for computed property \"" + key + "\"."),
            vm
          );
        }
  
        if (!isSSR) {
          // create internal watcher for the computed property.
          watchers[key] = new Watcher(
            vm,
            getter || noop,
            noop,
            computedWatcherOptions
          );
        }
  
        // component-defined computed properties are already defined on the
        // component prototype. We only need to define computed properties defined
        // at instantiation here.
        if (!(key in vm)) {
          defineComputed(vm, key, userDef);
        } else {
          if (key in vm.$data) {
            warn(("The computed property \"" + key + "\" is already defined in data."), vm);
          } else if (vm.$options.props && key in vm.$options.props) {
            warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
          }
        }
      }
    }
  
    function defineComputed (
      target,
      key,
      userDef
    ) {
      var shouldCache = !isServerRendering();
      if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = shouldCache
          ? createComputedGetter(key)
          : createGetterInvoker(userDef);
        sharedPropertyDefinition.set = noop;
      } else {
        sharedPropertyDefinition.get = userDef.get
          ? shouldCache && userDef.cache !== false
            ? createComputedGetter(key)
            : createGetterInvoker(userDef.get)
          : noop;
        sharedPropertyDefinition.set = userDef.set || noop;
      }
      if (sharedPropertyDefinition.set === noop) {
        sharedPropertyDefinition.set = function () {
          warn(
            ("Computed property \"" + key + "\" was assigned to but it has no setter."),
            this
          );
        };
      }
      Object.defineProperty(target, key, sharedPropertyDefinition);
    }
  
    function createComputedGetter (key) {
      return function computedGetter () {
        var watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
          if (watcher.dirty) {
            watcher.evaluate();
          }
          if (Dep.target) {
            watcher.depend();
          }
          return watcher.value
        }
      }
    }
  
    function createGetterInvoker(fn) {
      return function computedGetter () {
        return fn.call(this, this)
      }
    }
  
    function initMethods (vm, methods) {
      var props = vm.$options.props;
      for (var key in methods) {
        {
          if (typeof methods[key] !== 'function') {
            warn(
              "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
              "Did you reference the function correctly?",
              vm
            );
          }
          if (props && hasOwn(props, key)) {
            warn(
              ("Method \"" + key + "\" has already been defined as a prop."),
              vm
            );
          }
          if ((key in vm) && isReserved(key)) {
            warn(
              "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
              "Avoid defining component methods that start with _ or $."
            );
          }
        }
        vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
      }
    }
  
    function initWatch (vm, watch) {
      for (var key in watch) {
        var handler = watch[key];
        if (Array.isArray(handler)) {
          for (var i = 0; i < handler.length; i++) {
            createWatcher(vm, key, handler[i]);
          }
        } else {
          createWatcher(vm, key, handler);
        }
      }
    }
  
    function createWatcher (
      vm,
      expOrFn,
      handler,
      options
    ) {
      if (isPlainObject(handler)) {
        options = handler;
        handler = handler.handler;
      }
      if (typeof handler === 'string') {
        handler = vm[handler];
      }
      return vm.$watch(expOrFn, handler, options)
    }
  
    function stateMixin (Vue) {
      // flow somehow has problems with directly declared definition object
      // when using Object.defineProperty, so we have to procedurally build up
      // the object here.
      var dataDef = {};
      dataDef.get = function () { return this._data };
      var propsDef = {};
      propsDef.get = function () { return this._props };
      {
        dataDef.set = function () {
          warn(
            'Avoid replacing instance root $data. ' +
            'Use nested data properties instead.',
            this
          );
        };
        propsDef.set = function () {
          warn("$props is readonly.", this);
        };
      }
      Object.defineProperty(Vue.prototype, '$data', dataDef);
      Object.defineProperty(Vue.prototype, '$props', propsDef);
  
      Vue.prototype.$set = set;
      Vue.prototype.$delete = del;
  
      Vue.prototype.$watch = function (
        expOrFn,
        cb,
        options
      ) {
        var vm = this;
        if (isPlainObject(cb)) {
          return createWatcher(vm, expOrFn, cb, options)
        }
        options = options || {};
        options.user = true;
        var watcher = new Watcher(vm, expOrFn, cb, options);
        if (options.immediate) {
          try {
            cb.call(vm, watcher.value);
          } catch (error) {
            handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
          }
        }
        return function unwatchFn () {
          watcher.teardown();
        }
      };
    }
  
    /*  */
  
    var uid$3 = 0;
  
    function initMixin (Vue) {
      Vue.prototype._init = function (options) {
        var vm = this;
        // a uid
        vm._uid = uid$3++;
  
        var startTag, endTag;
        /* istanbul ignore if */
        if (config.performance && mark) {
          startTag = "vue-perf-start:" + (vm._uid);
          endTag = "vue-perf-end:" + (vm._uid);
          mark(startTag);
        }
  
        // a flag to avoid this being observed
        vm._isVue = true;
        // merge options
        if (options && options._isComponent) {
          // optimize internal component instantiation
          // since dynamic options merging is pretty slow, and none of the
          // internal component options needs special treatment.
          initInternalComponent(vm, options);
        } else {
          vm.$options = mergeOptions(
            resolveConstructorOptions(vm.constructor),
            options || {},
            vm
          );
        }
        /* istanbul ignore else */
        {
          initProxy(vm);
        }
        // expose real self
        vm._self = vm;
        initLifecycle(vm);
        initEvents(vm);
        initRender(vm);
        callHook(vm, 'beforeCreate');
        initInjections(vm); // resolve injections before data/props
        initState(vm);
        initProvide(vm); // resolve provide after data/props
        callHook(vm, 'created');
  
        /* istanbul ignore if */
        if (config.performance && mark) {
          vm._name = formatComponentName(vm, false);
          mark(endTag);
          measure(("vue " + (vm._name) + " init"), startTag, endTag);
        }
  
        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      };
    }
  
    function initInternalComponent (vm, options) {
      var opts = vm.$options = Object.create(vm.constructor.options);
      // doing this because it's faster than dynamic enumeration.
      var parentVnode = options._parentVnode;
      opts.parent = options.parent;
      opts._parentVnode = parentVnode;
  
      var vnodeComponentOptions = parentVnode.componentOptions;
      opts.propsData = vnodeComponentOptions.propsData;
      opts._parentListeners = vnodeComponentOptions.listeners;
      opts._renderChildren = vnodeComponentOptions.children;
      opts._componentTag = vnodeComponentOptions.tag;
  
      if (options.render) {
        opts.render = options.render;
        opts.staticRenderFns = options.staticRenderFns;
      }
    }
  
    function resolveConstructorOptions (Ctor) {
      var options = Ctor.options;
      if (Ctor.super) {
        var superOptions = resolveConstructorOptions(Ctor.super);
        var cachedSuperOptions = Ctor.superOptions;
        if (superOptions !== cachedSuperOptions) {
          // super option changed,
          // need to resolve new options.
          Ctor.superOptions = superOptions;
          // check if there are any late-modified/attached options (#4976)
          var modifiedOptions = resolveModifiedOptions(Ctor);
          // update base extend options
          if (modifiedOptions) {
            extend(Ctor.extendOptions, modifiedOptions);
          }
          options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
          if (options.name) {
            options.components[options.name] = Ctor;
          }
        }
      }
      return options
    }
  
    function resolveModifiedOptions (Ctor) {
      var modified;
      var latest = Ctor.options;
      var sealed = Ctor.sealedOptions;
      for (var key in latest) {
        if (latest[key] !== sealed[key]) {
          if (!modified) { modified = {}; }
          modified[key] = latest[key];
        }
      }
      return modified
    }
  
    function Vue (options) {
      if (!(this instanceof Vue)
      ) {
        warn('Vue is a constructor and should be called with the `new` keyword');
      }
      this._init(options);
    }
  
    initMixin(Vue);
    stateMixin(Vue);
    eventsMixin(Vue);
    lifecycleMixin(Vue);
    renderMixin(Vue);
  
    /*  */
  
    function initUse (Vue) {
      Vue.use = function (plugin) {
        var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
        if (installedPlugins.indexOf(plugin) > -1) {
          return this
        }
  
        // additional parameters
        var args = toArray(arguments, 1);
        args.unshift(this);
        if (typeof plugin.install === 'function') {
          plugin.install.apply(plugin, args);
        } else if (typeof plugin === 'function') {
          plugin.apply(null, args);
        }
        installedPlugins.push(plugin);
        return this
      };
    }
  
    /*  */
  
    function initMixin$1 (Vue) {
      Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this
      };
    }
  
    /*  */
  
    function initExtend (Vue) {
      /**
       * Each instance constructor, including Vue, has a unique
       * cid. This enables us to create wrapped "child
       * constructors" for prototypal inheritance and cache them.
       */
      Vue.cid = 0;
      var cid = 1;
  
      /**
       * Class inheritance
       */
      Vue.extend = function (extendOptions) {
        extendOptions = extendOptions || {};
        var Super = this;
        var SuperId = Super.cid;
        var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
        if (cachedCtors[SuperId]) {
          return cachedCtors[SuperId]
        }
  
        var name = extendOptions.name || Super.options.name;
        if (name) {
          validateComponentName(name);
        }
  
        var Sub = function VueComponent (options) {
          this._init(options);
        };
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.cid = cid++;
        Sub.options = mergeOptions(
          Super.options,
          extendOptions
        );
        Sub['super'] = Super;
  
        // For props and computed properties, we define the proxy getters on
        // the Vue instances at extension time, on the extended prototype. This
        // avoids Object.defineProperty calls for each instance created.
        if (Sub.options.props) {
          initProps$1(Sub);
        }
        if (Sub.options.computed) {
          initComputed$1(Sub);
        }
  
        // allow further extension/mixin/plugin usage
        Sub.extend = Super.extend;
        Sub.mixin = Super.mixin;
        Sub.use = Super.use;
  
        // create asset registers, so extended classes
        // can have their private assets too.
        ASSET_TYPES.forEach(function (type) {
          Sub[type] = Super[type];
        });
        // enable recursive self-lookup
        if (name) {
          Sub.options.components[name] = Sub;
        }
  
        // keep a reference to the super options at extension time.
        // later at instantiation we can check if Super's options have
        // been updated.
        Sub.superOptions = Super.options;
        Sub.extendOptions = extendOptions;
        Sub.sealedOptions = extend({}, Sub.options);
  
        // cache constructor
        cachedCtors[SuperId] = Sub;
        return Sub
      };
    }
  
    function initProps$1 (Comp) {
      var props = Comp.options.props;
      for (var key in props) {
        proxy(Comp.prototype, "_props", key);
      }
    }
  
    function initComputed$1 (Comp) {
      var computed = Comp.options.computed;
      for (var key in computed) {
        defineComputed(Comp.prototype, key, computed[key]);
      }
    }
  
    /*  */
  
    function initAssetRegisters (Vue) {
      /**
       * Create asset registration methods.
       */
      ASSET_TYPES.forEach(function (type) {
        Vue[type] = function (
          id,
          definition
        ) {
          if (!definition) {
            return this.options[type + 's'][id]
          } else {
            /* istanbul ignore if */
            if (type === 'component') {
              validateComponentName(id);
            }
            if (type === 'component' && isPlainObject(definition)) {
              definition.name = definition.name || id;
              definition = this.options._base.extend(definition);
            }
            if (type === 'directive' && typeof definition === 'function') {
              definition = { bind: definition, update: definition };
            }
            this.options[type + 's'][id] = definition;
            return definition
          }
        };
      });
    }
  
    /*  */
  
  
  
    function getComponentName (opts) {
      return opts && (opts.Ctor.options.name || opts.tag)
    }
  
    function matches (pattern, name) {
      if (Array.isArray(pattern)) {
        return pattern.indexOf(name) > -1
      } else if (typeof pattern === 'string') {
        return pattern.split(',').indexOf(name) > -1
      } else if (isRegExp(pattern)) {
        return pattern.test(name)
      }
      /* istanbul ignore next */
      return false
    }
  
    function pruneCache (keepAliveInstance, filter) {
      var cache = keepAliveInstance.cache;
      var keys = keepAliveInstance.keys;
      var _vnode = keepAliveInstance._vnode;
      for (var key in cache) {
        var cachedNode = cache[key];
        if (cachedNode) {
          var name = getComponentName(cachedNode.componentOptions);
          if (name && !filter(name)) {
            pruneCacheEntry(cache, key, keys, _vnode);
          }
        }
      }
    }
  
    function pruneCacheEntry (
      cache,
      key,
      keys,
      current
    ) {
      var cached$$1 = cache[key];
      if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
        cached$$1.componentInstance.$destroy();
      }
      cache[key] = null;
      remove(keys, key);
    }
  
    var patternTypes = [String, RegExp, Array];
  
    var KeepAlive = {
      name: 'keep-alive',
      abstract: true,
  
      props: {
        include: patternTypes,
        exclude: patternTypes,
        max: [String, Number]
      },
  
      created: function created () {
        this.cache = Object.create(null);
        this.keys = [];
      },
  
      destroyed: function destroyed () {
        for (var key in this.cache) {
          pruneCacheEntry(this.cache, key, this.keys);
        }
      },
  
      mounted: function mounted () {
        var this$1 = this;
  
        this.$watch('include', function (val) {
          pruneCache(this$1, function (name) { return matches(val, name); });
        });
        this.$watch('exclude', function (val) {
          pruneCache(this$1, function (name) { return !matches(val, name); });
        });
      },
  
      render: function render () {
        var slot = this.$slots.default;
        var vnode = getFirstComponentChild(slot);
        var componentOptions = vnode && vnode.componentOptions;
        if (componentOptions) {
          // check pattern
          var name = getComponentName(componentOptions);
          var ref = this;
          var include = ref.include;
          var exclude = ref.exclude;
          if (
            // not included
            (include && (!name || !matches(include, name))) ||
            // excluded
            (exclude && name && matches(exclude, name))
          ) {
            return vnode
          }
  
          var ref$1 = this;
          var cache = ref$1.cache;
          var keys = ref$1.keys;
          var key = vnode.key == null
            // same constructor may get registered as different local components
            // so cid alone is not enough (#3269)
            ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
            : vnode.key;
          if (cache[key]) {
            vnode.componentInstance = cache[key].componentInstance;
            // make current key freshest
            remove(keys, key);
            keys.push(key);
          } else {
            cache[key] = vnode;
            keys.push(key);
            // prune oldest entry
            if (this.max && keys.length > parseInt(this.max)) {
              pruneCacheEntry(cache, keys[0], keys, this._vnode);
            }
          }
  
          vnode.data.keepAlive = true;
        }
        return vnode || (slot && slot[0])
      }
    };
  
    var builtInComponents = {
      KeepAlive: KeepAlive
    };
  
    /*  */
  
    function initGlobalAPI (Vue) {
      // config
      var configDef = {};
      configDef.get = function () { return config; };
      {
        configDef.set = function () {
          warn(
            'Do not replace the Vue.config object, set individual fields instead.'
          );
        };
      }
      Object.defineProperty(Vue, 'config', configDef);
  
      // exposed util methods.
      // NOTE: these are not considered part of the public API - avoid relying on
      // them unless you are aware of the risk.
      Vue.util = {
        warn: warn,
        extend: extend,
        mergeOptions: mergeOptions,
        defineReactive: defineReactive$$1
      };
  
      Vue.set = set;
      Vue.delete = del;
      Vue.nextTick = nextTick;
  
      // 2.6 explicit observable API
      Vue.observable = function (obj) {
        observe(obj);
        return obj
      };
  
      Vue.options = Object.create(null);
      ASSET_TYPES.forEach(function (type) {
        Vue.options[type + 's'] = Object.create(null);
      });
  
      // this is used to identify the "base" constructor to extend all plain-object
      // components with in Weex's multi-instance scenarios.
      Vue.options._base = Vue;
  
      extend(Vue.options.components, builtInComponents);
  
      initUse(Vue);
      initMixin$1(Vue);
      initExtend(Vue);
      initAssetRegisters(Vue);
    }
  
    initGlobalAPI(Vue);
  
    Object.defineProperty(Vue.prototype, '$isServer', {
      get: isServerRendering
    });
  
    Object.defineProperty(Vue.prototype, '$ssrContext', {
      get: function get () {
        /* istanbul ignore next */
        return this.$vnode && this.$vnode.ssrContext
      }
    });
  
    // expose FunctionalRenderContext for ssr runtime helper installation
    Object.defineProperty(Vue, 'FunctionalRenderContext', {
      value: FunctionalRenderContext
    });
  
    Vue.version = '2.6.11';
  
    /*  */
  
    // these are reserved for web because they are directly compiled away
    // during template compilation
    var isReservedAttr = makeMap('style,class');
  
    // attributes that should be using props for binding
    var acceptValue = makeMap('input,textarea,option,select,progress');
    var mustUseProp = function (tag, type, attr) {
      return (
        (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
        (attr === 'selected' && tag === 'option') ||
        (attr === 'checked' && tag === 'input') ||
        (attr === 'muted' && tag === 'video')
      )
    };
  
    var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
  
    var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');
  
    var convertEnumeratedValue = function (key, value) {
      return isFalsyAttrValue(value) || value === 'false'
        ? 'false'
        // allow arbitrary string value for contenteditable
        : key === 'contenteditable' && isValidContentEditableValue(value)
          ? value
          : 'true'
    };
  
    var isBooleanAttr = makeMap(
      'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
      'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
      'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
      'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
      'required,reversed,scoped,seamless,selected,sortable,translate,' +
      'truespeed,typemustmatch,visible'
    );
  
    var xlinkNS = 'http://www.w3.org/1999/xlink';
  
    var isXlink = function (name) {
      return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
    };
  
    var getXlinkProp = function (name) {
      return isXlink(name) ? name.slice(6, name.length) : ''
    };
  
    var isFalsyAttrValue = function (val) {
      return val == null || val === false
    };
  
    /*  */
  
    function genClassForVnode (vnode) {
      var data = vnode.data;
      var parentNode = vnode;
      var childNode = vnode;
      while (isDef(childNode.componentInstance)) {
        childNode = childNode.componentInstance._vnode;
        if (childNode && childNode.data) {
          data = mergeClassData(childNode.data, data);
        }
      }
      while (isDef(parentNode = parentNode.parent)) {
        if (parentNode && parentNode.data) {
          data = mergeClassData(data, parentNode.data);
        }
      }
      return renderClass(data.staticClass, data.class)
    }
  
    function mergeClassData (child, parent) {
      return {
        staticClass: concat(child.staticClass, parent.staticClass),
        class: isDef(child.class)
          ? [child.class, parent.class]
          : parent.class
      }
    }
  
    function renderClass (
      staticClass,
      dynamicClass
    ) {
      if (isDef(staticClass) || isDef(dynamicClass)) {
        return concat(staticClass, stringifyClass(dynamicClass))
      }
      /* istanbul ignore next */
      return ''
    }
  
    function concat (a, b) {
      return a ? b ? (a + ' ' + b) : a : (b || '')
    }
  
    function stringifyClass (value) {
      if (Array.isArray(value)) {
        return stringifyArray(value)
      }
      if (isObject(value)) {
        return stringifyObject(value)
      }
      if (typeof value === 'string') {
        return value
      }
      /* istanbul ignore next */
      return ''
    }
  
    function stringifyArray (value) {
      var res = '';
      var stringified;
      for (var i = 0, l = value.length; i < l; i++) {
        if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
          if (res) { res += ' '; }
          res += stringified;
        }
      }
      return res
    }
  
    function stringifyObject (value) {
      var res = '';
      for (var key in value) {
        if (value[key]) {
          if (res) { res += ' '; }
          res += key;
        }
      }
      return res
    }
  
    /*  */
  
    var namespaceMap = {
      svg: 'http://www.w3.org/2000/svg',
      math: 'http://www.w3.org/1998/Math/MathML'
    };
  
    var isHTMLTag = makeMap(
      'html,body,base,head,link,meta,style,title,' +
      'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
      'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
      'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
      's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
      'embed,object,param,source,canvas,script,noscript,del,ins,' +
      'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
      'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
      'output,progress,select,textarea,' +
      'details,dialog,menu,menuitem,summary,' +
      'content,element,shadow,template,blockquote,iframe,tfoot'
    );
  
    // this map is intentionally selective, only covering SVG elements that may
    // contain child elements.
    var isSVG = makeMap(
      'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
      'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
      'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
      true
    );
  
    var isPreTag = function (tag) { return tag === 'pre'; };
  
    var isReservedTag = function (tag) {
      return isHTMLTag(tag) || isSVG(tag)
    };
  
    function getTagNamespace (tag) {
      if (isSVG(tag)) {
        return 'svg'
      }
      // basic support for MathML
      // note it doesn't support other MathML elements being component roots
      if (tag === 'math') {
        return 'math'
      }
    }
  
    var unknownElementCache = Object.create(null);
    function isUnknownElement (tag) {
      /* istanbul ignore if */
      if (!inBrowser) {
        return true
      }
      if (isReservedTag(tag)) {
        return false
      }
      tag = tag.toLowerCase();
      /* istanbul ignore if */
      if (unknownElementCache[tag] != null) {
        return unknownElementCache[tag]
      }
      var el = document.createElement(tag);
      if (tag.indexOf('-') > -1) {
        // http://stackoverflow.com/a/28210364/1070244
        return (unknownElementCache[tag] = (
          el.constructor === window.HTMLUnknownElement ||
          el.constructor === window.HTMLElement
        ))
      } else {
        return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
      }
    }
  
    var isTextInputType = makeMap('text,number,password,search,email,tel,url');
  
    /*  */
  
    /**
     * Query an element selector if it's not an element already.
     */
    function query (el) {
      if (typeof el === 'string') {
        var selected = document.querySelector(el);
        if (!selected) {
          warn(
            'Cannot find element: ' + el
          );
          return document.createElement('div')
        }
        return selected
      } else {
        return el
      }
    }
  
    /*  */
  
    function createElement$1 (tagName, vnode) {
      var elm = document.createElement(tagName);
      if (tagName !== 'select') {
        return elm
      }
      // false or null will remove the attribute but undefined will not
      if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
        elm.setAttribute('multiple', 'multiple');
      }
      return elm
    }
  
    function createElementNS (namespace, tagName) {
      return document.createElementNS(namespaceMap[namespace], tagName)
    }
  
    function createTextNode (text) {
      return document.createTextNode(text)
    }
  
    function createComment (text) {
      return document.createComment(text)
    }
  
    function insertBefore (parentNode, newNode, referenceNode) {
      parentNode.insertBefore(newNode, referenceNode);
    }
  
    function removeChild (node, child) {
      node.removeChild(child);
    }
  
    function appendChild (node, child) {
      node.appendChild(child);
    }
  
    function parentNode (node) {
      return node.parentNode
    }
  
    function nextSibling (node) {
      return node.nextSibling
    }
  
    function tagName (node) {
      return node.tagName
    }
  
    function setTextContent (node, text) {
      node.textContent = text;
    }
  
    function setStyleScope (node, scopeId) {
      node.setAttribute(scopeId, '');
    }
  
    var nodeOps = /*#__PURE__*/Object.freeze({
      createElement: createElement$1,
      createElementNS: createElementNS,
      createTextNode: createTextNode,
      createComment: createComment,
      insertBefore: insertBefore,
      removeChild: removeChild,
      appendChild: appendChild,
      parentNode: parentNode,
      nextSibling: nextSibling,
      tagName: tagName,
      setTextContent: setTextContent,
      setStyleScope: setStyleScope
    });
  
    /*  */
  
    var ref = {
      create: function create (_, vnode) {
        registerRef(vnode);
      },
      update: function update (oldVnode, vnode) {
        if (oldVnode.data.ref !== vnode.data.ref) {
          registerRef(oldVnode, true);
          registerRef(vnode);
        }
      },
      destroy: function destroy (vnode) {
        registerRef(vnode, true);
      }
    };
  
    function registerRef (vnode, isRemoval) {
      var key = vnode.data.ref;
      if (!isDef(key)) { return }
  
      var vm = vnode.context;
      var ref = vnode.componentInstance || vnode.elm;
      var refs = vm.$refs;
      if (isRemoval) {
        if (Array.isArray(refs[key])) {
          remove(refs[key], ref);
        } else if (refs[key] === ref) {
          refs[key] = undefined;
        }
      } else {
        if (vnode.data.refInFor) {
          if (!Array.isArray(refs[key])) {
            refs[key] = [ref];
          } else if (refs[key].indexOf(ref) < 0) {
            // $flow-disable-line
            refs[key].push(ref);
          }
        } else {
          refs[key] = ref;
        }
      }
    }
  
    /**
     * Virtual DOM patching algorithm based on Snabbdom by
     * Simon Friis Vindum (@paldepind)
     * Licensed under the MIT License
     * https://github.com/paldepind/snabbdom/blob/master/LICENSE
     *
     * modified by Evan You (@yyx990803)
     *
     * Not type-checking this because this file is perf-critical and the cost
     * of making flow understand it is not worth it.
     */
  
    var emptyNode = new VNode('', {}, []);
  
    var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];
  
    function sameVnode (a, b) {
      return (
        a.key === b.key && (
          (
            a.tag === b.tag &&
            a.isComment === b.isComment &&
            isDef(a.data) === isDef(b.data) &&
            sameInputType(a, b)
          ) || (
            isTrue(a.isAsyncPlaceholder) &&
            a.asyncFactory === b.asyncFactory &&
            isUndef(b.asyncFactory.error)
          )
        )
      )
    }
  
    function sameInputType (a, b) {
      if (a.tag !== 'input') { return true }
      var i;
      var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
      var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
      return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
    }
  
    function createKeyToOldIdx (children, beginIdx, endIdx) {
      var i, key;
      var map = {};
      for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (isDef(key)) { map[key] = i; }
      }
      return map
    }
  
    function createPatchFunction (backend) {
      var i, j;
      var cbs = {};
  
      var modules = backend.modules;
      var nodeOps = backend.nodeOps;
  
      for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
          if (isDef(modules[j][hooks[i]])) {
            cbs[hooks[i]].push(modules[j][hooks[i]]);
          }
        }
      }
  
      function emptyNodeAt (elm) {
        return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
      }
  
      function createRmCb (childElm, listeners) {
        function remove$$1 () {
          if (--remove$$1.listeners === 0) {
            removeNode(childElm);
          }
        }
        remove$$1.listeners = listeners;
        return remove$$1
      }
  
      function removeNode (el) {
        var parent = nodeOps.parentNode(el);
        // element may have already been removed due to v-html / v-text
        if (isDef(parent)) {
          nodeOps.removeChild(parent, el);
        }
      }
  
      function isUnknownElement$$1 (vnode, inVPre) {
        return (
          !inVPre &&
          !vnode.ns &&
          !(
            config.ignoredElements.length &&
            config.ignoredElements.some(function (ignore) {
              return isRegExp(ignore)
                ? ignore.test(vnode.tag)
                : ignore === vnode.tag
            })
          ) &&
          config.isUnknownElement(vnode.tag)
        )
      }
  
      var creatingElmInVPre = 0;
  
      function createElm (
        vnode,
        insertedVnodeQueue,
        parentElm,
        refElm,
        nested,
        ownerArray,
        index
      ) {
        if (isDef(vnode.elm) && isDef(ownerArray)) {
          // This vnode was used in a previous render!
          // now it's used as a new node, overwriting its elm would cause
          // potential patch errors down the road when it's used as an insertion
          // reference node. Instead, we clone the node on-demand before creating
          // associated DOM element for it.
          vnode = ownerArray[index] = cloneVNode(vnode);
        }
  
        vnode.isRootInsert = !nested; // for transition enter check
        if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
          return
        }
  
        var data = vnode.data;
        var children = vnode.children;
        var tag = vnode.tag;
        if (isDef(tag)) {
          {
            if (data && data.pre) {
              creatingElmInVPre++;
            }
            if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
              warn(
                'Unknown custom element: <' + tag + '> - did you ' +
                'register the component correctly? For recursive components, ' +
                'make sure to provide the "name" option.',
                vnode.context
              );
            }
          }
  
          vnode.elm = vnode.ns
            ? nodeOps.createElementNS(vnode.ns, tag)
            : nodeOps.createElement(tag, vnode);
          setScope(vnode);
  
          /* istanbul ignore if */
          {
            createChildren(vnode, children, insertedVnodeQueue);
            if (isDef(data)) {
              invokeCreateHooks(vnode, insertedVnodeQueue);
            }
            insert(parentElm, vnode.elm, refElm);
          }
  
          if (data && data.pre) {
            creatingElmInVPre--;
          }
        } else if (isTrue(vnode.isComment)) {
          vnode.elm = nodeOps.createComment(vnode.text);
          insert(parentElm, vnode.elm, refElm);
        } else {
          vnode.elm = nodeOps.createTextNode(vnode.text);
          insert(parentElm, vnode.elm, refElm);
        }
      }
  
      function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
        var i = vnode.data;
        if (isDef(i)) {
          var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
          if (isDef(i = i.hook) && isDef(i = i.init)) {
            i(vnode, false /* hydrating */);
          }
          // after calling the init hook, if the vnode is a child component
          // it should've created a child instance and mounted it. the child
          // component also has set the placeholder vnode's elm.
          // in that case we can just return the element and be done.
          if (isDef(vnode.componentInstance)) {
            initComponent(vnode, insertedVnodeQueue);
            insert(parentElm, vnode.elm, refElm);
            if (isTrue(isReactivated)) {
              reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
            }
            return true
          }
        }
      }
  
      function initComponent (vnode, insertedVnodeQueue) {
        if (isDef(vnode.data.pendingInsert)) {
          insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
          vnode.data.pendingInsert = null;
        }
        vnode.elm = vnode.componentInstance.$el;
        if (isPatchable(vnode)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
          setScope(vnode);
        } else {
          // empty component root.
          // skip all element-related modules except for ref (#3455)
          registerRef(vnode);
          // make sure to invoke the insert hook
          insertedVnodeQueue.push(vnode);
        }
      }
  
      function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
        var i;
        // hack for #4339: a reactivated component with inner transition
        // does not trigger because the inner node's created hooks are not called
        // again. It's not ideal to involve module-specific logic in here but
        // there doesn't seem to be a better way to do it.
        var innerNode = vnode;
        while (innerNode.componentInstance) {
          innerNode = innerNode.componentInstance._vnode;
          if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
            for (i = 0; i < cbs.activate.length; ++i) {
              cbs.activate[i](emptyNode, innerNode);
            }
            insertedVnodeQueue.push(innerNode);
            break
          }
        }
        // unlike a newly created component,
        // a reactivated keep-alive component doesn't insert itself
        insert(parentElm, vnode.elm, refElm);
      }
  
      function insert (parent, elm, ref$$1) {
        if (isDef(parent)) {
          if (isDef(ref$$1)) {
            if (nodeOps.parentNode(ref$$1) === parent) {
              nodeOps.insertBefore(parent, elm, ref$$1);
            }
          } else {
            nodeOps.appendChild(parent, elm);
          }
        }
      }
  
      function createChildren (vnode, children, insertedVnodeQueue) {
        if (Array.isArray(children)) {
          {
            checkDuplicateKeys(children);
          }
          for (var i = 0; i < children.length; ++i) {
            createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
          }
        } else if (isPrimitive(vnode.text)) {
          nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
        }
      }
  
      function isPatchable (vnode) {
        while (vnode.componentInstance) {
          vnode = vnode.componentInstance._vnode;
        }
        return isDef(vnode.tag)
      }
  
      function invokeCreateHooks (vnode, insertedVnodeQueue) {
        for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
          cbs.create[i$1](emptyNode, vnode);
        }
        i = vnode.data.hook; // Reuse variable
        if (isDef(i)) {
          if (isDef(i.create)) { i.create(emptyNode, vnode); }
          if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
        }
      }
  
      // set scope id attribute for scoped CSS.
      // this is implemented as a special case to avoid the overhead
      // of going through the normal attribute patching process.
      function setScope (vnode) {
        var i;
        if (isDef(i = vnode.fnScopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        } else {
          var ancestor = vnode;
          while (ancestor) {
            if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
              nodeOps.setStyleScope(vnode.elm, i);
            }
            ancestor = ancestor.parent;
          }
        }
        // for slot content they should also get the scopeId from the host instance.
        if (isDef(i = activeInstance) &&
          i !== vnode.context &&
          i !== vnode.fnContext &&
          isDef(i = i.$options._scopeId)
        ) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
      }
  
      function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
          createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
        }
      }
  
      function invokeDestroyHook (vnode) {
        var i, j;
        var data = vnode.data;
        if (isDef(data)) {
          if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
          for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
        }
        if (isDef(i = vnode.children)) {
          for (j = 0; j < vnode.children.length; ++j) {
            invokeDestroyHook(vnode.children[j]);
          }
        }
      }
  
      function removeVnodes (vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
          var ch = vnodes[startIdx];
          if (isDef(ch)) {
            if (isDef(ch.tag)) {
              removeAndInvokeRemoveHook(ch);
              invokeDestroyHook(ch);
            } else { // Text node
              removeNode(ch.elm);
            }
          }
        }
      }
  
      function removeAndInvokeRemoveHook (vnode, rm) {
        if (isDef(rm) || isDef(vnode.data)) {
          var i;
          var listeners = cbs.remove.length + 1;
          if (isDef(rm)) {
            // we have a recursively passed down rm callback
            // increase the listeners count
            rm.listeners += listeners;
          } else {
            // directly removing
            rm = createRmCb(vnode.elm, listeners);
          }
          // recursively invoke hooks on child component root node
          if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
            removeAndInvokeRemoveHook(i, rm);
          }
          for (i = 0; i < cbs.remove.length; ++i) {
            cbs.remove[i](vnode, rm);
          }
          if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
            i(vnode, rm);
          } else {
            rm();
          }
        } else {
          removeNode(vnode.elm);
        }
      }
  
      function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
        var oldStartIdx = 0;
        var newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx, idxInOld, vnodeToMove, refElm;
  
        // removeOnly is a special flag used only by <transition-group>
        // to ensure removed elements stay in correct relative positions
        // during leaving transitions
        var canMove = !removeOnly;
  
        {
          checkDuplicateKeys(newCh);
        }
  
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
          if (isUndef(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
          } else if (isUndef(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx];
          } else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
          } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
          } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
            canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
          } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
          } else {
            if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
            idxInOld = isDef(newStartVnode.key)
              ? oldKeyToIdx[newStartVnode.key]
              : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
            if (isUndef(idxInOld)) { // New element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            } else {
              vnodeToMove = oldCh[idxInOld];
              if (sameVnode(vnodeToMove, newStartVnode)) {
                patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                oldCh[idxInOld] = undefined;
                canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
              } else {
                // same key but different element. treat as new element
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
              }
            }
            newStartVnode = newCh[++newStartIdx];
          }
        }
        if (oldStartIdx > oldEndIdx) {
          refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
          addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        } else if (newStartIdx > newEndIdx) {
          removeVnodes(oldCh, oldStartIdx, oldEndIdx);
        }
      }
  
      function checkDuplicateKeys (children) {
        var seenKeys = {};
        for (var i = 0; i < children.length; i++) {
          var vnode = children[i];
          var key = vnode.key;
          if (isDef(key)) {
            if (seenKeys[key]) {
              warn(
                ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
                vnode.context
              );
            } else {
              seenKeys[key] = true;
            }
          }
        }
      }
  
      function findIdxInOld (node, oldCh, start, end) {
        for (var i = start; i < end; i++) {
          var c = oldCh[i];
          if (isDef(c) && sameVnode(node, c)) { return i }
        }
      }
  
      function patchVnode (
        oldVnode,
        vnode,
        insertedVnodeQueue,
        ownerArray,
        index,
        removeOnly
      ) {
        if (oldVnode === vnode) {
          return
        }
  
        if (isDef(vnode.elm) && isDef(ownerArray)) {
          // clone reused vnode
          vnode = ownerArray[index] = cloneVNode(vnode);
        }
  
        var elm = vnode.elm = oldVnode.elm;
  
        if (isTrue(oldVnode.isAsyncPlaceholder)) {
          if (isDef(vnode.asyncFactory.resolved)) {
            hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
          } else {
            vnode.isAsyncPlaceholder = true;
          }
          return
        }
  
        // reuse element for static trees.
        // note we only do this if the vnode is cloned -
        // if the new node is not cloned it means the render functions have been
        // reset by the hot-reload-api and we need to do a proper re-render.
        if (isTrue(vnode.isStatic) &&
          isTrue(oldVnode.isStatic) &&
          vnode.key === oldVnode.key &&
          (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
        ) {
          vnode.componentInstance = oldVnode.componentInstance;
          return
        }
  
        var i;
        var data = vnode.data;
        if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
          i(oldVnode, vnode);
        }
  
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (isDef(data) && isPatchable(vnode)) {
          for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
          if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
        }
        if (isUndef(vnode.text)) {
          if (isDef(oldCh) && isDef(ch)) {
            if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
          } else if (isDef(ch)) {
            {
              checkDuplicateKeys(ch);
            }
            if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
          } else if (isDef(oldCh)) {
            removeVnodes(oldCh, 0, oldCh.length - 1);
          } else if (isDef(oldVnode.text)) {
            nodeOps.setTextContent(elm, '');
          }
        } else if (oldVnode.text !== vnode.text) {
          nodeOps.setTextContent(elm, vnode.text);
        }
        if (isDef(data)) {
          if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
        }
      }
  
      function invokeInsertHook (vnode, queue, initial) {
        // delay insert hooks for component root nodes, invoke them after the
        // element is really inserted
        if (isTrue(initial) && isDef(vnode.parent)) {
          vnode.parent.data.pendingInsert = queue;
        } else {
          for (var i = 0; i < queue.length; ++i) {
            queue[i].data.hook.insert(queue[i]);
          }
        }
      }
  
      var hydrationBailed = false;
      // list of modules that can skip create hook during hydration because they
      // are already rendered on the client or has no need for initialization
      // Note: style is excluded because it relies on initial clone for future
      // deep updates (#7063).
      var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');
  
      // Note: this is a browser-only function so we can assume elms are DOM nodes.
      function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
        var i;
        var tag = vnode.tag;
        var data = vnode.data;
        var children = vnode.children;
        inVPre = inVPre || (data && data.pre);
        vnode.elm = elm;
  
        if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
          vnode.isAsyncPlaceholder = true;
          return true
        }
        // assert node match
        {
          if (!assertNodeMatch(elm, vnode, inVPre)) {
            return false
          }
        }
        if (isDef(data)) {
          if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
          if (isDef(i = vnode.componentInstance)) {
            // child component. it should have hydrated its own tree.
            initComponent(vnode, insertedVnodeQueue);
            return true
          }
        }
        if (isDef(tag)) {
          if (isDef(children)) {
            // empty element, allow client to pick up and populate children
            if (!elm.hasChildNodes()) {
              createChildren(vnode, children, insertedVnodeQueue);
            } else {
              // v-html and domProps: innerHTML
              if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
                if (i !== elm.innerHTML) {
                  /* istanbul ignore if */
                  if (typeof console !== 'undefined' &&
                    !hydrationBailed
                  ) {
                    hydrationBailed = true;
                    console.warn('Parent: ', elm);
                    console.warn('server innerHTML: ', i);
                    console.warn('client innerHTML: ', elm.innerHTML);
                  }
                  return false
                }
              } else {
                // iterate and compare children lists
                var childrenMatch = true;
                var childNode = elm.firstChild;
                for (var i$1 = 0; i$1 < children.length; i$1++) {
                  if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                    childrenMatch = false;
                    break
                  }
                  childNode = childNode.nextSibling;
                }
                // if childNode is not null, it means the actual childNodes list is
                // longer than the virtual children list.
                if (!childrenMatch || childNode) {
                  /* istanbul ignore if */
                  if (typeof console !== 'undefined' &&
                    !hydrationBailed
                  ) {
                    hydrationBailed = true;
                    console.warn('Parent: ', elm);
                    console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                  }
                  return false
                }
              }
            }
          }
          if (isDef(data)) {
            var fullInvoke = false;
            for (var key in data) {
              if (!isRenderedModule(key)) {
                fullInvoke = true;
                invokeCreateHooks(vnode, insertedVnodeQueue);
                break
              }
            }
            if (!fullInvoke && data['class']) {
              // ensure collecting deps for deep class bindings for future updates
              traverse(data['class']);
            }
          }
        } else if (elm.data !== vnode.text) {
          elm.data = vnode.text;
        }
        return true
      }
  
      function assertNodeMatch (node, vnode, inVPre) {
        if (isDef(vnode.tag)) {
          return vnode.tag.indexOf('vue-component') === 0 || (
            !isUnknownElement$$1(vnode, inVPre) &&
            vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
          )
        } else {
          return node.nodeType === (vnode.isComment ? 8 : 3)
        }
      }
  
      return function patch (oldVnode, vnode, hydrating, removeOnly) {
        if (isUndef(vnode)) {
          if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
          return
        }
  
        var isInitialPatch = false;
        var insertedVnodeQueue = [];
  
        if (isUndef(oldVnode)) {
          // empty mount (likely as component), create new root element
          isInitialPatch = true;
          createElm(vnode, insertedVnodeQueue);
        } else {
          var isRealElement = isDef(oldVnode.nodeType);
          if (!isRealElement && sameVnode(oldVnode, vnode)) {
            // patch existing root node
            patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
          } else {
            if (isRealElement) {
              // mounting to a real element
              // check if this is server-rendered content and if we can perform
              // a successful hydration.
              if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                oldVnode.removeAttribute(SSR_ATTR);
                hydrating = true;
              }
              if (isTrue(hydrating)) {
                if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                  invokeInsertHook(vnode, insertedVnodeQueue, true);
                  return oldVnode
                } else {
                  warn(
                    'The client-side rendered virtual DOM tree is not matching ' +
                    'server-rendered content. This is likely caused by incorrect ' +
                    'HTML markup, for example nesting block-level elements inside ' +
                    '<p>, or missing <tbody>. Bailing hydration and performing ' +
                    'full client-side render.'
                  );
                }
              }
              // either not server-rendered, or hydration failed.
              // create an empty node and replace it
              oldVnode = emptyNodeAt(oldVnode);
            }
  
            // replacing existing element
            var oldElm = oldVnode.elm;
            var parentElm = nodeOps.parentNode(oldElm);
  
            // create new node
            createElm(
              vnode,
              insertedVnodeQueue,
              // extremely rare edge case: do not insert if old element is in a
              // leaving transition. Only happens when combining transition +
              // keep-alive + HOCs. (#4590)
              oldElm._leaveCb ? null : parentElm,
              nodeOps.nextSibling(oldElm)
            );
  
            // update parent placeholder node element, recursively
            if (isDef(vnode.parent)) {
              var ancestor = vnode.parent;
              var patchable = isPatchable(vnode);
              while (ancestor) {
                for (var i = 0; i < cbs.destroy.length; ++i) {
                  cbs.destroy[i](ancestor);
                }
                ancestor.elm = vnode.elm;
                if (patchable) {
                  for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                    cbs.create[i$1](emptyNode, ancestor);
                  }
                  // #6513
                  // invoke insert hooks that may have been merged by create hooks.
                  // e.g. for directives that uses the "inserted" hook.
                  var insert = ancestor.data.hook.insert;
                  if (insert.merged) {
                    // start at index 1 to avoid re-invoking component mounted hook
                    for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                      insert.fns[i$2]();
                    }
                  }
                } else {
                  registerRef(ancestor);
                }
                ancestor = ancestor.parent;
              }
            }
  
            // destroy old node
            if (isDef(parentElm)) {
              removeVnodes([oldVnode], 0, 0);
            } else if (isDef(oldVnode.tag)) {
              invokeDestroyHook(oldVnode);
            }
          }
        }
  
        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
        return vnode.elm
      }
    }
  
    /*  */
  
    var directives = {
      create: updateDirectives,
      update: updateDirectives,
      destroy: function unbindDirectives (vnode) {
        updateDirectives(vnode, emptyNode);
      }
    };
  
    function updateDirectives (oldVnode, vnode) {
      if (oldVnode.data.directives || vnode.data.directives) {
        _update(oldVnode, vnode);
      }
    }
  
    function _update (oldVnode, vnode) {
      var isCreate = oldVnode === emptyNode;
      var isDestroy = vnode === emptyNode;
      var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
      var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);
  
      var dirsWithInsert = [];
      var dirsWithPostpatch = [];
  
      var key, oldDir, dir;
      for (key in newDirs) {
        oldDir = oldDirs[key];
        dir = newDirs[key];
        if (!oldDir) {
          // new directive, bind
          callHook$1(dir, 'bind', vnode, oldVnode);
          if (dir.def && dir.def.inserted) {
            dirsWithInsert.push(dir);
          }
        } else {
          // existing directive, update
          dir.oldValue = oldDir.value;
          dir.oldArg = oldDir.arg;
          callHook$1(dir, 'update', vnode, oldVnode);
          if (dir.def && dir.def.componentUpdated) {
            dirsWithPostpatch.push(dir);
          }
        }
      }
  
      if (dirsWithInsert.length) {
        var callInsert = function () {
          for (var i = 0; i < dirsWithInsert.length; i++) {
            callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
          }
        };
        if (isCreate) {
          mergeVNodeHook(vnode, 'insert', callInsert);
        } else {
          callInsert();
        }
      }
  
      if (dirsWithPostpatch.length) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          for (var i = 0; i < dirsWithPostpatch.length; i++) {
            callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
          }
        });
      }
  
      if (!isCreate) {
        for (key in oldDirs) {
          if (!newDirs[key]) {
            // no longer present, unbind
            callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
          }
        }
      }
    }
  
    var emptyModifiers = Object.create(null);
  
    function normalizeDirectives$1 (
      dirs,
      vm
    ) {
      var res = Object.create(null);
      if (!dirs) {
        // $flow-disable-line
        return res
      }
      var i, dir;
      for (i = 0; i < dirs.length; i++) {
        dir = dirs[i];
        if (!dir.modifiers) {
          // $flow-disable-line
          dir.modifiers = emptyModifiers;
        }
        res[getRawDirName(dir)] = dir;
        dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
      }
      // $flow-disable-line
      return res
    }
  
    function getRawDirName (dir) {
      return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
    }
  
    function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
      var fn = dir.def && dir.def[hook];
      if (fn) {
        try {
          fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
        } catch (e) {
          handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
        }
      }
    }
  
    var baseModules = [
      ref,
      directives
    ];
  
    /*  */
  
    function updateAttrs (oldVnode, vnode) {
      var opts = vnode.componentOptions;
      if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
        return
      }
      if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
        return
      }
      var key, cur, old;
      var elm = vnode.elm;
      var oldAttrs = oldVnode.data.attrs || {};
      var attrs = vnode.data.attrs || {};
      // clone observed objects, as the user probably wants to mutate it
      if (isDef(attrs.__ob__)) {
        attrs = vnode.data.attrs = extend({}, attrs);
      }
  
      for (key in attrs) {
        cur = attrs[key];
        old = oldAttrs[key];
        if (old !== cur) {
          setAttr(elm, key, cur);
        }
      }
      // #4391: in IE9, setting type can reset value for input[type=radio]
      // #6666: IE/Edge forces progress value down to 1 before setting a max
      /* istanbul ignore if */
      if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
        setAttr(elm, 'value', attrs.value);
      }
      for (key in oldAttrs) {
        if (isUndef(attrs[key])) {
          if (isXlink(key)) {
            elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
          } else if (!isEnumeratedAttr(key)) {
            elm.removeAttribute(key);
          }
        }
      }
    }
  
    function setAttr (el, key, value) {
      if (el.tagName.indexOf('-') > -1) {
        baseSetAttr(el, key, value);
      } else if (isBooleanAttr(key)) {
        // set attribute for blank value
        // e.g. <option disabled>Select one</option>
        if (isFalsyAttrValue(value)) {
          el.removeAttribute(key);
        } else {
          // technically allowfullscreen is a boolean attribute for <iframe>,
          // but Flash expects a value of "true" when used on <embed> tag
          value = key === 'allowfullscreen' && el.tagName === 'EMBED'
            ? 'true'
            : key;
          el.setAttribute(key, value);
        }
      } else if (isEnumeratedAttr(key)) {
        el.setAttribute(key, convertEnumeratedValue(key, value));
      } else if (isXlink(key)) {
        if (isFalsyAttrValue(value)) {
          el.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else {
          el.setAttributeNS(xlinkNS, key, value);
        }
      } else {
        baseSetAttr(el, key, value);
      }
    }
  
    function baseSetAttr (el, key, value) {
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        // #7138: IE10 & 11 fires input event when setting placeholder on
        // <textarea>... block the first input event and remove the blocker
        // immediately.
        /* istanbul ignore if */
        if (
          isIE && !isIE9 &&
          el.tagName === 'TEXTAREA' &&
          key === 'placeholder' && value !== '' && !el.__ieph
        ) {
          var blocker = function (e) {
            e.stopImmediatePropagation();
            el.removeEventListener('input', blocker);
          };
          el.addEventListener('input', blocker);
          // $flow-disable-line
          el.__ieph = true; /* IE placeholder patched */
        }
        el.setAttribute(key, value);
      }
    }
  
    var attrs = {
      create: updateAttrs,
      update: updateAttrs
    };
  
    /*  */
  
    function updateClass (oldVnode, vnode) {
      var el = vnode.elm;
      var data = vnode.data;
      var oldData = oldVnode.data;
      if (
        isUndef(data.staticClass) &&
        isUndef(data.class) && (
          isUndef(oldData) || (
            isUndef(oldData.staticClass) &&
            isUndef(oldData.class)
          )
        )
      ) {
        return
      }
  
      var cls = genClassForVnode(vnode);
  
      // handle transition classes
      var transitionClass = el._transitionClasses;
      if (isDef(transitionClass)) {
        cls = concat(cls, stringifyClass(transitionClass));
      }
  
      // set the class
      if (cls !== el._prevClass) {
        el.setAttribute('class', cls);
        el._prevClass = cls;
      }
    }
  
    var klass = {
      create: updateClass,
      update: updateClass
    };
  
    /*  */
  
    var validDivisionCharRE = /[\w).+\-_$\]]/;
  
    function parseFilters (exp) {
      var inSingle = false;
      var inDouble = false;
      var inTemplateString = false;
      var inRegex = false;
      var curly = 0;
      var square = 0;
      var paren = 0;
      var lastFilterIndex = 0;
      var c, prev, i, expression, filters;
  
      for (i = 0; i < exp.length; i++) {
        prev = c;
        c = exp.charCodeAt(i);
        if (inSingle) {
          if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
        } else if (inDouble) {
          if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
        } else if (inTemplateString) {
          if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
        } else if (inRegex) {
          if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
        } else if (
          c === 0x7C && // pipe
          exp.charCodeAt(i + 1) !== 0x7C &&
          exp.charCodeAt(i - 1) !== 0x7C &&
          !curly && !square && !paren
        ) {
          if (expression === undefined) {
            // first filter, end of expression
            lastFilterIndex = i + 1;
            expression = exp.slice(0, i).trim();
          } else {
            pushFilter();
          }
        } else {
          switch (c) {
            case 0x22: inDouble = true; break         // "
            case 0x27: inSingle = true; break         // '
            case 0x60: inTemplateString = true; break // `
            case 0x28: paren++; break                 // (
            case 0x29: paren--; break                 // )
            case 0x5B: square++; break                // [
            case 0x5D: square--; break                // ]
            case 0x7B: curly++; break                 // {
            case 0x7D: curly--; break                 // }
          }
          if (c === 0x2f) { // /
            var j = i - 1;
            var p = (void 0);
            // find first non-whitespace prev char
            for (; j >= 0; j--) {
              p = exp.charAt(j);
              if (p !== ' ') { break }
            }
            if (!p || !validDivisionCharRE.test(p)) {
              inRegex = true;
            }
          }
        }
      }
  
      if (expression === undefined) {
        expression = exp.slice(0, i).trim();
      } else if (lastFilterIndex !== 0) {
        pushFilter();
      }
  
      function pushFilter () {
        (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
        lastFilterIndex = i + 1;
      }
  
      if (filters) {
        for (i = 0; i < filters.length; i++) {
          expression = wrapFilter(expression, filters[i]);
        }
      }
  
      return expression
    }
  
    function wrapFilter (exp, filter) {
      var i = filter.indexOf('(');
      if (i < 0) {
        // _f: resolveFilter
        return ("_f(\"" + filter + "\")(" + exp + ")")
      } else {
        var name = filter.slice(0, i);
        var args = filter.slice(i + 1);
        return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
      }
    }
  
    /*  */
  
  
  
    /* eslint-disable no-unused-vars */
    function baseWarn (msg, range) {
      console.error(("[Vue compiler]: " + msg));
    }
    /* eslint-enable no-unused-vars */
  
    function pluckModuleFunction (
      modules,
      key
    ) {
      return modules
        ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
        : []
    }
  
    function addProp (el, name, value, range, dynamic) {
      (el.props || (el.props = [])).push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
      el.plain = false;
    }
  
    function addAttr (el, name, value, range, dynamic) {
      var attrs = dynamic
        ? (el.dynamicAttrs || (el.dynamicAttrs = []))
        : (el.attrs || (el.attrs = []));
      attrs.push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
      el.plain = false;
    }
  
    // add a raw attr (use this in preTransforms)
    function addRawAttr (el, name, value, range) {
      el.attrsMap[name] = value;
      el.attrsList.push(rangeSetItem({ name: name, value: value }, range));
    }
  
    function addDirective (
      el,
      name,
      rawName,
      value,
      arg,
      isDynamicArg,
      modifiers,
      range
    ) {
      (el.directives || (el.directives = [])).push(rangeSetItem({
        name: name,
        rawName: rawName,
        value: value,
        arg: arg,
        isDynamicArg: isDynamicArg,
        modifiers: modifiers
      }, range));
      el.plain = false;
    }
  
    function prependModifierMarker (symbol, name, dynamic) {
      return dynamic
        ? ("_p(" + name + ",\"" + symbol + "\")")
        : symbol + name // mark the event as captured
    }
  
    function addHandler (
      el,
      name,
      value,
      modifiers,
      important,
      warn,
      range,
      dynamic
    ) {
      modifiers = modifiers || emptyObject;
      // warn prevent and passive modifier
      /* istanbul ignore if */
      if (
        warn &&
        modifiers.prevent && modifiers.passive
      ) {
        warn(
          'passive and prevent can\'t be used together. ' +
          'Passive handler can\'t prevent default event.',
          range
        );
      }
  
      // normalize click.right and click.middle since they don't actually fire
      // this is technically browser-specific, but at least for now browsers are
      // the only target envs that have right/middle clicks.
      if (modifiers.right) {
        if (dynamic) {
          name = "(" + name + ")==='click'?'contextmenu':(" + name + ")";
        } else if (name === 'click') {
          name = 'contextmenu';
          delete modifiers.right;
        }
      } else if (modifiers.middle) {
        if (dynamic) {
          name = "(" + name + ")==='click'?'mouseup':(" + name + ")";
        } else if (name === 'click') {
          name = 'mouseup';
        }
      }
  
      // check capture modifier
      if (modifiers.capture) {
        delete modifiers.capture;
        name = prependModifierMarker('!', name, dynamic);
      }
      if (modifiers.once) {
        delete modifiers.once;
        name = prependModifierMarker('~', name, dynamic);
      }
      /* istanbul ignore if */
      if (modifiers.passive) {
        delete modifiers.passive;
        name = prependModifierMarker('&', name, dynamic);
      }
  
      var events;
      if (modifiers.native) {
        delete modifiers.native;
        events = el.nativeEvents || (el.nativeEvents = {});
      } else {
        events = el.events || (el.events = {});
      }
  
      var newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range);
      if (modifiers !== emptyObject) {
        newHandler.modifiers = modifiers;
      }
  
      var handlers = events[name];
      /* istanbul ignore if */
      if (Array.isArray(handlers)) {
        important ? handlers.unshift(newHandler) : handlers.push(newHandler);
      } else if (handlers) {
        events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
      } else {
        events[name] = newHandler;
      }
  
      el.plain = false;
    }
  
    function getRawBindingAttr (
      el,
      name
    ) {
      return el.rawAttrsMap[':' + name] ||
        el.rawAttrsMap['v-bind:' + name] ||
        el.rawAttrsMap[name]
    }
  
    function getBindingAttr (
      el,
      name,
      getStatic
    ) {
      var dynamicValue =
        getAndRemoveAttr(el, ':' + name) ||
        getAndRemoveAttr(el, 'v-bind:' + name);
      if (dynamicValue != null) {
        return parseFilters(dynamicValue)
      } else if (getStatic !== false) {
        var staticValue = getAndRemoveAttr(el, name);
        if (staticValue != null) {
          return JSON.stringify(staticValue)
        }
      }
    }
  
    // note: this only removes the attr from the Array (attrsList) so that it
    // doesn't get processed by processAttrs.
    // By default it does NOT remove it from the map (attrsMap) because the map is
    // needed during codegen.
    function getAndRemoveAttr (
      el,
      name,
      removeFromMap
    ) {
      var val;
      if ((val = el.attrsMap[name]) != null) {
        var list = el.attrsList;
        for (var i = 0, l = list.length; i < l; i++) {
          if (list[i].name === name) {
            list.splice(i, 1);
            break
          }
        }
      }
      if (removeFromMap) {
        delete el.attrsMap[name];
      }
      return val
    }
  
    function getAndRemoveAttrByRegex (
      el,
      name
    ) {
      var list = el.attrsList;
      for (var i = 0, l = list.length; i < l; i++) {
        var attr = list[i];
        if (name.test(attr.name)) {
          list.splice(i, 1);
          return attr
        }
      }
    }
  
    function rangeSetItem (
      item,
      range
    ) {
      if (range) {
        if (range.start != null) {
          item.start = range.start;
        }
        if (range.end != null) {
          item.end = range.end;
        }
      }
      return item
    }
  
    /*  */
  
    /**
     * Cross-platform code generation for component v-model
     */
    function genComponentModel (
      el,
      value,
      modifiers
    ) {
      var ref = modifiers || {};
      var number = ref.number;
      var trim = ref.trim;
  
      var baseValueExpression = '$$v';
      var valueExpression = baseValueExpression;
      if (trim) {
        valueExpression =
          "(typeof " + baseValueExpression + " === 'string'" +
          "? " + baseValueExpression + ".trim()" +
          ": " + baseValueExpression + ")";
      }
      if (number) {
        valueExpression = "_n(" + valueExpression + ")";
      }
      var assignment = genAssignmentCode(value, valueExpression);
  
      el.model = {
        value: ("(" + value + ")"),
        expression: JSON.stringify(value),
        callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
      };
    }
  
    /**
     * Cross-platform codegen helper for generating v-model value assignment code.
     */
    function genAssignmentCode (
      value,
      assignment
    ) {
      var res = parseModel(value);
      if (res.key === null) {
        return (value + "=" + assignment)
      } else {
        return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
      }
    }
  
    /**
     * Parse a v-model expression into a base path and a final key segment.
     * Handles both dot-path and possible square brackets.
     *
     * Possible cases:
     *
     * - test
     * - test[key]
     * - test[test1[key]]
     * - test["a"][key]
     * - xxx.test[a[a].test1[key]]
     * - test.xxx.a["asa"][test1[key]]
     *
     */
  
    var len, str, chr, index$1, expressionPos, expressionEndPos;
  
  
  
    function parseModel (val) {
      // Fix https://github.com/vuejs/vue/pull/7730
      // allow v-model="obj.val " (trailing whitespace)
      val = val.trim();
      len = val.length;
  
      if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
        index$1 = val.lastIndexOf('.');
        if (index$1 > -1) {
          return {
            exp: val.slice(0, index$1),
            key: '"' + val.slice(index$1 + 1) + '"'
          }
        } else {
          return {
            exp: val,
            key: null
          }
        }
      }
  
      str = val;
      index$1 = expressionPos = expressionEndPos = 0;
  
      while (!eof()) {
        chr = next();
        /* istanbul ignore if */
        if (isStringStart(chr)) {
          parseString(chr);
        } else if (chr === 0x5B) {
          parseBracket(chr);
        }
      }
  
      return {
        exp: val.slice(0, expressionPos),
        key: val.slice(expressionPos + 1, expressionEndPos)
      }
    }
  
    function next () {
      return str.charCodeAt(++index$1)
    }
  
    function eof () {
      return index$1 >= len
    }
  
    function isStringStart (chr) {
      return chr === 0x22 || chr === 0x27
    }
  
    function parseBracket (chr) {
      var inBracket = 1;
      expressionPos = index$1;
      while (!eof()) {
        chr = next();
        if (isStringStart(chr)) {
          parseString(chr);
          continue
        }
        if (chr === 0x5B) { inBracket++; }
        if (chr === 0x5D) { inBracket--; }
        if (inBracket === 0) {
          expressionEndPos = index$1;
          break
        }
      }
    }
  
    function parseString (chr) {
      var stringQuote = chr;
      while (!eof()) {
        chr = next();
        if (chr === stringQuote) {
          break
        }
      }
    }
  
    /*  */
  
    var warn$1;
  
    // in some cases, the event used has to be determined at runtime
    // so we used some reserved tokens during compile.
    var RANGE_TOKEN = '__r';
    var CHECKBOX_RADIO_TOKEN = '__c';
  
    function model (
      el,
      dir,
      _warn
    ) {
      warn$1 = _warn;
      var value = dir.value;
      var modifiers = dir.modifiers;
      var tag = el.tag;
      var type = el.attrsMap.type;
  
      {
        // inputs with type="file" are read only and setting the input's
        // value will throw an error.
        if (tag === 'input' && type === 'file') {
          warn$1(
            "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
            "File inputs are read only. Use a v-on:change listener instead.",
            el.rawAttrsMap['v-model']
          );
        }
      }
  
      if (el.component) {
        genComponentModel(el, value, modifiers);
        // component v-model doesn't need extra runtime
        return false
      } else if (tag === 'select') {
        genSelect(el, value, modifiers);
      } else if (tag === 'input' && type === 'checkbox') {
        genCheckboxModel(el, value, modifiers);
      } else if (tag === 'input' && type === 'radio') {
        genRadioModel(el, value, modifiers);
      } else if (tag === 'input' || tag === 'textarea') {
        genDefaultModel(el, value, modifiers);
      } else if (!config.isReservedTag(tag)) {
        genComponentModel(el, value, modifiers);
        // component v-model doesn't need extra runtime
        return false
      } else {
        warn$1(
          "<" + (el.tag) + " v-model=\"" + value + "\">: " +
          "v-model is not supported on this element type. " +
          'If you are working with contenteditable, it\'s recommended to ' +
          'wrap a library dedicated for that purpose inside a custom component.',
          el.rawAttrsMap['v-model']
        );
      }
  
      // ensure runtime directive metadata
      return true
    }
  
    function genCheckboxModel (
      el,
      value,
      modifiers
    ) {
      var number = modifiers && modifiers.number;
      var valueBinding = getBindingAttr(el, 'value') || 'null';
      var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
      var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
      addProp(el, 'checked',
        "Array.isArray(" + value + ")" +
        "?_i(" + value + "," + valueBinding + ")>-1" + (
          trueValueBinding === 'true'
            ? (":(" + value + ")")
            : (":_q(" + value + "," + trueValueBinding + ")")
        )
      );
      addHandler(el, 'change',
        "var $$a=" + value + "," +
            '$$el=$event.target,' +
            "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
        'if(Array.isArray($$a)){' +
          "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
              '$$i=_i($$a,$$v);' +
          "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
          "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
        "}else{" + (genAssignmentCode(value, '$$c')) + "}",
        null, true
      );
    }
  
    function genRadioModel (
      el,
      value,
      modifiers
    ) {
      var number = modifiers && modifiers.number;
      var valueBinding = getBindingAttr(el, 'value') || 'null';
      valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
      addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
      addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
    }
  
    function genSelect (
      el,
      value,
      modifiers
    ) {
      var number = modifiers && modifiers.number;
      var selectedVal = "Array.prototype.filter" +
        ".call($event.target.options,function(o){return o.selected})" +
        ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
        "return " + (number ? '_n(val)' : 'val') + "})";
  
      var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
      var code = "var $$selectedVal = " + selectedVal + ";";
      code = code + " " + (genAssignmentCode(value, assignment));
      addHandler(el, 'change', code, null, true);
    }
  
    function genDefaultModel (
      el,
      value,
      modifiers
    ) {
      var type = el.attrsMap.type;
  
      // warn if v-bind:value conflicts with v-model
      // except for inputs with v-bind:type
      {
        var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
        var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
        if (value$1 && !typeBinding) {
          var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
          warn$1(
            binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
            'because the latter already expands to a value binding internally',
            el.rawAttrsMap[binding]
          );
        }
      }
  
      var ref = modifiers || {};
      var lazy = ref.lazy;
      var number = ref.number;
      var trim = ref.trim;
      var needCompositionGuard = !lazy && type !== 'range';
      var event = lazy
        ? 'change'
        : type === 'range'
          ? RANGE_TOKEN
          : 'input';
  
      var valueExpression = '$event.target.value';
      if (trim) {
        valueExpression = "$event.target.value.trim()";
      }
      if (number) {
        valueExpression = "_n(" + valueExpression + ")";
      }
  
      var code = genAssignmentCode(value, valueExpression);
      if (needCompositionGuard) {
        code = "if($event.target.composing)return;" + code;
      }
  
      addProp(el, 'value', ("(" + value + ")"));
      addHandler(el, event, code, null, true);
      if (trim || number) {
        addHandler(el, 'blur', '$forceUpdate()');
      }
    }
  
    /*  */
  
    // normalize v-model event tokens that can only be determined at runtime.
    // it's important to place the event as the first in the array because
    // the whole point is ensuring the v-model callback gets called before
    // user-attached handlers.
    function normalizeEvents (on) {
      /* istanbul ignore if */
      if (isDef(on[RANGE_TOKEN])) {
        // IE input[type=range] only supports `change` event
        var event = isIE ? 'change' : 'input';
        on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
        delete on[RANGE_TOKEN];
      }
      // This was originally intended to fix #4521 but no longer necessary
      // after 2.5. Keeping it for backwards compat with generated code from < 2.4
      /* istanbul ignore if */
      if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
        on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
        delete on[CHECKBOX_RADIO_TOKEN];
      }
    }
  
    var target$1;
  
    function createOnceHandler$1 (event, handler, capture) {
      var _target = target$1; // save current target element in closure
      return function onceHandler () {
        var res = handler.apply(null, arguments);
        if (res !== null) {
          remove$2(event, onceHandler, capture, _target);
        }
      }
    }
  
    // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
    // implementation and does not fire microtasks in between event propagation, so
    // safe to exclude.
    var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);
  
    function add$1 (
      name,
      handler,
      capture,
      passive
    ) {
      // async edge case #6566: inner click event triggers patch, event handler
      // attached to outer element during patch, and triggered again. This
      // happens because browsers fire microtask ticks between event propagation.
      // the solution is simple: we save the timestamp when a handler is attached,
      // and the handler would only fire if the event passed to it was fired
      // AFTER it was attached.
      if (useMicrotaskFix) {
        var attachedTimestamp = currentFlushTimestamp;
        var original = handler;
        handler = original._wrapper = function (e) {
          if (
            // no bubbling, should always fire.
            // this is just a safety net in case event.timeStamp is unreliable in
            // certain weird environments...
            e.target === e.currentTarget ||
            // event is fired after handler attachment
            e.timeStamp >= attachedTimestamp ||
            // bail for environments that have buggy event.timeStamp implementations
            // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
            // #9681 QtWebEngine event.timeStamp is negative value
            e.timeStamp <= 0 ||
            // #9448 bail if event is fired in another document in a multi-page
            // electron/nw.js app, since event.timeStamp will be using a different
            // starting reference
            e.target.ownerDocument !== document
          ) {
            return original.apply(this, arguments)
          }
        };
      }
      target$1.addEventListener(
        name,
        handler,
        supportsPassive
          ? { capture: capture, passive: passive }
          : capture
      );
    }
  
    function remove$2 (
      name,
      handler,
      capture,
      _target
    ) {
      (_target || target$1).removeEventListener(
        name,
        handler._wrapper || handler,
        capture
      );
    }
  
    function updateDOMListeners (oldVnode, vnode) {
      if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
        return
      }
      var on = vnode.data.on || {};
      var oldOn = oldVnode.data.on || {};
      target$1 = vnode.elm;
      normalizeEvents(on);
      updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
      target$1 = undefined;
    }
  
    var events = {
      create: updateDOMListeners,
      update: updateDOMListeners
    };
  
    /*  */
  
    var svgContainer;
  
    function updateDOMProps (oldVnode, vnode) {
      if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
        return
      }
      var key, cur;
      var elm = vnode.elm;
      var oldProps = oldVnode.data.domProps || {};
      var props = vnode.data.domProps || {};
      // clone observed objects, as the user probably wants to mutate it
      if (isDef(props.__ob__)) {
        props = vnode.data.domProps = extend({}, props);
      }
  
      for (key in oldProps) {
        if (!(key in props)) {
          elm[key] = '';
        }
      }
  
      for (key in props) {
        cur = props[key];
        // ignore children if the node has textContent or innerHTML,
        // as these will throw away existing DOM nodes and cause removal errors
        // on subsequent patches (#3360)
        if (key === 'textContent' || key === 'innerHTML') {
          if (vnode.children) { vnode.children.length = 0; }
          if (cur === oldProps[key]) { continue }
          // #6601 work around Chrome version <= 55 bug where single textNode
          // replaced by innerHTML/textContent retains its parentNode property
          if (elm.childNodes.length === 1) {
            elm.removeChild(elm.childNodes[0]);
          }
        }
  
        if (key === 'value' && elm.tagName !== 'PROGRESS') {
          // store value as _value as well since
          // non-string values will be stringified
          elm._value = cur;
          // avoid resetting cursor position when value is the same
          var strCur = isUndef(cur) ? '' : String(cur);
          if (shouldUpdateValue(elm, strCur)) {
            elm.value = strCur;
          }
        } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
          // IE doesn't support innerHTML for SVG elements
          svgContainer = svgContainer || document.createElement('div');
          svgContainer.innerHTML = "<svg>" + cur + "</svg>";
          var svg = svgContainer.firstChild;
          while (elm.firstChild) {
            elm.removeChild(elm.firstChild);
          }
          while (svg.firstChild) {
            elm.appendChild(svg.firstChild);
          }
        } else if (
          // skip the update if old and new VDOM state is the same.
          // `value` is handled separately because the DOM value may be temporarily
          // out of sync with VDOM state due to focus, composition and modifiers.
          // This  #4521 by skipping the unnecesarry `checked` update.
          cur !== oldProps[key]
        ) {
          // some property updates can throw
          // e.g. `value` on <progress> w/ non-finite value
          try {
            elm[key] = cur;
          } catch (e) {}
        }
      }
    }
  
    // check platforms/web/util/attrs.js acceptValue
  
  
    function shouldUpdateValue (elm, checkVal) {
      return (!elm.composing && (
        elm.tagName === 'OPTION' ||
        isNotInFocusAndDirty(elm, checkVal) ||
        isDirtyWithModifiers(elm, checkVal)
      ))
    }
  
    function isNotInFocusAndDirty (elm, checkVal) {
      // return true when textbox (.number and .trim) loses focus and its value is
      // not equal to the updated value
      var notInFocus = true;
      // #6157
      // work around IE bug when accessing document.activeElement in an iframe
      try { notInFocus = document.activeElement !== elm; } catch (e) {}
      return notInFocus && elm.value !== checkVal
    }
  
    function isDirtyWithModifiers (elm, newVal) {
      var value = elm.value;
      var modifiers = elm._vModifiers; // injected by v-model runtime
      if (isDef(modifiers)) {
        if (modifiers.number) {
          return toNumber(value) !== toNumber(newVal)
        }
        if (modifiers.trim) {
          return value.trim() !== newVal.trim()
        }
      }
      return value !== newVal
    }
  
    var domProps = {
      create: updateDOMProps,
      update: updateDOMProps
    };
  
    /*  */
  
    var parseStyleText = cached(function (cssText) {
      var res = {};
      var listDelimiter = /;(?![^(]*\))/g;
      var propertyDelimiter = /:(.+)/;
      cssText.split(listDelimiter).forEach(function (item) {
        if (item) {
          var tmp = item.split(propertyDelimiter);
          tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
        }
      });
      return res
    });
  
    // merge static and dynamic style data on the same vnode
    function normalizeStyleData (data) {
      var style = normalizeStyleBinding(data.style);
      // static style is pre-processed into an object during compilation
      // and is always a fresh object, so it's safe to merge into it
      return data.staticStyle
        ? extend(data.staticStyle, style)
        : style
    }
  
    // normalize possible array / string values into Object
    function normalizeStyleBinding (bindingStyle) {
      if (Array.isArray(bindingStyle)) {
        return toObject(bindingStyle)
      }
      if (typeof bindingStyle === 'string') {
        return parseStyleText(bindingStyle)
      }
      return bindingStyle
    }
  
    /**
     * parent component style should be after child's
     * so that parent component's style could override it
     */
    function getStyle (vnode, checkChild) {
      var res = {};
      var styleData;
  
      if (checkChild) {
        var childNode = vnode;
        while (childNode.componentInstance) {
          childNode = childNode.componentInstance._vnode;
          if (
            childNode && childNode.data &&
            (styleData = normalizeStyleData(childNode.data))
          ) {
            extend(res, styleData);
          }
        }
      }
  
      if ((styleData = normalizeStyleData(vnode.data))) {
        extend(res, styleData);
      }
  
      var parentNode = vnode;
      while ((parentNode = parentNode.parent)) {
        if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
          extend(res, styleData);
        }
      }
      return res
    }
  
    /*  */
  
    var cssVarRE = /^--/;
    var importantRE = /\s*!important$/;
    var setProp = function (el, name, val) {
      /* istanbul ignore if */
      if (cssVarRE.test(name)) {
        el.style.setProperty(name, val);
      } else if (importantRE.test(val)) {
        el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
      } else {
        var normalizedName = normalize(name);
        if (Array.isArray(val)) {
          // Support values array created by autoprefixer, e.g.
          // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
          // Set them one by one, and the browser will only set those it can recognize
          for (var i = 0, len = val.length; i < len; i++) {
            el.style[normalizedName] = val[i];
          }
        } else {
          el.style[normalizedName] = val;
        }
      }
    };
  
    var vendorNames = ['Webkit', 'Moz', 'ms'];
  
    var emptyStyle;
    var normalize = cached(function (prop) {
      emptyStyle = emptyStyle || document.createElement('div').style;
      prop = camelize(prop);
      if (prop !== 'filter' && (prop in emptyStyle)) {
        return prop
      }
      var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
      for (var i = 0; i < vendorNames.length; i++) {
        var name = vendorNames[i] + capName;
        if (name in emptyStyle) {
          return name
        }
      }
    });
  
    function updateStyle (oldVnode, vnode) {
      var data = vnode.data;
      var oldData = oldVnode.data;
  
      if (isUndef(data.staticStyle) && isUndef(data.style) &&
        isUndef(oldData.staticStyle) && isUndef(oldData.style)
      ) {
        return
      }
  
      var cur, name;
      var el = vnode.elm;
      var oldStaticStyle = oldData.staticStyle;
      var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};
  
      // if static style exists, stylebinding already merged into it when doing normalizeStyleData
      var oldStyle = oldStaticStyle || oldStyleBinding;
  
      var style = normalizeStyleBinding(vnode.data.style) || {};
  
      // store normalized style under a different key for next diff
      // make sure to clone it if it's reactive, since the user likely wants
      // to mutate it.
      vnode.data.normalizedStyle = isDef(style.__ob__)
        ? extend({}, style)
        : style;
  
      var newStyle = getStyle(vnode, true);
  
      for (name in oldStyle) {
        if (isUndef(newStyle[name])) {
          setProp(el, name, '');
        }
      }
      for (name in newStyle) {
        cur = newStyle[name];
        if (cur !== oldStyle[name]) {
          // ie9 setting to null has no effect, must use empty string
          setProp(el, name, cur == null ? '' : cur);
        }
      }
    }
  
    var style = {
      create: updateStyle,
      update: updateStyle
    };
  
    /*  */
  
    var whitespaceRE = /\s+/;
  
    /**
     * Add class with compatibility for SVG since classList is not supported on
     * SVG elements in IE
     */
    function addClass (el, cls) {
      /* istanbul ignore if */
      if (!cls || !(cls = cls.trim())) {
        return
      }
  
      /* istanbul ignore else */
      if (el.classList) {
        if (cls.indexOf(' ') > -1) {
          cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
        } else {
          el.classList.add(cls);
        }
      } else {
        var cur = " " + (el.getAttribute('class') || '') + " ";
        if (cur.indexOf(' ' + cls + ' ') < 0) {
          el.setAttribute('class', (cur + cls).trim());
        }
      }
    }
  
    /**
     * Remove class with compatibility for SVG since classList is not supported on
     * SVG elements in IE
     */
    function removeClass (el, cls) {
      /* istanbul ignore if */
      if (!cls || !(cls = cls.trim())) {
        return
      }
  
      /* istanbul ignore else */
      if (el.classList) {
        if (cls.indexOf(' ') > -1) {
          cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
        } else {
          el.classList.remove(cls);
        }
        if (!el.classList.length) {
          el.removeAttribute('class');
        }
      } else {
        var cur = " " + (el.getAttribute('class') || '') + " ";
        var tar = ' ' + cls + ' ';
        while (cur.indexOf(tar) >= 0) {
          cur = cur.replace(tar, ' ');
        }
        cur = cur.trim();
        if (cur) {
          el.setAttribute('class', cur);
        } else {
          el.removeAttribute('class');
        }
      }
    }
  
    /*  */
  
    function resolveTransition (def$$1) {
      if (!def$$1) {
        return
      }
      /* istanbul ignore else */
      if (typeof def$$1 === 'object') {
        var res = {};
        if (def$$1.css !== false) {
          extend(res, autoCssTransition(def$$1.name || 'v'));
        }
        extend(res, def$$1);
        return res
      } else if (typeof def$$1 === 'string') {
        return autoCssTransition(def$$1)
      }
    }
  
    var autoCssTransition = cached(function (name) {
      return {
        enterClass: (name + "-enter"),
        enterToClass: (name + "-enter-to"),
        enterActiveClass: (name + "-enter-active"),
        leaveClass: (name + "-leave"),
        leaveToClass: (name + "-leave-to"),
        leaveActiveClass: (name + "-leave-active")
      }
    });
  
    var hasTransition = inBrowser && !isIE9;
    var TRANSITION = 'transition';
    var ANIMATION = 'animation';
  
    // Transition property/event sniffing
    var transitionProp = 'transition';
    var transitionEndEvent = 'transitionend';
    var animationProp = 'animation';
    var animationEndEvent = 'animationend';
    if (hasTransition) {
      /* istanbul ignore if */
      if (window.ontransitionend === undefined &&
        window.onwebkittransitionend !== undefined
      ) {
        transitionProp = 'WebkitTransition';
        transitionEndEvent = 'webkitTransitionEnd';
      }
      if (window.onanimationend === undefined &&
        window.onwebkitanimationend !== undefined
      ) {
        animationProp = 'WebkitAnimation';
        animationEndEvent = 'webkitAnimationEnd';
      }
    }
  
    // binding to window is necessary to make hot reload work in IE in strict mode
    var raf = inBrowser
      ? window.requestAnimationFrame
        ? window.requestAnimationFrame.bind(window)
        : setTimeout
      : /* istanbul ignore next */ function (fn) { return fn(); };
  
    function nextFrame (fn) {
      raf(function () {
        raf(fn);
      });
    }
  
    function addTransitionClass (el, cls) {
      var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
      if (transitionClasses.indexOf(cls) < 0) {
        transitionClasses.push(cls);
        addClass(el, cls);
      }
    }
  
    function removeTransitionClass (el, cls) {
      if (el._transitionClasses) {
        remove(el._transitionClasses, cls);
      }
      removeClass(el, cls);
    }
  
    function whenTransitionEnds (
      el,
      expectedType,
      cb
    ) {
      var ref = getTransitionInfo(el, expectedType);
      var type = ref.type;
      var timeout = ref.timeout;
      var propCount = ref.propCount;
      if (!type) { return cb() }
      var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
      var ended = 0;
      var end = function () {
        el.removeEventListener(event, onEnd);
        cb();
      };
      var onEnd = function (e) {
        if (e.target === el) {
          if (++ended >= propCount) {
            end();
          }
        }
      };
      setTimeout(function () {
        if (ended < propCount) {
          end();
        }
      }, timeout + 1);
      el.addEventListener(event, onEnd);
    }
  
    var transformRE = /\b(transform|all)(,|$)/;
  
    function getTransitionInfo (el, expectedType) {
      var styles = window.getComputedStyle(el);
      // JSDOM may return undefined for transition properties
      var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
      var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
      var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
      var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
      var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
      var animationTimeout = getTimeout(animationDelays, animationDurations);
  
      var type;
      var timeout = 0;
      var propCount = 0;
      /* istanbul ignore if */
      if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
          type = TRANSITION;
          timeout = transitionTimeout;
          propCount = transitionDurations.length;
        }
      } else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
          type = ANIMATION;
          timeout = animationTimeout;
          propCount = animationDurations.length;
        }
      } else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        type = timeout > 0
          ? transitionTimeout > animationTimeout
            ? TRANSITION
            : ANIMATION
          : null;
        propCount = type
          ? type === TRANSITION
            ? transitionDurations.length
            : animationDurations.length
          : 0;
      }
      var hasTransform =
        type === TRANSITION &&
        transformRE.test(styles[transitionProp + 'Property']);
      return {
        type: type,
        timeout: timeout,
        propCount: propCount,
        hasTransform: hasTransform
      }
    }
  
    function getTimeout (delays, durations) {
      /* istanbul ignore next */
      while (delays.length < durations.length) {
        delays = delays.concat(delays);
      }
  
      return Math.max.apply(null, durations.map(function (d, i) {
        return toMs(d) + toMs(delays[i])
      }))
    }
  
    // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
    // in a locale-dependent way, using a comma instead of a dot.
    // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
    // as a floor function) causing unexpected behaviors
    function toMs (s) {
      return Number(s.slice(0, -1).replace(',', '.')) * 1000
    }
  
    /*  */
  
    function enter (vnode, toggleDisplay) {
      var el = vnode.elm;
  
      // call leave callback now
      if (isDef(el._leaveCb)) {
        el._leaveCb.cancelled = true;
        el._leaveCb();
      }
  
      var data = resolveTransition(vnode.data.transition);
      if (isUndef(data)) {
        return
      }
  
      /* istanbul ignore if */
      if (isDef(el._enterCb) || el.nodeType !== 1) {
        return
      }
  
      var css = data.css;
      var type = data.type;
      var enterClass = data.enterClass;
      var enterToClass = data.enterToClass;
      var enterActiveClass = data.enterActiveClass;
      var appearClass = data.appearClass;
      var appearToClass = data.appearToClass;
      var appearActiveClass = data.appearActiveClass;
      var beforeEnter = data.beforeEnter;
      var enter = data.enter;
      var afterEnter = data.afterEnter;
      var enterCancelled = data.enterCancelled;
      var beforeAppear = data.beforeAppear;
      var appear = data.appear;
      var afterAppear = data.afterAppear;
      var appearCancelled = data.appearCancelled;
      var duration = data.duration;
  
      // activeInstance will always be the <transition> component managing this
      // transition. One edge case to check is when the <transition> is placed
      // as the root node of a child component. In that case we need to check
      // <transition>'s parent for appear check.
      var context = activeInstance;
      var transitionNode = activeInstance.$vnode;
      while (transitionNode && transitionNode.parent) {
        context = transitionNode.context;
        transitionNode = transitionNode.parent;
      }
  
      var isAppear = !context._isMounted || !vnode.isRootInsert;
  
      if (isAppear && !appear && appear !== '') {
        return
      }
  
      var startClass = isAppear && appearClass
        ? appearClass
        : enterClass;
      var activeClass = isAppear && appearActiveClass
        ? appearActiveClass
        : enterActiveClass;
      var toClass = isAppear && appearToClass
        ? appearToClass
        : enterToClass;
  
      var beforeEnterHook = isAppear
        ? (beforeAppear || beforeEnter)
        : beforeEnter;
      var enterHook = isAppear
        ? (typeof appear === 'function' ? appear : enter)
        : enter;
      var afterEnterHook = isAppear
        ? (afterAppear || afterEnter)
        : afterEnter;
      var enterCancelledHook = isAppear
        ? (appearCancelled || enterCancelled)
        : enterCancelled;
  
      var explicitEnterDuration = toNumber(
        isObject(duration)
          ? duration.enter
          : duration
      );
  
      if (explicitEnterDuration != null) {
        checkDuration(explicitEnterDuration, 'enter', vnode);
      }
  
      var expectsCSS = css !== false && !isIE9;
      var userWantsControl = getHookArgumentsLength(enterHook);
  
      var cb = el._enterCb = once(function () {
        if (expectsCSS) {
          removeTransitionClass(el, toClass);
          removeTransitionClass(el, activeClass);
        }
        if (cb.cancelled) {
          if (expectsCSS) {
            removeTransitionClass(el, startClass);
          }
          enterCancelledHook && enterCancelledHook(el);
        } else {
          afterEnterHook && afterEnterHook(el);
        }
        el._enterCb = null;
      });
  
      if (!vnode.data.show) {
        // remove pending leave element on enter by injecting an insert hook
        mergeVNodeHook(vnode, 'insert', function () {
          var parent = el.parentNode;
          var pendingNode = parent && parent._pending && parent._pending[vnode.key];
          if (pendingNode &&
            pendingNode.tag === vnode.tag &&
            pendingNode.elm._leaveCb
          ) {
            pendingNode.elm._leaveCb();
          }
          enterHook && enterHook(el, cb);
        });
      }
  
      // start enter transition
      beforeEnterHook && beforeEnterHook(el);
      if (expectsCSS) {
        addTransitionClass(el, startClass);
        addTransitionClass(el, activeClass);
        nextFrame(function () {
          removeTransitionClass(el, startClass);
          if (!cb.cancelled) {
            addTransitionClass(el, toClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitEnterDuration)) {
                setTimeout(cb, explicitEnterDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
  
      if (vnode.data.show) {
        toggleDisplay && toggleDisplay();
        enterHook && enterHook(el, cb);
      }
  
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  
    function leave (vnode, rm) {
      var el = vnode.elm;
  
      // call enter callback now
      if (isDef(el._enterCb)) {
        el._enterCb.cancelled = true;
        el._enterCb();
      }
  
      var data = resolveTransition(vnode.data.transition);
      if (isUndef(data) || el.nodeType !== 1) {
        return rm()
      }
  
      /* istanbul ignore if */
      if (isDef(el._leaveCb)) {
        return
      }
  
      var css = data.css;
      var type = data.type;
      var leaveClass = data.leaveClass;
      var leaveToClass = data.leaveToClass;
      var leaveActiveClass = data.leaveActiveClass;
      var beforeLeave = data.beforeLeave;
      var leave = data.leave;
      var afterLeave = data.afterLeave;
      var leaveCancelled = data.leaveCancelled;
      var delayLeave = data.delayLeave;
      var duration = data.duration;
  
      var expectsCSS = css !== false && !isIE9;
      var userWantsControl = getHookArgumentsLength(leave);
  
      var explicitLeaveDuration = toNumber(
        isObject(duration)
          ? duration.leave
          : duration
      );
  
      if (isDef(explicitLeaveDuration)) {
        checkDuration(explicitLeaveDuration, 'leave', vnode);
      }
  
      var cb = el._leaveCb = once(function () {
        if (el.parentNode && el.parentNode._pending) {
          el.parentNode._pending[vnode.key] = null;
        }
        if (expectsCSS) {
          removeTransitionClass(el, leaveToClass);
          removeTransitionClass(el, leaveActiveClass);
        }
        if (cb.cancelled) {
          if (expectsCSS) {
            removeTransitionClass(el, leaveClass);
          }
          leaveCancelled && leaveCancelled(el);
        } else {
          rm();
          afterLeave && afterLeave(el);
        }
        el._leaveCb = null;
      });
  
      if (delayLeave) {
        delayLeave(performLeave);
      } else {
        performLeave();
      }
  
      function performLeave () {
        // the delayed leave may have already been cancelled
        if (cb.cancelled) {
          return
        }
        // record leaving element
        if (!vnode.data.show && el.parentNode) {
          (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
        }
        beforeLeave && beforeLeave(el);
        if (expectsCSS) {
          addTransitionClass(el, leaveClass);
          addTransitionClass(el, leaveActiveClass);
          nextFrame(function () {
            removeTransitionClass(el, leaveClass);
            if (!cb.cancelled) {
              addTransitionClass(el, leaveToClass);
              if (!userWantsControl) {
                if (isValidDuration(explicitLeaveDuration)) {
                  setTimeout(cb, explicitLeaveDuration);
                } else {
                  whenTransitionEnds(el, type, cb);
                }
              }
            }
          });
        }
        leave && leave(el, cb);
        if (!expectsCSS && !userWantsControl) {
          cb();
        }
      }
    }
  
    // only used in dev mode
    function checkDuration (val, name, vnode) {
      if (typeof val !== 'number') {
        warn(
          "<transition> explicit " + name + " duration is not a valid number - " +
          "got " + (JSON.stringify(val)) + ".",
          vnode.context
        );
      } else if (isNaN(val)) {
        warn(
          "<transition> explicit " + name + " duration is NaN - " +
          'the duration expression might be incorrect.',
          vnode.context
        );
      }
    }
  
    function isValidDuration (val) {
      return typeof val === 'number' && !isNaN(val)
    }
  
    /**
     * Normalize a transition hook's argument length. The hook may be:
     * - a merged hook (invoker) with the original in .fns
     * - a wrapped component method (check ._length)
     * - a plain function (.length)
     */
    function getHookArgumentsLength (fn) {
      if (isUndef(fn)) {
        return false
      }
      var invokerFns = fn.fns;
      if (isDef(invokerFns)) {
        // invoker
        return getHookArgumentsLength(
          Array.isArray(invokerFns)
            ? invokerFns[0]
            : invokerFns
        )
      } else {
        return (fn._length || fn.length) > 1
      }
    }
  
    function _enter (_, vnode) {
      if (vnode.data.show !== true) {
        enter(vnode);
      }
    }
  
    var transition = inBrowser ? {
      create: _enter,
      activate: _enter,
      remove: function remove$$1 (vnode, rm) {
        /* istanbul ignore else */
        if (vnode.data.show !== true) {
          leave(vnode, rm);
        } else {
          rm();
        }
      }
    } : {};
  
    var platformModules = [
      attrs,
      klass,
      events,
      domProps,
      style,
      transition
    ];
  
    /*  */
  
    // the directive module should be applied last, after all
    // built-in modules have been applied.
    var modules = platformModules.concat(baseModules);
  
    var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });
  
    /**
     * Not type checking this file because flow doesn't like attaching
     * properties to Elements.
     */
  
    /* istanbul ignore if */
    if (isIE9) {
      // http://www.matts411.com/post/internet-explorer-9-oninput/
      document.addEventListener('selectionchange', function () {
        var el = document.activeElement;
        if (el && el.vmodel) {
          trigger(el, 'input');
        }
      });
    }
  
    var directive = {
      inserted: function inserted (el, binding, vnode, oldVnode) {
        if (vnode.tag === 'select') {
          // #6903
          if (oldVnode.elm && !oldVnode.elm._vOptions) {
            mergeVNodeHook(vnode, 'postpatch', function () {
              directive.componentUpdated(el, binding, vnode);
            });
          } else {
            setSelected(el, binding, vnode.context);
          }
          el._vOptions = [].map.call(el.options, getValue);
        } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
          el._vModifiers = binding.modifiers;
          if (!binding.modifiers.lazy) {
            el.addEventListener('compositionstart', onCompositionStart);
            el.addEventListener('compositionend', onCompositionEnd);
            // Safari < 10.2 & UIWebView doesn't fire compositionend when
            // switching focus before confirming composition choice
            // this also fixes the issue where some browsers e.g. iOS Chrome
            // fires "change" instead of "input" on autocomplete.
            el.addEventListener('change', onCompositionEnd);
            /* istanbul ignore if */
            if (isIE9) {
              el.vmodel = true;
            }
          }
        }
      },
  
      componentUpdated: function componentUpdated (el, binding, vnode) {
        if (vnode.tag === 'select') {
          setSelected(el, binding, vnode.context);
          // in case the options rendered by v-for have changed,
          // it's possible that the value is out-of-sync with the rendered options.
          // detect such cases and filter out values that no longer has a matching
          // option in the DOM.
          var prevOptions = el._vOptions;
          var curOptions = el._vOptions = [].map.call(el.options, getValue);
          if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
            // trigger change event if
            // no matching option found for at least one value
            var needReset = el.multiple
              ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
              : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
            if (needReset) {
              trigger(el, 'change');
            }
          }
        }
      }
    };
  
    function setSelected (el, binding, vm) {
      actuallySetSelected(el, binding, vm);
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(function () {
          actuallySetSelected(el, binding, vm);
        }, 0);
      }
    }
  
    function actuallySetSelected (el, binding, vm) {
      var value = binding.value;
      var isMultiple = el.multiple;
      if (isMultiple && !Array.isArray(value)) {
        warn(
          "<select multiple v-model=\"" + (binding.expression) + "\"> " +
          "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
          vm
        );
        return
      }
      var selected, option;
      for (var i = 0, l = el.options.length; i < l; i++) {
        option = el.options[i];
        if (isMultiple) {
          selected = looseIndexOf(value, getValue(option)) > -1;
          if (option.selected !== selected) {
            option.selected = selected;
          }
        } else {
          if (looseEqual(getValue(option), value)) {
            if (el.selectedIndex !== i) {
              el.selectedIndex = i;
            }
            return
          }
        }
      }
      if (!isMultiple) {
        el.selectedIndex = -1;
      }
    }
  
    function hasNoMatchingOption (value, options) {
      return options.every(function (o) { return !looseEqual(o, value); })
    }
  
    function getValue (option) {
      return '_value' in option
        ? option._value
        : option.value
    }
  
    function onCompositionStart (e) {
      e.target.composing = true;
    }
  
    function onCompositionEnd (e) {
      // prevent triggering an input event for no reason
      if (!e.target.composing) { return }
      e.target.composing = false;
      trigger(e.target, 'input');
    }
  
    function trigger (el, type) {
      var e = document.createEvent('HTMLEvents');
      e.initEvent(type, true, true);
      el.dispatchEvent(e);
    }
  
    /*  */
  
    // recursively search for possible transition defined inside the component root
    function locateNode (vnode) {
      return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
        ? locateNode(vnode.componentInstance._vnode)
        : vnode
    }
  
    var show = {
      bind: function bind (el, ref, vnode) {
        var value = ref.value;
  
        vnode = locateNode(vnode);
        var transition$$1 = vnode.data && vnode.data.transition;
        var originalDisplay = el.__vOriginalDisplay =
          el.style.display === 'none' ? '' : el.style.display;
        if (value && transition$$1) {
          vnode.data.show = true;
          enter(vnode, function () {
            el.style.display = originalDisplay;
          });
        } else {
          el.style.display = value ? originalDisplay : 'none';
        }
      },
  
      update: function update (el, ref, vnode) {
        var value = ref.value;
        var oldValue = ref.oldValue;
  
        /* istanbul ignore if */
        if (!value === !oldValue) { return }
        vnode = locateNode(vnode);
        var transition$$1 = vnode.data && vnode.data.transition;
        if (transition$$1) {
          vnode.data.show = true;
          if (value) {
            enter(vnode, function () {
              el.style.display = el.__vOriginalDisplay;
            });
          } else {
            leave(vnode, function () {
              el.style.display = 'none';
            });
          }
        } else {
          el.style.display = value ? el.__vOriginalDisplay : 'none';
        }
      },
  
      unbind: function unbind (
        el,
        binding,
        vnode,
        oldVnode,
        isDestroy
      ) {
        if (!isDestroy) {
          el.style.display = el.__vOriginalDisplay;
        }
      }
    };
  
    var platformDirectives = {
      model: directive,
      show: show
    };
  
    /*  */
  
    var transitionProps = {
      name: String,
      appear: Boolean,
      css: Boolean,
      mode: String,
      type: String,
      enterClass: String,
      leaveClass: String,
      enterToClass: String,
      leaveToClass: String,
      enterActiveClass: String,
      leaveActiveClass: String,
      appearClass: String,
      appearActiveClass: String,
      appearToClass: String,
      duration: [Number, String, Object]
    };
  
    // in case the child is also an abstract component, e.g. <keep-alive>
    // we want to recursively retrieve the real component to be rendered
    function getRealChild (vnode) {
      var compOptions = vnode && vnode.componentOptions;
      if (compOptions && compOptions.Ctor.options.abstract) {
        return getRealChild(getFirstComponentChild(compOptions.children))
      } else {
        return vnode
      }
    }
  
    function extractTransitionData (comp) {
      var data = {};
      var options = comp.$options;
      // props
      for (var key in options.propsData) {
        data[key] = comp[key];
      }
      // events.
      // extract listeners and pass them directly to the transition methods
      var listeners = options._parentListeners;
      for (var key$1 in listeners) {
        data[camelize(key$1)] = listeners[key$1];
      }
      return data
    }
  
    function placeholder (h, rawChild) {
      if (/\d-keep-alive$/.test(rawChild.tag)) {
        return h('keep-alive', {
          props: rawChild.componentOptions.propsData
        })
      }
    }
  
    function hasParentTransition (vnode) {
      while ((vnode = vnode.parent)) {
        if (vnode.data.transition) {
          return true
        }
      }
    }
  
    function isSameChild (child, oldChild) {
      return oldChild.key === child.key && oldChild.tag === child.tag
    }
  
    var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };
  
    var isVShowDirective = function (d) { return d.name === 'show'; };
  
    var Transition = {
      name: 'transition',
      props: transitionProps,
      abstract: true,
  
      render: function render (h) {
        var this$1 = this;
  
        var children = this.$slots.default;
        if (!children) {
          return
        }
  
        // filter out text nodes (possible whitespaces)
        children = children.filter(isNotTextNode);
        /* istanbul ignore if */
        if (!children.length) {
          return
        }
  
        // warn multiple elements
        if (children.length > 1) {
          warn(
            '<transition> can only be used on a single element. Use ' +
            '<transition-group> for lists.',
            this.$parent
          );
        }
  
        var mode = this.mode;
  
        // warn invalid mode
        if (mode && mode !== 'in-out' && mode !== 'out-in'
        ) {
          warn(
            'invalid <transition> mode: ' + mode,
            this.$parent
          );
        }
  
        var rawChild = children[0];
  
        // if this is a component root node and the component's
        // parent container node also has transition, skip.
        if (hasParentTransition(this.$vnode)) {
          return rawChild
        }
  
        // apply transition data to child
        // use getRealChild() to ignore abstract components e.g. keep-alive
        var child = getRealChild(rawChild);
        /* istanbul ignore if */
        if (!child) {
          return rawChild
        }
  
        if (this._leaving) {
          return placeholder(h, rawChild)
        }
  
        // ensure a key that is unique to the vnode type and to this transition
        // component instance. This key will be used to remove pending leaving nodes
        // during entering.
        var id = "__transition-" + (this._uid) + "-";
        child.key = child.key == null
          ? child.isComment
            ? id + 'comment'
            : id + child.tag
          : isPrimitive(child.key)
            ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
            : child.key;
  
        var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
        var oldRawChild = this._vnode;
        var oldChild = getRealChild(oldRawChild);
  
        // mark v-show
        // so that the transition module can hand over the control to the directive
        if (child.data.directives && child.data.directives.some(isVShowDirective)) {
          child.data.show = true;
        }
  
        if (
          oldChild &&
          oldChild.data &&
          !isSameChild(child, oldChild) &&
          !isAsyncPlaceholder(oldChild) &&
          // #6687 component root is a comment node
          !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
        ) {
          // replace old child transition data with fresh one
          // important for dynamic transitions!
          var oldData = oldChild.data.transition = extend({}, data);
          // handle transition mode
          if (mode === 'out-in') {
            // return placeholder node and queue update when leave finishes
            this._leaving = true;
            mergeVNodeHook(oldData, 'afterLeave', function () {
              this$1._leaving = false;
              this$1.$forceUpdate();
            });
            return placeholder(h, rawChild)
          } else if (mode === 'in-out') {
            if (isAsyncPlaceholder(child)) {
              return oldRawChild
            }
            var delayedLeave;
            var performLeave = function () { delayedLeave(); };
            mergeVNodeHook(data, 'afterEnter', performLeave);
            mergeVNodeHook(data, 'enterCancelled', performLeave);
            mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
          }
        }
  
        return rawChild
      }
    };
  
    /*  */
  
    var props = extend({
      tag: String,
      moveClass: String
    }, transitionProps);
  
    delete props.mode;
  
    var TransitionGroup = {
      props: props,
  
      beforeMount: function beforeMount () {
        var this$1 = this;
  
        var update = this._update;
        this._update = function (vnode, hydrating) {
          var restoreActiveInstance = setActiveInstance(this$1);
          // force removing pass
          this$1.__patch__(
            this$1._vnode,
            this$1.kept,
            false, // hydrating
            true // removeOnly (!important, avoids unnecessary moves)
          );
          this$1._vnode = this$1.kept;
          restoreActiveInstance();
          update.call(this$1, vnode, hydrating);
        };
      },
  
      render: function render (h) {
        var tag = this.tag || this.$vnode.data.tag || 'span';
        var map = Object.create(null);
        var prevChildren = this.prevChildren = this.children;
        var rawChildren = this.$slots.default || [];
        var children = this.children = [];
        var transitionData = extractTransitionData(this);
  
        for (var i = 0; i < rawChildren.length; i++) {
          var c = rawChildren[i];
          if (c.tag) {
            if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
              children.push(c);
              map[c.key] = c
              ;(c.data || (c.data = {})).transition = transitionData;
            } else {
              var opts = c.componentOptions;
              var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
              warn(("<transition-group> children must be keyed: <" + name + ">"));
            }
          }
        }
  
        if (prevChildren) {
          var kept = [];
          var removed = [];
          for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
            var c$1 = prevChildren[i$1];
            c$1.data.transition = transitionData;
            c$1.data.pos = c$1.elm.getBoundingClientRect();
            if (map[c$1.key]) {
              kept.push(c$1);
            } else {
              removed.push(c$1);
            }
          }
          this.kept = h(tag, null, kept);
          this.removed = removed;
        }
  
        return h(tag, null, children)
      },
  
      updated: function updated () {
        var children = this.prevChildren;
        var moveClass = this.moveClass || ((this.name || 'v') + '-move');
        if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
          return
        }
  
        // we divide the work into three loops to avoid mixing DOM reads and writes
        // in each iteration - which helps prevent layout thrashing.
        children.forEach(callPendingCbs);
        children.forEach(recordPosition);
        children.forEach(applyTranslation);
  
        // force reflow to put everything in position
        // assign to this to avoid being removed in tree-shaking
        // $flow-disable-line
        this._reflow = document.body.offsetHeight;
  
        children.forEach(function (c) {
          if (c.data.moved) {
            var el = c.elm;
            var s = el.style;
            addTransitionClass(el, moveClass);
            s.transform = s.WebkitTransform = s.transitionDuration = '';
            el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
              if (e && e.target !== el) {
                return
              }
              if (!e || /transform$/.test(e.propertyName)) {
                el.removeEventListener(transitionEndEvent, cb);
                el._moveCb = null;
                removeTransitionClass(el, moveClass);
              }
            });
          }
        });
      },
  
      methods: {
        hasMove: function hasMove (el, moveClass) {
          /* istanbul ignore if */
          if (!hasTransition) {
            return false
          }
          /* istanbul ignore if */
          if (this._hasMove) {
            return this._hasMove
          }
          // Detect whether an element with the move class applied has
          // CSS transitions. Since the element may be inside an entering
          // transition at this very moment, we make a clone of it and remove
          // all other transition classes applied to ensure only the move class
          // is applied.
          var clone = el.cloneNode();
          if (el._transitionClasses) {
            el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
          }
          addClass(clone, moveClass);
          clone.style.display = 'none';
          this.$el.appendChild(clone);
          var info = getTransitionInfo(clone);
          this.$el.removeChild(clone);
          return (this._hasMove = info.hasTransform)
        }
      }
    };
  
    function callPendingCbs (c) {
      /* istanbul ignore if */
      if (c.elm._moveCb) {
        c.elm._moveCb();
      }
      /* istanbul ignore if */
      if (c.elm._enterCb) {
        c.elm._enterCb();
      }
    }
  
    function recordPosition (c) {
      c.data.newPos = c.elm.getBoundingClientRect();
    }
  
    function applyTranslation (c) {
      var oldPos = c.data.pos;
      var newPos = c.data.newPos;
      var dx = oldPos.left - newPos.left;
      var dy = oldPos.top - newPos.top;
      if (dx || dy) {
        c.data.moved = true;
        var s = c.elm.style;
        s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
        s.transitionDuration = '0s';
      }
    }
  
    var platformComponents = {
      Transition: Transition,
      TransitionGroup: TransitionGroup
    };
  
    /*  */
  
    // install platform specific utils
    Vue.config.mustUseProp = mustUseProp;
    Vue.config.isReservedTag = isReservedTag;
    Vue.config.isReservedAttr = isReservedAttr;
    Vue.config.getTagNamespace = getTagNamespace;
    Vue.config.isUnknownElement = isUnknownElement;
  
    // install platform runtime directives & components
    extend(Vue.options.directives, platformDirectives);
    extend(Vue.options.components, platformComponents);
  
    // install platform patch function
    Vue.prototype.__patch__ = inBrowser ? patch : noop;
  
    // public mount method
    Vue.prototype.$mount = function (
      el,
      hydrating
    ) {
      el = el && inBrowser ? query(el) : undefined;
      return mountComponent(this, el, hydrating)
    };
  
    // devtools global hook
    /* istanbul ignore next */
    if (inBrowser) {
      setTimeout(function () {
        if (config.devtools) {
          if (devtools) {
            devtools.emit('init', Vue);
          } else {
            console[console.info ? 'info' : 'log'](
              'Download the Vue Devtools extension for a better development experience:\n' +
              'https://github.com/vuejs/vue-devtools'
            );
          }
        }
        if (config.productionTip !== false &&
          typeof console !== 'undefined'
        ) {
          console[console.info ? 'info' : 'log'](
            "You are running Vue in development mode.\n" +
            "Make sure to turn on production mode when deploying for production.\n" +
            "See more tips at https://vuejs.org/guide/deployment.html"
          );
        }
      }, 0);
    }
  
    /*  */
  
    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
    var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
  
    var buildRegex = cached(function (delimiters) {
      var open = delimiters[0].replace(regexEscapeRE, '\\$&');
      var close = delimiters[1].replace(regexEscapeRE, '\\$&');
      return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
    });
  
  
  
    function parseText (
      text,
      delimiters
    ) {
      var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
      if (!tagRE.test(text)) {
        return
      }
      var tokens = [];
      var rawTokens = [];
      var lastIndex = tagRE.lastIndex = 0;
      var match, index, tokenValue;
      while ((match = tagRE.exec(text))) {
        index = match.index;
        // push text token
        if (index > lastIndex) {
          rawTokens.push(tokenValue = text.slice(lastIndex, index));
          tokens.push(JSON.stringify(tokenValue));
        }
        // tag token
        var exp = parseFilters(match[1].trim());
        tokens.push(("_s(" + exp + ")"));
        rawTokens.push({ '@binding': exp });
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        rawTokens.push(tokenValue = text.slice(lastIndex));
        tokens.push(JSON.stringify(tokenValue));
      }
      return {
        expression: tokens.join('+'),
        tokens: rawTokens
      }
    }
  
    /*  */
  
    function transformNode (el, options) {
      var warn = options.warn || baseWarn;
      var staticClass = getAndRemoveAttr(el, 'class');
      if (staticClass) {
        var res = parseText(staticClass, options.delimiters);
        if (res) {
          warn(
            "class=\"" + staticClass + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div class="{{ val }}">, use <div :class="val">.',
            el.rawAttrsMap['class']
          );
        }
      }
      if (staticClass) {
        el.staticClass = JSON.stringify(staticClass);
      }
      var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
      if (classBinding) {
        el.classBinding = classBinding;
      }
    }
  
    function genData (el) {
      var data = '';
      if (el.staticClass) {
        data += "staticClass:" + (el.staticClass) + ",";
      }
      if (el.classBinding) {
        data += "class:" + (el.classBinding) + ",";
      }
      return data
    }
  
    var klass$1 = {
      staticKeys: ['staticClass'],
      transformNode: transformNode,
      genData: genData
    };
  
    /*  */
  
    function transformNode$1 (el, options) {
      var warn = options.warn || baseWarn;
      var staticStyle = getAndRemoveAttr(el, 'style');
      if (staticStyle) {
        /* istanbul ignore if */
        {
          var res = parseText(staticStyle, options.delimiters);
          if (res) {
            warn(
              "style=\"" + staticStyle + "\": " +
              'Interpolation inside attributes has been removed. ' +
              'Use v-bind or the colon shorthand instead. For example, ' +
              'instead of <div style="{{ val }}">, use <div :style="val">.',
              el.rawAttrsMap['style']
            );
          }
        }
        el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
      }
  
      var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
      if (styleBinding) {
        el.styleBinding = styleBinding;
      }
    }
  
    function genData$1 (el) {
      var data = '';
      if (el.staticStyle) {
        data += "staticStyle:" + (el.staticStyle) + ",";
      }
      if (el.styleBinding) {
        data += "style:(" + (el.styleBinding) + "),";
      }
      return data
    }
  
    var style$1 = {
      staticKeys: ['staticStyle'],
      transformNode: transformNode$1,
      genData: genData$1
    };
  
    /*  */
  
    var decoder;
  
    var he = {
      decode: function decode (html) {
        decoder = decoder || document.createElement('div');
        decoder.innerHTML = html;
        return decoder.textContent
      }
    };
  
    /*  */
  
    var isUnaryTag = makeMap(
      'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
      'link,meta,param,source,track,wbr'
    );
  
    // Elements that you can, intentionally, leave open
    // (and which close themselves)
    var canBeLeftOpenTag = makeMap(
      'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
    );
  
    // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
    // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
    var isNonPhrasingTag = makeMap(
      'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
      'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
      'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
      'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
      'title,tr,track'
    );
  
    /**
     * Not type-checking this file because it's mostly vendor code.
     */
  
    // Regular Expressions for parsing tags and attributes
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + (unicodeRegExp.source) + "]*";
    var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
    var startTagOpen = new RegExp(("^<" + qnameCapture));
    var startTagClose = /^\s*(\/?)>/;
    var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
    var doctype = /^<!DOCTYPE [^>]+>/i;
    // #7298: escape - to avoid being passed as HTML comment when inlined in page
    var comment = /^<!\--/;
    var conditionalComment = /^<!\[/;
  
    // Special Elements (can contain anything)
    var isPlainTextElement = makeMap('script,style,textarea', true);
    var reCache = {};
  
    var decodingMap = {
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&amp;': '&',
      '&#10;': '\n',
      '&#9;': '\t',
      '&#39;': "'"
    };
    var encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
    var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;
  
    // #5992
    var isIgnoreNewlineTag = makeMap('pre,textarea', true);
    var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };
  
    function decodeAttr (value, shouldDecodeNewlines) {
      var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
      return value.replace(re, function (match) { return decodingMap[match]; })
    }
  
    function parseHTML (html, options) {
      var stack = [];
      var expectHTML = options.expectHTML;
      var isUnaryTag$$1 = options.isUnaryTag || no;
      var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
      var index = 0;
      var last, lastTag;
      while (html) {
        last = html;
        // Make sure we're not in a plaintext content element like script/style
        if (!lastTag || !isPlainTextElement(lastTag)) {
          var textEnd = html.indexOf('<');
          if (textEnd === 0) {
            // Comment:
            if (comment.test(html)) {
              var commentEnd = html.indexOf('-->');
  
              if (commentEnd >= 0) {
                if (options.shouldKeepComment) {
                  options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
                }
                advance(commentEnd + 3);
                continue
              }
            }
  
            // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
            if (conditionalComment.test(html)) {
              var conditionalEnd = html.indexOf(']>');
  
              if (conditionalEnd >= 0) {
                advance(conditionalEnd + 2);
                continue
              }
            }
  
            // Doctype:
            var doctypeMatch = html.match(doctype);
            if (doctypeMatch) {
              advance(doctypeMatch[0].length);
              continue
            }
  
            // End tag:
            var endTagMatch = html.match(endTag);
            if (endTagMatch) {
              var curIndex = index;
              advance(endTagMatch[0].length);
              parseEndTag(endTagMatch[1], curIndex, index);
              continue
            }
  
            // Start tag:
            var startTagMatch = parseStartTag();
            if (startTagMatch) {
              handleStartTag(startTagMatch);
              if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
                advance(1);
              }
              continue
            }
          }
  
          var text = (void 0), rest = (void 0), next = (void 0);
          if (textEnd >= 0) {
            rest = html.slice(textEnd);
            while (
              !endTag.test(rest) &&
              !startTagOpen.test(rest) &&
              !comment.test(rest) &&
              !conditionalComment.test(rest)
            ) {
              // < in plain text, be forgiving and treat it as text
              next = rest.indexOf('<', 1);
              if (next < 0) { break }
              textEnd += next;
              rest = html.slice(textEnd);
            }
            text = html.substring(0, textEnd);
          }
  
          if (textEnd < 0) {
            text = html;
          }
  
          if (text) {
            advance(text.length);
          }
  
          if (options.chars && text) {
            options.chars(text, index - text.length, index);
          }
        } else {
          var endTagLength = 0;
          var stackedTag = lastTag.toLowerCase();
          var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
          var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
            endTagLength = endTag.length;
            if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
              text = text
                .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
                .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
            }
            if (shouldIgnoreFirstNewline(stackedTag, text)) {
              text = text.slice(1);
            }
            if (options.chars) {
              options.chars(text);
            }
            return ''
          });
          index += html.length - rest$1.length;
          html = rest$1;
          parseEndTag(stackedTag, index - endTagLength, index);
        }
  
        if (html === last) {
          options.chars && options.chars(html);
          if (!stack.length && options.warn) {
            options.warn(("Mal-formatted tag at end of template: \"" + html + "\""), { start: index + html.length });
          }
          break
        }
      }
  
      // Clean up any remaining tags
      parseEndTag();
  
      function advance (n) {
        index += n;
        html = html.substring(n);
      }
  
      function parseStartTag () {
        var start = html.match(startTagOpen);
        if (start) {
          var match = {
            tagName: start[1],
            attrs: [],
            start: index
          };
          advance(start[0].length);
          var end, attr;
          while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
            attr.start = index;
            advance(attr[0].length);
            attr.end = index;
            match.attrs.push(attr);
          }
          if (end) {
            match.unarySlash = end[1];
            advance(end[0].length);
            match.end = index;
            return match
          }
        }
      }
  
      function handleStartTag (match) {
        var tagName = match.tagName;
        var unarySlash = match.unarySlash;
  
        if (expectHTML) {
          if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
            parseEndTag(lastTag);
          }
          if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
            parseEndTag(tagName);
          }
        }
  
        var unary = isUnaryTag$$1(tagName) || !!unarySlash;
  
        var l = match.attrs.length;
        var attrs = new Array(l);
        for (var i = 0; i < l; i++) {
          var args = match.attrs[i];
          var value = args[3] || args[4] || args[5] || '';
          var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
            ? options.shouldDecodeNewlinesForHref
            : options.shouldDecodeNewlines;
          attrs[i] = {
            name: args[1],
            value: decodeAttr(value, shouldDecodeNewlines)
          };
          if (options.outputSourceRange) {
            attrs[i].start = args.start + args[0].match(/^\s*/).length;
            attrs[i].end = args.end;
          }
        }
  
        if (!unary) {
          stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
          lastTag = tagName;
        }
  
        if (options.start) {
          options.start(tagName, attrs, unary, match.start, match.end);
        }
      }
  
      function parseEndTag (tagName, start, end) {
        var pos, lowerCasedTagName;
        if (start == null) { start = index; }
        if (end == null) { end = index; }
  
        // Find the closest opened tag of the same type
        if (tagName) {
          lowerCasedTagName = tagName.toLowerCase();
          for (pos = stack.length - 1; pos >= 0; pos--) {
            if (stack[pos].lowerCasedTag === lowerCasedTagName) {
              break
            }
          }
        } else {
          // If no tag name is provided, clean shop
          pos = 0;
        }
  
        if (pos >= 0) {
          // Close all the open elements, up the stack
          for (var i = stack.length - 1; i >= pos; i--) {
            if (i > pos || !tagName &&
              options.warn
            ) {
              options.warn(
                ("tag <" + (stack[i].tag) + "> has no matching end tag."),
                { start: stack[i].start, end: stack[i].end }
              );
            }
            if (options.end) {
              options.end(stack[i].tag, start, end);
            }
          }
  
          // Remove the open elements from the stack
          stack.length = pos;
          lastTag = pos && stack[pos - 1].tag;
        } else if (lowerCasedTagName === 'br') {
          if (options.start) {
            options.start(tagName, [], true, start, end);
          }
        } else if (lowerCasedTagName === 'p') {
          if (options.start) {
            options.start(tagName, [], false, start, end);
          }
          if (options.end) {
            options.end(tagName, start, end);
          }
        }
      }
    }
  
    /*  */
  
    var onRE = /^@|^v-on:/;
    var dirRE = /^v-|^@|^:|^#/;
    var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    var stripParensRE = /^\(|\)$/g;
    var dynamicArgRE = /^\[.*\]$/;
  
    var argRE = /:(.*)$/;
    var bindRE = /^:|^\.|^v-bind:/;
    var modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;
  
    var slotRE = /^v-slot(:|$)|^#/;
  
    var lineBreakRE = /[\r\n]/;
    var whitespaceRE$1 = /\s+/g;
  
    var invalidAttributeRE = /[\s"'<>\/=]/;
  
    var decodeHTMLCached = cached(he.decode);
  
    var emptySlotScopeToken = "_empty_";
  
    // configurable state
    var warn$2;
    var delimiters;
    var transforms;
    var preTransforms;
    var postTransforms;
    var platformIsPreTag;
    var platformMustUseProp;
    var platformGetTagNamespace;
    var maybeComponent;
  
    function createASTElement (
      tag,
      attrs,
      parent
    ) {
      return {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        rawAttrsMap: {},
        parent: parent,
        children: []
      }
    }
  
    /**
     * Convert HTML string to AST.
     */
    function parse (
      template,
      options
    ) {
      warn$2 = options.warn || baseWarn;
  
      platformIsPreTag = options.isPreTag || no;
      platformMustUseProp = options.mustUseProp || no;
      platformGetTagNamespace = options.getTagNamespace || no;
      var isReservedTag = options.isReservedTag || no;
      maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };
  
      transforms = pluckModuleFunction(options.modules, 'transformNode');
      preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
      postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
  
      delimiters = options.delimiters;
  
      var stack = [];
      var preserveWhitespace = options.preserveWhitespace !== false;
      var whitespaceOption = options.whitespace;
      var root;
      var currentParent;
      var inVPre = false;
      var inPre = false;
      var warned = false;
  
      function warnOnce (msg, range) {
        if (!warned) {
          warned = true;
          warn$2(msg, range);
        }
      }
  
      function closeElement (element) {
        trimEndingWhitespace(element);
        if (!inVPre && !element.processed) {
          element = processElement(element, options);
        }
        // tree management
        if (!stack.length && element !== root) {
          // allow root elements with v-if, v-else-if and v-else
          if (root.if && (element.elseif || element.else)) {
            {
              checkRootConstraints(element);
            }
            addIfCondition(root, {
              exp: element.elseif,
              block: element
            });
          } else {
            warnOnce(
              "Component template should contain exactly one root element. " +
              "If you are using v-if on multiple elements, " +
              "use v-else-if to chain them instead.",
              { start: element.start }
            );
          }
        }
        if (currentParent && !element.forbidden) {
          if (element.elseif || element.else) {
            processIfConditions(element, currentParent);
          } else {
            if (element.slotScope) {
              // scoped slot
              // keep it in the children list so that v-else(-if) conditions can
              // find it as the prev node.
              var name = element.slotTarget || '"default"'
              ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
            }
            currentParent.children.push(element);
            element.parent = currentParent;
          }
        }
  
        // final children cleanup
        // filter out scoped slots
        element.children = element.children.filter(function (c) { return !(c).slotScope; });
        // remove trailing whitespace node again
        trimEndingWhitespace(element);
  
        // check pre state
        if (element.pre) {
          inVPre = false;
        }
        if (platformIsPreTag(element.tag)) {
          inPre = false;
        }
        // apply post-transforms
        for (var i = 0; i < postTransforms.length; i++) {
          postTransforms[i](element, options);
        }
      }
  
      function trimEndingWhitespace (el) {
        // remove trailing whitespace node
        if (!inPre) {
          var lastNode;
          while (
            (lastNode = el.children[el.children.length - 1]) &&
            lastNode.type === 3 &&
            lastNode.text === ' '
          ) {
            el.children.pop();
          }
        }
      }
  
      function checkRootConstraints (el) {
        if (el.tag === 'slot' || el.tag === 'template') {
          warnOnce(
            "Cannot use <" + (el.tag) + "> as component root element because it may " +
            'contain multiple nodes.',
            { start: el.start }
          );
        }
        if (el.attrsMap.hasOwnProperty('v-for')) {
          warnOnce(
            'Cannot use v-for on stateful component root element because ' +
            'it renders multiple elements.',
            el.rawAttrsMap['v-for']
          );
        }
      }
  
      parseHTML(template, {
        warn: warn$2,
        expectHTML: options.expectHTML,
        isUnaryTag: options.isUnaryTag,
        canBeLeftOpenTag: options.canBeLeftOpenTag,
        shouldDecodeNewlines: options.shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
        shouldKeepComment: options.comments,
        outputSourceRange: options.outputSourceRange,
        start: function start (tag, attrs, unary, start$1, end) {
          // check namespace.
          // inherit parent ns if there is one
          var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);
  
          // handle IE svg bug
          /* istanbul ignore if */
          if (isIE && ns === 'svg') {
            attrs = guardIESVGBug(attrs);
          }
  
          var element = createASTElement(tag, attrs, currentParent);
          if (ns) {
            element.ns = ns;
          }
  
          {
            if (options.outputSourceRange) {
              element.start = start$1;
              element.end = end;
              element.rawAttrsMap = element.attrsList.reduce(function (cumulated, attr) {
                cumulated[attr.name] = attr;
                return cumulated
              }, {});
            }
            attrs.forEach(function (attr) {
              if (invalidAttributeRE.test(attr.name)) {
                warn$2(
                  "Invalid dynamic argument expression: attribute names cannot contain " +
                  "spaces, quotes, <, >, / or =.",
                  {
                    start: attr.start + attr.name.indexOf("["),
                    end: attr.start + attr.name.length
                  }
                );
              }
            });
          }
  
          if (isForbiddenTag(element) && !isServerRendering()) {
            element.forbidden = true;
            warn$2(
              'Templates should only be responsible for mapping the state to the ' +
              'UI. Avoid placing tags with side-effects in your templates, such as ' +
              "<" + tag + ">" + ', as they will not be parsed.',
              { start: element.start }
            );
          }
  
          // apply pre-transforms
          for (var i = 0; i < preTransforms.length; i++) {
            element = preTransforms[i](element, options) || element;
          }
  
          if (!inVPre) {
            processPre(element);
            if (element.pre) {
              inVPre = true;
            }
          }
          if (platformIsPreTag(element.tag)) {
            inPre = true;
          }
          if (inVPre) {
            processRawAttrs(element);
          } else if (!element.processed) {
            // structural directives
            processFor(element);
            processIf(element);
            processOnce(element);
          }
  
          if (!root) {
            root = element;
            {
              checkRootConstraints(root);
            }
          }
  
          if (!unary) {
            currentParent = element;
            stack.push(element);
          } else {
            closeElement(element);
          }
        },
  
        end: function end (tag, start, end$1) {
          var element = stack[stack.length - 1];
          // pop stack
          stack.length -= 1;
          currentParent = stack[stack.length - 1];
          if (options.outputSourceRange) {
            element.end = end$1;
          }
          closeElement(element);
        },
  
        chars: function chars (text, start, end) {
          if (!currentParent) {
            {
              if (text === template) {
                warnOnce(
                  'Component template requires a root element, rather than just text.',
                  { start: start }
                );
              } else if ((text = text.trim())) {
                warnOnce(
                  ("text \"" + text + "\" outside root element will be ignored."),
                  { start: start }
                );
              }
            }
            return
          }
          // IE textarea placeholder bug
          /* istanbul ignore if */
          if (isIE &&
            currentParent.tag === 'textarea' &&
            currentParent.attrsMap.placeholder === text
          ) {
            return
          }
          var children = currentParent.children;
          if (inPre || text.trim()) {
            text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
          } else if (!children.length) {
            // remove the whitespace-only node right after an opening tag
            text = '';
          } else if (whitespaceOption) {
            if (whitespaceOption === 'condense') {
              // in condense mode, remove the whitespace node if it contains
              // line break, otherwise condense to a single space
              text = lineBreakRE.test(text) ? '' : ' ';
            } else {
              text = ' ';
            }
          } else {
            text = preserveWhitespace ? ' ' : '';
          }
          if (text) {
            if (!inPre && whitespaceOption === 'condense') {
              // condense consecutive whitespaces into single space
              text = text.replace(whitespaceRE$1, ' ');
            }
            var res;
            var child;
            if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
              child = {
                type: 2,
                expression: res.expression,
                tokens: res.tokens,
                text: text
              };
            } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
              child = {
                type: 3,
                text: text
              };
            }
            if (child) {
              if (options.outputSourceRange) {
                child.start = start;
                child.end = end;
              }
              children.push(child);
            }
          }
        },
        comment: function comment (text, start, end) {
          // adding anyting as a sibling to the root node is forbidden
          // comments should still be allowed, but ignored
          if (currentParent) {
            var child = {
              type: 3,
              text: text,
              isComment: true
            };
            if (options.outputSourceRange) {
              child.start = start;
              child.end = end;
            }
            currentParent.children.push(child);
          }
        }
      });
      return root
    }
  
    function processPre (el) {
      if (getAndRemoveAttr(el, 'v-pre') != null) {
        el.pre = true;
      }
    }
  
    function processRawAttrs (el) {
      var list = el.attrsList;
      var len = list.length;
      if (len) {
        var attrs = el.attrs = new Array(len);
        for (var i = 0; i < len; i++) {
          attrs[i] = {
            name: list[i].name,
            value: JSON.stringify(list[i].value)
          };
          if (list[i].start != null) {
            attrs[i].start = list[i].start;
            attrs[i].end = list[i].end;
          }
        }
      } else if (!el.pre) {
        // non root node in pre blocks with no attributes
        el.plain = true;
      }
    }
  
    function processElement (
      element,
      options
    ) {
      processKey(element);
  
      // determine whether this is a plain element after
      // removing structural attributes
      element.plain = (
        !element.key &&
        !element.scopedSlots &&
        !element.attrsList.length
      );
  
      processRef(element);
      processSlotContent(element);
      processSlotOutlet(element);
      processComponent(element);
      for (var i = 0; i < transforms.length; i++) {
        element = transforms[i](element, options) || element;
      }
      processAttrs(element);
      return element
    }
  
    function processKey (el) {
      var exp = getBindingAttr(el, 'key');
      if (exp) {
        {
          if (el.tag === 'template') {
            warn$2(
              "<template> cannot be keyed. Place the key on real elements instead.",
              getRawBindingAttr(el, 'key')
            );
          }
          if (el.for) {
            var iterator = el.iterator2 || el.iterator1;
            var parent = el.parent;
            if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
              warn$2(
                "Do not use v-for index as key on <transition-group> children, " +
                "this is the same as not using keys.",
                getRawBindingAttr(el, 'key'),
                true /* tip */
              );
            }
          }
        }
        el.key = exp;
      }
    }
  
    function processRef (el) {
      var ref = getBindingAttr(el, 'ref');
      if (ref) {
        el.ref = ref;
        el.refInFor = checkInFor(el);
      }
    }
  
    function processFor (el) {
      var exp;
      if ((exp = getAndRemoveAttr(el, 'v-for'))) {
        var res = parseFor(exp);
        if (res) {
          extend(el, res);
        } else {
          warn$2(
            ("Invalid v-for expression: " + exp),
            el.rawAttrsMap['v-for']
          );
        }
      }
    }
  
  
  
    function parseFor (exp) {
      var inMatch = exp.match(forAliasRE);
      if (!inMatch) { return }
      var res = {};
      res.for = inMatch[2].trim();
      var alias = inMatch[1].trim().replace(stripParensRE, '');
      var iteratorMatch = alias.match(forIteratorRE);
      if (iteratorMatch) {
        res.alias = alias.replace(forIteratorRE, '').trim();
        res.iterator1 = iteratorMatch[1].trim();
        if (iteratorMatch[2]) {
          res.iterator2 = iteratorMatch[2].trim();
        }
      } else {
        res.alias = alias;
      }
      return res
    }
  
    function processIf (el) {
      var exp = getAndRemoveAttr(el, 'v-if');
      if (exp) {
        el.if = exp;
        addIfCondition(el, {
          exp: exp,
          block: el
        });
      } else {
        if (getAndRemoveAttr(el, 'v-else') != null) {
          el.else = true;
        }
        var elseif = getAndRemoveAttr(el, 'v-else-if');
        if (elseif) {
          el.elseif = elseif;
        }
      }
    }
  
    function processIfConditions (el, parent) {
      var prev = findPrevElement(parent.children);
      if (prev && prev.if) {
        addIfCondition(prev, {
          exp: el.elseif,
          block: el
        });
      } else {
        warn$2(
          "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
          "used on element <" + (el.tag) + "> without corresponding v-if.",
          el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
        );
      }
    }
  
    function findPrevElement (children) {
      var i = children.length;
      while (i--) {
        if (children[i].type === 1) {
          return children[i]
        } else {
          if (children[i].text !== ' ') {
            warn$2(
              "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
              "will be ignored.",
              children[i]
            );
          }
          children.pop();
        }
      }
    }
  
    function addIfCondition (el, condition) {
      if (!el.ifConditions) {
        el.ifConditions = [];
      }
      el.ifConditions.push(condition);
    }
  
    function processOnce (el) {
      var once$$1 = getAndRemoveAttr(el, 'v-once');
      if (once$$1 != null) {
        el.once = true;
      }
    }
  
    // handle content being passed to a component as slot,
    // e.g. <template slot="xxx">, <div slot-scope="xxx">
    function processSlotContent (el) {
      var slotScope;
      if (el.tag === 'template') {
        slotScope = getAndRemoveAttr(el, 'scope');
        /* istanbul ignore if */
        if (slotScope) {
          warn$2(
            "the \"scope\" attribute for scoped slots have been deprecated and " +
            "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
            "can also be used on plain elements in addition to <template> to " +
            "denote scoped slots.",
            el.rawAttrsMap['scope'],
            true
          );
        }
        el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
      } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
        /* istanbul ignore if */
        if (el.attrsMap['v-for']) {
          warn$2(
            "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
            "(v-for takes higher priority). Use a wrapper <template> for the " +
            "scoped slot to make it clearer.",
            el.rawAttrsMap['slot-scope'],
            true
          );
        }
        el.slotScope = slotScope;
      }
  
      // slot="xxx"
      var slotTarget = getBindingAttr(el, 'slot');
      if (slotTarget) {
        el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
        el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
        // preserve slot as an attribute for native shadow DOM compat
        // only for non-scoped slots.
        if (el.tag !== 'template' && !el.slotScope) {
          addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
        }
      }
  
      // 2.6 v-slot syntax
      {
        if (el.tag === 'template') {
          // v-slot on <template>
          var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
          if (slotBinding) {
            {
              if (el.slotTarget || el.slotScope) {
                warn$2(
                  "Unexpected mixed usage of different slot syntaxes.",
                  el
                );
              }
              if (el.parent && !maybeComponent(el.parent)) {
                warn$2(
                  "<template v-slot> can only appear at the root level inside " +
                  "the receiving component",
                  el
                );
              }
            }
            var ref = getSlotName(slotBinding);
            var name = ref.name;
            var dynamic = ref.dynamic;
            el.slotTarget = name;
            el.slotTargetDynamic = dynamic;
            el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
          }
        } else {
          // v-slot on component, denotes default slot
          var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);
          if (slotBinding$1) {
            {
              if (!maybeComponent(el)) {
                warn$2(
                  "v-slot can only be used on components or <template>.",
                  slotBinding$1
                );
              }
              if (el.slotScope || el.slotTarget) {
                warn$2(
                  "Unexpected mixed usage of different slot syntaxes.",
                  el
                );
              }
              if (el.scopedSlots) {
                warn$2(
                  "To avoid scope ambiguity, the default slot should also use " +
                  "<template> syntax when there are other named slots.",
                  slotBinding$1
                );
              }
            }
            // add the component's children to its default slot
            var slots = el.scopedSlots || (el.scopedSlots = {});
            var ref$1 = getSlotName(slotBinding$1);
            var name$1 = ref$1.name;
            var dynamic$1 = ref$1.dynamic;
            var slotContainer = slots[name$1] = createASTElement('template', [], el);
            slotContainer.slotTarget = name$1;
            slotContainer.slotTargetDynamic = dynamic$1;
            slotContainer.children = el.children.filter(function (c) {
              if (!c.slotScope) {
                c.parent = slotContainer;
                return true
              }
            });
            slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken;
            // remove children as they are returned from scopedSlots now
            el.children = [];
            // mark el non-plain so data gets generated
            el.plain = false;
          }
        }
      }
    }
  
    function getSlotName (binding) {
      var name = binding.name.replace(slotRE, '');
      if (!name) {
        if (binding.name[0] !== '#') {
          name = 'default';
        } else {
          warn$2(
            "v-slot shorthand syntax requires a slot name.",
            binding
          );
        }
      }
      return dynamicArgRE.test(name)
        // dynamic [name]
        ? { name: name.slice(1, -1), dynamic: true }
        // static name
        : { name: ("\"" + name + "\""), dynamic: false }
    }
  
    // handle <slot/> outlets
    function processSlotOutlet (el) {
      if (el.tag === 'slot') {
        el.slotName = getBindingAttr(el, 'name');
        if (el.key) {
          warn$2(
            "`key` does not work on <slot> because slots are abstract outlets " +
            "and can possibly expand into multiple elements. " +
            "Use the key on a wrapping element instead.",
            getRawBindingAttr(el, 'key')
          );
        }
      }
    }
  
    function processComponent (el) {
      var binding;
      if ((binding = getBindingAttr(el, 'is'))) {
        el.component = binding;
      }
      if (getAndRemoveAttr(el, 'inline-template') != null) {
        el.inlineTemplate = true;
      }
    }
  
    function processAttrs (el) {
      var list = el.attrsList;
      var i, l, name, rawName, value, modifiers, syncGen, isDynamic;
      for (i = 0, l = list.length; i < l; i++) {
        name = rawName = list[i].name;
        value = list[i].value;
        if (dirRE.test(name)) {
          // mark element as dynamic
          el.hasBindings = true;
          // modifiers
          modifiers = parseModifiers(name.replace(dirRE, ''));
          // support .foo shorthand syntax for the .prop modifier
          if (modifiers) {
            name = name.replace(modifierRE, '');
          }
          if (bindRE.test(name)) { // v-bind
            name = name.replace(bindRE, '');
            value = parseFilters(value);
            isDynamic = dynamicArgRE.test(name);
            if (isDynamic) {
              name = name.slice(1, -1);
            }
            if (
              value.trim().length === 0
            ) {
              warn$2(
                ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
              );
            }
            if (modifiers) {
              if (modifiers.prop && !isDynamic) {
                name = camelize(name);
                if (name === 'innerHtml') { name = 'innerHTML'; }
              }
              if (modifiers.camel && !isDynamic) {
                name = camelize(name);
              }
              if (modifiers.sync) {
                syncGen = genAssignmentCode(value, "$event");
                if (!isDynamic) {
                  addHandler(
                    el,
                    ("update:" + (camelize(name))),
                    syncGen,
                    null,
                    false,
                    warn$2,
                    list[i]
                  );
                  if (hyphenate(name) !== camelize(name)) {
                    addHandler(
                      el,
                      ("update:" + (hyphenate(name))),
                      syncGen,
                      null,
                      false,
                      warn$2,
                      list[i]
                    );
                  }
                } else {
                  // handler w/ dynamic event name
                  addHandler(
                    el,
                    ("\"update:\"+(" + name + ")"),
                    syncGen,
                    null,
                    false,
                    warn$2,
                    list[i],
                    true // dynamic
                  );
                }
              }
            }
            if ((modifiers && modifiers.prop) || (
              !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
            )) {
              addProp(el, name, value, list[i], isDynamic);
            } else {
              addAttr(el, name, value, list[i], isDynamic);
            }
          } else if (onRE.test(name)) { // v-on
            name = name.replace(onRE, '');
            isDynamic = dynamicArgRE.test(name);
            if (isDynamic) {
              name = name.slice(1, -1);
            }
            addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
          } else { // normal directives
            name = name.replace(dirRE, '');
            // parse arg
            var argMatch = name.match(argRE);
            var arg = argMatch && argMatch[1];
            isDynamic = false;
            if (arg) {
              name = name.slice(0, -(arg.length + 1));
              if (dynamicArgRE.test(arg)) {
                arg = arg.slice(1, -1);
                isDynamic = true;
              }
            }
            addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
            if (name === 'model') {
              checkForAliasModel(el, value);
            }
          }
        } else {
          // literal attribute
          {
            var res = parseText(value, delimiters);
            if (res) {
              warn$2(
                name + "=\"" + value + "\": " +
                'Interpolation inside attributes has been removed. ' +
                'Use v-bind or the colon shorthand instead. For example, ' +
                'instead of <div id="{{ val }}">, use <div :id="val">.',
                list[i]
              );
            }
          }
          addAttr(el, name, JSON.stringify(value), list[i]);
          // #6887 firefox doesn't update muted state if set via attribute
          // even immediately after element creation
          if (!el.component &&
              name === 'muted' &&
              platformMustUseProp(el.tag, el.attrsMap.type, name)) {
            addProp(el, name, 'true', list[i]);
          }
        }
      }
    }
  
    function checkInFor (el) {
      var parent = el;
      while (parent) {
        if (parent.for !== undefined) {
          return true
        }
        parent = parent.parent;
      }
      return false
    }
  
    function parseModifiers (name) {
      var match = name.match(modifierRE);
      if (match) {
        var ret = {};
        match.forEach(function (m) { ret[m.slice(1)] = true; });
        return ret
      }
    }
  
    function makeAttrsMap (attrs) {
      var map = {};
      for (var i = 0, l = attrs.length; i < l; i++) {
        if (
          map[attrs[i].name] && !isIE && !isEdge
        ) {
          warn$2('duplicate attribute: ' + attrs[i].name, attrs[i]);
        }
        map[attrs[i].name] = attrs[i].value;
      }
      return map
    }
  
    // for script (e.g. type="x/template") or style, do not decode content
    function isTextTag (el) {
      return el.tag === 'script' || el.tag === 'style'
    }
  
    function isForbiddenTag (el) {
      return (
        el.tag === 'style' ||
        (el.tag === 'script' && (
          !el.attrsMap.type ||
          el.attrsMap.type === 'text/javascript'
        ))
      )
    }
  
    var ieNSBug = /^xmlns:NS\d+/;
    var ieNSPrefix = /^NS\d+:/;
  
    /* istanbul ignore next */
    function guardIESVGBug (attrs) {
      var res = [];
      for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];
        if (!ieNSBug.test(attr.name)) {
          attr.name = attr.name.replace(ieNSPrefix, '');
          res.push(attr);
        }
      }
      return res
    }
  
    function checkForAliasModel (el, value) {
      var _el = el;
      while (_el) {
        if (_el.for && _el.alias === value) {
          warn$2(
            "<" + (el.tag) + " v-model=\"" + value + "\">: " +
            "You are binding v-model directly to a v-for iteration alias. " +
            "This will not be able to modify the v-for source array because " +
            "writing to the alias is like modifying a function local variable. " +
            "Consider using an array of objects and use v-model on an object property instead.",
            el.rawAttrsMap['v-model']
          );
        }
        _el = _el.parent;
      }
    }
  
    /*  */
  
    function preTransformNode (el, options) {
      if (el.tag === 'input') {
        var map = el.attrsMap;
        if (!map['v-model']) {
          return
        }
  
        var typeBinding;
        if (map[':type'] || map['v-bind:type']) {
          typeBinding = getBindingAttr(el, 'type');
        }
        if (!map.type && !typeBinding && map['v-bind']) {
          typeBinding = "(" + (map['v-bind']) + ").type";
        }
  
        if (typeBinding) {
          var ifCondition = getAndRemoveAttr(el, 'v-if', true);
          var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
          var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
          var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
          // 1. checkbox
          var branch0 = cloneASTElement(el);
          // process for on the main node
          processFor(branch0);
          addRawAttr(branch0, 'type', 'checkbox');
          processElement(branch0, options);
          branch0.processed = true; // prevent it from double-processed
          branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
          addIfCondition(branch0, {
            exp: branch0.if,
            block: branch0
          });
          // 2. add radio else-if condition
          var branch1 = cloneASTElement(el);
          getAndRemoveAttr(branch1, 'v-for', true);
          addRawAttr(branch1, 'type', 'radio');
          processElement(branch1, options);
          addIfCondition(branch0, {
            exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
            block: branch1
          });
          // 3. other
          var branch2 = cloneASTElement(el);
          getAndRemoveAttr(branch2, 'v-for', true);
          addRawAttr(branch2, ':type', typeBinding);
          processElement(branch2, options);
          addIfCondition(branch0, {
            exp: ifCondition,
            block: branch2
          });
  
          if (hasElse) {
            branch0.else = true;
          } else if (elseIfCondition) {
            branch0.elseif = elseIfCondition;
          }
  
          return branch0
        }
      }
    }
  
    function cloneASTElement (el) {
      return createASTElement(el.tag, el.attrsList.slice(), el.parent)
    }
  
    var model$1 = {
      preTransformNode: preTransformNode
    };
  
    var modules$1 = [
      klass$1,
      style$1,
      model$1
    ];
  
    /*  */
  
    function text (el, dir) {
      if (dir.value) {
        addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
      }
    }
  
    /*  */
  
    function html (el, dir) {
      if (dir.value) {
        addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
      }
    }
  
    var directives$1 = {
      model: model,
      text: text,
      html: html
    };
  
    /*  */
  
    var baseOptions = {
      expectHTML: true,
      modules: modules$1,
      directives: directives$1,
      isPreTag: isPreTag,
      isUnaryTag: isUnaryTag,
      mustUseProp: mustUseProp,
      canBeLeftOpenTag: canBeLeftOpenTag,
      isReservedTag: isReservedTag,
      getTagNamespace: getTagNamespace,
      staticKeys: genStaticKeys(modules$1)
    };
  
    /*  */
  
    var isStaticKey;
    var isPlatformReservedTag;
  
    var genStaticKeysCached = cached(genStaticKeys$1);
  
    /**
     * Goal of the optimizer: walk the generated template AST tree
     * and detect sub-trees that are purely static, i.e. parts of
     * the DOM that never needs to change.
     *
     * Once we detect these sub-trees, we can:
     *
     * 1. Hoist them into constants, so that we no longer need to
     *    create fresh nodes for them on each re-render;
     * 2. Completely skip them in the patching process.
     */
    function optimize (root, options) {
      if (!root) { return }
      isStaticKey = genStaticKeysCached(options.staticKeys || '');
      isPlatformReservedTag = options.isReservedTag || no;
      // first pass: mark all non-static nodes.
      markStatic$1(root);
      // second pass: mark static roots.
      markStaticRoots(root, false);
    }
  
    function genStaticKeys$1 (keys) {
      return makeMap(
        'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
        (keys ? ',' + keys : '')
      )
    }
  
    function markStatic$1 (node) {
      node.static = isStatic(node);
      if (node.type === 1) {
        // do not make component slot content static. this avoids
        // 1. components not able to mutate slot nodes
        // 2. static slot content fails for hot-reloading
        if (
          !isPlatformReservedTag(node.tag) &&
          node.tag !== 'slot' &&
          node.attrsMap['inline-template'] == null
        ) {
          return
        }
        for (var i = 0, l = node.children.length; i < l; i++) {
          var child = node.children[i];
          markStatic$1(child);
          if (!child.static) {
            node.static = false;
          }
        }
        if (node.ifConditions) {
          for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
            var block = node.ifConditions[i$1].block;
            markStatic$1(block);
            if (!block.static) {
              node.static = false;
            }
          }
        }
      }
    }
  
    function markStaticRoots (node, isInFor) {
      if (node.type === 1) {
        if (node.static || node.once) {
          node.staticInFor = isInFor;
        }
        // For a node to qualify as a static root, it should have children that
        // are not just static text. Otherwise the cost of hoisting out will
        // outweigh the benefits and it's better off to just always render it fresh.
        if (node.static && node.children.length && !(
          node.children.length === 1 &&
          node.children[0].type === 3
        )) {
          node.staticRoot = true;
          return
        } else {
          node.staticRoot = false;
        }
        if (node.children) {
          for (var i = 0, l = node.children.length; i < l; i++) {
            markStaticRoots(node.children[i], isInFor || !!node.for);
          }
        }
        if (node.ifConditions) {
          for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
            markStaticRoots(node.ifConditions[i$1].block, isInFor);
          }
        }
      }
    }
  
    function isStatic (node) {
      if (node.type === 2) { // expression
        return false
      }
      if (node.type === 3) { // text
        return true
      }
      return !!(node.pre || (
        !node.hasBindings && // no dynamic bindings
        !node.if && !node.for && // not v-if or v-for or v-else
        !isBuiltInTag(node.tag) && // not a built-in
        isPlatformReservedTag(node.tag) && // not a component
        !isDirectChildOfTemplateFor(node) &&
        Object.keys(node).every(isStaticKey)
      ))
    }
  
    function isDirectChildOfTemplateFor (node) {
      while (node.parent) {
        node = node.parent;
        if (node.tag !== 'template') {
          return false
        }
        if (node.for) {
          return true
        }
      }
      return false
    }
  
    /*  */
  
    var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
    var fnInvokeRE = /\([^)]*?\);*$/;
    var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;
  
    // KeyboardEvent.keyCode aliases
    var keyCodes = {
      esc: 27,
      tab: 9,
      enter: 13,
      space: 32,
      up: 38,
      left: 37,
      right: 39,
      down: 40,
      'delete': [8, 46]
    };
  
    // KeyboardEvent.key aliases
    var keyNames = {
      // #7880: IE11 and Edge use `Esc` for Escape key name.
      esc: ['Esc', 'Escape'],
      tab: 'Tab',
      enter: 'Enter',
      // #9112: IE11 uses `Spacebar` for Space key name.
      space: [' ', 'Spacebar'],
      // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
      up: ['Up', 'ArrowUp'],
      left: ['Left', 'ArrowLeft'],
      right: ['Right', 'ArrowRight'],
      down: ['Down', 'ArrowDown'],
      // #9112: IE11 uses `Del` for Delete key name.
      'delete': ['Backspace', 'Delete', 'Del']
    };
  
    // #4868: modifiers that prevent the execution of the listener
    // need to explicitly return null so that we can determine whether to remove
    // the listener for .once
    var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };
  
    var modifierCode = {
      stop: '$event.stopPropagation();',
      prevent: '$event.preventDefault();',
      self: genGuard("$event.target !== $event.currentTarget"),
      ctrl: genGuard("!$event.ctrlKey"),
      shift: genGuard("!$event.shiftKey"),
      alt: genGuard("!$event.altKey"),
      meta: genGuard("!$event.metaKey"),
      left: genGuard("'button' in $event && $event.button !== 0"),
      middle: genGuard("'button' in $event && $event.button !== 1"),
      right: genGuard("'button' in $event && $event.button !== 2")
    };
  
    function genHandlers (
      events,
      isNative
    ) {
      var prefix = isNative ? 'nativeOn:' : 'on:';
      var staticHandlers = "";
      var dynamicHandlers = "";
      for (var name in events) {
        var handlerCode = genHandler(events[name]);
        if (events[name] && events[name].dynamic) {
          dynamicHandlers += name + "," + handlerCode + ",";
        } else {
          staticHandlers += "\"" + name + "\":" + handlerCode + ",";
        }
      }
      staticHandlers = "{" + (staticHandlers.slice(0, -1)) + "}";
      if (dynamicHandlers) {
        return prefix + "_d(" + staticHandlers + ",[" + (dynamicHandlers.slice(0, -1)) + "])"
      } else {
        return prefix + staticHandlers
      }
    }
  
    function genHandler (handler) {
      if (!handler) {
        return 'function(){}'
      }
  
      if (Array.isArray(handler)) {
        return ("[" + (handler.map(function (handler) { return genHandler(handler); }).join(',')) + "]")
      }
  
      var isMethodPath = simplePathRE.test(handler.value);
      var isFunctionExpression = fnExpRE.test(handler.value);
      var isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));
  
      if (!handler.modifiers) {
        if (isMethodPath || isFunctionExpression) {
          return handler.value
        }
        return ("function($event){" + (isFunctionInvocation ? ("return " + (handler.value)) : handler.value) + "}") // inline statement
      } else {
        var code = '';
        var genModifierCode = '';
        var keys = [];
        for (var key in handler.modifiers) {
          if (modifierCode[key]) {
            genModifierCode += modifierCode[key];
            // left/right
            if (keyCodes[key]) {
              keys.push(key);
            }
          } else if (key === 'exact') {
            var modifiers = (handler.modifiers);
            genModifierCode += genGuard(
              ['ctrl', 'shift', 'alt', 'meta']
                .filter(function (keyModifier) { return !modifiers[keyModifier]; })
                .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
                .join('||')
            );
          } else {
            keys.push(key);
          }
        }
        if (keys.length) {
          code += genKeyFilter(keys);
        }
        // Make sure modifiers like prevent and stop get executed after key filtering
        if (genModifierCode) {
          code += genModifierCode;
        }
        var handlerCode = isMethodPath
          ? ("return " + (handler.value) + "($event)")
          : isFunctionExpression
            ? ("return (" + (handler.value) + ")($event)")
            : isFunctionInvocation
              ? ("return " + (handler.value))
              : handler.value;
        return ("function($event){" + code + handlerCode + "}")
      }
    }
  
    function genKeyFilter (keys) {
      return (
        // make sure the key filters only apply to KeyboardEvents
        // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
        // key events that do not have keyCode property...
        "if(!$event.type.indexOf('key')&&" +
        (keys.map(genFilterCode).join('&&')) + ")return null;"
      )
    }
  
    function genFilterCode (key) {
      var keyVal = parseInt(key, 10);
      if (keyVal) {
        return ("$event.keyCode!==" + keyVal)
      }
      var keyCode = keyCodes[key];
      var keyName = keyNames[key];
      return (
        "_k($event.keyCode," +
        (JSON.stringify(key)) + "," +
        (JSON.stringify(keyCode)) + "," +
        "$event.key," +
        "" + (JSON.stringify(keyName)) +
        ")"
      )
    }
  
    /*  */
  
    function on (el, dir) {
      if (dir.modifiers) {
        warn("v-on without argument does not support modifiers.");
      }
      el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
    }
  
    /*  */
  
    function bind$1 (el, dir) {
      el.wrapData = function (code) {
        return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
      };
    }
  
    /*  */
  
    var baseDirectives = {
      on: on,
      bind: bind$1,
      cloak: noop
    };
  
    /*  */
  
  
  
  
  
    var CodegenState = function CodegenState (options) {
      this.options = options;
      this.warn = options.warn || baseWarn;
      this.transforms = pluckModuleFunction(options.modules, 'transformCode');
      this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
      this.directives = extend(extend({}, baseDirectives), options.directives);
      var isReservedTag = options.isReservedTag || no;
      this.maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };
      this.onceId = 0;
      this.staticRenderFns = [];
      this.pre = false;
    };
  
  
  
    function generate (
      ast,
      options
    ) {
      var state = new CodegenState(options);
      var code = ast ? genElement(ast, state) : '_c("div")';
      return {
        render: ("with(this){return " + code + "}"),
        staticRenderFns: state.staticRenderFns
      }
    }
  
    function genElement (el, state) {
      if (el.parent) {
        el.pre = el.pre || el.parent.pre;
      }
  
      if (el.staticRoot && !el.staticProcessed) {
        return genStatic(el, state)
      } else if (el.once && !el.onceProcessed) {
        return genOnce(el, state)
      } else if (el.for && !el.forProcessed) {
        return genFor(el, state)
      } else if (el.if && !el.ifProcessed) {
        return genIf(el, state)
      } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
        return genChildren(el, state) || 'void 0'
      } else if (el.tag === 'slot') {
        return genSlot(el, state)
      } else {
        // component or element
        var code;
        if (el.component) {
          code = genComponent(el.component, el, state);
        } else {
          var data;
          if (!el.plain || (el.pre && state.maybeComponent(el))) {
            data = genData$2(el, state);
          }
  
          var children = el.inlineTemplate ? null : genChildren(el, state, true);
          code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
        }
        // module transforms
        for (var i = 0; i < state.transforms.length; i++) {
          code = state.transforms[i](el, code);
        }
        return code
      }
    }
  
    // hoist static sub-trees out
    function genStatic (el, state) {
      el.staticProcessed = true;
      // Some elements (templates) need to behave differently inside of a v-pre
      // node.  All pre nodes are static roots, so we can use this as a location to
      // wrap a state change and reset it upon exiting the pre node.
      var originalPreState = state.pre;
      if (el.pre) {
        state.pre = el.pre;
      }
      state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
      state.pre = originalPreState;
      return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
    }
  
    // v-once
    function genOnce (el, state) {
      el.onceProcessed = true;
      if (el.if && !el.ifProcessed) {
        return genIf(el, state)
      } else if (el.staticInFor) {
        var key = '';
        var parent = el.parent;
        while (parent) {
          if (parent.for) {
            key = parent.key;
            break
          }
          parent = parent.parent;
        }
        if (!key) {
          state.warn(
            "v-once can only be used inside v-for that is keyed. ",
            el.rawAttrsMap['v-once']
          );
          return genElement(el, state)
        }
        return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
      } else {
        return genStatic(el, state)
      }
    }
  
    function genIf (
      el,
      state,
      altGen,
      altEmpty
    ) {
      el.ifProcessed = true; // avoid recursion
      return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
    }
  
    function genIfConditions (
      conditions,
      state,
      altGen,
      altEmpty
    ) {
      if (!conditions.length) {
        return altEmpty || '_e()'
      }
  
      var condition = conditions.shift();
      if (condition.exp) {
        return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
      } else {
        return ("" + (genTernaryExp(condition.block)))
      }
  
      // v-if with v-once should generate code like (a)?_m(0):_m(1)
      function genTernaryExp (el) {
        return altGen
          ? altGen(el, state)
          : el.once
            ? genOnce(el, state)
            : genElement(el, state)
      }
    }
  
    function genFor (
      el,
      state,
      altGen,
      altHelper
    ) {
      var exp = el.for;
      var alias = el.alias;
      var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
      var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  
      if (state.maybeComponent(el) &&
        el.tag !== 'slot' &&
        el.tag !== 'template' &&
        !el.key
      ) {
        state.warn(
          "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
          "v-for should have explicit keys. " +
          "See https://vuejs.org/guide/list.html#key for more info.",
          el.rawAttrsMap['v-for'],
          true /* tip */
        );
      }
  
      el.forProcessed = true; // avoid recursion
      return (altHelper || '_l') + "((" + exp + ")," +
        "function(" + alias + iterator1 + iterator2 + "){" +
          "return " + ((altGen || genElement)(el, state)) +
        '})'
    }
  
    function genData$2 (el, state) {
      var data = '{';
  
      // directives first.
      // directives may mutate the el's other properties before they are generated.
      var dirs = genDirectives(el, state);
      if (dirs) { data += dirs + ','; }
  
      // key
      if (el.key) {
        data += "key:" + (el.key) + ",";
      }
      // ref
      if (el.ref) {
        data += "ref:" + (el.ref) + ",";
      }
      if (el.refInFor) {
        data += "refInFor:true,";
      }
      // pre
      if (el.pre) {
        data += "pre:true,";
      }
      // record original tag name for components using "is" attribute
      if (el.component) {
        data += "tag:\"" + (el.tag) + "\",";
      }
      // module data generation functions
      for (var i = 0; i < state.dataGenFns.length; i++) {
        data += state.dataGenFns[i](el);
      }
      // attributes
      if (el.attrs) {
        data += "attrs:" + (genProps(el.attrs)) + ",";
      }
      // DOM props
      if (el.props) {
        data += "domProps:" + (genProps(el.props)) + ",";
      }
      // event handlers
      if (el.events) {
        data += (genHandlers(el.events, false)) + ",";
      }
      if (el.nativeEvents) {
        data += (genHandlers(el.nativeEvents, true)) + ",";
      }
      // slot target
      // only for non-scoped slots
      if (el.slotTarget && !el.slotScope) {
        data += "slot:" + (el.slotTarget) + ",";
      }
      // scoped slots
      if (el.scopedSlots) {
        data += (genScopedSlots(el, el.scopedSlots, state)) + ",";
      }
      // component v-model
      if (el.model) {
        data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
      }
      // inline-template
      if (el.inlineTemplate) {
        var inlineTemplate = genInlineTemplate(el, state);
        if (inlineTemplate) {
          data += inlineTemplate + ",";
        }
      }
      data = data.replace(/,$/, '') + '}';
      // v-bind dynamic argument wrap
      // v-bind with dynamic arguments must be applied using the same v-bind object
      // merge helper so that class/style/mustUseProp attrs are handled correctly.
      if (el.dynamicAttrs) {
        data = "_b(" + data + ",\"" + (el.tag) + "\"," + (genProps(el.dynamicAttrs)) + ")";
      }
      // v-bind data wrap
      if (el.wrapData) {
        data = el.wrapData(data);
      }
      // v-on data wrap
      if (el.wrapListeners) {
        data = el.wrapListeners(data);
      }
      return data
    }
  
    function genDirectives (el, state) {
      var dirs = el.directives;
      if (!dirs) { return }
      var res = 'directives:[';
      var hasRuntime = false;
      var i, l, dir, needRuntime;
      for (i = 0, l = dirs.length; i < l; i++) {
        dir = dirs[i];
        needRuntime = true;
        var gen = state.directives[dir.name];
        if (gen) {
          // compile-time directive that manipulates AST.
          // returns true if it also needs a runtime counterpart.
          needRuntime = !!gen(el, dir, state.warn);
        }
        if (needRuntime) {
          hasRuntime = true;
          res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:" + (dir.isDynamicArg ? dir.arg : ("\"" + (dir.arg) + "\""))) : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
        }
      }
      if (hasRuntime) {
        return res.slice(0, -1) + ']'
      }
    }
  
    function genInlineTemplate (el, state) {
      var ast = el.children[0];
      if (el.children.length !== 1 || ast.type !== 1) {
        state.warn(
          'Inline-template components must have exactly one child element.',
          { start: el.start }
        );
      }
      if (ast && ast.type === 1) {
        var inlineRenderFns = generate(ast, state.options);
        return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
      }
    }
  
    function genScopedSlots (
      el,
      slots,
      state
    ) {
      // by default scoped slots are considered "stable", this allows child
      // components with only scoped slots to skip forced updates from parent.
      // but in some cases we have to bail-out of this optimization
      // for example if the slot contains dynamic names, has v-if or v-for on them...
      var needsForceUpdate = el.for || Object.keys(slots).some(function (key) {
        var slot = slots[key];
        return (
          slot.slotTargetDynamic ||
          slot.if ||
          slot.for ||
          containsSlotChild(slot) // is passing down slot from parent which may be dynamic
        )
      });
  
      // #9534: if a component with scoped slots is inside a conditional branch,
      // it's possible for the same component to be reused but with different
      // compiled slot content. To avoid that, we generate a unique key based on
      // the generated code of all the slot contents.
      var needsKey = !!el.if;
  
      // OR when it is inside another scoped slot or v-for (the reactivity may be
      // disconnected due to the intermediate scope variable)
      // #9438, #9506
      // TODO: this can be further optimized by properly analyzing in-scope bindings
      // and skip force updating ones that do not actually use scope variables.
      if (!needsForceUpdate) {
        var parent = el.parent;
        while (parent) {
          if (
            (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
            parent.for
          ) {
            needsForceUpdate = true;
            break
          }
          if (parent.if) {
            needsKey = true;
          }
          parent = parent.parent;
        }
      }
  
      var generatedSlots = Object.keys(slots)
        .map(function (key) { return genScopedSlot(slots[key], state); })
        .join(',');
  
      return ("scopedSlots:_u([" + generatedSlots + "]" + (needsForceUpdate ? ",null,true" : "") + (!needsForceUpdate && needsKey ? (",null,false," + (hash(generatedSlots))) : "") + ")")
    }
  
    function hash(str) {
      var hash = 5381;
      var i = str.length;
      while(i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
      }
      return hash >>> 0
    }
  
    function containsSlotChild (el) {
      if (el.type === 1) {
        if (el.tag === 'slot') {
          return true
        }
        return el.children.some(containsSlotChild)
      }
      return false
    }
  
    function genScopedSlot (
      el,
      state
    ) {
      var isLegacySyntax = el.attrsMap['slot-scope'];
      if (el.if && !el.ifProcessed && !isLegacySyntax) {
        return genIf(el, state, genScopedSlot, "null")
      }
      if (el.for && !el.forProcessed) {
        return genFor(el, state, genScopedSlot)
      }
      var slotScope = el.slotScope === emptySlotScopeToken
        ? ""
        : String(el.slotScope);
      var fn = "function(" + slotScope + "){" +
        "return " + (el.tag === 'template'
          ? el.if && isLegacySyntax
            ? ("(" + (el.if) + ")?" + (genChildren(el, state) || 'undefined') + ":undefined")
            : genChildren(el, state) || 'undefined'
          : genElement(el, state)) + "}";
      // reverse proxy v-slot without scope on this.$slots
      var reverseProxy = slotScope ? "" : ",proxy:true";
      return ("{key:" + (el.slotTarget || "\"default\"") + ",fn:" + fn + reverseProxy + "}")
    }
  
    function genChildren (
      el,
      state,
      checkSkip,
      altGenElement,
      altGenNode
    ) {
      var children = el.children;
      if (children.length) {
        var el$1 = children[0];
        // optimize single v-for
        if (children.length === 1 &&
          el$1.for &&
          el$1.tag !== 'template' &&
          el$1.tag !== 'slot'
        ) {
          var normalizationType = checkSkip
            ? state.maybeComponent(el$1) ? ",1" : ",0"
            : "";
          return ("" + ((altGenElement || genElement)(el$1, state)) + normalizationType)
        }
        var normalizationType$1 = checkSkip
          ? getNormalizationType(children, state.maybeComponent)
          : 0;
        var gen = altGenNode || genNode;
        return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType$1 ? ("," + normalizationType$1) : ''))
      }
    }
  
    // determine the normalization needed for the children array.
    // 0: no normalization needed
    // 1: simple normalization needed (possible 1-level deep nested array)
    // 2: full normalization needed
    function getNormalizationType (
      children,
      maybeComponent
    ) {
      var res = 0;
      for (var i = 0; i < children.length; i++) {
        var el = children[i];
        if (el.type !== 1) {
          continue
        }
        if (needsNormalization(el) ||
            (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
          res = 2;
          break
        }
        if (maybeComponent(el) ||
            (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
          res = 1;
        }
      }
      return res
    }
  
    function needsNormalization (el) {
      return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
    }
  
    function genNode (node, state) {
      if (node.type === 1) {
        return genElement(node, state)
      } else if (node.type === 3 && node.isComment) {
        return genComment(node)
      } else {
        return genText(node)
      }
    }
  
    function genText (text) {
      return ("_v(" + (text.type === 2
        ? text.expression // no need for () because already wrapped in _s()
        : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
    }
  
    function genComment (comment) {
      return ("_e(" + (JSON.stringify(comment.text)) + ")")
    }
  
    function genSlot (el, state) {
      var slotName = el.slotName || '"default"';
      var children = genChildren(el, state);
      var res = "_t(" + slotName + (children ? ("," + children) : '');
      var attrs = el.attrs || el.dynamicAttrs
        ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(function (attr) { return ({
            // slot props are camelized
            name: camelize(attr.name),
            value: attr.value,
            dynamic: attr.dynamic
          }); }))
        : null;
      var bind$$1 = el.attrsMap['v-bind'];
      if ((attrs || bind$$1) && !children) {
        res += ",null";
      }
      if (attrs) {
        res += "," + attrs;
      }
      if (bind$$1) {
        res += (attrs ? '' : ',null') + "," + bind$$1;
      }
      return res + ')'
    }
  
    // componentName is el.component, take it as argument to shun flow's pessimistic refinement
    function genComponent (
      componentName,
      el,
      state
    ) {
      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
    }
  
    function genProps (props) {
      var staticProps = "";
      var dynamicProps = "";
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        var value = transformSpecialNewlines(prop.value);
        if (prop.dynamic) {
          dynamicProps += (prop.name) + "," + value + ",";
        } else {
          staticProps += "\"" + (prop.name) + "\":" + value + ",";
        }
      }
      staticProps = "{" + (staticProps.slice(0, -1)) + "}";
      if (dynamicProps) {
        return ("_d(" + staticProps + ",[" + (dynamicProps.slice(0, -1)) + "])")
      } else {
        return staticProps
      }
    }
  
    // #3895, #4268
    function transformSpecialNewlines (text) {
      return text
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
    }
  
    /*  */
  
  
  
    // these keywords should not appear inside expressions, but operators like
    // typeof, instanceof and in are allowed
    var prohibitedKeywordRE = new RegExp('\\b' + (
      'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
      'super,throw,while,yield,delete,export,import,return,switch,default,' +
      'extends,finally,continue,debugger,function,arguments'
    ).split(',').join('\\b|\\b') + '\\b');
  
    // these unary operators should not be used as property/method names
    var unaryOperatorsRE = new RegExp('\\b' + (
      'delete,typeof,void'
    ).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');
  
    // strip strings in expressions
    var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;
  
    // detect problematic expressions in a template
    function detectErrors (ast, warn) {
      if (ast) {
        checkNode(ast, warn);
      }
    }
  
    function checkNode (node, warn) {
      if (node.type === 1) {
        for (var name in node.attrsMap) {
          if (dirRE.test(name)) {
            var value = node.attrsMap[name];
            if (value) {
              var range = node.rawAttrsMap[name];
              if (name === 'v-for') {
                checkFor(node, ("v-for=\"" + value + "\""), warn, range);
              } else if (name === 'v-slot' || name[0] === '#') {
                checkFunctionParameterExpression(value, (name + "=\"" + value + "\""), warn, range);
              } else if (onRE.test(name)) {
                checkEvent(value, (name + "=\"" + value + "\""), warn, range);
              } else {
                checkExpression(value, (name + "=\"" + value + "\""), warn, range);
              }
            }
          }
        }
        if (node.children) {
          for (var i = 0; i < node.children.length; i++) {
            checkNode(node.children[i], warn);
          }
        }
      } else if (node.type === 2) {
        checkExpression(node.expression, node.text, warn, node);
      }
    }
  
    function checkEvent (exp, text, warn, range) {
      var stripped = exp.replace(stripStringRE, '');
      var keywordMatch = stripped.match(unaryOperatorsRE);
      if (keywordMatch && stripped.charAt(keywordMatch.index - 1) !== '$') {
        warn(
          "avoid using JavaScript unary operator as property name: " +
          "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim()),
          range
        );
      }
      checkExpression(exp, text, warn, range);
    }
  
    function checkFor (node, text, warn, range) {
      checkExpression(node.for || '', text, warn, range);
      checkIdentifier(node.alias, 'v-for alias', text, warn, range);
      checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
      checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
    }
  
    function checkIdentifier (
      ident,
      type,
      text,
      warn,
      range
    ) {
      if (typeof ident === 'string') {
        try {
          new Function(("var " + ident + "=_"));
        } catch (e) {
          warn(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())), range);
        }
      }
    }
  
    function checkExpression (exp, text, warn, range) {
      try {
        new Function(("return " + exp));
      } catch (e) {
        var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
        if (keywordMatch) {
          warn(
            "avoid using JavaScript keyword as property name: " +
            "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim()),
            range
          );
        } else {
          warn(
            "invalid expression: " + (e.message) + " in\n\n" +
            "    " + exp + "\n\n" +
            "  Raw expression: " + (text.trim()) + "\n",
            range
          );
        }
      }
    }
  
    function checkFunctionParameterExpression (exp, text, warn, range) {
      try {
        new Function(exp, '');
      } catch (e) {
        warn(
          "invalid function parameter expression: " + (e.message) + " in\n\n" +
          "    " + exp + "\n\n" +
          "  Raw expression: " + (text.trim()) + "\n",
          range
        );
      }
    }
  
    /*  */
  
    var range = 2;
  
    function generateCodeFrame (
      source,
      start,
      end
    ) {
      if ( start === void 0 ) start = 0;
      if ( end === void 0 ) end = source.length;
  
      var lines = source.split(/\r?\n/);
      var count = 0;
      var res = [];
      for (var i = 0; i < lines.length; i++) {
        count += lines[i].length + 1;
        if (count >= start) {
          for (var j = i - range; j <= i + range || end > count; j++) {
            if (j < 0 || j >= lines.length) { continue }
            res.push(("" + (j + 1) + (repeat$1(" ", 3 - String(j + 1).length)) + "|  " + (lines[j])));
            var lineLength = lines[j].length;
            if (j === i) {
              // push underline
              var pad = start - (count - lineLength) + 1;
              var length = end > count ? lineLength - pad : end - start;
              res.push("   |  " + repeat$1(" ", pad) + repeat$1("^", length));
            } else if (j > i) {
              if (end > count) {
                var length$1 = Math.min(end - count, lineLength);
                res.push("   |  " + repeat$1("^", length$1));
              }
              count += lineLength + 1;
            }
          }
          break
        }
      }
      return res.join('\n')
    }
  
    function repeat$1 (str, n) {
      var result = '';
      if (n > 0) {
        while (true) { // eslint-disable-line
          if (n & 1) { result += str; }
          n >>>= 1;
          if (n <= 0) { break }
          str += str;
        }
      }
      return result
    }
  
    /*  */
  
  
  
    function createFunction (code, errors) {
      try {
        return new Function(code)
      } catch (err) {
        errors.push({ err: err, code: code });
        return noop
      }
    }
  
    function createCompileToFunctionFn (compile) {
      var cache = Object.create(null);
  
      return function compileToFunctions (
        template,
        options,
        vm
      ) {
        options = extend({}, options);
        var warn$$1 = options.warn || warn;
        delete options.warn;
  
        /* istanbul ignore if */
        {
          // detect possible CSP restriction
          try {
            new Function('return 1');
          } catch (e) {
            if (e.toString().match(/unsafe-eval|CSP/)) {
              warn$$1(
                'It seems you are using the standalone build of Vue.js in an ' +
                'environment with Content Security Policy that prohibits unsafe-eval. ' +
                'The template compiler cannot work in this environment. Consider ' +
                'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                'templates into render functions.'
              );
            }
          }
        }
  
        // check cache
        var key = options.delimiters
          ? String(options.delimiters) + template
          : template;
        if (cache[key]) {
          return cache[key]
        }
  
        // compile
        var compiled = compile(template, options);
  
        // check compilation errors/tips
        {
          if (compiled.errors && compiled.errors.length) {
            if (options.outputSourceRange) {
              compiled.errors.forEach(function (e) {
                warn$$1(
                  "Error compiling template:\n\n" + (e.msg) + "\n\n" +
                  generateCodeFrame(template, e.start, e.end),
                  vm
                );
              });
            } else {
              warn$$1(
                "Error compiling template:\n\n" + template + "\n\n" +
                compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
                vm
              );
            }
          }
          if (compiled.tips && compiled.tips.length) {
            if (options.outputSourceRange) {
              compiled.tips.forEach(function (e) { return tip(e.msg, vm); });
            } else {
              compiled.tips.forEach(function (msg) { return tip(msg, vm); });
            }
          }
        }
  
        // turn code into functions
        var res = {};
        var fnGenErrors = [];
        res.render = createFunction(compiled.render, fnGenErrors);
        res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
          return createFunction(code, fnGenErrors)
        });
  
        // check function generation errors.
        // this should only happen if there is a bug in the compiler itself.
        // mostly for codegen development use
        /* istanbul ignore if */
        {
          if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
            warn$$1(
              "Failed to generate render function:\n\n" +
              fnGenErrors.map(function (ref) {
                var err = ref.err;
                var code = ref.code;
  
                return ((err.toString()) + " in\n\n" + code + "\n");
            }).join('\n'),
              vm
            );
          }
        }
  
        return (cache[key] = res)
      }
    }
  
    /*  */
  
    function createCompilerCreator (baseCompile) {
      return function createCompiler (baseOptions) {
        function compile (
          template,
          options
        ) {
          var finalOptions = Object.create(baseOptions);
          var errors = [];
          var tips = [];
  
          var warn = function (msg, range, tip) {
            (tip ? tips : errors).push(msg);
          };
  
          if (options) {
            if (options.outputSourceRange) {
              // $flow-disable-line
              var leadingSpaceLength = template.match(/^\s*/)[0].length;
  
              warn = function (msg, range, tip) {
                var data = { msg: msg };
                if (range) {
                  if (range.start != null) {
                    data.start = range.start + leadingSpaceLength;
                  }
                  if (range.end != null) {
                    data.end = range.end + leadingSpaceLength;
                  }
                }
                (tip ? tips : errors).push(data);
              };
            }
            // merge custom modules
            if (options.modules) {
              finalOptions.modules =
                (baseOptions.modules || []).concat(options.modules);
            }
            // merge custom directives
            if (options.directives) {
              finalOptions.directives = extend(
                Object.create(baseOptions.directives || null),
                options.directives
              );
            }
            // copy other options
            for (var key in options) {
              if (key !== 'modules' && key !== 'directives') {
                finalOptions[key] = options[key];
              }
            }
          }
  
          finalOptions.warn = warn;
  
          var compiled = baseCompile(template.trim(), finalOptions);
          {
            detectErrors(compiled.ast, warn);
          }
          compiled.errors = errors;
          compiled.tips = tips;
          return compiled
        }
  
        return {
          compile: compile,
          compileToFunctions: createCompileToFunctionFn(compile)
        }
      }
    }
  
    /*  */
  
    // `createCompilerCreator` allows creating compilers that use alternative
    // parser/optimizer/codegen, e.g the SSR optimizing compiler.
    // Here we just export a default compiler using the default parts.
    var createCompiler = createCompilerCreator(function baseCompile (
      template,
      options
    ) {
      var ast = parse(template.trim(), options);
      if (options.optimize !== false) {
        optimize(ast, options);
      }
      var code = generate(ast, options);
      return {
        ast: ast,
        render: code.render,
        staticRenderFns: code.staticRenderFns
      }
    });
  
    /*  */
  
    var ref$1 = createCompiler(baseOptions);
    var compile = ref$1.compile;
    var compileToFunctions = ref$1.compileToFunctions;
  
    /*  */
  
    // check whether current browser encodes a char inside attribute values
    var div;
    function getShouldDecode (href) {
      div = div || document.createElement('div');
      div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
      return div.innerHTML.indexOf('&#10;') > 0
    }
  
    // #3663: IE encodes newlines inside attribute values while other browsers don't
    var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
    // #6828: chrome encodes content in a[href]
    var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;
  
    /*  */
  
    var idToTemplate = cached(function (id) {
      var el = query(id);
      return el && el.innerHTML
    });
  
    var mount = Vue.prototype.$mount;
    Vue.prototype.$mount = function (
      el,
      hydrating
    ) {
      el = el && query(el);
  
      /* istanbul ignore if */
      if (el === document.body || el === document.documentElement) {
        warn(
          "Do not mount Vue to <html> or <body> - mount to normal elements instead."
        );
        return this
      }
  
      var options = this.$options;
      // resolve template/el and convert to render function
      if (!options.render) {
        var template = options.template;
        if (template) {
          if (typeof template === 'string') {
            if (template.charAt(0) === '#') {
              template = idToTemplate(template);
              /* istanbul ignore if */
              if (!template) {
                warn(
                  ("Template element not found or is empty: " + (options.template)),
                  this
                );
              }
            }
          } else if (template.nodeType) {
            template = template.innerHTML;
          } else {
            {
              warn('invalid template option:' + template, this);
            }
            return this
          }
        } else if (el) {
          template = getOuterHTML(el);
        }
        if (template) {
          /* istanbul ignore if */
          if (config.performance && mark) {
            mark('compile');
          }
  
          var ref = compileToFunctions(template, {
            outputSourceRange: "development" !== 'production',
            shouldDecodeNewlines: shouldDecodeNewlines,
            shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
            delimiters: options.delimiters,
            comments: options.comments
          }, this);
          var render = ref.render;
          var staticRenderFns = ref.staticRenderFns;
          options.render = render;
          options.staticRenderFns = staticRenderFns;
  
          /* istanbul ignore if */
          if (config.performance && mark) {
            mark('compile end');
            measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
          }
        }
      }
      return mount.call(this, el, hydrating)
    };
  
    /**
     * Get outerHTML of elements, taking care
     * of SVG elements in IE as well.
     */
    function getOuterHTML (el) {
      if (el.outerHTML) {
        return el.outerHTML
      } else {
        var container = document.createElement('div');
        container.appendChild(el.cloneNode(true));
        return container.innerHTML
      }
    }
  
    Vue.compile = compileToFunctions;
  
    return Vue;
  
  }));
/*! Sortable 1.10.2 - MIT | git://github.com/SortableJS/Sortable.git */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).Sortable=e()}(this,function(){"use strict";function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function a(){return(a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t}).apply(this,arguments)}function I(i){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},e=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(e=e.concat(Object.getOwnPropertySymbols(r).filter(function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable}))),e.forEach(function(t){var e,n,o;e=i,o=r[n=t],n in e?Object.defineProperty(e,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[n]=o})}return i}function l(t,e){if(null==t)return{};var n,o,i=function(t,e){if(null==t)return{};var n,o,i={},r=Object.keys(t);for(o=0;o<r.length;o++)n=r[o],0<=e.indexOf(n)||(i[n]=t[n]);return i}(t,e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);for(o=0;o<r.length;o++)n=r[o],0<=e.indexOf(n)||Object.prototype.propertyIsEnumerable.call(t,n)&&(i[n]=t[n])}return i}function e(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function t(t){if("undefined"!=typeof window&&window.navigator)return!!navigator.userAgent.match(t)}var w=t(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),E=t(/Edge/i),c=t(/firefox/i),s=t(/safari/i)&&!t(/chrome/i)&&!t(/android/i),n=t(/iP(ad|od|hone)/i),i=t(/chrome/i)&&t(/android/i),r={capture:!1,passive:!1};function u(t,e,n){t.addEventListener(e,n,!w&&r)}function d(t,e,n){t.removeEventListener(e,n,!w&&r)}function h(t,e){if(e){if(">"===e[0]&&(e=e.substring(1)),t)try{if(t.matches)return t.matches(e);if(t.msMatchesSelector)return t.msMatchesSelector(e);if(t.webkitMatchesSelector)return t.webkitMatchesSelector(e)}catch(t){return!1}return!1}}function P(t,e,n,o){if(t){n=n||document;do{if(null!=e&&(">"===e[0]?t.parentNode===n&&h(t,e):h(t,e))||o&&t===n)return t;if(t===n)break}while(t=(i=t).host&&i!==document&&i.host.nodeType?i.host:i.parentNode)}var i;return null}var f,p=/\s+/g;function k(t,e,n){if(t&&e)if(t.classList)t.classList[n?"add":"remove"](e);else{var o=(" "+t.className+" ").replace(p," ").replace(" "+e+" "," ");t.className=(o+(n?" "+e:"")).replace(p," ")}}function R(t,e,n){var o=t&&t.style;if(o){if(void 0===n)return document.defaultView&&document.defaultView.getComputedStyle?n=document.defaultView.getComputedStyle(t,""):t.currentStyle&&(n=t.currentStyle),void 0===e?n:n[e];e in o||-1!==e.indexOf("webkit")||(e="-webkit-"+e),o[e]=n+("string"==typeof n?"":"px")}}function v(t,e){var n="";if("string"==typeof t)n=t;else do{var o=R(t,"transform");o&&"none"!==o&&(n=o+" "+n)}while(!e&&(t=t.parentNode));var i=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix||window.MSCSSMatrix;return i&&new i(n)}function g(t,e,n){if(t){var o=t.getElementsByTagName(e),i=0,r=o.length;if(n)for(;i<r;i++)n(o[i],i);return o}return[]}function N(){var t=document.scrollingElement;return t||document.documentElement}function X(t,e,n,o,i){if(t.getBoundingClientRect||t===window){var r,a,l,s,c,u,d;if(d=t!==window&&t!==N()?(a=(r=t.getBoundingClientRect()).top,l=r.left,s=r.bottom,c=r.right,u=r.height,r.width):(l=a=0,s=window.innerHeight,c=window.innerWidth,u=window.innerHeight,window.innerWidth),(e||n)&&t!==window&&(i=i||t.parentNode,!w))do{if(i&&i.getBoundingClientRect&&("none"!==R(i,"transform")||n&&"static"!==R(i,"position"))){var h=i.getBoundingClientRect();a-=h.top+parseInt(R(i,"border-top-width")),l-=h.left+parseInt(R(i,"border-left-width")),s=a+r.height,c=l+r.width;break}}while(i=i.parentNode);if(o&&t!==window){var f=v(i||t),p=f&&f.a,g=f&&f.d;f&&(s=(a/=g)+(u/=g),c=(l/=p)+(d/=p))}return{top:a,left:l,bottom:s,right:c,width:d,height:u}}}function Y(t,e,n){for(var o=H(t,!0),i=X(t)[e];o;){var r=X(o)[n];if(!("top"===n||"left"===n?r<=i:i<=r))return o;if(o===N())break;o=H(o,!1)}return!1}function m(t,e,n){for(var o=0,i=0,r=t.children;i<r.length;){if("none"!==r[i].style.display&&r[i]!==Rt.ghost&&r[i]!==Rt.dragged&&P(r[i],n.draggable,t,!1)){if(o===e)return r[i];o++}i++}return null}function B(t,e){for(var n=t.lastElementChild;n&&(n===Rt.ghost||"none"===R(n,"display")||e&&!h(n,e));)n=n.previousElementSibling;return n||null}function F(t,e){var n=0;if(!t||!t.parentNode)return-1;for(;t=t.previousElementSibling;)"TEMPLATE"===t.nodeName.toUpperCase()||t===Rt.clone||e&&!h(t,e)||n++;return n}function b(t){var e=0,n=0,o=N();if(t)do{var i=v(t),r=i.a,a=i.d;e+=t.scrollLeft*r,n+=t.scrollTop*a}while(t!==o&&(t=t.parentNode));return[e,n]}function H(t,e){if(!t||!t.getBoundingClientRect)return N();var n=t,o=!1;do{if(n.clientWidth<n.scrollWidth||n.clientHeight<n.scrollHeight){var i=R(n);if(n.clientWidth<n.scrollWidth&&("auto"==i.overflowX||"scroll"==i.overflowX)||n.clientHeight<n.scrollHeight&&("auto"==i.overflowY||"scroll"==i.overflowY)){if(!n.getBoundingClientRect||n===document.body)return N();if(o||e)return n;o=!0}}}while(n=n.parentNode);return N()}function y(t,e){return Math.round(t.top)===Math.round(e.top)&&Math.round(t.left)===Math.round(e.left)&&Math.round(t.height)===Math.round(e.height)&&Math.round(t.width)===Math.round(e.width)}function D(e,n){return function(){if(!f){var t=arguments;1===t.length?e.call(this,t[0]):e.apply(this,t),f=setTimeout(function(){f=void 0},n)}}}function L(t,e,n){t.scrollLeft+=e,t.scrollTop+=n}function S(t){var e=window.Polymer,n=window.jQuery||window.Zepto;return e&&e.dom?e.dom(t).cloneNode(!0):n?n(t).clone(!0)[0]:t.cloneNode(!0)}function _(t,e){R(t,"position","absolute"),R(t,"top",e.top),R(t,"left",e.left),R(t,"width",e.width),R(t,"height",e.height)}function C(t){R(t,"position",""),R(t,"top",""),R(t,"left",""),R(t,"width",""),R(t,"height","")}var j="Sortable"+(new Date).getTime();function T(){var e,o=[];return{captureAnimationState:function(){o=[],this.options.animation&&[].slice.call(this.el.children).forEach(function(t){if("none"!==R(t,"display")&&t!==Rt.ghost){o.push({target:t,rect:X(t)});var e=I({},o[o.length-1].rect);if(t.thisAnimationDuration){var n=v(t,!0);n&&(e.top-=n.f,e.left-=n.e)}t.fromRect=e}})},addAnimationState:function(t){o.push(t)},removeAnimationState:function(t){o.splice(function(t,e){for(var n in t)if(t.hasOwnProperty(n))for(var o in e)if(e.hasOwnProperty(o)&&e[o]===t[n][o])return Number(n);return-1}(o,{target:t}),1)},animateAll:function(t){var c=this;if(!this.options.animation)return clearTimeout(e),void("function"==typeof t&&t());var u=!1,d=0;o.forEach(function(t){var e=0,n=t.target,o=n.fromRect,i=X(n),r=n.prevFromRect,a=n.prevToRect,l=t.rect,s=v(n,!0);s&&(i.top-=s.f,i.left-=s.e),n.toRect=i,n.thisAnimationDuration&&y(r,i)&&!y(o,i)&&(l.top-i.top)/(l.left-i.left)==(o.top-i.top)/(o.left-i.left)&&(e=function(t,e,n,o){return Math.sqrt(Math.pow(e.top-t.top,2)+Math.pow(e.left-t.left,2))/Math.sqrt(Math.pow(e.top-n.top,2)+Math.pow(e.left-n.left,2))*o.animation}(l,r,a,c.options)),y(i,o)||(n.prevFromRect=o,n.prevToRect=i,e||(e=c.options.animation),c.animate(n,l,i,e)),e&&(u=!0,d=Math.max(d,e),clearTimeout(n.animationResetTimer),n.animationResetTimer=setTimeout(function(){n.animationTime=0,n.prevFromRect=null,n.fromRect=null,n.prevToRect=null,n.thisAnimationDuration=null},e),n.thisAnimationDuration=e)}),clearTimeout(e),u?e=setTimeout(function(){"function"==typeof t&&t()},d):"function"==typeof t&&t(),o=[]},animate:function(t,e,n,o){if(o){R(t,"transition",""),R(t,"transform","");var i=v(this.el),r=i&&i.a,a=i&&i.d,l=(e.left-n.left)/(r||1),s=(e.top-n.top)/(a||1);t.animatingX=!!l,t.animatingY=!!s,R(t,"transform","translate3d("+l+"px,"+s+"px,0)"),function(t){t.offsetWidth}(t),R(t,"transition","transform "+o+"ms"+(this.options.easing?" "+this.options.easing:"")),R(t,"transform","translate3d(0,0,0)"),"number"==typeof t.animated&&clearTimeout(t.animated),t.animated=setTimeout(function(){R(t,"transition",""),R(t,"transform",""),t.animated=!1,t.animatingX=!1,t.animatingY=!1},o)}}}}var x=[],M={initializeByDefault:!0},O={mount:function(t){for(var e in M)!M.hasOwnProperty(e)||e in t||(t[e]=M[e]);x.push(t)},pluginEvent:function(e,n,o){var t=this;this.eventCanceled=!1,o.cancel=function(){t.eventCanceled=!0};var i=e+"Global";x.forEach(function(t){n[t.pluginName]&&(n[t.pluginName][i]&&n[t.pluginName][i](I({sortable:n},o)),n.options[t.pluginName]&&n[t.pluginName][e]&&n[t.pluginName][e](I({sortable:n},o)))})},initializePlugins:function(o,i,r,t){for(var e in x.forEach(function(t){var e=t.pluginName;if(o.options[e]||t.initializeByDefault){var n=new t(o,i,o.options);n.sortable=o,n.options=o.options,o[e]=n,a(r,n.defaults)}}),o.options)if(o.options.hasOwnProperty(e)){var n=this.modifyOption(o,e,o.options[e]);void 0!==n&&(o.options[e]=n)}},getEventProperties:function(e,n){var o={};return x.forEach(function(t){"function"==typeof t.eventProperties&&a(o,t.eventProperties.call(n[t.pluginName],e))}),o},modifyOption:function(e,n,o){var i;return x.forEach(function(t){e[t.pluginName]&&t.optionListeners&&"function"==typeof t.optionListeners[n]&&(i=t.optionListeners[n].call(e[t.pluginName],o))}),i}};function A(t){var e=t.sortable,n=t.rootEl,o=t.name,i=t.targetEl,r=t.cloneEl,a=t.toEl,l=t.fromEl,s=t.oldIndex,c=t.newIndex,u=t.oldDraggableIndex,d=t.newDraggableIndex,h=t.originalEvent,f=t.putSortable,p=t.extraEventProperties;if(e=e||n&&n[j]){var g,v=e.options,m="on"+o.charAt(0).toUpperCase()+o.substr(1);!window.CustomEvent||w||E?(g=document.createEvent("Event")).initEvent(o,!0,!0):g=new CustomEvent(o,{bubbles:!0,cancelable:!0}),g.to=a||n,g.from=l||n,g.item=i||n,g.clone=r,g.oldIndex=s,g.newIndex=c,g.oldDraggableIndex=u,g.newDraggableIndex=d,g.originalEvent=h,g.pullMode=f?f.lastPutMode:void 0;var b=I({},p,O.getEventProperties(o,e));for(var y in b)g[y]=b[y];n&&n.dispatchEvent(g),v[m]&&v[m].call(e,g)}}function K(t,e,n){var o=2<arguments.length&&void 0!==n?n:{},i=o.evt,r=l(o,["evt"]);O.pluginEvent.bind(Rt)(t,e,I({dragEl:z,parentEl:G,ghostEl:U,rootEl:q,nextEl:V,lastDownEl:Z,cloneEl:Q,cloneHidden:$,dragStarted:dt,putSortable:it,activeSortable:Rt.active,originalEvent:i,oldIndex:J,oldDraggableIndex:et,newIndex:tt,newDraggableIndex:nt,hideGhostForTarget:Nt,unhideGhostForTarget:It,cloneNowHidden:function(){$=!0},cloneNowShown:function(){$=!1},dispatchSortableEvent:function(t){W({sortable:e,name:t,originalEvent:i})}},r))}function W(t){A(I({putSortable:it,cloneEl:Q,targetEl:z,rootEl:q,oldIndex:J,oldDraggableIndex:et,newIndex:tt,newDraggableIndex:nt},t))}var z,G,U,q,V,Z,Q,$,J,tt,et,nt,ot,it,rt,at,lt,st,ct,ut,dt,ht,ft,pt,gt,vt=!1,mt=!1,bt=[],yt=!1,wt=!1,Et=[],Dt=!1,St=[],_t="undefined"!=typeof document,Ct=n,Tt=E||w?"cssFloat":"float",xt=_t&&!i&&!n&&"draggable"in document.createElement("div"),Mt=function(){if(_t){if(w)return!1;var t=document.createElement("x");return t.style.cssText="pointer-events:auto","auto"===t.style.pointerEvents}}(),Ot=function(t,e){var n=R(t),o=parseInt(n.width)-parseInt(n.paddingLeft)-parseInt(n.paddingRight)-parseInt(n.borderLeftWidth)-parseInt(n.borderRightWidth),i=m(t,0,e),r=m(t,1,e),a=i&&R(i),l=r&&R(r),s=a&&parseInt(a.marginLeft)+parseInt(a.marginRight)+X(i).width,c=l&&parseInt(l.marginLeft)+parseInt(l.marginRight)+X(r).width;if("flex"===n.display)return"column"===n.flexDirection||"column-reverse"===n.flexDirection?"vertical":"horizontal";if("grid"===n.display)return n.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(i&&a.float&&"none"!==a.float){var u="left"===a.float?"left":"right";return!r||"both"!==l.clear&&l.clear!==u?"horizontal":"vertical"}return i&&("block"===a.display||"flex"===a.display||"table"===a.display||"grid"===a.display||o<=s&&"none"===n[Tt]||r&&"none"===n[Tt]&&o<s+c)?"vertical":"horizontal"},At=function(t){function s(a,l){return function(t,e,n,o){var i=t.options.group.name&&e.options.group.name&&t.options.group.name===e.options.group.name;if(null==a&&(l||i))return!0;if(null==a||!1===a)return!1;if(l&&"clone"===a)return a;if("function"==typeof a)return s(a(t,e,n,o),l)(t,e,n,o);var r=(l?t:e).options.group.name;return!0===a||"string"==typeof a&&a===r||a.join&&-1<a.indexOf(r)}}var e={},n=t.group;n&&"object"==o(n)||(n={name:n}),e.name=n.name,e.checkPull=s(n.pull,!0),e.checkPut=s(n.put),e.revertClone=n.revertClone,t.group=e},Nt=function(){!Mt&&U&&R(U,"display","none")},It=function(){!Mt&&U&&R(U,"display","")};_t&&document.addEventListener("click",function(t){if(mt)return t.preventDefault(),t.stopPropagation&&t.stopPropagation(),t.stopImmediatePropagation&&t.stopImmediatePropagation(),mt=!1},!0);function Pt(t){if(z){var e=function(r,a){var l;return bt.some(function(t){if(!B(t)){var e=X(t),n=t[j].options.emptyInsertThreshold,o=r>=e.left-n&&r<=e.right+n,i=a>=e.top-n&&a<=e.bottom+n;return n&&o&&i?l=t:void 0}}),l}((t=t.touches?t.touches[0]:t).clientX,t.clientY);if(e){var n={};for(var o in t)t.hasOwnProperty(o)&&(n[o]=t[o]);n.target=n.rootEl=e,n.preventDefault=void 0,n.stopPropagation=void 0,e[j]._onDragOver(n)}}}function kt(t){z&&z.parentNode[j]._isOutsideThisEl(t.target)}function Rt(t,e){if(!t||!t.nodeType||1!==t.nodeType)throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(t));this.el=t,this.options=e=a({},e),t[j]=this;var n={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(t.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return Ot(t,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(t,e){t.setData("Text",e.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:!1!==Rt.supportPointer&&"PointerEvent"in window,emptyInsertThreshold:5};for(var o in O.initializePlugins(this,t,n),n)o in e||(e[o]=n[o]);for(var i in At(e),this)"_"===i.charAt(0)&&"function"==typeof this[i]&&(this[i]=this[i].bind(this));this.nativeDraggable=!e.forceFallback&&xt,this.nativeDraggable&&(this.options.touchStartThreshold=1),e.supportPointer?u(t,"pointerdown",this._onTapStart):(u(t,"mousedown",this._onTapStart),u(t,"touchstart",this._onTapStart)),this.nativeDraggable&&(u(t,"dragover",this),u(t,"dragenter",this)),bt.push(this.el),e.store&&e.store.get&&this.sort(e.store.get(this)||[]),a(this,T())}function Xt(t,e,n,o,i,r,a,l){var s,c,u=t[j],d=u.options.onMove;return!window.CustomEvent||w||E?(s=document.createEvent("Event")).initEvent("move",!0,!0):s=new CustomEvent("move",{bubbles:!0,cancelable:!0}),s.to=e,s.from=t,s.dragged=n,s.draggedRect=o,s.related=i||e,s.relatedRect=r||X(e),s.willInsertAfter=l,s.originalEvent=a,t.dispatchEvent(s),d&&(c=d.call(u,s,a)),c}function Yt(t){t.draggable=!1}function Bt(){Dt=!1}function Ft(t){for(var e=t.tagName+t.className+t.src+t.href+t.textContent,n=e.length,o=0;n--;)o+=e.charCodeAt(n);return o.toString(36)}function Ht(t){return setTimeout(t,0)}function Lt(t){return clearTimeout(t)}Rt.prototype={constructor:Rt,_isOutsideThisEl:function(t){this.el.contains(t)||t===this.el||(ht=null)},_getDirection:function(t,e){return"function"==typeof this.options.direction?this.options.direction.call(this,t,e,z):this.options.direction},_onTapStart:function(e){if(e.cancelable){var n=this,o=this.el,t=this.options,i=t.preventOnFilter,r=e.type,a=e.touches&&e.touches[0]||e.pointerType&&"touch"===e.pointerType&&e,l=(a||e).target,s=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||l,c=t.filter;if(function(t){St.length=0;var e=t.getElementsByTagName("input"),n=e.length;for(;n--;){var o=e[n];o.checked&&St.push(o)}}(o),!z&&!(/mousedown|pointerdown/.test(r)&&0!==e.button||t.disabled||s.isContentEditable||(l=P(l,t.draggable,o,!1))&&l.animated||Z===l)){if(J=F(l),et=F(l,t.draggable),"function"==typeof c){if(c.call(this,e,l,this))return W({sortable:n,rootEl:s,name:"filter",targetEl:l,toEl:o,fromEl:o}),K("filter",n,{evt:e}),void(i&&e.cancelable&&e.preventDefault())}else if(c&&(c=c.split(",").some(function(t){if(t=P(s,t.trim(),o,!1))return W({sortable:n,rootEl:t,name:"filter",targetEl:l,fromEl:o,toEl:o}),K("filter",n,{evt:e}),!0})))return void(i&&e.cancelable&&e.preventDefault());t.handle&&!P(s,t.handle,o,!1)||this._prepareDragStart(e,a,l)}}},_prepareDragStart:function(t,e,n){var o,i=this,r=i.el,a=i.options,l=r.ownerDocument;if(n&&!z&&n.parentNode===r){var s=X(n);if(q=r,G=(z=n).parentNode,V=z.nextSibling,Z=n,ot=a.group,rt={target:Rt.dragged=z,clientX:(e||t).clientX,clientY:(e||t).clientY},ct=rt.clientX-s.left,ut=rt.clientY-s.top,this._lastX=(e||t).clientX,this._lastY=(e||t).clientY,z.style["will-change"]="all",o=function(){K("delayEnded",i,{evt:t}),Rt.eventCanceled?i._onDrop():(i._disableDelayedDragEvents(),!c&&i.nativeDraggable&&(z.draggable=!0),i._triggerDragStart(t,e),W({sortable:i,name:"choose",originalEvent:t}),k(z,a.chosenClass,!0))},a.ignore.split(",").forEach(function(t){g(z,t.trim(),Yt)}),u(l,"dragover",Pt),u(l,"mousemove",Pt),u(l,"touchmove",Pt),u(l,"mouseup",i._onDrop),u(l,"touchend",i._onDrop),u(l,"touchcancel",i._onDrop),c&&this.nativeDraggable&&(this.options.touchStartThreshold=4,z.draggable=!0),K("delayStart",this,{evt:t}),!a.delay||a.delayOnTouchOnly&&!e||this.nativeDraggable&&(E||w))o();else{if(Rt.eventCanceled)return void this._onDrop();u(l,"mouseup",i._disableDelayedDrag),u(l,"touchend",i._disableDelayedDrag),u(l,"touchcancel",i._disableDelayedDrag),u(l,"mousemove",i._delayedDragTouchMoveHandler),u(l,"touchmove",i._delayedDragTouchMoveHandler),a.supportPointer&&u(l,"pointermove",i._delayedDragTouchMoveHandler),i._dragStartTimer=setTimeout(o,a.delay)}}},_delayedDragTouchMoveHandler:function(t){var e=t.touches?t.touches[0]:t;Math.max(Math.abs(e.clientX-this._lastX),Math.abs(e.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){z&&Yt(z),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var t=this.el.ownerDocument;d(t,"mouseup",this._disableDelayedDrag),d(t,"touchend",this._disableDelayedDrag),d(t,"touchcancel",this._disableDelayedDrag),d(t,"mousemove",this._delayedDragTouchMoveHandler),d(t,"touchmove",this._delayedDragTouchMoveHandler),d(t,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(t,e){e=e||"touch"==t.pointerType&&t,!this.nativeDraggable||e?this.options.supportPointer?u(document,"pointermove",this._onTouchMove):u(document,e?"touchmove":"mousemove",this._onTouchMove):(u(z,"dragend",this),u(q,"dragstart",this._onDragStart));try{document.selection?Ht(function(){document.selection.empty()}):window.getSelection().removeAllRanges()}catch(t){}},_dragStarted:function(t,e){if(vt=!1,q&&z){K("dragStarted",this,{evt:e}),this.nativeDraggable&&u(document,"dragover",kt);var n=this.options;t||k(z,n.dragClass,!1),k(z,n.ghostClass,!0),Rt.active=this,t&&this._appendGhost(),W({sortable:this,name:"start",originalEvent:e})}else this._nulling()},_emulateDragOver:function(){if(at){this._lastX=at.clientX,this._lastY=at.clientY,Nt();for(var t=document.elementFromPoint(at.clientX,at.clientY),e=t;t&&t.shadowRoot&&(t=t.shadowRoot.elementFromPoint(at.clientX,at.clientY))!==e;)e=t;if(z.parentNode[j]._isOutsideThisEl(t),e)do{if(e[j]){if(e[j]._onDragOver({clientX:at.clientX,clientY:at.clientY,target:t,rootEl:e})&&!this.options.dragoverBubble)break}t=e}while(e=e.parentNode);It()}},_onTouchMove:function(t){if(rt){var e=this.options,n=e.fallbackTolerance,o=e.fallbackOffset,i=t.touches?t.touches[0]:t,r=U&&v(U,!0),a=U&&r&&r.a,l=U&&r&&r.d,s=Ct&&gt&&b(gt),c=(i.clientX-rt.clientX+o.x)/(a||1)+(s?s[0]-Et[0]:0)/(a||1),u=(i.clientY-rt.clientY+o.y)/(l||1)+(s?s[1]-Et[1]:0)/(l||1);if(!Rt.active&&!vt){if(n&&Math.max(Math.abs(i.clientX-this._lastX),Math.abs(i.clientY-this._lastY))<n)return;this._onDragStart(t,!0)}if(U){r?(r.e+=c-(lt||0),r.f+=u-(st||0)):r={a:1,b:0,c:0,d:1,e:c,f:u};var d="matrix(".concat(r.a,",").concat(r.b,",").concat(r.c,",").concat(r.d,",").concat(r.e,",").concat(r.f,")");R(U,"webkitTransform",d),R(U,"mozTransform",d),R(U,"msTransform",d),R(U,"transform",d),lt=c,st=u,at=i}t.cancelable&&t.preventDefault()}},_appendGhost:function(){if(!U){var t=this.options.fallbackOnBody?document.body:q,e=X(z,!0,Ct,!0,t),n=this.options;if(Ct){for(gt=t;"static"===R(gt,"position")&&"none"===R(gt,"transform")&&gt!==document;)gt=gt.parentNode;gt!==document.body&&gt!==document.documentElement?(gt===document&&(gt=N()),e.top+=gt.scrollTop,e.left+=gt.scrollLeft):gt=N(),Et=b(gt)}k(U=z.cloneNode(!0),n.ghostClass,!1),k(U,n.fallbackClass,!0),k(U,n.dragClass,!0),R(U,"transition",""),R(U,"transform",""),R(U,"box-sizing","border-box"),R(U,"margin",0),R(U,"top",e.top),R(U,"left",e.left),R(U,"width",e.width),R(U,"height",e.height),R(U,"opacity","0.8"),R(U,"position",Ct?"absolute":"fixed"),R(U,"zIndex","100000"),R(U,"pointerEvents","none"),Rt.ghost=U,t.appendChild(U),R(U,"transform-origin",ct/parseInt(U.style.width)*100+"% "+ut/parseInt(U.style.height)*100+"%")}},_onDragStart:function(t,e){var n=this,o=t.dataTransfer,i=n.options;K("dragStart",this,{evt:t}),Rt.eventCanceled?this._onDrop():(K("setupClone",this),Rt.eventCanceled||((Q=S(z)).draggable=!1,Q.style["will-change"]="",this._hideClone(),k(Q,this.options.chosenClass,!1),Rt.clone=Q),n.cloneId=Ht(function(){K("clone",n),Rt.eventCanceled||(n.options.removeCloneOnHide||q.insertBefore(Q,z),n._hideClone(),W({sortable:n,name:"clone"}))}),e||k(z,i.dragClass,!0),e?(mt=!0,n._loopId=setInterval(n._emulateDragOver,50)):(d(document,"mouseup",n._onDrop),d(document,"touchend",n._onDrop),d(document,"touchcancel",n._onDrop),o&&(o.effectAllowed="move",i.setData&&i.setData.call(n,o,z)),u(document,"drop",n),R(z,"transform","translateZ(0)")),vt=!0,n._dragStartId=Ht(n._dragStarted.bind(n,e,t)),u(document,"selectstart",n),dt=!0,s&&R(document.body,"user-select","none"))},_onDragOver:function(n){var o,i,r,a,l=this.el,s=n.target,e=this.options,t=e.group,c=Rt.active,u=ot===t,d=e.sort,h=it||c,f=this,p=!1;if(!Dt){if(void 0!==n.preventDefault&&n.cancelable&&n.preventDefault(),s=P(s,e.draggable,l,!0),M("dragOver"),Rt.eventCanceled)return p;if(z.contains(n.target)||s.animated&&s.animatingX&&s.animatingY||f._ignoreWhileAnimating===s)return A(!1);if(mt=!1,c&&!e.disabled&&(u?d||(r=!q.contains(z)):it===this||(this.lastPutMode=ot.checkPull(this,c,z,n))&&t.checkPut(this,c,z,n))){if(a="vertical"===this._getDirection(n,s),o=X(z),M("dragOverValid"),Rt.eventCanceled)return p;if(r)return G=q,O(),this._hideClone(),M("revert"),Rt.eventCanceled||(V?q.insertBefore(z,V):q.appendChild(z)),A(!0);var g=B(l,e.draggable);if(!g||function(t,e,n){var o=X(B(n.el,n.options.draggable));return e?t.clientX>o.right+10||t.clientX<=o.right&&t.clientY>o.bottom&&t.clientX>=o.left:t.clientX>o.right&&t.clientY>o.top||t.clientX<=o.right&&t.clientY>o.bottom+10}(n,a,this)&&!g.animated){if(g===z)return A(!1);if(g&&l===n.target&&(s=g),s&&(i=X(s)),!1!==Xt(q,l,z,o,s,i,n,!!s))return O(),l.appendChild(z),G=l,N(),A(!0)}else if(s.parentNode===l){i=X(s);var v,m,b,y=z.parentNode!==l,w=!function(t,e,n){var o=n?t.left:t.top,i=n?t.right:t.bottom,r=n?t.width:t.height,a=n?e.left:e.top,l=n?e.right:e.bottom,s=n?e.width:e.height;return o===a||i===l||o+r/2===a+s/2}(z.animated&&z.toRect||o,s.animated&&s.toRect||i,a),E=a?"top":"left",D=Y(s,"top","top")||Y(z,"top","top"),S=D?D.scrollTop:void 0;if(ht!==s&&(m=i[E],yt=!1,wt=!w&&e.invertSwap||y),0!==(v=function(t,e,n,o,i,r,a,l){var s=o?t.clientY:t.clientX,c=o?n.height:n.width,u=o?n.top:n.left,d=o?n.bottom:n.right,h=!1;if(!a)if(l&&pt<c*i){if(!yt&&(1===ft?u+c*r/2<s:s<d-c*r/2)&&(yt=!0),yt)h=!0;else if(1===ft?s<u+pt:d-pt<s)return-ft}else if(u+c*(1-i)/2<s&&s<d-c*(1-i)/2)return function(t){return F(z)<F(t)?1:-1}(e);if((h=h||a)&&(s<u+c*r/2||d-c*r/2<s))return u+c/2<s?1:-1;return 0}(n,s,i,a,w?1:e.swapThreshold,null==e.invertedSwapThreshold?e.swapThreshold:e.invertedSwapThreshold,wt,ht===s)))for(var _=F(z);_-=v,(b=G.children[_])&&("none"===R(b,"display")||b===U););if(0===v||b===s)return A(!1);ft=v;var C=(ht=s).nextElementSibling,T=!1,x=Xt(q,l,z,o,s,i,n,T=1===v);if(!1!==x)return 1!==x&&-1!==x||(T=1===x),Dt=!0,setTimeout(Bt,30),O(),T&&!C?l.appendChild(z):s.parentNode.insertBefore(z,T?C:s),D&&L(D,0,S-D.scrollTop),G=z.parentNode,void 0===m||wt||(pt=Math.abs(m-X(s)[E])),N(),A(!0)}if(l.contains(z))return A(!1)}return!1}function M(t,e){K(t,f,I({evt:n,isOwner:u,axis:a?"vertical":"horizontal",revert:r,dragRect:o,targetRect:i,canSort:d,fromSortable:h,target:s,completed:A,onMove:function(t,e){return Xt(q,l,z,o,t,X(t),n,e)},changed:N},e))}function O(){M("dragOverAnimationCapture"),f.captureAnimationState(),f!==h&&h.captureAnimationState()}function A(t){return M("dragOverCompleted",{insertion:t}),t&&(u?c._hideClone():c._showClone(f),f!==h&&(k(z,it?it.options.ghostClass:c.options.ghostClass,!1),k(z,e.ghostClass,!0)),it!==f&&f!==Rt.active?it=f:f===Rt.active&&it&&(it=null),h===f&&(f._ignoreWhileAnimating=s),f.animateAll(function(){M("dragOverAnimationComplete"),f._ignoreWhileAnimating=null}),f!==h&&(h.animateAll(),h._ignoreWhileAnimating=null)),(s===z&&!z.animated||s===l&&!s.animated)&&(ht=null),e.dragoverBubble||n.rootEl||s===document||(z.parentNode[j]._isOutsideThisEl(n.target),t||Pt(n)),!e.dragoverBubble&&n.stopPropagation&&n.stopPropagation(),p=!0}function N(){tt=F(z),nt=F(z,e.draggable),W({sortable:f,name:"change",toEl:l,newIndex:tt,newDraggableIndex:nt,originalEvent:n})}},_ignoreWhileAnimating:null,_offMoveEvents:function(){d(document,"mousemove",this._onTouchMove),d(document,"touchmove",this._onTouchMove),d(document,"pointermove",this._onTouchMove),d(document,"dragover",Pt),d(document,"mousemove",Pt),d(document,"touchmove",Pt)},_offUpEvents:function(){var t=this.el.ownerDocument;d(t,"mouseup",this._onDrop),d(t,"touchend",this._onDrop),d(t,"pointerup",this._onDrop),d(t,"touchcancel",this._onDrop),d(document,"selectstart",this)},_onDrop:function(t){var e=this.el,n=this.options;tt=F(z),nt=F(z,n.draggable),K("drop",this,{evt:t}),G=z&&z.parentNode,tt=F(z),nt=F(z,n.draggable),Rt.eventCanceled||(yt=wt=vt=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),Lt(this.cloneId),Lt(this._dragStartId),this.nativeDraggable&&(d(document,"drop",this),d(e,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),s&&R(document.body,"user-select",""),R(z,"transform",""),t&&(dt&&(t.cancelable&&t.preventDefault(),n.dropBubble||t.stopPropagation()),U&&U.parentNode&&U.parentNode.removeChild(U),(q===G||it&&"clone"!==it.lastPutMode)&&Q&&Q.parentNode&&Q.parentNode.removeChild(Q),z&&(this.nativeDraggable&&d(z,"dragend",this),Yt(z),z.style["will-change"]="",dt&&!vt&&k(z,it?it.options.ghostClass:this.options.ghostClass,!1),k(z,this.options.chosenClass,!1),W({sortable:this,name:"unchoose",toEl:G,newIndex:null,newDraggableIndex:null,originalEvent:t}),q!==G?(0<=tt&&(W({rootEl:G,name:"add",toEl:G,fromEl:q,originalEvent:t}),W({sortable:this,name:"remove",toEl:G,originalEvent:t}),W({rootEl:G,name:"sort",toEl:G,fromEl:q,originalEvent:t}),W({sortable:this,name:"sort",toEl:G,originalEvent:t})),it&&it.save()):tt!==J&&0<=tt&&(W({sortable:this,name:"update",toEl:G,originalEvent:t}),W({sortable:this,name:"sort",toEl:G,originalEvent:t})),Rt.active&&(null!=tt&&-1!==tt||(tt=J,nt=et),W({sortable:this,name:"end",toEl:G,originalEvent:t}),this.save())))),this._nulling()},_nulling:function(){K("nulling",this),q=z=G=U=V=Q=Z=$=rt=at=dt=tt=nt=J=et=ht=ft=it=ot=Rt.dragged=Rt.ghost=Rt.clone=Rt.active=null,St.forEach(function(t){t.checked=!0}),St.length=lt=st=0},handleEvent:function(t){switch(t.type){case"drop":case"dragend":this._onDrop(t);break;case"dragenter":case"dragover":z&&(this._onDragOver(t),function(t){t.dataTransfer&&(t.dataTransfer.dropEffect="move");t.cancelable&&t.preventDefault()}(t));break;case"selectstart":t.preventDefault()}},toArray:function(){for(var t,e=[],n=this.el.children,o=0,i=n.length,r=this.options;o<i;o++)P(t=n[o],r.draggable,this.el,!1)&&e.push(t.getAttribute(r.dataIdAttr)||Ft(t));return e},sort:function(t){var o={},i=this.el;this.toArray().forEach(function(t,e){var n=i.children[e];P(n,this.options.draggable,i,!1)&&(o[t]=n)},this),t.forEach(function(t){o[t]&&(i.removeChild(o[t]),i.appendChild(o[t]))})},save:function(){var t=this.options.store;t&&t.set&&t.set(this)},closest:function(t,e){return P(t,e||this.options.draggable,this.el,!1)},option:function(t,e){var n=this.options;if(void 0===e)return n[t];var o=O.modifyOption(this,t,e);n[t]=void 0!==o?o:e,"group"===t&&At(n)},destroy:function(){K("destroy",this);var t=this.el;t[j]=null,d(t,"mousedown",this._onTapStart),d(t,"touchstart",this._onTapStart),d(t,"pointerdown",this._onTapStart),this.nativeDraggable&&(d(t,"dragover",this),d(t,"dragenter",this)),Array.prototype.forEach.call(t.querySelectorAll("[draggable]"),function(t){t.removeAttribute("draggable")}),this._onDrop(),this._disableDelayedDragEvents(),bt.splice(bt.indexOf(this.el),1),this.el=t=null},_hideClone:function(){if(!$){if(K("hideClone",this),Rt.eventCanceled)return;R(Q,"display","none"),this.options.removeCloneOnHide&&Q.parentNode&&Q.parentNode.removeChild(Q),$=!0}},_showClone:function(t){if("clone"===t.lastPutMode){if($){if(K("showClone",this),Rt.eventCanceled)return;q.contains(z)&&!this.options.group.revertClone?q.insertBefore(Q,z):V?q.insertBefore(Q,V):q.appendChild(Q),this.options.group.revertClone&&this.animate(z,Q),R(Q,"display",""),$=!1}}else this._hideClone()}},_t&&u(document,"touchmove",function(t){(Rt.active||vt)&&t.cancelable&&t.preventDefault()}),Rt.utils={on:u,off:d,css:R,find:g,is:function(t,e){return!!P(t,e,t,!1)},extend:function(t,e){if(t&&e)for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},throttle:D,closest:P,toggleClass:k,clone:S,index:F,nextTick:Ht,cancelNextTick:Lt,detectDirection:Ot,getChild:m},Rt.get=function(t){return t[j]},Rt.mount=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];e[0].constructor===Array&&(e=e[0]),e.forEach(function(t){if(!t.prototype||!t.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(t));t.utils&&(Rt.utils=I({},Rt.utils,t.utils)),O.mount(t)})},Rt.create=function(t,e){return new Rt(t,e)};var jt,Kt,Wt,zt,Gt,Ut,qt=[],Vt=!(Rt.version="1.10.2");function Zt(){qt.forEach(function(t){clearInterval(t.pid)}),qt=[]}function Qt(){clearInterval(Ut)}function $t(t){var e=t.originalEvent,n=t.putSortable,o=t.dragEl,i=t.activeSortable,r=t.dispatchSortableEvent,a=t.hideGhostForTarget,l=t.unhideGhostForTarget;if(e){var s=n||i;a();var c=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:e,u=document.elementFromPoint(c.clientX,c.clientY);l(),s&&!s.el.contains(u)&&(r("spill"),this.onSpill({dragEl:o,putSortable:n}))}}var Jt,te=D(function(n,t,e,o){if(t.scroll){var i,r=(n.touches?n.touches[0]:n).clientX,a=(n.touches?n.touches[0]:n).clientY,l=t.scrollSensitivity,s=t.scrollSpeed,c=N(),u=!1;Kt!==e&&(Kt=e,Zt(),jt=t.scroll,i=t.scrollFn,!0===jt&&(jt=H(e,!0)));var d=0,h=jt;do{var f=h,p=X(f),g=p.top,v=p.bottom,m=p.left,b=p.right,y=p.width,w=p.height,E=void 0,D=void 0,S=f.scrollWidth,_=f.scrollHeight,C=R(f),T=f.scrollLeft,x=f.scrollTop;D=f===c?(E=y<S&&("auto"===C.overflowX||"scroll"===C.overflowX||"visible"===C.overflowX),w<_&&("auto"===C.overflowY||"scroll"===C.overflowY||"visible"===C.overflowY)):(E=y<S&&("auto"===C.overflowX||"scroll"===C.overflowX),w<_&&("auto"===C.overflowY||"scroll"===C.overflowY));var M=E&&(Math.abs(b-r)<=l&&T+y<S)-(Math.abs(m-r)<=l&&!!T),O=D&&(Math.abs(v-a)<=l&&x+w<_)-(Math.abs(g-a)<=l&&!!x);if(!qt[d])for(var A=0;A<=d;A++)qt[A]||(qt[A]={});qt[d].vx==M&&qt[d].vy==O&&qt[d].el===f||(qt[d].el=f,qt[d].vx=M,qt[d].vy=O,clearInterval(qt[d].pid),0==M&&0==O||(u=!0,qt[d].pid=setInterval(function(){o&&0===this.layer&&Rt.active._onTouchMove(Gt);var t=qt[this.layer].vy?qt[this.layer].vy*s:0,e=qt[this.layer].vx?qt[this.layer].vx*s:0;"function"==typeof i&&"continue"!==i.call(Rt.dragged.parentNode[j],e,t,n,Gt,qt[this.layer].el)||L(qt[this.layer].el,e,t)}.bind({layer:d}),24))),d++}while(t.bubbleScroll&&h!==c&&(h=H(h,!1)));Vt=u}},30);function ee(){}function ne(){}ee.prototype={startIndex:null,dragStart:function(t){var e=t.oldDraggableIndex;this.startIndex=e},onSpill:function(t){var e=t.dragEl,n=t.putSortable;this.sortable.captureAnimationState(),n&&n.captureAnimationState();var o=m(this.sortable.el,this.startIndex,this.options);o?this.sortable.el.insertBefore(e,o):this.sortable.el.appendChild(e),this.sortable.animateAll(),n&&n.animateAll()},drop:$t},a(ee,{pluginName:"revertOnSpill"}),ne.prototype={onSpill:function(t){var e=t.dragEl,n=t.putSortable||this.sortable;n.captureAnimationState(),e.parentNode&&e.parentNode.removeChild(e),n.animateAll()},drop:$t},a(ne,{pluginName:"removeOnSpill"});var oe,ie,re,ae,le,se=[],ce=[],ue=!1,de=!1,he=!1;function fe(o,i){ce.forEach(function(t,e){var n=i.children[t.sortableIndex+(o?Number(e):0)];n?i.insertBefore(t,n):i.appendChild(t)})}function pe(){se.forEach(function(t){t!==re&&t.parentNode&&t.parentNode.removeChild(t)})}return Rt.mount(new function(){function t(){for(var t in this.defaults={scroll:!0,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0},this)"_"===t.charAt(0)&&"function"==typeof this[t]&&(this[t]=this[t].bind(this))}return t.prototype={dragStarted:function(t){var e=t.originalEvent;this.sortable.nativeDraggable?u(document,"dragover",this._handleAutoScroll):this.options.supportPointer?u(document,"pointermove",this._handleFallbackAutoScroll):e.touches?u(document,"touchmove",this._handleFallbackAutoScroll):u(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(t){var e=t.originalEvent;this.options.dragOverBubble||e.rootEl||this._handleAutoScroll(e)},drop:function(){this.sortable.nativeDraggable?d(document,"dragover",this._handleAutoScroll):(d(document,"pointermove",this._handleFallbackAutoScroll),d(document,"touchmove",this._handleFallbackAutoScroll),d(document,"mousemove",this._handleFallbackAutoScroll)),Qt(),Zt(),clearTimeout(f),f=void 0},nulling:function(){Gt=Kt=jt=Vt=Ut=Wt=zt=null,qt.length=0},_handleFallbackAutoScroll:function(t){this._handleAutoScroll(t,!0)},_handleAutoScroll:function(e,n){var o=this,i=(e.touches?e.touches[0]:e).clientX,r=(e.touches?e.touches[0]:e).clientY,t=document.elementFromPoint(i,r);if(Gt=e,n||E||w||s){te(e,this.options,t,n);var a=H(t,!0);!Vt||Ut&&i===Wt&&r===zt||(Ut&&Qt(),Ut=setInterval(function(){var t=H(document.elementFromPoint(i,r),!0);t!==a&&(a=t,Zt()),te(e,o.options,t,n)},10),Wt=i,zt=r)}else{if(!this.options.bubbleScroll||H(t,!0)===N())return void Zt();te(e,this.options,H(t,!1),!1)}}},a(t,{pluginName:"scroll",initializeByDefault:!0})}),Rt.mount(ne,ee),Rt.mount(new function(){function t(){this.defaults={swapClass:"sortable-swap-highlight"}}return t.prototype={dragStart:function(t){var e=t.dragEl;Jt=e},dragOverValid:function(t){var e=t.completed,n=t.target,o=t.onMove,i=t.activeSortable,r=t.changed,a=t.cancel;if(i.options.swap){var l=this.sortable.el,s=this.options;if(n&&n!==l){var c=Jt;Jt=!1!==o(n)?(k(n,s.swapClass,!0),n):null,c&&c!==Jt&&k(c,s.swapClass,!1)}r(),e(!0),a()}},drop:function(t){var e=t.activeSortable,n=t.putSortable,o=t.dragEl,i=n||this.sortable,r=this.options;Jt&&k(Jt,r.swapClass,!1),Jt&&(r.swap||n&&n.options.swap)&&o!==Jt&&(i.captureAnimationState(),i!==e&&e.captureAnimationState(),function(t,e){var n,o,i=t.parentNode,r=e.parentNode;if(!i||!r||i.isEqualNode(e)||r.isEqualNode(t))return;n=F(t),o=F(e),i.isEqualNode(r)&&n<o&&o++;i.insertBefore(e,i.children[n]),r.insertBefore(t,r.children[o])}(o,Jt),i.animateAll(),i!==e&&e.animateAll())},nulling:function(){Jt=null}},a(t,{pluginName:"swap",eventProperties:function(){return{swapItem:Jt}}})}),Rt.mount(new function(){function t(o){for(var t in this)"_"===t.charAt(0)&&"function"==typeof this[t]&&(this[t]=this[t].bind(this));o.options.supportPointer?u(document,"pointerup",this._deselectMultiDrag):(u(document,"mouseup",this._deselectMultiDrag),u(document,"touchend",this._deselectMultiDrag)),u(document,"keydown",this._checkKeyDown),u(document,"keyup",this._checkKeyUp),this.defaults={selectedClass:"sortable-selected",multiDragKey:null,setData:function(t,e){var n="";se.length&&ie===o?se.forEach(function(t,e){n+=(e?", ":"")+t.textContent}):n=e.textContent,t.setData("Text",n)}}}return t.prototype={multiDragKeyDown:!1,isMultiDrag:!1,delayStartGlobal:function(t){var e=t.dragEl;re=e},delayEnded:function(){this.isMultiDrag=~se.indexOf(re)},setupClone:function(t){var e=t.sortable,n=t.cancel;if(this.isMultiDrag){for(var o=0;o<se.length;o++)ce.push(S(se[o])),ce[o].sortableIndex=se[o].sortableIndex,ce[o].draggable=!1,ce[o].style["will-change"]="",k(ce[o],this.options.selectedClass,!1),se[o]===re&&k(ce[o],this.options.chosenClass,!1);e._hideClone(),n()}},clone:function(t){var e=t.sortable,n=t.rootEl,o=t.dispatchSortableEvent,i=t.cancel;this.isMultiDrag&&(this.options.removeCloneOnHide||se.length&&ie===e&&(fe(!0,n),o("clone"),i()))},showClone:function(t){var e=t.cloneNowShown,n=t.rootEl,o=t.cancel;this.isMultiDrag&&(fe(!1,n),ce.forEach(function(t){R(t,"display","")}),e(),le=!1,o())},hideClone:function(t){var e=this,n=(t.sortable,t.cloneNowHidden),o=t.cancel;this.isMultiDrag&&(ce.forEach(function(t){R(t,"display","none"),e.options.removeCloneOnHide&&t.parentNode&&t.parentNode.removeChild(t)}),n(),le=!0,o())},dragStartGlobal:function(t){t.sortable;!this.isMultiDrag&&ie&&ie.multiDrag._deselectMultiDrag(),se.forEach(function(t){t.sortableIndex=F(t)}),se=se.sort(function(t,e){return t.sortableIndex-e.sortableIndex}),he=!0},dragStarted:function(t){var e=this,n=t.sortable;if(this.isMultiDrag){if(this.options.sort&&(n.captureAnimationState(),this.options.animation)){se.forEach(function(t){t!==re&&R(t,"position","absolute")});var o=X(re,!1,!0,!0);se.forEach(function(t){t!==re&&_(t,o)}),ue=de=!0}n.animateAll(function(){ue=de=!1,e.options.animation&&se.forEach(function(t){C(t)}),e.options.sort&&pe()})}},dragOver:function(t){var e=t.target,n=t.completed,o=t.cancel;de&&~se.indexOf(e)&&(n(!1),o())},revert:function(t){var e=t.fromSortable,n=t.rootEl,o=t.sortable,i=t.dragRect;1<se.length&&(se.forEach(function(t){o.addAnimationState({target:t,rect:de?X(t):i}),C(t),t.fromRect=i,e.removeAnimationState(t)}),de=!1,function(o,i){se.forEach(function(t,e){var n=i.children[t.sortableIndex+(o?Number(e):0)];n?i.insertBefore(t,n):i.appendChild(t)})}(!this.options.removeCloneOnHide,n))},dragOverCompleted:function(t){var e=t.sortable,n=t.isOwner,o=t.insertion,i=t.activeSortable,r=t.parentEl,a=t.putSortable,l=this.options;if(o){if(n&&i._hideClone(),ue=!1,l.animation&&1<se.length&&(de||!n&&!i.options.sort&&!a)){var s=X(re,!1,!0,!0);se.forEach(function(t){t!==re&&(_(t,s),r.appendChild(t))}),de=!0}if(!n)if(de||pe(),1<se.length){var c=le;i._showClone(e),i.options.animation&&!le&&c&&ce.forEach(function(t){i.addAnimationState({target:t,rect:ae}),t.fromRect=ae,t.thisAnimationDuration=null})}else i._showClone(e)}},dragOverAnimationCapture:function(t){var e=t.dragRect,n=t.isOwner,o=t.activeSortable;if(se.forEach(function(t){t.thisAnimationDuration=null}),o.options.animation&&!n&&o.multiDrag.isMultiDrag){ae=a({},e);var i=v(re,!0);ae.top-=i.f,ae.left-=i.e}},dragOverAnimationComplete:function(){de&&(de=!1,pe())},drop:function(t){var e=t.originalEvent,n=t.rootEl,o=t.parentEl,i=t.sortable,r=t.dispatchSortableEvent,a=t.oldIndex,l=t.putSortable,s=l||this.sortable;if(e){var c=this.options,u=o.children;if(!he)if(c.multiDragKey&&!this.multiDragKeyDown&&this._deselectMultiDrag(),k(re,c.selectedClass,!~se.indexOf(re)),~se.indexOf(re))se.splice(se.indexOf(re),1),oe=null,A({sortable:i,rootEl:n,name:"deselect",targetEl:re,originalEvt:e});else{if(se.push(re),A({sortable:i,rootEl:n,name:"select",targetEl:re,originalEvt:e}),e.shiftKey&&oe&&i.el.contains(oe)){var d,h,f=F(oe),p=F(re);if(~f&&~p&&f!==p)for(d=f<p?(h=f,p):(h=p,f+1);h<d;h++)~se.indexOf(u[h])||(k(u[h],c.selectedClass,!0),se.push(u[h]),A({sortable:i,rootEl:n,name:"select",targetEl:u[h],originalEvt:e}))}else oe=re;ie=s}if(he&&this.isMultiDrag){if((o[j].options.sort||o!==n)&&1<se.length){var g=X(re),v=F(re,":not(."+this.options.selectedClass+")");if(!ue&&c.animation&&(re.thisAnimationDuration=null),s.captureAnimationState(),!ue&&(c.animation&&(re.fromRect=g,se.forEach(function(t){if(t.thisAnimationDuration=null,t!==re){var e=de?X(t):g;t.fromRect=e,s.addAnimationState({target:t,rect:e})}})),pe(),se.forEach(function(t){u[v]?o.insertBefore(t,u[v]):o.appendChild(t),v++}),a===F(re))){var m=!1;se.forEach(function(t){t.sortableIndex===F(t)||(m=!0)}),m&&r("update")}se.forEach(function(t){C(t)}),s.animateAll()}ie=s}(n===o||l&&"clone"!==l.lastPutMode)&&ce.forEach(function(t){t.parentNode&&t.parentNode.removeChild(t)})}},nullingGlobal:function(){this.isMultiDrag=he=!1,ce.length=0},destroyGlobal:function(){this._deselectMultiDrag(),d(document,"pointerup",this._deselectMultiDrag),d(document,"mouseup",this._deselectMultiDrag),d(document,"touchend",this._deselectMultiDrag),d(document,"keydown",this._checkKeyDown),d(document,"keyup",this._checkKeyUp)},_deselectMultiDrag:function(t){if(!(void 0!==he&&he||ie!==this.sortable||t&&P(t.target,this.options.draggable,this.sortable.el,!1)||t&&0!==t.button))for(;se.length;){var e=se[0];k(e,this.options.selectedClass,!1),se.shift(),A({sortable:this.sortable,rootEl:this.sortable.el,name:"deselect",targetEl:e,originalEvt:t})}},_checkKeyDown:function(t){t.key===this.options.multiDragKey&&(this.multiDragKeyDown=!0)},_checkKeyUp:function(t){t.key===this.options.multiDragKey&&(this.multiDragKeyDown=!1)}},a(t,{pluginName:"multiDrag",utils:{select:function(t){var e=t.parentNode[j];e&&e.options.multiDrag&&!~se.indexOf(t)&&(ie&&ie!==e&&(ie.multiDrag._deselectMultiDrag(),ie=e),k(t,e.options.selectedClass,!0),se.push(t))},deselect:function(t){var e=t.parentNode[j],n=se.indexOf(t);e&&e.options.multiDrag&&~n&&(k(t,e.options.selectedClass,!1),se.splice(n,1))}},eventProperties:function(){var n=this,o=[],i=[];return se.forEach(function(t){var e;o.push({multiDragElement:t,index:t.sortableIndex}),e=de&&t!==re?-1:de?F(t,":not(."+n.options.selectedClass+")"):F(t),i.push({multiDragElement:t,index:e})}),{items:e(se),clones:[].concat(ce),oldIndicies:o,newIndicies:i}},optionListeners:{multiDragKey:function(t){return"ctrl"===(t=t.toLowerCase())?t="Control":1<t.length&&(t=t.charAt(0).toUpperCase()+t.substr(1)),t}}})}),Rt});

(function(t,n){"object"===typeof exports&&"object"===typeof module?module.exports=n(require("sortablejs")):"function"===typeof define&&define.amd?define(["sortablejs"],n):"object"===typeof exports?exports["vuedraggable"]=n(require("sortablejs")):t["vuedraggable"]=n(t["Sortable"])})("undefined"!==typeof self?self:this,function(t){return function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(r,o,function(n){return t[n]}.bind(null,o));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t["default"]}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s="fb15")}({"02f4":function(t,n,e){var r=e("4588"),o=e("be13");t.exports=function(t){return function(n,e){var i,u,c=String(o(n)),a=r(e),f=c.length;return a<0||a>=f?t?"":void 0:(i=c.charCodeAt(a),i<55296||i>56319||a+1===f||(u=c.charCodeAt(a+1))<56320||u>57343?t?c.charAt(a):i:t?c.slice(a,a+2):u-56320+(i-55296<<10)+65536)}}},"0390":function(t,n,e){"use strict";var r=e("02f4")(!0);t.exports=function(t,n,e){return n+(e?r(t,n).length:1)}},"07e3":function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},"0bfb":function(t,n,e){"use strict";var r=e("cb7c");t.exports=function(){var t=r(this),n="";return t.global&&(n+="g"),t.ignoreCase&&(n+="i"),t.multiline&&(n+="m"),t.unicode&&(n+="u"),t.sticky&&(n+="y"),n}},"0fc9":function(t,n,e){var r=e("3a38"),o=Math.max,i=Math.min;t.exports=function(t,n){return t=r(t),t<0?o(t+n,0):i(t,n)}},1654:function(t,n,e){"use strict";var r=e("71c1")(!0);e("30f1")(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,n=this._t,e=this._i;return e>=n.length?{value:void 0,done:!0}:(t=r(n,e),this._i+=t.length,{value:t,done:!1})})},1691:function(t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},"1af6":function(t,n,e){var r=e("63b6");r(r.S,"Array",{isArray:e("9003")})},"1bc3":function(t,n,e){var r=e("f772");t.exports=function(t,n){if(!r(t))return t;var e,o;if(n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;if("function"==typeof(e=t.valueOf)&&!r(o=e.call(t)))return o;if(!n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},"1ec9":function(t,n,e){var r=e("f772"),o=e("e53d").document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},"20fd":function(t,n,e){"use strict";var r=e("d9f6"),o=e("aebd");t.exports=function(t,n,e){n in t?r.f(t,n,o(0,e)):t[n]=e}},"214f":function(t,n,e){"use strict";e("b0c5");var r=e("2aba"),o=e("32e9"),i=e("79e5"),u=e("be13"),c=e("2b4c"),a=e("520a"),f=c("species"),s=!i(function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")}),l=function(){var t=/(?:)/,n=t.exec;t.exec=function(){return n.apply(this,arguments)};var e="ab".split(t);return 2===e.length&&"a"===e[0]&&"b"===e[1]}();t.exports=function(t,n,e){var p=c(t),d=!i(function(){var n={};return n[p]=function(){return 7},7!=""[t](n)}),v=d?!i(function(){var n=!1,e=/a/;return e.exec=function(){return n=!0,null},"split"===t&&(e.constructor={},e.constructor[f]=function(){return e}),e[p](""),!n}):void 0;if(!d||!v||"replace"===t&&!s||"split"===t&&!l){var h=/./[p],b=e(u,p,""[t],function(t,n,e,r,o){return n.exec===a?d&&!o?{done:!0,value:h.call(n,e,r)}:{done:!0,value:t.call(e,n,r)}:{done:!1}}),g=b[0],y=b[1];r(String.prototype,t,g),o(RegExp.prototype,p,2==n?function(t,n){return y.call(t,this,n)}:function(t){return y.call(t,this)})}}},"230e":function(t,n,e){var r=e("d3f4"),o=e("7726").document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},"23c6":function(t,n,e){var r=e("2d95"),o=e("2b4c")("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(t,n){try{return t[n]}catch(e){}};t.exports=function(t){var n,e,c;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=u(n=Object(t),o))?e:i?r(n):"Object"==(c=r(n))&&"function"==typeof n.callee?"Arguments":c}},"241e":function(t,n,e){var r=e("25eb");t.exports=function(t){return Object(r(t))}},"25eb":function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},"294c":function(t,n){t.exports=function(t){try{return!!t()}catch(n){return!0}}},"2aba":function(t,n,e){var r=e("7726"),o=e("32e9"),i=e("69a8"),u=e("ca5a")("src"),c=e("fa5b"),a="toString",f=(""+c).split(a);e("8378").inspectSource=function(t){return c.call(t)},(t.exports=function(t,n,e,c){var a="function"==typeof e;a&&(i(e,"name")||o(e,"name",n)),t[n]!==e&&(a&&(i(e,u)||o(e,u,t[n]?""+t[n]:f.join(String(n)))),t===r?t[n]=e:c?t[n]?t[n]=e:o(t,n,e):(delete t[n],o(t,n,e)))})(Function.prototype,a,function(){return"function"==typeof this&&this[u]||c.call(this)})},"2b4c":function(t,n,e){var r=e("5537")("wks"),o=e("ca5a"),i=e("7726").Symbol,u="function"==typeof i,c=t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))};c.store=r},"2d00":function(t,n){t.exports=!1},"2d95":function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},"2fdb":function(t,n,e){"use strict";var r=e("5ca1"),o=e("d2c8"),i="includes";r(r.P+r.F*e("5147")(i),"String",{includes:function(t){return!!~o(this,t,i).indexOf(t,arguments.length>1?arguments[1]:void 0)}})},"30f1":function(t,n,e){"use strict";var r=e("b8e3"),o=e("63b6"),i=e("9138"),u=e("35e8"),c=e("481b"),a=e("8f60"),f=e("45f2"),s=e("53e2"),l=e("5168")("iterator"),p=!([].keys&&"next"in[].keys()),d="@@iterator",v="keys",h="values",b=function(){return this};t.exports=function(t,n,e,g,y,x,m){a(e,n,g);var w,O,S,j=function(t){if(!p&&t in C)return C[t];switch(t){case v:return function(){return new e(this,t)};case h:return function(){return new e(this,t)}}return function(){return new e(this,t)}},_=n+" Iterator",M=y==h,T=!1,C=t.prototype,E=C[l]||C[d]||y&&C[y],A=E||j(y),P=y?M?j("entries"):A:void 0,I="Array"==n&&C.entries||E;if(I&&(S=s(I.call(new t)),S!==Object.prototype&&S.next&&(f(S,_,!0),r||"function"==typeof S[l]||u(S,l,b))),M&&E&&E.name!==h&&(T=!0,A=function(){return E.call(this)}),r&&!m||!p&&!T&&C[l]||u(C,l,A),c[n]=A,c[_]=b,y)if(w={values:M?A:j(h),keys:x?A:j(v),entries:P},m)for(O in w)O in C||i(C,O,w[O]);else o(o.P+o.F*(p||T),n,w);return w}},"32a6":function(t,n,e){var r=e("241e"),o=e("c3a1");e("ce7e")("keys",function(){return function(t){return o(r(t))}})},"32e9":function(t,n,e){var r=e("86cc"),o=e("4630");t.exports=e("9e1e")?function(t,n,e){return r.f(t,n,o(1,e))}:function(t,n,e){return t[n]=e,t}},"32fc":function(t,n,e){var r=e("e53d").document;t.exports=r&&r.documentElement},"335c":function(t,n,e){var r=e("6b4c");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},"355d":function(t,n){n.f={}.propertyIsEnumerable},"35e8":function(t,n,e){var r=e("d9f6"),o=e("aebd");t.exports=e("8e60")?function(t,n,e){return r.f(t,n,o(1,e))}:function(t,n,e){return t[n]=e,t}},"36c3":function(t,n,e){var r=e("335c"),o=e("25eb");t.exports=function(t){return r(o(t))}},3702:function(t,n,e){var r=e("481b"),o=e("5168")("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||i[o]===t)}},"3a38":function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},"40c3":function(t,n,e){var r=e("6b4c"),o=e("5168")("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(t,n){try{return t[n]}catch(e){}};t.exports=function(t){var n,e,c;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=u(n=Object(t),o))?e:i?r(n):"Object"==(c=r(n))&&"function"==typeof n.callee?"Arguments":c}},4588:function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},"45f2":function(t,n,e){var r=e("d9f6").f,o=e("07e3"),i=e("5168")("toStringTag");t.exports=function(t,n,e){t&&!o(t=e?t:t.prototype,i)&&r(t,i,{configurable:!0,value:n})}},4630:function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},"469f":function(t,n,e){e("6c1c"),e("1654"),t.exports=e("7d7b")},"481b":function(t,n){t.exports={}},"4aa6":function(t,n,e){t.exports=e("dc62")},"4bf8":function(t,n,e){var r=e("be13");t.exports=function(t){return Object(r(t))}},"4ee1":function(t,n,e){var r=e("5168")("iterator"),o=!1;try{var i=[7][r]();i["return"]=function(){o=!0},Array.from(i,function(){throw 2})}catch(u){}t.exports=function(t,n){if(!n&&!o)return!1;var e=!1;try{var i=[7],c=i[r]();c.next=function(){return{done:e=!0}},i[r]=function(){return c},t(i)}catch(u){}return e}},"50ed":function(t,n){t.exports=function(t,n){return{value:n,done:!!t}}},5147:function(t,n,e){var r=e("2b4c")("match");t.exports=function(t){var n=/./;try{"/./"[t](n)}catch(e){try{return n[r]=!1,!"/./"[t](n)}catch(o){}}return!0}},5168:function(t,n,e){var r=e("dbdb")("wks"),o=e("62a0"),i=e("e53d").Symbol,u="function"==typeof i,c=t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))};c.store=r},5176:function(t,n,e){t.exports=e("51b6")},"51b6":function(t,n,e){e("a3c3"),t.exports=e("584a").Object.assign},"520a":function(t,n,e){"use strict";var r=e("0bfb"),o=RegExp.prototype.exec,i=String.prototype.replace,u=o,c="lastIndex",a=function(){var t=/a/,n=/b*/g;return o.call(t,"a"),o.call(n,"a"),0!==t[c]||0!==n[c]}(),f=void 0!==/()??/.exec("")[1],s=a||f;s&&(u=function(t){var n,e,u,s,l=this;return f&&(e=new RegExp("^"+l.source+"$(?!\\s)",r.call(l))),a&&(n=l[c]),u=o.call(l,t),a&&u&&(l[c]=l.global?u.index+u[0].length:n),f&&u&&u.length>1&&i.call(u[0],e,function(){for(s=1;s<arguments.length-2;s++)void 0===arguments[s]&&(u[s]=void 0)}),u}),t.exports=u},"53e2":function(t,n,e){var r=e("07e3"),o=e("241e"),i=e("5559")("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},"549b":function(t,n,e){"use strict";var r=e("d864"),o=e("63b6"),i=e("241e"),u=e("b0dc"),c=e("3702"),a=e("b447"),f=e("20fd"),s=e("7cd6");o(o.S+o.F*!e("4ee1")(function(t){Array.from(t)}),"Array",{from:function(t){var n,e,o,l,p=i(t),d="function"==typeof this?this:Array,v=arguments.length,h=v>1?arguments[1]:void 0,b=void 0!==h,g=0,y=s(p);if(b&&(h=r(h,v>2?arguments[2]:void 0,2)),void 0==y||d==Array&&c(y))for(n=a(p.length),e=new d(n);n>g;g++)f(e,g,b?h(p[g],g):p[g]);else for(l=y.call(p),e=new d;!(o=l.next()).done;g++)f(e,g,b?u(l,h,[o.value,g],!0):o.value);return e.length=g,e}})},"54a1":function(t,n,e){e("6c1c"),e("1654"),t.exports=e("95d5")},5537:function(t,n,e){var r=e("8378"),o=e("7726"),i="__core-js_shared__",u=o[i]||(o[i]={});(t.exports=function(t,n){return u[t]||(u[t]=void 0!==n?n:{})})("versions",[]).push({version:r.version,mode:e("2d00")?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},5559:function(t,n,e){var r=e("dbdb")("keys"),o=e("62a0");t.exports=function(t){return r[t]||(r[t]=o(t))}},"584a":function(t,n){var e=t.exports={version:"2.6.5"};"number"==typeof __e&&(__e=e)},"5b4e":function(t,n,e){var r=e("36c3"),o=e("b447"),i=e("0fc9");t.exports=function(t){return function(n,e,u){var c,a=r(n),f=o(a.length),s=i(u,f);if(t&&e!=e){while(f>s)if(c=a[s++],c!=c)return!0}else for(;f>s;s++)if((t||s in a)&&a[s]===e)return t||s||0;return!t&&-1}}},"5ca1":function(t,n,e){var r=e("7726"),o=e("8378"),i=e("32e9"),u=e("2aba"),c=e("9b43"),a="prototype",f=function(t,n,e){var s,l,p,d,v=t&f.F,h=t&f.G,b=t&f.S,g=t&f.P,y=t&f.B,x=h?r:b?r[n]||(r[n]={}):(r[n]||{})[a],m=h?o:o[n]||(o[n]={}),w=m[a]||(m[a]={});for(s in h&&(e=n),e)l=!v&&x&&void 0!==x[s],p=(l?x:e)[s],d=y&&l?c(p,r):g&&"function"==typeof p?c(Function.call,p):p,x&&u(x,s,p,t&f.U),m[s]!=p&&i(m,s,d),g&&w[s]!=p&&(w[s]=p)};r.core=o,f.F=1,f.G=2,f.S=4,f.P=8,f.B=16,f.W=32,f.U=64,f.R=128,t.exports=f},"5d73":function(t,n,e){t.exports=e("469f")},"5f1b":function(t,n,e){"use strict";var r=e("23c6"),o=RegExp.prototype.exec;t.exports=function(t,n){var e=t.exec;if("function"===typeof e){var i=e.call(t,n);if("object"!==typeof i)throw new TypeError("RegExp exec method returned something other than an Object or null");return i}if("RegExp"!==r(t))throw new TypeError("RegExp#exec called on incompatible receiver");return o.call(t,n)}},"626a":function(t,n,e){var r=e("2d95");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},"62a0":function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+r).toString(36))}},"63b6":function(t,n,e){var r=e("e53d"),o=e("584a"),i=e("d864"),u=e("35e8"),c=e("07e3"),a="prototype",f=function(t,n,e){var s,l,p,d=t&f.F,v=t&f.G,h=t&f.S,b=t&f.P,g=t&f.B,y=t&f.W,x=v?o:o[n]||(o[n]={}),m=x[a],w=v?r:h?r[n]:(r[n]||{})[a];for(s in v&&(e=n),e)l=!d&&w&&void 0!==w[s],l&&c(x,s)||(p=l?w[s]:e[s],x[s]=v&&"function"!=typeof w[s]?e[s]:g&&l?i(p,r):y&&w[s]==p?function(t){var n=function(n,e,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(n);case 2:return new t(n,e)}return new t(n,e,r)}return t.apply(this,arguments)};return n[a]=t[a],n}(p):b&&"function"==typeof p?i(Function.call,p):p,b&&((x.virtual||(x.virtual={}))[s]=p,t&f.R&&m&&!m[s]&&u(m,s,p)))};f.F=1,f.G=2,f.S=4,f.P=8,f.B=16,f.W=32,f.U=64,f.R=128,t.exports=f},6762:function(t,n,e){"use strict";var r=e("5ca1"),o=e("c366")(!0);r(r.P,"Array",{includes:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}}),e("9c6c")("includes")},6821:function(t,n,e){var r=e("626a"),o=e("be13");t.exports=function(t){return r(o(t))}},"69a8":function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},"6a99":function(t,n,e){var r=e("d3f4");t.exports=function(t,n){if(!r(t))return t;var e,o;if(n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;if("function"==typeof(e=t.valueOf)&&!r(o=e.call(t)))return o;if(!n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},"6b4c":function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},"6c1c":function(t,n,e){e("c367");for(var r=e("e53d"),o=e("35e8"),i=e("481b"),u=e("5168")("toStringTag"),c="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),a=0;a<c.length;a++){var f=c[a],s=r[f],l=s&&s.prototype;l&&!l[u]&&o(l,u,f),i[f]=i.Array}},"71c1":function(t,n,e){var r=e("3a38"),o=e("25eb");t.exports=function(t){return function(n,e){var i,u,c=String(o(n)),a=r(e),f=c.length;return a<0||a>=f?t?"":void 0:(i=c.charCodeAt(a),i<55296||i>56319||a+1===f||(u=c.charCodeAt(a+1))<56320||u>57343?t?c.charAt(a):i:t?c.slice(a,a+2):u-56320+(i-55296<<10)+65536)}}},7726:function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},"774e":function(t,n,e){t.exports=e("d2d5")},"77f1":function(t,n,e){var r=e("4588"),o=Math.max,i=Math.min;t.exports=function(t,n){return t=r(t),t<0?o(t+n,0):i(t,n)}},"794b":function(t,n,e){t.exports=!e("8e60")&&!e("294c")(function(){return 7!=Object.defineProperty(e("1ec9")("div"),"a",{get:function(){return 7}}).a})},"79aa":function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},"79e5":function(t,n){t.exports=function(t){try{return!!t()}catch(n){return!0}}},"7cd6":function(t,n,e){var r=e("40c3"),o=e("5168")("iterator"),i=e("481b");t.exports=e("584a").getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[r(t)]}},"7d7b":function(t,n,e){var r=e("e4ae"),o=e("7cd6");t.exports=e("584a").getIterator=function(t){var n=o(t);if("function"!=typeof n)throw TypeError(t+" is not iterable!");return r(n.call(t))}},"7e90":function(t,n,e){var r=e("d9f6"),o=e("e4ae"),i=e("c3a1");t.exports=e("8e60")?Object.defineProperties:function(t,n){o(t);var e,u=i(n),c=u.length,a=0;while(c>a)r.f(t,e=u[a++],n[e]);return t}},8378:function(t,n){var e=t.exports={version:"2.6.5"};"number"==typeof __e&&(__e=e)},8436:function(t,n){t.exports=function(){}},"86cc":function(t,n,e){var r=e("cb7c"),o=e("c69a"),i=e("6a99"),u=Object.defineProperty;n.f=e("9e1e")?Object.defineProperty:function(t,n,e){if(r(t),n=i(n,!0),r(e),o)try{return u(t,n,e)}catch(c){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},"8aae":function(t,n,e){e("32a6"),t.exports=e("584a").Object.keys},"8e60":function(t,n,e){t.exports=!e("294c")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},"8f60":function(t,n,e){"use strict";var r=e("a159"),o=e("aebd"),i=e("45f2"),u={};e("35e8")(u,e("5168")("iterator"),function(){return this}),t.exports=function(t,n,e){t.prototype=r(u,{next:o(1,e)}),i(t,n+" Iterator")}},9003:function(t,n,e){var r=e("6b4c");t.exports=Array.isArray||function(t){return"Array"==r(t)}},9138:function(t,n,e){t.exports=e("35e8")},9306:function(t,n,e){"use strict";var r=e("c3a1"),o=e("9aa9"),i=e("355d"),u=e("241e"),c=e("335c"),a=Object.assign;t.exports=!a||e("294c")(function(){var t={},n={},e=Symbol(),r="abcdefghijklmnopqrst";return t[e]=7,r.split("").forEach(function(t){n[t]=t}),7!=a({},t)[e]||Object.keys(a({},n)).join("")!=r})?function(t,n){var e=u(t),a=arguments.length,f=1,s=o.f,l=i.f;while(a>f){var p,d=c(arguments[f++]),v=s?r(d).concat(s(d)):r(d),h=v.length,b=0;while(h>b)l.call(d,p=v[b++])&&(e[p]=d[p])}return e}:a},9427:function(t,n,e){var r=e("63b6");r(r.S,"Object",{create:e("a159")})},"95d5":function(t,n,e){var r=e("40c3"),o=e("5168")("iterator"),i=e("481b");t.exports=e("584a").isIterable=function(t){var n=Object(t);return void 0!==n[o]||"@@iterator"in n||i.hasOwnProperty(r(n))}},"9aa9":function(t,n){n.f=Object.getOwnPropertySymbols},"9b43":function(t,n,e){var r=e("d8e8");t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,o){return t.call(n,e,r,o)}}return function(){return t.apply(n,arguments)}}},"9c6c":function(t,n,e){var r=e("2b4c")("unscopables"),o=Array.prototype;void 0==o[r]&&e("32e9")(o,r,{}),t.exports=function(t){o[r][t]=!0}},"9def":function(t,n,e){var r=e("4588"),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},"9e1e":function(t,n,e){t.exports=!e("79e5")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},a159:function(t,n,e){var r=e("e4ae"),o=e("7e90"),i=e("1691"),u=e("5559")("IE_PROTO"),c=function(){},a="prototype",f=function(){var t,n=e("1ec9")("iframe"),r=i.length,o="<",u=">";n.style.display="none",e("32fc").appendChild(n),n.src="javascript:",t=n.contentWindow.document,t.open(),t.write(o+"script"+u+"document.F=Object"+o+"/script"+u),t.close(),f=t.F;while(r--)delete f[a][i[r]];return f()};t.exports=Object.create||function(t,n){var e;return null!==t?(c[a]=r(t),e=new c,c[a]=null,e[u]=t):e=f(),void 0===n?e:o(e,n)}},a352:function(n,e){n.exports=t},a3c3:function(t,n,e){var r=e("63b6");r(r.S+r.F,"Object",{assign:e("9306")})},a481:function(t,n,e){"use strict";var r=e("cb7c"),o=e("4bf8"),i=e("9def"),u=e("4588"),c=e("0390"),a=e("5f1b"),f=Math.max,s=Math.min,l=Math.floor,p=/\$([$&`']|\d\d?|<[^>]*>)/g,d=/\$([$&`']|\d\d?)/g,v=function(t){return void 0===t?t:String(t)};e("214f")("replace",2,function(t,n,e,h){return[function(r,o){var i=t(this),u=void 0==r?void 0:r[n];return void 0!==u?u.call(r,i,o):e.call(String(i),r,o)},function(t,n){var o=h(e,t,this,n);if(o.done)return o.value;var l=r(t),p=String(this),d="function"===typeof n;d||(n=String(n));var g=l.global;if(g){var y=l.unicode;l.lastIndex=0}var x=[];while(1){var m=a(l,p);if(null===m)break;if(x.push(m),!g)break;var w=String(m[0]);""===w&&(l.lastIndex=c(p,i(l.lastIndex),y))}for(var O="",S=0,j=0;j<x.length;j++){m=x[j];for(var _=String(m[0]),M=f(s(u(m.index),p.length),0),T=[],C=1;C<m.length;C++)T.push(v(m[C]));var E=m.groups;if(d){var A=[_].concat(T,M,p);void 0!==E&&A.push(E);var P=String(n.apply(void 0,A))}else P=b(_,p,M,T,E,n);M>=S&&(O+=p.slice(S,M)+P,S=M+_.length)}return O+p.slice(S)}];function b(t,n,r,i,u,c){var a=r+t.length,f=i.length,s=d;return void 0!==u&&(u=o(u),s=p),e.call(c,s,function(e,o){var c;switch(o.charAt(0)){case"$":return"$";case"&":return t;case"`":return n.slice(0,r);case"'":return n.slice(a);case"<":c=u[o.slice(1,-1)];break;default:var s=+o;if(0===s)return e;if(s>f){var p=l(s/10);return 0===p?e:p<=f?void 0===i[p-1]?o.charAt(1):i[p-1]+o.charAt(1):e}c=i[s-1]}return void 0===c?"":c})}})},a4bb:function(t,n,e){t.exports=e("8aae")},a745:function(t,n,e){t.exports=e("f410")},aae3:function(t,n,e){var r=e("d3f4"),o=e("2d95"),i=e("2b4c")("match");t.exports=function(t){var n;return r(t)&&(void 0!==(n=t[i])?!!n:"RegExp"==o(t))}},aebd:function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},b0c5:function(t,n,e){"use strict";var r=e("520a");e("5ca1")({target:"RegExp",proto:!0,forced:r!==/./.exec},{exec:r})},b0dc:function(t,n,e){var r=e("e4ae");t.exports=function(t,n,e,o){try{return o?n(r(e)[0],e[1]):n(e)}catch(u){var i=t["return"];throw void 0!==i&&r(i.call(t)),u}}},b447:function(t,n,e){var r=e("3a38"),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},b8e3:function(t,n){t.exports=!0},be13:function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},c366:function(t,n,e){var r=e("6821"),o=e("9def"),i=e("77f1");t.exports=function(t){return function(n,e,u){var c,a=r(n),f=o(a.length),s=i(u,f);if(t&&e!=e){while(f>s)if(c=a[s++],c!=c)return!0}else for(;f>s;s++)if((t||s in a)&&a[s]===e)return t||s||0;return!t&&-1}}},c367:function(t,n,e){"use strict";var r=e("8436"),o=e("50ed"),i=e("481b"),u=e("36c3");t.exports=e("30f1")(Array,"Array",function(t,n){this._t=u(t),this._i=0,this._k=n},function(){var t=this._t,n=this._k,e=this._i++;return!t||e>=t.length?(this._t=void 0,o(1)):o(0,"keys"==n?e:"values"==n?t[e]:[e,t[e]])},"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},c3a1:function(t,n,e){var r=e("e6f3"),o=e("1691");t.exports=Object.keys||function(t){return r(t,o)}},c649:function(t,n,e){"use strict";(function(t){e.d(n,"c",function(){return l}),e.d(n,"a",function(){return f}),e.d(n,"b",function(){return u}),e.d(n,"d",function(){return s});e("a481");var r=e("4aa6"),o=e.n(r);function i(){return"undefined"!==typeof window?window.console:t.console}var u=i();function c(t){var n=o()(null);return function(e){var r=n[e];return r||(n[e]=t(e))}}var a=/-(\w)/g,f=c(function(t){return t.replace(a,function(t,n){return n?n.toUpperCase():""})});function s(t){null!==t.parentElement&&t.parentElement.removeChild(t)}function l(t,n,e){var r=0===e?t.children[0]:t.children[e-1].nextSibling;t.insertBefore(n,r)}}).call(this,e("c8ba"))},c69a:function(t,n,e){t.exports=!e("9e1e")&&!e("79e5")(function(){return 7!=Object.defineProperty(e("230e")("div"),"a",{get:function(){return 7}}).a})},c8ba:function(t,n){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(r){"object"===typeof window&&(e=window)}t.exports=e},c8bb:function(t,n,e){t.exports=e("54a1")},ca5a:function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+r).toString(36))}},cb7c:function(t,n,e){var r=e("d3f4");t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},ce7e:function(t,n,e){var r=e("63b6"),o=e("584a"),i=e("294c");t.exports=function(t,n){var e=(o.Object||{})[t]||Object[t],u={};u[t]=n(e),r(r.S+r.F*i(function(){e(1)}),"Object",u)}},d2c8:function(t,n,e){var r=e("aae3"),o=e("be13");t.exports=function(t,n,e){if(r(n))throw TypeError("String#"+e+" doesn't accept regex!");return String(o(t))}},d2d5:function(t,n,e){e("1654"),e("549b"),t.exports=e("584a").Array.from},d3f4:function(t,n){t.exports=function(t){return"object"===typeof t?null!==t:"function"===typeof t}},d864:function(t,n,e){var r=e("79aa");t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,o){return t.call(n,e,r,o)}}return function(){return t.apply(n,arguments)}}},d8e8:function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},d9f6:function(t,n,e){var r=e("e4ae"),o=e("794b"),i=e("1bc3"),u=Object.defineProperty;n.f=e("8e60")?Object.defineProperty:function(t,n,e){if(r(t),n=i(n,!0),r(e),o)try{return u(t,n,e)}catch(c){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},dbdb:function(t,n,e){var r=e("584a"),o=e("e53d"),i="__core-js_shared__",u=o[i]||(o[i]={});(t.exports=function(t,n){return u[t]||(u[t]=void 0!==n?n:{})})("versions",[]).push({version:r.version,mode:e("b8e3")?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},dc62:function(t,n,e){e("9427");var r=e("584a").Object;t.exports=function(t,n){return r.create(t,n)}},e4ae:function(t,n,e){var r=e("f772");t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},e53d:function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},e6f3:function(t,n,e){var r=e("07e3"),o=e("36c3"),i=e("5b4e")(!1),u=e("5559")("IE_PROTO");t.exports=function(t,n){var e,c=o(t),a=0,f=[];for(e in c)e!=u&&r(c,e)&&f.push(e);while(n.length>a)r(c,e=n[a++])&&(~i(f,e)||f.push(e));return f}},f410:function(t,n,e){e("1af6"),t.exports=e("584a").Array.isArray},f559:function(t,n,e){"use strict";var r=e("5ca1"),o=e("9def"),i=e("d2c8"),u="startsWith",c=""[u];r(r.P+r.F*e("5147")(u),"String",{startsWith:function(t){var n=i(this,t,u),e=o(Math.min(arguments.length>1?arguments[1]:void 0,n.length)),r=String(t);return c?c.call(n,r,e):n.slice(e,e+r.length)===r}})},f772:function(t,n){t.exports=function(t){return"object"===typeof t?null!==t:"function"===typeof t}},fa5b:function(t,n,e){t.exports=e("5537")("native-function-to-string",Function.toString)},fb15:function(t,n,e){"use strict";var r;(e.r(n),"undefined"!==typeof window)&&((r=window.document.currentScript)&&(r=r.src.match(/(.+\/)[^\/]+\.js(\?.*)?$/))&&(e.p=r[1]));var o=e("5176"),i=e.n(o),u=(e("f559"),e("a4bb")),c=e.n(u),a=(e("6762"),e("2fdb"),e("a745")),f=e.n(a);function s(t){if(f()(t))return t}var l=e("5d73"),p=e.n(l);function d(t,n){var e=[],r=!0,o=!1,i=void 0;try{for(var u,c=p()(t);!(r=(u=c.next()).done);r=!0)if(e.push(u.value),n&&e.length===n)break}catch(a){o=!0,i=a}finally{try{r||null==c["return"]||c["return"]()}finally{if(o)throw i}}return e}function v(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function h(t,n){return s(t)||d(t,n)||v()}function b(t){if(f()(t)){for(var n=0,e=new Array(t.length);n<t.length;n++)e[n]=t[n];return e}}var g=e("774e"),y=e.n(g),x=e("c8bb"),m=e.n(x);function w(t){if(m()(Object(t))||"[object Arguments]"===Object.prototype.toString.call(t))return y()(t)}function O(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function S(t){return b(t)||w(t)||O()}var j=e("a352"),_=e.n(j),M=e("c649");function T(t,n,e){return void 0===e?t:(t=t||{},t[n]=e,t)}function C(t,n){return t.map(function(t){return t.elm}).indexOf(n)}function E(t,n,e,r){if(!t)return[];var o=t.map(function(t){return t.elm}),i=n.length-r,u=S(n).map(function(t,n){return n>=i?o.length:o.indexOf(t)});return e?u.filter(function(t){return-1!==t}):u}function A(t,n){var e=this;this.$nextTick(function(){return e.$emit(t.toLowerCase(),n)})}function P(t){var n=this;return function(e){null!==n.realList&&n["onDrag"+t](e),A.call(n,t,e)}}function I(t){if(!t||1!==t.length)return!1;var n=h(t,1),e=n[0].componentOptions;return!!e&&["transition-group","TransitionGroup"].includes(e.tag)}function L(t,n){var e=n.header,r=n.footer,o=0,i=0;return e&&(o=e.length,t=t?[].concat(S(e),S(t)):S(e)),r&&(i=r.length,t=t?[].concat(S(t),S(r)):S(r)),{children:t,headerOffset:o,footerOffset:i}}function F(t,n){var e=null,r=function(t,n){e=T(e,t,n)},o=c()(t).filter(function(t){return"id"===t||t.startsWith("data-")}).reduce(function(n,e){return n[e]=t[e],n},{});if(r("attrs",o),!n)return e;var u=n.on,a=n.props,f=n.attrs;return r("on",u),r("props",a),i()(e.attrs,f),e}var $=["Start","Add","Remove","Update","End"],k=["Choose","Sort","Filter","Clone"],D=["Move"].concat($,k).map(function(t){return"on"+t}),R=null,V={options:Object,list:{type:Array,required:!1,default:null},value:{type:Array,required:!1,default:null},noTransitionOnDrag:{type:Boolean,default:!1},clone:{type:Function,default:function(t){return t}},element:{type:String,default:"div"},tag:{type:String,default:null},move:{type:Function,default:null},componentData:{type:Object,required:!1,default:null}},N={name:"draggable",inheritAttrs:!1,props:V,data:function(){return{transitionMode:!1,noneFunctionalComponentMode:!1,init:!1}},render:function(t){var n=this.$slots.default;this.transitionMode=I(n);var e=L(n,this.$slots),r=e.children,o=e.headerOffset,i=e.footerOffset;this.headerOffset=o,this.footerOffset=i;var u=F(this.$attrs,this.componentData);return t(this.getTag(),u,r)},created:function(){null!==this.list&&null!==this.value&&M["b"].error("Value and list props are mutually exclusive! Please set one or another."),"div"!==this.element&&M["b"].warn("Element props is deprecated please use tag props instead. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#element-props"),void 0!==this.options&&M["b"].warn("Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props")},mounted:function(){var t=this;if(this.noneFunctionalComponentMode=this.getTag().toLowerCase()!==this.$el.nodeName.toLowerCase(),this.noneFunctionalComponentMode&&this.transitionMode)throw new Error("Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ".concat(this.getTag()));var n={};$.forEach(function(e){n["on"+e]=P.call(t,e)}),k.forEach(function(e){n["on"+e]=A.bind(t,e)});var e=c()(this.$attrs).reduce(function(n,e){return n[Object(M["a"])(e)]=t.$attrs[e],n},{}),r=i()({},this.options,e,n,{onMove:function(n,e){return t.onDragMove(n,e)}});!("draggable"in r)&&(r.draggable=">*"),this._sortable=new _.a(this.rootContainer,r),this.computeIndexes()},beforeDestroy:function(){void 0!==this._sortable&&this._sortable.destroy()},computed:{rootContainer:function(){return this.transitionMode?this.$el.children[0]:this.$el},realList:function(){return this.list?this.list:this.value}},watch:{options:{handler:function(t){this.updateOptions(t)},deep:!0},$attrs:{handler:function(t){this.updateOptions(t)},deep:!0},realList:function(){this.computeIndexes()}},methods:{getTag:function(){return this.tag||this.element},updateOptions:function(t){for(var n in t){var e=Object(M["a"])(n);-1===D.indexOf(e)&&this._sortable.option(e,t[n])}},getChildrenNodes:function(){if(this.init||(this.noneFunctionalComponentMode=this.noneFunctionalComponentMode&&1===this.$children.length,this.init=!0),this.noneFunctionalComponentMode)return this.$children[0].$slots.default;var t=this.$slots.default;return this.transitionMode?t[0].child.$slots.default:t},computeIndexes:function(){var t=this;this.$nextTick(function(){t.visibleIndexes=E(t.getChildrenNodes(),t.rootContainer.children,t.transitionMode,t.footerOffset)})},getUnderlyingVm:function(t){var n=C(this.getChildrenNodes()||[],t);if(-1===n)return null;var e=this.realList[n];return{index:n,element:e}},getUnderlyingPotencialDraggableComponent:function(t){var n=t.__vue__;return n&&n.$options&&"transition-group"===n.$options._componentTag?n.$parent:n},emitChanges:function(t){var n=this;this.$nextTick(function(){n.$emit("change",t)})},alterList:function(t){if(this.list)t(this.list);else{var n=S(this.value);t(n),this.$emit("input",n)}},spliceList:function(){var t=arguments,n=function(n){return n.splice.apply(n,S(t))};this.alterList(n)},updatePosition:function(t,n){var e=function(e){return e.splice(n,0,e.splice(t,1)[0])};this.alterList(e)},getRelatedContextFromMoveEvent:function(t){var n=t.to,e=t.related,r=this.getUnderlyingPotencialDraggableComponent(n);if(!r)return{component:r};var o=r.realList,u={list:o,component:r};if(n!==e&&o&&r.getUnderlyingVm){var c=r.getUnderlyingVm(e);if(c)return i()(c,u)}return u},getVmIndex:function(t){var n=this.visibleIndexes,e=n.length;return t>e-1?e:n[t]},getComponent:function(){return this.$slots.default[0].componentInstance},resetTransitionData:function(t){if(this.noTransitionOnDrag&&this.transitionMode){var n=this.getChildrenNodes();n[t].data=null;var e=this.getComponent();e.children=[],e.kept=void 0}},onDragStart:function(t){this.context=this.getUnderlyingVm(t.item),t.item._underlying_vm_=this.clone(this.context.element),R=t.item},onDragAdd:function(t){var n=t.item._underlying_vm_;if(void 0!==n){Object(M["d"])(t.item);var e=this.getVmIndex(t.newIndex);this.spliceList(e,0,n),this.computeIndexes();var r={element:n,newIndex:e};this.emitChanges({added:r})}},onDragRemove:function(t){if(Object(M["c"])(this.rootContainer,t.item,t.oldIndex),"clone"!==t.pullMode){var n=this.context.index;this.spliceList(n,1);var e={element:this.context.element,oldIndex:n};this.resetTransitionData(n),this.emitChanges({removed:e})}else Object(M["d"])(t.clone)},onDragUpdate:function(t){Object(M["d"])(t.item),Object(M["c"])(t.from,t.item,t.oldIndex);var n=this.context.index,e=this.getVmIndex(t.newIndex);this.updatePosition(n,e);var r={element:this.context.element,oldIndex:n,newIndex:e};this.emitChanges({moved:r})},updateProperty:function(t,n){t.hasOwnProperty(n)&&(t[n]+=this.headerOffset)},computeFutureIndex:function(t,n){if(!t.element)return 0;var e=S(n.to.children).filter(function(t){return"none"!==t.style["display"]}),r=e.indexOf(n.related),o=t.component.getVmIndex(r),i=-1!==e.indexOf(R);return i||!n.willInsertAfter?o:o+1},onDragMove:function(t,n){var e=this.move;if(!e||!this.realList)return!0;var r=this.getRelatedContextFromMoveEvent(t),o=this.context,u=this.computeFutureIndex(r,t);i()(o,{futureIndex:u});var c=i()({},t,{relatedContext:r,draggedContext:o});return e(c,n)},onDragEnd:function(){this.computeIndexes(),R=null}}};"undefined"!==typeof window&&"Vue"in window&&window.Vue.component("draggable",N);var U=N;n["default"]=U}})["default"]});
//# sourceMappingURL=vuedraggable.umd.min.js.map

  /**
 * vuex v2.1.1
 * (c) 2016 Evan You
 * @license MIT
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.Vuex=e()}(this,function(){"use strict";function t(t){x&&(t._devtoolHook=x,x.emit("vuex:init",t),x.on("vuex:travel-to-state",function(e){t.replaceState(e)}),t.subscribe(function(t,e){x.emit("vuex:mutation",t,e)}))}function e(t){function e(){var t=this.$options;t.store?this.$store=t.store:t.parent&&t.parent.$store&&(this.$store=t.parent.$store)}var n=Number(t.version.split(".")[0]);if(n>=2){var o=t.config._lifecycleHooks.indexOf("init")>-1;t.mixin(o?{init:e}:{beforeCreate:e})}else{var r=t.prototype._init;t.prototype._init=function(t){void 0===t&&(t={}),t.init=t.init?[e].concat(t.init):e,r.call(this,t)}}}function n(t){return Array.isArray(t)?t.map(function(t){return{key:t,val:t}}):Object.keys(t).map(function(e){return{key:e,val:t[e]}})}function o(t){return function(e,n){return"string"!=typeof e?(n=e,e=""):"/"!==e.charAt(e.length-1)&&(e+="/"),t(e,n)}}function r(t,e){console.error("[vuex] module namespace not found in "+t+"(): "+e)}function i(t,e){Object.keys(t).forEach(function(n){return e(t[n],n)})}function s(t){return null!==t&&"object"==typeof t}function a(t){return t&&"function"==typeof t.then}function u(t,e){if(!t)throw new Error("[vuex] "+e)}function c(t,e){if(t.update(e),e.modules)for(var n in e.modules){if(!t.getChild(n))return void console.warn("[vuex] trying to add a new module '"+n+"' on hot reloading, manual reload is needed");c(t.getChild(n),e.modules[n])}}function l(t){t._actions=Object.create(null),t._mutations=Object.create(null),t._wrappedGetters=Object.create(null),t._modulesNamespaceMap=Object.create(null);var e=t.state;p(t,e,[],t._modules.root,!0),f(t,e)}function f(t,e){var n=t._vm;t.getters={};var o=t._wrappedGetters,r={};i(o,function(e,n){r[n]=function(){return e(t)},Object.defineProperty(t.getters,n,{get:function(){return t._vm[n]},enumerable:!0})});var s=A.config.silent;A.config.silent=!0,t._vm=new A({data:{state:e},computed:r}),A.config.silent=s,t.strict&&_(t),n&&(t._withCommit(function(){n.state=null}),A.nextTick(function(){return n.$destroy()}))}function p(t,e,n,o,r){var i=!n.length,s=t._modules.getNamespace(n);if(s&&(t._modulesNamespaceMap[s]=o),!i&&!r){var a=g(e,n.slice(0,-1)),u=n[n.length-1];t._withCommit(function(){A.set(a,u,o.state)})}var c=o.context=h(t,s);o.forEachMutation(function(e,o){var r=s+o;m(t,r,e,n)}),o.forEachAction(function(e,o){var r=s+o;v(t,r,e,c,n)}),o.forEachGetter(function(e,o){var r=s+o;y(t,r,e,c,n)}),o.forEachChild(function(o,i){p(t,e,n.concat(i),o,r)})}function h(t,e){var n=""===e,o={dispatch:n?t.dispatch:function(n,o,r){var i=w(n,o,r),s=i.payload,a=i.options,u=i.type;return a&&a.root||(u=e+u,t._actions[u])?t.dispatch(u,s):void console.error("[vuex] unknown local action type: "+i.type+", global type: "+u)},commit:n?t.commit:function(n,o,r){var i=w(n,o,r),s=i.payload,a=i.options,u=i.type;return a&&a.root||(u=e+u,t._mutations[u])?void t.commit(u,s,a):void console.error("[vuex] unknown local mutation type: "+i.type+", global type: "+u)}};return Object.defineProperty(o,"getters",{get:n?function(){return t.getters}:function(){return d(t,e)}}),o}function d(t,e){var n={},o=e.length;return Object.keys(t.getters).forEach(function(r){if(r.slice(0,o)===e){var i=r.slice(o);Object.defineProperty(n,i,{get:function(){return t.getters[r]},enumerable:!0})}}),n}function m(t,e,n,o){var r=t._mutations[e]||(t._mutations[e]=[]);r.push(function(e){n(g(t.state,o),e)})}function v(t,e,n,o,r){var i=t._actions[e]||(t._actions[e]=[]);i.push(function(e,i){var s=n({dispatch:o.dispatch,commit:o.commit,getters:o.getters,state:g(t.state,r),rootGetters:t.getters,rootState:t.state},e,i);return a(s)||(s=Promise.resolve(s)),t._devtoolHook?s.catch(function(e){throw t._devtoolHook.emit("vuex:error",e),e}):s})}function y(t,e,n,o,r){return t._wrappedGetters[e]?void console.error("[vuex] duplicate getter key: "+e):void(t._wrappedGetters[e]=function(t){return n(g(t.state,r),o.getters,t.state,t.getters)})}function _(t){t._vm.$watch("state",function(){u(t._committing,"Do not mutate vuex store state outside mutation handlers.")},{deep:!0,sync:!0})}function g(t,e){return e.length?e.reduce(function(t,e){return t[e]},t):t}function w(t,e,n){return s(t)&&t.type&&(n=e,e=t,t=t.type),{type:t,payload:e,options:n}}function b(t){return A?void console.error("[vuex] already installed. Vue.use(Vuex) should be called only once."):(A=t,void e(A))}var x="undefined"!=typeof window&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__,O=o(function(t,e){var o={};return n(e).forEach(function(e){var n=e.key,i=e.val;o[n]=function(){var e=this.$store.state,n=this.$store.getters;if(t){var o=this.$store._modulesNamespaceMap[t];if(!o)return void r("mapState",t);e=o.state,n=o.context.getters}return"function"==typeof i?i.call(this,e,n):e[i]}}),o}),M=o(function(t,e){var o={};return n(e).forEach(function(e){var n=e.key,r=e.val;r=t+r,o[n]=function(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];return this.$store.commit.apply(this.$store,[r].concat(t))}}),o}),k=o(function(t,e){var o={};return n(e).forEach(function(e){var n=e.key,r=e.val;r=t+r,o[n]=function(){return r in this.$store.getters||console.error("[vuex] unknown getter: "+r),this.$store.getters[r]}}),o}),E=o(function(t,e){var o={};return n(e).forEach(function(e){var n=e.key,r=e.val;r=t+r,o[n]=function(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];return this.$store.dispatch.apply(this.$store,[r].concat(t))}}),o}),j=function(t,e){this.runtime=e,this._children=Object.create(null),this._rawModule=t},C={state:{},namespaced:{}};C.state.get=function(){return this._rawModule.state||{}},C.namespaced.get=function(){return!!this._rawModule.namespaced},j.prototype.addChild=function(t,e){this._children[t]=e},j.prototype.removeChild=function(t){delete this._children[t]},j.prototype.getChild=function(t){return this._children[t]},j.prototype.update=function(t){this._rawModule.namespaced=t.namespaced,t.actions&&(this._rawModule.actions=t.actions),t.mutations&&(this._rawModule.mutations=t.mutations),t.getters&&(this._rawModule.getters=t.getters)},j.prototype.forEachChild=function(t){i(this._children,t)},j.prototype.forEachGetter=function(t){this._rawModule.getters&&i(this._rawModule.getters,t)},j.prototype.forEachAction=function(t){this._rawModule.actions&&i(this._rawModule.actions,t)},j.prototype.forEachMutation=function(t){this._rawModule.mutations&&i(this._rawModule.mutations,t)},Object.defineProperties(j.prototype,C);var $=function(t){var e=this;this.root=new j(t,!1),t.modules&&i(t.modules,function(t,n){e.register([n],t,!1)})};$.prototype.get=function(t){return t.reduce(function(t,e){return t.getChild(e)},this.root)},$.prototype.getNamespace=function(t){var e=this.root;return t.reduce(function(t,n){return e=e.getChild(n),t+(e.namespaced?n+"/":"")},"")},$.prototype.update=function(t){c(this.root,t)},$.prototype.register=function(t,e,n){var o=this;void 0===n&&(n=!0);var r=this.get(t.slice(0,-1)),s=new j(e,n);r.addChild(t[t.length-1],s),e.modules&&i(e.modules,function(e,r){o.register(t.concat(r),e,n)})},$.prototype.unregister=function(t){var e=this.get(t.slice(0,-1)),n=t[t.length-1];e.getChild(n).runtime&&e.removeChild(n)};var A,V=function(e){var n=this;void 0===e&&(e={}),u(A,"must call Vue.use(Vuex) before creating a store instance."),u("undefined"!=typeof Promise,"vuex requires a Promise polyfill in this browser.");var o=e.state;void 0===o&&(o={});var r=e.plugins;void 0===r&&(r=[]);var i=e.strict;void 0===i&&(i=!1),this._committing=!1,this._actions=Object.create(null),this._mutations=Object.create(null),this._wrappedGetters=Object.create(null),this._modules=new $(e),this._modulesNamespaceMap=Object.create(null),this._subscribers=[],this._watcherVM=new A;var s=this,a=this,c=a.dispatch,l=a.commit;this.dispatch=function(t,e){return c.call(s,t,e)},this.commit=function(t,e,n){return l.call(s,t,e,n)},this.strict=i,p(this,o,[],this._modules.root),f(this,o),r.concat(t).forEach(function(t){return t(n)})},G={state:{}};G.state.get=function(){return this._vm.$data.state},G.state.set=function(t){u(!1,"Use store.replaceState() to explicit replace store state.")},V.prototype.commit=function(t,e,n){var o=this,r=w(t,e,n),i=r.type,s=r.payload,a=r.options,u={type:i,payload:s},c=this._mutations[i];return c?(this._withCommit(function(){c.forEach(function(t){t(s)})}),this._subscribers.forEach(function(t){return t(u,o.state)}),void(a&&a.silent&&console.warn("[vuex] mutation type: "+i+". Silent option has been removed. Use the filter functionality in the vue-devtools"))):void console.error("[vuex] unknown mutation type: "+i)},V.prototype.dispatch=function(t,e){var n=w(t,e),o=n.type,r=n.payload,i=this._actions[o];return i?i.length>1?Promise.all(i.map(function(t){return t(r)})):i[0](r):void console.error("[vuex] unknown action type: "+o)},V.prototype.subscribe=function(t){var e=this._subscribers;return e.indexOf(t)<0&&e.push(t),function(){var n=e.indexOf(t);n>-1&&e.splice(n,1)}},V.prototype.watch=function(t,e,n){var o=this;return u("function"==typeof t,"store.watch only accepts a function."),this._watcherVM.$watch(function(){return t(o.state,o.getters)},e,n)},V.prototype.replaceState=function(t){var e=this;this._withCommit(function(){e._vm.state=t})},V.prototype.registerModule=function(t,e){"string"==typeof t&&(t=[t]),u(Array.isArray(t),"module path must be a string or an Array."),this._modules.register(t,e),p(this,this.state,t,this._modules.get(t)),f(this,this.state)},V.prototype.unregisterModule=function(t){var e=this;"string"==typeof t&&(t=[t]),u(Array.isArray(t),"module path must be a string or an Array."),this._modules.unregister(t),this._withCommit(function(){var n=g(e.state,t.slice(0,-1));A.delete(n,t[t.length-1])}),l(this)},V.prototype.hotUpdate=function(t){this._modules.update(t),l(this)},V.prototype._withCommit=function(t){var e=this._committing;this._committing=!0,t(),this._committing=e},Object.defineProperties(V.prototype,G),"undefined"!=typeof window&&window.Vue&&b(window.Vue);var P={Store:V,install:b,version:"2.1.1",mapState:O,mapMutations:M,mapGetters:k,mapActions:E};return P});

require=function e(t,r,n){function i(s,a){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(o)return o(s,!0);var f=new Error("Cannot find module '"+s+"'");throw f.code="MODULE_NOT_FOUND",f}var u=r[s]={exports:{}};t[s][0].call(u.exports,function(e){var r=t[s][1][e];return i(r||e)},u,u.exports,e,t,r,n)}return r[s].exports}for(var o="function"==typeof require&&require,s=0;s<n.length;s++)i(n[s]);return i}({"./image_exports/png.coffee":[function(e,t,r){e("rsvp"),t.exports={toBase64:function(){var e,t,r,n,i,o,s,a,c;for(e=document.createElement("canvas"),e.width=this.width(),e.height=this.height(),t=e.getContext("2d"),n=t.getImageData(0,0,this.width(),this.height()),a=n.data,c=this.pixelData,r=i=0,o=c.length;i<o;r=++i)s=c[r],a[r]=s;return t.putImageData(n,0,0),e.toDataURL("image/png")},toPng:function(){var e,t;return e=this.toBase64(),t=new Image,t.width=this.width(),t.height=this.height(),t.src=e,t},saveAsPng:function(){throw"Not available in the browser. Use toPng() instead."}}},{rsvp:112}],"./psd/init.coffee":[function(e,t,r){var n;n=e("rsvp"),t.exports={extended:function(e){return this.fromURL=function(t){return new n.Promise(function(r,n){var i;return i=new XMLHttpRequest,i.open("GET",t,!0),i.responseType="arraybuffer",i.onload=function(){var t,n;return t=new Uint8Array(i.response||i.mozResponseArrayBuffer),n=new e(t),n.parse(),r(n)},i.send(null)})},this.fromEvent=function(t){return new n.Promise(function(r,n){var i,o;return i=t.dataTransfer.files[0],o=new FileReader,o.onload=function(t){var n;return n=new e(new Uint8Array(t.target.result)),n.parse(),r(n)},o.onerror=n,o.readAsArrayBuffer(i)})},this.fromDroppedFile=function(t){return new n.Promise(function(r,n){var i;return i=new FileReader,i.onload=function(t){var n;return n=new e(new Uint8Array(t.target.result)),n.parse(),r(n)},i.onerror=n,i.readAsArrayBuffer(t)})}}}},{rsvp:112}],1:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("coffeescript-module").Module,t.exports=function(e){function t(e){this.file=e,this.blendKey=null,this.opacity=null,this.clipping=null,this.clipped=null,this.flags=null,this.mode=null,this.visible=null}var r;return i(t,e),t.aliasProperty("blendingMode","mode"),r={norm:"normal",dark:"darken",lite:"lighten",hue:"hue",sat:"saturation",colr:"color",lum:"luminosity",mul:"multiply",scrn:"screen",diss:"dissolve",over:"overlay",hLit:"hard_light",sLit:"soft_light",diff:"difference",smud:"exclusion",div:"color_dodge",idiv:"color_burn",lbrn:"linear_burn",lddg:"linear_dodge",vLit:"vivid_light",lLit:"linear_light",pLit:"pin_light",hMix:"hard_mix",pass:"passthru",dkCl:"darker_color",lgCl:"lighter_color",fsub:"subtract",fdiv:"divide"},t.prototype.parse=function(){return this.file.seek(4,!0),this.blendKey=this.file.readString(4).trim(),this.opacity=this.file.readByte(),this.clipping=this.file.readByte(),this.flags=this.file.readByte(),this.mode=r[this.blendKey],this.clipped=1===this.clipping,this.visible=!((2&this.flags)>0),this.file.seek(1,!0)},t.prototype.opacityPercentage=function(){return 100*this.opacity/255},t}(n)},{"coffeescript-module":82}],2:[function(e,t,r){var n,i,o,s=function(e,t){function r(){this.constructor=e}for(var n in t)a.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},a={}.hasOwnProperty;o=e("lodash"),n=e("./image.coffee"),i=e("./image_format.coffee"),t.exports=function(e){function t(e,r,n){this.layer=n,this._width=this.layer.width,this._height=this.layer.height,t.__super__.constructor.call(this,e,r),this.channelsInfo=this.layer.channelsInfo,this.hasMask=o.any(this.channelsInfo,function(e){return e.id<-1}),this.opacity=this.layer.opacity/255,this.maskData=[]}return s(t,e),t.includes(i.LayerRAW),t.includes(i.LayerRLE),t.prototype.skip=function(){var e,t,r,n,i;for(n=this.channelsInfo,i=[],t=0,r=n.length;t<r;t++)e=n[t],i.push(this.file.seek(e.length,!0));return i},t.prototype.width=function(){return this._width},t.prototype.height=function(){return this._height},t.prototype.channels=function(){return this.layer.channels},t.prototype.parse=function(){var e,t,r,n,i;for(this.chanPos=0,n=this.channelsInfo,t=0,r=n.length;t<r;t++)e=n[t],e.length<=0?this.parseCompression():(this.chan=e,e.id<-1?(this._width=this.layer.mask.width,this._height=this.layer.mask.height):(this._width=this.layer.width,this._height=this.layer.height),this.length=this._width*this._height,i=this.file.tell(),this.parseImageData(),this.file.tell()!==i+this.chan.length&&this.file.seek(i+this.chan.length));return this._width=this.layer.width,this._height=this.layer.height,this.processImageData()},t.prototype.parseImageData=function(){switch(this.compression=this.parseCompression(),this.compression){case 0:return this.parseRaw();case 1:return this.parseRLE();case 2:case 3:return this.parseZip();default:return this.file.seek(this.endPos)}},t}(n)},{"./image.coffee":7,"./image_format.coffee":9,lodash:109}],3:[function(e,t,r){var n;n=e("./util.coffee"),t.exports={cmykToRgb:function(e,t,r,i){var o,s,a;return a=n.clamp(65535-(e*(255-i)+(i<<8))>>8,0,255),s=n.clamp(65535-(t*(255-i)+(i<<8))>>8,0,255),o=n.clamp(65535-(r*(255-i)+(i<<8))>>8,0,255),[a,s,o]}}},{"./util.coffee":63}],4:[function(e,t,r){t.exports=function(){function e(e){this.file=e,this.data={}}return e.prototype.parse=function(){var e,t,r,n,i,o;for(this.data.class=this.parseClass(),r=this.file.readInt(),t=0,n=r;0<=n?t<n:t>n;0<=n?++t:--t)i=this.parseKeyItem(),e=i[0],o=i[1],this.data[e]=o;return this.data},e.prototype.parseClass=function(){return{name:this.file.readUnicodeString(),id:this.parseId()}},e.prototype.parseId=function(){var e;return e=this.file.readInt(),0===e?this.file.readString(4):this.file.readString(e)},e.prototype.parseKeyItem=function(){var e,t;return e=this.parseId(),t=this.parseItem(),[e,t]},e.prototype.parseItem=function(t){switch(null==t&&(t=null),null==t&&(t=this.file.readString(4)),t){case"bool":return this.parseBoolean();case"type":case"GlbC":return this.parseClass();case"Objc":case"GlbO":return new e(this.file).parse();case"doub":return this.parseDouble();case"enum":return this.parseEnum();case"alis":return this.parseAlias();case"Pth":return this.parseFilePath();case"long":return this.parseInteger();case"comp":return this.parseLargeInteger();case"VlLs":return this.parseList();case"ObAr":return this.parseObjectArray();case"tdta":return this.parseRawData();case"obj ":return this.parseReference();case"TEXT":return this.file.readUnicodeString();case"UntF":return this.parseUnitDouble();case"UnFl":return this.parseUnitFloat()}},e.prototype.parseBoolean=function(){return this.file.readBoolean()},e.prototype.parseDouble=function(){return this.file.readDouble()},e.prototype.parseInteger=function(){return this.file.readInt()},e.prototype.parseLargeInteger=function(){return this.file.readLongLong()},e.prototype.parseIdentifier=function(){return this.file.readInt()},e.prototype.parseIndex=function(){return this.file.readInt()},e.prototype.parseOffset=function(){return this.file.readInt()},e.prototype.parseProperty=function(){return{class:this.parseClass(),id:this.parseId()}},e.prototype.parseEnum=function(){return{type:this.parseId(),value:this.parseId()}},e.prototype.parseEnumReference=function(){return{class:this.parseClass(),type:this.parseId(),value:this.parseId()}},e.prototype.parseAlias=function(){var e;return e=this.file.readInt(),this.file.readString(e)},e.prototype.parseFilePath=function(){var e,t,r;return this.file.readInt(),r=this.file.readString(4),this.file.read("<i"),e=this.file.read("<i"),t=this.file.readUnicodeString(e),{sig:r,path:t}},e.prototype.parseList=function(){var e,t,r,n;for(e=this.file.readInt(),t=[],r=0,n=e;0<=n?r<n:r>n;0<=n?++r:--r)t.push(this.parseItem());return t},e.prototype.parseObjectArray=function(){throw"Descriptor object array not implemented yet @ "+this.file.tell()},e.prototype.parseRawData=function(){var e;return e=this.file.readInt(),this.file.read(e)},e.prototype.parseReference=function(){var e,t,r,n,i,o;for(r=this.file.readInt(),e=[],t=0,n=r;0<=n?t<n:t>n;0<=n?++t:--t)i=this.file.readString(4),o=function(){switch(i){case"prop":return this.parseProperty();case"Clss":return this.parseClass();case"Enmr":return this.parseEnumReference();case"Idnt":return this.parseIdentifier();case"indx":return this.parseIndex();case"name":return this.file.readUnicodeString();case"rele":return this.parseOffset()}}.call(this),e.push({type:i,value:o});return e},e.prototype.parseUnitDouble=function(){var e,t,r;return t=this.file.readString(4),e=function(){switch(t){case"#Ang":return"Angle";case"#Rsl":return"Density";case"#Rlt":return"Distance";case"#Nne":return"None";case"#Prc":return"Percent";case"#Pxl":return"Pixels";case"#Mlm":return"Millimeters";case"#Pnt":return"Points"}}(),r=this.file.readDouble(),{id:t,unit:e,value:r}},e.prototype.parseUnitFloat=function(){var e,t,r;return t=this.file.readString(4),e=function(){switch(t){case"#Ang":return"Angle";case"#Rsl":return"Density";case"#Rlt":return"Distance";case"#Nne":return"None";case"#Prc":return"Percent";case"#Pxl":return"Pixels";case"#Mlm":return"Millimeters";case"#Pnt":return"Points"}}(),r=this.file.readFloat(),{id:t,unit:e,value:r}},e}()},{}],5:[function(e,t,r){(function(r){var n,i,o={}.hasOwnProperty;i=e("jspack").jspack,n=e("iconv-lite"),e("./color.coffee"),e("./util.coffee"),t.exports=function(){function e(e){this.data=e}var t,s,a,c;t={Int:{code:">i",length:4},UInt:{code:">I",length:4},Short:{code:">h",length:2},UShort:{code:">H",length:2},Float:{code:">f",length:4},Double:{code:">d",length:8},LongLong:{code:">q",length:8}},s=function(t,r){return e.prototype["read"+t]=function(){return this.readf(r.code,r.length)[0]}};for(a in t)o.call(t,a)&&(c=t[a],s(a,c));return e.prototype.pos=0,e.prototype.tell=function(){return this.pos},e.prototype.read=function(e){var t,r,n;for(n=[],t=0,r=e;0<=r?t<r:t>r;0<=r?++t:--t)n.push(this.data[this.pos++]);return n},e.prototype.readf=function(e,t){return null==t&&(t=null),i.Unpack(e,this.read(t||i.CalcLength(e)))},e.prototype.seek=function(e,t){return null==t&&(t=!1),t?this.pos+=e:this.pos=e},e.prototype.readString=function(e){return String.fromCharCode.apply(null,this.read(e)).replace(/\u0000/g,"")},e.prototype.readUnicodeString=function(e){return null==e&&(e=null),e||(e=this.readInt()),n.decode(new r(this.read(2*e)),"utf-16be").replace(/\u0000/g,"")},e.prototype.readByte=function(){return this.read(1)[0]},e.prototype.readBoolean=function(){return 0!==this.readByte()},e.prototype.readSpaceColor=function(){var e,t,r;for(t=this.readShort(),r=0;r<4;++r)e=this.readShort()>>8;return{colorSpace:t,components:e}},e.prototype.readPathNumber=function(){var e,t,r,n,i,o;return e=this.readByte(),t=this.read(3),n=t[0]<<16,i=t[1]<<8,o=t[2],r=n|i|o,parseFloat(e,10)+parseFloat(r/Math.pow(2,24),10)},e}()}).call(this,e("buffer").Buffer)},{"./color.coffee":3,"./util.coffee":63,buffer:66,"iconv-lite":103,jspack:108}],6:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("coffeescript-module").Module,t.exports=function(e){function t(e){this.file=e}var r;return i(t,e),t.aliasProperty("height","rows"),t.aliasProperty("width","cols"),r=["Bitmap","GrayScale","IndexedColor","RGBColor","CMYKColor","HSLColor","HSBColor","Multichannel","Duotone","LabColor","Gray16","RGB48","Lab48","CMYK64","DeepMultichannel","Duotone16"],t.prototype.sig=null,t.prototype.version=null,t.prototype.channels=null,t.prototype.rows=null,t.prototype.cols=null,t.prototype.depth=null,t.prototype.mode=null,t.prototype.parse=function(){var e;return this.sig=this.file.readString(4),this.version=this.file.readUShort(),this.file.seek(6,!0),this.channels=this.file.readUShort(),this.rows=this.height=this.file.readUInt(),this.cols=this.width=this.file.readUInt(),this.depth=this.file.readUShort(),this.mode=this.file.readUShort(),e=this.file.readUInt(),this.file.seek(e,!0)},t.prototype.modeName=function(){return r[this.mode]},t.prototype.export=function(){var e,t,r,n,i;for(e={},i=["sig","version","channels","rows","cols","depth","mode"],t=0,n=i.length;t<n;t++)r=i[t],e[r]=this[r];return e},t}(n)},{"coffeescript-module":82}],7:[function(e,t,r){var n,i,o,s,a=function(e,t){function r(){this.constructor=e}for(var n in t)c.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},c={}.hasOwnProperty;s=e("coffeescript-module").Module,i=e("./image_format.coffee"),o=e("./image_mode.coffee"),n=e("./image_export.coffee"),t.exports=function(e){function t(e,t){this.file=e,this.header=t,this.numPixels=this.width()*this.height(),16===this.depth()&&(this.numPixels*=2),this.calculateLength(),this.pixelData=[],this.channelData=[],this.opacity=1,this.hasMask=!1,this.startPos=this.file.tell(),this.endPos=this.startPos+this.length,this.setChannelsInfo()}var r,s,c,f,u;for(a(t,e),t.includes(i.RAW),t.includes(i.RLE),t.includes(o.Greyscale),t.includes(o.RGB),t.includes(o.CMYK),t.includes(n.PNG),["Raw","RLE","ZIP","ZIPPrediction"],u=["width","height","channels","depth","mode"],s=function(e){return t.prototype[e]=function(){return this.header[e]}},c=0,f=u.length;c<f;c++)r=u[c],s(r);return t.prototype.setChannelsInfo=function(){switch(this.mode()){case 1:return this.setGreyscaleChannels();case 3:return this.setRgbChannels();case 4:return this.setCmykChannels()}},t.prototype.calculateLength=function(){return this.length=function(){switch(this.depth()){case 1:return(this.width()+7)/8*this.height();case 16:return this.width()*this.height()*2;default:return this.width()*this.height()}}.call(this),this.channelLength=this.length,this.length*=this.channels()},t.prototype.parse=function(){var e;return this.compression=this.parseCompression(),2===(e=this.compression)||3===e?void this.file.seek(this.endPos):this.parseImageData()},t.prototype.parseCompression=function(){return this.file.readShort()},t.prototype.parseImageData=function(){switch(this.compression){case 0:this.parseRaw();break;case 1:this.parseRLE();break;case 2:case 3:this.parseZip();break;default:this.file.seek(this.endPos)}return this.processImageData()},t.prototype.processImageData=function(){switch(this.mode()){case 1:this.combineGreyscaleChannel();break;case 3:this.combineRgbChannel();break;case 4:this.combineCmykChannel()}return this.channelData=null},t}(s)},{"./image_export.coffee":8,"./image_format.coffee":9,"./image_mode.coffee":14,"coffeescript-module":82}],8:[function(e,t,r){t.exports={PNG:e("./image_exports/png.coffee")}},{"./image_exports/png.coffee":"./image_exports/png.coffee"}],9:[function(e,t,r){t.exports={RAW:e("./image_formats/raw.coffee"),RLE:e("./image_formats/rle.coffee"),LayerRLE:e("./image_formats/layer_rle.coffee"),LayerRAW:e("./image_formats/layer_raw.coffee")}},{"./image_formats/layer_raw.coffee":10,"./image_formats/layer_rle.coffee":11,"./image_formats/raw.coffee":12,"./image_formats/rle.coffee":13}],10:[function(e,t,r){t.exports={parseRaw:function(){var e,t,r,n;for(e=t=r=this.chanPos,n=this.chanPos+this.chan.length-2;r<=n?t<n:t>n;e=r<=n?++t:--t)this.channelData[e]=this.file.readByte();return this.chanPos+=this.chan.length-2}}},{}],11:[function(e,t,r){t.exports={parseByteCounts:function(){var e,t,r;for(r=[],e=0,t=this.height();0<=t?e<t:e>t;0<=t?++e:--e)r.push(this.file.readShort());return r},parseChannelData:function(){return this.lineIndex=0,this.decodeRLEChannel()}}},{}],12:[function(e,t,r){t.exports={parseRaw:function(){return this.channelData=this.file.read(this.length)}}},{}],13:[function(e,t,r){var n=[].slice;t.exports={parseRLE:function(){return this.byteCounts=this.parseByteCounts(),this.parseChannelData()},parseByteCounts:function(){var e,t,r;for(r=[],e=0,t=this.channels()*this.height();0<=t?e<t:e>t;0<=t?++e:--e)r.push(this.file.readShort());return r},parseChannelData:function(){var e,t,r;for(this.chanPos=0,this.lineIndex=0,r=[],e=0,t=this.channels();0<=t?e<t:e>t;0<=t?++e:--e)this.decodeRLEChannel(),r.push(this.lineIndex+=this.height());return r},decodeRLEChannel:function(){var e,t,r,i,o,s,a,c,f;for(c=[],i=o=0,a=this.height();0<=a?o<a:o>a;i=0<=a?++o:--o)e=this.byteCounts[this.lineIndex+i],t=this.file.tell()+e,c.push(function(){var e,i;for(i=[];this.file.tell()<t;)s=this.file.read(1)[0],s<128?(s+=1,(e=this.channelData).splice.apply(e,[this.chanPos,0].concat(n.call(this.file.read(s)))),i.push(this.chanPos+=s)):s>128?(s^=255,s+=2,f=this.file.read(1)[0],i.push(function(){var e,t,n;for(n=[],r=e=0,t=s;0<=t?e<t:e>t;r=0<=t?++e:--e)n.push(this.channelData[this.chanPos++]=f);return n}.call(this))):i.push(void 0);return i}.call(this));return c}}},{}],14:[function(e,t,r){t.exports={Greyscale:e("./image_modes/greyscale.coffee"),RGB:e("./image_modes/rgb.coffee"),CMYK:e("./image_modes/cmyk.coffee")}},{"./image_modes/cmyk.coffee":15,"./image_modes/greyscale.coffee":16,"./image_modes/rgb.coffee":17}],15:[function(e,t,r){var n;n=e("../color.coffee"),t.exports={setCmykChannels:function(){if(this.channelsInfo=[{id:0},{id:1},{id:2},{id:3}],5===this.channels())return this.channelsInfo.push({id:-1})},combineCmykChannel:function(){var e,t,r,i,o,s,a,c,f,u,h,l,p,d,y,g,b,v,_;for(o=this.channelsInfo.map(function(e){return e.id}).filter(function(e){return e>=-1}),b=[],a=f=0,y=this.numPixels;0<=y?f<y:f>y;a=0<=y?++f:--f){for(r=p=_=u=0,e=255,c=h=0,l=o.length;h<l;c=++h)switch(i=o[c],v=this.channelData[a+this.channelLength*c],i){case-1:e=v;break;case 0:r=v;break;case 1:p=v;break;case 2:_=v;break;case 3:u=v}g=n.cmykToRgb(255-r,255-p,255-_,255-u),d=g[0],s=g[1],t=g[2],b.push(this.pixelData.push(d,s,t,e))}return b}}},{"../color.coffee":3}],16:[function(e,t,r){t.exports={setGreyscaleChannels:function(){if(this.channelsInfo=[{id:0}],2===this.channels())return this.channelsInfo.push({id:-1})},combineGreyscaleChannel:function(){var e,t,r,n,i,o;for(o=[],r=n=0,i=this.numPixels;0<=i?n<i:n>i;r=0<=i?++n:--n)t=this.channelData[r],e=2===this.channels()?this.channelData[this.channelLength+r]:255,o.push(this.pixelData.push(t,t,t,e));return o}}},{}],17:[function(e,t,r){t.exports={setRgbChannels:function(){if(this.channelsInfo=[{id:0},{id:1},{id:2}],4===this.channels())return this.channelsInfo.push({id:-1})},combineRgbChannel:function(){var e,t,r,n,i,o,s,a,c,f,u,h,l,p;for(l=this.channelsInfo.map(function(e){return e.id}).filter(function(e){return e>=-1}),h=[],i=s=0,u=this.numPixels;0<=u?s<u:s>u;i=0<=u?++s:--s){for(f=n=t=0,e=255,o=a=0,c=l.length;a<c;o=++a)switch(r=l[o],p=this.channelData[i+this.channelLength*o],r){case-1:e=p;break;case 0:f=p;break;case 1:n=p;break;case 2:t=p}h.push(this.pixelData.push(f,n,t,e))}return h}}},{}],18:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("coffeescript-module").Module,t.exports=function(t){function r(e,t){this.file=e,this.header=t,this.mask={},this.blendingRanges={},this.adjustments={},this.channelsInfo=[],this.blendMode={},this.groupLayer=null,this.infoKeys=[],Object.defineProperty(this,"name",{get:function(){return null!=this.adjustments.name?this.adjustments.name.data:this.legacyName}})}return i(r,t),r.includes(e("./layer/position_channels.coffee")),r.includes(e("./layer/blend_modes.coffee")),r.includes(e("./layer/mask.coffee")),r.includes(e("./layer/blending_ranges.coffee")),r.includes(e("./layer/name.coffee")),r.includes(e("./layer/info.coffee")),r.includes(e("./layer/helpers.coffee")),r.includes(e("./layer/channel_image.coffee")),r.prototype.parse=function(){var e;return this.parsePositionAndChannels(),this.parseBlendModes(),e=this.file.readInt(),this.layerEnd=this.file.tell()+e,this.parseMaskData(),this.parseBlendingRanges(),this.parseLegacyLayerName(),this.parseLayerInfo(),this.file.seek(this.layerEnd),this},r.prototype.export=function(){return{name:this.name,top:this.top,right:this.right,bottom:this.bottom,left:this.left,width:this.width,height:this.height,opacity:this.opacity,visible:this.visible,clipped:this.clipped,mask:this.mask.export()}},r}(n)},{"./layer/blend_modes.coffee":19,"./layer/blending_ranges.coffee":20,"./layer/channel_image.coffee":21,"./layer/helpers.coffee":22,"./layer/info.coffee":23,"./layer/mask.coffee":24,"./layer/name.coffee":25,"./layer/position_channels.coffee":26,"coffeescript-module":82}],19:[function(e,t,r){var n;n=e("../blend_mode.coffee"),t.exports={parseBlendModes:function(){return this.blendMode=new n(this.file),this.blendMode.parse(),this.opacity=this.blendMode.opacity,this.visible=this.blendMode.visible,this.clipped=this.blendMode.clipped},hidden:function(){return!this.visible},blendingMode:function(){return this.blendMode.mode}}},{"../blend_mode.coffee":1}],20:[function(e,t,r){t.exports={parseBlendingRanges:function(){var e,t,r,n,i;for(t=this.file.readInt(),this.blendingRanges.grey={source:{black:[this.file.readByte(),this.file.readByte()],white:[this.file.readByte(),this.file.readByte()]},dest:{black:[this.file.readByte(),this.file.readByte()],white:[this.file.readByte(),this.file.readByte()]}},r=(t-8)/8,this.blendingRanges.channels=[],i=[],e=0,n=r;0<=n?e<n:e>n;0<=n?++e:--e)i.push(this.blendingRanges.channels.push({source:{black:[this.file.readByte(),this.file.readByte()],white:[this.file.readByte(),this.file.readByte()]},dest:{black:[this.file.readByte(),this.file.readByte()],white:[this.file.readByte(),this.file.readByte()]}}));return i}}},{}],21:[function(e,t,r){var n,i;n=e("../channel_image.coffee"),i=e("../lazy_execute.coffee"),t.exports={parseChannelImage:function(){var e;return e=new n(this.file,this.header,this),this.image=new i(e,this.file).now("skip").later("parse").get()}}},{"../channel_image.coffee":2,"../lazy_execute.coffee":49}],22:[function(e,t,r){t.exports={isFolder:function(){return null!=this.adjustments.sectionDivider?this.adjustments.sectionDivider.isFolder:null!=this.adjustments.nestedSectionDivider?this.adjustments.nestedSectionDivider.isFolder:"<Layer group>"===this.name},isFolderEnd:function(){return null!=this.adjustments.sectionDivider?this.adjustments.sectionDivider.isHidden:null!=this.adjustments.nestedSectionDivider?this.adjustments.nestedSectionDivider.isHidden:"</Layer group>"===this.name}}},{}],23:[function(e,t,r){var n,i,o,s={}.hasOwnProperty;i=e("../lazy_execute.coffee"),o=e("../util.coffee"),n={artboard:e("../layer_info/artboard.coffee"),blendClippingElements:e("../layer_info/blend_clipping_elements.coffee"),blendInteriorElements:e("../layer_info/blend_interior_elements.coffee"),fillOpacity:e("../layer_info/fill_opacity.coffee"),gradientFill:e("../layer_info/gradient_fill.coffee"),layerId:e("../layer_info/layer_id.coffee"),layerNameSource:e("../layer_info/layer_name_source.coffee"),legacyTypetool:e("../layer_info/legacy_typetool.coffee"),locked:e("../layer_info/locked.coffee"),metadata:e("../layer_info/metadata.coffee"),name:e("../layer_info/unicode_name.coffee"),nestedSectionDivider:e("../layer_info/nested_section_divider.coffee"),objectEffects:e("../layer_info/object_effects.coffee"),sectionDivider:e("../layer_info/section_divider.coffee"),solidColor:e("../layer_info/solid_color.coffee"),typeTool:e("../layer_info/typetool.coffee"),vectorMask:e("../layer_info/vector_mask.coffee"),vectorOrigination:e("../layer_info/vector_origination.coffee"),vectorStroke:e("../layer_info/vector_stroke.coffee"),vectorStrokeContent:e("../layer_info/vector_stroke_content.coffee")},t.exports={parseLayerInfo:function(){var e,t,r,a,c,f,u;for(u=[];this.file.tell()<this.layerEnd;){this.file.seek(4,!0),t=this.file.readString(4),c=o.pad2(this.file.readInt()),this.file.tell(),r=!1;for(f in n)if(s.call(n,f)&&(a=n[f],a.shouldParse(t))){e=new a(this,c),this.adjustments[f]=new i(e,this.file).now("skip").later("parse").get(),null==this[f]&&function(e){return function(t){return e[t]=function(){return e.adjustments[t]}}}(this)(f),this.infoKeys.push(t),r=!0;break}r?u.push(void 0):u.push(this.file.seek(c,!0))}return u}}},{"../layer_info/artboard.coffee":28,"../layer_info/blend_clipping_elements.coffee":29,"../layer_info/blend_interior_elements.coffee":30,"../layer_info/fill_opacity.coffee":31,"../layer_info/gradient_fill.coffee":32,"../layer_info/layer_id.coffee":33,"../layer_info/layer_name_source.coffee":34,"../layer_info/legacy_typetool.coffee":35,"../layer_info/locked.coffee":36,"../layer_info/metadata.coffee":37,"../layer_info/nested_section_divider.coffee":38,"../layer_info/object_effects.coffee":39,"../layer_info/section_divider.coffee":40,"../layer_info/solid_color.coffee":41,"../layer_info/typetool.coffee":42,"../layer_info/unicode_name.coffee":43,"../layer_info/vector_mask.coffee":44,"../layer_info/vector_origination.coffee":45,"../layer_info/vector_stroke.coffee":46,"../layer_info/vector_stroke_content.coffee":47,"../lazy_execute.coffee":49,"../util.coffee":63}],24:[function(e,t,r){var n;n=e("../mask.coffee"),t.exports={parseMaskData:function(){return this.mask=new n(this.file).parse()}}},{"../mask.coffee":50}],25:[function(e,t,r){var n;n=e("../util.coffee"),t.exports={parseLegacyLayerName:function(){var e;return e=n.pad4(this.file.readByte()),this.legacyName=this.file.readString(e)}}},{"../util.coffee":63}],26:[function(e,t,r){t.exports={parsePositionAndChannels:function(){var e,t,r,n,i;for(this.top=this.file.readInt(),this.left=this.file.readInt(),this.bottom=this.file.readInt(),this.right=this.file.readInt(),this.channels=this.file.readShort(),this.rows=this.height=this.bottom-this.top,this.cols=this.width=this.right-this.left,i=[],t=0,n=this.channels;0<=n?t<n:t>n;0<=n?++t:--t)e=this.file.readShort(),r=this.file.readInt(),i.push(this.channelsInfo.push({id:e,length:r}));return i}}},{}],27:[function(e,t,r){t.exports=function(){function e(e,t){this.layer=e,this.length=t,this.file=this.layer.file,this.section_end=this.file.tell()+this.length,this.data={}}return e.prototype.skip=function(){return this.file.seek(this.section_end)},e.prototype.parse=function(){return this.skip()},e}()},{}],28:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("../layer_info.coffee"),n=e("../descriptor.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.shouldParse=function(e){return"artb"===e},t.prototype.parse=function(){return this.file.seek(4,!0),this.data=new n(this.file).parse()},t.prototype.export=function(){return{coords:{left:this.data.artboardRect.Left,top:this.data.artboardRect["Top "],right:this.data.artboardRect.Rght,bottom:this.data.artboardRect.Btom}}},t}(i)},{"../descriptor.coffee":4,"../layer_info.coffee":27}],29:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("../layer_info.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.shouldParse=function(e){return"clbl"===e},t.prototype.parse=function(){return this.enabled=this.file.readBoolean(),this.file.seek(3,!0)},t}(n)},{"../layer_info.coffee":27}],30:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("../layer_info.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.shouldParse=function(e){return"infx"===e},t.prototype.parse=function(){return this.enabled=this.file.readBoolean(),this.file.seek(3,!0)},t}(n)},{"../layer_info.coffee":27}],31:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("../layer_info.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.shouldParse=function(e){return"iOpa"===e},t.prototype.parse=function(){return this.value=this.file.readByte()},t}(n)},{"../layer_info.coffee":27}],32:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("../layer_info.coffee"),n=e("../descriptor.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.shouldParse=function(e){return"GdFl"===e},t.prototype.parse=function(){return this.file.seek(4,!0),this.data=new n(this.file).parse()},t}(i)},{"../descriptor.coffee":4,"../layer_info.coffee":27}],33:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("../layer_info.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.shouldParse=function(e){return"lyid"===e},t.prototype.parse=function(){return this.id=this.file.readInt()},t}(n)},{"../layer_info.coffee":27}],34:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("../layer_info.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.shouldParse=function(e){return"lnsr"===e},t.prototype.parse=function(){return this.id=this.file.readString(4)},t}(n)},{"../layer_info.coffee":27}],35:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("lodash"),n=e("./typetool.coffee"),t.exports=function(e){function t(e,r){t.__super__.constructor.call(this,e,r),this.transform={},this.faces=[],this.styles=[],this.lines=[],this.type=0,this.scalingFactor=0,this.characterCount=0,this.horzPlace=0,this.vertPlace=0,this.selectStart=0,this.selectEnd=0,this.color=null,this.antialias=null}return o(t,e),t.shouldParse=function(e){return"tySh"===e},t.prototype.parse=function(){var e,t,r,n,o,s,a,c,f;for(this.file.seek(2,!0),this.parseTransformInfo(),this.file.seek(2,!0),e=this.file.readShort(),t=0,s=e;0<=s?t<s:t>s;0<=s?++t:--t)this.faces.push(i({}).tap(function(e){return function(t){var r,n,i;for(t.mark=e.file.readShort(),t.fontType=e.file.readInt(),t.fontName=e.file.readString(),t.fontFamilyName=e.file.readString(),t.fontStyleName=e.file.readString(),t.script=e.file.readShort(),t.numberAxesVector=e.file.readInt(),t.vector=[],i=[],r=0,n=t.numberAxesVector;0<=n?r<n:r>n;0<=n?++r:--r)i.push(t.vector.push(e.file.readInt()));return i}}(this)));for(f=this.file.readShort(),r=0,a=f;0<=a?r<a:r>a;0<=a?++r:--r)this.styles.push(i({}).tap(function(e){return function(t){return t.mark=e.file.readShort(),t.faceMark=e.file.readShort(),t.size=e.file.readInt(),t.tracking=e.file.readInt(),t.kerning=e.file.readInt(),t.leading=e.file.readInt(),t.baseShift=e.file.readInt(),t.autoKern=e.file.readBoolean(),e.file.seek(1,!0),t.rotate=e.file.readBoolean()}}(this)));for(this.type=this.file.readShort(),this.scalingFactor=this.file.readInt(),this.characterCount=this.file.readInt(),this.horzPlace=this.file.readInt(),this.vertPlace=this.file.readInt(),this.selectStart=this.file.readInt(),this.selectEnd=this.file.readInt(),n=this.file.readShort(),o=0,c=n;0<=c?o<c:o>c;0<=c?++o:--o)this.lines.push(i({}).tap(function(e){return e.charCount=this.file.readInt(),e.orientation=this.file.readShort(),
e.alignment=this.file.readShort(),e.actualChar=this.file.readShort(),e.style=this.file.readShort()}));return this.color=this.file.readSpaceColor(),this.antialias=this.file.readBoolean()},t}(n)},{"./typetool.coffee":42,lodash:109}],36:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("../layer_info.coffee"),t.exports=function(e){function t(e,r){t.__super__.constructor.call(this,e,r),this.transparencyLocked=!1,this.compositeLocked=!1,this.positionLocked=!1,this.allLocked=!1}return i(t,e),t.shouldParse=function(e){return"lspf"===e},t.prototype.parse=function(){var e;return e=this.file.readInt(),this.transparencyLocked=(1&e)>0||-2147483648===e,this.compositeLocked=(2&e)>0||-2147483648===e,this.positionLocked=(4&e)>0||-2147483648===e,this.allLocked=this.transparencyLocked&&this.compositeLocked&&this.positionLocked},t}(n)},{"../layer_info.coffee":27}],37:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("../layer_info.coffee"),n=e("../descriptor.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.shouldParse=function(e){return"shmd"===e},t.prototype.parse=function(){var e,t,r,n,i,o,s;for(e=this.file.readInt(),s=[],r=0,o=e;0<=o?r<o:r>o;0<=o?++r:--r)this.file.seek(4,!0),n=this.file.readString(4),this.file.readByte(),this.file.seek(3,!0),i=this.file.readInt(),t=this.file.tell()+i,"cmls"===n&&this.parseLayerComps(),s.push(this.file.seek(t));return s},t.prototype.parseLayerComps=function(){return this.file.seek(4,!0),this.data.layerComp=new n(this.file).parse()},t}(i)},{"../descriptor.coffee":4,"../layer_info.coffee":27}],38:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("../layer_info.coffee"),t.exports=function(e){function t(e,r){t.__super__.constructor.call(this,e,r),this.isFolder=!1,this.isHidden=!1}return i(t,e),t.shouldParse=function(e){return"lsdk"===e},t.prototype.parse=function(){switch(this.file.readInt()){case 1:case 2:return this.isFolder=!0;case 3:return this.isHidden=!0}},t}(n)},{"../layer_info.coffee":27}],39:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("../layer_info.coffee"),n=e("../descriptor.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.shouldParse=function(e){return"lfx2"===e},t.prototype.parse=function(){return this.file.seek(8,!0),this.data=new n(this.file).parse()},t}(i)},{"../descriptor.coffee":4,"../layer_info.coffee":27}],40:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("../layer_info.coffee"),t.exports=function(e){function t(e,r){t.__super__.constructor.call(this,e,r),this.isFolder=!1,this.isHidden=!1,this.layerType=null,this.blendMode=null,this.subType=null}var r;return i(t,e),t.shouldParse=function(e){return"lsct"===e},r=["other","open folder","closed folder","bounding section divider"],t.prototype.parse=function(){var e;switch(e=this.file.readInt(),this.layerType=r[e],e){case 1:case 2:this.isFolder=!0;break;case 3:this.isHidden=!0}if(this.length>=12&&(this.file.seek(4,!0),this.blendMode=this.file.readString(4),this.length>=16))return this.subType=0===this.file.readInt()?"normal":"scene group"},t}(n)},{"../layer_info.coffee":27}],41:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("../layer_info.coffee"),n=e("../descriptor.coffee"),t.exports=function(e){function t(e,r){t.__super__.constructor.call(this,e,r),this.r=this.g=this.b=0}return o(t,e),t.shouldParse=function(e){return"SoCo"===e},t.prototype.parse=function(){return this.file.seek(4,!0),this.data=new n(this.file).parse(),this.r=Math.round(this.colorData()["Rd  "]),this.g=Math.round(this.colorData()["Grn "]),this.b=Math.round(this.colorData()["Bl  "])},t.prototype.colorData=function(){return this.data["Clr "]},t.prototype.color=function(){return[this.r,this.g,this.b]},t}(i)},{"../descriptor.coffee":4,"../layer_info.coffee":27}],42:[function(e,t,r){var n,i,o,s,a=function(e,t){function r(){this.constructor=e}for(var n in t)c.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},c={}.hasOwnProperty;o=e("lodash"),s=e("parse-engine-data"),i=e("../layer_info.coffee"),n=e("../descriptor.coffee"),t.exports=function(e){function t(e,r){t.__super__.constructor.call(this,e,r),this.version=null,this.transform={},this.textVersion=null,this.descriptorVersion=null,this.textData=null,this.engineData=null,this.textValue=null,this.warpVersion=null,this.descriptorVersion=null,this.warpData=null,this.coords={}}var r,i;return a(t,e),t.shouldParse=function(e){return"TySh"===e},i=["xx","xy","yx","yy","tx","ty"],r=["left","top","right","bottom"],t.prototype.parse=function(){var e,t,i,o,a;for(this.version=this.file.readShort(),this.parseTransformInfo(),this.textVersion=this.file.readShort(),this.descriptorVersion=this.file.readInt(),this.textData=new n(this.file).parse(),this.textValue=this.textData["Txt "],this.engineData=s(this.textData.EngineData),this.warpVersion=this.file.readShort(),this.descriptorVersion=this.file.readInt(),this.warpData=new n(this.file).parse(),a=[],t=e=0,i=r.length;e<i;t=++e)o=r[t],a.push(this.coords[o]=this.file.readInt());return a},t.prototype.parseTransformInfo=function(){var e,t,r,n,o;for(o=[],t=e=0,r=i.length;e<r;t=++e)n=i[t],o.push(this.transform[n]=this.file.readDouble());return o},t.prototype.fonts=function(){return null==this.engineData?[]:this.engineData.ResourceDict.FontSet.map(function(e){return e.Name})},t.prototype.sizes=function(){return null==this.engineData&&null==this.styles().FontSize?[]:this.styles().FontSize},t.prototype.alignment=function(){var e;return null==this.engineData?[]:(e=["left","right","center","justify"],this.engineData.EngineDict.ParagraphRun.RunArray.map(function(t){return e[Math.min(parseInt(t.ParagraphSheet.Properties.Justification,10),3)]}))},t.prototype.colors=function(){return null==this.engineData||null==this.styles().FillColor?[[0,0,0,255]]:this.styles().FillColor.map(function(e){var t;return t=e.Values.map(function(e){return Math.round(255*e)}),t.push(t.shift()),t})},t.prototype.styles=function(){var e;return null==this.engineData?{}:null!=this._styles?this._styles:(e=this.engineData.EngineDict.StyleRun.RunArray.map(function(e){return e.StyleSheet.StyleSheetData}),this._styles=o.reduce(e,function(e,t){var r,n;for(r in t)c.call(t,r)&&(n=t[r],e[r]||(e[r]=[]),e[r].push(n));return e},{}))},t.prototype.toCSS=function(){var e,t,r,n;t={"font-family":this.fonts().join(", "),"font-size":this.sizes()[0]+"pt",color:"rgba("+this.colors()[0].join(", ")+")","text-align":this.alignment()[0]},e=[];for(r in t)null!=(n=t[r])&&e.push(r+": "+n+";");return e.join("\n")},t.prototype.export=function(){return{value:this.textValue,font:{name:this.fonts()[0],sizes:this.sizes(),colors:this.colors(),alignment:this.alignment()},left:this.coords.left,top:this.coords.top,right:this.coords.right,bottom:this.coords.bottom,transform:this.transform}},t}(i)},{"../descriptor.coffee":4,"../layer_info.coffee":27,lodash:109,"parse-engine-data":110}],43:[function(e,t,r){var n,i=function(e,t){function r(){this.constructor=e}for(var n in t)o.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},o={}.hasOwnProperty;n=e("../layer_info.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.shouldParse=function(e){return"luni"===e},t.prototype.parse=function(){var e;return e=this.file.tell(),this.data=this.file.readUnicodeString(),this.file.seek(e+this.length),this},t}(n)},{"../layer_info.coffee":27}],44:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;n=e("../layer_info.coffee"),i=e("../path_record.coffee"),t.exports=function(e){function t(e,r){t.__super__.constructor.call(this,e,r),this.invert=null,this.notLink=null,this.disable=null,this.paths=[]}return o(t,e),t.shouldParse=function(e){return"vmsk"===e||"vsms"===e},t.prototype.parse=function(){var e,t,r,n,o,s;for(this.file.seek(4,!0),s=this.file.readInt(),this.invert=(1&s)>0,this.notLink=(2&s)>0,this.disable=(4&s)>0,t=(this.length-10)/26,o=[],e=0,n=t;0<=n?e<n:e>n;0<=n?++e:--e)r=new i(this.file),r.parse(),o.push(this.paths.push(r));return o},t.prototype.export=function(){return{invert:this.invert,notLink:this.notLink,disable:this.disable,paths:this.paths.map(function(e){return e.export()})}},t}(n)},{"../layer_info.coffee":27,"../path_record.coffee":58}],45:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("../layer_info.coffee"),n=e("../descriptor.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.shouldParse=function(e){return"vogk"===e},t.prototype.parse=function(){return this.file.seek(8,!0),this.data=new n(this.file).parse()},t}(i)},{"../descriptor.coffee":4,"../layer_info.coffee":27}],46:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("../layer_info.coffee"),n=e("../descriptor.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.shouldParse=function(e){return"vstk"===e},t.prototype.parse=function(){return this.file.seek(4,!0),this.data=new n(this.file).parse()},t}(i)},{"../descriptor.coffee":4,"../layer_info.coffee":27}],47:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("../layer_info.coffee"),n=e("../descriptor.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.shouldParse=function(e){return"vscg"===e},t.prototype.parse=function(){return this.file.seek(8,!0),this.data=new n(this.file).parse()},t}(i)},{"../descriptor.coffee":4,"../layer_info.coffee":27}],48:[function(e,t,r){var n,i,o;o=e("lodash"),i=e("./util.coffee"),n=e("./layer.coffee"),t.exports=function(){function e(e,t){this.file=e,this.header=t,this.layers=[],this.mergedAlpha=!1,this.globalMask=null}return e.prototype.skip=function(){return this.file.seek(this.file.readInt(),!0)},e.prototype.parse=function(){var e,t;if(t=this.file.readInt(),e=t+this.file.tell(),!(t<=0))return this.parseLayers(),this.parseGlobalMask(),this.layers.reverse(),this.file.seek(e)},e.prototype.parseLayers=function(){var e,t,r,o,s,a,c,f;if(i.pad2(this.file.readInt())>0){for(o=this.file.readShort(),o<0&&(o=Math.abs(o),this.mergedAlpha=!0),e=0,a=o;0<=a?e<a:e>a;0<=a?++e:--e)this.layers.push(new n(this.file,this.header).parse());for(c=this.layers,f=[],t=0,s=c.length;t<s;t++)r=c[t],f.push(r.parseChannelImage());return f}},e.prototype.parseGlobalMask=function(){var e,t;if(!((e=this.file.readInt())<=0))return t=this.file.tell()+e,this.globalMask=o({}).tap(function(e){return function(t){return t.overlayColorSpace=e.file.readShort(),t.colorComponents=[e.file.readShort()>>8,e.file.readShort()>>8,e.file.readShort()>>8,e.file.readShort()>>8],t.opacity=e.file.readShort()/16,t.kind=e.file.readByte()}}(this)),this.file.seek(t)},e}()},{"./layer.coffee":18,"./util.coffee":63,lodash:109}],49:[function(e,t,r){var n=[].slice,i=[].indexOf||function(e){for(var t=0,r=this.length;t<r;t++)if(t in this&&this[t]===e)return t;return-1};t.exports=function(){function e(e,t){this.obj=e,this.file=t,this.startPos=this.file.tell(),this.loaded=!1,this.loadMethod=null,this.loadArgs=[],this.passthru=[]}return e.prototype.now=function(){var e,t;return t=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],this.obj[t].apply(this.obj,e),this},e.prototype.later=function(){var e,t;return t=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],this.loadMethod=t,this.loadArgs=e,this},e.prototype.ignore=function(){var e;return e=1<=arguments.length?n.call(arguments,0):[],this.passthru.concat(e),this},e.prototype.get=function(){var e,t,r,n;r=this.obj,e=function(e){return function(t,r){if(null==e[t])return Object.defineProperty(e,t,{get:function(){return this.loaded||i.call(this.passthru,t)>=0||this.load(),this.obj[t]}})}}(this);for(t in r)n=r[t],e(t,n);return this},e.prototype.load=function(){var e;return e=this.file.tell(),this.file.seek(this.startPos),this.obj[this.loadMethod].apply(this.obj,this.loadArgs),this.file.seek(e),this.loaded=!0},e}()},{}],50:[function(e,t,r){t.exports=function(){function e(e){this.file=e,this.top=0,this.right=0,this.bottom=0,this.left=0}return e.prototype.parse=function(){var e;return this.size=this.file.readInt(),0===this.size?this:(e=this.file.tell()+this.size,this.top=this.file.readInt(),this.left=this.file.readInt(),this.bottom=this.file.readInt(),this.right=this.file.readInt(),this.width=this.right-this.left,this.height=this.bottom-this.top,this.relative=(1&this.flags)>0,this.disabled=(2&this.flags)>0,this.invert=(4&this.flags)>0,this.defaultColor=this.file.readByte(),this.flags=this.file.readByte(),this.file.seek(e),this)},e.prototype.export=function(){return 0===this.size?{}:{top:this.top,left:this.left,bottom:this.bottom,right:this.right,width:this.width,height:this.height,defaultColor:this.defaultColor,relative:this.relative,disabled:this.disabled,invert:this.invert}},e}()},{}],51:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("lodash"),n=e("coffeescript-module").Module,t.exports=function(t){function r(e,t){this.layer=e,this.parent=null!=t?t:null,this.layer.node=this,this._children=[],this.name=this.layer.name,this.forceVisible=null,this.coords={top:this.layer.top,bottom:this.layer.bottom,left:this.layer.left,right:this.layer.right},this.topOffset=0,this.leftOffset=0,this.createProperties()}return o(r,t),r.includes(e("./nodes/ancestry.coffee")),r.includes(e("./nodes/search.coffee")),r.includes(e("./nodes/build_preview.coffee")),r.PROPERTIES=["name","left","right","top","bottom","height","width"],r.prototype.type="node",r.prototype.createProperties=function(){return Object.defineProperty(this,"top",{get:function(){return this.coords.top+this.topOffset},set:function(e){return this.coords.top=e}}),Object.defineProperty(this,"right",{get:function(){return this.coords.right+this.leftOffset},set:function(e){return this.coords.right=e}}),Object.defineProperty(this,"bottom",{get:function(){return this.coords.bottom+this.topOffset},set:function(e){return this.coords.bottom=e}}),Object.defineProperty(this,"left",{get:function(){return this.coords.left+this.leftOffset},set:function(e){return this.coords.left=e}}),Object.defineProperty(this,"width",{get:function(){return this.right-this.left}}),Object.defineProperty(this,"height",{get:function(){return this.bottom-this.top}})},r.prototype.get=function(e){var t;return t=null!=this[e]?this[e]:this.layer[e],"function"==typeof t?t():t},r.prototype.visible=function(){return!(this.layer.clipped&&!this.clippingMask().visible())&&(null!=this.forceVisible?this.forceVisible:this.layer.visible)},r.prototype.hidden=function(){return!this.visible()},r.prototype.isLayer=function(){return"layer"===this.type},r.prototype.isGroup=function(){return"group"===this.type},r.prototype.isRoot=function(){return"root"===this.type},r.prototype.clippingMask=function(){var e;return this.layer.clipped?this.clippingMaskCached||(this.clippingMaskCached=function(){for(e=this.nextSibling();e.clipped;)e=e.nextSibling();return e}.call(this)):null},r.prototype.clippedBy=function(){return this.clippingMask()},r.prototype.export=function(){var e,t,n,i,o;for(e={type:null,visible:this.visible(),opacity:this.layer.opacity/255,blendingMode:this.layer.blendingMode()},o=r.PROPERTIES,t=0,n=o.length;t<n;t++)i=o[t],e[i]=this[i];return e},r.prototype.updateDimensions=function(){var e,t,r,n,o;if(!this.isLayer()){for(o=this._children,t=0,r=o.length;t<r;t++)e=o[t],e.updateDimensions();if(!this.isRoot())return n=this._children.filter(function(e){return!e.isEmpty()}),this.left=i.min(n.map(function(e){return e.left}))||0,this.top=i.min(n.map(function(e){return e.top}))||0,this.bottom=i.max(n.map(function(e){return e.bottom}))||0,this.right=i.max(n.map(function(e){return e.right}))||0}},r}(n)},{"./nodes/ancestry.coffee":52,"./nodes/build_preview.coffee":53,"./nodes/search.coffee":57,"coffeescript-module":82,lodash:109}],52:[function(e,t,r){var n;n=e("lodash"),t.exports={root:function(){return this.isRoot()?this:this.parent.root()},isRoot:function(){return 0===this.depth()},children:function(){return this._children},ancestors:function(){return null==this.parent||this.parent.isRoot()?[]:this.parent.ancestors().concat([this.parent])},hasChildren:function(){return this._children.length>0},childless:function(){return!this.hasChildren()},siblings:function(){return null==this.parent?[]:this.parent.children()},nextSibling:function(){var e;return null==this.parent?null:(e=this.siblings().indexOf(this),this.siblings()[e+1])},prevSibling:function(){var e;return null==this.parent?null:(e=this.siblings().indexOf(this),this.siblings()[e-1])},hasSiblings:function(){return this.siblings().length>1},onlyChild:function(){return!this.hasSiblings()},descendants:function(){return n.flatten(this._children.map(function(e){return e.subtree()}))},subtree:function(){return[this].concat(this.descendants())},depth:function(){return this.ancestors().length+1},path:function(e){var t;return null==e&&(e=!1),t=this.ancestors().map(function(e){return e.name}).concat([this.name]),e?t:t.join("/")}}},{lodash:109}],53:[function(e,t,r){t.exports={toPng:function(){return this.layer.image.toPng()},saveAsPng:function(e){return this.layer.image.saveAsPng(e)}}},{}],54:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("lodash"),n=e("../node.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.type="group",t.prototype.passthruBlending=function(){return"passthru"===this.get("blendingMode")},t.prototype.isEmpty=function(){var e;if(!function(){var t,r,n,i;for(n=this._children,i=[],t=0,r=n.length;t<r;t++)e=n[t],i.push(e.isEmpty());return i}.call(this))return!1},t.prototype.export=function(){return i.merge(t.__super__.export.call(this),{type:"group",children:this._children.map(function(e){return e.export()})})},t}(n)},{"../node.coffee":51,lodash:109}],55:[function(e,t,r){var n,i,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},s={}.hasOwnProperty;i=e("lodash"),n=e("../node.coffee"),t.exports=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.type="layer",t.prototype.isEmpty=function(){return 0===this.width||0===this.height},t.prototype.export=function(){var e;return i.merge(t.__super__.export.call(this),{type:"layer",mask:this.layer.mask.export(),text:null!=(e=this.get("typeTool"))?e.export():void 0,image:{}})},t}(n)},{"../node.coffee":51,lodash:109}],56:[function(e,t,r){var n,i,o,s,a=function(e,t){function r(){this.constructor=e}for(var n in t)c.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},c={}.hasOwnProperty;s=e("lodash"),o=e("../node.coffee"),n=e("./group.coffee"),i=e("./layer.coffee"),t.exports=function(e){function t(e){this.psd=e,t.__super__.constructor.call(this,t.layerForPsd(this.psd)),this.buildHeirarchy()}return a(t,e),t.layerForPsd=function(e){var t,r,n,i,s;for(r={},s=o.PROPERTIES,t=0,n=s.length;t<n;t++)i=s[t],r[i]=null;return r.top=0,r.left=0,r.right=e.header.width,r.bottom=e.header.height,r},t.prototype.type="root",t.prototype.documentDimensions=function(){return[this.width,this.height]},t.prototype.depth=function(){return 0},t.prototype.opacity=function(){return 255},t.prototype.fillOpacity=function(){return 255},t.prototype.export=function(){var e;return{children:this._children.map(function(e){return e.export()}),document:{width:this.width,height:this.height,resources:{layerComps:(null!=(e=this.psd.resources.resource("layerComps"))?e.export():void 0)||[],guides:[],slices:[]}}}},t.prototype.buildHeirarchy=function(){var e,t,r,o,a,c,f;for(e=this,c=[],f=this.psd.layers,t=0,o=f.length;t<o;t++)r=f[t],r.isFolder()?(c.push(e),e=new n(r,s.last(c))):r.isFolderEnd()?(a=c.pop(),a.children().push(e),e=a):e.children().push(new i(r,e));return this.updateDimensions()},t}(o)},{"../node.coffee":51,"./group.coffee":54,"./layer.coffee":55,lodash:109}],57:[function(e,t,r){var n;n=e("lodash"),t.exports={childrenAtPath:function(e,t){var r,i;return null==t&&(t={}),Array.isArray(e)||(e=e.split("/").filter(function(e){return e.length>0})),e=n.clone(e),i=e.shift(),r=this.children().filter(function(e){return t.caseSensitive?e.name===i:e.name.toLowerCase()===i.toLowerCase()}),0===e.length?r:n.flatten(r.map(function(r){return r.childrenAtPath(n.clone(e),t)}))}}},{lodash:109}],58:[function(e,t,r){var n;n=e("lodash"),t.exports=function(){function e(e){this.file=e,this.recordType=null}return e.prototype.parse=function(){switch(this.recordType=this.file.readShort(),this.recordType){case 0:case 3:return this._readPathRecord();case 1:case 2:case 4:case 5:return this._readBezierPoint();case 7:return this._readClipboardRecord();case 8:return this._readInitialFill();default:return this.file.seek(24,!0)}},e.prototype.export=function(){return n.merge({recordType:this.recordType},function(){var e;switch(this.recordType){case 0:case 3:return{numPoints:this.numPoints};case 1:case 2:case 4:case 5:return{linked:this.linked,closed:1===(e=this.recordType)||2===e,preceding:{vert:this.precedingVert,horiz:this.precedingHoriz},anchor:{vert:this.anchorVert,horiz:this.anchorHoriz},leaving:{vert:this.leavingVert,horiz:this.leavingHoriz}};case 7:return{clipboard:{top:this.clipboardTop,left:this.clipboardLeft,bottom:this.clipboardBottom,right:this.clipboardRight,resolution:this.clipboardResolution}};case 8:return{initialFill:this.initialFill};default:return{}}}.call(this))},e.prototype.isBezierPoint=function(){var e;return 1===(e=this.recordType)||2===e||4===e||5===e},e.prototype._readPathRecord=function(){return this.numPoints=this.file.readShort(),this.file.seek(22,!0)},e.prototype._readBezierPoint=function(){var e;return this.linked=1===(e=this.recordType)||4===e,this.precedingVert=this.file.readPathNumber(),this.precedingHoriz=this.file.readPathNumber(),this.anchorVert=this.file.readPathNumber(),this.anchorHoriz=this.file.readPathNumber(),this.leavingVert=this.file.readPathNumber(),this.leavingHoriz=this.file.readPathNumber()},e.prototype._readClipboardRecord=function(){return this.clipboardTop=this.file.readPathNumber(),this.clipboardLeft=this.file.readPathNumber(),this.clipboardBottom=this.file.readPathNumber(),this.clipboardRight=this.file.readPathNumber(),this.clipboardResolution=this.file.readPathNumber(),this.file.seek(4,!0)},e.prototype._readInitialFill=function(){return this.initialFill=this.file.readShort(),this.file.seek(22,!0)},e}()},{lodash:109}],59:[function(e,t,r){var n;n=e("./util.coffee"),t.exports=function(){function t(e){this.file=e,this.id=null,this.type=null,this.length=0}return t.Section=e("./resource_section.coffee"),t.prototype.parse=function(){var e;return this.type=this.file.readString(4),this.id=this.file.readShort(),e=n.pad2(this.file.readByte()+1)-1,this.name=this.file.readString(e),this.length=n.pad2(this.file.readInt())},t}()},{"./resource_section.coffee":60,"./util.coffee":63}],60:[function(e,t,r){var n;n=e("lodash"),t.exports=function(){function t(){}var r;return r=[e("./resources/layer_comps.coffee")],t.factory=function(e){var t,i,o;for(i=0,o=r.length;i<o;i++)if(t=r[i],t.prototype.id===e.id)return n.tap(new t(e),function(e){return e.parse()});return null},t}()},{"./resources/layer_comps.coffee":62,lodash:109}],61:[function(e,t,r){var n;n=e("./resource.coffee"),t.exports=function(){function e(e){this.file=e,this.resources={},this.typeIndex={},this.length=null}return e.prototype.skip=function(){return this.length=this.file.readInt(),this.file.seek(this.length,!0)},e.prototype.parse=function(){var e,t,r,i;for(this.length=this.file.readInt(),e=this.length+this.file.tell();this.file.tell()<e;)t=new n(this.file),t.parse(),r=this.file.tell()+t.length,i=n.Section.factory(t),null!=i?(this.resources[i.id]=i,null!=i.name&&(this.typeIndex[i.name]=i.id),this.file.seek(r)):this.file.seek(r);return this.file.seek(e)},e.prototype.resource=function(e){return"string"==typeof e?this.byType(e):this.resources[e]},e.prototype.byType=function(e){return this.resources[this.typeIndex[e]]},e}()},{"./resource.coffee":59}],62:[function(e,t,r){var n;n=e("../descriptor.coffee"),t.exports=function(){function e(e){this.resource=e,this.file=this.resource.file}return e.prototype.id=1065,e.prototype.name="layerComps",e.visibilityCaptured=function(e){return e.capturedInfo&parseInt("001",2)>0},e.positionCaptured=function(e){return e.positionCaptured&parseInt("010",2)>0},e.appearanceCaptured=function(e){return e.appearanceCaptured&parseInt("100",2)>0},e.prototype.parse=function(){return this.file.seek(4,!0),this.data=new n(this.file).parse()},e.prototype.names=function(){return this.data.list.map(function(e){return e["Nm  "]})},e.prototype.export=function(){return this.data.list.map(function(e){return{id:e.compID,name:e["Nm  "],capturedInfo:e.capturedInfo}})},e}()},{"../descriptor.coffee":4}],63:[function(e,t,r){t.exports={pad2:function(e){return e+1&-2},pad4:function(e){return(e+4&-4)-1},getUnicodeCharacter:function(e){var t,r;return e>=0&&e<=55295||e>=57344&&e<=65535?String.fromCharCode(e):e>=65536&&e<=1114111?(e-=65536,t=55296+((1047552&e)>>10),r=56320+(1023&e),String.fromCharCode(t)+String.fromCharCode(r)):void 0},clamp:function(e,t,r){return Math.min(Math.max(e,t),r)}}},{}],64:[function(e,t,r){},{}],65:[function(e,t,r){!function(e){"use strict";function t(e){var t=e.charCodeAt(0);return t===o||t===u?62:t===s||t===h?63:t<a?-1:t<a+10?t-a+26+26:t<f+26?t-f:t<c+26?t-c+26:void 0}function r(e){function r(e){f[h++]=e}var n,o,s,a,c,f;if(e.length%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var u=e.length;c="="===e.charAt(u-2)?2:"="===e.charAt(u-1)?1:0,f=new i(3*e.length/4-c),s=c>0?e.length-4:e.length;var h=0;for(n=0,o=0;n<s;n+=4,o+=3)a=t(e.charAt(n))<<18|t(e.charAt(n+1))<<12|t(e.charAt(n+2))<<6|t(e.charAt(n+3)),r((16711680&a)>>16),r((65280&a)>>8),r(255&a);return 2===c?(a=t(e.charAt(n))<<2|t(e.charAt(n+1))>>4,r(255&a)):1===c&&(a=t(e.charAt(n))<<10|t(e.charAt(n+1))<<4|t(e.charAt(n+2))>>2,r(a>>8&255),r(255&a)),f}function n(e){function t(e){return"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e)}var r,n,i,o=e.length%3,s="";for(r=0,i=e.length-o;r<i;r+=3)n=(e[r]<<16)+(e[r+1]<<8)+e[r+2],s+=function(e){return t(e>>18&63)+t(e>>12&63)+t(e>>6&63)+t(63&e)}(n);switch(o){case 1:n=e[e.length-1],s+=t(n>>2),s+=t(n<<4&63),s+="==";break;case 2:n=(e[e.length-2]<<8)+e[e.length-1],s+=t(n>>10),s+=t(n>>4&63),s+=t(n<<2&63),s+="="}return s}var i="undefined"!=typeof Uint8Array?Uint8Array:Array,o="+".charCodeAt(0),s="/".charCodeAt(0),a="0".charCodeAt(0),c="a".charCodeAt(0),f="A".charCodeAt(0),u="-".charCodeAt(0),h="_".charCodeAt(0);e.toByteArray=r,e.fromByteArray=n}(void 0===r?this.base64js={}:r)},{}],66:[function(e,t,r){(function(t){"use strict";function n(){return i.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function i(e){return this instanceof i?(i.TYPED_ARRAY_SUPPORT||(this.length=0,this.parent=void 0),"number"==typeof e?o(this,e):"string"==typeof e?s(this,e,arguments.length>1?arguments[1]:"utf8"):a(this,e)):arguments.length>1?new i(e,arguments[1]):new i(e)}function o(e,t){if(e=d(e,t<0?0:0|y(t)),!i.TYPED_ARRAY_SUPPORT)for(var r=0;r<t;r++)e[r]=0;return e}function s(e,t,r){return"string"==typeof r&&""!==r||(r="utf8"),e=d(e,0|b(t,r)),e.write(t,r),e}function a(e,t){if(i.isBuffer(t))return c(e,t);if(K(t))return f(e,t);if(null==t)throw new TypeError("must start with number, buffer, array or string");if("undefined"!=typeof ArrayBuffer){if(t.buffer instanceof ArrayBuffer)return u(e,t);if(t instanceof ArrayBuffer)return h(e,t)}return t.length?l(e,t):p(e,t)}function c(e,t){var r=0|y(t.length);return e=d(e,r),t.copy(e,0,0,r),e}function f(e,t){var r=0|y(t.length);e=d(e,r);for(var n=0;n<r;n+=1)e[n]=255&t[n];return e}function u(e,t){var r=0|y(t.length);e=d(e,r);for(var n=0;n<r;n+=1)e[n]=255&t[n];return e}function h(e,t){return i.TYPED_ARRAY_SUPPORT?(t.byteLength,e=i._augment(new Uint8Array(t))):e=u(e,new Uint8Array(t)),e}function l(e,t){var r=0|y(t.length);e=d(e,r);for(var n=0;n<r;n+=1)e[n]=255&t[n];return e}function p(e,t){var r,n=0;"Buffer"===t.type&&K(t.data)&&(r=t.data,n=0|y(r.length)),e=d(e,n);for(var i=0;i<n;i+=1)e[i]=255&r[i];return e}function d(e,t){return i.TYPED_ARRAY_SUPPORT?(e=i._augment(new Uint8Array(t)),e.__proto__=i.prototype):(e.length=t,e._isBuffer=!0),0!==t&&t<=i.poolSize>>>1&&(e.parent=Z),e}function y(e){if(e>=n())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+n().toString(16)+" bytes");return 0|e}function g(e,t){if(!(this instanceof g))return new g(e,t);var r=new i(e,t);return delete r.parent,r}function b(e,t){"string"!=typeof e&&(e=""+e);var r=e.length;if(0===r)return 0;for(var n=!1;;)switch(t){case"ascii":case"binary":case"raw":case"raws":return r;case"utf8":case"utf-8":return z(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return V(e).length;default:if(n)return z(e).length;t=(""+t).toLowerCase(),n=!0}}function v(e,t,r){var n=!1;if(t|=0,r=void 0===r||r===1/0?this.length:0|r,e||(e="utf8"),t<0&&(t=0),r>this.length&&(r=this.length),r<=t)return"";for(;;)switch(e){case"hex":return L(this,t,r);case"utf8":case"utf-8":return I(this,t,r);case"ascii":return B(this,t,r);case"binary":return A(this,t,r);case"base64":return x(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return P(this,t,r);default:if(n)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}function _(e,t,r,n){r=Number(r)||0;var i=e.length-r;n?(n=Number(n))>i&&(n=i):n=i;var o=t.length;if(o%2!=0)throw new Error("Invalid hex string");n>o/2&&(n=o/2);for(var s=0;s<n;s++){var a=parseInt(t.substr(2*s,2),16);if(isNaN(a))throw new Error("Invalid hex string");e[r+s]=a}return s}function m(e,t,r,n){return H(z(t,e.length-r),e,r,n)}function w(e,t,r,n){return H(q(t),e,r,n)}function S(e,t,r,n){return w(e,t,r,n)}function E(e,t,r,n){return H(V(t),e,r,n)}function k(e,t,r,n){return H(W(t,e.length-r),e,r,n)}function x(e,t,r){
return 0===t&&r===e.length?$.fromByteArray(e):$.fromByteArray(e.slice(t,r))}function I(e,t,r){r=Math.min(e.length,r);for(var n=[],i=t;i<r;){var o=e[i],s=null,a=o>239?4:o>223?3:o>191?2:1;if(i+a<=r){var c,f,u,h;switch(a){case 1:o<128&&(s=o);break;case 2:c=e[i+1],128==(192&c)&&(h=(31&o)<<6|63&c)>127&&(s=h);break;case 3:c=e[i+1],f=e[i+2],128==(192&c)&&128==(192&f)&&(h=(15&o)<<12|(63&c)<<6|63&f)>2047&&(h<55296||h>57343)&&(s=h);break;case 4:c=e[i+1],f=e[i+2],u=e[i+3],128==(192&c)&&128==(192&f)&&128==(192&u)&&(h=(15&o)<<18|(63&c)<<12|(63&f)<<6|63&u)>65535&&h<1114112&&(s=h)}}null===s?(s=65533,a=1):s>65535&&(s-=65536,n.push(s>>>10&1023|55296),s=56320|1023&s),n.push(s),i+=a}return C(n)}function C(e){var t=e.length;if(t<=Q)return String.fromCharCode.apply(String,e);for(var r="",n=0;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=Q));return r}function B(e,t,r){var n="";r=Math.min(e.length,r);for(var i=t;i<r;i++)n+=String.fromCharCode(127&e[i]);return n}function A(e,t,r){var n="";r=Math.min(e.length,r);for(var i=t;i<r;i++)n+=String.fromCharCode(e[i]);return n}function L(e,t,r){var n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);for(var i="",o=t;o<r;o++)i+=Y(e[o]);return i}function P(e,t,r){for(var n=e.slice(t,r),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1]);return i}function j(e,t,r){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function R(e,t,r,n,o,s){if(!i.isBuffer(e))throw new TypeError("buffer must be a Buffer instance");if(t>o||t<s)throw new RangeError("value is out of bounds");if(r+n>e.length)throw new RangeError("index out of range")}function T(e,t,r,n){t<0&&(t=65535+t+1);for(var i=0,o=Math.min(e.length-r,2);i<o;i++)e[r+i]=(t&255<<8*(n?i:1-i))>>>8*(n?i:1-i)}function D(e,t,r,n){t<0&&(t=4294967295+t+1);for(var i=0,o=Math.min(e.length-r,4);i<o;i++)e[r+i]=t>>>8*(n?i:3-i)&255}function M(e,t,r,n,i,o){if(t>i||t<o)throw new RangeError("value is out of bounds");if(r+n>e.length)throw new RangeError("index out of range");if(r<0)throw new RangeError("index out of range")}function O(e,t,r,n,i){return i||M(e,t,r,4,3.4028234663852886e38,-3.4028234663852886e38),G.write(e,t,r,n,23,4),r+4}function U(e,t,r,n,i){return i||M(e,t,r,8,1.7976931348623157e308,-1.7976931348623157e308),G.write(e,t,r,n,52,8),r+8}function N(e){if(e=F(e).replace(X,""),e.length<2)return"";for(;e.length%4!=0;)e+="=";return e}function F(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}function Y(e){return e<16?"0"+e.toString(16):e.toString(16)}function z(e,t){t=t||1/0;for(var r,n=e.length,i=null,o=[],s=0;s<n;s++){if((r=e.charCodeAt(s))>55295&&r<57344){if(!i){if(r>56319){(t-=3)>-1&&o.push(239,191,189);continue}if(s+1===n){(t-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(t-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320)}else i&&(t-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((t-=1)<0)break;o.push(r)}else if(r<2048){if((t-=2)<0)break;o.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return o}function q(e){for(var t=[],r=0;r<e.length;r++)t.push(255&e.charCodeAt(r));return t}function W(e,t){for(var r,n,i,o=[],s=0;s<e.length&&!((t-=2)<0);s++)r=e.charCodeAt(s),n=r>>8,i=r%256,o.push(i),o.push(n);return o}function V(e){return $.toByteArray(N(e))}function H(e,t,r,n){for(var i=0;i<n&&!(i+r>=t.length||i>=e.length);i++)t[i+r]=e[i];return i}var $=e("base64-js"),G=e("ieee754"),K=e("isarray");r.Buffer=i,r.SlowBuffer=g,r.INSPECT_MAX_BYTES=50,i.poolSize=8192;var Z={};i.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){function e(){}try{var t=new Uint8Array(1);return t.foo=function(){return 42},t.constructor=e,42===t.foo()&&t.constructor===e&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(e){return!1}}(),i.TYPED_ARRAY_SUPPORT?(i.prototype.__proto__=Uint8Array.prototype,i.__proto__=Uint8Array):(i.prototype.length=void 0,i.prototype.parent=void 0),i.isBuffer=function(e){return!(null==e||!e._isBuffer)},i.compare=function(e,t){if(!i.isBuffer(e)||!i.isBuffer(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var r=e.length,n=t.length,o=0,s=Math.min(r,n);o<s&&e[o]===t[o];)++o;return o!==s&&(r=e[o],n=t[o]),r<n?-1:n<r?1:0},i.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},i.concat=function(e,t){if(!K(e))throw new TypeError("list argument must be an Array of Buffers.");if(0===e.length)return new i(0);var r;if(void 0===t)for(t=0,r=0;r<e.length;r++)t+=e[r].length;var n=new i(t),o=0;for(r=0;r<e.length;r++){var s=e[r];s.copy(n,o),o+=s.length}return n},i.byteLength=b,i.prototype.toString=function(){var e=0|this.length;return 0===e?"":0===arguments.length?I(this,0,e):v.apply(this,arguments)},i.prototype.equals=function(e){if(!i.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===i.compare(this,e)},i.prototype.inspect=function(){var e="",t=r.INSPECT_MAX_BYTES;return this.length>0&&(e=this.toString("hex",0,t).match(/.{2}/g).join(" "),this.length>t&&(e+=" ... ")),"<Buffer "+e+">"},i.prototype.compare=function(e){if(!i.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e?0:i.compare(this,e)},i.prototype.indexOf=function(e,t){function r(e,t,r){for(var n=-1,i=0;r+i<e.length;i++)if(e[r+i]===t[-1===n?0:i-n]){if(-1===n&&(n=i),i-n+1===t.length)return r+n}else n=-1;return-1}if(t>2147483647?t=2147483647:t<-2147483648&&(t=-2147483648),t>>=0,0===this.length)return-1;if(t>=this.length)return-1;if(t<0&&(t=Math.max(this.length+t,0)),"string"==typeof e)return 0===e.length?-1:String.prototype.indexOf.call(this,e,t);if(i.isBuffer(e))return r(this,e,t);if("number"==typeof e)return i.TYPED_ARRAY_SUPPORT&&"function"===Uint8Array.prototype.indexOf?Uint8Array.prototype.indexOf.call(this,e,t):r(this,[e],t);throw new TypeError("val must be string, number or Buffer")},i.prototype.get=function(e){return console.log(".get() is deprecated. Access using array indexes instead."),this.readUInt8(e)},i.prototype.set=function(e,t){return console.log(".set() is deprecated. Access using array indexes instead."),this.writeUInt8(e,t)},i.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else if(isFinite(t))t|=0,isFinite(r)?(r|=0,void 0===n&&(n="utf8")):(n=r,r=void 0);else{var i=n;n=t,t=0|r,r=i}var o=this.length-t;if((void 0===r||r>o)&&(r=o),e.length>0&&(r<0||t<0)||t>this.length)throw new RangeError("attempt to write outside buffer bounds");n||(n="utf8");for(var s=!1;;)switch(n){case"hex":return _(this,e,t,r);case"utf8":case"utf-8":return m(this,e,t,r);case"ascii":return w(this,e,t,r);case"binary":return S(this,e,t,r);case"base64":return E(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return k(this,e,t,r);default:if(s)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),s=!0}},i.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var Q=4096;i.prototype.slice=function(e,t){var r=this.length;e=~~e,t=void 0===t?r:~~t,e<0?(e+=r)<0&&(e=0):e>r&&(e=r),t<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);var n;if(i.TYPED_ARRAY_SUPPORT)n=i._augment(this.subarray(e,t));else{var o=t-e;n=new i(o,void 0);for(var s=0;s<o;s++)n[s]=this[s+e]}return n.length&&(n.parent=this.parent||this),n},i.prototype.readUIntLE=function(e,t,r){e|=0,t|=0,r||j(e,t,this.length);for(var n=this[e],i=1,o=0;++o<t&&(i*=256);)n+=this[e+o]*i;return n},i.prototype.readUIntBE=function(e,t,r){e|=0,t|=0,r||j(e,t,this.length);for(var n=this[e+--t],i=1;t>0&&(i*=256);)n+=this[e+--t]*i;return n},i.prototype.readUInt8=function(e,t){return t||j(e,1,this.length),this[e]},i.prototype.readUInt16LE=function(e,t){return t||j(e,2,this.length),this[e]|this[e+1]<<8},i.prototype.readUInt16BE=function(e,t){return t||j(e,2,this.length),this[e]<<8|this[e+1]},i.prototype.readUInt32LE=function(e,t){return t||j(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},i.prototype.readUInt32BE=function(e,t){return t||j(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},i.prototype.readIntLE=function(e,t,r){e|=0,t|=0,r||j(e,t,this.length);for(var n=this[e],i=1,o=0;++o<t&&(i*=256);)n+=this[e+o]*i;return i*=128,n>=i&&(n-=Math.pow(2,8*t)),n},i.prototype.readIntBE=function(e,t,r){e|=0,t|=0,r||j(e,t,this.length);for(var n=t,i=1,o=this[e+--n];n>0&&(i*=256);)o+=this[e+--n]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*t)),o},i.prototype.readInt8=function(e,t){return t||j(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},i.prototype.readInt16LE=function(e,t){t||j(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},i.prototype.readInt16BE=function(e,t){t||j(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},i.prototype.readInt32LE=function(e,t){return t||j(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},i.prototype.readInt32BE=function(e,t){return t||j(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},i.prototype.readFloatLE=function(e,t){return t||j(e,4,this.length),G.read(this,e,!0,23,4)},i.prototype.readFloatBE=function(e,t){return t||j(e,4,this.length),G.read(this,e,!1,23,4)},i.prototype.readDoubleLE=function(e,t){return t||j(e,8,this.length),G.read(this,e,!0,52,8)},i.prototype.readDoubleBE=function(e,t){return t||j(e,8,this.length),G.read(this,e,!1,52,8)},i.prototype.writeUIntLE=function(e,t,r,n){e=+e,t|=0,r|=0,n||R(this,e,t,r,Math.pow(2,8*r),0);var i=1,o=0;for(this[t]=255&e;++o<r&&(i*=256);)this[t+o]=e/i&255;return t+r},i.prototype.writeUIntBE=function(e,t,r,n){e=+e,t|=0,r|=0,n||R(this,e,t,r,Math.pow(2,8*r),0);var i=r-1,o=1;for(this[t+i]=255&e;--i>=0&&(o*=256);)this[t+i]=e/o&255;return t+r},i.prototype.writeUInt8=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,1,255,0),i.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[t]=255&e,t+1},i.prototype.writeUInt16LE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,2,65535,0),i.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):T(this,e,t,!0),t+2},i.prototype.writeUInt16BE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,2,65535,0),i.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):T(this,e,t,!1),t+2},i.prototype.writeUInt32LE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,4,4294967295,0),i.TYPED_ARRAY_SUPPORT?(this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e):D(this,e,t,!0),t+4},i.prototype.writeUInt32BE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,4,4294967295,0),i.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):D(this,e,t,!1),t+4},i.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t|=0,!n){var i=Math.pow(2,8*r-1);R(this,e,t,r,i-1,-i)}var o=0,s=1,a=e<0?1:0;for(this[t]=255&e;++o<r&&(s*=256);)this[t+o]=(e/s>>0)-a&255;return t+r},i.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t|=0,!n){var i=Math.pow(2,8*r-1);R(this,e,t,r,i-1,-i)}var o=r-1,s=1,a=e<0?1:0;for(this[t+o]=255&e;--o>=0&&(s*=256);)this[t+o]=(e/s>>0)-a&255;return t+r},i.prototype.writeInt8=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,1,127,-128),i.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),e<0&&(e=255+e+1),this[t]=255&e,t+1},i.prototype.writeInt16LE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,2,32767,-32768),i.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):T(this,e,t,!0),t+2},i.prototype.writeInt16BE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,2,32767,-32768),i.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):T(this,e,t,!1),t+2},i.prototype.writeInt32LE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,4,2147483647,-2147483648),i.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24):D(this,e,t,!0),t+4},i.prototype.writeInt32BE=function(e,t,r){return e=+e,t|=0,r||R(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),i.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):D(this,e,t,!1),t+4},i.prototype.writeFloatLE=function(e,t,r){return O(this,e,t,!0,r)},i.prototype.writeFloatBE=function(e,t,r){return O(this,e,t,!1,r)},i.prototype.writeDoubleLE=function(e,t,r){return U(this,e,t,!0,r)},i.prototype.writeDoubleBE=function(e,t,r){return U(this,e,t,!1,r)},i.prototype.copy=function(e,t,r,n){if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);var o,s=n-r;if(this===e&&r<t&&t<n)for(o=s-1;o>=0;o--)e[o+t]=this[o+r];else if(s<1e3||!i.TYPED_ARRAY_SUPPORT)for(o=0;o<s;o++)e[o+t]=this[o+r];else e._set(this.subarray(r,r+s),t);return s},i.prototype.fill=function(e,t,r){if(e||(e=0),t||(t=0),r||(r=this.length),r<t)throw new RangeError("end < start");if(r!==t&&0!==this.length){if(t<0||t>=this.length)throw new RangeError("start out of bounds");if(r<0||r>this.length)throw new RangeError("end out of bounds");var n;if("number"==typeof e)for(n=t;n<r;n++)this[n]=e;else{var i=z(e.toString()),o=i.length;for(n=t;n<r;n++)this[n]=i[n%o]}return this}},i.prototype.toArrayBuffer=function(){if("undefined"!=typeof Uint8Array){if(i.TYPED_ARRAY_SUPPORT)return new i(this).buffer;for(var e=new Uint8Array(this.length),t=0,r=e.length;t<r;t+=1)e[t]=this[t];return e.buffer}throw new TypeError("Buffer.toArrayBuffer not supported in this browser")};var J=i.prototype;i._augment=function(e){return e.constructor=i,e._isBuffer=!0,e._set=e.set,e.get=J.get,e.set=J.set,e.write=J.write,e.toString=J.toString,e.toLocaleString=J.toString,e.toJSON=J.toJSON,e.equals=J.equals,e.compare=J.compare,e.indexOf=J.indexOf,e.copy=J.copy,e.slice=J.slice,e.readUIntLE=J.readUIntLE,e.readUIntBE=J.readUIntBE,e.readUInt8=J.readUInt8,e.readUInt16LE=J.readUInt16LE,e.readUInt16BE=J.readUInt16BE,e.readUInt32LE=J.readUInt32LE,e.readUInt32BE=J.readUInt32BE,e.readIntLE=J.readIntLE,e.readIntBE=J.readIntBE,e.readInt8=J.readInt8,e.readInt16LE=J.readInt16LE,e.readInt16BE=J.readInt16BE,e.readInt32LE=J.readInt32LE,e.readInt32BE=J.readInt32BE,e.readFloatLE=J.readFloatLE,e.readFloatBE=J.readFloatBE,e.readDoubleLE=J.readDoubleLE,e.readDoubleBE=J.readDoubleBE,e.writeUInt8=J.writeUInt8,e.writeUIntLE=J.writeUIntLE,e.writeUIntBE=J.writeUIntBE,e.writeUInt16LE=J.writeUInt16LE,e.writeUInt16BE=J.writeUInt16BE,e.writeUInt32LE=J.writeUInt32LE,e.writeUInt32BE=J.writeUInt32BE,e.writeIntLE=J.writeIntLE,e.writeIntBE=J.writeIntBE,e.writeInt8=J.writeInt8,e.writeInt16LE=J.writeInt16LE,e.writeInt16BE=J.writeInt16BE,e.writeInt32LE=J.writeInt32LE,e.writeInt32BE=J.writeInt32BE,e.writeFloatLE=J.writeFloatLE,e.writeFloatBE=J.writeFloatBE,e.writeDoubleLE=J.writeDoubleLE,e.writeDoubleBE=J.writeDoubleBE,e.fill=J.fill,e.inspect=J.inspect,e.toArrayBuffer=J.toArrayBuffer,e};var X=/[^+\/0-9A-Za-z-_]/g}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"base64-js":65,ieee754:105,isarray:67}],67:[function(e,t,r){var n={}.toString;t.exports=Array.isArray||function(e){return"[object Array]"==n.call(e)}},{}],68:[function(e,t,r){function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(e){return"function"==typeof e}function o(e){return"number"==typeof e}function s(e){return"object"==typeof e&&null!==e}function a(e){return void 0===e}t.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(e){if(!o(e)||e<0||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},n.prototype.emit=function(e){var t,r,n,o,c,f;if(this._events||(this._events={}),"error"===e&&(!this._events.error||s(this._events.error)&&!this._events.error.length)){if((t=arguments[1])instanceof Error)throw t;throw TypeError('Uncaught, unspecified "error" event.')}if(r=this._events[e],a(r))return!1;if(i(r))switch(arguments.length){case 1:r.call(this);break;case 2:r.call(this,arguments[1]);break;case 3:r.call(this,arguments[1],arguments[2]);break;default:for(n=arguments.length,o=new Array(n-1),c=1;c<n;c++)o[c-1]=arguments[c];r.apply(this,o)}else if(s(r)){for(n=arguments.length,o=new Array(n-1),c=1;c<n;c++)o[c-1]=arguments[c];for(f=r.slice(),n=f.length,c=0;c<n;c++)f[c].apply(this,o)}return!0},n.prototype.addListener=function(e,t){var r;if(!i(t))throw TypeError("listener must be a function");if(this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,i(t.listener)?t.listener:t),this._events[e]?s(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,s(this._events[e])&&!this._events[e].warned){var r;r=a(this._maxListeners)?n.defaultMaxListeners:this._maxListeners,r&&r>0&&this._events[e].length>r&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())}return this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(e,t){function r(){this.removeListener(e,r),n||(n=!0,t.apply(this,arguments))}if(!i(t))throw TypeError("listener must be a function");var n=!1;return r.listener=t,this.on(e,r),this},n.prototype.removeListener=function(e,t){var r,n,o,a;if(!i(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(r=this._events[e],o=r.length,n=-1,r===t||i(r.listener)&&r.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(s(r)){for(a=o;a-- >0;)if(r[a]===t||r[a].listener&&r[a].listener===t){n=a;break}if(n<0)return this;1===r.length?(r.length=0,delete this._events[e]):r.splice(n,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},n.prototype.removeAllListeners=function(e){var t,r;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(r=this._events[e],i(r))this.removeListener(e,r);else for(;r.length;)this.removeListener(e,r[r.length-1]);return delete this._events[e],this},n.prototype.listeners=function(e){return this._events&&this._events[e]?i(this._events[e])?[this._events[e]]:this._events[e].slice():[]},n.listenerCount=function(e,t){return e._events&&e._events[t]?i(e._events[t])?1:e._events[t].length:0}},{}],69:[function(e,t,r){t.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],70:[function(e,t,r){t.exports=e("./lib/_stream_duplex.js")},{"./lib/_stream_duplex.js":71}],71:[function(e,t,r){(function(r){function n(e){if(!(this instanceof n))return new n(e);a.call(this,e),c.call(this,e),e&&!1===e.readable&&(this.readable=!1),e&&!1===e.writable&&(this.writable=!1),this.allowHalfOpen=!0,e&&!1===e.allowHalfOpen&&(this.allowHalfOpen=!1),this.once("end",i)}function i(){this.allowHalfOpen||this._writableState.ended||r.nextTick(this.end.bind(this))}t.exports=n;var o=Object.keys||function(e){var t=[];for(var r in e)t.push(r);return t},s=e("core-util-is");s.inherits=e("inherits");var a=e("./_stream_readable"),c=e("./_stream_writable");s.inherits(n,a),function(e,t){for(var r=0,n=e.length;r<n;r++)t(e[r],r)}(o(c.prototype),function(e){n.prototype[e]||(n.prototype[e]=c.prototype[e])})}).call(this,e("_process"))},{"./_stream_readable":73,"./_stream_writable":75,_process:111,"core-util-is":84,inherits:106}],72:[function(e,t,r){function n(e){if(!(this instanceof n))return new n(e);i.call(this,e)}t.exports=n;var i=e("./_stream_transform"),o=e("core-util-is");o.inherits=e("inherits"),o.inherits(n,i),n.prototype._transform=function(e,t,r){r(null,e)}},{"./_stream_transform":74,"core-util-is":84,inherits:106}],73:[function(e,t,r){(function(r){function n(t,r){var n=e("./_stream_duplex");t=t||{};var i=t.highWaterMark,o=t.objectMode?16:16384;this.highWaterMark=i||0===i?i:o,this.highWaterMark=~~this.highWaterMark,this.buffer=[],this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.objectMode=!!t.objectMode,r instanceof n&&(this.objectMode=this.objectMode||!!t.readableObjectMode),this.defaultEncoding=t.defaultEncoding||"utf8",this.ranOut=!1,this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,t.encoding&&(B||(B=e("string_decoder/").StringDecoder),this.decoder=new B(t.encoding),this.encoding=t.encoding)}function i(t){e("./_stream_duplex");if(!(this instanceof i))return new i(t);this._readableState=new n(t,this),this.readable=!0,I.call(this)}function o(e,t,r,n,i){var o=f(t,r);if(o)e.emit("error",o);else if(C.isNullOrUndefined(r))t.reading=!1,t.ended||u(e,t);else if(t.objectMode||r&&r.length>0)if(t.ended&&!i){var a=new Error("stream.push() after EOF");e.emit("error",a)}else if(t.endEmitted&&i){var a=new Error("stream.unshift() after end event");e.emit("error",a)}else!t.decoder||i||n||(r=t.decoder.write(r)),i||(t.reading=!1),t.flowing&&0===t.length&&!t.sync?(e.emit("data",r),e.read(0)):(t.length+=t.objectMode?1:r.length,i?t.buffer.unshift(r):t.buffer.push(r),t.needReadable&&h(e)),p(e,t);else i||(t.reading=!1);return s(t)}function s(e){return!e.ended&&(e.needReadable||e.length<e.highWaterMark||0===e.length)}function a(e){if(e>=L)e=L;else{e--;for(var t=1;t<32;t<<=1)e|=e>>t;e++}return e}function c(e,t){return 0===t.length&&t.ended?0:t.objectMode?0===e?0:1:isNaN(e)||C.isNull(e)?t.flowing&&t.buffer.length?t.buffer[0].length:t.length:e<=0?0:(e>t.highWaterMark&&(t.highWaterMark=a(e)),e>t.length?t.ended?t.length:(t.needReadable=!0,0):e)}function f(e,t){var r=null;return C.isBuffer(t)||C.isString(t)||C.isNullOrUndefined(t)||e.objectMode||(r=new TypeError("Invalid non-string/buffer chunk")),r}function u(e,t){if(t.decoder&&!t.ended){var r=t.decoder.end();r&&r.length&&(t.buffer.push(r),t.length+=t.objectMode?1:r.length)}t.ended=!0,h(e)}function h(e){var t=e._readableState;t.needReadable=!1,t.emittedReadable||(A("emitReadable",t.flowing),t.emittedReadable=!0,t.sync?r.nextTick(function(){l(e)}):l(e))}function l(e){A("emit readable"),e.emit("readable"),v(e)}function p(e,t){t.readingMore||(t.readingMore=!0,r.nextTick(function(){d(e,t)}))}function d(e,t){for(var r=t.length;!t.reading&&!t.flowing&&!t.ended&&t.length<t.highWaterMark&&(A("maybeReadMore read 0"),e.read(0),r!==t.length);)r=t.length;t.readingMore=!1}function y(e){return function(){var t=e._readableState;A("pipeOnDrain",t.awaitDrain),t.awaitDrain&&t.awaitDrain--,0===t.awaitDrain&&x.listenerCount(e,"data")&&(t.flowing=!0,v(e))}}function g(e,t){t.resumeScheduled||(t.resumeScheduled=!0,r.nextTick(function(){b(e,t)}))}function b(e,t){t.resumeScheduled=!1,e.emit("resume"),v(e),t.flowing&&!t.reading&&e.read(0)}function v(e){var t=e._readableState;if(A("flow",t.flowing),t.flowing)do{var r=e.read()}while(null!==r&&t.flowing)}function _(e,t){var r,n=t.buffer,i=t.length,o=!!t.decoder,s=!!t.objectMode;if(0===n.length)return null;if(0===i)r=null;else if(s)r=n.shift();else if(!e||e>=i)r=o?n.join(""):k.concat(n,i),n.length=0;else if(e<n[0].length){var a=n[0];r=a.slice(0,e),n[0]=a.slice(e)}else if(e===n[0].length)r=n.shift();else{r=o?"":new k(e);for(var c=0,f=0,u=n.length;f<u&&c<e;f++){var a=n[0],h=Math.min(e-c,a.length);o?r+=a.slice(0,h):a.copy(r,c,0,h),h<a.length?n[0]=a.slice(h):n.shift(),c+=h}}return r}function m(e){var t=e._readableState;if(t.length>0)throw new Error("endReadable called on non-empty stream");t.endEmitted||(t.ended=!0,r.nextTick(function(){t.endEmitted||0!==t.length||(t.endEmitted=!0,e.readable=!1,e.emit("end"))}))}function w(e,t){for(var r=0,n=e.length;r<n;r++)t(e[r],r)}function S(e,t){for(var r=0,n=e.length;r<n;r++)if(e[r]===t)return r;return-1}t.exports=i;var E=e("isarray"),k=e("buffer").Buffer;i.ReadableState=n;var x=e("events").EventEmitter;x.listenerCount||(x.listenerCount=function(e,t){return e.listeners(t).length});var I=e("stream"),C=e("core-util-is");C.inherits=e("inherits");var B,A=e("util");A=A&&A.debuglog?A.debuglog("stream"):function(){},C.inherits(i,I),i.prototype.push=function(e,t){var r=this._readableState;return C.isString(e)&&!r.objectMode&&(t=t||r.defaultEncoding)!==r.encoding&&(e=new k(e,t),t=""),o(this,r,e,t,!1)},i.prototype.unshift=function(e){return o(this,this._readableState,e,"",!0)},i.prototype.setEncoding=function(t){return B||(B=e("string_decoder/").StringDecoder),this._readableState.decoder=new B(t),this._readableState.encoding=t,this};var L=8388608;i.prototype.read=function(e){A("read",e);var t=this._readableState,r=e;if((!C.isNumber(e)||e>0)&&(t.emittedReadable=!1),0===e&&t.needReadable&&(t.length>=t.highWaterMark||t.ended))return A("read: emitReadable",t.length,t.ended),0===t.length&&t.ended?m(this):h(this),null;if(0===(e=c(e,t))&&t.ended)return 0===t.length&&m(this),null;var n=t.needReadable;A("need readable",n),(0===t.length||t.length-e<t.highWaterMark)&&(n=!0,A("length less than watermark",n)),(t.ended||t.reading)&&(n=!1,A("reading or ended",n)),n&&(A("do read"),t.reading=!0,t.sync=!0,0===t.length&&(t.needReadable=!0),this._read(t.highWaterMark),t.sync=!1),n&&!t.reading&&(e=c(r,t));var i;return i=e>0?_(e,t):null,C.isNull(i)&&(t.needReadable=!0,e=0),t.length-=e,0!==t.length||t.ended||(t.needReadable=!0),r!==e&&t.ended&&0===t.length&&m(this),C.isNull(i)||this.emit("data",i),i},i.prototype._read=function(e){this.emit("error",new Error("not implemented"))},i.prototype.pipe=function(e,t){function n(e){A("onunpipe"),e===h&&o()}function i(){A("onend"),e.end()}function o(){A("cleanup"),e.removeListener("close",c),e.removeListener("finish",f),e.removeListener("drain",g),e.removeListener("error",a),e.removeListener("unpipe",n),h.removeListener("end",i),h.removeListener("end",o),h.removeListener("data",s),!l.awaitDrain||e._writableState&&!e._writableState.needDrain||g()}function s(t){A("ondata"),!1===e.write(t)&&(A("false write response, pause",h._readableState.awaitDrain),h._readableState.awaitDrain++,h.pause())}function a(t){A("onerror",t),u(),e.removeListener("error",a),0===x.listenerCount(e,"error")&&e.emit("error",t)}function c(){e.removeListener("finish",f),u()}function f(){A("onfinish"),e.removeListener("close",c),u()}function u(){A("unpipe"),h.unpipe(e)}var h=this,l=this._readableState;switch(l.pipesCount){case 0:l.pipes=e;break;case 1:l.pipes=[l.pipes,e];break;default:l.pipes.push(e)}l.pipesCount+=1,A("pipe count=%d opts=%j",l.pipesCount,t);var p=(!t||!1!==t.end)&&e!==r.stdout&&e!==r.stderr,d=p?i:o;l.endEmitted?r.nextTick(d):h.once("end",d),e.on("unpipe",n);var g=y(h);return e.on("drain",g),h.on("data",s),e._events&&e._events.error?E(e._events.error)?e._events.error.unshift(a):e._events.error=[a,e._events.error]:e.on("error",a),e.once("close",c),e.once("finish",f),e.emit("pipe",h),l.flowing||(A("pipe resume"),h.resume()),e},i.prototype.unpipe=function(e){var t=this._readableState;if(0===t.pipesCount)return this;if(1===t.pipesCount)return e&&e!==t.pipes?this:(e||(e=t.pipes),t.pipes=null,t.pipesCount=0,t.flowing=!1,e&&e.emit("unpipe",this),this);if(!e){var r=t.pipes,n=t.pipesCount;t.pipes=null,t.pipesCount=0,t.flowing=!1;for(var i=0;i<n;i++)r[i].emit("unpipe",this);return this}var i=S(t.pipes,e);return-1===i?this:(t.pipes.splice(i,1),t.pipesCount-=1,1===t.pipesCount&&(t.pipes=t.pipes[0]),e.emit("unpipe",this),this)},i.prototype.on=function(e,t){var n=I.prototype.on.call(this,e,t);if("data"===e&&!1!==this._readableState.flowing&&this.resume(),"readable"===e&&this.readable){var i=this._readableState;if(!i.readableListening)if(i.readableListening=!0,i.emittedReadable=!1,i.needReadable=!0,i.reading)i.length&&h(this);else{var o=this;r.nextTick(function(){A("readable nexttick read 0"),o.read(0)})}}return n},i.prototype.addListener=i.prototype.on,i.prototype.resume=function(){var e=this._readableState;return e.flowing||(A("resume"),e.flowing=!0,e.reading||(A("resume read 0"),this.read(0)),g(this,e)),this},i.prototype.pause=function(){return A("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(A("pause"),this._readableState.flowing=!1,this.emit("pause")),this},i.prototype.wrap=function(e){var t=this._readableState,r=!1,n=this;e.on("end",function(){if(A("wrapped end"),t.decoder&&!t.ended){var e=t.decoder.end();e&&e.length&&n.push(e)}n.push(null)}),e.on("data",function(i){if(A("wrapped data"),t.decoder&&(i=t.decoder.write(i)),i&&(t.objectMode||i.length)){n.push(i)||(r=!0,e.pause())}});for(var i in e)C.isFunction(e[i])&&C.isUndefined(this[i])&&(this[i]=function(t){return function(){return e[t].apply(e,arguments)}}(i));return w(["error","close","destroy","pause","resume"],function(t){e.on(t,n.emit.bind(n,t))}),n._read=function(t){A("wrapped _read",t),r&&(r=!1,e.resume())},n},i._fromList=_}).call(this,e("_process"))},{"./_stream_duplex":71,_process:111,buffer:66,"core-util-is":84,events:68,inherits:106,isarray:69,stream:80,"string_decoder/":81,util:64}],74:[function(e,t,r){function n(e,t){this.afterTransform=function(e,r){return i(t,e,r)},this.needTransform=!1,this.transforming=!1,this.writecb=null,this.writechunk=null}function i(e,t,r){var n=e._transformState;n.transforming=!1;var i=n.writecb;if(!i)return e.emit("error",new Error("no writecb in Transform class"));n.writechunk=null,n.writecb=null,c.isNullOrUndefined(r)||e.push(r),i&&i(t);var o=e._readableState;o.reading=!1,(o.needReadable||o.length<o.highWaterMark)&&e._read(o.highWaterMark)}function o(e){if(!(this instanceof o))return new o(e);a.call(this,e),this._transformState=new n(e,this);var t=this;this._readableState.needReadable=!0,this._readableState.sync=!1,this.once("prefinish",function(){c.isFunction(this._flush)?this._flush(function(e){s(t,e)}):s(t)})}function s(e,t){if(t)return e.emit("error",t);var r=e._writableState,n=e._transformState;if(r.length)throw new Error("calling transform done when ws.length != 0");if(n.transforming)throw new Error("calling transform done when still transforming");return e.push(null)}t.exports=o;var a=e("./_stream_duplex"),c=e("core-util-is");c.inherits=e("inherits"),c.inherits(o,a),o.prototype.push=function(e,t){return this._transformState.needTransform=!1,a.prototype.push.call(this,e,t)},o.prototype._transform=function(e,t,r){throw new Error("not implemented")},o.prototype._write=function(e,t,r){var n=this._transformState;if(n.writecb=r,n.writechunk=e,n.writeencoding=t,!n.transforming){var i=this._readableState;(n.needTransform||i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark)}},o.prototype._read=function(e){var t=this._transformState;c.isNull(t.writechunk)||!t.writecb||t.transforming?t.needTransform=!0:(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform))}},{"./_stream_duplex":71,"core-util-is":84,inherits:106}],75:[function(e,t,r){(function(r){function n(e,t,r){this.chunk=e,this.encoding=t,this.callback=r}function i(t,r){var n=e("./_stream_duplex");t=t||{};var i=t.highWaterMark,o=t.objectMode?16:16384;this.highWaterMark=i||0===i?i:o,this.objectMode=!!t.objectMode,r instanceof n&&(this.objectMode=this.objectMode||!!t.writableObjectMode),this.highWaterMark=~~this.highWaterMark,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1;var s=!1===t.decodeStrings;this.decodeStrings=!s,this.defaultEncoding=t.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,
this.bufferProcessing=!1,this.onwrite=function(e){p(r,e)},this.writecb=null,this.writelen=0,this.buffer=[],this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1}function o(t){var r=e("./_stream_duplex");if(!(this instanceof o||this instanceof r))return new o(t);this._writableState=new i(t,this),this.writable=!0,E.call(this)}function s(e,t,n){var i=new Error("write after end");e.emit("error",i),r.nextTick(function(){n(i)})}function a(e,t,n,i){var o=!0;if(!(S.isBuffer(n)||S.isString(n)||S.isNullOrUndefined(n)||t.objectMode)){var s=new TypeError("Invalid non-string/buffer chunk");e.emit("error",s),r.nextTick(function(){i(s)}),o=!1}return o}function c(e,t,r){return!e.objectMode&&!1!==e.decodeStrings&&S.isString(t)&&(t=new w(t,r)),t}function f(e,t,r,i,o){r=c(t,r,i),S.isBuffer(r)&&(i="buffer");var s=t.objectMode?1:r.length;t.length+=s;var a=t.length<t.highWaterMark;return a||(t.needDrain=!0),t.writing||t.corked?t.buffer.push(new n(r,i,o)):u(e,t,!1,s,r,i,o),a}function u(e,t,r,n,i,o,s){t.writelen=n,t.writecb=s,t.writing=!0,t.sync=!0,r?e._writev(i,t.onwrite):e._write(i,o,t.onwrite),t.sync=!1}function h(e,t,n,i,o){n?r.nextTick(function(){t.pendingcb--,o(i)}):(t.pendingcb--,o(i)),e._writableState.errorEmitted=!0,e.emit("error",i)}function l(e){e.writing=!1,e.writecb=null,e.length-=e.writelen,e.writelen=0}function p(e,t){var n=e._writableState,i=n.sync,o=n.writecb;if(l(n),t)h(e,n,i,t,o);else{var s=b(e,n);s||n.corked||n.bufferProcessing||!n.buffer.length||g(e,n),i?r.nextTick(function(){d(e,n,s,o)}):d(e,n,s,o)}}function d(e,t,r,n){r||y(e,t),t.pendingcb--,n(),_(e,t)}function y(e,t){0===t.length&&t.needDrain&&(t.needDrain=!1,e.emit("drain"))}function g(e,t){if(t.bufferProcessing=!0,e._writev&&t.buffer.length>1){for(var r=[],n=0;n<t.buffer.length;n++)r.push(t.buffer[n].callback);t.pendingcb++,u(e,t,!0,t.length,t.buffer,"",function(e){for(var n=0;n<r.length;n++)t.pendingcb--,r[n](e)}),t.buffer=[]}else{for(var n=0;n<t.buffer.length;n++){var i=t.buffer[n],o=i.chunk,s=i.encoding,a=i.callback,c=t.objectMode?1:o.length;if(u(e,t,!1,c,o,s,a),t.writing){n++;break}}n<t.buffer.length?t.buffer=t.buffer.slice(n):t.buffer.length=0}t.bufferProcessing=!1}function b(e,t){return t.ending&&0===t.length&&!t.finished&&!t.writing}function v(e,t){t.prefinished||(t.prefinished=!0,e.emit("prefinish"))}function _(e,t){var r=b(e,t);return r&&(0===t.pendingcb?(v(e,t),t.finished=!0,e.emit("finish")):v(e,t)),r}function m(e,t,n){t.ending=!0,_(e,t),n&&(t.finished?r.nextTick(n):e.once("finish",n)),t.ended=!0}t.exports=o;var w=e("buffer").Buffer;o.WritableState=i;var S=e("core-util-is");S.inherits=e("inherits");var E=e("stream");S.inherits(o,E),o.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe. Not readable."))},o.prototype.write=function(e,t,r){var n=this._writableState,i=!1;return S.isFunction(t)&&(r=t,t=null),S.isBuffer(e)?t="buffer":t||(t=n.defaultEncoding),S.isFunction(r)||(r=function(){}),n.ended?s(this,n,r):a(this,n,e,r)&&(n.pendingcb++,i=f(this,n,e,t,r)),i},o.prototype.cork=function(){this._writableState.corked++},o.prototype.uncork=function(){var e=this._writableState;e.corked&&(e.corked--,e.writing||e.corked||e.finished||e.bufferProcessing||!e.buffer.length||g(this,e))},o.prototype._write=function(e,t,r){r(new Error("not implemented"))},o.prototype._writev=null,o.prototype.end=function(e,t,r){var n=this._writableState;S.isFunction(e)?(r=e,e=null,t=null):S.isFunction(t)&&(r=t,t=null),S.isNullOrUndefined(e)||this.write(e,t),n.corked&&(n.corked=1,this.uncork()),n.ending||n.finished||m(this,n,r)}}).call(this,e("_process"))},{"./_stream_duplex":71,_process:111,buffer:66,"core-util-is":84,inherits:106,stream:80}],76:[function(e,t,r){t.exports=e("./lib/_stream_passthrough.js")},{"./lib/_stream_passthrough.js":72}],77:[function(e,t,r){(function(n){r=t.exports=e("./lib/_stream_readable.js"),r.Stream=e("stream"),r.Readable=r,r.Writable=e("./lib/_stream_writable.js"),r.Duplex=e("./lib/_stream_duplex.js"),r.Transform=e("./lib/_stream_transform.js"),r.PassThrough=e("./lib/_stream_passthrough.js"),n.browser||"disable"!==n.env.READABLE_STREAM||(t.exports=e("stream"))}).call(this,e("_process"))},{"./lib/_stream_duplex.js":71,"./lib/_stream_passthrough.js":72,"./lib/_stream_readable.js":73,"./lib/_stream_transform.js":74,"./lib/_stream_writable.js":75,_process:111,stream:80}],78:[function(e,t,r){t.exports=e("./lib/_stream_transform.js")},{"./lib/_stream_transform.js":74}],79:[function(e,t,r){t.exports=e("./lib/_stream_writable.js")},{"./lib/_stream_writable.js":75}],80:[function(e,t,r){function n(){i.call(this)}t.exports=n;var i=e("events").EventEmitter;e("inherits")(n,i),n.Readable=e("readable-stream/readable.js"),n.Writable=e("readable-stream/writable.js"),n.Duplex=e("readable-stream/duplex.js"),n.Transform=e("readable-stream/transform.js"),n.PassThrough=e("readable-stream/passthrough.js"),n.Stream=n,n.prototype.pipe=function(e,t){function r(t){e.writable&&!1===e.write(t)&&f.pause&&f.pause()}function n(){f.readable&&f.resume&&f.resume()}function o(){u||(u=!0,e.end())}function s(){u||(u=!0,"function"==typeof e.destroy&&e.destroy())}function a(e){if(c(),0===i.listenerCount(this,"error"))throw e}function c(){f.removeListener("data",r),e.removeListener("drain",n),f.removeListener("end",o),f.removeListener("close",s),f.removeListener("error",a),e.removeListener("error",a),f.removeListener("end",c),f.removeListener("close",c),e.removeListener("close",c)}var f=this;f.on("data",r),e.on("drain",n),e._isStdio||t&&!1===t.end||(f.on("end",o),f.on("close",s));var u=!1;return f.on("error",a),e.on("error",a),f.on("end",c),f.on("close",c),e.on("close",c),e.emit("pipe",f),e}},{events:68,inherits:106,"readable-stream/duplex.js":70,"readable-stream/passthrough.js":76,"readable-stream/readable.js":77,"readable-stream/transform.js":78,"readable-stream/writable.js":79}],81:[function(e,t,r){function n(e){if(e&&!c(e))throw new Error("Unknown encoding: "+e)}function i(e){return e.toString(this.encoding)}function o(e){this.charReceived=e.length%2,this.charLength=this.charReceived?2:0}function s(e){this.charReceived=e.length%3,this.charLength=this.charReceived?3:0}var a=e("buffer").Buffer,c=a.isEncoding||function(e){switch(e&&e.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}},f=r.StringDecoder=function(e){switch(this.encoding=(e||"utf8").toLowerCase().replace(/[-_]/,""),n(e),this.encoding){case"utf8":this.surrogateSize=3;break;case"ucs2":case"utf16le":this.surrogateSize=2,this.detectIncompleteChar=o;break;case"base64":this.surrogateSize=3,this.detectIncompleteChar=s;break;default:return void(this.write=i)}this.charBuffer=new a(6),this.charReceived=0,this.charLength=0};f.prototype.write=function(e){for(var t="";this.charLength;){var r=e.length>=this.charLength-this.charReceived?this.charLength-this.charReceived:e.length;if(e.copy(this.charBuffer,this.charReceived,0,r),this.charReceived+=r,this.charReceived<this.charLength)return"";e=e.slice(r,e.length),t=this.charBuffer.slice(0,this.charLength).toString(this.encoding);var n=t.charCodeAt(t.length-1);if(!(n>=55296&&n<=56319)){if(this.charReceived=this.charLength=0,0===e.length)return t;break}this.charLength+=this.surrogateSize,t=""}this.detectIncompleteChar(e);var i=e.length;this.charLength&&(e.copy(this.charBuffer,0,e.length-this.charReceived,i),i-=this.charReceived),t+=e.toString(this.encoding,0,i);var i=t.length-1,n=t.charCodeAt(i);if(n>=55296&&n<=56319){var o=this.surrogateSize;return this.charLength+=o,this.charReceived+=o,this.charBuffer.copy(this.charBuffer,o,0,o),e.copy(this.charBuffer,0,0,o),t.substring(0,i)}return t},f.prototype.detectIncompleteChar=function(e){for(var t=e.length>=3?3:e.length;t>0;t--){var r=e[e.length-t];if(1==t&&r>>5==6){this.charLength=2;break}if(t<=2&&r>>4==14){this.charLength=3;break}if(t<=3&&r>>3==30){this.charLength=4;break}}this.charReceived=t},f.prototype.end=function(e){var t="";if(e&&e.length&&(t=this.write(e)),this.charReceived){var r=this.charReceived,n=this.charBuffer,i=this.encoding;t+=n.slice(0,r).toString(i)}return t}},{buffer:66}],82:[function(e,t,r){t.exports=e("./module")},{"./module":83}],83:[function(e,t,r){var n,i=[].indexOf||function(e){for(var t=0,r=this.length;t<r;t++)if(t in this&&this[t]===e)return t;return-1},o=[].slice;n=["extended","included"],r.Module=function(){function e(){}return e.extends=function(e){var t,r,o;for(t in e)r=e[t],i.call(n,t)<0&&(this[t]=r);return null!=(o=e.extended)&&o.call(this,this),this},e.includes=function(e){var t,r,o;for(t in e)r=e[t],i.call(n,t)<0&&(this.prototype[t]=r);return null!=(o=e.included)&&o.call(this,this),this},e.delegate=function(){var e,t,r,n,i,s;for(e=1<=arguments.length?o.call(arguments,0):[],r=e.pop(),s=[],n=0,i=e.length;n<i;n++)t=e[n],s.push(this.prototype[t]=r.prototype[t]);return s},e.aliasFunction=function(e,t){return this.prototype[e]=function(e){return function(){var r;return r=1<=arguments.length?o.call(arguments,0):[],e.prototype[t].apply(e,r)}}(this)},e.aliasProperty=function(e,t){return Object.defineProperty(this.prototype,e,{get:function(){return this[t]},set:function(e){return this[t]=e}})},e.included=function(e){return e.call(this,this.prototype)},e}()},{}],84:[function(e,t,r){(function(e){function t(e){return Array.isArray?Array.isArray(e):"[object Array]"===g(e)}function n(e){return"boolean"==typeof e}function i(e){return null===e}function o(e){return null==e}function s(e){return"number"==typeof e}function a(e){return"string"==typeof e}function c(e){return"symbol"==typeof e}function f(e){return void 0===e}function u(e){return"[object RegExp]"===g(e)}function h(e){return"object"==typeof e&&null!==e}function l(e){return"[object Date]"===g(e)}function p(e){return"[object Error]"===g(e)||e instanceof Error}function d(e){return"function"==typeof e}function y(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||void 0===e}function g(e){return Object.prototype.toString.call(e)}r.isArray=t,r.isBoolean=n,r.isNull=i,r.isNullOrUndefined=o,r.isNumber=s,r.isString=a,r.isSymbol=c,r.isUndefined=f,r.isRegExp=u,r.isObject=h,r.isDate=l,r.isError=p,r.isFunction=d,r.isPrimitive=y,r.isBuffer=e.isBuffer}).call(this,{isBuffer:e("../../is-buffer/index.js")})},{"../../is-buffer/index.js":107}],85:[function(e,t,r){(function(e){function t(e){if(this.options=e,!e)throw new Error("DBCS codec is called without the data.");if(!e.table)throw new Error("Encoding '"+e.encodingName+"' has no data.");var t=e.table();this.decodeTables=[],this.decodeTables[0]=l.slice(0),this.decodeTableSeq=[];for(var r=0;r<t.length;r++)this._addDecodeChunk(t[r]);this.defaultCharUnicode=e.iconv.defaultCharUnicode,this.encodeTable=[],this.encodeTableSeq=[];var n={};if(e.encodeSkipVals)for(var r=0;r<e.encodeSkipVals.length;r++)for(var i=e.encodeSkipVals[r],o=i.from;o<=i.to;o++)n[o]=!0;if(this._fillEncodeTable(0,0,n),e.encodeAdd)for(var s in e.encodeAdd)Object.prototype.hasOwnProperty.call(e.encodeAdd,s)&&this._setEncodeChar(s.charCodeAt(0),e.encodeAdd[s]);if(this.defCharSB=this.encodeTable[0][e.iconv.defaultCharSingleByte.charCodeAt(0)],this.defCharSB===c&&(this.defCharSB=this.encodeTable[0]["?"]),this.defCharSB===c&&(this.defCharSB="?".charCodeAt(0)),"function"==typeof e.gb18030){this.gb18030=e.gb18030();for(var a=this.decodeTables.length,u=this.decodeTables[a]=l.slice(0),p=this.decodeTables.length,d=this.decodeTables[p]=l.slice(0),r=129;r<=254;r++)for(var y=h-this.decodeTables[0][r],g=this.decodeTables[y],o=48;o<=57;o++)g[o]=h-a;for(var r=129;r<=254;r++)u[r]=h-p;for(var r=48;r<=57;r++)d[r]=f}}function n(t){for(var r=new e(t.length*(this.gb18030?4:3)),n=this.leadSurrogate,i=this.seqObj,o=-1,s=0,f=0;;){if(-1===o){if(s==t.length)break;var h=t.charCodeAt(s++)}else{var h=o;o=-1}if(55296<=h&&h<57344)if(h<56320){if(-1===n){n=h;continue}n=h,h=c}else-1!==n?(h=65536+1024*(n-55296)+(h-56320),n=-1):h=c;else-1!==n&&(o=h,h=c,n=-1);var l=c;if(void 0!==i&&h!=c){var d=i[h];if("object"==typeof d){i=d;continue}"number"==typeof d?l=d:void 0==d&&void 0!==(d=i[p])&&(l=d,o=h),i=void 0}else if(h>=0){var y=this.encodeTable[h>>8];if(void 0!==y&&(l=y[255&h]),l<=u){i=this.encodeTableSeq[u-l];continue}if(l==c&&this.gb18030){var g=a(this.gb18030.uChars,h);if(-1!=g){var l=this.gb18030.gbChars[g]+(h-this.gb18030.uChars[g]);r[f++]=129+Math.floor(l/12600),l%=12600,r[f++]=48+Math.floor(l/1260),l%=1260,r[f++]=129+Math.floor(l/10),l%=10,r[f++]=48+l;continue}}}l===c&&(l=this.defaultCharSingleByte),l<256?r[f++]=l:l<65536?(r[f++]=l>>8,r[f++]=255&l):(r[f++]=l>>16,r[f++]=l>>8&255,r[f++]=255&l)}return this.seqObj=i,this.leadSurrogate=n,r.slice(0,f)}function i(){if(-1!==this.leadSurrogate||void 0!==this.seqObj){var t=new e(10),r=0;if(this.seqObj){var n=this.seqObj[p];void 0!==n&&(n<256?t[r++]=n:(t[r++]=n>>8,t[r++]=255&n)),this.seqObj=void 0}return-1!==this.leadSurrogate&&(t[r++]=this.defaultCharSingleByte,this.leadSurrogate=-1),t.slice(0,r)}}function o(t){var r,n=new e(2*t.length),i=this.nodeIdx,o=this.prevBuf,s=this.prevBuf.length,l=-this.prevBuf.length;s>0&&(o=e.concat([o,t.slice(0,10)]));for(var p=0,d=0;p<t.length;p++){var y=p>=0?t[p]:o[p+s],r=this.decodeTables[i][y];if(r>=0);else if(r===c)p=l,r=this.defaultCharUnicode.charCodeAt(0);else if(r===f){var g=l>=0?t.slice(l,p+1):o.slice(l+s,p+1+s),b=12600*(g[0]-129)+1260*(g[1]-48)+10*(g[2]-129)+(g[3]-48),v=a(this.gb18030.gbChars,b);r=this.gb18030.uChars[v]+b-this.gb18030.gbChars[v]}else{if(r<=h){i=h-r;continue}if(!(r<=u))throw new Error("iconv-lite internal error: invalid decoding table value "+r+" at "+i+"/"+y);for(var _=this.decodeTableSeq[u-r],m=0;m<_.length-1;m++)r=_[m],n[d++]=255&r,n[d++]=r>>8;r=_[_.length-1]}if(r>65535){r-=65536;var w=55296+Math.floor(r/1024);n[d++]=255&w,n[d++]=w>>8,r=56320+r%1024}n[d++]=255&r,n[d++]=r>>8,i=0,l=p+1}return this.nodeIdx=i,this.prevBuf=l>=0?t.slice(l):o.slice(l+s),n.slice(0,d).toString("ucs2")}function s(){for(var t="";this.prevBuf.length>0;){t+=this.defaultCharUnicode;var r=this.prevBuf.slice(1);this.prevBuf=new e(0),this.nodeIdx=0,r.length>0&&(t+=o.call(this,r))}return this.nodeIdx=0,t}function a(e,t){if(e[0]>t)return-1;for(var r=0,n=e.length;r<n-1;){var i=r+Math.floor((n-r+1)/2);e[i]<=t?r=i:n=i}return r}r._dbcs=function(e){return new t(e)};for(var c=-1,f=-2,u=-10,h=-1e3,l=new Array(256),p=-1,d=0;d<256;d++)l[d]=c;t.prototype.encoder=function(e){return{write:n,end:i,leadSurrogate:-1,seqObj:void 0,encodeTable:this.encodeTable,encodeTableSeq:this.encodeTableSeq,defaultCharSingleByte:this.defCharSB,gb18030:this.gb18030,findIdx:a}},t.prototype.decoder=function(t){return{write:o,end:s,nodeIdx:0,prevBuf:new e(0),decodeTables:this.decodeTables,decodeTableSeq:this.decodeTableSeq,defaultCharUnicode:this.defaultCharUnicode,gb18030:this.gb18030}},t.prototype._getDecodeTrieNode=function(e){for(var t=[];e>0;e>>=8)t.push(255&e);0==t.length&&t.push(0);for(var r=this.decodeTables[0],n=t.length-1;n>0;n--){var i=r[t[n]];if(i==c)r[t[n]]=h-this.decodeTables.length,this.decodeTables.push(r=l.slice(0));else{if(!(i<=h))throw new Error("Overwrite byte in "+this.options.encodingName+", addr: "+e.toString(16));r=this.decodeTables[h-i]}}return r},t.prototype._addDecodeChunk=function(e){var t=parseInt(e[0],16),r=this._getDecodeTrieNode(t);t&=255;for(var n=1;n<e.length;n++){var i=e[n];if("string"==typeof i)for(var o=0;o<i.length;){var s=i.charCodeAt(o++);if(55296<=s&&s<56320){var a=i.charCodeAt(o++);if(!(56320<=a&&a<57344))throw new Error("Incorrect surrogate pair in "+this.options.encodingName+" at chunk "+e[0]);r[t++]=65536+1024*(s-55296)+(a-56320)}else if(4080<s&&s<=4095){for(var c=4095-s+2,f=[],h=0;h<c;h++)f.push(i.charCodeAt(o++));r[t++]=u-this.decodeTableSeq.length,this.decodeTableSeq.push(f)}else r[t++]=s}else{if("number"!=typeof i)throw new Error("Incorrect type '"+typeof i+"' given in "+this.options.encodingName+" at chunk "+e[0]);for(var l=r[t-1]+1,o=0;o<i;o++)r[t++]=l++}}if(t>255)throw new Error("Incorrect chunk in "+this.options.encodingName+" at addr "+e[0]+": too long"+t)},t.prototype._getEncodeBucket=function(e){var t=e>>8;return void 0===this.encodeTable[t]&&(this.encodeTable[t]=l.slice(0)),this.encodeTable[t]},t.prototype._setEncodeChar=function(e,t){var r=this._getEncodeBucket(e),n=255&e;r[n]<=u?this.encodeTableSeq[u-r[n]][p]=t:r[n]==c&&(r[n]=t)},t.prototype._setEncodeSequence=function(e,t){var r,n=e[0],i=this._getEncodeBucket(n),o=255&n;i[o]<=u?r=this.encodeTableSeq[u-i[o]]:(r={},i[o]!==c&&(r[p]=i[o]),i[o]=u-this.encodeTableSeq.length,this.encodeTableSeq.push(r));for(var s=1;s<e.length-1;s++){var a=r[n];"object"==typeof a?r=a:(r=r[n]={},void 0!==a&&(r[p]=a))}n=e[e.length-1],r[n]=t},t.prototype._fillEncodeTable=function(e,t,r){for(var n=this.decodeTables[e],i=0;i<256;i++){var o=n[i],s=t+i;r[s]||(o>=0?this._setEncodeChar(o,s):o<=h?this._fillEncodeTable(h-o,s<<8,r):o<=u&&this._setEncodeSequence(this.decodeTableSeq[u-o],s))}}}).call(this,e("buffer").Buffer)},{buffer:66}],86:[function(e,t,r){t.exports={shiftjis:{type:"_dbcs",table:function(){return e("./tables/shiftjis.json")},encodeAdd:{"¥":92,"‾":126},encodeSkipVals:[{from:60736,to:63808}]},csshiftjis:"shiftjis",mskanji:"shiftjis",sjis:"shiftjis",windows31j:"shiftjis",xsjis:"shiftjis",windows932:"shiftjis",932:"shiftjis",cp932:"shiftjis",eucjp:{type:"_dbcs",table:function(){return e("./tables/eucjp.json")},encodeAdd:{"¥":92,"‾":126}},gb2312:"cp936",gb231280:"cp936",gb23121980:"cp936",csgb2312:"cp936",csiso58gb231280:"cp936",euccn:"cp936",isoir58:"gbk",windows936:"cp936",936:"cp936",cp936:{type:"_dbcs",table:function(){return e("./tables/cp936.json")}},gbk:{type:"_dbcs",table:function(){return e("./tables/cp936.json").concat(e("./tables/gbk-added.json"))}},xgbk:"gbk",gb18030:{type:"_dbcs",table:function(){return e("./tables/cp936.json").concat(e("./tables/gbk-added.json"))},gb18030:function(){return e("./tables/gb18030-ranges.json")}},chinese:"gb18030",windows949:"cp949",949:"cp949",cp949:{type:"_dbcs",table:function(){return e("./tables/cp949.json")}},cseuckr:"cp949",csksc56011987:"cp949",euckr:"cp949",isoir149:"cp949",korean:"cp949",ksc56011987:"cp949",ksc56011989:"cp949",ksc5601:"cp949",windows950:"cp950",950:"cp950",cp950:{type:"_dbcs",table:function(){return e("./tables/cp950.json")}},big5:"big5hkscs",big5hkscs:{type:"_dbcs",table:function(){return e("./tables/cp950.json").concat(e("./tables/big5-added.json"))}},cnbig5:"big5hkscs",csbig5:"big5hkscs",xxbig5:"big5hkscs"}},{"./tables/big5-added.json":92,"./tables/cp936.json":93,"./tables/cp949.json":94,"./tables/cp950.json":95,"./tables/eucjp.json":96,"./tables/gb18030-ranges.json":97,"./tables/gbk-added.json":98,"./tables/shiftjis.json":99}],87:[function(e,t,r){for(var n=[e("./internal"),e("./utf16"),e("./utf7"),e("./sbcs-codec"),e("./sbcs-data"),e("./sbcs-data-generated"),e("./dbcs-codec"),e("./dbcs-data")],i=0;i<n.length;i++){var t=n[i];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(r[o]=t[o])}},{"./dbcs-codec":85,"./dbcs-data":86,"./internal":88,"./sbcs-codec":89,"./sbcs-data":91,"./sbcs-data-generated":90,"./utf16":100,"./utf7":101}],88:[function(e,t,r){(function(r){function n(){return new u(this.enc)}function i(){return{write:o,end:function(){},enc:this.enc}}function o(e){return new r(e,this.enc)}function s(){return{write:a,end:c,prevStr:""}}function a(e){e=this.prevStr+e;var t=e.length-e.length%4;return this.prevStr=e.slice(t),e=e.slice(0,t),new r(e,"base64")}function c(){return new r(this.prevStr,"base64")}var f=new r([255,254]);t.exports={utf8:{type:"_internal",enc:"utf8"},cesu8:{type:"_internal",enc:"utf8"},unicode11utf8:{type:"_internal",enc:"utf8"},ucs2:{type:"_internal",enc:"ucs2",bom:f},utf16le:{type:"_internal",enc:"ucs2",bom:f},binary:{type:"_internal",enc:"binary"},base64:{type:"_internal",enc:"base64"},hex:{type:"_internal",enc:"hex"},_internal:function(e){if(!e||!e.enc)throw new Error("Internal codec is called without encoding type.");return{encoder:"base64"==e.enc?s:i,decoder:n,enc:e.enc,bom:e.bom}}};var u=e("string_decoder").StringDecoder;u.prototype.end||(u.prototype.end=function(){})}).call(this,e("buffer").Buffer)},{buffer:66,string_decoder:81}],89:[function(e,t,r){(function(e){function t(e){return{write:n,end:function(){},encodeBuf:this.encodeBuf}}function n(t){for(var r=new e(t.length),n=0;n<t.length;n++)r[n]=this.encodeBuf[t.charCodeAt(n)];return r}function i(e){return{write:o,end:function(){},decodeBuf:this.decodeBuf}}function o(t){for(var r=this.decodeBuf,n=new e(2*t.length),i=0,o=0,s=0,a=t.length;s<a;s++)i=2*t[s],o=2*s,n[o]=r[i],n[o+1]=r[i+1];return n.toString("ucs2")}r._sbcs=function(r){if(!r)throw new Error("SBCS codec is called without the data.");if(!r.chars||128!==r.chars.length&&256!==r.chars.length)throw new Error("Encoding '"+r.type+"' has incorrect 'chars' (must be of len 128 or 256)");if(128===r.chars.length){for(var n="",o=0;o<128;o++)n+=String.fromCharCode(o);r.chars=n+r.chars}var s=new e(r.chars,"ucs2"),a=new e(65536);a.fill(r.iconv.defaultCharSingleByte.charCodeAt(0));for(var o=0;o<r.chars.length;o++)a[r.chars.charCodeAt(o)]=o;return{encoder:t,decoder:i,encodeBuf:a,decodeBuf:s}}}).call(this,e("buffer").Buffer)},{buffer:66}],90:[function(e,t,r){t.exports={437:"cp437",737:"cp737",775:"cp775",850:"cp850",852:"cp852",855:"cp855",856:"cp856",857:"cp857",858:"cp858",860:"cp860",861:"cp861",862:"cp862",863:"cp863",864:"cp864",865:"cp865",866:"cp866",869:"cp869",874:"windows874",922:"cp922",1046:"cp1046",1124:"cp1124",1125:"cp1125",1129:"cp1129",1133:"cp1133",1161:"cp1161",1162:"cp1162",1163:"cp1163",1250:"windows1250",1251:"windows1251",1252:"windows1252",1253:"windows1253",1254:"windows1254",1255:"windows1255",1256:"windows1256",1257:"windows1257",1258:"windows1258",28591:"iso88591",28592:"iso88592",28593:"iso88593",28594:"iso88594",28595:"iso88595",28596:"iso88596",28597:"iso88597",28598:"iso88598",28599:"iso88599",28600:"iso885910",28601:"iso885911",28603:"iso885913",28604:"iso885914",28605:"iso885915",28606:"iso885916",windows874:{type:"_sbcs",chars:"€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"},win874:"windows874",cp874:"windows874",windows1250:{type:"_sbcs",chars:"€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"},win1250:"windows1250",cp1250:"windows1250",windows1251:{type:"_sbcs",chars:"ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"},win1251:"windows1251",cp1251:"windows1251",windows1252:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},win1252:"windows1252",cp1252:"windows1252",windows1253:{type:"_sbcs",chars:"€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"},win1253:"windows1253",cp1253:"windows1253",windows1254:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"},win1254:"windows1254",cp1254:"windows1254",windows1255:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹ�ֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"},win1255:"windows1255",cp1255:"windows1255",windows1256:{type:"_sbcs",chars:"€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے"},win1256:"windows1256",cp1256:"windows1256",windows1257:{type:"_sbcs",chars:"€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙"},win1257:"windows1257",cp1257:"windows1257",windows1258:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"},win1258:"windows1258",cp1258:"windows1258",iso88591:{type:"_sbcs",chars:" ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},cp28591:"iso88591",iso88592:{type:"_sbcs",chars:" Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"},cp28592:"iso88592",iso88593:{type:"_sbcs",chars:" Ħ˘£¤�Ĥ§¨İŞĞĴ­�Ż°ħ²³´µĥ·¸ışğĵ½�żÀÁÂ�ÄĊĈÇÈÉÊËÌÍÎÏ�ÑÒÓÔĠÖ×ĜÙÚÛÜŬŜßàáâ�äċĉçèéêëìíîï�ñòóôġö÷ĝùúûüŭŝ˙"},cp28593:"iso88593",iso88594:{type:"_sbcs",chars:" ĄĸŖ¤ĨĻ§¨ŠĒĢŦ­Ž¯°ą˛ŗ´ĩļˇ¸šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ×ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö÷øųúûüũū˙"},cp28594:"iso88594",iso88595:{type:"_sbcs",chars:" ЁЂЃЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђѓєѕіїјљњћќ§ўџ"},cp28595:"iso88595",iso88596:{type:"_sbcs",chars:" ���¤�������،­�������������؛���؟�ءآأؤإئابةتثجحخدذرزسشصضطظعغ�����ـفقكلمنهوىيًٌٍَُِّْ�������������"},cp28596:"iso88596",iso88597:{type:"_sbcs",chars:" ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"},cp28597:"iso88597",iso88598:{type:"_sbcs",chars:" �¢£¤¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾��������������������������������‗אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"},cp28598:"iso88598",iso88599:{type:"_sbcs",chars:" ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"},cp28599:"iso88599",iso885910:{type:"_sbcs",chars:" ĄĒĢĪĨĶ§ĻĐŠŦŽ­ŪŊ°ąēģīĩķ·ļđšŧž―ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ"},cp28600:"iso885910",iso885911:{type:"_sbcs",chars:" กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"},cp28601:"iso885911",iso885913:{type:"_sbcs",chars:" ”¢£¤„¦§Ø©Ŗ«¬­®Æ°±²³“µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž’"},cp28603:"iso885913",iso885914:{type:"_sbcs",chars:" Ḃḃ£ĊċḊ§Ẁ©ẂḋỲ­®ŸḞḟĠġṀṁ¶ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ"},cp28604:"iso885914",iso885915:{type:"_sbcs",chars:" ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},cp28605:"iso885915",iso885916:{type:"_sbcs",chars:" ĄąŁ€„Š§š©Ș«Ź­źŻ°±ČłŽ”¶·žčș»ŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ"},cp28606:"iso885916",cp437:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm437:"cp437",csibm437:"cp437",cp737:{type:"_sbcs",chars:"ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ "},ibm737:"cp737",csibm737:"cp737",cp775:{type:"_sbcs",chars:"ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ "},ibm775:"cp775",csibm775:"cp775",cp850:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "},ibm850:"cp850",csibm850:"cp850",cp852:{type:"_sbcs",chars:"ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "},ibm852:"cp852",csibm852:"cp852",cp855:{type:"_sbcs",chars:"ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ "},ibm855:"cp855",csibm855:"cp855",cp856:{type:"_sbcs",chars:"אבגדהוזחטיךכלםמןנסעףפץצקרשת�£�×����������®¬½¼�«»░▒▓│┤���©╣║╗╝¢¥┐└┴┬├─┼��╚╔╩╦╠═╬¤���������┘┌█▄¦�▀������µ�������¯´­±‗¾¶§÷¸°¨·¹³²■ "},ibm856:"cp856",csibm856:"cp856",cp857:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ "},ibm857:"cp857",csibm857:"cp857",cp858:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "},ibm858:"cp858",csibm858:"cp858",cp860:{type:"_sbcs",chars:"ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm860:"cp860",csibm860:"cp860",cp861:{type:"_sbcs",chars:"ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm861:"cp861",csibm861:"cp861",cp862:{type:"_sbcs",chars:"אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm862:"cp862",csibm862:"cp862",cp863:{type:"_sbcs",chars:"ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm863:"cp863",csibm863:"cp863",cp864:{type:"_sbcs",chars:"\0\b\t\n\v\f\r !\"#$٪&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�"},ibm864:"cp864",csibm864:"cp864",cp865:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm865:"cp865",csibm865:"cp865",cp866:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ "},ibm866:"cp866",csibm866:"cp866",cp869:{type:"_sbcs",chars:"������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ "},ibm869:"cp869",csibm869:"cp869",cp922:{type:"_sbcs",chars:" ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ"},ibm922:"cp922",csibm922:"cp922",cp1046:{type:"_sbcs",chars:"ﺈ×÷ﹱ■│─┐┌└┘ﹹﹻﹽﹿﹷﺊﻰﻳﻲﻎﻏﻐﻶﻸﻺﻼ ¤ﺋﺑﺗﺛﺟﺣ،­ﺧﺳ٠١٢٣٤٥٦٧٨٩ﺷ؛ﺻﺿﻊ؟ﻋءآأؤإئابةتثجحخدذرزسشصضطﻇعغﻌﺂﺄﺎﻓـفقكلمنهوىيًٌٍَُِّْﻗﻛﻟﻵﻷﻹﻻﻣﻧﻬﻩ�"},ibm1046:"cp1046",csibm1046:"cp1046",cp1124:{type:"_sbcs",chars:" ЁЂҐЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђґєѕіїјљњћќ§ўџ"},ibm1124:"cp1124",csibm1124:"cp1124",cp1125:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ "},ibm1125:"cp1125",csibm1125:"cp1125",cp1129:{type:"_sbcs",chars:" ¡¢£¤¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"},ibm1129:"cp1129",csibm1129:"cp1129",cp1133:{type:"_sbcs",chars:" ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ���ຯະາຳິີຶືຸູຼັົຽ���ເແໂໃໄ່້໊໋໌ໍໆ�ໜໝ₭����������������໐໑໒໓໔໕໖໗໘໙��¢¬¦�"},ibm1133:"cp1133",csibm1133:"cp1133",cp1161:{type:"_sbcs",chars:"��������������������������������่กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู้๊๋€฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛¢¬¦ "},ibm1161:"cp1161",csibm1161:"cp1161",cp1162:{type:"_sbcs",chars:"€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"},ibm1162:"cp1162",csibm1162:"cp1162",cp1163:{type:"_sbcs",chars:" ¡¢£€¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"},ibm1163:"cp1163",csibm1163:"cp1163",maccroatian:{type:"_sbcs",
chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊�©⁄¤‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ"},maccyrillic:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°¢£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµ∂ЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"},macgreek:{type:"_sbcs",chars:"Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦­ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ�"},maciceland:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},macroman:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},macromania:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂŞ∞±≤≥¥µ∂∑∏π∫ªºΩăş¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›Ţţ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},macthai:{type:"_sbcs",chars:"«»…“”�•‘’� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู\ufeff​–—฿เแโใไๅๆ็่้๊๋์ํ™๏๐๑๒๓๔๕๖๗๘๙®©����"},macturkish:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙ�ˆ˜¯˘˙˚¸˝˛ˇ"},macukraine:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"},koi8r:{type:"_sbcs",chars:"─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ё╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡Ё╢╣╤╥╦╧╨╩╪╫╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},koi8u:{type:"_sbcs",chars:"─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґ╝╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪Ґ╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},koi8ru:{type:"_sbcs",chars:"─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґў╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪ҐЎ©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},koi8t:{type:"_sbcs",chars:"қғ‚Ғ„…†‡�‰ҳ‹ҲҷҶ�Қ‘’“”•–—�™�›�����ӯӮё¤ӣ¦§���«¬­®�°±²Ё�Ӣ¶·�№�»���©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},armscii8:{type:"_sbcs",chars:" �և։)(»«—.՝,-֊…՜՛՞ԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ՚�"},rk1048:{type:"_sbcs",chars:"ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"},tcvn:{type:"_sbcs",chars:"\0ÚỤỪỬỮ\b\t\n\v\f\rỨỰỲỶỸÝỴ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ"},georgianacademy:{type:"_sbcs",chars:"‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},georgianps:{type:"_sbcs",chars:"‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზჱთიკლმნჲოპჟრსტჳუფქღყშჩცძწჭხჴჯჰჵæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},pt154:{type:"_sbcs",chars:"ҖҒӮғ„…ҶҮҲүҠӢҢҚҺҸҗ‘’“”•–—ҳҷҡӣңқһҹ ЎўЈӨҘҰ§Ё©Ә«¬ӯ®Ҝ°ұІіҙө¶·ё№ә»јҪҫҝАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"},viscii:{type:"_sbcs",chars:"\0ẲẴẪ\b\t\n\v\f\rỶỸỴ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ẠẮẰẶẤẦẨẬẼẸẾỀỂỄỆỐỒỔỖỘỢỚỜỞỊỎỌỈỦŨỤỲÕắằặấầẩậẽẹếềểễệốồổỗỠƠộờởịỰỨỪỬơớƯÀÁÂÃẢĂẳẵÈÉÊẺÌÍĨỳĐứÒÓÔạỷừửÙÚỹỵÝỡưàáâãảăữẫèéêẻìíĩỉđựòóôõỏọụùúũủýợỮ"},iso646cn:{type:"_sbcs",chars:"\0\b\t\n\v\f\r !\"#¥%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"},iso646jp:{type:"_sbcs",chars:"\0\b\t\n\v\f\r !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[¥]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"},hproman8:{type:"_sbcs",chars:" ÀÂÈÊËÎÏ´ˋˆ¨˜ÙÛ₤¯Ýý°ÇçÑñ¡¿¤£¥§ƒ¢âêôûáéóúàèòùäëöüÅîØÆåíøæÄìÖÜÉïßÔÁÃãÐðÍÌÓÒÕõŠšÚŸÿÞþ·µ¶¾—¼½ªº«■»±�"},macintosh:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},ascii:{type:"_sbcs",chars:"��������������������������������������������������������������������������������������������������������������������������������"},tis620:{type:"_sbcs",chars:"���������������������������������กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"}}},{}],91:[function(e,t,r){t.exports={10029:"maccenteuro",maccenteuro:{type:"_sbcs",chars:"ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ"},808:"cp808",ibm808:"cp808",cp808:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№€■ "},ascii8bit:"ascii",usascii:"ascii",ansix34:"ascii",ansix341968:"ascii",ansix341986:"ascii",csascii:"ascii",cp367:"ascii",ibm367:"ascii",isoir6:"ascii",iso646us:"ascii",iso646irv:"ascii",us:"ascii",latin1:"iso88591",latin2:"iso88592",latin3:"iso88593",latin4:"iso88594",latin5:"iso88599",latin6:"iso885910",latin7:"iso885913",latin8:"iso885914",latin9:"iso885915",latin10:"iso885916",csisolatin1:"iso88591",csisolatin2:"iso88592",csisolatin3:"iso88593",csisolatin4:"iso88594",csisolatincyrillic:"iso88595",csisolatinarabic:"iso88596",csisolatingreek:"iso88597",csisolatinhebrew:"iso88598",csisolatin5:"iso88599",csisolatin6:"iso885910",l1:"iso88591",l2:"iso88592",l3:"iso88593",l4:"iso88594",l5:"iso88599",l6:"iso885910",l7:"iso885913",l8:"iso885914",l9:"iso885915",l10:"iso885916",isoir14:"iso646jp",isoir57:"iso646cn",isoir100:"iso88591",isoir101:"iso88592",isoir109:"iso88593",isoir110:"iso88594",isoir144:"iso88595",isoir127:"iso88596",isoir126:"iso88597",isoir138:"iso88598",isoir148:"iso88599",isoir157:"iso885910",isoir166:"tis620",isoir179:"iso885913",isoir199:"iso885914",isoir203:"iso885915",isoir226:"iso885916",cp819:"iso88591",ibm819:"iso88591",cyrillic:"iso88595",arabic:"iso88596",arabic8:"iso88596",ecma114:"iso88596",asmo708:"iso88596",greek:"iso88597",greek8:"iso88597",ecma118:"iso88597",elot928:"iso88597",hebrew:"iso88598",hebrew8:"iso88598",turkish:"iso88599",turkish8:"iso88599",thai:"iso885911",thai8:"iso885911",celtic:"iso885914",celtic8:"iso885914",isoceltic:"iso885914",tis6200:"tis620",tis62025291:"tis620",tis62025330:"tis620",10000:"macroman",10006:"macgreek",10007:"maccyrillic",10079:"maciceland",10081:"macturkish",cspc8codepage437:"cp437",cspc775baltic:"cp775",cspc850multilingual:"cp850",cspcp852:"cp852",cspc862latinhebrew:"cp862",cpgr:"cp869",msee:"cp1250",mscyrl:"cp1251",msansi:"cp1252",msgreek:"cp1253",msturk:"cp1254",mshebr:"cp1255",msarab:"cp1256",winbaltrim:"cp1257",cp20866:"koi8r",20866:"koi8r",ibm878:"koi8r",cskoi8r:"koi8r",cp21866:"koi8u",21866:"koi8u",ibm1168:"koi8u",strk10482002:"rk1048",tcvn5712:"tcvn",tcvn57121:"tcvn",gb198880:"iso646cn",cn:"iso646cn",csiso14jisc6220ro:"iso646jp",jisc62201969ro:"iso646jp",jp:"iso646jp",cshproman8:"hproman8",r8:"hproman8",roman8:"hproman8",xroman8:"hproman8",ibm1051:"hproman8",mac:"macintosh",csmacintosh:"macintosh"}},{}],92:[function(e,t,r){t.exports=[["8740","䏰䰲䘃䖦䕸𧉧䵷䖳𧲱䳢𧳅㮕䜶䝄䱇䱀𤊿𣘗𧍒𦺋𧃒䱗𪍑䝏䗚䲅𧱬䴇䪤䚡𦬣爥𥩔𡩣𣸆𣽡晍囻"],["8767","綕夝𨮹㷴霴𧯯寛𡵞媤㘥𩺰嫑宷峼杮薓𩥅瑡璝㡵𡵓𣚞𦀡㻬"],["87a1","𥣞㫵竼龗𤅡𨤍𣇪𠪊𣉞䌊蒄龖鐯䤰蘓墖靊鈘秐稲晠権袝瑌篅枂稬剏遆㓦珄𥶹瓆鿇垳䤯呌䄱𣚎堘穲𧭥讏䚮𦺈䆁𥶙箮𢒼鿈𢓁𢓉𢓌鿉蔄𣖻䂴鿊䓡𪷿拁灮鿋"],["8840","㇀",4,"𠄌㇅𠃑𠃍㇆㇇𠃋𡿨㇈𠃊㇉㇊㇋㇌𠄎㇍㇎ĀÁǍÀĒÉĚÈŌÓǑÒ࿿Ê̄Ế࿿Ê̌ỀÊāáǎàɑēéěèīíǐìōóǒòūúǔùǖǘǚ"],["88a1","ǜü࿿ê̄ế࿿ê̌ềêɡ⏚⏛"],["8940","𪎩𡅅"],["8943","攊"],["8946","丽滝鵎釟"],["894c","𧜵撑会伨侨兖兴农凤务动医华发变团声处备夲头学实実岚庆总斉柾栄桥济炼电纤纬纺织经统缆缷艺苏药视设询车轧轮"],["89a1","琑糼緍楆竉刧"],["89ab","醌碸酞肼"],["89b0","贋胶𠧧"],["89b5","肟黇䳍鷉鸌䰾𩷶𧀎鸊𪄳㗁"],["89c1","溚舾甙"],["89c5","䤑马骏龙禇𨑬𡷊𠗐𢫦两亁亀亇亿仫伷㑌侽㹈倃傈㑽㒓㒥円夅凛凼刅争剹劐匧㗇厩㕑厰㕓参吣㕭㕲㚁咓咣咴咹哐哯唘唣唨㖘唿㖥㖿嗗㗅"],["8a40","𧶄唥"],["8a43","𠱂𠴕𥄫喐𢳆㧬𠍁蹆𤶸𩓥䁓𨂾睺𢰸㨴䟕𨅝𦧲𤷪擝𠵼𠾴𠳕𡃴撍蹾𠺖𠰋𠽤𢲩𨉖𤓓"],["8a64","𠵆𩩍𨃩䟴𤺧𢳂骲㩧𩗴㿭㔆𥋇𩟔𧣈𢵄鵮頕"],["8a76","䏙𦂥撴哣𢵌𢯊𡁷㧻𡁯"],["8aa1","𦛚𦜖𧦠擪𥁒𠱃蹨𢆡𨭌𠜱"],["8aac","䠋𠆩㿺塳𢶍"],["8ab2","𤗈𠓼𦂗𠽌𠶖啹䂻䎺"],["8abb","䪴𢩦𡂝膪飵𠶜捹㧾𢝵跀嚡摼㹃"],["8ac9","𪘁𠸉𢫏𢳉"],["8ace","𡃈𣧂㦒㨆𨊛㕸𥹉𢃇噒𠼱𢲲𩜠㒼氽𤸻"],["8adf","𧕴𢺋𢈈𪙛𨳍𠹺𠰴𦠜羓𡃏𢠃𢤹㗻𥇣𠺌𠾍𠺪㾓𠼰𠵇𡅏𠹌"],["8af6","𠺫𠮩𠵈𡃀𡄽㿹𢚖搲𠾭"],["8b40","𣏴𧘹𢯎𠵾𠵿𢱑𢱕㨘𠺘𡃇𠼮𪘲𦭐𨳒𨶙𨳊閪哌苄喹"],["8b55","𩻃鰦骶𧝞𢷮煀腭胬尜𦕲脴㞗卟𨂽醶𠻺𠸏𠹷𠻻㗝𤷫㘉𠳖嚯𢞵𡃉𠸐𠹸𡁸𡅈𨈇𡑕𠹹𤹐𢶤婔𡀝𡀞𡃵𡃶垜𠸑"],["8ba1","𧚔𨋍𠾵𠹻𥅾㜃𠾶𡆀𥋘𪊽𤧚𡠺𤅷𨉼墙剨㘚𥜽箲孨䠀䬬鼧䧧鰟鮍𥭴𣄽嗻㗲嚉丨夂𡯁屮靑𠂆乛亻㔾尣彑忄㣺扌攵歺氵氺灬爫丬犭𤣩罒礻糹罓𦉪㓁"],["8bde","𦍋耂肀𦘒𦥑卝衤见𧢲讠贝钅镸长门𨸏韦页风飞饣𩠐鱼鸟黄歯龜丷𠂇阝户钢"],["8c40","倻淾𩱳龦㷉袏𤅎灷峵䬠𥇍㕙𥴰愢𨨲辧釶熑朙玺𣊁𪄇㲋𡦀䬐磤琂冮𨜏䀉橣𪊺䈣蘏𠩯稪𩥇𨫪靕灍匤𢁾鏴盙𨧣龧矝亣俰傼丯众龨吴綋墒壐𡶶庒庙忂𢜒斋"],["8ca1","𣏹椙橃𣱣泿"],["8ca7","爀𤔅玌㻛𤨓嬕璹讃𥲤𥚕窓篬糃繬苸薗龩袐龪躹龫迏蕟駠鈡龬𨶹𡐿䁱䊢娚"],["8cc9","顨杫䉶圽"],["8cce","藖𤥻芿𧄍䲁𦵴嵻𦬕𦾾龭龮宖龯曧繛湗秊㶈䓃𣉖𢞖䎚䔶"],["8ce6","峕𣬚諹屸㴒𣕑嵸龲煗䕘𤃬𡸣䱷㥸㑊𠆤𦱁諌侴𠈹妿腬顖𩣺弻"],["8d40","𠮟"],["8d42","𢇁𨥭䄂䚻𩁹㼇龳𪆵䃸㟖䛷𦱆䅼𨚲𧏿䕭㣔𥒚䕡䔛䶉䱻䵶䗪㿈𤬏㙡䓞䒽䇭崾嵈嵖㷼㠏嶤嶹㠠㠸幂庽弥徃㤈㤔㤿㥍惗愽峥㦉憷憹懏㦸戬抐拥挘㧸嚱"],["8da1","㨃揢揻搇摚㩋擀崕嘡龟㪗斆㪽旿晓㫲暒㬢朖㭂枤栀㭘桊梄㭲㭱㭻椉楃牜楤榟榅㮼槖㯝橥橴橱檂㯬檙㯲檫檵櫔櫶殁毁毪汵沪㳋洂洆洦涁㳯涤涱渕渘温溆𨧀溻滢滚齿滨滩漤漴㵆𣽁澁澾㵪㵵熷岙㶊瀬㶑灐灔灯灿炉𠌥䏁㗱𠻘"],["8e40","𣻗垾𦻓焾𥟠㙎榢𨯩孴穉𥣡𩓙穥穽𥦬窻窰竂竃燑𦒍䇊竚竝竪䇯咲𥰁笋筕笩𥌎𥳾箢筯莜𥮴𦱿篐萡箒箸𥴠㶭𥱥蒒篺簆簵𥳁籄粃𤢂粦晽𤕸糉糇糦籴糳糵糎"],["8ea1","繧䔝𦹄絝𦻖璍綉綫焵綳緒𤁗𦀩緤㴓緵𡟹緥𨍭縝𦄡𦅚繮纒䌫鑬縧罀罁罇礶𦋐駡羗𦍑羣𡙡𠁨䕜𣝦䔃𨌺翺𦒉者耈耝耨耯𪂇𦳃耻耼聡𢜔䦉𦘦𣷣𦛨朥肧𨩈脇脚墰𢛶汿𦒘𤾸擧𡒊舘𡡞橓𤩥𤪕䑺舩𠬍𦩒𣵾俹𡓽蓢荢𦬊𤦧𣔰𡝳𣷸芪椛芳䇛"],["8f40","蕋苐茚𠸖𡞴㛁𣅽𣕚艻苢茘𣺋𦶣𦬅𦮗𣗎㶿茝嗬莅䔋𦶥莬菁菓㑾𦻔橗蕚㒖𦹂𢻯葘𥯤葱㷓䓤檧葊𣲵祘蒨𦮖𦹷𦹃蓞萏莑䒠蒓蓤𥲑䉀𥳀䕃蔴嫲𦺙䔧蕳䔖枿蘖"],["8fa1","𨘥𨘻藁𧂈蘂𡖂𧃍䕫䕪蘨㙈𡢢号𧎚虾蝱𪃸蟮𢰧螱蟚蠏噡虬桖䘏衅衆𧗠𣶹𧗤衞袜䙛袴袵揁装睷𧜏覇覊覦覩覧覼𨨥觧𧤤𧪽誜瞓釾誐𧩙竩𧬺𣾏䜓𧬸煼謌謟𥐰𥕥謿譌譍誩𤩺讐讛誯𡛟䘕衏貛𧵔𧶏貫㜥𧵓賖𧶘𧶽贒贃𡤐賛灜贑𤳉㻐起"],["9040","趩𨀂𡀔𤦊㭼𨆼𧄌竧躭躶軃鋔輙輭𨍥𨐒辥錃𪊟𠩐辳䤪𨧞𨔽𣶻廸𣉢迹𪀔𨚼𨔁𢌥㦀𦻗逷𨔼𧪾遡𨕬𨘋邨𨜓郄𨛦邮都酧㫰醩釄粬𨤳𡺉鈎沟鉁鉢𥖹銹𨫆𣲛𨬌𥗛"],["90a1","𠴱錬鍫𨫡𨯫炏嫃𨫢𨫥䥥鉄𨯬𨰹𨯿鍳鑛躼閅閦鐦閠濶䊹𢙺𨛘𡉼𣸮䧟氜陻隖䅬隣𦻕懚隶磵𨫠隽双䦡𦲸𠉴𦐐𩂯𩃥𤫑𡤕𣌊霱虂霶䨏䔽䖅𤫩灵孁霛靜𩇕靗孊𩇫靟鐥僐𣂷𣂼鞉鞟鞱鞾韀韒韠𥑬韮琜𩐳響韵𩐝𧥺䫑頴頳顋顦㬎𧅵㵑𠘰𤅜"],["9140","𥜆飊颷飈飇䫿𦴧𡛓喰飡飦飬鍸餹𤨩䭲𩡗𩤅駵騌騻騐驘𥜥㛄𩂱𩯕髠髢𩬅髴䰎鬔鬭𨘀倴鬴𦦨㣃𣁽魐魀𩴾婅𡡣鮎𤉋鰂鯿鰌𩹨鷔𩾷𪆒𪆫𪃡𪄣𪇟鵾鶃𪄴鸎梈"],["91a1","鷄𢅛𪆓𪈠𡤻𪈳鴹𪂹𪊴麐麕麞麢䴴麪麯𤍤黁㭠㧥㴝伲㞾𨰫鼂鼈䮖鐤𦶢鼗鼖鼹嚟嚊齅馸𩂋韲葿齢齩竜龎爖䮾𤥵𤦻煷𤧸𤍈𤩑玞𨯚𡣺禟𨥾𨸶鍩鏳𨩄鋬鎁鏋𨥬𤒹爗㻫睲穃烐𤑳𤏸煾𡟯炣𡢾𣖙㻇𡢅𥐯𡟸㜢𡛻𡠹㛡𡝴𡣑𥽋㜣𡛀坛𤨥𡏾𡊨"],["9240","𡏆𡒶蔃𣚦蔃葕𤦔𧅥𣸱𥕜𣻻𧁒䓴𣛮𩦝𦼦柹㜳㰕㷧塬𡤢栐䁗𣜿𤃡𤂋𤄏𦰡哋嚞𦚱嚒𠿟𠮨𠸍鏆𨬓鎜仸儫㠙𤐶亼𠑥𠍿佋侊𥙑婨𠆫𠏋㦙𠌊𠐔㐵伩𠋀𨺳𠉵諚𠈌亘"],["92a1","働儍侢伃𤨎𣺊佂倮偬傁俌俥偘僼兙兛兝兞湶𣖕𣸹𣺿浲𡢄𣺉冨凃𠗠䓝𠒣𠒒𠒑赺𨪜𠜎剙劤𠡳勡鍮䙺熌𤎌𠰠𤦬𡃤槑𠸝瑹㻞璙琔瑖玘䮎𤪼𤂍叐㖄爏𤃉喴𠍅响𠯆圝鉝雴鍦埝垍坿㘾壋媙𨩆𡛺𡝯𡜐娬妸銏婾嫏娒𥥆𡧳𡡡𤊕㛵洅瑃娡𥺃"],["9340","媁𨯗𠐓鏠璌𡌃焅䥲鐈𨧻鎽㞠尞岞幞幈𡦖𡥼𣫮廍孏𡤃𡤄㜁𡢠㛝𡛾㛓脪𨩇𡶺𣑲𨦨弌弎𡤧𡞫婫𡜻孄蘔𧗽衠恾𢡠𢘫忛㺸𢖯𢖾𩂈𦽳懀𠀾𠁆𢘛憙憘恵𢲛𢴇𤛔𩅍"],["93a1","摱𤙥𢭪㨩𢬢𣑐𩣪𢹸挷𪑛撶挱揑𤧣𢵧护𢲡搻敫楲㯴𣂎𣊭𤦉𣊫唍𣋠𡣙𩐿曎𣊉𣆳㫠䆐𥖄𨬢𥖏𡛼𥕛𥐥磮𣄃𡠪𣈴㑤𣈏𣆂𤋉暎𦴤晫䮓昰𧡰𡷫晣𣋒𣋡昞𥡲㣑𣠺𣞼㮙𣞢𣏾瓐㮖枏𤘪梶栞㯄檾㡣𣟕𤒇樳橒櫉欅𡤒攑梘橌㯗橺歗𣿀𣲚鎠鋲𨯪𨫋"],["9440","銉𨀞𨧜鑧涥漋𤧬浧𣽿㶏渄𤀼娽渊塇洤硂焻𤌚𤉶烱牐犇犔𤞏𤜥兹𤪤𠗫瑺𣻸𣙟𤩊𤤗𥿡㼆㺱𤫟𨰣𣼵悧㻳瓌琼鎇琷䒟𦷪䕑疃㽣𤳙𤴆㽘畕癳𪗆㬙瑨𨫌𤦫𤦎㫻"],["94a1","㷍𤩎㻿𤧅𤣳釺圲鍂𨫣𡡤僟𥈡𥇧睸𣈲眎眏睻𤚗𣞁㩞𤣰琸璛㺿𤪺𤫇䃈𤪖𦆮錇𥖁砞碍碈磒珐祙𧝁𥛣䄎禛蒖禥樭𣻺稺秴䅮𡛦䄲鈵秱𠵌𤦌𠊙𣶺𡝮㖗啫㕰㚪𠇔𠰍竢婙𢛵𥪯𥪜娍𠉛磰娪𥯆竾䇹籝籭䈑𥮳𥺼𥺦糍𤧹𡞰粎籼粮檲緜縇緓罎𦉡"],["9540","𦅜𧭈綗𥺂䉪𦭵𠤖柖𠁎𣗏埄𦐒𦏸𤥢翝笧𠠬𥫩𥵃笌𥸎駦虅驣樜𣐿㧢𤧷𦖭騟𦖠蒀𧄧𦳑䓪脷䐂胆脉腂𦞴飃𦩂艢艥𦩑葓𦶧蘐𧈛媆䅿𡡀嬫𡢡嫤𡣘蚠蜨𣶏蠭𧐢娂"],["95a1","衮佅袇袿裦襥襍𥚃襔𧞅𧞄𨯵𨯙𨮜𨧹㺭蒣䛵䛏㟲訽訜𩑈彍鈫𤊄旔焩烄𡡅鵭貟賩𧷜妚矃姰䍮㛔踪躧𤰉輰轊䋴汘澻𢌡䢛潹溋𡟚鯩㚵𤤯邻邗啱䤆醻鐄𨩋䁢𨫼鐧𨰝𨰻蓥訫閙閧閗閖𨴴瑅㻂𤣿𤩂𤏪㻧𣈥随𨻧𨹦𨹥㻌𤧭𤩸𣿮琒瑫㻼靁𩂰"],["9640","桇䨝𩂓𥟟靝鍨𨦉𨰦𨬯𦎾銺嬑譩䤼珹𤈛鞛靱餸𠼦巁𨯅𤪲頟𩓚鋶𩗗釥䓀𨭐𤩧𨭤飜𨩅㼀鈪䤥萔餻饍𧬆㷽馛䭯馪驜𨭥𥣈檏騡嫾騯𩣱䮐𩥈馼䮽䮗鍽塲𡌂堢𤦸"],["96a1","𡓨硄𢜟𣶸棅㵽鑘㤧慐𢞁𢥫愇鱏鱓鱻鰵鰐魿鯏𩸭鮟𪇵𪃾鴡䲮𤄄鸘䲰鴌𪆴𪃭𪃳𩤯鶥蒽𦸒𦿟𦮂藼䔳𦶤𦺄𦷰萠藮𦸀𣟗𦁤秢𣖜𣙀䤭𤧞㵢鏛銾鍈𠊿碹鉷鑍俤㑀遤𥕝砽硔碶硋𡝗𣇉𤥁㚚佲濚濙瀞瀞吔𤆵垻壳垊鴖埗焴㒯𤆬燫𦱀𤾗嬨𡞵𨩉"],["9740","愌嫎娋䊼𤒈㜬䭻𨧼鎻鎸𡣖𠼝葲𦳀𡐓𤋺𢰦𤏁妔𣶷𦝁綨𦅛𦂤𤦹𤦋𨧺鋥珢㻩璴𨭣𡢟㻡𤪳櫘珳珻㻖𤨾𤪔𡟙𤩦𠎧𡐤𤧥瑈𤤖炥𤥶銄珦鍟𠓾錱𨫎𨨖鎆𨯧𥗕䤵𨪂煫"],["97a1","𤥃𠳿嚤𠘚𠯫𠲸唂秄𡟺緾𡛂𤩐𡡒䔮鐁㜊𨫀𤦭妰𡢿𡢃𧒄媡㛢𣵛㚰鉟婹𨪁𡡢鍴㳍𠪴䪖㦊僴㵩㵌𡎜煵䋻𨈘渏𩃤䓫浗𧹏灧沯㳖𣿭𣸭渂漌㵯𠏵畑㚼㓈䚀㻚䡱姄鉮䤾轁𨰜𦯀堒埈㛖𡑒烾𤍢𤩱𢿣𡊰𢎽梹楧𡎘𣓥𧯴𣛟𨪃𣟖𣏺𤲟樚𣚭𦲷萾䓟䓎"],["9840","𦴦𦵑𦲂𦿞漗𧄉茽𡜺菭𦲀𧁓𡟛妉媂𡞳婡婱𡤅𤇼㜭姯𡜼㛇熎鎐暚𤊥婮娫𤊓樫𣻹𧜶𤑛𤋊焝𤉙𨧡侰𦴨峂𤓎𧹍𤎽樌𤉖𡌄炦焳𤏩㶥泟勇𤩏繥姫崯㷳彜𤩝𡟟綤萦"],["98a1","咅𣫺𣌀𠈔坾𠣕𠘙㿥𡾞𪊶瀃𩅛嵰玏糓𨩙𩐠俈翧狍猐𧫴猸猹𥛶獁獈㺩𧬘遬燵𤣲珡臶㻊県㻑沢国琙琞琟㻢㻰㻴㻺瓓㼎㽓畂畭畲疍㽼痈痜㿀癍㿗癴㿜発𤽜熈嘣覀塩䀝睃䀹条䁅㗛瞘䁪䁯属瞾矋売砘点砜䂨砹硇硑硦葈𥔵礳栃礲䄃"],["9940","䄉禑禙辻稆込䅧窑䆲窼艹䇄竏竛䇏両筢筬筻簒簛䉠䉺类粜䊌粸䊔糭输烀𠳏総緔緐緽羮羴犟䎗耠耥笹耮耱联㷌垴炠肷胩䏭脌猪脎脒畠脔䐁㬹腖腙腚"],["99a1","䐓堺腼膄䐥膓䐭膥埯臁臤艔䒏芦艶苊苘苿䒰荗险榊萅烵葤惣蒈䔄蒾蓡蓸蔐蔸蕒䔻蕯蕰藠䕷虲蚒蚲蛯际螋䘆䘗袮裿褤襇覑𧥧訩訸誔誴豑賔賲贜䞘塟跃䟭仮踺嗘坔蹱嗵躰䠷軎転軤軭軲辷迁迊迌逳駄䢭飠鈓䤞鈨鉘鉫銱銮銿"],["9a40","鋣鋫鋳鋴鋽鍃鎄鎭䥅䥑麿鐗匁鐝鐭鐾䥪鑔鑹锭関䦧间阳䧥枠䨤靀䨵鞲韂噔䫤惨颹䬙飱塄餎餙冴餜餷饂饝饢䭰駅䮝騼鬏窃魩鮁鯝鯱鯴䱭鰠㝯𡯂鵉鰺"],["9aa1","黾噐鶓鶽鷀鷼银辶鹻麬麱麽黆铜黢黱黸竈齄𠂔𠊷𠎠椚铃妬𠓗塀铁㞹𠗕𠘕𠙶𡚺块煳𠫂𠫍𠮿呪吆𠯋咞𠯻𠰻𠱓𠱥𠱼惧𠲍噺𠲵𠳝𠳭𠵯𠶲𠷈楕鰯螥𠸄𠸎𠻗𠾐𠼭𠹳尠𠾼帋𡁜𡁏𡁶朞𡁻𡂈𡂖㙇𡂿𡃓𡄯𡄻卤蒭𡋣𡍵𡌶讁𡕷𡘙𡟃𡟇乸炻𡠭𡥪"],["9b40","𡨭𡩅𡰪𡱰𡲬𡻈拃𡻕𡼕熘桕𢁅槩㛈𢉼𢏗𢏺𢜪𢡱𢥏苽𢥧𢦓𢫕覥𢫨辠𢬎鞸𢬿顇骽𢱌"],["9b62","𢲈𢲷𥯨𢴈𢴒𢶷𢶕𢹂𢽴𢿌𣀳𣁦𣌟𣏞徱晈暿𧩹𣕧𣗳爁𤦺矗𣘚𣜖纇𠍆墵朎"],["9ba1","椘𣪧𧙗𥿢𣸑𣺹𧗾𢂚䣐䪸𤄙𨪚𤋮𤌍𤀻𤌴𤎖𤩅𠗊凒𠘑妟𡺨㮾𣳿𤐄𤓖垈𤙴㦛𤜯𨗨𩧉㝢𢇃譞𨭎駖𤠒𤣻𤨕爉𤫀𠱸奥𤺥𤾆𠝹軚𥀬劏圿煱𥊙𥐙𣽊𤪧喼𥑆𥑮𦭒釔㑳𥔿𧘲𥕞䜘𥕢𥕦𥟇𤤿𥡝偦㓻𣏌惞𥤃䝼𨥈𥪮𥮉𥰆𡶐垡煑澶𦄂𧰒遖𦆲𤾚譢𦐂𦑊"],["9c40","嵛𦯷輶𦒄𡤜諪𤧶𦒈𣿯𦔒䯀𦖿𦚵𢜛鑥𥟡憕娧晉侻嚹𤔡𦛼乪𤤴陖涏𦲽㘘襷𦞙𦡮𦐑𦡞營𦣇筂𩃀𠨑𦤦鄄𦤹穅鷰𦧺騦𦨭㙟𦑩𠀡禃𦨴𦭛崬𣔙菏𦮝䛐𦲤画补𦶮墶"],["9ca1","㜜𢖍𧁋𧇍㱔𧊀𧊅銁𢅺𧊋錰𧋦𤧐氹钟𧑐𠻸蠧裵𢤦𨑳𡞱溸𤨪𡠠㦤㚹尐秣䔿暶𩲭𩢤襃𧟌𧡘囖䃟𡘊㦡𣜯𨃨𡏅熭荦𧧝𩆨婧䲷𧂯𨦫𧧽𧨊𧬋𧵦𤅺筃祾𨀉澵𪋟樃𨌘厢𦸇鎿栶靝𨅯𨀣𦦵𡏭𣈯𨁈嶅𨰰𨂃圕頣𨥉嶫𤦈斾槕叒𤪥𣾁㰑朶𨂐𨃴𨄮𡾡𨅏"],["9d40","𨆉𨆯𨈚𨌆𨌯𨎊㗊𨑨𨚪䣺揦𨥖砈鉕𨦸䏲𨧧䏟𨧨𨭆𨯔姸𨰉輋𨿅𩃬筑𩄐𩄼㷷𩅞𤫊运犏嚋𩓧𩗩𩖰𩖸𩜲𩣑𩥉𩥪𩧃𩨨𩬎𩵚𩶛纟𩻸𩼣䲤镇𪊓熢𪋿䶑递𪗋䶜𠲜达嗁"],["9da1","辺𢒰边𤪓䔉繿潖檱仪㓤𨬬𧢝㜺躀𡟵𨀤𨭬𨮙𧨾𦚯㷫𧙕𣲷𥘵𥥖亚𥺁𦉘嚿𠹭踎孭𣺈𤲞揞拐𡟶𡡻攰嘭𥱊吚𥌑㷆𩶘䱽嘢嘞罉𥻘奵𣵀蝰东𠿪𠵉𣚺脗鵞贘瘻鱅癎瞹鍅吲腈苷嘥脲萘肽嗪祢噃吖𠺝㗎嘅嗱曱𨋢㘭甴嗰喺咗啲𠱁𠲖廐𥅈𠹶𢱢"],["9e40","𠺢麫絚嗞𡁵抝靭咔賍燶酶揼掹揾啩𢭃鱲𢺳冚㓟𠶧冧呍唞唓癦踭𦢊疱肶蠄螆裇膶萜𡃁䓬猄𤜆宐茋𦢓噻𢛴𧴯𤆣𧵳𦻐𧊶酰𡇙鈈𣳼𪚩𠺬𠻹牦𡲢䝎𤿂𧿹𠿫䃺"],["9ea1","鱝攟𢶠䣳𤟠𩵼𠿬𠸊恢𧖣𠿭"],["9ead","𦁈𡆇熣纎鵐业丄㕷嬍沲卧㚬㧜卽㚥𤘘墚𤭮舭呋垪𥪕𠥹"],["9ec5","㩒𢑥獴𩺬䴉鯭𣳾𩼰䱛𤾩𩖞𩿞葜𣶶𧊲𦞳𣜠挮紥𣻷𣸬㨪逈勌㹴㙺䗩𠒎癀嫰𠺶硺𧼮墧䂿噼鮋嵴癔𪐴麅䳡痹㟻愙𣃚𤏲"],["9ef5","噝𡊩垧𤥣𩸆刴𧂮㖭汊鵼"],["9f40","籖鬹埞𡝬屓擓𩓐𦌵𧅤蚭𠴨𦴢𤫢𠵱"],["9f4f","凾𡼏嶎霃𡷑麁遌笟鬂峑箣扨挵髿篏鬪籾鬮籂粆鰕篼鬉鼗鰛𤤾齚啳寃俽麘俲剠㸆勑坧偖妷帒韈鶫轜呩鞴饀鞺匬愰"],["9fa1","椬叚鰊鴂䰻陁榀傦畆𡝭駚剳"],["9fae","酙隁酜"],["9fb2","酑𨺗捿𦴣櫊嘑醎畺抅𠏼獏籰𥰡𣳽"],["9fc1","𤤙盖鮝个𠳔莾衂"],["9fc9","届槀僭坺刟巵从氱𠇲伹咜哚劚趂㗾弌㗳"],["9fdb","歒酼龥鮗頮颴骺麨麄煺笔"],["9fe7","毺蠘罸"],["9feb","嘠𪙊蹷齓"],["9ff0","跔蹏鸜踁抂𨍽踨蹵竓𤩷稾磘泪詧瘇"],["a040","𨩚鼦泎蟖痃𪊲硓咢贌狢獱謭猂瓱賫𤪻蘯徺袠䒷"],["a055","𡠻𦸅"],["a058","詾𢔛"],["a05b","惽癧髗鵄鍮鮏蟵"],["a063","蠏賷猬霡鮰㗖犲䰇籑饊𦅙慙䰄麖慽"],["a073","坟慯抦戹拎㩜懢厪𣏵捤栂㗒"],["a0a1","嵗𨯂迚𨸹"],["a0a6","僙𡵆礆匲阸𠼻䁥"],["a0ae","矾"],["a0b0","糂𥼚糚稭聦聣絍甅瓲覔舚朌聢𧒆聛瓰脃眤覉𦟌畓𦻑螩蟎臈螌詉貭譃眫瓸蓚㘵榲趦"],["a0d4","覩瑨涹蟁𤀑瓧㷛煶悤憜㳑煢恷"],["a0e2","罱𨬭牐惩䭾删㰘𣳇𥻗𧙖𥔱𡥄𡋾𩤃𦷜𧂭峁𦆭𨨏𣙷𠃮𦡆𤼎䕢嬟𦍌齐麦𦉫"],["a3c0","␀",31,"␡"],["c6a1","①",9,"⑴",9,"ⅰ",9,"丶丿亅亠冂冖冫勹匸卩厶夊宀巛⼳广廴彐彡攴无疒癶辵隶¨ˆヽヾゝゞ〃仝々〆〇ー［］✽ぁ",23],["c740","す",58,"ァアィイ"],["c7a1","ゥ",81,"А",5,"ЁЖ",4],["c840","Л",26,"ёж",25,"⇧↸↹㇏𠃌乚𠂊刂䒑"],["c8a1","龰冈龱𧘇"],["c8cd","￢￤＇＂㈱№℡゛゜⺀⺄⺆⺇⺈⺊⺌⺍⺕⺜⺝⺥⺧⺪⺬⺮⺶⺼⺾⻆⻊⻌⻍⻏⻖⻗⻞⻣"],["c8f5","ʃɐɛɔɵœøŋʊɪ"],["f9fe","￭"],["fa40","𠕇鋛𠗟𣿅蕌䊵珯况㙉𤥂𨧤鍄𡧛苮𣳈砼杄拟𤤳𨦪𠊠𦮳𡌅侫𢓭倈𦴩𧪄𣘀𤪱𢔓倩𠍾徤𠎀𠍇滛𠐟偽儁㑺儎顬㝃萖𤦤𠒇兠𣎴兪𠯿𢃼𠋥𢔰𠖎𣈳𡦃宂蝽𠖳𣲙冲冸"],["faa1","鴴凉减凑㳜凓𤪦决凢卂凭菍椾𣜭彻刋刦刼劵剗劔効勅簕蕂勠蘍𦬓包𨫞啉滙𣾀𠥔𣿬匳卄𠯢泋𡜦栛珕恊㺪㣌𡛨燝䒢卭却𨚫卾卿𡖖𡘓矦厓𨪛厠厫厮玧𥝲㽙玜叁叅汉义埾叙㪫𠮏叠𣿫𢶣叶𠱷吓灹唫晗浛呭𦭓𠵴啝咏咤䞦𡜍𠻝㶴𠵍"],["fb40","𨦼𢚘啇䳭启琗喆喩嘅𡣗𤀺䕒𤐵暳𡂴嘷曍𣊊暤暭噍噏磱囱鞇叾圀囯园𨭦㘣𡉏坆𤆥汮炋坂㚱𦱾埦𡐖堃𡑔𤍣堦𤯵塜墪㕡壠壜𡈼壻寿坃𪅐𤉸鏓㖡够梦㛃湙"],["fba1","𡘾娤啓𡚒蔅姉𠵎𦲁𦴪𡟜姙𡟻𡞲𦶦浱𡠨𡛕姹𦹅媫婣㛦𤦩婷㜈媖瑥嫓𦾡𢕔㶅𡤑㜲𡚸広勐孶斈孼𧨎䀄䡝𠈄寕慠𡨴𥧌𠖥寳宝䴐尅𡭄尓珎尔𡲥𦬨屉䣝岅峩峯嶋𡷹𡸷崐崘嵆𡺤岺巗苼㠭𤤁𢁉𢅳芇㠶㯂帮檊幵幺𤒼𠳓厦亷廐厨𡝱帉廴𨒂"],["fc40","廹廻㢠廼栾鐛弍𠇁弢㫞䢮𡌺强𦢈𢏐彘𢑱彣鞽𦹮彲鍀𨨶徧嶶㵟𥉐𡽪𧃸𢙨釖𠊞𨨩怱暅𡡷㥣㷇㘹垐𢞴祱㹀悞悤悳𤦂𤦏𧩓璤僡媠慤萤慂慈𦻒憁凴𠙖憇宪𣾷"],["fca1","𢡟懓𨮝𩥝懐㤲𢦀𢣁怣慜攞掋𠄘担𡝰拕𢸍捬𤧟㨗搸揸𡎎𡟼撐澊𢸶頔𤂌𥜝擡擥鑻㩦携㩗敍漖𤨨𤨣斅敭敟𣁾斵𤥀䬷旑䃘𡠩无旣忟𣐀昘𣇷𣇸晄𣆤𣆥晋𠹵晧𥇦晳晴𡸽𣈱𨗴𣇈𥌓矅𢣷馤朂𤎜𤨡㬫槺𣟂杞杧杢𤇍𩃭柗䓩栢湐鈼栁𣏦𦶠桝"],["fd40","𣑯槡樋𨫟楳棃𣗍椁椀㴲㨁𣘼㮀枬楡𨩊䋼椶榘㮡𠏉荣傐槹𣙙𢄪橅𣜃檝㯳枱櫈𩆜㰍欝𠤣惞欵歴𢟍溵𣫛𠎵𡥘㝀吡𣭚毡𣻼毜氷𢒋𤣱𦭑汚舦汹𣶼䓅𣶽𤆤𤤌𤤀"],["fda1","𣳉㛥㳫𠴲鮃𣇹𢒑羏样𦴥𦶡𦷫涖浜湼漄𤥿𤂅𦹲蔳𦽴凇沜渝萮𨬡港𣸯瑓𣾂秌湏媑𣁋濸㜍澝𣸰滺𡒗𤀽䕕鏰潄潜㵎潴𩅰㴻澟𤅄濓𤂑𤅕𤀹𣿰𣾴𤄿凟𤅖𤅗𤅀𦇝灋灾炧炁烌烕烖烟䄄㷨熴熖𤉷焫煅媈煊煮岜𤍥煏鍢𤋁焬𤑚𤨧𤨢熺𨯨炽爎"],["fe40","鑂爕夑鑃爤鍁𥘅爮牀𤥴梽牕牗㹕𣁄栍漽犂猪猫𤠣𨠫䣭𨠄猨献珏玪𠰺𦨮珉瑉𤇢𡛧𤨤昣㛅𤦷𤦍𤧻珷琕椃𤨦琹𠗃㻗瑜𢢭瑠𨺲瑇珤瑶莹瑬㜰瑴鏱樬璂䥓𤪌"],["fea1","𤅟𤩹𨮏孆𨰃𡢞瓈𡦈甎瓩甞𨻙𡩋寗𨺬鎅畍畊畧畮𤾂㼄𤴓疎瑝疞疴瘂瘬癑癏癯癶𦏵皐臯㟸𦤑𦤎皡皥皷盌𦾟葢𥂝𥅽𡸜眞眦着撯𥈠睘𣊬瞯𨥤𨥨𡛁矴砉𡍶𤨒棊碯磇磓隥礮𥗠磗礴碱𧘌辸袄𨬫𦂃𢘜禆褀椂禀𥡗禝𧬹礼禩渪𧄦㺨秆𩄍秔"]]},{}],93:[function(e,t,r){
t.exports=[["0","\0",127,"€"],["8140","丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪",5,"乲乴",9,"乿",6,"亇亊"],["8180","亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂",6,"伋伌伒",4,"伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾",4,"佄佅佇",5,"佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢"],["8240","侤侫侭侰",4,"侶",8,"俀俁係俆俇俈俉俋俌俍俒",4,"俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿",11],["8280","個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯",10,"倻倽倿偀偁偂偄偅偆偉偊偋偍偐",4,"偖偗偘偙偛偝",7,"偦",5,"偭",8,"偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎",20,"傤傦傪傫傭",4,"傳",6,"傼"],["8340","傽",17,"僐",5,"僗僘僙僛",10,"僨僩僪僫僯僰僱僲僴僶",4,"僼",9,"儈"],["8380","儉儊儌",5,"儓",13,"儢",28,"兂兇兊兌兎兏児兒兓兗兘兙兛兝",4,"兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦",4,"冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒",5],["8440","凘凙凚凜凞凟凢凣凥",5,"凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄",5,"剋剎剏剒剓剕剗剘"],["8480","剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳",9,"剾劀劃",4,"劉",6,"劑劒劔",6,"劜劤劥劦劧劮劯劰労",9,"勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務",5,"勠勡勢勣勥",10,"勱",7,"勻勼勽匁匂匃匄匇匉匊匋匌匎"],["8540","匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯",9,"匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏"],["8580","厐",4,"厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯",6,"厷厸厹厺厼厽厾叀參",4,"収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝",4,"呣呥呧呩",7,"呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡"],["8640","咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠",4,"哫哬哯哰哱哴",5,"哻哾唀唂唃唄唅唈唊",4,"唒唓唕",5,"唜唝唞唟唡唥唦"],["8680","唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋",4,"啑啒啓啔啗",4,"啝啞啟啠啢啣啨啩啫啯",5,"啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠",6,"喨",8,"喲喴営喸喺喼喿",4,"嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗",4,"嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸",4,"嗿嘂嘃嘄嘅"],["8740","嘆嘇嘊嘋嘍嘐",7,"嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀",11,"噏",4,"噕噖噚噛噝",4],["8780","噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽",7,"嚇",6,"嚐嚑嚒嚔",14,"嚤",10,"嚰",6,"嚸嚹嚺嚻嚽",12,"囋",8,"囕囖囘囙囜団囥",5,"囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國",6],["8840","園",9,"圝圞圠圡圢圤圥圦圧圫圱圲圴",4,"圼圽圿坁坃坄坅坆坈坉坋坒",4,"坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀"],["8880","垁垇垈垉垊垍",4,"垔",6,"垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹",8,"埄",6,"埌埍埐埑埓埖埗埛埜埞埡埢埣埥",7,"埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥",4,"堫",4,"報堲堳場堶",7],["8940","堾",5,"塅",6,"塎塏塐塒塓塕塖塗塙",4,"塟",5,"塦",4,"塭",16,"塿墂墄墆墇墈墊墋墌"],["8980","墍",4,"墔",4,"墛墜墝墠",7,"墪",17,"墽墾墿壀壂壃壄壆",10,"壒壓壔壖",13,"壥",5,"壭壯壱売壴壵壷壸壺",7,"夃夅夆夈",4,"夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻"],["8a40","夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛",4,"奡奣奤奦",12,"奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦"],["8a80","妧妬妭妰妱妳",5,"妺妼妽妿",6,"姇姈姉姌姍姎姏姕姖姙姛姞",4,"姤姦姧姩姪姫姭",11,"姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪",6,"娳娵娷",4,"娽娾娿婁",4,"婇婈婋",9,"婖婗婘婙婛",5],["8b40","婡婣婤婥婦婨婩婫",8,"婸婹婻婼婽婾媀",17,"媓",6,"媜",13,"媫媬"],["8b80","媭",4,"媴媶媷媹",4,"媿嫀嫃",5,"嫊嫋嫍",4,"嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬",4,"嫲",22,"嬊",11,"嬘",25,"嬳嬵嬶嬸",7,"孁",6],["8c40","孈",7,"孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏"],["8c80","寑寔",8,"寠寢寣實寧審",4,"寯寱",6,"寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧",6,"屰屲",6,"屻屼屽屾岀岃",4,"岉岊岋岎岏岒岓岕岝",4,"岤",4],["8d40","岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅",5,"峌",5,"峓",5,"峚",6,"峢峣峧峩峫峬峮峯峱",9,"峼",4],["8d80","崁崄崅崈",5,"崏",4,"崕崗崘崙崚崜崝崟",4,"崥崨崪崫崬崯",4,"崵",7,"崿",7,"嵈嵉嵍",10,"嵙嵚嵜嵞",10,"嵪嵭嵮嵰嵱嵲嵳嵵",12,"嶃",21,"嶚嶛嶜嶞嶟嶠"],["8e40","嶡",21,"嶸",12,"巆",6,"巎",12,"巜巟巠巣巤巪巬巭"],["8e80","巰巵巶巸",4,"巿帀帄帇帉帊帋帍帎帒帓帗帞",7,"帨",4,"帯帰帲",4,"帹帺帾帿幀幁幃幆",5,"幍",6,"幖",4,"幜幝幟幠幣",14,"幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨",4,"庮",4,"庴庺庻庼庽庿",6],["8f40","廆廇廈廋",5,"廔廕廗廘廙廚廜",11,"廩廫",8,"廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤"],["8f80","弨弫弬弮弰弲",6,"弻弽弾弿彁",14,"彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢",5,"復徫徬徯",5,"徶徸徹徺徻徾",4,"忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇"],["9040","怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰",4,"怶",4,"怽怾恀恄",6,"恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀"],["9080","悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽",7,"惇惈惉惌",4,"惒惓惔惖惗惙惛惞惡",4,"惪惱惲惵惷惸惻",4,"愂愃愄愅愇愊愋愌愐",4,"愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬",18,"慀",6],["9140","慇慉態慍慏慐慒慓慔慖",6,"慞慟慠慡慣慤慥慦慩",6,"慱慲慳慴慶慸",18,"憌憍憏",4,"憕"],["9180","憖",6,"憞",8,"憪憫憭",9,"憸",5,"憿懀懁懃",4,"應懌",4,"懓懕",16,"懧",13,"懶",8,"戀",5,"戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸",4,"扂扄扅扆扊"],["9240","扏扐払扖扗扙扚扜",6,"扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋",5,"抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁"],["9280","拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳",5,"挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖",7,"捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙",6,"採掤掦掫掯掱掲掵掶掹掻掽掿揀"],["9340","揁揂揃揅揇揈揊揋揌揑揓揔揕揗",6,"揟揢揤",4,"揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆",4,"損搎搑搒搕",5,"搝搟搢搣搤"],["9380","搥搧搨搩搫搮",5,"搵",4,"搻搼搾摀摂摃摉摋",6,"摓摕摖摗摙",4,"摟",7,"摨摪摫摬摮",9,"摻",6,"撃撆撈",8,"撓撔撗撘撚撛撜撝撟",4,"撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆",6,"擏擑擓擔擕擖擙據"],["9440","擛擜擝擟擠擡擣擥擧",24,"攁",7,"攊",7,"攓",4,"攙",8],["9480","攢攣攤攦",4,"攬攭攰攱攲攳攷攺攼攽敀",4,"敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數",14,"斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱",7,"斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘",7,"旡旣旤旪旫"],["9540","旲旳旴旵旸旹旻",4,"昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷",4,"昽昿晀時晄",6,"晍晎晐晑晘"],["9580","晙晛晜晝晞晠晢晣晥晧晩",4,"晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘",4,"暞",8,"暩",4,"暯",4,"暵暶暷暸暺暻暼暽暿",25,"曚曞",7,"曧曨曪",5,"曱曵曶書曺曻曽朁朂會"],["9640","朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠",5,"朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗",4,"杝杢杣杤杦杧杫杬杮東杴杶"],["9680","杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹",7,"柂柅",9,"柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵",7,"柾栁栂栃栄栆栍栐栒栔栕栘",4,"栞栟栠栢",6,"栫",6,"栴栵栶栺栻栿桇桋桍桏桒桖",5],["9740","桜桝桞桟桪桬",7,"桵桸",8,"梂梄梇",7,"梐梑梒梔梕梖梘",9,"梣梤梥梩梪梫梬梮梱梲梴梶梷梸"],["9780","梹",6,"棁棃",5,"棊棌棎棏棐棑棓棔棖棗棙棛",4,"棡棢棤",9,"棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆",4,"椌椏椑椓",11,"椡椢椣椥",7,"椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃",16,"楕楖楘楙楛楜楟"],["9840","楡楢楤楥楧楨楩楪楬業楯楰楲",4,"楺楻楽楾楿榁榃榅榊榋榌榎",5,"榖榗榙榚榝",9,"榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽"],["9880","榾榿槀槂",7,"構槍槏槑槒槓槕",5,"槜槝槞槡",11,"槮槯槰槱槳",9,"槾樀",9,"樋",11,"標",5,"樠樢",5,"権樫樬樭樮樰樲樳樴樶",6,"樿",4,"橅橆橈",7,"橑",6,"橚"],["9940","橜",4,"橢橣橤橦",10,"橲",6,"橺橻橽橾橿檁檂檃檅",8,"檏檒",4,"檘",7,"檡",5],["9980","檧檨檪檭",114,"欥欦欨",6],["9a40","欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍",11,"歚",7,"歨歩歫",13,"歺歽歾歿殀殅殈"],["9a80","殌殎殏殐殑殔殕殗殘殙殜",4,"殢",7,"殫",7,"殶殸",6,"毀毃毄毆",4,"毌毎毐毑毘毚毜",4,"毢",7,"毬毭毮毰毱毲毴毶毷毸毺毻毼毾",6,"氈",4,"氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋",4,"汑汒汓汖汘"],["9b40","汙汚汢汣汥汦汧汫",4,"汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘"],["9b80","泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟",5,"洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽",4,"涃涄涆涇涊涋涍涏涐涒涖",4,"涜涢涥涬涭涰涱涳涴涶涷涹",5,"淁淂淃淈淉淊"],["9c40","淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽",7,"渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵"],["9c80","渶渷渹渻",7,"湅",7,"湏湐湑湒湕湗湙湚湜湝湞湠",10,"湬湭湯",14,"満溁溂溄溇溈溊",4,"溑",6,"溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪",5],["9d40","滰滱滲滳滵滶滷滸滺",7,"漃漄漅漇漈漊",4,"漐漑漒漖",9,"漡漢漣漥漦漧漨漬漮漰漲漴漵漷",6,"漿潀潁潂"],["9d80","潃潄潅潈潉潊潌潎",9,"潙潚潛潝潟潠潡潣潤潥潧",5,"潯潰潱潳潵潶潷潹潻潽",6,"澅澆澇澊澋澏",12,"澝澞澟澠澢",4,"澨",10,"澴澵澷澸澺",5,"濁濃",5,"濊",6,"濓",10,"濟濢濣濤濥"],["9e40","濦",7,"濰",32,"瀒",7,"瀜",6,"瀤",6],["9e80","瀫",9,"瀶瀷瀸瀺",17,"灍灎灐",13,"灟",11,"灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞",12,"炰炲炴炵炶為炾炿烄烅烆烇烉烋",12,"烚"],["9f40","烜烝烞烠烡烢烣烥烪烮烰",6,"烸烺烻烼烾",10,"焋",4,"焑焒焔焗焛",10,"焧",7,"焲焳焴"],["9f80","焵焷",13,"煆煇煈煉煋煍煏",12,"煝煟",4,"煥煩",4,"煯煰煱煴煵煶煷煹煻煼煾",5,"熅",4,"熋熌熍熎熐熑熒熓熕熖熗熚",4,"熡",6,"熩熪熫熭",5,"熴熶熷熸熺",8,"燄",9,"燏",4],["a040","燖",9,"燡燢燣燤燦燨",5,"燯",9,"燺",11,"爇",19],["a080","爛爜爞",9,"爩爫爭爮爯爲爳爴爺爼爾牀",6,"牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅",4,"犌犎犐犑犓",11,"犠",11,"犮犱犲犳犵犺",6,"狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛"],["a1a1","　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈",7,"〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓"],["a2a1","ⅰ",9],["a2b1","⒈",19,"⑴",19,"①",9],["a2e5","㈠",9],["a2f1","Ⅰ",11],["a3a1","！＂＃￥％",88,"￣"],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a6e0","︵︶︹︺︿﹀︽︾﹁﹂﹃﹄"],["a6ee","︻︼︷︸︱"],["a6f4","︳︴"],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a840","ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═",35,"▁",6],["a880","█",7,"▓▔▕▼▽◢◣◤◥☉⊕〒〝〞"],["a8a1","āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑ"],["a8bd","ńň"],["a8c0","ɡ"],["a8c5","ㄅ",36],["a940","〡",8,"㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤"],["a959","℡㈱"],["a95c","‐"],["a960","ー゛゜ヽヾ〆ゝゞ﹉",9,"﹔﹕﹖﹗﹙",8],["a980","﹢",4,"﹨﹩﹪﹫"],["a996","〇"],["a9a4","─",75],["aa40","狜狝狟狢",5,"狪狫狵狶狹狽狾狿猀猂猄",5,"猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀",8],["aa80","獉獊獋獌獎獏獑獓獔獕獖獘",7,"獡",10,"獮獰獱"],["ab40","獲",11,"獿",4,"玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣",5,"玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃",4],["ab80","珋珌珎珒",6,"珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳",4],["ac40","珸",10,"琄琇琈琋琌琍琎琑",8,"琜",5,"琣琤琧琩琫琭琯琱琲琷",4,"琽琾琿瑀瑂",11],["ac80","瑎",6,"瑖瑘瑝瑠",12,"瑮瑯瑱",4,"瑸瑹瑺"],["ad40","瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑",10,"璝璟",7,"璪",15,"璻",12],["ad80","瓈",9,"瓓",8,"瓝瓟瓡瓥瓧",6,"瓰瓱瓲"],["ae40","瓳瓵瓸",6,"甀甁甂甃甅",7,"甎甐甒甔甕甖甗甛甝甞甠",4,"甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘"],["ae80","畝",7,"畧畨畩畫",6,"畳畵當畷畺",4,"疀疁疂疄疅疇"],["af40","疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦",4,"疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇"],["af80","瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄"],["b040","癅",6,"癎",5,"癕癗",4,"癝癟癠癡癢癤",6,"癬癭癮癰",7,"癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛"],["b080","皜",7,"皥",8,"皯皰皳皵",9,"盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥"],["b140","盄盇盉盋盌盓盕盙盚盜盝盞盠",4,"盦",7,"盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎",10,"眛眜眝眞眡眣眤眥眧眪眫"],["b180","眬眮眰",4,"眹眻眽眾眿睂睄睅睆睈",7,"睒",7,"睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳"],["b240","睝睞睟睠睤睧睩睪睭",11,"睺睻睼瞁瞂瞃瞆",5,"瞏瞐瞓",11,"瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶",4],["b280","瞼瞾矀",12,"矎",8,"矘矙矚矝",4,"矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖"],["b340","矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃",5,"砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚"],["b380","硛硜硞",11,"硯",7,"硸硹硺硻硽",6,"场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚"],["b440","碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨",7,"碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚",9],["b480","磤磥磦磧磩磪磫磭",4,"磳磵磶磸磹磻",5,"礂礃礄礆",6,"础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮"],["b540","礍",5,"礔",9,"礟",4,"礥",14,"礵",4,"礽礿祂祃祄祅祇祊",8,"祔祕祘祙祡祣"],["b580","祤祦祩祪祫祬祮祰",6,"祹祻",4,"禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠"],["b640","禓",6,"禛",11,"禨",10,"禴",4,"禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙",5,"秠秡秢秥秨秪"],["b680","秬秮秱",6,"秹秺秼秾秿稁稄稅稇稈稉稊稌稏",4,"稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二"],["b740","稝稟稡稢稤",14,"稴稵稶稸稺稾穀",5,"穇",9,"穒",4,"穘",16],["b780","穩",6,"穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服"],["b840","窣窤窧窩窪窫窮",4,"窴",10,"竀",10,"竌",9,"竗竘竚竛竜竝竡竢竤竧",5,"竮竰竱竲竳"],["b880","竴",4,"竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹"],["b940","笯笰笲笴笵笶笷笹笻笽笿",5,"筆筈筊筍筎筓筕筗筙筜筞筟筡筣",10,"筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆",6,"箎箏"],["b980","箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹",7,"篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈"],["ba40","篅篈築篊篋篍篎篏篐篒篔",4,"篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲",4,"篸篹篺篻篽篿",7,"簈簉簊簍簎簐",5,"簗簘簙"],["ba80","簚",4,"簠",5,"簨簩簫",12,"簹",5,"籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖"],["bb40","籃",9,"籎",36,"籵",5,"籾",9],["bb80","粈粊",6,"粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴",4,"粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕"],["bc40","粿糀糂糃糄糆糉糋糎",6,"糘糚糛糝糞糡",6,"糩",5,"糰",7,"糹糺糼",13,"紋",5],["bc80","紑",14,"紡紣紤紥紦紨紩紪紬紭紮細",6,"肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件"],["bd40","紷",54,"絯",7],["bd80","絸",32,"健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸"],["be40","継",12,"綧",6,"綯",42],["be80","線",32,"尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻"],["bf40","緻",62],["bf80","縺縼",4,"繂",4,"繈",21,"俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀"],["c040","繞",35,"纃",23,"纜纝纞"],["c080","纮纴纻纼绖绤绬绹缊缐缞缷缹缻",6,"罃罆",9,"罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐"],["c140","罖罙罛罜罝罞罠罣",4,"罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂",7,"羋羍羏",4,"羕",4,"羛羜羠羢羣羥羦羨",6,"羱"],["c180","羳",4,"羺羻羾翀翂翃翄翆翇翈翉翋翍翏",4,"翖翗翙",5,"翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿"],["c240","翤翧翨翪翫翬翭翯翲翴",6,"翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫",5,"耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗"],["c280","聙聛",13,"聫",5,"聲",11,"隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫"],["c340","聾肁肂肅肈肊肍",5,"肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇",4,"胏",6,"胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋"],["c380","脌脕脗脙脛脜脝脟",12,"脭脮脰脳脴脵脷脹",4,"脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸"],["c440","腀",5,"腇腉腍腎腏腒腖腗腘腛",4,"腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃",4,"膉膋膌膍膎膐膒",5,"膙膚膞",4,"膤膥"],["c480","膧膩膫",7,"膴",5,"膼膽膾膿臄臅臇臈臉臋臍",6,"摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁"],["c540","臔",14,"臤臥臦臨臩臫臮",4,"臵",5,"臽臿舃與",4,"舎舏舑舓舕",5,"舝舠舤舥舦舧舩舮舲舺舼舽舿"],["c580","艀艁艂艃艅艆艈艊艌艍艎艐",7,"艙艛艜艝艞艠",7,"艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗"],["c640","艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸"],["c680","苺苼",4,"茊茋茍茐茒茓茖茘茙茝",9,"茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐"],["c740","茾茿荁荂荄荅荈荊",4,"荓荕",4,"荝荢荰",6,"荹荺荾",6,"莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡",6,"莬莭莮"],["c780","莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠"],["c840","菮華菳",4,"菺菻菼菾菿萀萂萅萇萈萉萊萐萒",5,"萙萚萛萞",5,"萩",7,"萲",5,"萹萺萻萾",7,"葇葈葉"],["c880","葊",6,"葒",4,"葘葝葞葟葠葢葤",4,"葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁"],["c940","葽",4,"蒃蒄蒅蒆蒊蒍蒏",7,"蒘蒚蒛蒝蒞蒟蒠蒢",12,"蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗"],["c980","蓘",4,"蓞蓡蓢蓤蓧",4,"蓭蓮蓯蓱",10,"蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳"],["ca40","蔃",8,"蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢",8,"蔭",9,"蔾",4,"蕄蕅蕆蕇蕋",10],["ca80","蕗蕘蕚蕛蕜蕝蕟",4,"蕥蕦蕧蕩",8,"蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱"],["cb40","薂薃薆薈",6,"薐",10,"薝",6,"薥薦薧薩薫薬薭薱",5,"薸薺",6,"藂",6,"藊",4,"藑藒"],["cb80","藔藖",5,"藝",6,"藥藦藧藨藪",14,"恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔"],["cc40","藹藺藼藽藾蘀",4,"蘆",10,"蘒蘓蘔蘕蘗",15,"蘨蘪",13,"蘹蘺蘻蘽蘾蘿虀"],["cc80","虁",11,"虒虓處",4,"虛虜虝號虠虡虣",7,"獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃"],["cd40","虭虯虰虲",6,"蚃",6,"蚎",4,"蚔蚖",5,"蚞",4,"蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻",4,"蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜"],["cd80","蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威"],["ce40","蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀",6,"蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚",5,"蝡蝢蝦",7,"蝯蝱蝲蝳蝵"],["ce80","蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎",4,"螔螕螖螘",6,"螠",4,"巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺"],["cf40","螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁",4,"蟇蟈蟉蟌",4,"蟔",6,"蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯",9],["cf80","蟺蟻蟼蟽蟿蠀蠁蠂蠄",5,"蠋",7,"蠔蠗蠘蠙蠚蠜",4,"蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓"],["d040","蠤",13,"蠳",5,"蠺蠻蠽蠾蠿衁衂衃衆",5,"衎",5,"衕衖衘衚",6,"衦衧衪衭衯衱衳衴衵衶衸衹衺"],["d080","衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗",4,"袝",4,"袣袥",5,"小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄"],["d140","袬袮袯袰袲",4,"袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚",4,"裠裡裦裧裩",6,"裲裵裶裷裺裻製裿褀褁褃",5],["d180","褉褋",4,"褑褔",4,"褜",4,"褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶"],["d240","褸",8,"襂襃襅",24,"襠",5,"襧",19,"襼"],["d280","襽襾覀覂覄覅覇",26,"摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐"],["d340","覢",30,"觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴",6],["d380","觻",4,"訁",5,"計",21,"印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉"],["d440","訞",31,"訿",8,"詉",21],["d480","詟",25,"詺",6,"浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧"],["d540","誁",7,"誋",7,"誔",46],["d580","諃",32,"铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政"],["d640","諤",34,"謈",27],["d680","謤謥謧",30,"帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑"],["d740","譆",31,"譧",4,"譭",25],["d780","讇",24,"讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座"],["d840","谸",8,"豂豃豄豅豈豊豋豍",7,"豖豗豘豙豛",5,"豣",6,"豬",6,"豴豵豶豷豻",6,"貃貄貆貇"],["d880","貈貋貍",6,"貕貖貗貙",20,"亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝"],["d940","貮",62],["d980","賭",32,"佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼"],["da40","贎",14,"贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸",8,"趂趃趆趇趈趉趌",4,"趒趓趕",9,"趠趡"],["da80","趢趤",12,"趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺"],["db40","跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾",6,"踆踇踈踋踍踎踐踑踒踓踕",7,"踠踡踤",4,"踫踭踰踲踳踴踶踷踸踻踼踾"],["db80","踿蹃蹅蹆蹌",4,"蹓",5,"蹚",11,"蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝"],["dc40","蹳蹵蹷",4,"蹽蹾躀躂躃躄躆躈",6,"躑躒躓躕",6,"躝躟",11,"躭躮躰躱躳",6,"躻",7],["dc80","軃",10,"軏",21,"堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥"],["dd40","軥",62],["dd80","輤",32,"荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺"],["de40","轅",32,"轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆"],["de80","迉",4,"迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖"],["df40","這逜連逤逥逧",5,"逰",4,"逷逹逺逽逿遀遃遅遆遈",4,"過達違遖遙遚遜",5,"遤遦遧適遪遫遬遯",4,"遶",6,"遾邁"],["df80","還邅邆邇邉邊邌",4,"邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼"],["e040","郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅",19,"鄚鄛鄜"],["e080","鄝鄟鄠鄡鄤",10,"鄰鄲",6,"鄺",8,"酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼"],["e140","酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀",4,"醆醈醊醎醏醓",6,"醜",5,"醤",5,"醫醬醰醱醲醳醶醷醸醹醻"],["e180","醼",10,"釈釋釐釒",9,"針",8,"帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺"],["e240","釦",62],["e280","鈥",32,"狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧",5,"饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂"],["e340","鉆",45,"鉵",16],["e380","銆",7,"銏",24,"恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾"],["e440","銨",5,"銯",24,"鋉",31],["e480","鋩",32,"洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑"],["e540","錊",51,"錿",10],["e580","鍊",31,"鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣"],["e640","鍬",34,"鎐",27],["e680","鎬",29,"鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩"],["e740","鏎",7,"鏗",54],["e780","鐎",32,"纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡",6,"缪缫缬缭缯",4,"缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬"],["e840","鐯",14,"鐿",43,"鑬鑭鑮鑯"],["e880","鑰",20,"钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹"],["e940","锧锳锽镃镈镋镕镚镠镮镴镵長",7,"門",42],["e980","閫",32,"椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋"],["ea40","闌",27,"闬闿阇阓阘阛阞阠阣",6,"阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗"],["ea80","陘陙陚陜陝陞陠陣陥陦陫陭",4,"陳陸",12,"隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰"],["eb40","隌階隑隒隓隕隖隚際隝",9,"隨",7,"隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖",9,"雡",6,"雫"],["eb80","雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗",4,"霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻"],["ec40","霡",8,"霫霬霮霯霱霳",4,"霺霻霼霽霿",18,"靔靕靗靘靚靜靝靟靣靤靦靧靨靪",7],["ec80","靲靵靷",4,"靽",7,"鞆",4,"鞌鞎鞏鞐鞓鞕鞖鞗鞙",4,"臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐"],["ed40","鞞鞟鞡鞢鞤",6,"鞬鞮鞰鞱鞳鞵",46],["ed80","韤韥韨韮",4,"韴韷",23,"怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨"],["ee40","頏",62],["ee80","顎",32,"睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶",4,"钼钽钿铄铈",6,"铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪"],["ef40","顯",5,"颋颎颒颕颙颣風",37,"飏飐飔飖飗飛飜飝飠",4],["ef80","飥飦飩",30,"铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒",4,"锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤",8,"镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔"],["f040","餈",4,"餎餏餑",28,"餯",26],["f080","饊",9,"饖",12,"饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨",4,"鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦",6,"鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙"],["f140","馌馎馚",10,"馦馧馩",47],["f180","駙",32,"瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃"],["f240","駺",62],["f280","騹",32,"颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒"],["f340","驚",17,"驲骃骉骍骎骔骕骙骦骩",6,"骲骳骴骵骹骻骽骾骿髃髄髆",4,"髍髎髏髐髒體髕髖髗髙髚髛髜"],["f380","髝髞髠髢髣髤髥髧髨髩髪髬髮髰",8,"髺髼",6,"鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋"],["f440","鬇鬉",5,"鬐鬑鬒鬔",10,"鬠鬡鬢鬤",10,"鬰鬱鬳",7,"鬽鬾鬿魀魆魊魋魌魎魐魒魓魕",5],["f480","魛",32,"簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤"],["f540","魼",62],["f580","鮻",32,"酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜"],["f640","鯜",62],["f680","鰛",32,"觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅",5,"龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞",5,"鲥",4,"鲫鲭鲮鲰",7,"鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋"],["f740","鰼",62],["f780","鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾",4,"鳈鳉鳑鳒鳚鳛鳠鳡鳌",4,"鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄"],["f840","鳣",62],["f880","鴢",32],["f940","鵃",62],["f980","鶂",32],["fa40","鶣",62],["fa80","鷢",32],["fb40","鸃",27,"鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴",9,"麀"],["fb80","麁麃麄麅麆麉麊麌",5,"麔",8,"麞麠",5,"麧麨麩麪"],["fc40","麫",8,"麵麶麷麹麺麼麿",4,"黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰",8,"黺黽黿",6],["fc80","鼆",4,"鼌鼏鼑鼒鼔鼕鼖鼘鼚",5,"鼡鼣",8,"鼭鼮鼰鼱"],["fd40","鼲",4,"鼸鼺鼼鼿",4,"齅",10,"齒",38],["fd80","齹",5,"龁龂龍",11,"龜龝龞龡",4,"郎凉秊裏隣"],["fe40","兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩"]]},{}],94:[function(e,t,r){
t.exports=[["0","\0",127],["8141","갂갃갅갆갋",4,"갘갞갟갡갢갣갥",6,"갮갲갳갴"],["8161","갵갶갷갺갻갽갾갿걁",9,"걌걎",5,"걕"],["8181","걖걗걙걚걛걝",18,"걲걳걵걶걹걻",4,"겂겇겈겍겎겏겑겒겓겕",6,"겞겢",5,"겫겭겮겱",6,"겺겾겿곀곂곃곅곆곇곉곊곋곍",7,"곖곘",7,"곢곣곥곦곩곫곭곮곲곴곷",4,"곾곿괁괂괃괅괇",4,"괎괐괒괓"],["8241","괔괕괖괗괙괚괛괝괞괟괡",7,"괪괫괮",5],["8261","괶괷괹괺괻괽",6,"굆굈굊",5,"굑굒굓굕굖굗"],["8281","굙",7,"굢굤",7,"굮굯굱굲굷굸굹굺굾궀궃",4,"궊궋궍궎궏궑",10,"궞",5,"궥",17,"궸",7,"귂귃귅귆귇귉",6,"귒귔",7,"귝귞귟귡귢귣귥",18],["8341","귺귻귽귾긂",5,"긊긌긎",5,"긕",7],["8361","긝",18,"긲긳긵긶긹긻긼"],["8381","긽긾긿깂깄깇깈깉깋깏깑깒깓깕깗",4,"깞깢깣깤깦깧깪깫깭깮깯깱",6,"깺깾",5,"꺆",5,"꺍",46,"꺿껁껂껃껅",6,"껎껒",5,"껚껛껝",8],["8441","껦껧껩껪껬껮",5,"껵껶껷껹껺껻껽",8],["8461","꼆꼉꼊꼋꼌꼎꼏꼑",18],["8481","꼤",7,"꼮꼯꼱꼳꼵",6,"꼾꽀꽄꽅꽆꽇꽊",5,"꽑",10,"꽞",5,"꽦",18,"꽺",5,"꾁꾂꾃꾅꾆꾇꾉",6,"꾒꾓꾔꾖",5,"꾝",26,"꾺꾻꾽꾾"],["8541","꾿꿁",5,"꿊꿌꿏",4,"꿕",6,"꿝",4],["8561","꿢",5,"꿪",5,"꿲꿳꿵꿶꿷꿹",6,"뀂뀃"],["8581","뀅",6,"뀍뀎뀏뀑뀒뀓뀕",6,"뀞",9,"뀩",26,"끆끇끉끋끍끏끐끑끒끖끘끚끛끜끞",29,"끾끿낁낂낃낅",6,"낎낐낒",5,"낛낝낞낣낤"],["8641","낥낦낧낪낰낲낶낷낹낺낻낽",6,"냆냊",5,"냒"],["8661","냓냕냖냗냙",6,"냡냢냣냤냦",10],["8681","냱",22,"넊넍넎넏넑넔넕넖넗넚넞",4,"넦넧넩넪넫넭",6,"넶넺",5,"녂녃녅녆녇녉",6,"녒녓녖녗녙녚녛녝녞녟녡",22,"녺녻녽녾녿놁놃",4,"놊놌놎놏놐놑놕놖놗놙놚놛놝"],["8741","놞",9,"놩",15],["8761","놹",18,"뇍뇎뇏뇑뇒뇓뇕"],["8781","뇖",5,"뇞뇠",7,"뇪뇫뇭뇮뇯뇱",7,"뇺뇼뇾",5,"눆눇눉눊눍",6,"눖눘눚",5,"눡",18,"눵",6,"눽",26,"뉙뉚뉛뉝뉞뉟뉡",6,"뉪",4],["8841","뉯",4,"뉶",5,"뉽",6,"늆늇늈늊",4],["8861","늏늒늓늕늖늗늛",4,"늢늤늧늨늩늫늭늮늯늱늲늳늵늶늷"],["8881","늸",15,"닊닋닍닎닏닑닓",4,"닚닜닞닟닠닡닣닧닩닪닰닱닲닶닼닽닾댂댃댅댆댇댉",6,"댒댖",5,"댝",54,"덗덙덚덝덠덡덢덣"],["8941","덦덨덪덬덭덯덲덳덵덶덷덹",6,"뎂뎆",5,"뎍"],["8961","뎎뎏뎑뎒뎓뎕",10,"뎢",5,"뎩뎪뎫뎭"],["8981","뎮",21,"돆돇돉돊돍돏돑돒돓돖돘돚돜돞돟돡돢돣돥돦돧돩",18,"돽",18,"됑",6,"됙됚됛됝됞됟됡",6,"됪됬",7,"됵",15],["8a41","둅",10,"둒둓둕둖둗둙",6,"둢둤둦"],["8a61","둧",4,"둭",18,"뒁뒂"],["8a81","뒃",4,"뒉",19,"뒞",5,"뒥뒦뒧뒩뒪뒫뒭",7,"뒶뒸뒺",5,"듁듂듃듅듆듇듉",6,"듑듒듓듔듖",5,"듞듟듡듢듥듧",4,"듮듰듲",5,"듹",26,"딖딗딙딚딝"],["8b41","딞",5,"딦딫",4,"딲딳딵딶딷딹",6,"땂땆"],["8b61","땇땈땉땊땎땏땑땒땓땕",6,"땞땢",8],["8b81","땫",52,"떢떣떥떦떧떩떬떭떮떯떲떶",4,"떾떿뗁뗂뗃뗅",6,"뗎뗒",5,"뗙",18,"뗭",18],["8c41","똀",15,"똒똓똕똖똗똙",4],["8c61","똞",6,"똦",5,"똭",6,"똵",5],["8c81","똻",12,"뙉",26,"뙥뙦뙧뙩",50,"뚞뚟뚡뚢뚣뚥",5,"뚭뚮뚯뚰뚲",16],["8d41","뛃",16,"뛕",8],["8d61","뛞",17,"뛱뛲뛳뛵뛶뛷뛹뛺"],["8d81","뛻",4,"뜂뜃뜄뜆",33,"뜪뜫뜭뜮뜱",6,"뜺뜼",7,"띅띆띇띉띊띋띍",6,"띖",9,"띡띢띣띥띦띧띩",6,"띲띴띶",5,"띾띿랁랂랃랅",6,"랎랓랔랕랚랛랝랞"],["8e41","랟랡",6,"랪랮",5,"랶랷랹",8],["8e61","럂",4,"럈럊",19],["8e81","럞",13,"럮럯럱럲럳럵",6,"럾렂",4,"렊렋렍렎렏렑",6,"렚렜렞",5,"렦렧렩렪렫렭",6,"렶렺",5,"롁롂롃롅",11,"롒롔",7,"롞롟롡롢롣롥",6,"롮롰롲",5,"롹롺롻롽",7],["8f41","뢅",7,"뢎",17],["8f61","뢠",7,"뢩",6,"뢱뢲뢳뢵뢶뢷뢹",4],["8f81","뢾뢿룂룄룆",5,"룍룎룏룑룒룓룕",7,"룞룠룢",5,"룪룫룭룮룯룱",6,"룺룼룾",5,"뤅",18,"뤙",6,"뤡",26,"뤾뤿륁륂륃륅",6,"륍륎륐륒",5],["9041","륚륛륝륞륟륡",6,"륪륬륮",5,"륶륷륹륺륻륽"],["9061","륾",5,"릆릈릋릌릏",15],["9081","릟",12,"릮릯릱릲릳릵",6,"릾맀맂",5,"맊맋맍맓",4,"맚맜맟맠맢맦맧맩맪맫맭",6,"맶맻",4,"먂",5,"먉",11,"먖",33,"먺먻먽먾먿멁멃멄멅멆"],["9141","멇멊멌멏멐멑멒멖멗멙멚멛멝",6,"멦멪",5],["9161","멲멳멵멶멷멹",9,"몆몈몉몊몋몍",5],["9181","몓",20,"몪몭몮몯몱몳",4,"몺몼몾",5,"뫅뫆뫇뫉",14,"뫚",33,"뫽뫾뫿묁묂묃묅",7,"묎묐묒",5,"묙묚묛묝묞묟묡",6],["9241","묨묪묬",7,"묷묹묺묿",4,"뭆뭈뭊뭋뭌뭎뭑뭒"],["9261","뭓뭕뭖뭗뭙",7,"뭢뭤",7,"뭭",4],["9281","뭲",21,"뮉뮊뮋뮍뮎뮏뮑",18,"뮥뮦뮧뮩뮪뮫뮭",6,"뮵뮶뮸",7,"믁믂믃믅믆믇믉",6,"믑믒믔",35,"믺믻믽믾밁"],["9341","밃",4,"밊밎밐밒밓밙밚밠밡밢밣밦밨밪밫밬밮밯밲밳밵"],["9361","밶밷밹",6,"뱂뱆뱇뱈뱊뱋뱎뱏뱑",8],["9381","뱚뱛뱜뱞",37,"벆벇벉벊벍벏",4,"벖벘벛",4,"벢벣벥벦벩",6,"벲벶",5,"벾벿볁볂볃볅",7,"볎볒볓볔볖볗볙볚볛볝",22,"볷볹볺볻볽"],["9441","볾",5,"봆봈봊",5,"봑봒봓봕",8],["9461","봞",5,"봥",6,"봭",12],["9481","봺",5,"뵁",6,"뵊뵋뵍뵎뵏뵑",6,"뵚",9,"뵥뵦뵧뵩",22,"붂붃붅붆붋",4,"붒붔붖붗붘붛붝",6,"붥",10,"붱",6,"붹",24],["9541","뷒뷓뷖뷗뷙뷚뷛뷝",11,"뷪",5,"뷱"],["9561","뷲뷳뷵뷶뷷뷹",6,"븁븂븄븆",5,"븎븏븑븒븓"],["9581","븕",6,"븞븠",35,"빆빇빉빊빋빍빏",4,"빖빘빜빝빞빟빢빣빥빦빧빩빫",4,"빲빶",4,"빾빿뺁뺂뺃뺅",6,"뺎뺒",5,"뺚",13,"뺩",14],["9641","뺸",23,"뻒뻓"],["9661","뻕뻖뻙",6,"뻡뻢뻦",5,"뻭",8],["9681","뻶",10,"뼂",5,"뼊",13,"뼚뼞",33,"뽂뽃뽅뽆뽇뽉",6,"뽒뽓뽔뽖",44],["9741","뾃",16,"뾕",8],["9761","뾞",17,"뾱",7],["9781","뾹",11,"뿆",5,"뿎뿏뿑뿒뿓뿕",6,"뿝뿞뿠뿢",89,"쀽쀾쀿"],["9841","쁀",16,"쁒",5,"쁙쁚쁛"],["9861","쁝쁞쁟쁡",6,"쁪",15],["9881","쁺",21,"삒삓삕삖삗삙",6,"삢삤삦",5,"삮삱삲삷",4,"삾샂샃샄샆샇샊샋샍샎샏샑",6,"샚샞",5,"샦샧샩샪샫샭",6,"샶샸샺",5,"섁섂섃섅섆섇섉",6,"섑섒섓섔섖",5,"섡섢섥섨섩섪섫섮"],["9941","섲섳섴섵섷섺섻섽섾섿셁",6,"셊셎",5,"셖셗"],["9961","셙셚셛셝",6,"셦셪",5,"셱셲셳셵셶셷셹셺셻"],["9981","셼",8,"솆",5,"솏솑솒솓솕솗",4,"솞솠솢솣솤솦솧솪솫솭솮솯솱",11,"솾",5,"쇅쇆쇇쇉쇊쇋쇍",6,"쇕쇖쇙",6,"쇡쇢쇣쇥쇦쇧쇩",6,"쇲쇴",7,"쇾쇿숁숂숃숅",6,"숎숐숒",5,"숚숛숝숞숡숢숣"],["9a41","숤숥숦숧숪숬숮숰숳숵",16],["9a61","쉆쉇쉉",6,"쉒쉓쉕쉖쉗쉙",6,"쉡쉢쉣쉤쉦"],["9a81","쉧",4,"쉮쉯쉱쉲쉳쉵",6,"쉾슀슂",5,"슊",5,"슑",6,"슙슚슜슞",5,"슦슧슩슪슫슮",5,"슶슸슺",33,"싞싟싡싢싥",5,"싮싰싲싳싴싵싷싺싽싾싿쌁",6,"쌊쌋쌎쌏"],["9b41","쌐쌑쌒쌖쌗쌙쌚쌛쌝",6,"쌦쌧쌪",8],["9b61","쌳",17,"썆",7],["9b81","썎",25,"썪썫썭썮썯썱썳",4,"썺썻썾",5,"쎅쎆쎇쎉쎊쎋쎍",50,"쏁",22,"쏚"],["9c41","쏛쏝쏞쏡쏣",4,"쏪쏫쏬쏮",5,"쏶쏷쏹",5],["9c61","쏿",8,"쐉",6,"쐑",9],["9c81","쐛",8,"쐥",6,"쐭쐮쐯쐱쐲쐳쐵",6,"쐾",9,"쑉",26,"쑦쑧쑩쑪쑫쑭",6,"쑶쑷쑸쑺",5,"쒁",18,"쒕",6,"쒝",12],["9d41","쒪",13,"쒹쒺쒻쒽",8],["9d61","쓆",25],["9d81","쓠",8,"쓪",5,"쓲쓳쓵쓶쓷쓹쓻쓼쓽쓾씂",9,"씍씎씏씑씒씓씕",6,"씝",10,"씪씫씭씮씯씱",6,"씺씼씾",5,"앆앇앋앏앐앑앒앖앚앛앜앟앢앣앥앦앧앩",6,"앲앶",5,"앾앿얁얂얃얅얆얈얉얊얋얎얐얒얓얔"],["9e41","얖얙얚얛얝얞얟얡",7,"얪",9,"얶"],["9e61","얷얺얿",4,"엋엍엏엒엓엕엖엗엙",6,"엢엤엦엧"],["9e81","엨엩엪엫엯엱엲엳엵엸엹엺엻옂옃옄옉옊옋옍옎옏옑",6,"옚옝",6,"옦옧옩옪옫옯옱옲옶옸옺옼옽옾옿왂왃왅왆왇왉",6,"왒왖",5,"왞왟왡",10,"왭왮왰왲",5,"왺왻왽왾왿욁",6,"욊욌욎",5,"욖욗욙욚욛욝",6,"욦"],["9f41","욨욪",5,"욲욳욵욶욷욻",4,"웂웄웆",5,"웎"],["9f61","웏웑웒웓웕",6,"웞웟웢",5,"웪웫웭웮웯웱웲"],["9f81","웳",4,"웺웻웼웾",5,"윆윇윉윊윋윍",6,"윖윘윚",5,"윢윣윥윦윧윩",6,"윲윴윶윸윹윺윻윾윿읁읂읃읅",4,"읋읎읐읙읚읛읝읞읟읡",6,"읩읪읬",7,"읶읷읹읺읻읿잀잁잂잆잋잌잍잏잒잓잕잙잛",4,"잢잧",4,"잮잯잱잲잳잵잶잷"],["a041","잸잹잺잻잾쟂",5,"쟊쟋쟍쟏쟑",6,"쟙쟚쟛쟜"],["a061","쟞",5,"쟥쟦쟧쟩쟪쟫쟭",13],["a081","쟻",4,"젂젃젅젆젇젉젋",4,"젒젔젗",4,"젞젟젡젢젣젥",6,"젮젰젲",5,"젹젺젻젽젾젿졁",6,"졊졋졎",5,"졕",26,"졲졳졵졶졷졹졻",4,"좂좄좈좉좊좎",5,"좕",7,"좞좠좢좣좤"],["a141","좥좦좧좩",18,"좾좿죀죁"],["a161","죂죃죅죆죇죉죊죋죍",6,"죖죘죚",5,"죢죣죥"],["a181","죦",14,"죶",5,"죾죿줁줂줃줇",4,"줎　、。·‥…¨〃­―∥＼∼‘’“”〔〕〈",9,"±×÷≠≤≥∞∴°′″℃Å￠￡￥♂♀∠⊥⌒∂∇≡≒§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢"],["a241","줐줒",5,"줙",18],["a261","줭",6,"줵",18],["a281","쥈",7,"쥒쥓쥕쥖쥗쥙",6,"쥢쥤",7,"쥭쥮쥯⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡€®"],["a341","쥱쥲쥳쥵",6,"쥽",10,"즊즋즍즎즏"],["a361","즑",6,"즚즜즞",16],["a381","즯",16,"짂짃짅짆짉짋",4,"짒짔짗짘짛！",58,"￦］",32,"￣"],["a441","짞짟짡짣짥짦짨짩짪짫짮짲",5,"짺짻짽짾짿쨁쨂쨃쨄"],["a461","쨅쨆쨇쨊쨎",5,"쨕쨖쨗쨙",12],["a481","쨦쨧쨨쨪",28,"ㄱ",93],["a541","쩇",4,"쩎쩏쩑쩒쩓쩕",6,"쩞쩢",5,"쩩쩪"],["a561","쩫",17,"쩾",5,"쪅쪆"],["a581","쪇",16,"쪙",14,"ⅰ",9],["a5b0","Ⅰ",9],["a5c1","Α",16,"Σ",6],["a5e1","α",16,"σ",6],["a641","쪨",19,"쪾쪿쫁쫂쫃쫅"],["a661","쫆",5,"쫎쫐쫒쫔쫕쫖쫗쫚",5,"쫡",6],["a681","쫨쫩쫪쫫쫭",6,"쫵",18,"쬉쬊─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃",7],["a741","쬋",4,"쬑쬒쬓쬕쬖쬗쬙",6,"쬢",7],["a761","쬪",22,"쭂쭃쭄"],["a781","쭅쭆쭇쭊쭋쭍쭎쭏쭑",6,"쭚쭛쭜쭞",5,"쭥",7,"㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙",9,"㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰",9,"㎀",4,"㎺",5,"㎐",4,"Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆"],["a841","쭭",10,"쭺",14],["a861","쮉",18,"쮝",6],["a881","쮤",19,"쮹",11,"ÆÐªĦ"],["a8a6","Ĳ"],["a8a8","ĿŁØŒºÞŦŊ"],["a8b1","㉠",27,"ⓐ",25,"①",14,"½⅓⅔¼¾⅛⅜⅝⅞"],["a941","쯅",14,"쯕",10],["a961","쯠쯡쯢쯣쯥쯦쯨쯪",18],["a981","쯽",14,"찎찏찑찒찓찕",6,"찞찟찠찣찤æđðħıĳĸŀłøœßþŧŋŉ㈀",27,"⒜",25,"⑴",14,"¹²³⁴ⁿ₁₂₃₄"],["aa41","찥찦찪찫찭찯찱",6,"찺찿",4,"챆챇챉챊챋챍챎"],["aa61","챏",4,"챖챚",5,"챡챢챣챥챧챩",6,"챱챲"],["aa81","챳챴챶",29,"ぁ",82],["ab41","첔첕첖첗첚첛첝첞첟첡",6,"첪첮",5,"첶첷첹"],["ab61","첺첻첽",6,"쳆쳈쳊",5,"쳑쳒쳓쳕",5],["ab81","쳛",8,"쳥",6,"쳭쳮쳯쳱",12,"ァ",85],["ac41","쳾쳿촀촂",5,"촊촋촍촎촏촑",6,"촚촜촞촟촠"],["ac61","촡촢촣촥촦촧촩촪촫촭",11,"촺",4],["ac81","촿",28,"쵝쵞쵟А",5,"ЁЖ",25],["acd1","а",5,"ёж",25],["ad41","쵡쵢쵣쵥",6,"쵮쵰쵲",5,"쵹",7],["ad61","춁",6,"춉",10,"춖춗춙춚춛춝춞춟"],["ad81","춠춡춢춣춦춨춪",5,"춱",18,"췅"],["ae41","췆",5,"췍췎췏췑",16],["ae61","췢",5,"췩췪췫췭췮췯췱",6,"췺췼췾",4],["ae81","츃츅츆츇츉츊츋츍",6,"츕츖츗츘츚",5,"츢츣츥츦츧츩츪츫"],["af41","츬츭츮츯츲츴츶",19],["af61","칊",13,"칚칛칝칞칢",5,"칪칬"],["af81","칮",5,"칶칷칹칺칻칽",6,"캆캈캊",5,"캒캓캕캖캗캙"],["b041","캚",5,"캢캦",5,"캮",12],["b061","캻",5,"컂",19],["b081","컖",13,"컦컧컩컪컭",6,"컶컺",5,"가각간갇갈갉갊감",7,"같",4,"갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆"],["b141","켂켃켅켆켇켉",6,"켒켔켖",5,"켝켞켟켡켢켣"],["b161","켥",6,"켮켲",5,"켹",11],["b181","콅",14,"콖콗콙콚콛콝",6,"콦콨콪콫콬괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸"],["b241","콭콮콯콲콳콵콶콷콹",6,"쾁쾂쾃쾄쾆",5,"쾍"],["b261","쾎",18,"쾢",5,"쾩"],["b281","쾪",5,"쾱",18,"쿅",6,"깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙"],["b341","쿌",19,"쿢쿣쿥쿦쿧쿩"],["b361","쿪",5,"쿲쿴쿶",5,"쿽쿾쿿퀁퀂퀃퀅",5],["b381","퀋",5,"퀒",5,"퀙",19,"끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫",4,"낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝"],["b441","퀮",5,"퀶퀷퀹퀺퀻퀽",6,"큆큈큊",5],["b461","큑큒큓큕큖큗큙",6,"큡",10,"큮큯"],["b481","큱큲큳큵",6,"큾큿킀킂",18,"뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫",4,"닳담답닷",4,"닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥"],["b541","킕",14,"킦킧킩킪킫킭",5],["b561","킳킶킸킺",5,"탂탃탅탆탇탊",5,"탒탖",4],["b581","탛탞탟탡탢탣탥",6,"탮탲",5,"탹",11,"덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸"],["b641","턅",7,"턎",17],["b661","턠",15,"턲턳턵턶턷턹턻턼턽턾"],["b681","턿텂텆",5,"텎텏텑텒텓텕",6,"텞텠텢",5,"텩텪텫텭땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗"],["b741","텮",13,"텽",6,"톅톆톇톉톊"],["b761","톋",20,"톢톣톥톦톧"],["b781","톩",6,"톲톴톶톷톸톹톻톽톾톿퇁",14,"래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩"],["b841","퇐",7,"퇙",17],["b861","퇫",8,"퇵퇶퇷퇹",13],["b881","툈툊",5,"툑",24,"륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많",4,"맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼"],["b941","툪툫툮툯툱툲툳툵",6,"툾퉀퉂",5,"퉉퉊퉋퉌"],["b961","퉍",14,"퉝",6,"퉥퉦퉧퉨"],["b981","퉩",22,"튂튃튅튆튇튉튊튋튌묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바",4,"받",4,"밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗"],["ba41","튍튎튏튒튓튔튖",5,"튝튞튟튡튢튣튥",6,"튭"],["ba61","튮튯튰튲",5,"튺튻튽튾틁틃",4,"틊틌",5],["ba81","틒틓틕틖틗틙틚틛틝",6,"틦",9,"틲틳틵틶틷틹틺벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤"],["bb41","틻",4,"팂팄팆",5,"팏팑팒팓팕팗",4,"팞팢팣"],["bb61","팤팦팧팪팫팭팮팯팱",6,"팺팾",5,"퍆퍇퍈퍉"],["bb81","퍊",31,"빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤"],["bc41","퍪",17,"퍾퍿펁펂펃펅펆펇"],["bc61","펈펉펊펋펎펒",5,"펚펛펝펞펟펡",6,"펪펬펮"],["bc81","펯",4,"펵펶펷펹펺펻펽",6,"폆폇폊",5,"폑",5,"샥샨샬샴샵샷샹섀섄섈섐섕서",4,"섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭"],["bd41","폗폙",7,"폢폤",7,"폮폯폱폲폳폵폶폷"],["bd61","폸폹폺폻폾퐀퐂",5,"퐉",13],["bd81","퐗",5,"퐞",25,"숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰"],["be41","퐸",7,"푁푂푃푅",14],["be61","푔",7,"푝푞푟푡푢푣푥",7,"푮푰푱푲"],["be81","푳",4,"푺푻푽푾풁풃",4,"풊풌풎",5,"풕",8,"쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄",6,"엌엎"],["bf41","풞",10,"풪",14],["bf61","풹",18,"퓍퓎퓏퓑퓒퓓퓕"],["bf81","퓖",5,"퓝퓞퓠",7,"퓩퓪퓫퓭퓮퓯퓱",6,"퓹퓺퓼에엑엔엘엠엡엣엥여역엮연열엶엷염",5,"옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨"],["c041","퓾",5,"픅픆픇픉픊픋픍",6,"픖픘",5],["c061","픞",25],["c081","픸픹픺픻픾픿핁핂핃핅",6,"핎핐핒",5,"핚핛핝핞핟핡핢핣웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응",7,"읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊"],["c141","핤핦핧핪핬핮",5,"핶핷핹핺핻핽",6,"햆햊햋"],["c161","햌햍햎햏햑",19,"햦햧"],["c181","햨",31,"점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓"],["c241","헊헋헍헎헏헑헓",4,"헚헜헞",5,"헦헧헩헪헫헭헮"],["c261","헯",4,"헶헸헺",5,"혂혃혅혆혇혉",6,"혒"],["c281","혖",5,"혝혞혟혡혢혣혥",7,"혮",9,"혺혻징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻"],["c341","혽혾혿홁홂홃홄홆홇홊홌홎홏홐홒홓홖홗홙홚홛홝",4],["c361","홢",4,"홨홪",5,"홲홳홵",11],["c381","횁횂횄횆",5,"횎횏횑횒횓횕",7,"횞횠횢",5,"횩횪찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층"],["c441","횫횭횮횯횱",7,"횺횼",7,"훆훇훉훊훋"],["c461","훍훎훏훐훒훓훕훖훘훚",5,"훡훢훣훥훦훧훩",4],["c481","훮훯훱훲훳훴훶",5,"훾훿휁휂휃휅",11,"휒휓휔치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼"],["c541","휕휖휗휚휛휝휞휟휡",6,"휪휬휮",5,"휶휷휹"],["c561","휺휻휽",6,"흅흆흈흊",5,"흒흓흕흚",4],["c581","흟흢흤흦흧흨흪흫흭흮흯흱흲흳흵",6,"흾흿힀힂",5,"힊힋큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜"],["c641","힍힎힏힑",6,"힚힜힞",5],["c6a1","퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁"],["c7a1","퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠"],["c8a1","혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝"],["caa1","伽佳假價加可呵哥嘉嫁家暇架枷柯歌珂痂稼苛茄街袈訶賈跏軻迦駕刻却各恪慤殼珏脚覺角閣侃刊墾奸姦干幹懇揀杆柬桿澗癎看磵稈竿簡肝艮艱諫間乫喝曷渴碣竭葛褐蝎鞨勘坎堪嵌感憾戡敢柑橄減甘疳監瞰紺邯鑑鑒龕"],["cba1","匣岬甲胛鉀閘剛堈姜岡崗康强彊慷江畺疆糠絳綱羌腔舡薑襁講鋼降鱇介价個凱塏愷愾慨改槪漑疥皆盖箇芥蓋豈鎧開喀客坑更粳羹醵倨去居巨拒据據擧渠炬祛距踞車遽鉅鋸乾件健巾建愆楗腱虔蹇鍵騫乞傑杰桀儉劍劒檢"],["cca1","瞼鈐黔劫怯迲偈憩揭擊格檄激膈覡隔堅牽犬甄絹繭肩見譴遣鵑抉決潔結缺訣兼慊箝謙鉗鎌京俓倞傾儆勁勍卿坰境庚徑慶憬擎敬景暻更梗涇炅烱璟璥瓊痙硬磬竟競絅經耕耿脛莖警輕逕鏡頃頸驚鯨係啓堺契季屆悸戒桂械"],["cda1","棨溪界癸磎稽系繫繼計誡谿階鷄古叩告呱固姑孤尻庫拷攷故敲暠枯槁沽痼皐睾稿羔考股膏苦苽菰藁蠱袴誥賈辜錮雇顧高鼓哭斛曲梏穀谷鵠困坤崑昆梱棍滾琨袞鯤汨滑骨供公共功孔工恐恭拱控攻珙空蚣貢鞏串寡戈果瓜"],["cea1","科菓誇課跨過鍋顆廓槨藿郭串冠官寬慣棺款灌琯瓘管罐菅觀貫關館刮恝括适侊光匡壙廣曠洸炚狂珖筐胱鑛卦掛罫乖傀塊壞怪愧拐槐魁宏紘肱轟交僑咬喬嬌嶠巧攪敎校橋狡皎矯絞翹膠蕎蛟較轎郊餃驕鮫丘久九仇俱具勾"],["cfa1","區口句咎嘔坵垢寇嶇廐懼拘救枸柩構歐毆毬求溝灸狗玖球瞿矩究絿耉臼舅舊苟衢謳購軀逑邱鉤銶駒驅鳩鷗龜國局菊鞠鞫麴君窘群裙軍郡堀屈掘窟宮弓穹窮芎躬倦券勸卷圈拳捲權淃眷厥獗蕨蹶闕机櫃潰詭軌饋句晷歸貴"],["d0a1","鬼龜叫圭奎揆槻珪硅窺竅糾葵規赳逵閨勻均畇筠菌鈞龜橘克剋劇戟棘極隙僅劤勤懃斤根槿瑾筋芹菫覲謹近饉契今妗擒昑檎琴禁禽芩衾衿襟金錦伋及急扱汲級給亘兢矜肯企伎其冀嗜器圻基埼夔奇妓寄岐崎己幾忌技旗旣"],["d1a1","朞期杞棋棄機欺氣汽沂淇玘琦琪璂璣畸畿碁磯祁祇祈祺箕紀綺羈耆耭肌記譏豈起錡錤飢饑騎騏驥麒緊佶吉拮桔金喫儺喇奈娜懦懶拏拿癩",5,"那樂",4,"諾酪駱亂卵暖欄煖爛蘭難鸞捏捺南嵐枏楠湳濫男藍襤拉"],["d2a1","納臘蠟衲囊娘廊",4,"乃來內奈柰耐冷女年撚秊念恬拈捻寧寗努勞奴弩怒擄櫓爐瑙盧",5,"駑魯",10,"濃籠聾膿農惱牢磊腦賂雷尿壘",7,"嫩訥杻紐勒",5,"能菱陵尼泥匿溺多茶"],["d3a1","丹亶但單團壇彖斷旦檀段湍短端簞緞蛋袒鄲鍛撻澾獺疸達啖坍憺擔曇淡湛潭澹痰聃膽蕁覃談譚錟沓畓答踏遝唐堂塘幢戇撞棠當糖螳黨代垈坮大對岱帶待戴擡玳臺袋貸隊黛宅德悳倒刀到圖堵塗導屠島嶋度徒悼挑掉搗桃"],["d4a1","棹櫂淘渡滔濤燾盜睹禱稻萄覩賭跳蹈逃途道都鍍陶韜毒瀆牘犢獨督禿篤纛讀墩惇敦旽暾沌焞燉豚頓乭突仝冬凍動同憧東桐棟洞潼疼瞳童胴董銅兜斗杜枓痘竇荳讀豆逗頭屯臀芚遁遯鈍得嶝橙燈登等藤謄鄧騰喇懶拏癩羅"],["d5a1","蘿螺裸邏樂洛烙珞絡落諾酪駱丹亂卵欄欒瀾爛蘭鸞剌辣嵐擥攬欖濫籃纜藍襤覽拉臘蠟廊朗浪狼琅瑯螂郞來崍徠萊冷掠略亮倆兩凉梁樑粮粱糧良諒輛量侶儷勵呂廬慮戾旅櫚濾礪藜蠣閭驢驪麗黎力曆歷瀝礫轢靂憐戀攣漣"],["d6a1","煉璉練聯蓮輦連鍊冽列劣洌烈裂廉斂殮濂簾獵令伶囹寧岺嶺怜玲笭羚翎聆逞鈴零靈領齡例澧禮醴隷勞怒撈擄櫓潞瀘爐盧老蘆虜路輅露魯鷺鹵碌祿綠菉錄鹿麓論壟弄朧瀧瓏籠聾儡瀨牢磊賂賚賴雷了僚寮廖料燎療瞭聊蓼"],["d7a1","遼鬧龍壘婁屢樓淚漏瘻累縷蔞褸鏤陋劉旒柳榴流溜瀏琉瑠留瘤硫謬類六戮陸侖倫崙淪綸輪律慄栗率隆勒肋凜凌楞稜綾菱陵俚利厘吏唎履悧李梨浬犁狸理璃異痢籬罹羸莉裏裡里釐離鯉吝潾燐璘藺躪隣鱗麟林淋琳臨霖砬"],["d8a1","立笠粒摩瑪痲碼磨馬魔麻寞幕漠膜莫邈万卍娩巒彎慢挽晩曼滿漫灣瞞萬蔓蠻輓饅鰻唜抹末沫茉襪靺亡妄忘忙望網罔芒茫莽輞邙埋妹媒寐昧枚梅每煤罵買賣邁魅脈貊陌驀麥孟氓猛盲盟萌冪覓免冕勉棉沔眄眠綿緬面麵滅"],["d9a1","蔑冥名命明暝椧溟皿瞑茗蓂螟酩銘鳴袂侮冒募姆帽慕摸摹暮某模母毛牟牡瑁眸矛耗芼茅謀謨貌木沐牧目睦穆鶩歿沒夢朦蒙卯墓妙廟描昴杳渺猫竗苗錨務巫憮懋戊拇撫无楙武毋無珷畝繆舞茂蕪誣貿霧鵡墨默們刎吻問文"],["daa1","汶紊紋聞蚊門雯勿沕物味媚尾嵋彌微未梶楣渼湄眉米美薇謎迷靡黴岷悶愍憫敏旻旼民泯玟珉緡閔密蜜謐剝博拍搏撲朴樸泊珀璞箔粕縛膊舶薄迫雹駁伴半反叛拌搬攀斑槃泮潘班畔瘢盤盼磐磻礬絆般蟠返頒飯勃拔撥渤潑"],["dba1","發跋醱鉢髮魃倣傍坊妨尨幇彷房放方旁昉枋榜滂磅紡肪膀舫芳蒡蚌訪謗邦防龐倍俳北培徘拜排杯湃焙盃背胚裴裵褙賠輩配陪伯佰帛柏栢白百魄幡樊煩燔番磻繁蕃藩飜伐筏罰閥凡帆梵氾汎泛犯範范法琺僻劈壁擘檗璧癖"],["dca1","碧蘗闢霹便卞弁變辨辯邊別瞥鱉鼈丙倂兵屛幷昞昺柄棅炳甁病秉竝輧餠騈保堡報寶普步洑湺潽珤甫菩補褓譜輔伏僕匐卜宓復服福腹茯蔔複覆輹輻馥鰒本乶俸奉封峯峰捧棒烽熢琫縫蓬蜂逢鋒鳳不付俯傅剖副否咐埠夫婦"],["dda1","孚孵富府復扶敷斧浮溥父符簿缶腐腑膚艀芙莩訃負賦賻赴趺部釜阜附駙鳧北分吩噴墳奔奮忿憤扮昐汾焚盆粉糞紛芬賁雰不佛弗彿拂崩朋棚硼繃鵬丕備匕匪卑妃婢庇悲憊扉批斐枇榧比毖毗毘沸泌琵痺砒碑秕秘粃緋翡肥"],["dea1","脾臂菲蜚裨誹譬費鄙非飛鼻嚬嬪彬斌檳殯浜濱瀕牝玭貧賓頻憑氷聘騁乍事些仕伺似使俟僿史司唆嗣四士奢娑寫寺射巳師徙思捨斜斯柶査梭死沙泗渣瀉獅砂社祀祠私篩紗絲肆舍莎蓑蛇裟詐詞謝賜赦辭邪飼駟麝削數朔索"],["dfa1","傘刪山散汕珊産疝算蒜酸霰乷撒殺煞薩三參杉森渗芟蔘衫揷澁鈒颯上傷像償商喪嘗孀尙峠常床庠廂想桑橡湘爽牀狀相祥箱翔裳觴詳象賞霜塞璽賽嗇塞穡索色牲生甥省笙墅壻嶼序庶徐恕抒捿敍暑曙書栖棲犀瑞筮絮緖署"],["e0a1","胥舒薯西誓逝鋤黍鼠夕奭席惜昔晳析汐淅潟石碩蓆釋錫仙僊先善嬋宣扇敾旋渲煽琁瑄璇璿癬禪線繕羨腺膳船蘚蟬詵跣選銑鐥饍鮮卨屑楔泄洩渫舌薛褻設說雪齧剡暹殲纖蟾贍閃陝攝涉燮葉城姓宬性惺成星晟猩珹盛省筬"],["e1a1","聖聲腥誠醒世勢歲洗稅笹細說貰召嘯塑宵小少巢所掃搔昭梳沼消溯瀟炤燒甦疏疎瘙笑篠簫素紹蔬蕭蘇訴逍遡邵銷韶騷俗屬束涑粟續謖贖速孫巽損蓀遜飡率宋悚松淞訟誦送頌刷殺灑碎鎖衰釗修受嗽囚垂壽嫂守岫峀帥愁"],["e2a1","戍手授搜收數樹殊水洙漱燧狩獸琇璲瘦睡秀穗竪粹綏綬繡羞脩茱蒐蓚藪袖誰讐輸遂邃酬銖銹隋隧隨雖需須首髓鬚叔塾夙孰宿淑潚熟琡璹肅菽巡徇循恂旬栒楯橓殉洵淳珣盾瞬筍純脣舜荀蓴蕣詢諄醇錞順馴戌術述鉥崇崧"],["e3a1","嵩瑟膝蝨濕拾習褶襲丞乘僧勝升承昇繩蠅陞侍匙嘶始媤尸屎屍市弑恃施是時枾柴猜矢示翅蒔蓍視試詩諡豕豺埴寔式息拭植殖湜熄篒蝕識軾食飾伸侁信呻娠宸愼新晨燼申神紳腎臣莘薪藎蜃訊身辛辰迅失室實悉審尋心沁"],["e4a1","沈深瀋甚芯諶什十拾雙氏亞俄兒啞娥峨我牙芽莪蛾衙訝阿雅餓鴉鵝堊岳嶽幄惡愕握樂渥鄂鍔顎鰐齷安岸按晏案眼雁鞍顔鮟斡謁軋閼唵岩巖庵暗癌菴闇壓押狎鴨仰央怏昻殃秧鴦厓哀埃崖愛曖涯碍艾隘靄厄扼掖液縊腋額"],["e5a1","櫻罌鶯鸚也倻冶夜惹揶椰爺耶若野弱掠略約若葯蒻藥躍亮佯兩凉壤孃恙揚攘敭暘梁楊樣洋瀁煬痒瘍禳穰糧羊良襄諒讓釀陽量養圄御於漁瘀禦語馭魚齬億憶抑檍臆偃堰彦焉言諺孼蘖俺儼嚴奄掩淹嶪業円予余勵呂女如廬"],["e6a1","旅歟汝濾璵礖礪與艅茹輿轝閭餘驪麗黎亦力域役易曆歷疫繹譯轢逆驛嚥堧姸娟宴年延憐戀捐挻撚椽沇沿涎涓淵演漣烟然煙煉燃燕璉硏硯秊筵緣練縯聯衍軟輦蓮連鉛鍊鳶列劣咽悅涅烈熱裂說閱厭廉念捻染殮炎焰琰艶苒"],["e7a1","簾閻髥鹽曄獵燁葉令囹塋寧嶺嶸影怜映暎楹榮永泳渶潁濚瀛瀯煐營獰玲瑛瑩瓔盈穎纓羚聆英詠迎鈴鍈零霙靈領乂倪例刈叡曳汭濊猊睿穢芮藝蘂禮裔詣譽豫醴銳隸霓預五伍俉傲午吾吳嗚塢墺奧娛寤悟惡懊敖旿晤梧汚澳"],["e8a1","烏熬獒筽蜈誤鰲鼇屋沃獄玉鈺溫瑥瘟穩縕蘊兀壅擁瓮甕癰翁邕雍饔渦瓦窩窪臥蛙蝸訛婉完宛梡椀浣玩琓琬碗緩翫脘腕莞豌阮頑曰往旺枉汪王倭娃歪矮外嵬巍猥畏了僚僥凹堯夭妖姚寥寮尿嶢拗搖撓擾料曜樂橈燎燿瑤療"],["e9a1","窈窯繇繞耀腰蓼蟯要謠遙遼邀饒慾欲浴縟褥辱俑傭冗勇埇墉容庸慂榕涌湧溶熔瑢用甬聳茸蓉踊鎔鏞龍于佑偶優又友右宇寓尤愚憂旴牛玗瑀盂祐禑禹紆羽芋藕虞迂遇郵釪隅雨雩勖彧旭昱栯煜稶郁頊云暈橒殞澐熉耘芸蕓"],["eaa1","運隕雲韻蔚鬱亐熊雄元原員圓園垣媛嫄寃怨愿援沅洹湲源爰猿瑗苑袁轅遠阮院願鴛月越鉞位偉僞危圍委威尉慰暐渭爲瑋緯胃萎葦蔿蝟衛褘謂違韋魏乳侑儒兪劉唯喩孺宥幼幽庾悠惟愈愉揄攸有杻柔柚柳楡楢油洧流游溜"],["eba1","濡猶猷琉瑜由留癒硫紐維臾萸裕誘諛諭踰蹂遊逾遺酉釉鍮類六堉戮毓肉育陸倫允奫尹崙淪潤玧胤贇輪鈗閏律慄栗率聿戎瀜絨融隆垠恩慇殷誾銀隱乙吟淫蔭陰音飮揖泣邑凝應膺鷹依倚儀宜意懿擬椅毅疑矣義艤薏蟻衣誼"],["eca1","議醫二以伊利吏夷姨履已弛彛怡易李梨泥爾珥理異痍痢移罹而耳肄苡荑裏裡貽貳邇里離飴餌匿溺瀷益翊翌翼謚人仁刃印吝咽因姻寅引忍湮燐璘絪茵藺蚓認隣靭靷鱗麟一佚佾壹日溢逸鎰馹任壬妊姙恁林淋稔臨荏賃入卄"],["eda1","立笠粒仍剩孕芿仔刺咨姉姿子字孜恣慈滋炙煮玆瓷疵磁紫者自茨蔗藉諮資雌作勺嚼斫昨灼炸爵綽芍酌雀鵲孱棧殘潺盞岑暫潛箴簪蠶雜丈仗匠場墻壯奬將帳庄張掌暲杖樟檣欌漿牆狀獐璋章粧腸臟臧莊葬蔣薔藏裝贓醬長"],["eea1","障再哉在宰才材栽梓渽滓災縡裁財載齋齎爭箏諍錚佇低儲咀姐底抵杵楮樗沮渚狙猪疽箸紵苧菹著藷詛貯躇這邸雎齟勣吊嫡寂摘敵滴狄炙的積笛籍績翟荻謫賊赤跡蹟迪迹適鏑佃佺傳全典前剪塡塼奠專展廛悛戰栓殿氈澱"],["efa1","煎琠田甸畑癲筌箋箭篆纏詮輾轉鈿銓錢鐫電顚顫餞切截折浙癤竊節絶占岾店漸点粘霑鮎點接摺蝶丁井亭停偵呈姃定幀庭廷征情挺政整旌晶晸柾楨檉正汀淀淨渟湞瀞炡玎珽町睛碇禎程穽精綎艇訂諪貞鄭酊釘鉦鋌錠霆靖"],["f0a1","靜頂鼎制劑啼堤帝弟悌提梯濟祭第臍薺製諸蹄醍除際霽題齊俎兆凋助嘲弔彫措操早晁曺曹朝條棗槽漕潮照燥爪璪眺祖祚租稠窕粗糟組繰肇藻蚤詔調趙躁造遭釣阻雕鳥族簇足鏃存尊卒拙猝倧宗從悰慫棕淙琮種終綜縱腫"],["f1a1","踪踵鍾鐘佐坐左座挫罪主住侏做姝胄呪周嗾奏宙州廚晝朱柱株注洲湊澍炷珠疇籌紂紬綢舟蛛註誅走躊輳週酎酒鑄駐竹粥俊儁准埈寯峻晙樽浚準濬焌畯竣蠢逡遵雋駿茁中仲衆重卽櫛楫汁葺增憎曾拯烝甑症繒蒸證贈之只"],["f2a1","咫地址志持指摯支旨智枝枳止池沚漬知砥祉祗紙肢脂至芝芷蜘誌識贄趾遲直稙稷織職唇嗔塵振搢晉晋桭榛殄津溱珍瑨璡畛疹盡眞瞋秦縉縝臻蔯袗診賑軫辰進鎭陣陳震侄叱姪嫉帙桎瓆疾秩窒膣蛭質跌迭斟朕什執潗緝輯"],["f3a1","鏶集徵懲澄且侘借叉嗟嵯差次此磋箚茶蹉車遮捉搾着窄錯鑿齪撰澯燦璨瓚竄簒纂粲纘讚贊鑽餐饌刹察擦札紮僭參塹慘慙懺斬站讒讖倉倡創唱娼廠彰愴敞昌昶暢槍滄漲猖瘡窓脹艙菖蒼債埰寀寨彩採砦綵菜蔡采釵冊柵策"],["f4a1","責凄妻悽處倜刺剔尺慽戚拓擲斥滌瘠脊蹠陟隻仟千喘天川擅泉淺玔穿舛薦賤踐遷釧闡阡韆凸哲喆徹撤澈綴輟轍鐵僉尖沾添甛瞻簽籤詹諂堞妾帖捷牒疊睫諜貼輒廳晴淸聽菁請靑鯖切剃替涕滯締諦逮遞體初剿哨憔抄招梢"],["f5a1","椒楚樵炒焦硝礁礎秒稍肖艸苕草蕉貂超酢醋醮促囑燭矗蜀觸寸忖村邨叢塚寵悤憁摠總聰蔥銃撮催崔最墜抽推椎楸樞湫皺秋芻萩諏趨追鄒酋醜錐錘鎚雛騶鰍丑畜祝竺筑築縮蓄蹙蹴軸逐春椿瑃出朮黜充忠沖蟲衝衷悴膵萃"],["f6a1","贅取吹嘴娶就炊翠聚脆臭趣醉驟鷲側仄厠惻測層侈値嗤峙幟恥梔治淄熾痔痴癡稚穉緇緻置致蚩輜雉馳齒則勅飭親七柒漆侵寢枕沈浸琛砧針鍼蟄秤稱快他咤唾墮妥惰打拖朶楕舵陀馱駝倬卓啄坼度托拓擢晫柝濁濯琢琸託"],["f7a1","鐸呑嘆坦彈憚歎灘炭綻誕奪脫探眈耽貪塔搭榻宕帑湯糖蕩兌台太怠態殆汰泰笞胎苔跆邰颱宅擇澤撑攄兎吐土討慟桶洞痛筒統通堆槌腿褪退頹偸套妬投透鬪慝特闖坡婆巴把播擺杷波派爬琶破罷芭跛頗判坂板版瓣販辦鈑"],["f8a1","阪八叭捌佩唄悖敗沛浿牌狽稗覇貝彭澎烹膨愎便偏扁片篇編翩遍鞭騙貶坪平枰萍評吠嬖幣廢弊斃肺蔽閉陛佈包匍匏咆哺圃布怖抛抱捕暴泡浦疱砲胞脯苞葡蒲袍褒逋鋪飽鮑幅暴曝瀑爆輻俵剽彪慓杓標漂瓢票表豹飇飄驃"],["f9a1","品稟楓諷豊風馮彼披疲皮被避陂匹弼必泌珌畢疋筆苾馝乏逼下何厦夏廈昰河瑕荷蝦賀遐霞鰕壑學虐謔鶴寒恨悍旱汗漢澣瀚罕翰閑閒限韓割轄函含咸啣喊檻涵緘艦銜陷鹹合哈盒蛤閤闔陜亢伉姮嫦巷恒抗杭桁沆港缸肛航"],["faa1","行降項亥偕咳垓奚孩害懈楷海瀣蟹解該諧邂駭骸劾核倖幸杏荇行享向嚮珦鄕響餉饗香噓墟虛許憲櫶獻軒歇險驗奕爀赫革俔峴弦懸晛泫炫玄玹現眩睍絃絢縣舷衒見賢鉉顯孑穴血頁嫌俠協夾峽挾浹狹脅脇莢鋏頰亨兄刑型"],["fba1","形泂滎瀅灐炯熒珩瑩荊螢衡逈邢鎣馨兮彗惠慧暳蕙蹊醯鞋乎互呼壕壺好岵弧戶扈昊晧毫浩淏湖滸澔濠濩灝狐琥瑚瓠皓祜糊縞胡芦葫蒿虎號蝴護豪鎬頀顥惑或酷婚昏混渾琿魂忽惚笏哄弘汞泓洪烘紅虹訌鴻化和嬅樺火畵"],["fca1","禍禾花華話譁貨靴廓擴攫確碻穫丸喚奐宦幻患換歡晥桓渙煥環紈還驩鰥活滑猾豁闊凰幌徨恍惶愰慌晃晄榥況湟滉潢煌璜皇篁簧荒蝗遑隍黃匯回廻徊恢悔懷晦會檜淮澮灰獪繪膾茴蛔誨賄劃獲宖橫鐄哮嚆孝效斅曉梟涍淆"],["fda1","爻肴酵驍侯候厚后吼喉嗅帿後朽煦珝逅勛勳塤壎焄熏燻薰訓暈薨喧暄煊萱卉喙毁彙徽揮暉煇諱輝麾休携烋畦虧恤譎鷸兇凶匈洶胸黑昕欣炘痕吃屹紇訖欠欽歆吸恰洽翕興僖凞喜噫囍姬嬉希憙憘戱晞曦熙熹熺犧禧稀羲詰"]]},{}],95:[function(e,t,r){
t.exports=[["0","\0",127],["a140","　，、。．‧；：？！︰…‥﹐﹑﹒·﹔﹕﹖﹗｜–︱—︳╴︴﹏（）︵︶｛｝︷︸〔〕︹︺【】︻︼《》︽︾〈〉︿﹀「」﹁﹂『』﹃﹄﹙﹚"],["a1a1","﹛﹜﹝﹞‘’“”〝〞‵′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼㊣℅¯￣＿ˍ﹉﹊﹍﹎﹋﹌﹟﹠﹡＋－×÷±√＜＞＝≦≧≠∞≒≡﹢",4,"～∩∪⊥∠∟⊿㏒㏑∫∮∵∴♀♂⊕⊙↑↓←→↖↗↙↘∥∣／"],["a240","＼∕﹨＄￥〒￠￡％＠℃℉﹩﹪﹫㏕㎜㎝㎞㏎㎡㎎㎏㏄°兙兛兞兝兡兣嗧瓩糎▁",7,"▏▎▍▌▋▊▉┼┴┬┤├▔─│▕┌┐└┘╭"],["a2a1","╮╰╯═╞╪╡◢◣◥◤╱╲╳０",9,"Ⅰ",9,"〡",8,"十卄卅Ａ",25,"ａ",21],["a340","ｗｘｙｚΑ",16,"Σ",6,"α",16,"σ",6,"ㄅ",10],["a3a1","ㄐ",25,"˙ˉˊˇˋ"],["a3e1","€"],["a440","一乙丁七乃九了二人儿入八几刀刁力匕十卜又三下丈上丫丸凡久么也乞于亡兀刃勺千叉口土士夕大女子孑孓寸小尢尸山川工己已巳巾干廾弋弓才"],["a4a1","丑丐不中丰丹之尹予云井互五亢仁什仃仆仇仍今介仄元允內六兮公冗凶分切刈勻勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈戶手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙"],["a540","世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉卡占卯卮去可古右召叮叩叨叼司叵叫另只史叱台句叭叻四囚外"],["a5a1","央失奴奶孕它尼巨巧左市布平幼弁弘弗必戊打扔扒扑斥旦朮本未末札正母民氐永汁汀氾犯玄玉瓜瓦甘生用甩田由甲申疋白皮皿目矛矢石示禾穴立丞丟乒乓乩亙交亦亥仿伉伙伊伕伍伐休伏仲件任仰仳份企伋光兇兆先全"],["a640","共再冰列刑划刎刖劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后吆吒因回囝圳地在圭圬圯圩夙多夷夸妄奸妃好她如妁字存宇守宅安寺尖屹州帆并年"],["a6a1","式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱朵次此死氖汝汗汙江池汐汕污汛汍汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃佔似但佣"],["a740","作你伯低伶余佝佈佚兌克免兵冶冷別判利刪刨劫助努劬匣即卵吝吭吞吾否呎吧呆呃吳呈呂君吩告吹吻吸吮吵吶吠吼呀吱含吟听囪困囤囫坊坑址坍"],["a7a1","均坎圾坐坏圻壯夾妝妒妨妞妣妙妖妍妤妓妊妥孝孜孚孛完宋宏尬局屁尿尾岐岑岔岌巫希序庇床廷弄弟彤形彷役忘忌志忍忱快忸忪戒我抄抗抖技扶抉扭把扼找批扳抒扯折扮投抓抑抆改攻攸旱更束李杏材村杜杖杞杉杆杠"],["a840","杓杗步每求汞沙沁沈沉沅沛汪決沐汰沌汨沖沒汽沃汲汾汴沆汶沍沔沘沂灶灼災灸牢牡牠狄狂玖甬甫男甸皂盯矣私秀禿究系罕肖肓肝肘肛肚育良芒"],["a8a1","芋芍見角言谷豆豕貝赤走足身車辛辰迂迆迅迄巡邑邢邪邦那酉釆里防阮阱阪阬並乖乳事些亞享京佯依侍佳使佬供例來侃佰併侈佩佻侖佾侏侑佺兔兒兕兩具其典冽函刻券刷刺到刮制剁劾劻卒協卓卑卦卷卸卹取叔受味呵"],["a940","咖呸咕咀呻呷咄咒咆呼咐呱呶和咚呢周咋命咎固垃坷坪坩坡坦坤坼夜奉奇奈奄奔妾妻委妹妮姑姆姐姍始姓姊妯妳姒姅孟孤季宗定官宜宙宛尚屈居"],["a9a1","屆岷岡岸岩岫岱岳帘帚帖帕帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏怔怯怵怖怪怕怡性怩怫怛或戕房戾所承拉拌拄抿拂抹拒招披拓拔拋拈抨抽押拐拙拇拍抵拚抱拘拖拗拆抬拎放斧於旺昔易昌昆昂明昀昏昕昊"],["aa40","昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚枓杼杪杲欣武歧歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊沬泯泜泖泠"],["aaa1","炕炎炒炊炙爬爭爸版牧物狀狎狙狗狐玩玨玟玫玥甽疝疙疚的盂盲直知矽社祀祁秉秈空穹竺糾罔羌羋者肺肥肢肱股肫肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸芣芰芾芷虎虱初表軋迎返近邵邸邱邶采金長門阜陀阿阻附"],["ab40","陂隹雨青非亟亭亮信侵侯便俠俑俏保促侶俘俟俊俗侮俐俄係俚俎俞侷兗冒冑冠剎剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨哎哉咸咦咳哇哂咽咪品"],["aba1","哄哈咯咫咱咻咩咧咿囿垂型垠垣垢城垮垓奕契奏奎奐姜姘姿姣姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙峒巷帝帥帟幽庠度建弈弭彥很待徊律徇後徉怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜挖按拼拭持拮拽指拱拷"],["ac40","拯括拾拴挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚查枸柏柞柳枰柙柢柝柒歪殃殆段毒毗氟泉洋洲洪流津洌洱洞洗"],["aca1","活洽派洶洛泵洹洧洸洩洮洵洎洫炫為炳炬炯炭炸炮炤爰牲牯牴狩狠狡玷珊玻玲珍珀玳甚甭畏界畎畋疫疤疥疢疣癸皆皇皈盈盆盃盅省盹相眉看盾盼眇矜砂研砌砍祆祉祈祇禹禺科秒秋穿突竿竽籽紂紅紀紉紇約紆缸美羿耄"],["ad40","耐耍耑耶胖胥胚胃胄背胡胛胎胞胤胝致舢苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟苯茆虐虹虻虺衍衫要觔計訂訃貞負赴赳趴軍軌述迦迢迪迥"],["ada1","迭迫迤迨郊郎郁郃酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳倌倍倣俯倦倥俸倩倖倆值借倚倒們俺倀倔倨俱倡個候倘俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖剜剔剛剝匪卿原厝叟哨唐唁唷哼哥哲唆哺唔哩哭員唉哮哪"],["ae40","哦唧唇哽唏圃圄埂埔埋埃堉夏套奘奚娑娘娜娟娛娓姬娠娣娩娥娌娉孫屘宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島崁峴差席師庫庭座弱徒徑徐恙"],["aea1","恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿捎挾振捕捂捆捏捉挺捐挽挪挫挨捍捌效敉料旁旅時晉晏晃晒晌晅晁書朔朕朗校核案框桓根桂桔栩梳栗桌桑栽柴桐桀格桃株桅栓栘桁殊殉殷氣氧氨氦氤泰浪涕消涇浦浸海浙涓"],["af40","浬涉浮浚浴浩涌涊浹涅浥涔烊烘烤烙烈烏爹特狼狹狽狸狷玆班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍盎眩真眠眨矩砰砧砸砝破砷"],["afa1","砥砭砠砟砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂胰脅胭胴脆胸胳脈能脊胼胯臭臬舀舐航舫舨般芻茫荒荔荊茸荐草茵茴荏茲茹茶茗荀茱茨荃"],["b040","虔蚊蚪蚓蚤蚩蚌蚣蚜衰衷袁袂衽衹記訐討訌訕訊託訓訖訏訑豈豺豹財貢起躬軒軔軏辱送逆迷退迺迴逃追逅迸邕郡郝郢酒配酌釘針釗釜釙閃院陣陡"],["b0a1","陛陝除陘陞隻飢馬骨高鬥鬲鬼乾偺偽停假偃偌做偉健偶偎偕偵側偷偏倏偯偭兜冕凰剪副勒務勘動匐匏匙匿區匾參曼商啪啦啄啞啡啃啊唱啖問啕唯啤唸售啜唬啣唳啁啗圈國圉域堅堊堆埠埤基堂堵執培夠奢娶婁婉婦婪婀"],["b140","娼婢婚婆婊孰寇寅寄寂宿密尉專將屠屜屝崇崆崎崛崖崢崑崩崔崙崤崧崗巢常帶帳帷康庸庶庵庾張強彗彬彩彫得徙從徘御徠徜恿患悉悠您惋悴惦悽"],["b1a1","情悻悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措捱掩掉掃掛捫推掄授掙採掬排掏掀捻捩捨捺敝敖救教敗啟敏敘敕敔斜斛斬族旋旌旎晝晚晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭梆梅梔條梨梟梡梂欲殺"],["b240","毫毬氫涎涼淳淙液淡淌淤添淺清淇淋涯淑涮淞淹涸混淵淅淒渚涵淚淫淘淪深淮淨淆淄涪淬涿淦烹焉焊烽烯爽牽犁猜猛猖猓猙率琅琊球理現琍瓠瓶"],["b2a1","瓷甜產略畦畢異疏痔痕疵痊痍皎盔盒盛眷眾眼眶眸眺硫硃硎祥票祭移窒窕笠笨笛第符笙笞笮粒粗粕絆絃統紮紹紼絀細紳組累終紲紱缽羞羚翌翎習耜聊聆脯脖脣脫脩脰脤舂舵舷舶船莎莞莘荸莢莖莽莫莒莊莓莉莠荷荻荼"],["b340","莆莧處彪蛇蛀蚶蛄蚵蛆蛋蚱蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛訢豉豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖逛途"],["b3a1","部郭都酗野釵釦釣釧釭釩閉陪陵陳陸陰陴陶陷陬雀雪雩章竟頂頃魚鳥鹵鹿麥麻傢傍傅備傑傀傖傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘喂喜喪喔喇喋喃喳單喟唾喲喚喻喬喱啾喉喫喙圍堯堪場堤堰報堡堝堠壹壺奠"],["b440","婷媚婿媒媛媧孳孱寒富寓寐尊尋就嵌嵐崴嵇巽幅帽幀幃幾廊廁廂廄弼彭復循徨惑惡悲悶惠愜愣惺愕惰惻惴慨惱愎惶愉愀愒戟扉掣掌描揀揩揉揆揍"],["b4a1","插揣提握揖揭揮捶援揪換摒揚揹敞敦敢散斑斐斯普晰晴晶景暑智晾晷曾替期朝棺棕棠棘棗椅棟棵森棧棹棒棲棣棋棍植椒椎棉棚楮棻款欺欽殘殖殼毯氮氯氬港游湔渡渲湧湊渠渥渣減湛湘渤湖湮渭渦湯渴湍渺測湃渝渾滋"],["b540","溉渙湎湣湄湲湩湟焙焚焦焰無然煮焜牌犄犀猶猥猴猩琺琪琳琢琥琵琶琴琯琛琦琨甥甦畫番痢痛痣痙痘痞痠登發皖皓皴盜睏短硝硬硯稍稈程稅稀窘"],["b5a1","窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨絕紫絮絲絡給絢絰絳善翔翕耋聒肅腕腔腋腑腎脹腆脾腌腓腴舒舜菩萃菸萍菠菅萋菁華菱菴著萊菰萌菌菽菲菊萸萎萄菜萇菔菟虛蛟蛙蛭蛔蛛蛤蛐蛞街裁裂袱覃視註詠評詞証詁"],["b640","詔詛詐詆訴診訶詖象貂貯貼貳貽賁費賀貴買貶貿貸越超趁跎距跋跚跑跌跛跆軻軸軼辜逮逵週逸進逶鄂郵鄉郾酣酥量鈔鈕鈣鈉鈞鈍鈐鈇鈑閔閏開閑"],["b6a1","間閒閎隊階隋陽隅隆隍陲隄雁雅雄集雇雯雲韌項順須飧飪飯飩飲飭馮馭黃黍黑亂傭債傲傳僅傾催傷傻傯僇剿剷剽募勦勤勢勣匯嗟嗨嗓嗦嗎嗜嗇嗑嗣嗤嗯嗚嗡嗅嗆嗥嗉園圓塞塑塘塗塚塔填塌塭塊塢塒塋奧嫁嫉嫌媾媽媼"],["b740","媳嫂媲嵩嵯幌幹廉廈弒彙徬微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡戢搓搾搞搪搭搽搬搏搜搔損搶搖搗搆敬斟新暗暉暇暈暖暄暘暍會榔業"],["b7a1","楚楷楠楔極椰概楊楨楫楞楓楹榆楝楣楛歇歲毀殿毓毽溢溯滓溶滂源溝滇滅溥溘溼溺溫滑準溜滄滔溪溧溴煎煙煩煤煉照煜煬煦煌煥煞煆煨煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸瘀痰瘁痲痱痺痿痴痳盞盟睛睫睦睞督"],["b840","睹睪睬睜睥睨睢矮碎碰碗碘碌碉硼碑碓硿祺祿禁萬禽稜稚稠稔稟稞窟窠筷節筠筮筧粱粳粵經絹綑綁綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮腳腫"],["b8a1","腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹蜓蜈蜇蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡裊裕裒覜解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹詻訾詨豢貊貉賊資賈賄貲賃賂賅跡跟跨路跳跺跪跤跦躲較載軾輊"],["b940","辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒鄗酬酪酩釉鈷鉗鈸鈽鉀鈾鉛鉋鉤鉑鈴鉉鉍鉅鈹鈿鉚閘隘隔隕雍雋雉雊雷電雹零靖靴靶預頑頓頊頒頌飼飴"],["b9a1","飽飾馳馱馴髡鳩麂鼎鼓鼠僧僮僥僖僭僚僕像僑僱僎僩兢凳劃劂匱厭嗾嘀嘛嘗嗽嘔嘆嘉嘍嘎嗷嘖嘟嘈嘐嗶團圖塵塾境墓墊塹墅塽壽夥夢夤奪奩嫡嫦嫩嫗嫖嫘嫣孵寞寧寡寥實寨寢寤察對屢嶄嶇幛幣幕幗幔廓廖弊彆彰徹慇"],["ba40","愿態慷慢慣慟慚慘慵截撇摘摔撤摸摟摺摑摧搴摭摻敲斡旗旖暢暨暝榜榨榕槁榮槓構榛榷榻榫榴槐槍榭槌榦槃榣歉歌氳漳演滾漓滴漩漾漠漬漏漂漢"],["baa1","滿滯漆漱漸漲漣漕漫漯澈漪滬漁滲滌滷熔熙煽熊熄熒爾犒犖獄獐瑤瑣瑪瑰瑭甄疑瘧瘍瘋瘉瘓盡監瞄睽睿睡磁碟碧碳碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇箄粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬"],["bb40","罰翠翡翟聞聚肇腐膀膏膈膊腿膂臧臺與舔舞艋蓉蒿蓆蓄蒙蒞蒲蒜蓋蒸蓀蓓蒐蒼蓑蓊蜿蜜蜻蜢蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨褚裯誦誌語誣認誡誓誤"],["bba1","說誥誨誘誑誚誧豪貍貌賓賑賒赫趙趕跼輔輒輕輓辣遠遘遜遣遙遞遢遝遛鄙鄘鄞酵酸酷酴鉸銀銅銘銖鉻銓銜銨鉼銑閡閨閩閣閥閤隙障際雌雒需靼鞅韶頗領颯颱餃餅餌餉駁骯骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂儈儉儅凜"],["bc40","劇劈劉劍劊勰厲嘮嘻嘹嘲嘿嘴嘩噓噎噗噴嘶嘯嘰墀墟增墳墜墮墩墦奭嬉嫻嬋嫵嬌嬈寮寬審寫層履嶝嶔幢幟幡廢廚廟廝廣廠彈影德徵慶慧慮慝慕憂"],["bca1","慼慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯摹撞撲撈撐撰撥撓撕撩撒撮播撫撚撬撙撢撳敵敷數暮暫暴暱樣樟槨樁樞標槽模樓樊槳樂樅槭樑歐歎殤毅毆漿潼澄潑潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯潠潟熟熬熱熨牖犛獎獗瑩璋璃"],["bd40","瑾璀畿瘠瘩瘟瘤瘦瘡瘢皚皺盤瞎瞇瞌瞑瞋磋磅確磊碾磕碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁箠篌糊締練緯緻緘緬緝編緣線緞緩綞緙緲緹罵罷羯"],["bda1","翩耦膛膜膝膠膚膘蔗蔽蔚蓮蔬蔭蔓蔑蔣蔡蔔蓬蔥蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓褕褊誼諒談諄誕請諸課諉諂調誰論諍誶誹諛豌豎豬賠賞賦賤賬賭賢賣賜質賡赭趟趣踫踐踝踢踏踩踟踡踞躺輝輛輟輩輦輪輜輞"],["be40","輥適遮遨遭遷鄰鄭鄧鄱醇醉醋醃鋅銻銷鋪銬鋤鋁銳銼鋒鋇鋰銲閭閱霄霆震霉靠鞍鞋鞏頡頫頜颳養餓餒餘駝駐駟駛駑駕駒駙骷髮髯鬧魅魄魷魯鴆鴉"],["bea1","鴃麩麾黎墨齒儒儘儔儐儕冀冪凝劑劓勳噙噫噹噩噤噸噪器噥噱噯噬噢噶壁墾壇壅奮嬝嬴學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁擋撻撼據擄擇擂操撿擒擔撾整曆曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙歷氅濂澱澡"],["bf40","濃澤濁澧澳激澹澶澦澠澴熾燉燐燒燈燕熹燎燙燜燃燄獨璜璣璘璟璞瓢甌甍瘴瘸瘺盧盥瞠瞞瞟瞥磨磚磬磧禦積穎穆穌穋窺篙簑築篤篛篡篩篦糕糖縊"],["bfa1","縑縈縛縣縞縝縉縐罹羲翰翱翮耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪蕞螃螟螞螢融衡褪褲褥褫褡親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶諼豫豭貓賴蹄踱踴蹂踹踵輻輯輸輳辨辦遵遴選遲遼遺鄴醒錠錶鋸錳錯錢鋼錫錄錚"],["c040","錐錦錡錕錮錙閻隧隨險雕霎霑霖霍霓霏靛靜靦鞘頰頸頻頷頭頹頤餐館餞餛餡餚駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵嚎嚀嚐嚅嚇"],["c0a1","嚏壕壓壑壎嬰嬪嬤孺尷屨嶼嶺嶽嶸幫彌徽應懂懇懦懋戲戴擎擊擘擠擰擦擬擱擢擭斂斃曙曖檀檔檄檢檜櫛檣橾檗檐檠歜殮毚氈濘濱濟濠濛濤濫濯澀濬濡濩濕濮濰燧營燮燦燥燭燬燴燠爵牆獰獲璩環璦璨癆療癌盪瞳瞪瞰瞬"],["c140","瞧瞭矯磷磺磴磯礁禧禪穗窿簇簍篾篷簌篠糠糜糞糢糟糙糝縮績繆縷縲繃縫總縱繅繁縴縹繈縵縿縯罄翳翼聱聲聰聯聳臆臃膺臂臀膿膽臉膾臨舉艱薪"],["c1a1","薄蕾薜薑薔薯薛薇薨薊虧蟀蟑螳蟒蟆螫螻螺蟈蟋褻褶襄褸褽覬謎謗謙講謊謠謝謄謐豁谿豳賺賽購賸賻趨蹉蹋蹈蹊轄輾轂轅輿避遽還邁邂邀鄹醣醞醜鍍鎂錨鍵鍊鍥鍋錘鍾鍬鍛鍰鍚鍔闊闋闌闈闆隱隸雖霜霞鞠韓顆颶餵騁"],["c240","駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢嚕嚮壙壘嬸彝懣戳擴擲擾攆擺擻擷斷曜朦檳檬櫃檻檸櫂檮檯歟歸殯瀉瀋濾瀆濺瀑瀏燻燼燾燸獷獵璧璿甕癖癘"],["c2a1","癒瞽瞿瞻瞼礎禮穡穢穠竄竅簫簧簪簞簣簡糧織繕繞繚繡繒繙罈翹翻職聶臍臏舊藏薩藍藐藉薰薺薹薦蟯蟬蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣蹦蹤蹟蹕軀轉轍邇邃邈醫醬釐鎔鎊鎖鎢鎳鎮鎬鎰鎘鎚鎗闔闖闐闕離雜雙雛雞霤鞣鞦"],["c340","鞭韹額顏題顎顓颺餾餿餽餮馥騎髁鬃鬆魏魎魍鯊鯉鯽鯈鯀鵑鵝鵠黠鼕鼬儳嚥壞壟壢寵龐廬懲懷懶懵攀攏曠曝櫥櫝櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸"],["c3a1","獺璽瓊瓣疇疆癟癡矇礙禱穫穩簾簿簸簽簷籀繫繭繹繩繪羅繳羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏譆譙贈贊蹼蹲躇蹶蹬蹺蹴轔轎辭邊邋醱醮鏡鏑鏟鏃鏈鏜鏝鏖鏢鏍鏘鏤鏗鏨關隴難霪霧靡韜韻類"],["c440","願顛颼饅饉騖騙鬍鯨鯧鯖鯛鶉鵡鵲鵪鵬麒麗麓麴勸嚨嚷嚶嚴嚼壤孀孃孽寶巉懸懺攘攔攙曦朧櫬瀾瀰瀲爐獻瓏癢癥礦礪礬礫竇競籌籃籍糯糰辮繽繼"],["c4a1","纂罌耀臚艦藻藹蘑藺蘆蘋蘇蘊蠔蠕襤覺觸議譬警譯譟譫贏贍躉躁躅躂醴釋鐘鐃鏽闡霰飄饒饑馨騫騰騷騵鰓鰍鹹麵黨鼯齟齣齡儷儸囁囀囂夔屬巍懼懾攝攜斕曩櫻欄櫺殲灌爛犧瓖瓔癩矓籐纏續羼蘗蘭蘚蠣蠢蠡蠟襪襬覽譴"],["c540","護譽贓躊躍躋轟辯醺鐮鐳鐵鐺鐸鐲鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯鼙齜齦齧儼儻囈囊囉孿巔巒彎懿攤權歡灑灘玀瓤疊癮癬"],["c5a1","禳籠籟聾聽臟襲襯觼讀贖贗躑躓轡酈鑄鑑鑒霽霾韃韁顫饕驕驍髒鬚鱉鰱鰾鰻鷓鷗鼴齬齪龔囌巖戀攣攫攪曬欐瓚竊籤籣籥纓纖纔臢蘸蘿蠱變邐邏鑣鑠鑤靨顯饜驚驛驗髓體髑鱔鱗鱖鷥麟黴囑壩攬灞癱癲矗罐羈蠶蠹衢讓讒"],["c640","讖艷贛釀鑪靂靈靄韆顰驟鬢魘鱟鷹鷺鹼鹽鼇齷齲廳欖灣籬籮蠻觀躡釁鑲鑰顱饞髖鬣黌灤矚讚鑷韉驢驥纜讜躪釅鑽鑾鑼鱷鱸黷豔鑿鸚爨驪鬱鸛鸞籲"],["c940","乂乜凵匚厂万丌乇亍囗兀屮彳丏冇与丮亓仂仉仈冘勼卬厹圠夃夬尐巿旡殳毌气爿丱丼仨仜仩仡仝仚刌匜卌圢圣夗夯宁宄尒尻屴屳帄庀庂忉戉扐氕"],["c9a1","氶汃氿氻犮犰玊禸肊阞伎优伬仵伔仱伀价伈伝伂伅伢伓伄仴伒冱刓刉刐劦匢匟卍厊吇囡囟圮圪圴夼妀奼妅奻奾奷奿孖尕尥屼屺屻屾巟幵庄异弚彴忕忔忏扜扞扤扡扦扢扙扠扚扥旯旮朾朹朸朻机朿朼朳氘汆汒汜汏汊汔汋"],["ca40","汌灱牞犴犵玎甪癿穵网艸艼芀艽艿虍襾邙邗邘邛邔阢阤阠阣佖伻佢佉体佤伾佧佒佟佁佘伭伳伿佡冏冹刜刞刡劭劮匉卣卲厎厏吰吷吪呔呅吙吜吥吘"],["caa1","吽呏呁吨吤呇囮囧囥坁坅坌坉坋坒夆奀妦妘妠妗妎妢妐妏妧妡宎宒尨尪岍岏岈岋岉岒岊岆岓岕巠帊帎庋庉庌庈庍弅弝彸彶忒忑忐忭忨忮忳忡忤忣忺忯忷忻怀忴戺抃抌抎抏抔抇扱扻扺扰抁抈扷扽扲扴攷旰旴旳旲旵杅杇"],["cb40","杙杕杌杈杝杍杚杋毐氙氚汸汧汫沄沋沏汱汯汩沚汭沇沕沜汦汳汥汻沎灴灺牣犿犽狃狆狁犺狅玕玗玓玔玒町甹疔疕皁礽耴肕肙肐肒肜芐芏芅芎芑芓"],["cba1","芊芃芄豸迉辿邟邡邥邞邧邠阰阨阯阭丳侘佼侅佽侀侇佶佴侉侄佷佌侗佪侚佹侁佸侐侜侔侞侒侂侕佫佮冞冼冾刵刲刳剆刱劼匊匋匼厒厔咇呿咁咑咂咈呫呺呾呥呬呴呦咍呯呡呠咘呣呧呤囷囹坯坲坭坫坱坰坶垀坵坻坳坴坢"],["cc40","坨坽夌奅妵妺姏姎妲姌姁妶妼姃姖妱妽姀姈妴姇孢孥宓宕屄屇岮岤岠岵岯岨岬岟岣岭岢岪岧岝岥岶岰岦帗帔帙弨弢弣弤彔徂彾彽忞忥怭怦怙怲怋"],["cca1","怴怊怗怳怚怞怬怢怍怐怮怓怑怌怉怜戔戽抭抴拑抾抪抶拊抮抳抯抻抩抰抸攽斨斻昉旼昄昒昈旻昃昋昍昅旽昑昐曶朊枅杬枎枒杶杻枘枆构杴枍枌杺枟枑枙枃杽极杸杹枔欥殀歾毞氝沓泬泫泮泙沶泔沭泧沷泐泂沺泃泆泭泲"],["cd40","泒泝沴沊沝沀泞泀洰泍泇沰泹泏泩泑炔炘炅炓炆炄炑炖炂炚炃牪狖狋狘狉狜狒狔狚狌狑玤玡玭玦玢玠玬玝瓝瓨甿畀甾疌疘皯盳盱盰盵矸矼矹矻矺"],["cda1","矷祂礿秅穸穻竻籵糽耵肏肮肣肸肵肭舠芠苀芫芚芘芛芵芧芮芼芞芺芴芨芡芩苂芤苃芶芢虰虯虭虮豖迒迋迓迍迖迕迗邲邴邯邳邰阹阽阼阺陃俍俅俓侲俉俋俁俔俜俙侻侳俛俇俖侺俀侹俬剄剉勀勂匽卼厗厖厙厘咺咡咭咥哏"],["ce40","哃茍咷咮哖咶哅哆咠呰咼咢咾呲哞咰垵垞垟垤垌垗垝垛垔垘垏垙垥垚垕壴复奓姡姞姮娀姱姝姺姽姼姶姤姲姷姛姩姳姵姠姾姴姭宨屌峐峘峌峗峋峛"],["cea1","峞峚峉峇峊峖峓峔峏峈峆峎峟峸巹帡帢帣帠帤庰庤庢庛庣庥弇弮彖徆怷怹恔恲恞恅恓恇恉恛恌恀恂恟怤恄恘恦恮扂扃拏挍挋拵挎挃拫拹挏挌拸拶挀挓挔拺挕拻拰敁敃斪斿昶昡昲昵昜昦昢昳昫昺昝昴昹昮朏朐柁柲柈枺"],["cf40","柜枻柸柘柀枷柅柫柤柟枵柍枳柷柶柮柣柂枹柎柧柰枲柼柆柭柌枮柦柛柺柉柊柃柪柋欨殂殄殶毖毘毠氠氡洨洴洭洟洼洿洒洊泚洳洄洙洺洚洑洀洝浂"],["cfa1","洁洘洷洃洏浀洇洠洬洈洢洉洐炷炟炾炱炰炡炴炵炩牁牉牊牬牰牳牮狊狤狨狫狟狪狦狣玅珌珂珈珅玹玶玵玴珫玿珇玾珃珆玸珋瓬瓮甮畇畈疧疪癹盄眈眃眄眅眊盷盻盺矧矨砆砑砒砅砐砏砎砉砃砓祊祌祋祅祄秕种秏秖秎窀"],["d040","穾竑笀笁籺籸籹籿粀粁紃紈紁罘羑羍羾耇耎耏耔耷胘胇胠胑胈胂胐胅胣胙胜胊胕胉胏胗胦胍臿舡芔苙苾苹茇苨茀苕茺苫苖苴苬苡苲苵茌苻苶苰苪"],["d0a1","苤苠苺苳苭虷虴虼虳衁衎衧衪衩觓訄訇赲迣迡迮迠郱邽邿郕郅邾郇郋郈釔釓陔陏陑陓陊陎倞倅倇倓倢倰倛俵俴倳倷倬俶俷倗倜倠倧倵倯倱倎党冔冓凊凄凅凈凎剡剚剒剞剟剕剢勍匎厞唦哢唗唒哧哳哤唚哿唄唈哫唑唅哱"],["d140","唊哻哷哸哠唎唃唋圁圂埌堲埕埒垺埆垽垼垸垶垿埇埐垹埁夎奊娙娖娭娮娕娏娗娊娞娳孬宧宭宬尃屖屔峬峿峮峱峷崀峹帩帨庨庮庪庬弳弰彧恝恚恧"],["d1a1","恁悢悈悀悒悁悝悃悕悛悗悇悜悎戙扆拲挐捖挬捄捅挶捃揤挹捋捊挼挩捁挴捘捔捙挭捇挳捚捑挸捗捀捈敊敆旆旃旄旂晊晟晇晑朒朓栟栚桉栲栳栻桋桏栖栱栜栵栫栭栯桎桄栴栝栒栔栦栨栮桍栺栥栠欬欯欭欱欴歭肂殈毦毤"],["d240","毨毣毢毧氥浺浣浤浶洍浡涒浘浢浭浯涑涍淯浿涆浞浧浠涗浰浼浟涂涘洯浨涋浾涀涄洖涃浻浽浵涐烜烓烑烝烋缹烢烗烒烞烠烔烍烅烆烇烚烎烡牂牸"],["d2a1","牷牶猀狺狴狾狶狳狻猁珓珙珥珖玼珧珣珩珜珒珛珔珝珚珗珘珨瓞瓟瓴瓵甡畛畟疰痁疻痄痀疿疶疺皊盉眝眛眐眓眒眣眑眕眙眚眢眧砣砬砢砵砯砨砮砫砡砩砳砪砱祔祛祏祜祓祒祑秫秬秠秮秭秪秜秞秝窆窉窅窋窌窊窇竘笐"],["d340","笄笓笅笏笈笊笎笉笒粄粑粊粌粈粍粅紞紝紑紎紘紖紓紟紒紏紌罜罡罞罠罝罛羖羒翃翂翀耖耾耹胺胲胹胵脁胻脀舁舯舥茳茭荄茙荑茥荖茿荁茦茜茢"],["d3a1","荂荎茛茪茈茼荍茖茤茠茷茯茩荇荅荌荓茞茬荋茧荈虓虒蚢蚨蚖蚍蚑蚞蚇蚗蚆蚋蚚蚅蚥蚙蚡蚧蚕蚘蚎蚝蚐蚔衃衄衭衵衶衲袀衱衿衯袃衾衴衼訒豇豗豻貤貣赶赸趵趷趶軑軓迾迵适迿迻逄迼迶郖郠郙郚郣郟郥郘郛郗郜郤酐"],["d440","酎酏釕釢釚陜陟隼飣髟鬯乿偰偪偡偞偠偓偋偝偲偈偍偁偛偊偢倕偅偟偩偫偣偤偆偀偮偳偗偑凐剫剭剬剮勖勓匭厜啵啶唼啍啐唴唪啑啢唶唵唰啒啅"],["d4a1","唌唲啥啎唹啈唭唻啀啋圊圇埻堔埢埶埜埴堀埭埽堈埸堋埳埏堇埮埣埲埥埬埡堎埼堐埧堁堌埱埩埰堍堄奜婠婘婕婧婞娸娵婭婐婟婥婬婓婤婗婃婝婒婄婛婈媎娾婍娹婌婰婩婇婑婖婂婜孲孮寁寀屙崞崋崝崚崠崌崨崍崦崥崏"],["d540","崰崒崣崟崮帾帴庱庴庹庲庳弶弸徛徖徟悊悐悆悾悰悺惓惔惏惤惙惝惈悱惛悷惊悿惃惍惀挲捥掊掂捽掽掞掭掝掗掫掎捯掇掐据掯捵掜捭掮捼掤挻掟"],["d5a1","捸掅掁掑掍捰敓旍晥晡晛晙晜晢朘桹梇梐梜桭桮梮梫楖桯梣梬梩桵桴梲梏桷梒桼桫桲梪梀桱桾梛梖梋梠梉梤桸桻梑梌梊桽欶欳欷欸殑殏殍殎殌氪淀涫涴涳湴涬淩淢涷淶淔渀淈淠淟淖涾淥淜淝淛淴淊涽淭淰涺淕淂淏淉"],["d640","淐淲淓淽淗淍淣涻烺焍烷焗烴焌烰焄烳焐烼烿焆焓焀烸烶焋焂焎牾牻牼牿猝猗猇猑猘猊猈狿猏猞玈珶珸珵琄琁珽琇琀珺珼珿琌琋珴琈畤畣痎痒痏"],["d6a1","痋痌痑痐皏皉盓眹眯眭眱眲眴眳眽眥眻眵硈硒硉硍硊硌砦硅硐祤祧祩祪祣祫祡离秺秸秶秷窏窔窐笵筇笴笥笰笢笤笳笘笪笝笱笫笭笯笲笸笚笣粔粘粖粣紵紽紸紶紺絅紬紩絁絇紾紿絊紻紨罣羕羜羝羛翊翋翍翐翑翇翏翉耟"],["d740","耞耛聇聃聈脘脥脙脛脭脟脬脞脡脕脧脝脢舑舸舳舺舴舲艴莐莣莨莍荺荳莤荴莏莁莕莙荵莔莩荽莃莌莝莛莪莋荾莥莯莈莗莰荿莦莇莮荶莚虙虖蚿蚷"],["d7a1","蛂蛁蛅蚺蚰蛈蚹蚳蚸蛌蚴蚻蚼蛃蚽蚾衒袉袕袨袢袪袚袑袡袟袘袧袙袛袗袤袬袌袓袎覂觖觙觕訰訧訬訞谹谻豜豝豽貥赽赻赹趼跂趹趿跁軘軞軝軜軗軠軡逤逋逑逜逌逡郯郪郰郴郲郳郔郫郬郩酖酘酚酓酕釬釴釱釳釸釤釹釪"],["d840","釫釷釨釮镺閆閈陼陭陫陱陯隿靪頄飥馗傛傕傔傞傋傣傃傌傎傝偨傜傒傂傇兟凔匒匑厤厧喑喨喥喭啷噅喢喓喈喏喵喁喣喒喤啽喌喦啿喕喡喎圌堩堷"],["d8a1","堙堞堧堣堨埵塈堥堜堛堳堿堶堮堹堸堭堬堻奡媯媔媟婺媢媞婸媦婼媥媬媕媮娷媄媊媗媃媋媩婻婽媌媜媏媓媝寪寍寋寔寑寊寎尌尰崷嵃嵫嵁嵋崿崵嵑嵎嵕崳崺嵒崽崱嵙嵂崹嵉崸崼崲崶嵀嵅幄幁彘徦徥徫惉悹惌惢惎惄愔"],["d940","惲愊愖愅惵愓惸惼惾惁愃愘愝愐惿愄愋扊掔掱掰揎揥揨揯揃撝揳揊揠揶揕揲揵摡揟掾揝揜揄揘揓揂揇揌揋揈揰揗揙攲敧敪敤敜敨敥斌斝斞斮旐旒"],["d9a1","晼晬晻暀晱晹晪晲朁椌棓椄棜椪棬棪棱椏棖棷棫棤棶椓椐棳棡椇棌椈楰梴椑棯棆椔棸棐棽棼棨椋椊椗棎棈棝棞棦棴棑椆棔棩椕椥棇欹欻欿欼殔殗殙殕殽毰毲毳氰淼湆湇渟湉溈渼渽湅湢渫渿湁湝湳渜渳湋湀湑渻渃渮湞"],["da40","湨湜湡渱渨湠湱湫渹渢渰湓湥渧湸湤湷湕湹湒湦渵渶湚焠焞焯烻焮焱焣焥焢焲焟焨焺焛牋牚犈犉犆犅犋猒猋猰猢猱猳猧猲猭猦猣猵猌琮琬琰琫琖"],["daa1","琚琡琭琱琤琣琝琩琠琲瓻甯畯畬痧痚痡痦痝痟痤痗皕皒盚睆睇睄睍睅睊睎睋睌矞矬硠硤硥硜硭硱硪确硰硩硨硞硢祴祳祲祰稂稊稃稌稄窙竦竤筊笻筄筈筌筎筀筘筅粢粞粨粡絘絯絣絓絖絧絪絏絭絜絫絒絔絩絑絟絎缾缿罥"],["db40","罦羢羠羡翗聑聏聐胾胔腃腊腒腏腇脽腍脺臦臮臷臸臹舄舼舽舿艵茻菏菹萣菀菨萒菧菤菼菶萐菆菈菫菣莿萁菝菥菘菿菡菋菎菖菵菉萉萏菞萑萆菂菳"],["dba1","菕菺菇菑菪萓菃菬菮菄菻菗菢萛菛菾蛘蛢蛦蛓蛣蛚蛪蛝蛫蛜蛬蛩蛗蛨蛑衈衖衕袺裗袹袸裀袾袶袼袷袽袲褁裉覕覘覗觝觚觛詎詍訹詙詀詗詘詄詅詒詈詑詊詌詏豟貁貀貺貾貰貹貵趄趀趉跘跓跍跇跖跜跏跕跙跈跗跅軯軷軺"],["dc40","軹軦軮軥軵軧軨軶軫軱軬軴軩逭逴逯鄆鄬鄄郿郼鄈郹郻鄁鄀鄇鄅鄃酡酤酟酢酠鈁鈊鈥鈃鈚鈦鈏鈌鈀鈒釿釽鈆鈄鈧鈂鈜鈤鈙鈗鈅鈖镻閍閌閐隇陾隈"],["dca1","隉隃隀雂雈雃雱雰靬靰靮頇颩飫鳦黹亃亄亶傽傿僆傮僄僊傴僈僂傰僁傺傱僋僉傶傸凗剺剸剻剼嗃嗛嗌嗐嗋嗊嗝嗀嗔嗄嗩喿嗒喍嗏嗕嗢嗖嗈嗲嗍嗙嗂圔塓塨塤塏塍塉塯塕塎塝塙塥塛堽塣塱壼嫇嫄嫋媺媸媱媵媰媿嫈媻嫆"],["dd40","媷嫀嫊媴媶嫍媹媐寖寘寙尟尳嵱嵣嵊嵥嵲嵬嵞嵨嵧嵢巰幏幎幊幍幋廅廌廆廋廇彀徯徭惷慉慊愫慅愶愲愮慆愯慏愩慀戠酨戣戥戤揅揱揫搐搒搉搠搤"],["dda1","搳摃搟搕搘搹搷搢搣搌搦搰搨摁搵搯搊搚摀搥搧搋揧搛搮搡搎敯斒旓暆暌暕暐暋暊暙暔晸朠楦楟椸楎楢楱椿楅楪椹楂楗楙楺楈楉椵楬椳椽楥棰楸椴楩楀楯楄楶楘楁楴楌椻楋椷楜楏楑椲楒椯楻椼歆歅歃歂歈歁殛嗀毻毼"],["de40","毹毷毸溛滖滈溏滀溟溓溔溠溱溹滆滒溽滁溞滉溷溰滍溦滏溲溾滃滜滘溙溒溎溍溤溡溿溳滐滊溗溮溣煇煔煒煣煠煁煝煢煲煸煪煡煂煘煃煋煰煟煐煓"],["dea1","煄煍煚牏犍犌犑犐犎猼獂猻猺獀獊獉瑄瑊瑋瑒瑑瑗瑀瑏瑐瑎瑂瑆瑍瑔瓡瓿瓾瓽甝畹畷榃痯瘏瘃痷痾痼痹痸瘐痻痶痭痵痽皙皵盝睕睟睠睒睖睚睩睧睔睙睭矠碇碚碔碏碄碕碅碆碡碃硹碙碀碖硻祼禂祽祹稑稘稙稒稗稕稢稓"],["df40","稛稐窣窢窞竫筦筤筭筴筩筲筥筳筱筰筡筸筶筣粲粴粯綈綆綀綍絿綅絺綎絻綃絼綌綔綄絽綒罭罫罧罨罬羦羥羧翛翜耡腤腠腷腜腩腛腢腲朡腞腶腧腯"],["dfa1","腄腡舝艉艄艀艂艅蓱萿葖葶葹蒏蒍葥葑葀蒆葧萰葍葽葚葙葴葳葝蔇葞萷萺萴葺葃葸萲葅萩菙葋萯葂萭葟葰萹葎葌葒葯蓅蒎萻葇萶萳葨葾葄萫葠葔葮葐蜋蜄蛷蜌蛺蛖蛵蝍蛸蜎蜉蜁蛶蜍蜅裖裋裍裎裞裛裚裌裐覅覛觟觥觤"],["e040","觡觠觢觜触詶誆詿詡訿詷誂誄詵誃誁詴詺谼豋豊豥豤豦貆貄貅賌赨赩趑趌趎趏趍趓趔趐趒跰跠跬跱跮跐跩跣跢跧跲跫跴輆軿輁輀輅輇輈輂輋遒逿"],["e0a1","遄遉逽鄐鄍鄏鄑鄖鄔鄋鄎酮酯鉈鉒鈰鈺鉦鈳鉥鉞銃鈮鉊鉆鉭鉬鉏鉠鉧鉯鈶鉡鉰鈱鉔鉣鉐鉲鉎鉓鉌鉖鈲閟閜閞閛隒隓隑隗雎雺雽雸雵靳靷靸靲頏頍頎颬飶飹馯馲馰馵骭骫魛鳪鳭鳧麀黽僦僔僗僨僳僛僪僝僤僓僬僰僯僣僠"],["e140","凘劀劁勩勫匰厬嘧嘕嘌嘒嗼嘏嘜嘁嘓嘂嗺嘝嘄嗿嗹墉塼墐墘墆墁塿塴墋塺墇墑墎塶墂墈塻墔墏壾奫嫜嫮嫥嫕嫪嫚嫭嫫嫳嫢嫠嫛嫬嫞嫝嫙嫨嫟孷寠"],["e1a1","寣屣嶂嶀嵽嶆嵺嶁嵷嶊嶉嶈嵾嵼嶍嵹嵿幘幙幓廘廑廗廎廜廕廙廒廔彄彃彯徶愬愨慁慞慱慳慒慓慲慬憀慴慔慺慛慥愻慪慡慖戩戧戫搫摍摛摝摴摶摲摳摽摵摦撦摎撂摞摜摋摓摠摐摿搿摬摫摙摥摷敳斠暡暠暟朅朄朢榱榶槉"],["e240","榠槎榖榰榬榼榑榙榎榧榍榩榾榯榿槄榽榤槔榹槊榚槏榳榓榪榡榞槙榗榐槂榵榥槆歊歍歋殞殟殠毃毄毾滎滵滱漃漥滸漷滻漮漉潎漙漚漧漘漻漒滭漊"],["e2a1","漶潳滹滮漭潀漰漼漵滫漇漎潃漅滽滶漹漜滼漺漟漍漞漈漡熇熐熉熀熅熂熏煻熆熁熗牄牓犗犕犓獃獍獑獌瑢瑳瑱瑵瑲瑧瑮甀甂甃畽疐瘖瘈瘌瘕瘑瘊瘔皸瞁睼瞅瞂睮瞀睯睾瞃碲碪碴碭碨硾碫碞碥碠碬碢碤禘禊禋禖禕禔禓"],["e340","禗禈禒禐稫穊稰稯稨稦窨窫窬竮箈箜箊箑箐箖箍箌箛箎箅箘劄箙箤箂粻粿粼粺綧綷緂綣綪緁緀緅綝緎緄緆緋緌綯綹綖綼綟綦綮綩綡緉罳翢翣翥翞"],["e3a1","耤聝聜膉膆膃膇膍膌膋舕蒗蒤蒡蒟蒺蓎蓂蒬蒮蒫蒹蒴蓁蓍蒪蒚蒱蓐蒝蒧蒻蒢蒔蓇蓌蒛蒩蒯蒨蓖蒘蒶蓏蒠蓗蓔蓒蓛蒰蒑虡蜳蜣蜨蝫蝀蜮蜞蜡蜙蜛蝃蜬蝁蜾蝆蜠蜲蜪蜭蜼蜒蜺蜱蜵蝂蜦蜧蜸蜤蜚蜰蜑裷裧裱裲裺裾裮裼裶裻"],["e440","裰裬裫覝覡覟覞觩觫觨誫誙誋誒誏誖谽豨豩賕賏賗趖踉踂跿踍跽踊踃踇踆踅跾踀踄輐輑輎輍鄣鄜鄠鄢鄟鄝鄚鄤鄡鄛酺酲酹酳銥銤鉶銛鉺銠銔銪銍"],["e4a1","銦銚銫鉹銗鉿銣鋮銎銂銕銢鉽銈銡銊銆銌銙銧鉾銇銩銝銋鈭隞隡雿靘靽靺靾鞃鞀鞂靻鞄鞁靿韎韍頖颭颮餂餀餇馝馜駃馹馻馺駂馽駇骱髣髧鬾鬿魠魡魟鳱鳲鳵麧僿儃儰僸儆儇僶僾儋儌僽儊劋劌勱勯噈噂噌嘵噁噊噉噆噘"],["e540","噚噀嘳嘽嘬嘾嘸嘪嘺圚墫墝墱墠墣墯墬墥墡壿嫿嫴嫽嫷嫶嬃嫸嬂嫹嬁嬇嬅嬏屧嶙嶗嶟嶒嶢嶓嶕嶠嶜嶡嶚嶞幩幝幠幜緳廛廞廡彉徲憋憃慹憱憰憢憉"],["e5a1","憛憓憯憭憟憒憪憡憍慦憳戭摮摰撖撠撅撗撜撏撋撊撌撣撟摨撱撘敶敺敹敻斲斳暵暰暩暲暷暪暯樀樆樗槥槸樕槱槤樠槿槬槢樛樝槾樧槲槮樔槷槧橀樈槦槻樍槼槫樉樄樘樥樏槶樦樇槴樖歑殥殣殢殦氁氀毿氂潁漦潾澇濆澒"],["e640","澍澉澌潢潏澅潚澖潶潬澂潕潲潒潐潗澔澓潝漀潡潫潽潧澐潓澋潩潿澕潣潷潪潻熲熯熛熰熠熚熩熵熝熥熞熤熡熪熜熧熳犘犚獘獒獞獟獠獝獛獡獚獙"],["e6a1","獢璇璉璊璆璁瑽璅璈瑼瑹甈甇畾瘥瘞瘙瘝瘜瘣瘚瘨瘛皜皝皞皛瞍瞏瞉瞈磍碻磏磌磑磎磔磈磃磄磉禚禡禠禜禢禛歶稹窲窴窳箷篋箾箬篎箯箹篊箵糅糈糌糋緷緛緪緧緗緡縃緺緦緶緱緰緮緟罶羬羰羭翭翫翪翬翦翨聤聧膣膟"],["e740","膞膕膢膙膗舖艏艓艒艐艎艑蔤蔻蔏蔀蔩蔎蔉蔍蔟蔊蔧蔜蓻蔫蓺蔈蔌蓴蔪蓲蔕蓷蓫蓳蓼蔒蓪蓩蔖蓾蔨蔝蔮蔂蓽蔞蓶蔱蔦蓧蓨蓰蓯蓹蔘蔠蔰蔋蔙蔯虢"],["e7a1","蝖蝣蝤蝷蟡蝳蝘蝔蝛蝒蝡蝚蝑蝞蝭蝪蝐蝎蝟蝝蝯蝬蝺蝮蝜蝥蝏蝻蝵蝢蝧蝩衚褅褌褔褋褗褘褙褆褖褑褎褉覢覤覣觭觰觬諏諆誸諓諑諔諕誻諗誾諀諅諘諃誺誽諙谾豍貏賥賟賙賨賚賝賧趠趜趡趛踠踣踥踤踮踕踛踖踑踙踦踧"],["e840","踔踒踘踓踜踗踚輬輤輘輚輠輣輖輗遳遰遯遧遫鄯鄫鄩鄪鄲鄦鄮醅醆醊醁醂醄醀鋐鋃鋄鋀鋙銶鋏鋱鋟鋘鋩鋗鋝鋌鋯鋂鋨鋊鋈鋎鋦鋍鋕鋉鋠鋞鋧鋑鋓"],["e8a1","銵鋡鋆銴镼閬閫閮閰隤隢雓霅霈霂靚鞊鞎鞈韐韏頞頝頦頩頨頠頛頧颲餈飺餑餔餖餗餕駜駍駏駓駔駎駉駖駘駋駗駌骳髬髫髳髲髱魆魃魧魴魱魦魶魵魰魨魤魬鳼鳺鳽鳿鳷鴇鴀鳹鳻鴈鴅鴄麃黓鼏鼐儜儓儗儚儑凞匴叡噰噠噮"],["e940","噳噦噣噭噲噞噷圜圛壈墽壉墿墺壂墼壆嬗嬙嬛嬡嬔嬓嬐嬖嬨嬚嬠嬞寯嶬嶱嶩嶧嶵嶰嶮嶪嶨嶲嶭嶯嶴幧幨幦幯廩廧廦廨廥彋徼憝憨憖懅憴懆懁懌憺"],["e9a1","憿憸憌擗擖擐擏擉撽撉擃擛擳擙攳敿敼斢曈暾曀曊曋曏暽暻暺曌朣樴橦橉橧樲橨樾橝橭橶橛橑樨橚樻樿橁橪橤橐橏橔橯橩橠樼橞橖橕橍橎橆歕歔歖殧殪殫毈毇氄氃氆澭濋澣濇澼濎濈潞濄澽澞濊澨瀄澥澮澺澬澪濏澿澸"],["ea40","澢濉澫濍澯澲澰燅燂熿熸燖燀燁燋燔燊燇燏熽燘熼燆燚燛犝犞獩獦獧獬獥獫獪瑿璚璠璔璒璕璡甋疀瘯瘭瘱瘽瘳瘼瘵瘲瘰皻盦瞚瞝瞡瞜瞛瞢瞣瞕瞙"],["eaa1","瞗磝磩磥磪磞磣磛磡磢磭磟磠禤穄穈穇窶窸窵窱窷篞篣篧篝篕篥篚篨篹篔篪篢篜篫篘篟糒糔糗糐糑縒縡縗縌縟縠縓縎縜縕縚縢縋縏縖縍縔縥縤罃罻罼罺羱翯耪耩聬膱膦膮膹膵膫膰膬膴膲膷膧臲艕艖艗蕖蕅蕫蕍蕓蕡蕘"],["eb40","蕀蕆蕤蕁蕢蕄蕑蕇蕣蔾蕛蕱蕎蕮蕵蕕蕧蕠薌蕦蕝蕔蕥蕬虣虥虤螛螏螗螓螒螈螁螖螘蝹螇螣螅螐螑螝螄螔螜螚螉褞褦褰褭褮褧褱褢褩褣褯褬褟觱諠"],["eba1","諢諲諴諵諝謔諤諟諰諈諞諡諨諿諯諻貑貒貐賵賮賱賰賳赬赮趥趧踳踾踸蹀蹅踶踼踽蹁踰踿躽輶輮輵輲輹輷輴遶遹遻邆郺鄳鄵鄶醓醐醑醍醏錧錞錈錟錆錏鍺錸錼錛錣錒錁鍆錭錎錍鋋錝鋺錥錓鋹鋷錴錂錤鋿錩錹錵錪錔錌"],["ec40","錋鋾錉錀鋻錖閼闍閾閹閺閶閿閵閽隩雔霋霒霐鞙鞗鞔韰韸頵頯頲餤餟餧餩馞駮駬駥駤駰駣駪駩駧骹骿骴骻髶髺髹髷鬳鮀鮅鮇魼魾魻鮂鮓鮒鮐魺鮕"],["eca1","魽鮈鴥鴗鴠鴞鴔鴩鴝鴘鴢鴐鴙鴟麈麆麇麮麭黕黖黺鼒鼽儦儥儢儤儠儩勴嚓嚌嚍嚆嚄嚃噾嚂噿嚁壖壔壏壒嬭嬥嬲嬣嬬嬧嬦嬯嬮孻寱寲嶷幬幪徾徻懃憵憼懧懠懥懤懨懞擯擩擣擫擤擨斁斀斶旚曒檍檖檁檥檉檟檛檡檞檇檓檎"],["ed40","檕檃檨檤檑橿檦檚檅檌檒歛殭氉濌澩濴濔濣濜濭濧濦濞濲濝濢濨燡燱燨燲燤燰燢獳獮獯璗璲璫璐璪璭璱璥璯甐甑甒甏疄癃癈癉癇皤盩瞵瞫瞲瞷瞶"],["eda1","瞴瞱瞨矰磳磽礂磻磼磲礅磹磾礄禫禨穜穛穖穘穔穚窾竀竁簅簏篲簀篿篻簎篴簋篳簂簉簃簁篸篽簆篰篱簐簊糨縭縼繂縳顈縸縪繉繀繇縩繌縰縻縶繄縺罅罿罾罽翴翲耬膻臄臌臊臅臇膼臩艛艚艜薃薀薏薧薕薠薋薣蕻薤薚薞"],["ee40","蕷蕼薉薡蕺蕸蕗薎薖薆薍薙薝薁薢薂薈薅蕹蕶薘薐薟虨螾螪螭蟅螰螬螹螵螼螮蟉蟃蟂蟌螷螯蟄蟊螴螶螿螸螽蟞螲褵褳褼褾襁襒褷襂覭覯覮觲觳謞"],["eea1","謘謖謑謅謋謢謏謒謕謇謍謈謆謜謓謚豏豰豲豱豯貕貔賹赯蹎蹍蹓蹐蹌蹇轃轀邅遾鄸醚醢醛醙醟醡醝醠鎡鎃鎯鍤鍖鍇鍼鍘鍜鍶鍉鍐鍑鍠鍭鎏鍌鍪鍹鍗鍕鍒鍏鍱鍷鍻鍡鍞鍣鍧鎀鍎鍙闇闀闉闃闅閷隮隰隬霠霟霘霝霙鞚鞡鞜"],["ef40","鞞鞝韕韔韱顁顄顊顉顅顃餥餫餬餪餳餲餯餭餱餰馘馣馡騂駺駴駷駹駸駶駻駽駾駼騃骾髾髽鬁髼魈鮚鮨鮞鮛鮦鮡鮥鮤鮆鮢鮠鮯鴳鵁鵧鴶鴮鴯鴱鴸鴰"],["efa1","鵅鵂鵃鴾鴷鵀鴽翵鴭麊麉麍麰黈黚黻黿鼤鼣鼢齔龠儱儭儮嚘嚜嚗嚚嚝嚙奰嬼屩屪巀幭幮懘懟懭懮懱懪懰懫懖懩擿攄擽擸攁攃擼斔旛曚曛曘櫅檹檽櫡櫆檺檶檷櫇檴檭歞毉氋瀇瀌瀍瀁瀅瀔瀎濿瀀濻瀦濼濷瀊爁燿燹爃燽獶"],["f040","璸瓀璵瓁璾璶璻瓂甔甓癜癤癙癐癓癗癚皦皽盬矂瞺磿礌礓礔礉礐礒礑禭禬穟簜簩簙簠簟簭簝簦簨簢簥簰繜繐繖繣繘繢繟繑繠繗繓羵羳翷翸聵臑臒"],["f0a1","臐艟艞薴藆藀藃藂薳薵薽藇藄薿藋藎藈藅薱薶藒蘤薸薷薾虩蟧蟦蟢蟛蟫蟪蟥蟟蟳蟤蟔蟜蟓蟭蟘蟣螤蟗蟙蠁蟴蟨蟝襓襋襏襌襆襐襑襉謪謧謣謳謰謵譇謯謼謾謱謥謷謦謶謮謤謻謽謺豂豵貙貘貗賾贄贂贀蹜蹢蹠蹗蹖蹞蹥蹧"],["f140","蹛蹚蹡蹝蹩蹔轆轇轈轋鄨鄺鄻鄾醨醥醧醯醪鎵鎌鎒鎷鎛鎝鎉鎧鎎鎪鎞鎦鎕鎈鎙鎟鎍鎱鎑鎲鎤鎨鎴鎣鎥闒闓闑隳雗雚巂雟雘雝霣霢霥鞬鞮鞨鞫鞤鞪"],["f1a1","鞢鞥韗韙韖韘韺顐顑顒颸饁餼餺騏騋騉騍騄騑騊騅騇騆髀髜鬈鬄鬅鬩鬵魊魌魋鯇鯆鯃鮿鯁鮵鮸鯓鮶鯄鮹鮽鵜鵓鵏鵊鵛鵋鵙鵖鵌鵗鵒鵔鵟鵘鵚麎麌黟鼁鼀鼖鼥鼫鼪鼩鼨齌齕儴儵劖勷厴嚫嚭嚦嚧嚪嚬壚壝壛夒嬽嬾嬿巃幰"],["f240","徿懻攇攐攍攉攌攎斄旞旝曞櫧櫠櫌櫑櫙櫋櫟櫜櫐櫫櫏櫍櫞歠殰氌瀙瀧瀠瀖瀫瀡瀢瀣瀩瀗瀤瀜瀪爌爊爇爂爅犥犦犤犣犡瓋瓅璷瓃甖癠矉矊矄矱礝礛"],["f2a1","礡礜礗礞禰穧穨簳簼簹簬簻糬糪繶繵繸繰繷繯繺繲繴繨罋罊羃羆羷翽翾聸臗臕艤艡艣藫藱藭藙藡藨藚藗藬藲藸藘藟藣藜藑藰藦藯藞藢蠀蟺蠃蟶蟷蠉蠌蠋蠆蟼蠈蟿蠊蠂襢襚襛襗襡襜襘襝襙覈覷覶觶譐譈譊譀譓譖譔譋譕"],["f340","譑譂譒譗豃豷豶貚贆贇贉趬趪趭趫蹭蹸蹳蹪蹯蹻軂轒轑轏轐轓辴酀鄿醰醭鏞鏇鏏鏂鏚鏐鏹鏬鏌鏙鎩鏦鏊鏔鏮鏣鏕鏄鏎鏀鏒鏧镽闚闛雡霩霫霬霨霦"],["f3a1","鞳鞷鞶韝韞韟顜顙顝顗颿颽颻颾饈饇饃馦馧騚騕騥騝騤騛騢騠騧騣騞騜騔髂鬋鬊鬎鬌鬷鯪鯫鯠鯞鯤鯦鯢鯰鯔鯗鯬鯜鯙鯥鯕鯡鯚鵷鶁鶊鶄鶈鵱鶀鵸鶆鶋鶌鵽鵫鵴鵵鵰鵩鶅鵳鵻鶂鵯鵹鵿鶇鵨麔麑黀黼鼭齀齁齍齖齗齘匷嚲"],["f440","嚵嚳壣孅巆巇廮廯忀忁懹攗攖攕攓旟曨曣曤櫳櫰櫪櫨櫹櫱櫮櫯瀼瀵瀯瀷瀴瀱灂瀸瀿瀺瀹灀瀻瀳灁爓爔犨獽獼璺皫皪皾盭矌矎矏矍矲礥礣礧礨礤礩"],["f4a1","禲穮穬穭竷籉籈籊籇籅糮繻繾纁纀羺翿聹臛臙舋艨艩蘢藿蘁藾蘛蘀藶蘄蘉蘅蘌藽蠙蠐蠑蠗蠓蠖襣襦覹觷譠譪譝譨譣譥譧譭趮躆躈躄轙轖轗轕轘轚邍酃酁醷醵醲醳鐋鐓鏻鐠鐏鐔鏾鐕鐐鐨鐙鐍鏵鐀鏷鐇鐎鐖鐒鏺鐉鏸鐊鏿"],["f540","鏼鐌鏶鐑鐆闞闠闟霮霯鞹鞻韽韾顠顢顣顟飁飂饐饎饙饌饋饓騲騴騱騬騪騶騩騮騸騭髇髊髆鬐鬒鬑鰋鰈鯷鰅鰒鯸鱀鰇鰎鰆鰗鰔鰉鶟鶙鶤鶝鶒鶘鶐鶛"],["f5a1","鶠鶔鶜鶪鶗鶡鶚鶢鶨鶞鶣鶿鶩鶖鶦鶧麙麛麚黥黤黧黦鼰鼮齛齠齞齝齙龑儺儹劘劗囃嚽嚾孈孇巋巏廱懽攛欂櫼欃櫸欀灃灄灊灈灉灅灆爝爚爙獾甗癪矐礭礱礯籔籓糲纊纇纈纋纆纍罍羻耰臝蘘蘪蘦蘟蘣蘜蘙蘧蘮蘡蘠蘩蘞蘥"],["f640","蠩蠝蠛蠠蠤蠜蠫衊襭襩襮襫觺譹譸譅譺譻贐贔趯躎躌轞轛轝酆酄酅醹鐿鐻鐶鐩鐽鐼鐰鐹鐪鐷鐬鑀鐱闥闤闣霵霺鞿韡顤飉飆飀饘饖騹騽驆驄驂驁騺"],["f6a1","騿髍鬕鬗鬘鬖鬺魒鰫鰝鰜鰬鰣鰨鰩鰤鰡鶷鶶鶼鷁鷇鷊鷏鶾鷅鷃鶻鶵鷎鶹鶺鶬鷈鶱鶭鷌鶳鷍鶲鹺麜黫黮黭鼛鼘鼚鼱齎齥齤龒亹囆囅囋奱孋孌巕巑廲攡攠攦攢欋欈欉氍灕灖灗灒爞爟犩獿瓘瓕瓙瓗癭皭礵禴穰穱籗籜籙籛籚"],["f740","糴糱纑罏羇臞艫蘴蘵蘳蘬蘲蘶蠬蠨蠦蠪蠥襱覿覾觻譾讄讂讆讅譿贕躕躔躚躒躐躖躗轠轢酇鑌鑐鑊鑋鑏鑇鑅鑈鑉鑆霿韣顪顩飋饔饛驎驓驔驌驏驈驊"],["f7a1","驉驒驐髐鬙鬫鬻魖魕鱆鱈鰿鱄鰹鰳鱁鰼鰷鰴鰲鰽鰶鷛鷒鷞鷚鷋鷐鷜鷑鷟鷩鷙鷘鷖鷵鷕鷝麶黰鼵鼳鼲齂齫龕龢儽劙壨壧奲孍巘蠯彏戁戃戄攩攥斖曫欑欒欏毊灛灚爢玂玁玃癰矔籧籦纕艬蘺虀蘹蘼蘱蘻蘾蠰蠲蠮蠳襶襴襳觾"],["f840","讌讎讋讈豅贙躘轤轣醼鑢鑕鑝鑗鑞韄韅頀驖驙鬞鬟鬠鱒鱘鱐鱊鱍鱋鱕鱙鱌鱎鷻鷷鷯鷣鷫鷸鷤鷶鷡鷮鷦鷲鷰鷢鷬鷴鷳鷨鷭黂黐黲黳鼆鼜鼸鼷鼶齃齏"],["f8a1","齱齰齮齯囓囍孎屭攭曭曮欓灟灡灝灠爣瓛瓥矕礸禷禶籪纗羉艭虃蠸蠷蠵衋讔讕躞躟躠躝醾醽釂鑫鑨鑩雥靆靃靇韇韥驞髕魙鱣鱧鱦鱢鱞鱠鸂鷾鸇鸃鸆鸅鸀鸁鸉鷿鷽鸄麠鼞齆齴齵齶囔攮斸欘欙欗欚灢爦犪矘矙礹籩籫糶纚"],["f940","纘纛纙臠臡虆虇虈襹襺襼襻觿讘讙躥躤躣鑮鑭鑯鑱鑳靉顲饟鱨鱮鱭鸋鸍鸐鸏鸒鸑麡黵鼉齇齸齻齺齹圞灦籯蠼趲躦釃鑴鑸鑶鑵驠鱴鱳鱱鱵鸔鸓黶鼊"],["f9a1","龤灨灥糷虪蠾蠽蠿讞貜躩軉靋顳顴飌饡馫驤驦驧鬤鸕鸗齈戇欞爧虌躨钂钀钁驩驨鬮鸙爩虋讟钃鱹麷癵驫鱺鸝灩灪麤齾齉龘碁銹裏墻恒粧嫺╔╦╗╠╬╣╚╩╝╒╤╕╞╪╡╘╧╛╓╥╖╟╫╢╙╨╜║═╭╮╰╯▓"]]},{}],96:[function(e,t,r){t.exports=[["0","\0",127],["8ea1","｡",62],["a1a1","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇"],["a2a1","◆□■△▲▽▼※〒→←↑↓〓"],["a2ba","∈∋⊆⊇⊂⊃∪∩"],["a2ca","∧∨￢⇒⇔∀∃"],["a2dc","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],["a2f2","Å‰♯♭♪†‡¶"],["a2fe","◯"],["a3b0","０",9],["a3c1","Ａ",25],["a3e1","ａ",25],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a8a1","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],["ada1","①",19,"Ⅰ",9],["adc0","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],["addf","㍻〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],["b0a1","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],["b1a1","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応"],["b2a1","押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],["b3a1","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱"],["b4a1","粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],["b5a1","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京"],["b6a1","供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],["b7a1","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲"],["b8a1","検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],["b9a1","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込"],["baa1","此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],["bba1","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時"],["bca1","次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],["bda1","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償"],["bea1","勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],["bfa1","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾"],["c0a1","澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],["c1a1","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎"],["c2a1","臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],["c3a1","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵"],["c4a1","帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],["c5a1","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到"],["c6a1","董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],["c7a1","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦"],["c8a1","函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],["c9a1","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服"],["caa1","福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],["cba1","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満"],["cca1","漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],["cda1","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃"],["cea1","痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],["cfa1","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],["d0a1","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],["d1a1","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨"],["d2a1","辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],["d3a1","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉"],["d4a1","圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],["d5a1","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓"],["d6a1","屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],["d7a1","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚"],["d8a1","悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],["d9a1","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼"],["daa1","據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],["dba1","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍"],["dca1","棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],["dda1","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾"],["dea1","沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],["dfa1","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼"],["e0a1","燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],["e1a1","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰"],["e2a1","癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],["e3a1","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐"],["e4a1","筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],["e5a1","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺"],["e6a1","罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],["e7a1","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙"],["e8a1","茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],["e9a1","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙"],["eaa1","蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],["eba1","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫"],["eca1","譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],["eda1","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸"],["eea1","遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],["efa1","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞"],["f0a1","陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],["f1a1","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷"],["f2a1","髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],["f3a1","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠"],["f4a1","堯槇遙瑤凜熙"],["f9a1","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德"],["faa1","忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],["fba1","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚"],["fca1","釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],["fcf1","ⅰ",9,"￢￤＇＂"],["8fa2af","˘ˇ¸˙˝¯˛˚～΄΅"],["8fa2c2","¡¦¿"],["8fa2eb","ºª©®™¤№"],["8fa6e1","ΆΈΉΊΪ"],["8fa6e7","Ό"],["8fa6e9","ΎΫ"],["8fa6ec","Ώ"],["8fa6f1","άέήίϊΐόςύϋΰώ"],["8fa7c2","Ђ",10,"ЎЏ"],["8fa7f2","ђ",10,"ўџ"],["8fa9a1","ÆĐ"],["8fa9a4","Ħ"],["8fa9a6","Ĳ"],["8fa9a8","ŁĿ"],["8fa9ab","ŊØŒ"],["8fa9af","ŦÞ"],["8fa9c1","æđðħıĳĸłŀŉŋøœßŧþ"],["8faaa1","ÁÀÄÂĂǍĀĄÅÃĆĈČÇĊĎÉÈËÊĚĖĒĘ"],["8faaba","ĜĞĢĠĤÍÌÏÎǏİĪĮĨĴĶĹĽĻŃŇŅÑÓÒÖÔǑŐŌÕŔŘŖŚŜŠŞŤŢÚÙÜÛŬǓŰŪŲŮŨǗǛǙǕŴÝŸŶŹŽŻ"],["8faba1","áàäâăǎāąåãćĉčçċďéèëêěėēęǵĝğ"],["8fabbd","ġĥíìïîǐ"],["8fabc5","īįĩĵķĺľļńňņñóòöôǒőōõŕřŗśŝšşťţúùüûŭǔűūųůũǘǜǚǖŵýÿŷźžż"],["8fb0a1","丂丄丅丌丒丟丣两丨丫丮丯丰丵乀乁乄乇乑乚乜乣乨乩乴乵乹乿亍亖亗亝亯亹仃仐仚仛仠仡仢仨仯仱仳仵份仾仿伀伂伃伈伋伌伒伕伖众伙伮伱你伳伵伷伹伻伾佀佂佈佉佋佌佒佔佖佘佟佣佪佬佮佱佷佸佹佺佽佾侁侂侄"],["8fb1a1","侅侉侊侌侎侐侒侓侔侗侙侚侞侟侲侷侹侻侼侽侾俀俁俅俆俈俉俋俌俍俏俒俜俠俢俰俲俼俽俿倀倁倄倇倊倌倎倐倓倗倘倛倜倝倞倢倧倮倰倲倳倵偀偁偂偅偆偊偌偎偑偒偓偗偙偟偠偢偣偦偧偪偭偰偱倻傁傃傄傆傊傎傏傐"],["8fb2a1","傒傓傔傖傛傜傞",4,"傪傯傰傹傺傽僀僃僄僇僌僎僐僓僔僘僜僝僟僢僤僦僨僩僯僱僶僺僾儃儆儇儈儋儌儍儎僲儐儗儙儛儜儝儞儣儧儨儬儭儯儱儳儴儵儸儹兂兊兏兓兕兗兘兟兤兦兾冃冄冋冎冘冝冡冣冭冸冺冼冾冿凂"],["8fb3a1","凈减凑凒凓凕凘凞凢凥凮凲凳凴凷刁刂刅划刓刕刖刘刢刨刱刲刵刼剅剉剕剗剘剚剜剟剠剡剦剮剷剸剹劀劂劅劊劌劓劕劖劗劘劚劜劤劥劦劧劯劰劶劷劸劺劻劽勀勄勆勈勌勏勑勔勖勛勜勡勥勨勩勪勬勰勱勴勶勷匀匃匊匋"],["8fb4a1","匌匑匓匘匛匜匞匟匥匧匨匩匫匬匭匰匲匵匼匽匾卂卌卋卙卛卡卣卥卬卭卲卹卾厃厇厈厎厓厔厙厝厡厤厪厫厯厲厴厵厷厸厺厽叀叅叏叒叓叕叚叝叞叠另叧叵吂吓吚吡吧吨吪启吱吴吵呃呄呇呍呏呞呢呤呦呧呩呫呭呮呴呿"],["8fb5a1","咁咃咅咈咉咍咑咕咖咜咟咡咦咧咩咪咭咮咱咷咹咺咻咿哆哊响哎哠哪哬哯哶哼哾哿唀唁唅唈唉唌唍唎唕唪唫唲唵唶唻唼唽啁啇啉啊啍啐啑啘啚啛啞啠啡啤啦啿喁喂喆喈喎喏喑喒喓喔喗喣喤喭喲喿嗁嗃嗆嗉嗋嗌嗎嗑嗒"],["8fb6a1","嗓嗗嗘嗛嗞嗢嗩嗶嗿嘅嘈嘊嘍",5,"嘙嘬嘰嘳嘵嘷嘹嘻嘼嘽嘿噀噁噃噄噆噉噋噍噏噔噞噠噡噢噣噦噩噭噯噱噲噵嚄嚅嚈嚋嚌嚕嚙嚚嚝嚞嚟嚦嚧嚨嚩嚫嚬嚭嚱嚳嚷嚾囅囉囊囋囏囐囌囍囙囜囝囟囡囤",4,"囱囫园"],["8fb7a1","囶囷圁圂圇圊圌圑圕圚圛圝圠圢圣圤圥圩圪圬圮圯圳圴圽圾圿坅坆坌坍坒坢坥坧坨坫坭",4,"坳坴坵坷坹坺坻坼坾垁垃垌垔垗垙垚垜垝垞垟垡垕垧垨垩垬垸垽埇埈埌埏埕埝埞埤埦埧埩埭埰埵埶埸埽埾埿堃堄堈堉埡"],["8fb8a1","堌堍堛堞堟堠堦堧堭堲堹堿塉塌塍塏塐塕塟塡塤塧塨塸塼塿墀墁墇墈墉墊墌墍墏墐墔墖墝墠墡墢墦墩墱墲壄墼壂壈壍壎壐壒壔壖壚壝壡壢壩壳夅夆夋夌夒夓夔虁夝夡夣夤夨夯夰夳夵夶夿奃奆奒奓奙奛奝奞奟奡奣奫奭"],["8fb9a1","奯奲奵奶她奻奼妋妌妎妒妕妗妟妤妧妭妮妯妰妳妷妺妼姁姃姄姈姊姍姒姝姞姟姣姤姧姮姯姱姲姴姷娀娄娌娍娎娒娓娞娣娤娧娨娪娭娰婄婅婇婈婌婐婕婞婣婥婧婭婷婺婻婾媋媐媓媖媙媜媞媟媠媢媧媬媱媲媳媵媸媺媻媿"],["8fbaa1","嫄嫆嫈嫏嫚嫜嫠嫥嫪嫮嫵嫶嫽嬀嬁嬈嬗嬴嬙嬛嬝嬡嬥嬭嬸孁孋孌孒孖孞孨孮孯孼孽孾孿宁宄宆宊宎宐宑宓宔宖宨宩宬宭宯宱宲宷宺宼寀寁寍寏寖",4,"寠寯寱寴寽尌尗尞尟尣尦尩尫尬尮尰尲尵尶屙屚屜屢屣屧屨屩"],["8fbba1","屭屰屴屵屺屻屼屽岇岈岊岏岒岝岟岠岢岣岦岪岲岴岵岺峉峋峒峝峗峮峱峲峴崁崆崍崒崫崣崤崦崧崱崴崹崽崿嵂嵃嵆嵈嵕嵑嵙嵊嵟嵠嵡嵢嵤嵪嵭嵰嵹嵺嵾嵿嶁嶃嶈嶊嶒嶓嶔嶕嶙嶛嶟嶠嶧嶫嶰嶴嶸嶹巃巇巋巐巎巘巙巠巤"],["8fbca1","巩巸巹帀帇帍帒帔帕帘帟帠帮帨帲帵帾幋幐幉幑幖幘幛幜幞幨幪",4,"幰庀庋庎庢庤庥庨庪庬庱庳庽庾庿廆廌廋廎廑廒廔廕廜廞廥廫异弆弇弈弎弙弜弝弡弢弣弤弨弫弬弮弰弴弶弻弽弿彀彄彅彇彍彐彔彘彛彠彣彤彧"],["8fbda1","彯彲彴彵彸彺彽彾徉徍徏徖徜徝徢徧徫徤徬徯徰徱徸忄忇忈忉忋忐",4,"忞忡忢忨忩忪忬忭忮忯忲忳忶忺忼怇怊怍怓怔怗怘怚怟怤怭怳怵恀恇恈恉恌恑恔恖恗恝恡恧恱恾恿悂悆悈悊悎悑悓悕悘悝悞悢悤悥您悰悱悷"],["8fbea1","悻悾惂惄惈惉惊惋惎惏惔惕惙惛惝惞惢惥惲惵惸惼惽愂愇愊愌愐",4,"愖愗愙愜愞愢愪愫愰愱愵愶愷愹慁慅慆慉慞慠慬慲慸慻慼慿憀憁憃憄憋憍憒憓憗憘憜憝憟憠憥憨憪憭憸憹憼懀懁懂懎懏懕懜懝懞懟懡懢懧懩懥"],["8fbfa1","懬懭懯戁戃戄戇戓戕戜戠戢戣戧戩戫戹戽扂扃扄扆扌扐扑扒扔扖扚扜扤扭扯扳扺扽抍抎抏抐抦抨抳抶抷抺抾抿拄拎拕拖拚拪拲拴拼拽挃挄挊挋挍挐挓挖挘挩挪挭挵挶挹挼捁捂捃捄捆捊捋捎捒捓捔捘捛捥捦捬捭捱捴捵"],["8fc0a1","捸捼捽捿掂掄掇掊掐掔掕掙掚掞掤掦掭掮掯掽揁揅揈揎揑揓揔揕揜揠揥揪揬揲揳揵揸揹搉搊搐搒搔搘搞搠搢搤搥搩搪搯搰搵搽搿摋摏摑摒摓摔摚摛摜摝摟摠摡摣摭摳摴摻摽撅撇撏撐撑撘撙撛撝撟撡撣撦撨撬撳撽撾撿"],["8fc1a1","擄擉擊擋擌擎擐擑擕擗擤擥擩擪擭擰擵擷擻擿攁攄攈攉攊攏攓攔攖攙攛攞攟攢攦攩攮攱攺攼攽敃敇敉敐敒敔敟敠敧敫敺敽斁斅斊斒斕斘斝斠斣斦斮斲斳斴斿旂旈旉旎旐旔旖旘旟旰旲旴旵旹旾旿昀昄昈昉昍昑昒昕昖昝"],["8fc2a1","昞昡昢昣昤昦昩昪昫昬昮昰昱昳昹昷晀晅晆晊晌晑晎晗晘晙晛晜晠晡曻晪晫晬晾晳晵晿晷晸晹晻暀晼暋暌暍暐暒暙暚暛暜暟暠暤暭暱暲暵暻暿曀曂曃曈曌曎曏曔曛曟曨曫曬曮曺朅朇朎朓朙朜朠朢朳朾杅杇杈杌杔杕杝"],["8fc3a1","杦杬杮杴杶杻极构枎枏枑枓枖枘枙枛枰枱枲枵枻枼枽柹柀柂柃柅柈柉柒柗柙柜柡柦柰柲柶柷桒栔栙栝栟栨栧栬栭栯栰栱栳栻栿桄桅桊桌桕桗桘桛桫桮",4,"桵桹桺桻桼梂梄梆梈梖梘梚梜梡梣梥梩梪梮梲梻棅棈棌棏"],["8fc4a1","棐棑棓棖棙棜棝棥棨棪棫棬棭棰棱棵棶棻棼棽椆椉椊椐椑椓椖椗椱椳椵椸椻楂楅楉楎楗楛楣楤楥楦楨楩楬楰楱楲楺楻楿榀榍榒榖榘榡榥榦榨榫榭榯榷榸榺榼槅槈槑槖槗槢槥槮槯槱槳槵槾樀樁樃樏樑樕樚樝樠樤樨樰樲"],["8fc5a1","樴樷樻樾樿橅橆橉橊橎橐橑橒橕橖橛橤橧橪橱橳橾檁檃檆檇檉檋檑檛檝檞檟檥檫檯檰檱檴檽檾檿櫆櫉櫈櫌櫐櫔櫕櫖櫜櫝櫤櫧櫬櫰櫱櫲櫼櫽欂欃欆欇欉欏欐欑欗欛欞欤欨欫欬欯欵欶欻欿歆歊歍歒歖歘歝歠歧歫歮歰歵歽"],["8fc6a1","歾殂殅殗殛殟殠殢殣殨殩殬殭殮殰殸殹殽殾毃毄毉毌毖毚毡毣毦毧毮毱毷毹毿氂氄氅氉氍氎氐氒氙氟氦氧氨氬氮氳氵氶氺氻氿汊汋汍汏汒汔汙汛汜汫汭汯汴汶汸汹汻沅沆沇沉沔沕沗沘沜沟沰沲沴泂泆泍泏泐泑泒泔泖"],["8fc7a1","泚泜泠泧泩泫泬泮泲泴洄洇洊洎洏洑洓洚洦洧洨汧洮洯洱洹洼洿浗浞浟浡浥浧浯浰浼涂涇涑涒涔涖涗涘涪涬涴涷涹涽涿淄淈淊淎淏淖淛淝淟淠淢淥淩淯淰淴淶淼渀渄渞渢渧渲渶渹渻渼湄湅湈湉湋湏湑湒湓湔湗湜湝湞"],["8fc8a1","湢湣湨湳湻湽溍溓溙溠溧溭溮溱溳溻溿滀滁滃滇滈滊滍滎滏滫滭滮滹滻滽漄漈漊漌漍漖漘漚漛漦漩漪漯漰漳漶漻漼漭潏潑潒潓潗潙潚潝潞潡潢潨潬潽潾澃澇澈澋澌澍澐澒澓澔澖澚澟澠澥澦澧澨澮澯澰澵澶澼濅濇濈濊"],["8fc9a1","濚濞濨濩濰濵濹濼濽瀀瀅瀆瀇瀍瀗瀠瀣瀯瀴瀷瀹瀼灃灄灈灉灊灋灔灕灝灞灎灤灥灬灮灵灶灾炁炅炆炔",4,"炛炤炫炰炱炴炷烊烑烓烔烕烖烘烜烤烺焃",4,"焋焌焏焞焠焫焭焯焰焱焸煁煅煆煇煊煋煐煒煗煚煜煞煠"],["8fcaa1","煨煹熀熅熇熌熒熚熛熠熢熯熰熲熳熺熿燀燁燄燋燌燓燖燙燚燜燸燾爀爇爈爉爓爗爚爝爟爤爫爯爴爸爹牁牂牃牅牎牏牐牓牕牖牚牜牞牠牣牨牫牮牯牱牷牸牻牼牿犄犉犍犎犓犛犨犭犮犱犴犾狁狇狉狌狕狖狘狟狥狳狴狺狻"],["8fcba1","狾猂猄猅猇猋猍猒猓猘猙猞猢猤猧猨猬猱猲猵猺猻猽獃獍獐獒獖獘獝獞獟獠獦獧獩獫獬獮獯獱獷獹獼玀玁玃玅玆玎玐玓玕玗玘玜玞玟玠玢玥玦玪玫玭玵玷玹玼玽玿珅珆珉珋珌珏珒珓珖珙珝珡珣珦珧珩珴珵珷珹珺珻珽"],["8fcca1","珿琀琁琄琇琊琑琚琛琤琦琨",9,"琹瑀瑃瑄瑆瑇瑋瑍瑑瑒瑗瑝瑢瑦瑧瑨瑫瑭瑮瑱瑲璀璁璅璆璇璉璏璐璑璒璘璙璚璜璟璠璡璣璦璨璩璪璫璮璯璱璲璵璹璻璿瓈瓉瓌瓐瓓瓘瓚瓛瓞瓟瓤瓨瓪瓫瓯瓴瓺瓻瓼瓿甆"],["8fcda1","甒甖甗甠甡甤甧甩甪甯甶甹甽甾甿畀畃畇畈畎畐畒畗畞畟畡畯畱畹",5,"疁疅疐疒疓疕疙疜疢疤疴疺疿痀痁痄痆痌痎痏痗痜痟痠痡痤痧痬痮痯痱痹瘀瘂瘃瘄瘇瘈瘊瘌瘏瘒瘓瘕瘖瘙瘛瘜瘝瘞瘣瘥瘦瘩瘭瘲瘳瘵瘸瘹"],["8fcea1","瘺瘼癊癀癁癃癄癅癉癋癕癙癟癤癥癭癮癯癱癴皁皅皌皍皕皛皜皝皟皠皢",6,"皪皭皽盁盅盉盋盌盎盔盙盠盦盨盬盰盱盶盹盼眀眆眊眎眒眔眕眗眙眚眜眢眨眭眮眯眴眵眶眹眽眾睂睅睆睊睍睎睏睒睖睗睜睞睟睠睢"],["8fcfa1","睤睧睪睬睰睲睳睴睺睽瞀瞄瞌瞍瞔瞕瞖瞚瞟瞢瞧瞪瞮瞯瞱瞵瞾矃矉矑矒矕矙矞矟矠矤矦矪矬矰矱矴矸矻砅砆砉砍砎砑砝砡砢砣砭砮砰砵砷硃硄硇硈硌硎硒硜硞硠硡硣硤硨硪确硺硾碊碏碔碘碡碝碞碟碤碨碬碭碰碱碲碳"],["8fd0a1","碻碽碿磇磈磉磌磎磒磓磕磖磤磛磟磠磡磦磪磲磳礀磶磷磺磻磿礆礌礐礚礜礞礟礠礥礧礩礭礱礴礵礻礽礿祄祅祆祊祋祏祑祔祘祛祜祧祩祫祲祹祻祼祾禋禌禑禓禔禕禖禘禛禜禡禨禩禫禯禱禴禸离秂秄秇秈秊秏秔秖秚秝秞"],["8fd1a1","秠秢秥秪秫秭秱秸秼稂稃稇稉稊稌稑稕稛稞稡稧稫稭稯稰稴稵稸稹稺穄穅穇穈穌穕穖穙穜穝穟穠穥穧穪穭穵穸穾窀窂窅窆窊窋窐窑窔窞窠窣窬窳窵窹窻窼竆竉竌竎竑竛竨竩竫竬竱竴竻竽竾笇笔笟笣笧笩笪笫笭笮笯笰"],["8fd2a1","笱笴笽笿筀筁筇筎筕筠筤筦筩筪筭筯筲筳筷箄箉箎箐箑箖箛箞箠箥箬箯箰箲箵箶箺箻箼箽篂篅篈篊篔篖篗篙篚篛篨篪篲篴篵篸篹篺篼篾簁簂簃簄簆簉簋簌簎簏簙簛簠簥簦簨簬簱簳簴簶簹簺籆籊籕籑籒籓籙",5],["8fd3a1","籡籣籧籩籭籮籰籲籹籼籽粆粇粏粔粞粠粦粰粶粷粺粻粼粿糄糇糈糉糍糏糓糔糕糗糙糚糝糦糩糫糵紃紇紈紉紏紑紒紓紖紝紞紣紦紪紭紱紼紽紾絀絁絇絈絍絑絓絗絙絚絜絝絥絧絪絰絸絺絻絿綁綂綃綅綆綈綋綌綍綑綖綗綝"],["8fd4a1","綞綦綧綪綳綶綷綹緂",4,"緌緍緎緗緙縀緢緥緦緪緫緭緱緵緶緹緺縈縐縑縕縗縜縝縠縧縨縬縭縯縳縶縿繄繅繇繎繐繒繘繟繡繢繥繫繮繯繳繸繾纁纆纇纊纍纑纕纘纚纝纞缼缻缽缾缿罃罄罇罏罒罓罛罜罝罡罣罤罥罦罭"],["8fd5a1","罱罽罾罿羀羋羍羏羐羑羖羗羜羡羢羦羪羭羴羼羿翀翃翈翎翏翛翟翣翥翨翬翮翯翲翺翽翾翿耇耈耊耍耎耏耑耓耔耖耝耞耟耠耤耦耬耮耰耴耵耷耹耺耼耾聀聄聠聤聦聭聱聵肁肈肎肜肞肦肧肫肸肹胈胍胏胒胔胕胗胘胠胭胮"],["8fd6a1","胰胲胳胶胹胺胾脃脋脖脗脘脜脞脠脤脧脬脰脵脺脼腅腇腊腌腒腗腠腡腧腨腩腭腯腷膁膐膄膅膆膋膎膖膘膛膞膢膮膲膴膻臋臃臅臊臎臏臕臗臛臝臞臡臤臫臬臰臱臲臵臶臸臹臽臿舀舃舏舓舔舙舚舝舡舢舨舲舴舺艃艄艅艆"],["8fd7a1","艋艎艏艑艖艜艠艣艧艭艴艻艽艿芀芁芃芄芇芉芊芎芑芔芖芘芚芛芠芡芣芤芧芨芩芪芮芰芲芴芷芺芼芾芿苆苐苕苚苠苢苤苨苪苭苯苶苷苽苾茀茁茇茈茊茋荔茛茝茞茟茡茢茬茭茮茰茳茷茺茼茽荂荃荄荇荍荎荑荕荖荗荰荸"],["8fd8a1","荽荿莀莂莄莆莍莒莔莕莘莙莛莜莝莦莧莩莬莾莿菀菇菉菏菐菑菔菝荓菨菪菶菸菹菼萁萆萊萏萑萕萙莭萯萹葅葇葈葊葍葏葑葒葖葘葙葚葜葠葤葥葧葪葰葳葴葶葸葼葽蒁蒅蒒蒓蒕蒞蒦蒨蒩蒪蒯蒱蒴蒺蒽蒾蓀蓂蓇蓈蓌蓏蓓"],["8fd9a1","蓜蓧蓪蓯蓰蓱蓲蓷蔲蓺蓻蓽蔂蔃蔇蔌蔎蔐蔜蔞蔢蔣蔤蔥蔧蔪蔫蔯蔳蔴蔶蔿蕆蕏",4,"蕖蕙蕜",6,"蕤蕫蕯蕹蕺蕻蕽蕿薁薅薆薉薋薌薏薓薘薝薟薠薢薥薧薴薶薷薸薼薽薾薿藂藇藊藋藎薭藘藚藟藠藦藨藭藳藶藼"],["8fdaa1","藿蘀蘄蘅蘍蘎蘐蘑蘒蘘蘙蘛蘞蘡蘧蘩蘶蘸蘺蘼蘽虀虂虆虒虓虖虗虘虙虝虠",4,"虩虬虯虵虶虷虺蚍蚑蚖蚘蚚蚜蚡蚦蚧蚨蚭蚱蚳蚴蚵蚷蚸蚹蚿蛀蛁蛃蛅蛑蛒蛕蛗蛚蛜蛠蛣蛥蛧蚈蛺蛼蛽蜄蜅蜇蜋蜎蜏蜐蜓蜔蜙蜞蜟蜡蜣"],["8fdba1","蜨蜮蜯蜱蜲蜹蜺蜼蜽蜾蝀蝃蝅蝍蝘蝝蝡蝤蝥蝯蝱蝲蝻螃",6,"螋螌螐螓螕螗螘螙螞螠螣螧螬螭螮螱螵螾螿蟁蟈蟉蟊蟎蟕蟖蟙蟚蟜蟟蟢蟣蟤蟪蟫蟭蟱蟳蟸蟺蟿蠁蠃蠆蠉蠊蠋蠐蠙蠒蠓蠔蠘蠚蠛蠜蠞蠟蠨蠭蠮蠰蠲蠵"],["8fdca1","蠺蠼衁衃衅衈衉衊衋衎衑衕衖衘衚衜衟衠衤衩衱衹衻袀袘袚袛袜袟袠袨袪袺袽袾裀裊",4,"裑裒裓裛裞裧裯裰裱裵裷褁褆褍褎褏褕褖褘褙褚褜褠褦褧褨褰褱褲褵褹褺褾襀襂襅襆襉襏襒襗襚襛襜襡襢襣襫襮襰襳襵襺"],["8fdda1","襻襼襽覉覍覐覔覕覛覜覟覠覥覰覴覵覶覷覼觔",4,"觥觩觫觭觱觳觶觹觽觿訄訅訇訏訑訒訔訕訞訠訢訤訦訫訬訯訵訷訽訾詀詃詅詇詉詍詎詓詖詗詘詜詝詡詥詧詵詶詷詹詺詻詾詿誀誃誆誋誏誐誒誖誗誙誟誧誩誮誯誳"],["8fdea1","誶誷誻誾諃諆諈諉諊諑諓諔諕諗諝諟諬諰諴諵諶諼諿謅謆謋謑謜謞謟謊謭謰謷謼譂",4,"譈譒譓譔譙譍譞譣譭譶譸譹譼譾讁讄讅讋讍讏讔讕讜讞讟谸谹谽谾豅豇豉豋豏豑豓豔豗豘豛豝豙豣豤豦豨豩豭豳豵豶豻豾貆"],["8fdfa1","貇貋貐貒貓貙貛貜貤貹貺賅賆賉賋賏賖賕賙賝賡賨賬賯賰賲賵賷賸賾賿贁贃贉贒贗贛赥赩赬赮赿趂趄趈趍趐趑趕趞趟趠趦趫趬趯趲趵趷趹趻跀跅跆跇跈跊跎跑跔跕跗跙跤跥跧跬跰趼跱跲跴跽踁踄踅踆踋踑踔踖踠踡踢"],["8fe0a1","踣踦踧踱踳踶踷踸踹踽蹀蹁蹋蹍蹎蹏蹔蹛蹜蹝蹞蹡蹢蹩蹬蹭蹯蹰蹱蹹蹺蹻躂躃躉躐躒躕躚躛躝躞躢躧躩躭躮躳躵躺躻軀軁軃軄軇軏軑軔軜軨軮軰軱軷軹軺軭輀輂輇輈輏輐輖輗輘輞輠輡輣輥輧輨輬輭輮輴輵輶輷輺轀轁"],["8fe1a1","轃轇轏轑",4,"轘轝轞轥辝辠辡辤辥辦辵辶辸达迀迁迆迊迋迍运迒迓迕迠迣迤迨迮迱迵迶迻迾适逄逈逌逘逛逨逩逯逪逬逭逳逴逷逿遃遄遌遛遝遢遦遧遬遰遴遹邅邈邋邌邎邐邕邗邘邙邛邠邡邢邥邰邲邳邴邶邽郌邾郃"],["8fe2a1","郄郅郇郈郕郗郘郙郜郝郟郥郒郶郫郯郰郴郾郿鄀鄄鄅鄆鄈鄍鄐鄔鄖鄗鄘鄚鄜鄞鄠鄥鄢鄣鄧鄩鄮鄯鄱鄴鄶鄷鄹鄺鄼鄽酃酇酈酏酓酗酙酚酛酡酤酧酭酴酹酺酻醁醃醅醆醊醎醑醓醔醕醘醞醡醦醨醬醭醮醰醱醲醳醶醻醼醽醿"],["8fe3a1","釂釃釅釓釔釗釙釚釞釤釥釩釪釬",5,"釷釹釻釽鈀鈁鈄鈅鈆鈇鈉鈊鈌鈐鈒鈓鈖鈘鈜鈝鈣鈤鈥鈦鈨鈮鈯鈰鈳鈵鈶鈸鈹鈺鈼鈾鉀鉂鉃鉆鉇鉊鉍鉎鉏鉑鉘鉙鉜鉝鉠鉡鉥鉧鉨鉩鉮鉯鉰鉵",4,"鉻鉼鉽鉿銈銉銊銍銎銒銗"],["8fe4a1","銙銟銠銤銥銧銨銫銯銲銶銸銺銻銼銽銿",4,"鋅鋆鋇鋈鋋鋌鋍鋎鋐鋓鋕鋗鋘鋙鋜鋝鋟鋠鋡鋣鋥鋧鋨鋬鋮鋰鋹鋻鋿錀錂錈錍錑錔錕錜錝錞錟錡錤錥錧錩錪錳錴錶錷鍇鍈鍉鍐鍑鍒鍕鍗鍘鍚鍞鍤鍥鍧鍩鍪鍭鍯鍰鍱鍳鍴鍶"],["8fe5a1","鍺鍽鍿鎀鎁鎂鎈鎊鎋鎍鎏鎒鎕鎘鎛鎞鎡鎣鎤鎦鎨鎫鎴鎵鎶鎺鎩鏁鏄鏅鏆鏇鏉",4,"鏓鏙鏜鏞鏟鏢鏦鏧鏹鏷鏸鏺鏻鏽鐁鐂鐄鐈鐉鐍鐎鐏鐕鐖鐗鐟鐮鐯鐱鐲鐳鐴鐻鐿鐽鑃鑅鑈鑊鑌鑕鑙鑜鑟鑡鑣鑨鑫鑭鑮鑯鑱鑲钄钃镸镹"],["8fe6a1","镾閄閈閌閍閎閝閞閟閡閦閩閫閬閴閶閺閽閿闆闈闉闋闐闑闒闓闙闚闝闞闟闠闤闦阝阞阢阤阥阦阬阱阳阷阸阹阺阼阽陁陒陔陖陗陘陡陮陴陻陼陾陿隁隂隃隄隉隑隖隚隝隟隤隥隦隩隮隯隳隺雊雒嶲雘雚雝雞雟雩雯雱雺霂"],["8fe7a1","霃霅霉霚霛霝霡霢霣霨霱霳靁靃靊靎靏靕靗靘靚靛靣靧靪靮靳靶靷靸靻靽靿鞀鞉鞕鞖鞗鞙鞚鞞鞟鞢鞬鞮鞱鞲鞵鞶鞸鞹鞺鞼鞾鞿韁韄韅韇韉韊韌韍韎韐韑韔韗韘韙韝韞韠韛韡韤韯韱韴韷韸韺頇頊頙頍頎頔頖頜頞頠頣頦"],["8fe8a1","頫頮頯頰頲頳頵頥頾顄顇顊顑顒顓顖顗顙顚顢顣顥顦顪顬颫颭颮颰颴颷颸颺颻颿飂飅飈飌飡飣飥飦飧飪飳飶餂餇餈餑餕餖餗餚餛餜餟餢餦餧餫餱",4,"餹餺餻餼饀饁饆饇饈饍饎饔饘饙饛饜饞饟饠馛馝馟馦馰馱馲馵"],["8fe9a1","馹馺馽馿駃駉駓駔駙駚駜駞駧駪駫駬駰駴駵駹駽駾騂騃騄騋騌騐騑騖騞騠騢騣騤騧騭騮騳騵騶騸驇驁驄驊驋驌驎驑驔驖驝骪骬骮骯骲骴骵骶骹骻骾骿髁髃髆髈髎髐髒髕髖髗髛髜髠髤髥髧髩髬髲髳髵髹髺髽髿",4],["8feaa1","鬄鬅鬈鬉鬋鬌鬍鬎鬐鬒鬖鬙鬛鬜鬠鬦鬫鬭鬳鬴鬵鬷鬹鬺鬽魈魋魌魕魖魗魛魞魡魣魥魦魨魪",4,"魳魵魷魸魹魿鮀鮄鮅鮆鮇鮉鮊鮋鮍鮏鮐鮔鮚鮝鮞鮦鮧鮩鮬鮰鮱鮲鮷鮸鮻鮼鮾鮿鯁鯇鯈鯎鯐鯗鯘鯝鯟鯥鯧鯪鯫鯯鯳鯷鯸"],["8feba1","鯹鯺鯽鯿鰀鰂鰋鰏鰑鰖鰘鰙鰚鰜鰞鰢鰣鰦",4,"鰱鰵鰶鰷鰽鱁鱃鱄鱅鱉鱊鱎鱏鱐鱓鱔鱖鱘鱛鱝鱞鱟鱣鱩鱪鱜鱫鱨鱮鱰鱲鱵鱷鱻鳦鳲鳷鳹鴋鴂鴑鴗鴘鴜鴝鴞鴯鴰鴲鴳鴴鴺鴼鵅鴽鵂鵃鵇鵊鵓鵔鵟鵣鵢鵥鵩鵪鵫鵰鵶鵷鵻"],["8feca1","鵼鵾鶃鶄鶆鶊鶍鶎鶒鶓鶕鶖鶗鶘鶡鶪鶬鶮鶱鶵鶹鶼鶿鷃鷇鷉鷊鷔鷕鷖鷗鷚鷞鷟鷠鷥鷧鷩鷫鷮鷰鷳鷴鷾鸊鸂鸇鸎鸐鸑鸒鸕鸖鸙鸜鸝鹺鹻鹼麀麂麃麄麅麇麎麏麖麘麛麞麤麨麬麮麯麰麳麴麵黆黈黋黕黟黤黧黬黭黮黰黱黲黵"],["8feda1","黸黿鼂鼃鼉鼏鼐鼑鼒鼔鼖鼗鼙鼚鼛鼟鼢鼦鼪鼫鼯鼱鼲鼴鼷鼹鼺鼼鼽鼿齁齃",4,"齓齕齖齗齘齚齝齞齨齩齭",4,"齳齵齺齽龏龐龑龒龔龖龗龞龡龢龣龥"]]},{}],97:[function(e,t,r){t.exports={
uChars:[128,165,169,178,184,216,226,235,238,244,248,251,253,258,276,284,300,325,329,334,364,463,465,467,469,471,473,475,477,506,594,610,712,716,730,930,938,962,970,1026,1104,1106,8209,8215,8218,8222,8231,8241,8244,8246,8252,8365,8452,8454,8458,8471,8482,8556,8570,8596,8602,8713,8720,8722,8726,8731,8737,8740,8742,8748,8751,8760,8766,8777,8781,8787,8802,8808,8816,8854,8858,8870,8896,8979,9322,9372,9548,9588,9616,9622,9634,9652,9662,9672,9676,9680,9702,9735,9738,9793,9795,11906,11909,11913,11917,11928,11944,11947,11951,11956,11960,11964,11979,12284,12292,12312,12319,12330,12351,12436,12447,12535,12543,12586,12842,12850,12964,13200,13215,13218,13253,13263,13267,13270,13384,13428,13727,13839,13851,14617,14703,14801,14816,14964,15183,15471,15585,16471,16736,17208,17325,17330,17374,17623,17997,18018,18212,18218,18301,18318,18760,18811,18814,18820,18823,18844,18848,18872,19576,19620,19738,19887,40870,59244,59336,59367,59413,59417,59423,59431,59437,59443,59452,59460,59478,59493,63789,63866,63894,63976,63986,64016,64018,64021,64025,64034,64037,64042,65074,65093,65107,65112,65127,65132,65375,65510,65536],gbChars:[0,36,38,45,50,81,89,95,96,100,103,104,105,109,126,133,148,172,175,179,208,306,307,308,309,310,311,312,313,341,428,443,544,545,558,741,742,749,750,805,819,820,7922,7924,7925,7927,7934,7943,7944,7945,7950,8062,8148,8149,8152,8164,8174,8236,8240,8262,8264,8374,8380,8381,8384,8388,8390,8392,8393,8394,8396,8401,8406,8416,8419,8424,8437,8439,8445,8482,8485,8496,8521,8603,8936,8946,9046,9050,9063,9066,9076,9092,9100,9108,9111,9113,9131,9162,9164,9218,9219,11329,11331,11334,11336,11346,11361,11363,11366,11370,11372,11375,11389,11682,11686,11687,11692,11694,11714,11716,11723,11725,11730,11736,11982,11989,12102,12336,12348,12350,12384,12393,12395,12397,12510,12553,12851,12962,12973,13738,13823,13919,13933,14080,14298,14585,14698,15583,15847,16318,16434,16438,16481,16729,17102,17122,17315,17320,17402,17418,17859,17909,17911,17915,17916,17936,17939,17961,18664,18703,18814,18962,19043,33469,33470,33471,33484,33485,33490,33497,33501,33505,33513,33520,33536,33550,37845,37921,37948,38029,38038,38064,38065,38066,38069,38075,38076,38078,39108,39109,39113,39114,39115,39116,39265,39394,189e3]}},{}],98:[function(e,t,r){t.exports=[["a140","",62],["a180","",32],["a240","",62],["a280","",32],["a2ab","",5],["a2e3","€"],["a2ef",""],["a2fd",""],["a340","",62],["a380","",31,"　"],["a440","",62],["a480","",32],["a4f4","",10],["a540","",62],["a580","",32],["a5f7","",7],["a640","",62],["a680","",32],["a6b9","",7],["a6d9","",6],["a6ec",""],["a6f3",""],["a6f6","",8],["a740","",62],["a780","",32],["a7c2","",14],["a7f2","",12],["a896","",10],["a8bc",""],["a8bf","ǹ"],["a8c1",""],["a8ea","",20],["a958",""],["a95b",""],["a95d",""],["a989","〾⿰",11],["a997","",12],["a9f0","",14],["aaa1","",93],["aba1","",93],["aca1","",93],["ada1","",93],["aea1","",93],["afa1","",93],["d7fa","",4],["f8a1","",93],["f9a1","",93],["faa1","",93],["fba1","",93],["fca1","",93],["fda1","",93],["fe50","⺁⺄㑳㑇⺈⺋㖞㘚㘎⺌⺗㥮㤘㧏㧟㩳㧐㭎㱮㳠⺧⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌"],["fe80","䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶䲣䲟䲠䲡䱷䲢䴓",6,"䶮",93]]},{}],99:[function(e,t,r){t.exports=[["0","\0",128],["a1","｡",62],["8140","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×"],["8180","÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓"],["81b8","∈∋⊆⊇⊂⊃∪∩"],["81c8","∧∨￢⇒⇔∀∃"],["81da","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],["81f0","Å‰♯♭♪†‡¶"],["81fc","◯"],["824f","０",9],["8260","Ａ",25],["8281","ａ",25],["829f","ぁ",82],["8340","ァ",62],["8380","ム",22],["839f","Α",16,"Σ",6],["83bf","α",16,"σ",6],["8440","А",5,"ЁЖ",25],["8470","а",5,"ёж",7],["8480","о",17],["849f","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],["8740","①",19,"Ⅰ",9],["875f","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],["877e","㍻"],["8780","〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],["889f","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],["8940","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円"],["8980","園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],["8a40","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫"],["8a80","橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],["8b40","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救"],["8b80","朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],["8c40","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨"],["8c80","劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],["8d40","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降"],["8d80","項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],["8e40","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止"],["8e80","死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],["8f40","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳"],["8f80","準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],["9040","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨"],["9080","逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],["9140","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻"],["9180","操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],["9240","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄"],["9280","逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],["9340","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬"],["9380","凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],["9440","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅"],["9480","楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],["9540","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷"],["9580","斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],["9640","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆"],["9680","摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],["9740","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲"],["9780","沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],["9840","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],["989f","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],["9940","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭"],["9980","凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],["9a40","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸"],["9a80","噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],["9b40","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀"],["9b80","它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],["9c40","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠"],["9c80","怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],["9d40","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫"],["9d80","捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],["9e40","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎"],["9e80","梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],["9f40","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯"],["9f80","麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],["e040","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝"],["e080","烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],["e140","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿"],["e180","痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],["e240","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰"],["e280","窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],["e340","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷"],["e380","縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],["e440","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤"],["e480","艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],["e540","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬"],["e580","蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],["e640","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧"],["e680","諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],["e740","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜"],["e780","轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],["e840","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙"],["e880","閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],["e940","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃"],["e980","騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],["ea40","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯"],["ea80","黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙"],["ed40","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏"],["ed80","塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],["ee40","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙"],["ee80","蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],["eeef","ⅰ",9,"￢￤＇＂"],["f040","",62],["f080","",124],["f140","",62],["f180","",124],["f240","",62],["f280","",124],["f340","",62],["f380","",124],["f440","",62],["f480","",124],["f540","",62],["f580","",124],["f640","",62],["f680","",124],["f740","",62],["f780","",124],["f840","",62],["f880","",124],["f940",""],["fa40","ⅰ",9,"Ⅰ",9,"￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊"],["fa80","兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯"],["fb40","涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神"],["fb80","祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙"],["fc40","髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"]]},{}],100:[function(e,t,r){(function(e){function t(e){return{write:n,end:function(){}}}function n(t){for(var r=new e(t,"ucs2"),n=0;n<r.length;n+=2){var i=r[n];r[n]=r[n+1],r[n+1]=i}return r}function i(e){return{write:o,end:function(){},overflowByte:-1}}function o(t){if(0==t.length)return"";var r=new e(t.length+1),n=0,i=0;for(-1!==this.overflowByte&&(r[0]=t[0],r[1]=this.overflowByte,n=1,i=2);n<t.length-1;n+=2,i+=2)r[i]=t[n+1],r[i+1]=t[n];return this.overflowByte=n==t.length-1?t[t.length-1]:-1,r.slice(0,i).toString("ucs2")}function s(e){e=e||{};var t=this.getCodec(e.use||"utf-16be");if(!t.bom)throw new Error("iconv-lite: in UTF-16 encoder, 'use' parameter should be either UTF-16BE or UTF16-LE.");return{write:a,end:c,bom:t.bom,internalEncoder:t.encoder(e)}}function a(t){var r=this.internalEncoder.write(t);return this.bom&&(r=e.concat([this.bom,r]),this.bom=null),r}function c(){return this.internalEncoder.end()}function f(e){return{write:u,end:h,internalDecoder:null,initialBytes:[],initialBytesLen:0,options:e||{},getCodec:this.getCodec}}function u(e){return this.internalDecoder?this.internalDecoder.write(e):(this.initialBytes.push(e),this.initialBytesLen+=e.length,this.initialBytesLen<16?"":l.call(this))}function h(){if(this.internalDecoder)return this.internalDecoder.end();var e,t=l.call(this);return this.internalDecoder&&(e=this.internalDecoder.end()),e&&e.length>0?t+e:t}function l(){var t=e.concat(this.initialBytes);if(this.initialBytes.length=this.initialBytesLen=0,t.length<2)return"";var r=this.options.default||"utf-16be";if(254==t[0]&&255==t[1])r="utf-16be",t=t.slice(2);else if(255==t[0]&&254==t[1])r="utf-16le",t=t.slice(2);else{for(var n=[0,0],i=Math.min(t.length-t.length%2,64),o=0;o<i;o+=2)0==t[o]&&32==t[o+1]&&n[0]++,32==t[o]&&0==t[o+1]&&n[1]++;n[0]>0&&0==n[1]?r="utf-16be":0==n[0]&&n[1]>0&&(r="utf-16le")}return this.internalDecoder=this.getCodec(r).decoder(this.options),this.internalDecoder.write(t)}r.utf16be=function(r){return{encoder:t,decoder:i,bom:new e([254,255])}},r.utf16=function(e){return{encoder:s,decoder:f,getCodec:e.iconv.getCodec}}}).call(this,e("buffer").Buffer)},{buffer:66}],101:[function(e,t,r){(function(e){function t(t){return new e(t.replace(f,function(e){return"+"+("+"===e?"":this.iconv.encode(e,"utf16-be").toString("base64").replace(/=+$/,""))+"-"}.bind(this)))}function n(t){for(var r="",n=0,i=this.inBase64,o=this.base64Accum,s=0;s<t.length;s++)if(i){if(!h[t[s]]){if(s==n&&t[s]==d)r+="+";else{var a=o+t.slice(n,s).toString();r+=this.iconv.decode(new e(a,"base64"),"utf16-be")}t[s]!=d&&s--,n=s+1,i=!1,o=""}}else t[s]==p&&(r+=this.iconv.decode(t.slice(n,s),"ascii"),n=s+1,i=!0);if(i){var a=o+t.slice(n).toString(),c=a.length-a.length%8;o=a.slice(c),a=a.slice(0,c),r+=this.iconv.decode(new e(a,"base64"),"utf16-be")}else r+=this.iconv.decode(t.slice(n),"ascii");return this.inBase64=i,this.base64Accum=o,r}function i(){var t="";return this.inBase64&&this.base64Accum.length>0&&(t=this.iconv.decode(new e(this.base64Accum,"base64"),"utf16-be")),this.inBase64=!1,this.base64Accum="",t}function o(t){for(var r=this.inBase64,n=this.base64Accum,i=this.base64AccumIdx,o=new e(5*t.length+10),s=0,a=0;a<t.length;a++){var c=t.charCodeAt(a);32<=c&&c<=126?(r&&(i>0&&(s+=o.write(n.slice(0,i).toString("base64").replace(/\//g,",").replace(/=+$/,""),s),i=0),o[s++]=d,r=!1),r||(o[s++]=c,c===y&&(o[s++]=d))):(r||(o[s++]=y,r=!0),r&&(n[i++]=c>>8,n[i++]=255&c,i==n.length&&(s+=o.write(n.toString("base64").replace(/\//g,","),s),i=0)))}return this.inBase64=r,this.base64AccumIdx=i,o.slice(0,s)}function s(){var t=new e(10),r=0;return this.inBase64&&(this.base64AccumIdx>0&&(r+=t.write(this.base64Accum.slice(0,this.base64AccumIdx).toString("base64").replace(/\//g,",").replace(/=+$/,""),r),this.base64AccumIdx=0),t[r++]=d,this.inBase64=!1),t.slice(0,r)}function a(t){for(var r="",n=0,i=this.inBase64,o=this.base64Accum,s=0;s<t.length;s++)if(i){if(!g[t[s]]){if(s==n&&t[s]==d)r+="&";else{var a=o+t.slice(n,s).toString().replace(/,/g,"/");r+=this.iconv.decode(new e(a,"base64"),"utf16-be")}t[s]!=d&&s--,n=s+1,i=!1,o=""}}else t[s]==y&&(r+=this.iconv.decode(t.slice(n,s),"ascii"),n=s+1,i=!0);if(i){var a=o+t.slice(n).toString().replace(/,/g,"/"),c=a.length-a.length%8;o=a.slice(c),a=a.slice(0,c),r+=this.iconv.decode(new e(a,"base64"),"utf16-be")}else r+=this.iconv.decode(t.slice(n),"ascii");return this.inBase64=i,this.base64Accum=o,r}function c(){var t="";return this.inBase64&&this.base64Accum.length>0&&(t=this.iconv.decode(new e(this.base64Accum,"base64"),"utf16-be")),this.inBase64=!1,this.base64Accum="",t}r.utf7=function(e){return{encoder:function(){return{write:t,end:function(){},iconv:e.iconv}},decoder:function(){return{write:n,end:i,iconv:e.iconv,inBase64:!1,base64Accum:""}}}},r.unicode11utf7="utf7";for(var f=/[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g,u=/[A-Za-z0-9\/+]/,h=[],l=0;l<256;l++)h[l]=u.test(String.fromCharCode(l));var p="+".charCodeAt(0),d="-".charCodeAt(0),y="&".charCodeAt(0);r.utf7imap=function(t){return{encoder:function(){return{write:o,end:s,iconv:t.iconv,inBase64:!1,base64Accum:new e(6),base64AccumIdx:0}},decoder:function(){return{write:a,end:c,iconv:t.iconv,inBase64:!1,base64Accum:""}}}};var g=h.slice();g[",".charCodeAt(0)]=!0}).call(this,e("buffer").Buffer)},{buffer:66}],102:[function(e,t,r){(function(r){t.exports=function(t){var n=void 0;t.extendNodeEncodings=function(){if(!n){n={};var i={hex:!0,utf8:!0,"utf-8":!0,ascii:!0,binary:!0,base64:!0,ucs2:!0,"ucs-2":!0,utf16le:!0,"utf-16le":!0};r.isNativeEncoding=function(e){return i[e&&e.toLowerCase()]};var o=e("buffer").SlowBuffer;if(n.SlowBufferToString=o.prototype.toString,o.prototype.toString=function(e,i,o){return e=String(e||"utf8").toLowerCase(),i=+i||0,"number"!=typeof o&&(o=this.length),+o==i?"":r.isNativeEncoding(e)?n.SlowBufferToString.call(this,e,i,o):(void 0===i&&(i=0),void 0===o&&(o=this.length),t.decode(this.slice(i,o),e))},n.SlowBufferWrite=o.prototype.write,o.prototype.write=function(e,i,o,s){if(isFinite(i))isFinite(o)||(s=o,o=void 0);else{var a=s;s=i,i=o,o=a}i=+i||0;var c=this.length-i;if(o?(o=+o)>c&&(o=c):o=c,s=String(s||"utf8").toLowerCase(),r.isNativeEncoding(s))return n.SlowBufferWrite.call(this,e,i,o,s);if(e.length>0&&(o<0||i<0))throw new RangeError("attempt to write beyond buffer bounds");var f=t.encode(e,s);return f.length<o&&(o=f.length),f.copy(this,i,0,o),o},n.BufferIsEncoding=r.isEncoding,r.isEncoding=function(e){return r.isNativeEncoding(e)||t.encodingExists(e)},n.BufferByteLength=r.byteLength,r.byteLength=o.byteLength=function(e,i){return i=String(i||"utf8").toLowerCase(),r.isNativeEncoding(i)?n.BufferByteLength.call(this,e,i):t.encode(e,i).length},n.BufferToString=r.prototype.toString,r.prototype.toString=function(e,i,o){return e=String(e||"utf8").toLowerCase(),r.isNativeEncoding(e)?n.BufferToString.call(this,e,i,o):(void 0===i&&(i=0),void 0===o&&(o=this.length),t.decode(this.slice(i,o),e))},n.BufferWrite=r.prototype.write,r.prototype.write=function(e,i,o,s){var a=i,c=o,f=s;if(isFinite(i))isFinite(o)||(s=o,o=void 0);else{var u=s;s=i,i=o,o=u}if(s=String(s||"utf8").toLowerCase(),r.isNativeEncoding(s))return n.BufferWrite.call(this,e,a,c,f);i=+i||0;var h=this.length-i;if(o?(o=+o)>h&&(o=h):o=h,e.length>0&&(o<0||i<0))throw new RangeError("attempt to write beyond buffer bounds");var l=t.encode(e,s);return l.length<o&&(o=l.length),l.copy(this,i,0,o),o},t.supportsStreams){var s=e("stream").Readable;n.ReadableSetEncoding=s.prototype.setEncoding,s.prototype.setEncoding=function(e,i){if(r.isNativeEncoding(e))return n.ReadableSetEncoding.call(this,e);this._readableState.decoder=t.getCodec(e).decoder(i),this._readableState.encoding=e},s.prototype.collect=t._collect}}},t.undoExtendNodeEncodings=function(){if(!n)throw new Error("require('iconv-lite').undoExtendNodeEncodings(): Nothing to undo; extendNodeEncodings() is not called.");delete r.isNativeEncoding;var i=e("buffer").SlowBuffer;if(i.prototype.toString=n.SlowBufferToString,i.prototype.write=n.SlowBufferWrite,r.isEncoding=n.BufferIsEncoding,r.byteLength=n.BufferByteLength,r.prototype.toString=n.BufferToString,r.prototype.write=n.BufferWrite,t.supportsStreams){var o=e("stream").Readable;o.prototype.setEncoding=n.ReadableSetEncoding,delete o.prototype.collect}n=void 0}}}).call(this,e("buffer").Buffer)},{buffer:66,stream:80}],103:[function(e,t,r){(function(r,n){var i=t.exports;i.encodings=null,i.defaultCharUnicode="�",i.defaultCharSingleByte="?",i.encode=function(e,t,r){e=""+(e||"");var o=i.getCodec(t).encoder(r),s=o.write(e),a=o.end();return a&&a.length>0?n.concat([s,a]):s},i.decode=function(e,t,r){"string"==typeof e&&(i.skipDecodeWarning||(console.error("Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding"),i.skipDecodeWarning=!0),e=new n(""+(e||""),"binary"));var o=i.getCodec(t).decoder(r),s=o.write(e),a=o.end();return a&&a.length>0?s+a:s},i.encodingExists=function(e){try{return i.getCodec(e),!0}catch(e){return!1}},i.toEncoding=i.encode,i.fromEncoding=i.decode,i._codecDataCache={},i.getCodec=function(t){i.encodings||(i.encodings=e("../encodings"));for(var r,n,o=(""+t).toLowerCase().replace(/[^0-9a-z]|:\d{4}$/g,"");;){if(r=i._codecDataCache[o])return r;var s=i.encodings[o];switch(typeof s){case"string":o=s;break;case"object":if(n)for(var a in s)n[a]=s[a];else n=s,n.encodingName=o;o=s.type;break;case"function":return n||(n={encodingName:o}),n.iconv=i,r=s.call(i.encodings,n),i._codecDataCache[n.encodingName]=r,r;default:throw new Error("Encoding not recognized: '"+t+"' (searched as: '"+o+"')")}}};var o=void 0!==r&&r.versions&&r.versions.node;if(o){var s=o.split(".").map(Number);(s[0]>0||s[1]>=10)&&e("./streams")(i),e("./extend-node")(i)}}).call(this,e("_process"),e("buffer").Buffer)},{"../encodings":87,"./extend-node":102,"./streams":104,_process:111,buffer:66}],104:[function(e,t,r){(function(r){function n(e,t){this.conv=e,t=t||{},t.decodeStrings=!1,o.call(this,t)}function i(e,t){this.conv=e,t=t||{},t.encoding=this.encoding="utf8",o.call(this,t)}var o=e("stream").Transform;t.exports=function(e){e.encodeStream=function(t,r){return new n(e.getCodec(t).encoder(r),r)},e.decodeStream=function(t,r){return new i(e.getCodec(t).decoder(r),r)},e.supportsStreams=!0,e.IconvLiteEncoderStream=n,e.IconvLiteDecoderStream=i,e._collect=i.prototype.collect},n.prototype=Object.create(o.prototype,{constructor:{value:n}}),n.prototype._transform=function(e,t,r){if("string"!=typeof e)return r(new Error("Iconv encoding stream needs strings as its input."));try{var n=this.conv.write(e);n&&n.length&&this.push(n),r()}catch(e){r(e)}},n.prototype._flush=function(e){try{var t=this.conv.end();t&&t.length&&this.push(t),e()}catch(t){e(t)}},n.prototype.collect=function(e){var t=[];return this.on("error",e),this.on("data",function(e){t.push(e)}),this.on("end",function(){e(null,r.concat(t))}),this},i.prototype=Object.create(o.prototype,{constructor:{value:i}}),i.prototype._transform=function(e,t,n){if(!r.isBuffer(e))return n(new Error("Iconv decoding stream needs buffers as its input."));try{var i=this.conv.write(e);i&&i.length&&this.push(i,this.encoding),n()}catch(e){n(e)}},i.prototype._flush=function(e){try{var t=this.conv.end();t&&t.length&&this.push(t,this.encoding),e()}catch(t){e(t)}},i.prototype.collect=function(e){var t="";return this.on("error",e),this.on("data",function(e){t+=e}),this.on("end",function(){e(null,t)}),this}}).call(this,e("buffer").Buffer)},{buffer:66,stream:80}],105:[function(e,t,r){r.read=function(e,t,r,n,i){var o,s,a=8*i-n-1,c=(1<<a)-1,f=c>>1,u=-7,h=r?i-1:0,l=r?-1:1,p=e[t+h];for(h+=l,o=p&(1<<-u)-1,p>>=-u,u+=a;u>0;o=256*o+e[t+h],h+=l,u-=8);for(s=o&(1<<-u)-1,o>>=-u,u+=n;u>0;s=256*s+e[t+h],h+=l,u-=8);if(0===o)o=1-f;else{if(o===c)return s?NaN:1/0*(p?-1:1);s+=Math.pow(2,n),o-=f}return(p?-1:1)*s*Math.pow(2,o-n)},r.write=function(e,t,r,n,i,o){var s,a,c,f=8*o-i-1,u=(1<<f)-1,h=u>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,d=n?1:-1,y=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(a=isNaN(t)?1:0,s=u):(s=Math.floor(Math.log(t)/Math.LN2),t*(c=Math.pow(2,-s))<1&&(s--,c*=2),t+=s+h>=1?l/c:l*Math.pow(2,1-h),t*c>=2&&(s++,c/=2),s+h>=u?(a=0,s=u):s+h>=1?(a=(t*c-1)*Math.pow(2,i),s+=h):(a=t*Math.pow(2,h-1)*Math.pow(2,i),s=0));i>=8;e[r+p]=255&a,p+=d,a/=256,i-=8);for(s=s<<i|a,f+=i;f>0;e[r+p]=255&s,p+=d,s/=256,f-=8);e[r+p-d]|=128*y}},{}],106:[function(e,t,r){"function"==typeof Object.create?t.exports=function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(e,t){e.super_=t;var r=function(){};r.prototype=t.prototype,e.prototype=new r,e.prototype.constructor=e}},{}],107:[function(e,t,r){function n(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}function i(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&n(e.slice(0,0))}t.exports=function(e){return null!=e&&(n(e)||i(e)||!!e._isBuffer)}},{}],108:[function(e,t,r){function n(){var e,t=!1,r=this;r._DeArray=function(e,t,r){return[e.slice(t,t+r)]},r._EnArray=function(e,t,r,n){for(var i=0;i<r;e[t+i]=n[i]?n[i]:0,i++);},r._DeChar=function(e,t){return String.fromCharCode(e[t])},r._EnChar=function(e,t,r){e[t]=r.charCodeAt(0)},r._DeInt=function(r,n){var i,o,s,a=t?e.len-1:0,c=t?-1:1,f=a+c*e.len;for(i=0,o=a,s=1;o!=f;i+=r[n+o]*s,o+=c,s*=256);return e.bSigned&&i&Math.pow(2,8*e.len-1)&&(i-=Math.pow(2,8*e.len)),i},r._EnInt=function(r,n,i){var o,s=t?e.len-1:0,a=t?-1:1,c=s+a*e.len;for(i=i<e.min?e.min:i>e.max?e.max:i,o=s;o!=c;r[n+o]=255&i,o+=a,i>>=8);},r._DeString=function(e,t,r){for(var n=new Array(r),i=0;i<r;n[i]=String.fromCharCode(e[t+i]),i++);return n.join("")},r._EnString=function(e,t,r,n){for(var i,o=0;o<r;e[t+o]=(i=n.charCodeAt(o))?i:0,o++);},r._De754=function(r,n){var i,o,s,a,c,f,u,h,l,p;for(u=e.mLen,h=8*e.len-e.mLen-1,p=(1<<h)-1,l=p>>1,a=t?0:e.len-1,c=t?1:-1,i=r[n+a],a+=c,f=-7,o=i&(1<<-f)-1,i>>=-f,f+=h;f>0;o=256*o+r[n+a],a+=c,f-=8);for(s=o&(1<<-f)-1,o>>=-f,f+=u;f>0;s=256*s+r[n+a],a+=c,f-=8);switch(o){case 0:o=1-l;break;case p:return s?NaN:1/0*(i?-1:1);default:s+=Math.pow(2,u),o-=l}return(i?-1:1)*s*Math.pow(2,o-u)},r._En754=function(r,n,i){var o,s,a,c,f,u,h,l,p,d;for(h=e.mLen,l=8*e.len-e.mLen-1,d=(1<<l)-1,p=d>>1,o=i<0?1:0,i=Math.abs(i),isNaN(i)||i==1/0?(a=isNaN(i)?1:0,s=d):(s=Math.floor(Math.log(i)/Math.LN2),i*(u=Math.pow(2,-s))<1&&(s--,u*=2),i+=s+p>=1?e.rt/u:e.rt*Math.pow(2,1-p),i*u>=2&&(s++,u/=2),s+p>=d?(a=0,s=d):s+p>=1?(a=(i*u-1)*Math.pow(2,h),s+=p):(a=i*Math.pow(2,p-1)*Math.pow(2,h),s=0)),c=t?e.len-1:0,f=t?-1:1;h>=8;r[n+c]=255&a,c+=f,a/=256,h-=8);for(s=s<<h|a,l+=h;l>0;r[n+c]=255&s,c+=f,s/=256,l-=8);r[n+c-f]|=128*o},r._DeInt64=function(r,n){var i,o,s,a=t?0:7,c=t?1:-1,f=a+8*c,u=[0,0,!e.bSigned];for(i=a,s=1,o=0;i!=f;u[s]=(u[s]<<8>>>0)+r[n+i],i+=c,o++,s=o<4?1:0);return u},r._EnInt64=function(e,r,n){var i,o,s,a,c=t?0:7,f=t?1:-1,u=c+8*f;for(i=c,s=1,o=0,a=24;i!=u;e[r+i]=n[s]>>a&255,i+=f,o++,s=o<4?1:0,a=24-o%4*8);},r._sPattern="(\\d+)?([AxcbBhHsfdiIlLqQ])",r._lenLut={A:1,x:1,c:1,b:1,B:1,h:2,H:2,s:1,f:4,d:8,i:4,I:4,l:4,L:4,q:8,Q:8},r._elLut={A:{en:r._EnArray,de:r._DeArray},s:{en:r._EnString,de:r._DeString},c:{en:r._EnChar,de:r._DeChar},b:{en:r._EnInt,de:r._DeInt,len:1,bSigned:!0,min:-Math.pow(2,7),max:Math.pow(2,7)-1},B:{en:r._EnInt,de:r._DeInt,len:1,bSigned:!1,min:0,max:Math.pow(2,8)-1},h:{en:r._EnInt,de:r._DeInt,len:2,bSigned:!0,min:-Math.pow(2,15),max:Math.pow(2,15)-1},H:{en:r._EnInt,de:r._DeInt,len:2,bSigned:!1,min:0,max:Math.pow(2,16)-1},i:{en:r._EnInt,de:r._DeInt,len:4,bSigned:!0,min:-Math.pow(2,31),max:Math.pow(2,31)-1},I:{en:r._EnInt,de:r._DeInt,len:4,bSigned:!1,min:0,max:Math.pow(2,32)-1},l:{en:r._EnInt,de:r._DeInt,len:4,bSigned:!0,min:-Math.pow(2,31),max:Math.pow(2,31)-1},L:{en:r._EnInt,de:r._DeInt,len:4,bSigned:!1,min:0,max:Math.pow(2,32)-1},f:{en:r._En754,de:r._De754,len:4,mLen:23,rt:Math.pow(2,-24)-Math.pow(2,-77)},d:{en:r._En754,de:r._De754,len:8,mLen:52,rt:0},q:{en:r._EnInt64,de:r._DeInt64,bSigned:!0},Q:{en:r._EnInt64,de:r._DeInt64,bSigned:!1}},r._UnpackSeries=function(t,r,n,i){for(var o=e.de,s=[],a=0;a<t;s.push(o(n,i+a*r)),a++);return s},r._PackSeries=function(t,r,n,i,o,s){for(var a=e.en,c=0;c<t;a(n,i+c*r,o[s+c]),c++);},r.Unpack=function(r,n,i){t="<"!=r.charAt(0),i=i||0;for(var o,s,a,c=new RegExp(this._sPattern,"g"),f=[];o=c.exec(r);){if(s=void 0==o[1]||""==o[1]?1:parseInt(o[1]),a=this._lenLut[o[2]],i+s*a>n.length)return;switch(o[2]){case"A":case"s":f.push(this._elLut[o[2]].de(n,i,s));break;case"c":case"b":case"B":case"h":case"H":case"i":case"I":case"l":case"L":case"f":case"d":case"q":case"Q":e=this._elLut[o[2]],f.push(this._UnpackSeries(s,a,n,i))}i+=s*a}return Array.prototype.concat.apply([],f)},r.PackTo=function(r,n,i,o){t="<"!=r.charAt(0);for(var s,a,c,f,u=new RegExp(this._sPattern,"g"),h=0;s=u.exec(r);){if(a=void 0==s[1]||""==s[1]?1:parseInt(s[1]),c=this._lenLut[s[2]],i+a*c>n.length)return!1;switch(s[2]){case"A":case"s":if(h+1>o.length)return!1;this._elLut[s[2]].en(n,i,a,o[h]),h+=1;break;case"c":case"b":case"B":case"h":case"H":case"i":case"I":case"l":case"L":case"f":case"d":case"q":case"Q":if(e=this._elLut[s[2]],h+a>o.length)return!1;this._PackSeries(a,c,n,i,o,h),h+=a;break;case"x":for(f=0;f<a;f++)n[i+f]=0}i+=a*c}return n},r.Pack=function(e,t){return this.PackTo(e,new Array(this.CalcLength(e)),0,t)},r.CalcLength=function(e){for(var t,r=new RegExp(this._sPattern,"g"),n=0;t=r.exec(e);)n+=(void 0==t[1]||""==t[1]?1:parseInt(t[1]))*this._lenLut[t[2]];return n}}r.jspack=new n},{}],109:[function(e,t,r){(function(e){(function(){function n(e,t,r){for(var n=(r||0)-1,i=e?e.length:0;++n<i;)if(e[n]===t)return n;return-1}function i(e,t){var r=typeof t;if(e=e.cache,"boolean"==r||null==t)return e[t]?0:-1;"number"!=r&&"string"!=r&&(r="object");var i="number"==r?t:m+t;return e=(e=e[r])&&e[i],"object"==r?e&&n(e,t)>-1?0:-1:e?0:-1}function o(e){var t=this.cache,r=typeof e;if("boolean"==r||null==e)t[e]=!0;else{"number"!=r&&"string"!=r&&(r="object");var n="number"==r?e:m+e,i=t[r]||(t[r]={});"object"==r?(i[n]||(i[n]=[])).push(e):i[n]=!0}}function s(e){return e.charCodeAt(0)}function a(e,t){for(var r=e.criteria,n=t.criteria,i=-1,o=r.length;++i<o;){var s=r[i],a=n[i];if(s!==a){if(s>a||void 0===s)return 1;if(s<a||void 0===a)return-1}}return e.index-t.index}function c(e){var t=-1,r=e.length,n=e[0],i=e[r/2|0],s=e[r-1];if(n&&"object"==typeof n&&i&&"object"==typeof i&&s&&"object"==typeof s)return!1;var a=h();a.false=a.null=a.true=a.undefined=!1;var c=h();for(c.array=e,c.cache=a,c.push=o;++t<r;)c.push(e[t]);return c}function f(e){return"\\"+Z[e]}function u(){return b.pop()||[]}function h(){return v.pop()||{array:null,cache:null,criteria:null,false:!1,index:0,null:!1,number:null,object:null,push:null,string:null,true:!1,undefined:!1,value:null}}function l(e){e.length=0,b.length<S&&b.push(e)}function p(e){var t=e.cache;t&&p(t),e.array=e.cache=e.criteria=e.object=e.number=e.string=e.value=null,v.length<S&&v.push(e)}function d(e,t,r){t||(t=0),void 0===r&&(r=e?e.length:0);for(var n=-1,i=r-t||0,o=Array(i<0?0:i);++n<i;)o[n]=e[t+n];return o}function y(e){function t(e){return e&&"object"==typeof e&&!Qr(e)&&Rr.call(e,"__wrapped__")?e:new r(e)}function r(e,t){this.__chain__=!!t,this.__wrapped__=e}function o(e){function t(){if(n){var e=d(n);Tr.apply(e,arguments)}if(this instanceof t){var o=v(r.prototype),s=r.apply(o,e||arguments);return Le(s)?s:o}return r.apply(i,e||arguments)}var r=e[0],n=e[2],i=e[4];return Zr(t,e),t}function b(e,t,r,n,i){if(r){var o=r(e);if(void 0!==o)return o}if(!Le(e))return e;var s=Ir.call(e);if(!H[s])return e;var a=Gr[s];switch(s){case N:case F:return new a(+e);case z:case V:return new a(e);case W:return o=a(e.source,B.exec(e)),o.lastIndex=e.lastIndex,o}var c=Qr(e);if(t){var f=!n;n||(n=u()),i||(i=u());for(var h=n.length;h--;)if(n[h]==e)return i[h];o=c?a(e.length):{}}else o=c?d(e):on({},e)
;return c&&(Rr.call(e,"index")&&(o.index=e.index),Rr.call(e,"input")&&(o.input=e.input)),t?(n.push(e),i.push(o),(c?Ze:cn)(e,function(e,s){o[s]=b(e,t,r,n,i)}),f&&(l(n),l(i)),o):o}function v(e,t){return Le(e)?Nr(e):{}}function S(e,t,r){if("function"!=typeof e)return Qt;if(void 0===t||!("prototype"in e))return e;var n=e.__bindData__;if(void 0===n&&(Kr.funcNames&&(n=!e.name),!(n=n||!Kr.funcDecomp))){var i=Pr.call(e);Kr.funcNames||(n=!A.test(i)),n||(n=R.test(i),Zr(e,n))}if(!1===n||!0!==n&&1&n[1])return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,i){return e.call(t,r,n,i)};case 4:return function(r,n,i,o){return e.call(t,r,n,i,o)}}return Tt(e,t)}function Z(e){function t(){var e=c?s:this;if(i){var p=d(i);Tr.apply(p,arguments)}if((o||u)&&(p||(p=d(arguments)),o&&Tr.apply(p,o),u&&p.length<a))return n|=16,Z([r,h?n:-4&n,p,null,s,a]);if(p||(p=arguments),f&&(r=e[l]),this instanceof t){e=v(r.prototype);var y=r.apply(e,p);return Le(y)?y:e}return r.apply(e,p)}var r=e[0],n=e[1],i=e[2],o=e[3],s=e[4],a=e[5],c=1&n,f=2&n,u=4&n,h=8&n,l=r;return Zr(t,e),t}function J(e,t){var r=-1,o=ce(),s=e?e.length:0,a=s>=w&&o===n,f=[];if(a){var u=c(t);u?(o=i,t=u):a=!1}for(;++r<s;){var h=e[r];o(t,h)<0&&f.push(h)}return a&&p(t),f}function X(e,t,r,n){for(var i=(n||0)-1,o=e?e.length:0,s=[];++i<o;){var a=e[i];if(a&&"object"==typeof a&&"number"==typeof a.length&&(Qr(a)||le(a))){t||(a=X(a,t,r));var c=-1,f=a.length,u=s.length;for(s.length+=f;++c<f;)s[u++]=a[c]}else r||s.push(a)}return s}function ee(e,t,r,n,i,o){if(r){var s=r(e,t);if(void 0!==s)return!!s}if(e===t)return 0!==e||1/e==1/t;var a=typeof e,c=typeof t;if(!(e!==e||e&&K[a]||t&&K[c]))return!1;if(null==e||null==t)return e===t;var f=Ir.call(e),h=Ir.call(t);if(f==O&&(f=q),h==O&&(h=q),f!=h)return!1;switch(f){case N:case F:return+e==+t;case z:return e!=+e?t!=+t:0==e?1/e==1/t:e==+t;case W:case V:return e==wr(t)}var p=f==U;if(!p){var d=Rr.call(e,"__wrapped__"),y=Rr.call(t,"__wrapped__");if(d||y)return ee(d?e.__wrapped__:e,y?t.__wrapped__:t,r,n,i,o);if(f!=q)return!1;var g=e.constructor,b=t.constructor;if(g!=b&&!(Ae(g)&&g instanceof g&&Ae(b)&&b instanceof b)&&"constructor"in e&&"constructor"in t)return!1}var v=!i;i||(i=u()),o||(o=u());for(var _=i.length;_--;)if(i[_]==e)return o[_]==t;var m=0;if(s=!0,i.push(e),o.push(t),p){if(_=e.length,m=t.length,(s=m==_)||n)for(;m--;){var w=_,S=t[m];if(n)for(;w--&&!(s=ee(e[w],S,r,n,i,o)););else if(!(s=ee(e[m],S,r,n,i,o)))break}}else an(t,function(t,a,c){if(Rr.call(c,a))return m++,s=Rr.call(e,a)&&ee(e[a],t,r,n,i,o)}),s&&!n&&an(e,function(e,t,r){if(Rr.call(r,t))return s=--m>-1});return i.pop(),o.pop(),v&&(l(i),l(o)),s}function te(e,t,r,n,i){(Qr(t)?Ze:cn)(t,function(t,o){var s,a,c=t,f=e[o];if(t&&((a=Qr(t))||fn(t))){for(var u=n.length;u--;)if(s=n[u]==t){f=i[u];break}if(!s){var h;r&&(c=r(f,t),(h=void 0!==c)&&(f=c)),h||(f=a?Qr(f)?f:[]:fn(f)?f:{}),n.push(t),i.push(f),h||te(f,t,r,n,i)}}else r&&void 0===(c=r(f,t))&&(c=t),void 0!==c&&(f=c);e[o]=f})}function ne(e,t){return e+Lr($r()*(t-e+1))}function ie(e,t,r){var o=-1,s=ce(),a=e?e.length:0,f=[],h=!t&&a>=w&&s===n,d=r||h?u():f;if(h){var y=c(d);s=i,d=y}for(;++o<a;){var g=e[o],b=r?r(g,o,e):g;(t?!o||d[d.length-1]!==b:s(d,b)<0)&&((r||h)&&d.push(b),f.push(g))}return h?(l(d.array),p(d)):r&&l(d),f}function oe(e){return function(r,n,i){var o={};n=t.createCallback(n,i,3);var s=-1,a=r?r.length:0;if("number"==typeof a)for(;++s<a;){var c=r[s];e(o,c,n(c,s,r),r)}else cn(r,function(t,r,i){e(o,t,n(t,r,i),i)});return o}}function se(e,t,r,n,i,s){var a=1&t,c=2&t,f=4&t,u=16&t,h=32&t;if(!c&&!Ae(e))throw new Sr;u&&!r.length&&(t&=-17,u=r=!1),h&&!n.length&&(t&=-33,h=n=!1);var l=e&&e.__bindData__;return l&&!0!==l?(l=d(l),l[2]&&(l[2]=d(l[2])),l[3]&&(l[3]=d(l[3])),!a||1&l[1]||(l[4]=i),!a&&1&l[1]&&(t|=8),!f||4&l[1]||(l[5]=s),u&&Tr.apply(l[2]||(l[2]=[]),r),h&&Or.apply(l[3]||(l[3]=[]),n),l[1]|=t,se.apply(null,l)):(1==t||17===t?o:Z)([e,t,r,n,i,s])}function ae(e){return en[e]}function ce(){var e=(e=t.indexOf)===bt?n:e;return e}function fe(e){return"function"==typeof e&&Cr.test(e)}function ue(e){var t,r;return!!(e&&Ir.call(e)==q&&(t=e.constructor,!Ae(t)||t instanceof t))&&(an(e,function(e,t){r=t}),void 0===r||Rr.call(e,r))}function he(e){return tn[e]}function le(e){return e&&"object"==typeof e&&"number"==typeof e.length&&Ir.call(e)==O||!1}function pe(e,t,r,n){return"boolean"!=typeof t&&null!=t&&(n=r,r=t,t=!1),b(e,t,"function"==typeof r&&S(r,n,1))}function de(e,t,r){return b(e,!0,"function"==typeof t&&S(t,r,1))}function ye(e,t){var r=v(e);return t?on(r,t):r}function ge(e,r,n){var i;return r=t.createCallback(r,n,3),cn(e,function(e,t,n){if(r(e,t,n))return i=t,!1}),i}function be(e,r,n){var i;return r=t.createCallback(r,n,3),_e(e,function(e,t,n){if(r(e,t,n))return i=t,!1}),i}function ve(e,t,r){var n=[];an(e,function(e,t){n.push(t,e)});var i=n.length;for(t=S(t,r,3);i--&&!1!==t(n[i--],n[i],e););return e}function _e(e,t,r){var n=Xr(e),i=n.length;for(t=S(t,r,3);i--;){var o=n[i];if(!1===t(e[o],o,e))break}return e}function me(e){var t=[];return an(e,function(e,r){Ae(e)&&t.push(r)}),t.sort()}function we(e,t){return!!e&&Rr.call(e,t)}function Se(e){for(var t=-1,r=Xr(e),n=r.length,i={};++t<n;){var o=r[t];i[e[o]]=o}return i}function Ee(e){return!0===e||!1===e||e&&"object"==typeof e&&Ir.call(e)==N||!1}function ke(e){return e&&"object"==typeof e&&Ir.call(e)==F||!1}function xe(e){return e&&1===e.nodeType||!1}function Ie(e){var t=!0;if(!e)return t;var r=Ir.call(e),n=e.length;return r==U||r==V||r==O||r==q&&"number"==typeof n&&Ae(e.splice)?!n:(cn(e,function(){return t=!1}),t)}function Ce(e,t,r,n){return ee(e,t,"function"==typeof r&&S(r,n,2))}function Be(e){return Yr(e)&&!zr(parseFloat(e))}function Ae(e){return"function"==typeof e}function Le(e){return!(!e||!K[typeof e])}function Pe(e){return Re(e)&&e!=+e}function je(e){return null===e}function Re(e){return"number"==typeof e||e&&"object"==typeof e&&Ir.call(e)==z||!1}function Te(e){return e&&"object"==typeof e&&Ir.call(e)==W||!1}function De(e){return"string"==typeof e||e&&"object"==typeof e&&Ir.call(e)==V||!1}function Me(e){return void 0===e}function Oe(e,r,n){var i={};return r=t.createCallback(r,n,3),cn(e,function(e,t,n){i[t]=r(e,t,n)}),i}function Ue(e){var t=arguments,r=2;if(!Le(e))return e;if("number"!=typeof t[2]&&(r=t.length),r>3&&"function"==typeof t[r-2])var n=S(t[--r-1],t[r--],2);else r>2&&"function"==typeof t[r-1]&&(n=t[--r]);for(var i=d(arguments,1,r),o=-1,s=u(),a=u();++o<r;)te(e,i[o],n,s,a);return l(s),l(a),e}function Ne(e,r,n){var i={};if("function"!=typeof r){var o=[];an(e,function(e,t){o.push(t)}),o=J(o,X(arguments,!0,!1,1));for(var s=-1,a=o.length;++s<a;){var c=o[s];i[c]=e[c]}}else r=t.createCallback(r,n,3),an(e,function(e,t,n){r(e,t,n)||(i[t]=e)});return i}function Fe(e){for(var t=-1,r=Xr(e),n=r.length,i=pr(n);++t<n;){var o=r[t];i[t]=[o,e[o]]}return i}function Ye(e,r,n){var i={};if("function"!=typeof r)for(var o=-1,s=X(arguments,!0,!1,1),a=Le(e)?s.length:0;++o<a;){var c=s[o];c in e&&(i[c]=e[c])}else r=t.createCallback(r,n,3),an(e,function(e,t,n){r(e,t,n)&&(i[t]=e)});return i}function ze(e,r,n,i){var o=Qr(e);if(null==n)if(o)n=[];else{var s=e&&e.constructor,a=s&&s.prototype;n=v(a)}return r&&(r=t.createCallback(r,i,4),(o?Ze:cn)(e,function(e,t,i){return r(n,e,t,i)})),n}function qe(e){for(var t=-1,r=Xr(e),n=r.length,i=pr(n);++t<n;)i[t]=e[r[t]];return i}function We(e){for(var t=arguments,r=-1,n=X(t,!0,!1,1),i=t[2]&&t[2][t[1]]===e?1:n.length,o=pr(i);++r<i;)o[r]=e[n[r]];return o}function Ve(e,t,r){var n=-1,i=ce(),o=e?e.length:0,s=!1;return r=(r<0?Wr(0,o+r):r)||0,Qr(e)?s=i(e,t,r)>-1:"number"==typeof o?s=(De(e)?e.indexOf(t,r):i(e,t,r))>-1:cn(e,function(e){if(++n>=r)return!(s=e===t)}),s}function He(e,r,n){var i=!0;r=t.createCallback(r,n,3);var o=-1,s=e?e.length:0;if("number"==typeof s)for(;++o<s&&(i=!!r(e[o],o,e)););else cn(e,function(e,t,n){return i=!!r(e,t,n)});return i}function $e(e,r,n){var i=[];r=t.createCallback(r,n,3);var o=-1,s=e?e.length:0;if("number"==typeof s)for(;++o<s;){var a=e[o];r(a,o,e)&&i.push(a)}else cn(e,function(e,t,n){r(e,t,n)&&i.push(e)});return i}function Ge(e,r,n){r=t.createCallback(r,n,3);var i=-1,o=e?e.length:0;if("number"!=typeof o){var s;return cn(e,function(e,t,n){if(r(e,t,n))return s=e,!1}),s}for(;++i<o;){var a=e[i];if(r(a,i,e))return a}}function Ke(e,r,n){var i;return r=t.createCallback(r,n,3),Qe(e,function(e,t,n){if(r(e,t,n))return i=e,!1}),i}function Ze(e,t,r){var n=-1,i=e?e.length:0;if(t=t&&void 0===r?t:S(t,r,3),"number"==typeof i)for(;++n<i&&!1!==t(e[n],n,e););else cn(e,t);return e}function Qe(e,t,r){var n=e?e.length:0;if(t=t&&void 0===r?t:S(t,r,3),"number"==typeof n)for(;n--&&!1!==t(e[n],n,e););else{var i=Xr(e);n=i.length,cn(e,function(e,r,o){return r=i?i[--n]:--n,t(o[r],r,o)})}return e}function Je(e,t){var r=d(arguments,2),n=-1,i="function"==typeof t,o=e?e.length:0,s=pr("number"==typeof o?o:0);return Ze(e,function(e){s[++n]=(i?t:e[t]).apply(e,r)}),s}function Xe(e,r,n){var i=-1,o=e?e.length:0;if(r=t.createCallback(r,n,3),"number"==typeof o)for(var s=pr(o);++i<o;)s[i]=r(e[i],i,e);else s=[],cn(e,function(e,t,n){s[++i]=r(e,t,n)});return s}function et(e,r,n){var i=-1/0,o=i;if("function"!=typeof r&&n&&n[r]===e&&(r=null),null==r&&Qr(e))for(var a=-1,c=e.length;++a<c;){var f=e[a];f>o&&(o=f)}else r=null==r&&De(e)?s:t.createCallback(r,n,3),Ze(e,function(e,t,n){var s=r(e,t,n);s>i&&(i=s,o=e)});return o}function tt(e,r,n){var i=1/0,o=i;if("function"!=typeof r&&n&&n[r]===e&&(r=null),null==r&&Qr(e))for(var a=-1,c=e.length;++a<c;){var f=e[a];f<o&&(o=f)}else r=null==r&&De(e)?s:t.createCallback(r,n,3),Ze(e,function(e,t,n){var s=r(e,t,n);s<i&&(i=s,o=e)});return o}function rt(e,r,n,i){if(!e)return n;var o=arguments.length<3;r=t.createCallback(r,i,4);var s=-1,a=e.length;if("number"==typeof a)for(o&&(n=e[++s]);++s<a;)n=r(n,e[s],s,e);else cn(e,function(e,t,i){n=o?(o=!1,e):r(n,e,t,i)});return n}function nt(e,r,n,i){var o=arguments.length<3;return r=t.createCallback(r,i,4),Qe(e,function(e,t,i){n=o?(o=!1,e):r(n,e,t,i)}),n}function it(e,r,n){return r=t.createCallback(r,n,3),$e(e,function(e,t,n){return!r(e,t,n)})}function ot(e,t,r){if(e&&"number"!=typeof e.length&&(e=qe(e)),null==t||r)return e?e[ne(0,e.length-1)]:g;var n=st(e);return n.length=Vr(Wr(0,t),n.length),n}function st(e){var t=-1,r=e?e.length:0,n=pr("number"==typeof r?r:0);return Ze(e,function(e){var r=ne(0,++t);n[t]=n[r],n[r]=e}),n}function at(e){var t=e?e.length:0;return"number"==typeof t?t:Xr(e).length}function ct(e,r,n){var i;r=t.createCallback(r,n,3);var o=-1,s=e?e.length:0;if("number"==typeof s)for(;++o<s&&!(i=r(e[o],o,e)););else cn(e,function(e,t,n){return!(i=r(e,t,n))});return!!i}function ft(e,r,n){var i=-1,o=Qr(r),s=e?e.length:0,c=pr("number"==typeof s?s:0);for(o||(r=t.createCallback(r,n,3)),Ze(e,function(e,t,n){var s=c[++i]=h();o?s.criteria=Xe(r,function(t){return e[t]}):(s.criteria=u())[0]=r(e,t,n),s.index=i,s.value=e}),s=c.length,c.sort(a);s--;){var f=c[s];c[s]=f.value,o||l(f.criteria),p(f)}return c}function ut(e){return e&&"number"==typeof e.length?d(e):qe(e)}function ht(e){for(var t=-1,r=e?e.length:0,n=[];++t<r;){var i=e[t];i&&n.push(i)}return n}function lt(e){return J(e,X(arguments,!0,!0,1))}function pt(e,r,n){var i=-1,o=e?e.length:0;for(r=t.createCallback(r,n,3);++i<o;)if(r(e[i],i,e))return i;return-1}function dt(e,r,n){var i=e?e.length:0;for(r=t.createCallback(r,n,3);i--;)if(r(e[i],i,e))return i;return-1}function yt(e,r,n){var i=0,o=e?e.length:0;if("number"!=typeof r&&null!=r){var s=-1;for(r=t.createCallback(r,n,3);++s<o&&r(e[s],s,e);)i++}else if(null==(i=r)||n)return e?e[0]:g;return d(e,0,Vr(Wr(0,i),o))}function gt(e,t,r,n){return"boolean"!=typeof t&&null!=t&&(n=r,r="function"!=typeof t&&n&&n[t]===e?null:t,t=!1),null!=r&&(e=Xe(e,r,n)),X(e,t)}function bt(e,t,r){if("number"==typeof r){var i=e?e.length:0;r=r<0?Wr(0,i+r):r||0}else if(r){var o=It(e,t);return e[o]===t?o:-1}return n(e,t,r)}function vt(e,r,n){var i=0,o=e?e.length:0;if("number"!=typeof r&&null!=r){var s=o;for(r=t.createCallback(r,n,3);s--&&r(e[s],s,e);)i++}else i=null==r||n?1:r||i;return d(e,0,Vr(Wr(0,o-i),o))}function _t(){for(var e=[],t=-1,r=arguments.length,o=u(),s=ce(),a=s===n,f=u();++t<r;){var h=arguments[t];(Qr(h)||le(h))&&(e.push(h),o.push(a&&h.length>=w&&c(t?e[t]:f)))}var d=e[0],y=-1,g=d?d.length:0,b=[];e:for(;++y<g;){var v=o[0];if(h=d[y],(v?i(v,h):s(f,h))<0){for(t=r,(v||f).push(h);--t;)if(v=o[t],(v?i(v,h):s(e[t],h))<0)continue e;b.push(h)}}for(;r--;)(v=o[r])&&p(v);return l(o),l(f),b}function mt(e,r,n){var i=0,o=e?e.length:0;if("number"!=typeof r&&null!=r){var s=o;for(r=t.createCallback(r,n,3);s--&&r(e[s],s,e);)i++}else if(null==(i=r)||n)return e?e[o-1]:g;return d(e,Wr(0,o-i))}function wt(e,t,r){var n=e?e.length:0;for("number"==typeof r&&(n=(r<0?Wr(0,n+r):Vr(r,n-1))+1);n--;)if(e[n]===t)return n;return-1}function St(e){for(var t=arguments,r=0,n=t.length,i=e?e.length:0;++r<n;)for(var o=-1,s=t[r];++o<i;)e[o]===s&&(Mr.call(e,o--,1),i--);return e}function Et(e,t,r){e=+e||0,r="number"==typeof r?r:+r||1,null==t&&(t=e,e=0);for(var n=-1,i=Wr(0,Br((t-e)/(r||1))),o=pr(i);++n<i;)o[n]=e,e+=r;return o}function kt(e,r,n){var i=-1,o=e?e.length:0,s=[];for(r=t.createCallback(r,n,3);++i<o;){var a=e[i];r(a,i,e)&&(s.push(a),Mr.call(e,i--,1),o--)}return s}function xt(e,r,n){if("number"!=typeof r&&null!=r){var i=0,o=-1,s=e?e.length:0;for(r=t.createCallback(r,n,3);++o<s&&r(e[o],o,e);)i++}else i=null==r||n?1:Wr(0,r);return d(e,i)}function It(e,r,n,i){var o=0,s=e?e.length:o;for(n=n?t.createCallback(n,i,1):Qt,r=n(r);o<s;){var a=o+s>>>1;n(e[a])<r?o=a+1:s=a}return o}function Ct(){return ie(X(arguments,!0,!0))}function Bt(e,r,n,i){return"boolean"!=typeof r&&null!=r&&(i=n,n="function"!=typeof r&&i&&i[r]===e?null:r,r=!1),null!=n&&(n=t.createCallback(n,i,3)),ie(e,r,n)}function At(e){return J(e,d(arguments,1))}function Lt(){for(var e=-1,t=arguments.length;++e<t;){var r=arguments[e];if(Qr(r)||le(r))var n=n?ie(J(n,r).concat(J(r,n))):r}return n||[]}function Pt(){for(var e=arguments.length>1?arguments:arguments[0],t=-1,r=e?et(pn(e,"length")):0,n=pr(r<0?0:r);++t<r;)n[t]=pn(e,t);return n}function jt(e,t){var r=-1,n=e?e.length:0,i={};for(t||!n||Qr(e[0])||(t=[]);++r<n;){var o=e[r];t?i[o]=t[r]:o&&(i[o[0]]=o[1])}return i}function Rt(e,t){if(!Ae(t))throw new Sr;return function(){if(--e<1)return t.apply(this,arguments)}}function Tt(e,t){return arguments.length>2?se(e,17,d(arguments,2),null,t):se(e,1,null,null,t)}function Dt(e){for(var t=arguments.length>1?X(arguments,!0,!1,1):me(e),r=-1,n=t.length;++r<n;){var i=t[r];e[i]=se(e[i],1,null,null,e)}return e}function Mt(e,t){return arguments.length>2?se(t,19,d(arguments,2),null,e):se(t,3,null,null,e)}function Ot(){for(var e=arguments,t=e.length;t--;)if(!Ae(e[t]))throw new Sr;return function(){for(var t=arguments,r=e.length;r--;)t=[e[r].apply(this,t)];return t[0]}}function Ut(e,t){return t="number"==typeof t?t:+t||e.length,se(e,4,null,null,null,t)}function Nt(e,t,r){var n,i,o,s,a,c,f,u=0,h=!1,l=!0;if(!Ae(e))throw new Sr;if(t=Wr(0,t)||0,!0===r){var p=!0;l=!1}else Le(r)&&(p=r.leading,h="maxWait"in r&&(Wr(t,r.maxWait)||0),l="trailing"in r?r.trailing:l);var d=function(){var r=t-(yn()-s);if(r<=0){i&&Ar(i);var h=f;i=c=f=g,h&&(u=yn(),o=e.apply(a,n),c||i||(n=a=null))}else c=Dr(d,r)},y=function(){c&&Ar(c),i=c=f=g,(l||h!==t)&&(u=yn(),o=e.apply(a,n),c||i||(n=a=null))};return function(){if(n=arguments,s=yn(),a=this,f=l&&(c||!p),!1===h)var r=p&&!c;else{i||p||(u=s);var g=h-(s-u),b=g<=0;b?(i&&(i=Ar(i)),u=s,o=e.apply(a,n)):i||(i=Dr(y,g))}return b&&c?c=Ar(c):c||t===h||(c=Dr(d,t)),r&&(b=!0,o=e.apply(a,n)),!b||c||i||(n=a=null),o}}function Ft(e){if(!Ae(e))throw new Sr;var t=d(arguments,1);return Dr(function(){e.apply(g,t)},1)}function Yt(e,t){if(!Ae(e))throw new Sr;var r=d(arguments,2);return Dr(function(){e.apply(g,r)},t)}function zt(e,t){if(!Ae(e))throw new Sr;var r=function(){var n=r.cache,i=t?t.apply(this,arguments):m+arguments[0];return Rr.call(n,i)?n[i]:n[i]=e.apply(this,arguments)};return r.cache={},r}function qt(e){var t,r;if(!Ae(e))throw new Sr;return function(){return t?r:(t=!0,r=e.apply(this,arguments),e=null,r)}}function Wt(e){return se(e,16,d(arguments,1))}function Vt(e){return se(e,32,null,d(arguments,1))}function Ht(e,t,r){var n=!0,i=!0;if(!Ae(e))throw new Sr;return!1===r?n=!1:Le(r)&&(n="leading"in r?r.leading:n,i="trailing"in r?r.trailing:i),$.leading=n,$.maxWait=t,$.trailing=i,Nt(e,t,$)}function $t(e,t){return se(t,16,[e])}function Gt(e){return function(){return e}}function Kt(e,t,r){var n=typeof e;if(null==e||"function"==n)return S(e,t,r);if("object"!=n)return tr(e);var i=Xr(e),o=i[0],s=e[o];return 1!=i.length||s!==s||Le(s)?function(t){for(var r=i.length,n=!1;r--&&(n=ee(t[i[r]],e[i[r]],null,!0)););return n}:function(e){var t=e[o];return s===t&&(0!==s||1/s==1/t)}}function Zt(e){return null==e?"":wr(e).replace(nn,ae)}function Qt(e){return e}function Jt(e,n,i){var o=!0,s=n&&me(n);n&&(i||s.length)||(null==i&&(i=n),a=r,n=e,e=t,s=me(n)),!1===i?o=!1:Le(i)&&"chain"in i&&(o=i.chain);var a=e,c=Ae(a);Ze(s,function(t){var r=e[t]=n[t];c&&(a.prototype[t]=function(){var t=this.__chain__,n=this.__wrapped__,i=[n];Tr.apply(i,arguments);var s=r.apply(e,i);if(o||t){if(n===s&&Le(s))return this;s=new a(s),s.__chain__=t}return s})})}function Xt(){return e._=xr,this}function er(){}function tr(e){return function(t){return t[e]}}function rr(e,t,r){var n=null==e,i=null==t;if(null==r&&("boolean"==typeof e&&i?(r=e,e=1):i||"boolean"!=typeof t||(r=t,i=!0)),n&&i&&(t=1),e=+e||0,i?(t=e,e=0):t=+t||0,r||e%1||t%1){var o=$r();return Vr(e+o*(t-e+parseFloat("1e-"+((o+"").length-1))),t)}return ne(e,t)}function nr(e,t){if(e){var r=e[t];return Ae(r)?e[t]():r}}function ir(e,r,n){var i=t.templateSettings;e=wr(e||""),n=sn({},n,i);var o,s=sn({},n.imports,i.imports),a=Xr(s),c=qe(s),u=0,h=n.interpolate||j,l="__p += '",p=mr((n.escape||j).source+"|"+h.source+"|"+(h===L?C:j).source+"|"+(n.evaluate||j).source+"|$","g");e.replace(p,function(t,r,n,i,s,a){return n||(n=i),l+=e.slice(u,a).replace(T,f),r&&(l+="' +\n__e("+r+") +\n'"),s&&(o=!0,l+="';\n"+s+";\n__p += '"),n&&(l+="' +\n((__t = ("+n+")) == null ? '' : __t) +\n'"),u=a+t.length,t}),l+="';\n";var d=n.variable,y=d;y||(d="obj",l="with ("+d+") {\n"+l+"\n}\n"),l=(o?l.replace(k,""):l).replace(x,"$1").replace(I,"$1;"),l="function("+d+") {\n"+(y?"":d+" || ("+d+" = {});\n")+"var __t, __p = '', __e = _.escape"+(o?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+l+"return __p\n}";var b="\n/*\n//# sourceURL="+(n.sourceURL||"/lodash/template/source["+M+++"]")+"\n*/";try{var v=gr(a,"return "+l+b).apply(g,c)}catch(e){throw e.source=l,e}return r?v(r):(v.source=l,v)}function or(e,t,r){e=(e=+e)>-1?e:0;var n=-1,i=pr(e);for(t=S(t,r,1);++n<e;)i[n]=t(n);return i}function sr(e){return null==e?"":wr(e).replace(rn,he)}function ar(e){var t=++_;return wr(null==e?"":e)+t}function cr(e){return e=new r(e),e.__chain__=!0,e}function fr(e,t){return t(e),e}function ur(){return this.__chain__=!0,this}function hr(){return wr(this.__wrapped__)}function lr(){return this.__wrapped__}e=e?re.defaults(Q.Object(),e,re.pick(Q,D)):Q;var pr=e.Array,dr=e.Boolean,yr=e.Date,gr=e.Function,br=e.Math,vr=e.Number,_r=e.Object,mr=e.RegExp,wr=e.String,Sr=e.TypeError,Er=[],kr=_r.prototype,xr=e._,Ir=kr.toString,Cr=mr("^"+wr(Ir).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/toString| for [^\]]+/g,".*?")+"$"),Br=br.ceil,Ar=e.clearTimeout,Lr=br.floor,Pr=gr.prototype.toString,jr=fe(jr=_r.getPrototypeOf)&&jr,Rr=kr.hasOwnProperty,Tr=Er.push,Dr=e.setTimeout,Mr=Er.splice,Or=Er.unshift,Ur=function(){try{var e={},t=fe(t=_r.defineProperty)&&t,r=t(e,e,e)&&t}catch(e){}return r}(),Nr=fe(Nr=_r.create)&&Nr,Fr=fe(Fr=pr.isArray)&&Fr,Yr=e.isFinite,zr=e.isNaN,qr=fe(qr=_r.keys)&&qr,Wr=br.max,Vr=br.min,Hr=e.parseInt,$r=br.random,Gr={};Gr[U]=pr,Gr[N]=dr,Gr[F]=yr,Gr[Y]=gr,Gr[q]=_r,Gr[z]=vr,Gr[W]=mr,Gr[V]=wr,r.prototype=t.prototype;var Kr=t.support={};Kr.funcDecomp=!fe(e.WinRTError)&&R.test(y),Kr.funcNames="string"==typeof gr.name,t.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:L,variable:"",imports:{_:t}},Nr||(v=function(){function t(){}return function(r){if(Le(r)){t.prototype=r;var n=new t;t.prototype=null}return n||e.Object()}}());var Zr=Ur?function(e,t){G.value=t,Ur(e,"__bindData__",G),G.value=null}:er,Qr=Fr||function(e){return e&&"object"==typeof e&&"number"==typeof e.length&&Ir.call(e)==U||!1},Jr=function(e){var t,r=e,n=[];if(!r)return n;if(!K[typeof e])return n;for(t in r)Rr.call(r,t)&&n.push(t);return n},Xr=qr?function(e){return Le(e)?qr(e):[]}:Jr,en={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},tn=Se(en),rn=mr("("+Xr(tn).join("|")+")","g"),nn=mr("["+Xr(en).join("")+"]","g"),on=function(e,t,r){var n,i=e,o=i;if(!i)return o;var s=arguments,a=0,c="number"==typeof r?2:s.length;if(c>3&&"function"==typeof s[c-2])var f=S(s[--c-1],s[c--],2);else c>2&&"function"==typeof s[c-1]&&(f=s[--c]);for(;++a<c;)if((i=s[a])&&K[typeof i])for(var u=-1,h=K[typeof i]&&Xr(i),l=h?h.length:0;++u<l;)n=h[u],o[n]=f?f(o[n],i[n]):i[n];return o},sn=function(e,t,r){var n,i=e,o=i;if(!i)return o;for(var s=arguments,a=0,c="number"==typeof r?2:s.length;++a<c;)if((i=s[a])&&K[typeof i])for(var f=-1,u=K[typeof i]&&Xr(i),h=u?u.length:0;++f<h;)n=u[f],void 0===o[n]&&(o[n]=i[n]);return o},an=function(e,t,r){var n,i=e,o=i;if(!i)return o;if(!K[typeof i])return o;t=t&&void 0===r?t:S(t,r,3);for(n in i)if(!1===t(i[n],n,e))return o;return o},cn=function(e,t,r){var n,i=e,o=i;if(!i)return o;if(!K[typeof i])return o;t=t&&void 0===r?t:S(t,r,3);for(var s=-1,a=K[typeof i]&&Xr(i),c=a?a.length:0;++s<c;)if(n=a[s],!1===t(i[n],n,e))return o;return o},fn=jr?function(e){if(!e||Ir.call(e)!=q)return!1;var t=e.valueOf,r=fe(t)&&(r=jr(t))&&jr(r);return r?e==r||jr(e)==r:ue(e)}:ue,un=oe(function(e,t,r){Rr.call(e,r)?e[r]++:e[r]=1}),hn=oe(function(e,t,r){(Rr.call(e,r)?e[r]:e[r]=[]).push(t)}),ln=oe(function(e,t,r){e[r]=t}),pn=Xe,dn=$e,yn=fe(yn=yr.now)&&yn||function(){return(new yr).getTime()},gn=8==Hr(E+"08")?Hr:function(e,t){return Hr(De(e)?e.replace(P,""):e,t||0)};return t.after=Rt,t.assign=on,t.at=We,t.bind=Tt,t.bindAll=Dt,t.bindKey=Mt,t.chain=cr,t.compact=ht,t.compose=Ot,t.constant=Gt,t.countBy=un,t.create=ye,t.createCallback=Kt,t.curry=Ut,t.debounce=Nt,t.defaults=sn,t.defer=Ft,t.delay=Yt,t.difference=lt,t.filter=$e,t.flatten=gt,t.forEach=Ze,t.forEachRight=Qe,t.forIn=an,t.forInRight=ve,t.forOwn=cn,t.forOwnRight=_e,t.functions=me,t.groupBy=hn,t.indexBy=ln,t.initial=vt,t.intersection=_t,t.invert=Se,t.invoke=Je,t.keys=Xr,t.map=Xe,t.mapValues=Oe,t.max=et,t.memoize=zt,t.merge=Ue,t.min=tt,t.omit=Ne,t.once=qt,t.pairs=Fe,t.partial=Wt,t.partialRight=Vt,t.pick=Ye,t.pluck=pn,t.property=tr,t.pull=St,t.range=Et,t.reject=it,t.remove=kt,t.rest=xt,t.shuffle=st,t.sortBy=ft,t.tap=fr,t.throttle=Ht,t.times=or,t.toArray=ut,t.transform=ze,t.union=Ct,t.uniq=Bt,t.values=qe,t.where=dn,t.without=At,t.wrap=$t,t.xor=Lt,t.zip=Pt,t.zipObject=jt,t.collect=Xe,t.drop=xt,t.each=Ze,t.eachRight=Qe,t.extend=on,t.methods=me,t.object=jt,t.select=$e,t.tail=xt,t.unique=Bt,t.unzip=Pt,Jt(t),t.clone=pe,t.cloneDeep=de,t.contains=Ve,t.escape=Zt,t.every=He,t.find=Ge,t.findIndex=pt,t.findKey=ge,t.findLast=Ke,t.findLastIndex=dt,t.findLastKey=be,t.has=we,t.identity=Qt,t.indexOf=bt,t.isArguments=le,t.isArray=Qr,t.isBoolean=Ee,t.isDate=ke,t.isElement=xe,t.isEmpty=Ie,t.isEqual=Ce,t.isFinite=Be,t.isFunction=Ae,t.isNaN=Pe,t.isNull=je,t.isNumber=Re,t.isObject=Le,t.isPlainObject=fn,t.isRegExp=Te,t.isString=De,t.isUndefined=Me,t.lastIndexOf=wt,t.mixin=Jt,t.noConflict=Xt,t.noop=er,t.now=yn,t.parseInt=gn,t.random=rr,t.reduce=rt,t.reduceRight=nt,t.result=nr,t.runInContext=y,t.size=at,t.some=ct,t.sortedIndex=It,t.template=ir,t.unescape=sr,t.uniqueId=ar,t.all=He,t.any=ct,t.detect=Ge,t.findWhere=Ge,t.foldl=rt,t.foldr=nt,t.include=Ve,t.inject=rt,Jt(function(){var e={};return cn(t,function(r,n){t.prototype[n]||(e[n]=r)}),e}(),!1),t.first=yt,t.last=mt,t.sample=ot,t.take=yt,t.head=yt,cn(t,function(e,n){var i="sample"!==n;t.prototype[n]||(t.prototype[n]=function(t,n){var o=this.__chain__,s=e(this.__wrapped__,t,n);return o||null!=t&&(!n||i&&"function"==typeof t)?new r(s,o):s})}),t.VERSION="2.4.2",t.prototype.chain=ur,t.prototype.toString=hr,t.prototype.value=lr,t.prototype.valueOf=lr,Ze(["join","pop","shift"],function(e){var n=Er[e];t.prototype[e]=function(){var e=this.__chain__,t=n.apply(this.__wrapped__,arguments);return e?new r(t,e):t}}),Ze(["push","reverse","sort","unshift"],function(e){var r=Er[e];t.prototype[e]=function(){return r.apply(this.__wrapped__,arguments),this}}),Ze(["concat","slice","splice"],function(e){var n=Er[e];t.prototype[e]=function(){return new r(n.apply(this.__wrapped__,arguments),this.__chain__)}}),t}var g,b=[],v=[],_=0,m=+new Date+"",w=75,S=40,E=" \t\v\f \ufeff\n\r\u2028\u2029 ᠎             　",k=/\b__p \+= '';/g,x=/\b(__p \+=) '' \+/g,I=/(__e\(.*?\)|\b__t\)) \+\n'';/g,C=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,B=/\w*$/,A=/^\s*function[ \n\r\t]+\w/,L=/<%=([\s\S]+?)%>/g,P=RegExp("^["+E+"]*0+(?=.$)"),j=/($^)/,R=/\bthis\b/,T=/['\n\r\t\u2028\u2029\\]/g,D=["Array","Boolean","Date","Function","Math","Number","Object","RegExp","String","_","attachEvent","clearTimeout","isFinite","isNaN","parseInt","setTimeout"],M=0,O="[object Arguments]",U="[object Array]",N="[object Boolean]",F="[object Date]",Y="[object Function]",z="[object Number]",q="[object Object]",W="[object RegExp]",V="[object String]",H={};H[Y]=!1,H[O]=H[U]=H[N]=H[F]=H[z]=H[q]=H[W]=H[V]=!0;var $={leading:!1,maxWait:0,trailing:!1},G={configurable:!1,enumerable:!1,value:null,writable:!1},K={boolean:!1,function:!0,object:!0,number:!1,string:!1,undefined:!1},Z={"\\":"\\","'":"'","\n":"n","\r":"r","\t":"t","\u2028":"u2028","\u2029":"u2029"},Q=K[typeof window]&&window||this,J=K[typeof r]&&r&&!r.nodeType&&r,X=K[typeof t]&&t&&!t.nodeType&&t,ee=X&&X.exports===J&&J,te=K[typeof e]&&e;!te||te.global!==te&&te.window!==te||(Q=te);var re=y();"function"==typeof define&&"object"==typeof define.amd&&define.amd?(Q._=re,define(function(){return re})):J&&X?ee?(X.exports=re)._=re:J._=re:Q._=re}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],110:[function(e,t,r){(function(r){function n(e){return String.fromCharCode.apply(null,e)}function i(e){return e.split("\n")}function o(e){e.map(function(e){s(e.replace(/^\t+/g,""))})}function s(e){for(var t in k){var r=new k[t](e);if(r.match)return r.parse()}return e}function a(e,t){return e.test(t)}function c(e){return"[object Array]"===Object.prototype.toString.call(e)}function f(e){return{match:a(/^<<$/,e),parse:function(){m({})}}}function u(e){return{match:a(/^>>$/,e),parse:function(){w()}}}function h(e){var t=/^\/(\w+) \[$/;return{match:a(t,e),parse:function(){I.push(e.match(t)[1]),m([])}}}function l(e){return{match:a(/^\]$/,e),parse:function(){w()}}}function p(e){var t=/^\/([A-Z0-9]+)$/i;return{match:a(t,e),parse:function(){I.push(e.match(t)[1])}}}function d(e){var t=/^\/([A-Z0-9]+)\s((.|\r)*)$/i;return{match:a(t,e),parse:function(){var r=e.match(t);S(r[1],s(r[2]))}}}function y(e){return{match:a(/^(true|false)$/,e),parse:function(){return"true"===e}}}function g(e){return{match:a(/^-?\d+$/,e),parse:function(){return Number(e)}}}function b(e){return{match:a(/^(-?\d*)\.(\d+)$/,e),parse:function(){return Number(e)}}}function v(e){var t=/^\[(.*)\]$/;return{match:a(t,e),parse:function(){for(var r=e.match(t)[1].trim().split(" "),n=[],i=0,o=r.length;i<o;i++)n.push(s(r[i]));return n}}}function _(e){var t=/^\(((.|\r)*)\)$/;return{match:a(t,e),parse:function(){for(var n=e.match(t)[1],i=[],o=0,s=n.length;o<s;o++)i.push(n.charCodeAt(o));return E.decode(new r(i),"utf-16")}}}function m(e){x.push(C),C=e}function w(){var e=x.pop();c(e)?e.push(C):e[I.pop()]=C,C=e}function S(e,t){C[e]=t}var E=e("iconv-lite"),k=[f,u,h,l,p,d,v,y,g,b,_],x=[],I=[],C=[],B=function(e){return x=I=C=[],o(i(n(e))),C.shift()};t.exports=B}).call(this,e("buffer").Buffer)},{buffer:66,"iconv-lite":103}],111:[function(e,t,r){function n(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function o(e){if(h===setTimeout)return setTimeout(e,0);if((h===n||!h)&&setTimeout)return h=setTimeout,setTimeout(e,0);try{return h(e,0)}catch(t){try{return h.call(null,e,0)}catch(t){return h.call(this,e,0)}}}function s(e){if(l===clearTimeout)return clearTimeout(e);if((l===i||!l)&&clearTimeout)return l=clearTimeout,clearTimeout(e);try{return l(e)}catch(t){try{return l.call(null,e)}catch(t){return l.call(this,e)}}}function a(){g&&d&&(g=!1,d.length?y=d.concat(y):b=-1,y.length&&c())}function c(){if(!g){var e=o(a);g=!0;for(var t=y.length;t;){for(d=y,y=[];++b<t;)d&&d[b].run();b=-1,t=y.length}d=null,g=!1,s(e)}}function f(e,t){this.fun=e,this.array=t}function u(){}var h,l,p=t.exports={};!function(){try{h="function"==typeof setTimeout?setTimeout:n}catch(e){h=n}try{l="function"==typeof clearTimeout?clearTimeout:i}catch(e){l=i}}();var d,y=[],g=!1,b=-1;p.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];y.push(new f(e,t)),1!==y.length||g||o(c)},f.prototype.run=function(){this.fun.apply(null,this.array)},p.title="browser",p.browser=!0,p.env={},p.argv=[],p.version="",p.versions={},p.on=u,p.addListener=u,p.once=u,p.off=u,p.removeListener=u,p.removeAllListeners=u,p.emit=u,p.prependListener=u,p.prependOnceListener=u,p.listeners=function(e){return[]},p.binding=function(e){throw new Error("process.binding is not supported")},p.cwd=function(){return"/"},p.chdir=function(e){throw new Error("process.chdir is not supported")},p.umask=function(){return 0}},{}],112:[function(e,t,r){(function(r){(function(){"use strict";function n(e){return"function"==typeof e||"object"==typeof e&&null!==e}function i(e){return"function"==typeof e}function o(e){return"object"==typeof e&&null!==e}function s(){}function a(e,t){for(var r=0,n=e.length;r<n;r++)if(e[r]===t)return r;return-1}function c(e){var t=e._promiseCallbacks;return t||(t=e._promiseCallbacks={}),t}function f(e,t){return"onerror"===e?void me.on("error",t):2!==arguments.length?me[e]:void(me[e]=t)}function u(){setTimeout(function(){for(var e,t=0;t<we.length;t++){e=we[t];var r=e.payload;r.guid=r.key+r.id,r.childGuid=r.key+r.childId,r.error&&(r.stack=r.error.stack),me.trigger(e.name,e.payload)}we.length=0},50)}function h(e,t,r){1===we.push({name:e,payload:{key:t._guidKey,id:t._id,eventName:e,detail:t._result,childId:r&&r._id,label:t._label,timeStamp:be(),error:me["instrument-with-stack"]?new Error(t._label):null}})&&u()}function l(){return new TypeError("A promises callback cannot return that same promise.")}function p(){}function d(e){try{return e.then}catch(e){return Ie.error=e,Ie}}function y(e,t,r,n){try{e.call(t,r,n)}catch(e){return e}}function g(e,t,r){me.async(function(e){var n=!1,i=y(r,t,function(r){n||(n=!0,t!==r?_(e,r):w(e,r))},function(t){n||(n=!0,S(e,t))},"Settle: "+(e._label||" unknown promise"));!n&&i&&(n=!0,S(e,i))},e)}function b(e,t){t._state===ke?w(e,t._result):t._state===xe?(t._onError=null,S(e,t._result)):E(t,void 0,function(r){t!==r?_(e,r):w(e,r)},function(t){S(e,t)})}function v(e,t){if(t.constructor===e.constructor)b(e,t);else{var r=d(t);r===Ie?S(e,Ie.error):void 0===r?w(e,t):i(r)?g(e,t,r):w(e,t)}}function _(e,t){e===t?w(e,t):n(t)?v(e,t):w(e,t)}function m(e){e._onError&&e._onError(e._result),k(e)}function w(e,t){e._state===Ee&&(e._result=t,e._state=ke,0===e._subscribers.length?me.instrument&&Se("fulfilled",e):me.async(k,e))}function S(e,t){e._state===Ee&&(e._state=xe,e._result=t,me.async(m,e))}function E(e,t,r,n){var i=e._subscribers,o=i.length;e._onError=null,i[o]=t,i[o+ke]=r,i[o+xe]=n,0===o&&e._state&&me.async(k,e)}function k(e){var t=e._subscribers,r=e._state;if(me.instrument&&Se(r===ke?"fulfilled":"rejected",e),0!==t.length){for(var n,i,o=e._result,s=0;s<t.length;s+=3)n=t[s],i=t[s+r],n?C(r,n,i,o):i(o);e._subscribers.length=0}}function x(){this.error=null}function I(e,t){try{return e(t)}catch(e){return Ce.error=e,Ce}}function C(e,t,r,n){var o,s,a,c,f=i(r);if(f){if(o=I(r,n),o===Ce?(c=!0,
s=o.error,o=null):a=!0,t===o)return void S(t,l())}else o=n,a=!0;t._state!==Ee||(f&&a?_(t,o):c?S(t,s):e===ke?w(t,o):e===xe&&S(t,o))}function B(e,t){var r=!1;try{t(function(t){r||(r=!0,_(e,t))},function(t){r||(r=!0,S(e,t))})}catch(t){S(e,t)}}function A(e,t,r){return e===ke?{state:"fulfilled",value:r}:{state:"rejected",reason:r}}function L(e,t,r,n){this._instanceConstructor=e,this.promise=new e(p,n),this._abortOnReject=r,this._validateInput(t)?(this._input=t,this.length=t.length,this._remaining=t.length,this._init(),0===this.length?w(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&w(this.promise,this._result))):S(this.promise,this._validationError())}function P(e,t){return new Be(this,e,!0,t).promise}function j(e,t){function r(e){_(o,e)}function n(e){S(o,e)}var i=this,o=new i(p,t);if(!ge(e))return S(o,new TypeError("You must pass an array to race.")),o;for(var s=e.length,a=0;o._state===Ee&&a<s;a++)E(i.resolve(e[a]),void 0,r,n);return o}function R(e,t){var r=this;if(e&&"object"==typeof e&&e.constructor===r)return e;var n=new r(p,t);return _(n,e),n}function T(e,t){var r=this,n=new r(p,t);return S(n,e),n}function D(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function M(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function O(e,t){this._id=Te++,this._label=t,this._state=void 0,this._result=void 0,this._subscribers=[],me.instrument&&Se("created",this),p!==e&&(i(e)||D(),this instanceof O||M(),B(this,e))}function U(e,t,r){this._superConstructor(e,t,!1,r)}function N(e,t){return new U(De,e,t).promise}function F(e,t){return De.all(e,t)}function Y(e,t){$e[Fe]=e,$e[Fe+1]=t,2===(Fe+=2)&&Oe()}function z(){return function(){Me(W)}}function q(){return function(){setTimeout(W,1)}}function W(){for(var e=0;e<Fe;e+=2){(0,$e[e])($e[e+1]),$e[e]=void 0,$e[e+1]=void 0}Fe=0}function V(e){var t={};return t.promise=new De(function(e,r){t.resolve=e,t.reject=r},e),t}function H(e,t,r){return De.all(e,r).then(function(e){if(!i(t))throw new TypeError("You must pass a function as filter's second argument.");for(var n=e.length,o=new Array(n),s=0;s<n;s++)o[s]=t(e[s]);return De.all(o,r).then(function(t){for(var r=new Array(n),i=0,o=0;o<n;o++)t[o]&&(r[i]=e[o],i++);return r.length=i,r})})}function $(e,t,r){this._superConstructor(e,t,!0,r)}function G(e,t,r){this._superConstructor(e,t,!1,r)}function K(e,t){return new G(De,e,t).promise}function Z(e,t){return new Ze(De,e,t).promise}function Q(e,t,r){return De.all(e,r).then(function(e){if(!i(t))throw new TypeError("You must pass a function as map's second argument.");for(var n=e.length,o=new Array(n),s=0;s<n;s++)o[s]=t(e[s]);return De.all(o,r)})}function J(){this.value=void 0}function X(e){try{return e.then}catch(e){return et.value=e,et}}function ee(e,t,r){try{e.apply(t,r)}catch(e){return et.value=e,et}}function te(e,t){for(var r,n,i={},o=e.length,s=new Array(o),a=0;a<o;a++)s[a]=e[a];for(n=0;n<t.length;n++)r=t[n],i[r]=s[n+1];return i}function re(e){for(var t=e.length,r=new Array(t-1),n=1;n<t;n++)r[n-1]=e[n];return r}function ne(e,t){return{then:function(r,n){return e.call(t,r,n)}}}function ie(e,t){var r=function(){for(var r,n=this,i=arguments.length,o=new Array(i+1),s=!1,a=0;a<i;++a){if(r=arguments[a],!s){if((s=ae(r))===tt){var c=new De(p);return S(c,tt.value),c}s&&!0!==s&&(r=ne(s,r))}o[a]=r}var f=new De(p);return o[i]=function(e,r){e?S(f,e):void 0===t?_(f,r):!0===t?_(f,re(arguments)):ge(t)?_(f,te(arguments,t)):_(f,r)},s?se(f,o,e,n):oe(f,o,e,n)};return r.__proto__=e,r}function oe(e,t,r,n){var i=ee(r,n,t);return i===et&&S(e,i.value),e}function se(e,t,r,n){return De.all(t).then(function(t){var i=ee(r,n,t);return i===et&&S(e,i.value),e})}function ae(e){return!(!e||"object"!=typeof e)&&(e.constructor===De||X(e))}function ce(e,t){return De.race(e,t)}function fe(e,t){return De.reject(e,t)}function ue(e,t){return De.resolve(e,t)}function he(e){throw setTimeout(function(){throw e}),e}function le(e,t){me.async(e,t)}function pe(){me.on.apply(me,arguments)}function de(){me.off.apply(me,arguments)}var ye;ye=Array.isArray?Array.isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)};var ge=ye,be=Date.now||function(){return(new Date).getTime()},ve=Object.create||function(e){if(arguments.length>1)throw new Error("Second argument not supported");if("object"!=typeof e)throw new TypeError("Argument must be an object");return s.prototype=e,new s},_e={mixin:function(e){return e.on=this.on,e.off=this.off,e.trigger=this.trigger,e._promiseCallbacks=void 0,e},on:function(e,t){var r,n=c(this);r=n[e],r||(r=n[e]=[]),-1===a(r,t)&&r.push(t)},off:function(e,t){var r,n,i=c(this);if(!t)return void(i[e]=[]);r=i[e],-1!==(n=a(r,t))&&r.splice(n,1)},trigger:function(e,t){var r,n=c(this);if(r=n[e])for(var i=0;i<r.length;i++)(0,r[i])(t)}},me={instrument:!1};_e.mixin(me);var we=[],Se=h,Ee=void 0,ke=1,xe=2,Ie=new x,Ce=new x,Be=L;L.prototype._validateInput=function(e){return ge(e)},L.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")},L.prototype._init=function(){this._result=new Array(this.length)},L.prototype._enumerate=function(){for(var e=this.length,t=this.promise,r=this._input,n=0;t._state===Ee&&n<e;n++)this._eachEntry(r[n],n)},L.prototype._eachEntry=function(e,t){var r=this._instanceConstructor;o(e)?e.constructor===r&&e._state!==Ee?(e._onError=null,this._settledAt(e._state,t,e._result)):this._willSettleAt(r.resolve(e),t):(this._remaining--,this._result[t]=this._makeResult(ke,t,e))},L.prototype._settledAt=function(e,t,r){var n=this.promise;n._state===Ee&&(this._remaining--,this._abortOnReject&&e===xe?S(n,r):this._result[t]=this._makeResult(e,t,r)),0===this._remaining&&w(n,this._result)},L.prototype._makeResult=function(e,t,r){return r},L.prototype._willSettleAt=function(e,t){var r=this;E(e,void 0,function(e){r._settledAt(ke,t,e)},function(e){r._settledAt(xe,t,e)})};var Ae=P,Le=j,Pe=R,je=T,Re="rsvp_"+be()+"-",Te=0,De=O;O.cast=Pe,O.all=Ae,O.race=Le,O.resolve=Pe,O.reject=je,O.prototype={constructor:O,_guidKey:Re,_onError:function(e){me.async(function(t){setTimeout(function(){t._onError&&me.trigger("error",e)},0)},this)},then:function(e,t,r){var n=this,i=n._state;if(i===ke&&!e||i===xe&&!t)return me.instrument&&Se("chained",this,this),this;n._onError=null;var o=new this.constructor(p,r),s=n._result;if(me.instrument&&Se("chained",n,o),i){var a=arguments[i-1];me.async(function(){C(i,o,a,s)})}else E(n,o,e,t);return o},catch:function(e,t){return this.then(null,e,t)},finally:function(e,t){var r=this.constructor;return this.then(function(t){return r.resolve(e()).then(function(){return t})},function(t){return r.resolve(e()).then(function(){throw t})},t)}},U.prototype=ve(Be.prototype),U.prototype._superConstructor=Be,U.prototype._makeResult=A,U.prototype._validationError=function(){return new Error("allSettled must be called with an array")};var Me,Oe,Ue=N,Ne=F,Fe=0,Ye=Y,ze="undefined"!=typeof window?window:void 0,qe=ze||{},We=qe.MutationObserver||qe.WebKitMutationObserver,Ve=void 0!==r&&"[object process]"==={}.toString.call(r),He="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,$e=new Array(1e3);Oe=Ve?function(){var e=r.nextTick,t=r.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);return Array.isArray(t)&&"0"===t[1]&&"10"===t[2]&&(e=setImmediate),function(){e(W)}}():We?function(){var e=0,t=new We(W),r=document.createTextNode("");return t.observe(r,{characterData:!0}),function(){r.data=e=++e%2}}():He?function(){var e=new MessageChannel;return e.port1.onmessage=W,function(){e.port2.postMessage(0)}}():void 0===ze&&"function"==typeof e?function(){try{var t=e,r=t("vertx");return Me=r.runOnLoop||r.runOnContext,z()}catch(e){return q()}}():q();var Ge=V,Ke=H,Ze=$;$.prototype=ve(Be.prototype),$.prototype._superConstructor=Be,$.prototype._init=function(){this._result={}},$.prototype._validateInput=function(e){return e&&"object"==typeof e},$.prototype._validationError=function(){return new Error("Promise.hash must be called with an object")},$.prototype._enumerate=function(){var e=this.promise,t=this._input,r=[];for(var n in t)e._state===Ee&&Object.prototype.hasOwnProperty.call(t,n)&&r.push({position:n,entry:t[n]});var i=r.length;this._remaining=i;for(var o,s=0;e._state===Ee&&s<i;s++)o=r[s],this._eachEntry(o.entry,o.position)},G.prototype=ve(Ze.prototype),G.prototype._superConstructor=Be,G.prototype._makeResult=A,G.prototype._validationError=function(){return new Error("hashSettled must be called with an object")};var Qe=K,Je=Z,Xe=Q,et=new J,tt=new J,rt=ie,nt=ce,it=fe,ot=ue,st=he;me.async=Ye;if("undefined"!=typeof window&&"object"==typeof window.__PROMISE_INSTRUMENTATION__){var at=window.__PROMISE_INSTRUMENTATION__;f("instrument",!0);for(var ct in at)at.hasOwnProperty(ct)&&pe(ct,at[ct])}var ft={race:nt,Promise:De,allSettled:Ue,hash:Je,hashSettled:Qe,denodeify:rt,on:pe,off:de,map:Xe,filter:Ke,resolve:ot,reject:it,all:Ne,rethrow:st,defer:Ge,EventTarget:_e,configure:f,async:le};"function"==typeof define&&define.amd?define(function(){return ft}):void 0!==t&&t.exports?t.exports=ft:void 0!==this&&(this.RSVP=ft)}).call(this)}).call(this,e("_process"))},{_process:111}],psd:[function(e,t,r){var n,i,o,s,a,c,f,u,h=function(e,t){function r(){this.constructor=e}for(var n in t)l.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},l={}.hasOwnProperty;f=e("rsvp"),c=e("coffeescript-module").Module,n=e("./psd/file.coffee"),a=e("./psd/lazy_execute.coffee"),i=e("./psd/header.coffee"),u=e("./psd/resources.coffee"),s=e("./psd/layer_mask.coffee"),o=e("./psd/image.coffee"),t.exports=function(t){function r(e){this.file=new n(e),this.parsed=!1,this.header=null,Object.defineProperty(this,"layers",{get:function(){return this.layerMask.layers}}),f.on("error",function(e){return console.error(e)})}return h(r,t),r.Node={Root:e("./psd/nodes/root.coffee")},r.extends(e("./psd/init.coffee")),r.prototype.parse=function(){if(!this.parsed)return this.parseHeader(),this.parseResources(),this.parseLayerMask(),this.parseImage(),this.parsed=!0},r.prototype.parseHeader=function(){return this.header=new i(this.file),this.header.parse()},r.prototype.parseResources=function(){var e;return e=new u(this.file),this.resources=new a(e,this.file).now("skip").later("parse").get()},r.prototype.parseLayerMask=function(){var e;return e=new s(this.file,this.header),this.layerMask=new a(e,this.file).now("skip").later("parse").get()},r.prototype.parseImage=function(){var e;return e=new o(this.file,this.header),this.image=new a(e,this.file).later("parse").ignore("width","height").get()},r.prototype.tree=function(){return new r.Node.Root(this)},r}(c)},{"./psd/file.coffee":5,"./psd/header.coffee":6,"./psd/image.coffee":7,"./psd/init.coffee":"./psd/init.coffee","./psd/layer_mask.coffee":48,"./psd/lazy_execute.coffee":49,"./psd/nodes/root.coffee":56,"./psd/resources.coffee":61,"coffeescript-module":82,rsvp:112}]},{},[]);
//# sourceMappingURL=psd.js.map

function calc(c,m,y,k,) 
                         {
                             
                             c = parseFloat(c)/100;
                             m = parseFloat(m)/100;
                             y = parseFloat(y)/100;
                             k = parseFloat(k)/100;

                             if( c<0 ) c=0;
                             if( m<0 ) m=0;
                             if( y<0 ) y=0;
                             if( k<0 ) k=0;
                             if( c>1 ) c=1;
                             if( m>1 ) m=1;
                             if( y>1 ) y=1;
                             if( k>1 ) k=1;
                             r = Math.round((1-c)*(1-k)*255);
                             g = Math.round((1-m)*(1-k)*255);
                             b = Math.round((1-y)*(1-k)*255);

                             return [r,g,b]
                            
                         }


(function($) {

    $.fontSpy = function( element, conf ) {
        var $element = $(element);
        var defaults = {
            font: $element.css("font-family"),
            onLoad: '',
            onFail: '',
            testFont: 'Comic Sans MS',
            testString: 'QW@HhsXJ',
            delay: 50,
            timeOut: 2500
        };
        var config = $.extend( defaults, conf );
        var tester = document.createElement('span');
            tester.style.position = 'absolute';
            tester.style.top = '-9999px';
            tester.style.left = '-9999px';
            tester.style.visibility = 'hidden';
            tester.style.fontFamily = config.testFont;
            tester.style.fontSize = '250px';
            tester.innerHTML = config.testString;
        document.body.appendChild(tester);
        var fallbackFontWidth = tester.offsetWidth;
        tester.style.fontFamily = config.font + ',' + config.testFont;
        function checkFont() {
            var loadedFontWidth = tester.offsetWidth;
            if (fallbackFontWidth === loadedFontWidth){
                if(config.timeOut < 0) {
                    $element.removeClass(config.onLoad);
                    $element.addClass(config.onFail);
                    console.log('failure');
                }
                else {
                    $element.addClass(config.onLoad);
                    setTimeout(checkFont, config.delay);
                    config.timeOut = config.timeOut - config.delay;
                }
            }
            else {
                $element.removeClass(config.onLoad);
            }
        }
        checkFont();
    };

    $.fn.fontSpy = function(config) {
        return this.each(function() {
            if (undefined == $(this).data('fontSpy')) {
                var plugin = new $.fontSpy(this, config);
                $(this).data('fontSpy', plugin);
            }
        });
    };

})(jQuery);


function base64ToBlob(base64, mime) 
{
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}

function wrapText(context, text, x, y, maxWidth, lineHeight, fontSize) {
  
    var words = text.split(' ');
  
    var lines = [];
    var line = '';
    var lineWords = 0;
    var testLine = '';

    words.forEach(function(word,index) {
      
      testLine += ((lineWords == 0 ? '' : ' ') + word);

if(context.measureText(testLine).width > maxWidth || index == words.length -1 ) {
        if(words.length == 1) {
          lines.push(words[0]);
        } else {
          lines.push(line);
         line = '';
         testLine = word;
         lineWords = 0;
        }
         
      }
      line += ((lineWords == 0 ? '' : ' ') + word);
      lineWords ++;
      
     })

    y = y - (lineHeight * (lines.length - 1 ) );

    lines.forEach(function(line,index) {
      context.fillText(line, x, y + (lineHeight * index) );
    })

}

var getTextHeight = function(fontFamily, fontSize) {

  var text = $('<span>Hg</span>').css({ fontFamily: fontFamily,fontSize: fontSize });
  var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');
  var div = $('<div></div>');
  div.append(text, block);

  var body = $('body');
  body.append(div);

  try {

    var result = {};

    block.css({ verticalAlign: 'baseline' });
    result.ascent = block.offset().top - text.offset().top;

    block.css({ verticalAlign: 'bottom' });
    result.height = block.offset().top - text.offset().top;

    result.descent = result.height - result.ascent;

  } finally {
    div.remove();
  }

  return result;
};var template = `
<div>
    
    <div class="ui-option col-2">
            <label>Upload Image:</label>
            <label @click="uploadImage"for="uploadImage"><span class="fa fa-upload"></span></label>
        
    </div>
    <div class="ui-option col-2">
    <label>Customer Can Upload:</label>
    <input type="checkbox" v-model="activeLayer.customCanUpload"/>
    </div>
    <div class="ui-option col-1">
        <label>X:</label>
        <input type="number" @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.x"/>
    </div>
    <div class="ui-option col-1">
        <label>Y:</label>
        <input type="number" @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.y"/>
    </div>
        <div class="ui-option col-1">
        <label>Width:</label>
        <input type="number" @keyup="renderCanvas('width')" @change="renderCanvas('width')" v-model="activeLayer.width"/>
    </div>

    <div class="ui-option col-1">
        <label>Height:</label>
        <input type="number" @keyup="renderCanvas('height')" @change="renderCanvas('height')" v-model="activeLayer.height"/>
    </div>
    <div class="ui-option">
        <label class="constrain" :class="activeLayer.constrain ? 'constrained' : '' " @click="toggleConstrain">Constrain Dimensions</label>
    </div>
   

    
</div>
`

Vue.component('ImageRegionOptions', {
    computed : {
        views() { return this.$store.state.card.views },
        card() { return this.$store.state.card },
        activeLayer() { return this.$store.state.card.activeView.activeLayer },
        window : () => window,
        uploadWindow() { return window.wp.media({

            // Accepts [ 'select', 'post', 'image', 'audio', 'video' ]
            // Determines what kind of library should be rendered.
            frame: 'select',
        
            // Modal title.
            title: "'Select Images'",
        
            // Enable/disable multiple select
            multiple: false,
        
            // Library wordpress query arguments.
            library: {
                order: 'DESC',
        
                // [ 'name', 'author', 'date', 'title', 'modified', 'uploadedTo', 'id', 'post__in', 'menuOrder' ]
                orderby: 'date',
        
                // mime type. e.g. 'image', 'image/jpeg'
                type: 'image',
        
                // Searches the attachment title.
                search: null,
        
                // Includes media only uploaded to the specified post (ID)
                uploadedTo: null // wp.media.view.settings.post.id (for current post ID)
            },
        
            button: {
                text: 'Done'
            }
        
        });}
    },
    methods : {
        renderCanvas : function() { this.$root.$emit('renderCanvas'); },
        toggleConstrain() {
            this.activeLayer.constrain = !this.activeLayer.constrain ;
        },
        uploadImage(e) {
            this.uploadWindow.open();
        },
        renderCanvas : function(type) { 
            if(type == 'width') {
                if(this.activeLayer.constrain) {
                 this.activeLayer.height = Math.round(+  this.activeLayer.aspectW * this.activeLayer.width);
               
                }
            }
             if(type == 'height') {
                if(this.activeLayer.constrain) {
                    this.activeLayer.width = + Math.round(+ this.activeLayer.height * this.activeLayer.aspectH);
                }
            }
            this.$root.$emit('renderCanvas'); 
            },
        loadPreviewImage(url) {
            
            var activeLayer = this.$store.state.card.activeView.activeLayer;

            this.activeLayer.image = new Image();
            this.activeLayer.image.src = url;
            this.activeLayer.image.imageURL = url;

            var that = this;

            this.activeLayer.image.onload = function() {
                activeLayer.width = activeLayer.image.width;
                activeLayer.height = activeLayer.image.height;
                activeLayer.aspectW = activeLayer.height / activeLayer.width;
                activeLayer.aspectH = activeLayer.width / activeLayer.height;
                that.$root.$emit('renderCanvas');
            }

            this.$forceUpdate();
        },
    },
    created : function() {
        var that = this;
        this.uploadWindow.on( 'select', function() {

            // write your handling code here.
            var selectedImages = that.uploadWindow.state().get( 'selection' ).first();
            that.loadPreviewImage(selectedImages.attributes.url);
            // Probably send the image IDs to the backend using ajax?
        });
    },
    template : template
});var template = `
<div>
    <button @click="displayModal('image-region')">Add Image</button>
    <button @click="displayModal('text-region')">Add Text</button>
    <label  @click="triggerUploadPSD" class="upload_psd">Upload PSD</label>
    <input id="upload_psd" ref="upload_psd" style="display:none" type="file"  @change="uploadPSD"/>

    <draggable class="clearfix" @end="renderCanvas" v-model="$store.state.card.activeView.layers">
        <div @click="changeActiveLayer(index)" v-for="(layer ,index) in layers" :class="activeLayer == layer ? 'selected' : ''" :key="index" class="ui-layer">
            <div @click="deleteLayer(index)"  class="ui-delete"><span class="fa fa-times"></span></div>
            <div  v-if="layer.type == 'image-region'" :style="{backgroundImage : 'url(' + layer.imageURL + ')'}" class="image-preview"> </div>
            <i v-if="layer.type == 'text-region'" class="fas fa-text">T</i>
            <input class="ui-view-name" v-model="layer.name"  />
        </div>
    </draggable>

    <div v-show="ui.modals.layersModal" class="ui-modal-background">
        <div class="ui-modal" >
            <h2>Add Layer Title <div class="close"  @click="toggleModal"><span class="fa fa-times"></span></div></h2>
            <input type="text" @keyup.enter="addLayer()" v-model="layerName" placeholder="Layer name, eg: main text"/>
            <button @click="addLayer()">Add Layer</button>
        </div>
    </div>
</div>
`

Vue.component('CardLayers', {
    data : function() {
        return {
            layerName : '' 
        }
    },
    computed : {
        ui() { return this.$store.state.ui },
        card() { return this.$store.state.card },
        layers() { return this.$store.state.card.activeView.layers ? this.$store.state.card.activeView.layers : [] },
        activeLayer() { return this.$store.state.card.activeView.activeLayer },
        activeView() { return this.$store.state.card.activeView }
    },
    methods : {
        triggerUploadPSD() {
            if(!this.activeView) return alert('Please add a View');
            const elem = this.$refs.upload_psd
            elem.click()
        },
        displayModal(type) {
            if(!this.activeView) return alert('Please add a View');
            this.currentType = type;
            this.toggleModal(type);
        },
        toggleModal(type) {
            if(type == 'psd') {
                this.$store.state.ui.modals.layersPSDModal = !this.$store.state.ui.modals.layersPSDModal;
            } else {
                this.$store.state.ui.modals.layersModal = !this.$store.state.ui.modals.layersModal;
            }
            
        },
        uploadPSD(e) {
            if(!this.activeView) return alert('Please add a View');
            var that = this;
            var PSD = require('psd');
            var filename = e.target.value.split("\\");
            
            filename = filename[filename.length - 1].replace('.psd','_')
            this.ui.loading = true;
            var psd = PSD.fromDroppedFile (e.target.files[0]).then(function(psd) {
                that.$store.state.card.width = psd.tree().width;
                that.$store.state.card.height = psd.tree().height;
                var layers = psd.tree().descendants();

                console.log(psd.tree().export())

                var images = [];
                layers.forEach(function(layer) {
                    var info = layer.export();

                    if(info.text) {
                        var fontFamilySplit = info.text.font.name.split('-')

                        var fontFamily = fontFamilySplit[0].match(/($[a-z])|[A-Z][^A-Z]+/g).join(" ");
                        
                        var fontWeight = fontFamilySplit[1] ? fontFamilySplit[1].toLowerCase() : 'normal';
                        fontWeight = fontWeight.indexOf('bold') > -1 ? 'bold' : fontWeight;
                        fontWeight = fontWeight.indexOf('regular') > -1 ? 'normal' : fontWeight;
                        
                        var transY = info.text.transform.yy;
                        
                        var fontSize = info.text.font.sizes[0];

                        fontSize = Math.round((fontSize * transY) * 100) * 0.01;

                        
                       
                        var CMYK = [];
                        CMYK[0] = info.text.font.colors[0][0] * 100 / 255;
                        CMYK[1] = info.text.font.colors[0][1] * 100 / 255;
                        CMYK[2] = info.text.font.colors[0][2] * 100 / 255;
                        CMYK[3] = info.text.font.colors[0][3] * 100 / 255;

                        var RGB = calc(CMYK[0],CMYK[1],CMYK[2],CMYK[3]);
                        
                        var _layer = {
                            name : info.text.value,
                            width : info.width,
                            height : 100,
                            x : info.left,
                            y : info.bottom,
                            type : 'text-region',
                            text : info.text.value,
                            fontSize : Math.round(fontSize),
                            fontWeight : fontWeight,
                            fontFamily : fontFamily,
                            lineHeight : Math.round(fontSize) * 0.40,
                            letterSpacing : '1em',
                            color: 'rgb(' +RGB.join(',') + ')',
                            textAlign : 'center',
                            textModifyer : 'static'
                        }
                        
                    } else {
                      
                       if(info.type == 'group') return;

                       var img = layer.toPng();
                       
                       var base64 = img.src;
                       
                       var base64ImageContent = base64.replace(/^data:image\/(png|jpg);base64,/, "");
                       var blob = base64ToBlob(base64ImageContent, 'image/png'); 

                       var formData = new FormData();
                       formData.append('picture', blob);
                       formData.append('action', 'upload_image');
                       formData.append('filename' , filename + '_' + info.name.toLowerCase().replace(' ' , '_') )

                       images.push(img);

                        _layer = {
                            name : info.name,
                            width : info.width,
                            height : info.height,
                            constrain : true,
                            x : info.left,
                            y : info.top,
                            image : img,
                            imageURL : '',
                            filter : null,
                            imageX : 0,
                            imageY : 0,
                            imageScale : 1,
                            imageRotation : 0,
                            aspectW : 1,
                            aspectH : 1,
                            type: 'image-region'
                        }
                    }

                    that.$store.dispatch('addLayer', _layer);

                    var index = that.$store.state.card.activeView.layers.length - 1;

                    $.ajax({
                        url: ajaxurl, 
                        type: "POST", 
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: formData})
                        .done(function(e){
                            that.$store.state.card.activeView.layers[index].imageURL = e;
                            
                        });
                    
                }) 
                var length = images.length;
                var itts = 0;
                images.forEach(function(img) {
                    img.onload = function() {
                       itts ++;
                       if(itts == length) {
                        that.$root.$emit('renderCanvas'); 
                         setTimeout(function() {
                            that.$root.$emit('renderCanvas'); 
                            setTimeout(function() {
                                that.$root.$emit('renderCanvas');  
                             },200) 
                         },200)
                       }
                    }
                }) 

                that.$set(that.$store.state.card.activeView, 'activeLayer', that.$store.state.card.activeView.layers[that.$store.state.card.activeView.layers.length - 1])
                   
            });

        },
        renderCanvas() {
            that.$root.$emit('renderCanvas');  
        },
        addLayer : function(){
            let layer;

            switch(this.currentType) {
                case 'image-region' : 

                layer = {
                    name : this.layerName,
                    width : 100,
                    height : 100,
                    constrain : true,
                    x : 0,
                    y : 0,
                    image : '',
                    filter : null,
                    imageX : 0,
                    imageY : 0,
                    imageScale : 1,
                    imageRotation : 0,
                    aspectW : 1,
                     aspectH : 1,
                    type: 'image-region'
                }

                break;

                case 'text-region' : 

                layer = {
                    name : this.layerName,
                    width : 100,
                    height : 100,
                    x : 0,
                    y : 40,
                    type : 'text-region',
                    text : '',
                    fontSize : '16',
                    fontWeight : 'normal',
                    fontFamily : 'sans-serif',
                    letterSpacing : '1em',
                    color: '#000',
                    textAlign : 'left',
                    textModifyer : 'static'
                }

                break;

                case 'static-image' : 

                layer = {
                    name : this.layerName,
                    type : 'static-image',
                    width : 100,
                    height : 100,
                    x : 0,
                    y : 0,
                    image : '',
                }

                break;
            }
            

            this.$store.dispatch('addLayer', layer);

            this.toggleModal();
            
            this.$set(this.$store.state.card.activeView, 'activeLayer', this.$store.state.card.activeView.layers[this.$store.state.card.activeView.layers.length - 1])
            
            //Clear field
            this.layerName = '';

        },
        deleteLayer(index) {
            var conf = confirm('Are you sure you would like to delete this View');
            if(conf) this.$store.dispatch('deleteLayer', index);
        },
        changeActiveLayer(index) {
            this.activeView.activeLayer = this.activeView.layers[index];
            
            this.$set(this.$store.state.card.activeView.activeLayer, 'activeLayer', this.activeView.layers[index])
            
        },
        loadSaveData() {
            var that = this;
            var queryvards = window.location.search.slice(1)
                      .split('&')
                      .reduce(function _reduce (/*Object*/ a, /*String*/ b) {
                        b = b.split('=');
                        a[b[0]] = decodeURIComponent(b[1]);
                        return a;
                      }, {});

                    if(queryvards.post && ($('#publish').val() == 'Update')) {
                        this.ui.loading = true;
                        $.post(ajaxurl,{
                            action : 'get_saved_data',
                            post : queryvards.post
                        } , function(e) {
                            var card = JSON.parse(e);

                            that.$store.state.card.width = card.width;
                            that.$store.state.card.height = card.height;

                            card.views.forEach(function(saved_view) {
                                var view = {
                                    name : saved_view.name,
                                    layers : [],
                                    image : null
                                }

                                var images_loaded = 0;

                                var images = [];

                                that.$store.dispatch('addView', view);
                                
                                
                                that.$set(that.$store.state.card , 'activeView', that.$store.state.card.views[that.$store.state.card.views.length - 1])

                                
                                saved_view.layers.forEach(function(layer) {
                                   
                                    if(layer.type == 'text-region') {
                                    } else {
                                        layer.image = new Image()
                                        layer.image.src = layer.imageURL;
                                        images.push(layer.image)
                                    }

                                    that.$store.dispatch('addLayer', layer);
                                            
                                })

                                that.$set(that.$store.state.card.activeView, 'activeLayer', that.activeView.layers[that.activeView.layers.length - 1])


                                images.forEach(function(image) {
                                    image.onload = function() {
                                        images_loaded ++;
                                        console.log(images_loaded ,images.length)
                                        if(images_loaded == (images.length)) {
                                           setTimeout(function() {
                                            that.$root.$emit('renderCanvas')
                                            setTimeout(function() {
                                                that.$root.$emit('renderCanvas')
                                               },200)
                                           },200)
                                            
                                           
                                        }
                                    }
                                })
                                
                            })

                        })
                    }
                     

        
        }
    },
    created : function() {
        this.loadSaveData();
    },
    template : template
});




var template = `
<div>
    <div class="ui-sidebar-options">
        <h1 class="ui-sidebar-header">Card Size</h1>
        <div class="ui-sidebar-options-body clearfix">
            <div class="ui-option col-1">
                <label>Width:</label>
                <input type="number" @change="renderCanvas" @keyup="renderCanvas" v-model="card.width"/>
            </div>

            <div class="ui-option col-1">
                <label>Height:</label>
                <input type="number" @change="renderCanvas" @keyup="renderCanvas" v-model="card.height"/>
            </div>
        </div>
    </div>

    <div class="clearfix ui-sidebar-options" v-if="activeLayer && activeLayer.type == 'text-region'">
        <h1 class="ui-sidebar-header">Text Options</h1>
        <div class="ui-sidebar-options-body">
        <TextOptions/>
        </div>
    </div>

    <div class="clearfix ui-sidebar-options" v-if="activeLayer && activeLayer.type == 'image-region'">
        <h1 class="ui-sidebar-header">Image Region Options</h1>
        <div class="ui-sidebar-options-body">
        <ImageRegionOptions/>
        </div>
    </div>
</div>
`

Vue.component('CardOptions', {
    computed : {
        views() { return this.$store.state.card.views },
        card() { return this.$store.state.card },
        activeLayer() { return this.$store.state.card.activeView.activeLayer },
        window : () => window,
    },
    methods : {
        renderCanvas : function() { 
           
            
                this.$root.$emit('renderCanvas');
                console.log('here')
           
           
         }
    },
    template : template
});
var template = `
<div class="clearfix">
    <div class="ui-options">
        <card-options/>
    </div>
    <canvas :width="card.width" :height="card.height" :style="{width:+ cardStyleWidth + 'px',height: cardStyleHeight + 'px'}" class="card-canvas"></canvas>
    <div v-if="ui.loading" class="loading-spinner"><div></div></div>
</div>
</div> 
`

Vue.component('CardStage', {
    computed : {
        views() { return this.$store.state.card.views },
        activeView() { return this.$store.state.card.activeView },
        ui() { return this.$store.state.ui },
        card() { return this.$store.state.card },
        window : () => window,
        cardStyleWidth :  { 
            get(){
                return ( ($('#card_stage').width() - 320) > this.$store.state.card.width) ? this.$store.state.card.width : ($('#card_stage').width() - 320)
              },
              set(newValue){
                return newValue
              } 
             
         },
        cardStyleHeight :  { 
            get(){
                return ( ($('#card_stage').width() - 320) > this.$store.state.card.width) ? this.$store.state.card.height : (($('#card_stage').width() - 320) * (this.$store.state.card.height / this.$store.state.card.width))
              },
              set(newValue){
                return newValue
              } 
             
         }, 
   
    },
    methods : {
        renderCanvas : function() {
           
            this.ctx.clearRect(0,0,this.card.width,this.card.height)
            this.ctx.beginPath();

            var layers = this.activeView.layers.slice().reverse();

            layers.forEach((layer) => {
                layer.x = + layer.x;
                layer.y = + layer.y;
                layer.width = + layer.width;
                layer.height = + layer.height;
                switch (layer.type) {
                    case 'text-region' :

                            this.ctx.fillStyle = layer.color;
                            this.ctx.textBaseline = '';
                            this.ctx.font =  layer.fontWeight + ' ' + layer.fontSize + 'px ' + layer.fontFamily;

                            var textHeight = getTextHeight(layer.fontFamily , layer.fontSize + 'px ' ).height;

                            switch (layer.textAlign) {

                                case 'left' : 
                                this.ctx.textAlign = 'left';
                                wrapText(this.ctx,layer.text, + layer.x  ,layer.y, layer.width, textHeight +  ( + layer.lineHeight), layer.fontSize)
                                break;

                                case 'center' : 
                                this.ctx.textAlign = 'center';
                                wrapText(this.ctx,layer.text, + layer.x + (layer.width / 2) ,layer.y, layer.width, textHeight + ( + layer.lineHeight), layer.fontSize)
                                break;

                                case 'right' : 
                                this.ctx.textAlign = 'right';
                                wrapText(this.ctx,layer.text, + layer.x + layer.width ,layer.y, layer.width, textHeight + ( + layer.lineHeight), layer.fontSize)
                                break;

                            }
                        break;
                    case 'image-region' :
                            if(this.activeView.activeLayer == layer) {
                                this.ctx.rect(layer.x,layer.y,layer.width,layer.height);
                                this.ctx.stroke();
                            }
                            
                            this.ctx.drawImage(layer.image,layer.x,layer.y,layer.width,layer.height);
                            
                    break; 
                        
                    }
                });

             this.activeView.image = this.canvas.toDataURL();
             this.$root.$emit('forceUpdate') ;
             this.ui.loading = false;
        },
        updateCanvasSize() {
            this.$forceUpdate();
            this.cardStyleWidth = (($('#card_stage').width() - 320) > this.$store.state.card.width) ? this.$store.state.card.width : ($('#card_stage').width() - 320) ;
            this.cardStyleHeight = (($('#card_stage').width() - 320) > this.$store.state.card.width) ? this.$store.state.card.height : (($('#card_stage').width() - 320) * (this.$store.state.card.height / this.$store.state.card.width)) ;
            this.$forceUpdate();
        }

    },
    created : function() {
        var that = this;
        setTimeout(() => {
            this.canvas = document.querySelector('.card-canvas');
            this.ctx = this.canvas.getContext('2d');
        },100);
        window.addEventListener("resize", this.updateCanvasSize);
         this.$root.$on('renderCanvas', function() {
             setTimeout(() => {
             that.renderCanvas();
            },100);
         })
    },
    template : template
});

var template = `
<div>
            <div class="ui-option col-2">
                <label>Text:</label>
                <input @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.text" type="text"  />
            </div>
            <div class="ui-option col-1">
                <label>X:</label>
                <input type="number" @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.x"/>
            </div>
            <div class="ui-option col-1">
                <label>Y:</label>
                <input type="number" @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.y"/>
            </div>
            <div class="ui-option col-2">
                <label>Font Family:</label>

                <div @click="openDropDown" class="font-familys ui-dropdown">
                    <div :class="activeLayer.fontFamily ? activeLayer.fontFamily.replace(' ','-').toLowerCase() : ''">{{activeLayer.fontFamily ? toTitleCase(activeLayer.fontFamily.replace('-',' ')) : ''}}<span class="fa fa-sort-down"></span></div>
                    <ul>
                        <li @click="changeFontFamily('Libre Baskerville')"  class="libre-baskerville">Libre Baskerville</li>
                        <li @click="changeFontFamily('Montserrat')"  class="montserrat">Montserrat</li>
                        <li @click="changeFontFamily('Lobster')"  class="lobster">Lobster</li>
                        <li @click="changeFontFamily('Dancing Script')"  class="dancing-script">Dancing Script</li>
                        <li @click="changeFontFamily('Satisfy')"  class="satisfy">Satisfy</li>
                        <li @click="changeFontFamily('Bangers')"  class="bangers">Bangers</li>
                        <li @click="changeFontFamily('GFS Didot')"  class="gfs-didot">Ήταναπλώς θέμα χρόνου</li>
                        <li @click="changeFontFamily('Autumn In November')"  class="autumn-in-november">Autumn In November</li>
                    </ul>
                </div>
            </div>
            <div class="ui-option col-1">
            <label>Font Color:</label>
            <label for="font-color" class="font-color" :style="{background:activeLayer.color}" ></label>
            <input @input="renderCanvas()" :style="{background-color:activeLayer.color}" @change="renderCanvas()" v-model="activeLayer.color" id="font-color" type="text" style="display:none" />
        </div>
        <div class="ui-option col-1">
            <label>Font Size:</label>
            <input @input="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.fontSize" type="number"  />
        </div>
        <div class="ui-option col-1">
            <label>Line Height:</label>
            <input @input="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.lineHeight" type="number"  />
        </div>
            <div class="ui-option  col-2">
                <label>Text Modifyer:</label>
            
                <div class="text-modifyer ui-dropdown">
                    <div @click="openDropDown">{{activeLayer.textModifyer ? toTitleCase(activeLayer.textModifyer) : ''}}<span class="fa fa-sort-down"></span></div>
                    <ul>
                        <li @click="changeTextModifyer('static')"  class="sans-serif">Static (customer cannot edit the text)</li>
                        <li @click="changeTextModifyer('editable')"  class="great-vibes">Editable (customer can edit any part of the text)</li>
                        <li @click="changeTextModifyer('variable')"  class="amatic-sc">Variable (customer can edit only the variable part of the string : {variable})</li>
                    </ul>
                </div>
            </div>
           
            <div class="ui-option col-2">
                <label>Font Weight:</label>
                <div class="font-weight ui-dropdown">
                    <div @click="openDropDown">{{toTitleCase(activeLayer.fontWeight)}}<span class="fa fa-sort-down"></span></div>
                        <ul>
                            <li @click="changeFontWeight('normal')" >Normal</li>
                            <li @click="changeFontWeight('bold')" >Bold</li>
                        </ul>
                    </div>
            </div>
            </div>
</div>
`

Vue.component('TextOptions', {
    computed : {
        views() { return this.$store.state.card.views },
        card() { return this.$store.state.card },
        activeLayer() { return this.$store.state.card.activeView.activeLayer },
        window : () => window,
    },
    methods : {
        toTitleCase : function(str) {
            return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) },
        closeDropDown() {
            $('.open-ul').removeClass('open-ul').hide();
        },
        changeFontFamily : function(fontFamily) {
            this.activeLayer.fontFamily = fontFamily;
            this.renderCanvas();
            this.closeDropDown()
        },
        changeFontWeight : function(fontWeight) {
            this.activeLayer.fontWeight = fontWeight; 
            this.renderCanvas();
            this.closeDropDown()
        },
        changeTextModifyer : function(textModifyer) {
            this.activeLayer.textModifyer = textModifyer;
            this.renderCanvas(); 
            this.closeDropDown()
        },
        renderCanvas : function() {
            this.$root.$emit('renderCanvas'); 
        },
        openDropDown : function(e) {
            $('.open-ul').removeClass('open-ul').hide();
            if($(e.target).siblings('ul').hasClass('open-ul')) {
                
            } else {
                $(e.target).siblings('ul').show().addClass('open-ul');
            }
            
        }
    },
    created : function() {
      
       
    },
    template : template
});var template = `
<div>
    <ul v-if="views">
        <li  v-for="(view ,index) in views" :key="index" @click="changeActiveView(index)" class="ui-view" :class="view.selected ? 'selected' : ''">
            <div @click="deleteView(index)" class="ui-delete"><span class="fa fa-times"></span></div>
            <div :style="'background-image:url(' + view.image + ')'" class="ui-view-image"></div>
            <input class="ui-view-name" v-model="view.name"  />
        </li>
        <li @click="toggleModal">
            <div class="plus">+</div>
            <p>Add View</p>
        </li>
    </ul>

    <div v-show="$store.state.ui.modals.viewsModal" class="ui-modal-background">
        <div class="ui-modal" >
            <h2>Add View name <div class="close"  @click="toggleModal"><span class="fa fa-times"></span></div></h2>
            <input type="text" @keyup.enter.prevent="addView" v-model="viewName" placeholder="View name, eg: Front of card"/>
            <button @click.prevent="addView()">Add View</button>
        </div>
    </div>
    <input name="json_data" :value="json_data" type="text" style="display:none;" />

</div>
`

Vue.component('CardViews', {
    data : function() {
        return {
            viewName : '' ,
            json_data : null
        }
    },
    computed : {
        views() { return this.$store.state.card.views },
        ui() { return this.$store.state.ui },
        card() { return this.$store.state.card },
        
    },
    methods : {
        toggleModal() {
            this.$store.state.ui.modals.viewsModal = !this.$store.state.ui.modals.viewsModal;
        },
        addView : function() {
            var view = {
                name : this.viewName,
                layers : [],
                image : null
            }
            this.$store.dispatch('addView', view);
            this.toggleModal();
            this.viewName = '';
            this.card.activeView =  this.card.views[this.card.views.length - 1];
        },
        deleteLayer : function(index) {
            var conf = confirm('Are you sure you would like to delete this View');
            if(conf) this.$store.dispatch('deleteView', index);
        },
        changeActiveView : function(index) {
            this.card.activeView = this.card.views[index];
        }
    },
    created : function() {
        var that = this;
        this.$root.$on('forceUpdate', function() {
            setTimeout(function() {
                that.$forceUpdate(); 
            },1000)
            
            console.log('here')
        })
        this.$store.watch((state) => state.card ,function() {
          
           var json_data = Object.assign({} ,that.$store.state.card) ;

            

           json_data.activeView = null;

          if(json_data.views) {
            json_data.views.forEach(function(view) {
                if(view.layers) {
                view.layers.forEach(function(layers) {
                    layers.activeLayer = null
                })
            }
           })
          }
          
            that.json_data = JSON.stringify(json_data);
           

        },{deep:true})
    },
    template : template
});




$(document).ready(function() {
    var is_publish = false;
    $('#publish').on('click', function() {
        is_publish = true;
    })
    $('#post').on('submit', function(e) {
        if(e.originalEvent.submitter.id != 'publish') {
            e.preventDefault()
        }
        
    })
    var App = new Vue({
        el : '#poststuff',
        data : {
            views : [],
            test : 'test',
            json_data : null
        },
        store : store,
       
    })
})

var store = new Vuex.Store({
    state : {
        card : {
          width:300,
          height:400,
          activeView : 0,
          views : [],
        },
        
        ui : {
          modals: {
            viewsModal : false,
            layersModal : false,
            layersPSDModal : false
          },
          windows: {
            viewsModal : false,
            modModal : false,
          },
          loading: false
        }
    },
    mutations: {
      addView (state,view) {
        state.card.views.push(view);
      },
      deleteView (state,index) {
        state.card.views.splice(index,1);
      },
      addLayer (state,layer) {
        state.card.activeView.layers.push(layer);
      },
      deleteLayer (state,index) {
        state.card.activeView.layers.splice(index,1);
      }
    },
    actions : {
      addView (context,view) {
        context.commit('addView' , view )
      },
      deleteView (context,index) {
        context.commit('deleteView' , index )
      },
      addLayer (context,layer) {
        context.commit('addLayer' , layer )
      },
      deleteLayer (context,index) {
        context.commit('deleteLayer' , index )
      },
    },
    getters : {
      activeView : state => state.card.activeView,
      activeLayer : state => state.card.activeView.activeLayer
    }
})
