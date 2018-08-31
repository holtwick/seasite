"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.example = example;

var _jsx = require("../site/jsx");

/*
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
// @jsx jsx
function example() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return function ($) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      value: 0
    };
    $('head').append((0, _jsx.jsx)("meta", {
      name: name,
      value: opt.value || 0
    }));
  };
}