'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sitemap = sitemap;

var _index = require('../index');

var _fileutil = require('../site/fileutil');

var _jsx = require('../site/jsx');

var _site = require('../site/site');

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

var defaults = {
    exclude: ['404.html'],
    pattern: /\.html/,
    handler: function handler($, path) {}
};

function sitemap(site) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    opt = Object.assign({}, defaults, opt);

    var sitemap = [];
    site.handle(opt.pattern, function ($, path) {

        // Exclude?
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = opt.exclude[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var pattern = _step.value;

                if (typeof pattern === 'string') {
                    if (path.indexOf(pattern) === 0) {
                        return;
                    }
                } else if (pattern instanceof RegExp) {
                    pattern.lastIndex = 0;
                    if (pattern.test(path)) {
                        return;
                    }
                }
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

        opt.handler($, path);

        var url = site.publicURL(path);
        sitemap.push(url);
    });

    sitemap.sort();
    site.write('sitemap.txt', sitemap.join('\n'));

    site.write('robots.txt', 'User-agent: *\nSitemap: ' + site.publicURL('sitemap.txt'));
}