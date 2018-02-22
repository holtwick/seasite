'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExamplePlugin = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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

// (C)opyright 2018-01-04 Dirk Holtwick, holtwick.it. All rights reserved.

// @jsx jsx

// Support for Google Analytics integration, respecting do not track

var _plugin = require('./plugin');

var _jsx = require('../jsx');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExamplePlugin = exports.ExamplePlugin = function () {
    function ExamplePlugin(value) {
        _classCallCheck(this, ExamplePlugin);

        this.name = value || '';
    }

    _createClass(ExamplePlugin, [{
        key: 'work',
        value: function work($) {
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
                value: 0
            };

            $('head').append((0, _jsx.jsx)('meta', { name: this.name, value: opts.value || 0 }));
        }
    }]);

    return ExamplePlugin;
}();