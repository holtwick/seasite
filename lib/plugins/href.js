'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.href = href;

var _url = require('url');

var url = _interopRequireWildcard(_url);

var _jsx = require('../site/jsx');

var _relativeurls = require('../site/relativeurls');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var defaults = {
    relative: false,
    handleURL: function handleURL(url) {
        return url;
    }
}; /*
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

function isAbsoluteURL(url) {
    return url.indexOf('http') === 0;
}

function href() {
    var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    return function ($) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        opt = Object.assign({}, gopt, opt);

        var baseURL = opt.path || '/';
        if (baseURL[0] !== '/') {
            baseURL = '/' + baseURL;
        }

        (0, _relativeurls.handleLinks)($, function (href) {
            return url.resolve(baseURL, href);
        });

        // absoluteLinks($, opt.path)
    };
}