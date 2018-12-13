"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

(function (global) {
  'use strict';

  var Logger = {};
  Logger.VERSION = '1.4.1';
  var logHandler;
  var contextualLoggersByNameMap = {};

  var bind = function bind(scope, func) {
    return function () {
      return func.apply(scope, arguments);
    };
  };

  var merge = function merge() {
    var args = arguments,
        target = args[0],
        key,
        i;

    for (i = 1; i < args.length; i++) {
      for (key in args[i]) {
        if (!(key in target) && args[i].hasOwnProperty(key)) {
          target[key] = args[i][key];
        }
      }
    }

    return target;
  };

  var defineLogLevel = function defineLogLevel(value, name) {
    return {
      value: value,
      name: name
    };
  };

  Logger.DEBUG = defineLogLevel(1, 'DEBUG');
  Logger.INFO = defineLogLevel(2, 'INFO');
  Logger.TIME = defineLogLevel(3, 'TIME');
  Logger.WARN = defineLogLevel(4, 'WARN');
  Logger.ERROR = defineLogLevel(8, 'ERROR');
  Logger.OFF = defineLogLevel(99, 'OFF');

  var ContextualLogger = function ContextualLogger(defaultContext) {
    this.context = defaultContext;
    this.setLevel(defaultContext.filterLevel);
    this.log = this.info;
    this.count = {
      error: 0,
      warn: 0
    };
  };

  ContextualLogger.prototype = {
    setLevel: function setLevel(newLevel) {
      if (newLevel && 'value' in newLevel) {
        this.context.filterLevel = newLevel;
      }
    },
    getLevel: function getLevel() {
      return this.context.filterLevel;
    },
    enabledFor: function enabledFor(lvl) {
      var filterLevel = this.context.filterLevel;
      return lvl.value >= filterLevel.value;
    },
    debug: function debug() {
      this.invoke(Logger.DEBUG, arguments);
    },
    info: function info() {
      this.invoke(Logger.INFO, arguments);
    },
    warn: function warn() {
      this.count.warn += 1;
      this.invoke(Logger.WARN, arguments);
    },
    error: function error() {
      this.count.error += 1;
      this.invoke(Logger.ERROR, arguments);
    },
    assert: function assert(assertion) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (!assertion) {
        if (!args || args.length <= 0) {
          args = ['Assertion failed'];
        } else {
          args[0] = 'Assertion failed: ' + args[0].toString();
        }

        this.count.error += 1;
        this.invoke(Logger.ERROR, args);
      }
    },
    time: function time(label) {
      if (typeof label === 'string' && label.length > 0) {
        this.invoke(Logger.TIME, [label, 'start']);
      }
    },
    timeEnd: function timeEnd(label) {
      if (typeof label === 'string' && label.length > 0) {
        this.invoke(Logger.TIME, [label, 'end']);
      }
    },
    invoke: function invoke(level, msgArgs) {
      if (logHandler && this.enabledFor(level)) {
        logHandler(msgArgs, merge({
          level: level
        }, this.context));
      }
    }
  };
  var globalLogger = new ContextualLogger({
    filterLevel: Logger.OFF
  });

  (function () {
    var L = Logger;
    L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
    L.debug = bind(globalLogger, globalLogger.debug);
    L.time = bind(globalLogger, globalLogger.time);
    L.timeEnd = bind(globalLogger, globalLogger.timeEnd);
    L.info = bind(globalLogger, globalLogger.info);
    L.warn = bind(globalLogger, globalLogger.warn);
    L.error = bind(globalLogger, globalLogger.error);
    L.assert = bind(globalLogger, globalLogger.assert);
    L.count = globalLogger.count;
    L.log = L.info;
  })();

  Logger.setHandler = function (func) {
    logHandler = func;
  };

  Logger.setLevel = function (level) {
    globalLogger.setLevel(level);

    for (var key in contextualLoggersByNameMap) {
      if (contextualLoggersByNameMap.hasOwnProperty(key)) {
        contextualLoggersByNameMap[key].setLevel(level);
      }
    }
  };

  Logger.getLevel = function () {
    return globalLogger.getLevel();
  };

  Logger.get = function (name) {
    return contextualLoggersByNameMap[name] || (contextualLoggersByNameMap[name] = new ContextualLogger(merge({
      name: name
    }, globalLogger.context)));
  };

  Logger.createDefaultHandler = function (options) {
    options = options || {};

    options.formatter = options.formatter || function defaultMessageFormatter(messages, context) {
      if (context.name) {
        messages.unshift('[' + context.name + ']');
      }
    };

    var timerStartTimeByLabelMap = {};

    var invokeConsoleMethod = function invokeConsoleMethod(hdlr, messages) {
      try {
        Function.prototype.apply.call(hdlr, console, messages);
      } catch (err) {
        try {
          Function.prototype.apply.call(hdlr, console, messages.join(' '));
        } catch (err) {
          var _console;

          (_console = console).log.apply(_console, (0, _toConsumableArray2.default)(messages));
        }
      }
    };

    if (typeof console === 'undefined') {
      return function () {};
    }

    return function (messages, context) {
      messages = Array.prototype.slice.call(messages);
      var hdlr = console.log;
      var timerLabel;

      if (context.level === Logger.TIME) {
        timerLabel = (context.name ? '[' + context.name + '] ' : '') + messages[0];

        if (messages[1] === 'start') {
          if (console.time) {
            console.time(timerLabel);
          } else {
            timerStartTimeByLabelMap[timerLabel] = new Date().getTime();
          }
        } else {
          if (console.timeEnd) {
            console.timeEnd(timerLabel);
          } else {
            invokeConsoleMethod(hdlr, [timerLabel + ': ' + (new Date().getTime() - timerStartTimeByLabelMap[timerLabel]) + 'ms']);
          }
        }
      } else {
        if (context.level === Logger.WARN && console.warn) {
          hdlr = console.warn;
        } else if (context.level === Logger.ERROR && console.error) {
          hdlr = console.error;
        } else if (context.level === Logger.INFO && console.info) {
          hdlr = console.info;
        } else if (context.level === Logger.DEBUG && console.debug) {
          hdlr = console.debug;
        }

        options.formatter(messages, context);
        invokeConsoleMethod(hdlr, messages);
      }
    };
  };

  Logger.useDefaults = function (options) {
    Logger.setLevel(options && options.defaultLevel || Logger.DEBUG);
    Logger.setHandler(Logger.createDefaultHandler(options));
  };

  if (typeof define === 'function' && define.amd) {
    define(Logger);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
  } else {
    Logger._prevLogger = global.Logger;

    Logger.noConflict = function () {
      global.Logger = Logger._prevLogger;
      return Logger;
    };

    global.Logger = Logger;
  }
})(void 0);