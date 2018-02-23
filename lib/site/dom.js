'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isDOM = isDOM;
exports.toString = toString;
exports.dom = dom;

var _jsx = require('./jsx');

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

// (C)opyright Dirk Holtwick, 2016-09-02 <dirk.holtwick@gmail.com>
// @jsx html
var cheerio = require('cheerio');

function isDOM(obj) {
    return obj && typeof obj === 'function' && typeof obj.html === 'function';
}

function toString(obj) {
    if (obj) {
        if (obj instanceof Buffer) {
            return toString('utf8');
        } else if (isDOM(obj)) {
            return obj.html();
        }
    }
    return (obj || '').toString();
}

function dom(value) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        normalizeWhitespace: true
    };


    if (value instanceof Buffer) {
        value = value.toString('utf8');
    }

    if (!isDOM(value)) {
        if (typeof value !== 'string') {
            value = '';
        }
        value = cheerio.load(value, opt);
    }

    // FLOW:2018-02-23
    var $ = value;

    $.applyPlugins = function (plugins) {
        for (var _len = arguments.length, opts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            opts[_key - 1] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var plugin = _step.value;

                plugin.apply(undefined, [$].concat(opts));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };

    $.decorate = function (selector, fn) {
        $(selector).each(function (i, e) {
            e = $(e);
            e.replaceWith(fn((0, _jsx.HTML)(e.html())));
        });
    };

    return $;
}