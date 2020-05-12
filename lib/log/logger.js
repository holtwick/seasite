"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFormatter = createFormatter;
exports.createConsoleHandler = createConsoleHandler;
exports.createNodeConsoleHandler = createNodeConsoleHandler;
exports.addHandler = addHandler;
exports.setLogHandler = setLogHandler;
exports.log = void 0;

var _colorize = require("./colorize");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var log = require('./logger-core');

exports.log = log;
log.useDefaults();
var LOG_PATH = 'seasite.log';

try {
  LOG_PATH = process.env.LOG_PATH || LOG_PATH;
} catch (err) {}

function translateLogLevel(level) {
  switch (level.toLowerCase()) {
    case 'error':
      return {
        prefix: 'E|*** ',
        color: 'red'
      };

    case 'warn':
      return {
        prefix: 'W|**  ',
        color: 'magenta'
      };

    case 'info':
      return {
        prefix: 'I|*   ',
        color: 'cyan'
      };

    case 'debug':
      return {
        prefix: 'D|    ',
        color: 'yellow'
      };

    default:
      break;
  }

  return {
    prefix: 'V|    ',
    color: null
  };
}

var colors = (0, _colorize.checkAnsiColorsAvailable)();

function prettyFormatMessages(messages) {
  for (var i = 0; i < messages.length; i++) {
    var d = messages[i];
    if (!d) continue;

    if (typeof d === 'string') {
      messages[i] = d;
    } else {
      try {
        var j = JSON.stringify(d, null, 2);

        if (j.indexOf('\n') >= 0 || j.length > 60) {
          messages[i] = "\n".concat(j, "\n");
        } else {
          messages[i] = j;
        }
      } catch (err) {
        messages[i] = d.toString();
      }
    }
  }
}

function createFormatter() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    date: false,
    level: false,
    name: false,
    color: false,
    pretty: false
  };
  var alternation = true;
  return function (messages, context) {
    if (opt.name === true && context.name) {
      messages.unshift("[".concat(context.name, "]"));
    }

    if (opt.level === true) {
      var level = translateLogLevel(context.level.name);
      messages.unshift(level.prefix);
    }

    if (opt.date === true) {
      messages.unshift(new Date().toISOString());
    }

    if (opt.color === true && colors) {
      var _level = translateLogLevel(context.level.name);

      var c = _level.color;

      if (c) {
        if (context.level.name.toLowerCase() === 'debug') {
          alternation = !alternation;
          c = alternation ? 'white' : c;
        }

        messages[0] = _colorize.ansicodes[c] + messages[0].toString();
        messages.push(_colorize.ansicodes.reset);
      }
    }

    if (opt.pretty === true) {
      prettyFormatMessages(messages);
    }
  };
}

function createConsoleHandler(opt) {
  return log.createDefaultHandler();
}

function createNodeConsoleHandler(opt) {
  return log.createDefaultHandler({
    formatter: createFormatter({
      name: true,
      level: false,
      color: true
    })
  });
}

var logHandler = [createConsoleHandler()];

if (colors) {
  logHandler = [createNodeConsoleHandler()];
}

function addHandler(handler) {
  logHandler.push(handler);
}

function setLogHandler(handler) {
  logHandler = handler;
}

log.setHandler(function (messages, context) {
  var _iterator = _createForOfIteratorHelper(logHandler),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var handler = _step.value;

      try {
        handler(messages, context);
      } catch (err) {}
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
});

try {
  process.on('unhandledRejection', function (reason, p) {
    log.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });
  process.on('uncaughtException', function (err) {
    log.error('Caught exception', err);
  });
} catch (err) {}

var logger = log;