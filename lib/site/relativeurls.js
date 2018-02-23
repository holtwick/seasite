'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.translateLinks = translateLinks;
exports.handleLinks = handleLinks;
exports.absoluteLinks = absoluteLinks;

var _url = require('url');

var url = _interopRequireWildcard(_url);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function urlRelative(fromURL, toURL) {
    try {
        // assert(fromURL[0] === '/', `Expected absolute URL ${fromURL}`);
        // assert(toURL[0] === '/', `Expected absolute URL ${toURL}`);

        var fromParts = fromURL.split('/');
        var toParts = toURL.split('/');
        // console.log(fromParts, toParts);

        // Find common root
        var indexCommon = 0;
        for (var i = 0; i < fromParts.length - 1; i++) {
            if (toParts[i] === fromParts[i]) {
                indexCommon++;
            } else {
                break;
            }
        }
        fromParts = fromParts.slice(indexCommon);
        toParts = toParts.slice(indexCommon);
        // console.log(fromParts, toParts);

        // Moving up missing levels
        for (var _i = 0; _i < fromParts.length - 1; _i++) {
            toParts.unshift('..');
        }

        return toParts.join('/');
    } catch (err) {
        //console.error('urlRelative', toURL, err.toString());
        return toURL;
    }
} /*
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

// (C)opyright Dirk Holtwick, 2016-10-28 <dirk.holtwick@gmail.com>

var urlElements = [{ tag: 'a', attr: 'href' }, { tag: 'script', attr: 'src' }, { tag: 'link', attr: 'href' }, { tag: 'img', attr: 'src' }];

function translateLinks($, baseURL) {
    var _loop = function _loop(info) {
        $(info.tag + '[' + info.attr + ']').each(function (i, e) {
            e = $(e);
            var href = e.attr(info.attr);
            if (/^(mailto|#|https?:)/.test(href)) {
                return;
            }
            var toUrl = url.resolve('/', href);
            var fromUrl = url.resolve('/', baseURL);
            var newHref = urlRelative(fromUrl, toUrl);
            // console.log('from', href, 'to', newHref);
            // url = urlRelative(url.baseUrl || '/', url);
            e.attr(info.attr, newHref);
        });
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = urlElements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var info = _step.value;

            _loop(info);
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

function handleLinks($, handle) {
    var _loop2 = function _loop2(info) {
        $(info.tag + '[' + info.attr + ']').each(function (i, e) {
            e = $(e);
            var href = e.attr(info.attr);
            if (/^(mailto|#|https?:)/.test(href)) {
                return;
            }
            var newHref = handle(href);
            if (newHref) {
                e.attr(info.attr, newHref);
            }
        });
    };

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = urlElements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var info = _step2.value;

            _loop2(info);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
}

function absoluteLinks($) {
    var baseURL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';

    if (baseURL[0] !== '/') {
        baseURL = '/' + baseURL;
    }
    handleLinks($, function (href) {
        return url.resolve(baseURL, href);
    });
}