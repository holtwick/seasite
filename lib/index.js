'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.task = exports.plugin = exports.log = undefined;

var _log = require('./log');

Object.defineProperty(exports, 'log', {
  enumerable: true,
  get: function get() {
    return _log.log;
  }
});

var _site = require('./site');

Object.keys(_site).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _site[key];
    }
  });
});

var _plugins = require('./plugins');

var plugin = _interopRequireWildcard(_plugins);

var _tasks = require('./tasks');

var task = _interopRequireWildcard(_tasks);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.plugin = plugin;
exports.task = task;