'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cleanup = cleanup;

var _site = require('../site/site');

var defaults = {
    patterns: [/\.md/, 'template.html']
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

function cleanup(site) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    opt = Object.assign({}, defaults, opt);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = opt.patterns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var pattern = _step.value;

            site.remove(pattern);
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
}