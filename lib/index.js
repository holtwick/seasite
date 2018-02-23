'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.task = exports.plugin = undefined;

var _site = require('./site/site');

Object.keys(_site).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _site[key];
    }
  });
});

var _markdown = require('./site/markdown');

Object.keys(_markdown).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _markdown[key];
    }
  });
});

var _jsx = require('./site/jsx');

Object.keys(_jsx).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _jsx[key];
    }
  });
});

var _dom = require('./site/dom');

Object.keys(_dom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _dom[key];
    }
  });
});

var _relativeurls = require('./site/relativeurls');

Object.keys(_relativeurls).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _relativeurls[key];
    }
  });
});

var _plugins = require('./plugins');

var plugin = _interopRequireWildcard(_plugins);

var _tasks = require('./tasks');

var task = _interopRequireWildcard(_tasks);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.plugin = plugin;
exports.task = task; /*
                      * Copyright (C) 2018 Dirk Holtwick <https://holtwick.de>
                      *
                      * This program is free software: you can redistribute it and/or modify
                      * it under the terms of the GNU General Public License as published by
                      * the Free Software Foundation, either version 3 of the License, or
                      * (at your option) any later version.
                      *
                      * This program is distributed in the hope that it will be useful,
                      * but WITHOUT ANY WARRANTY; without even the implied warranty of
                      * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                      * GNU General Public License for more details.
                      *
                      * You should have received a copy of the GNU General Public License
                      * along with this program.  If not, see <https://www.gnu.org/licenses/>.
                      */

// export * from './site/index'