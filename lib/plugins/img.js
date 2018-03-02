'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.img = img;

var _path = require('path');

var _fs = require('fs');

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

var sizeOf = require('image-size');

var OPT = {};

var cache = {};

function isAbsoluteURL(url) {
    return url.indexOf('http') === 0;
}

function img() {
    var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    gopt = Object.assign({}, OPT, gopt);

    return function ($) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        opt = Object.assign({}, gopt, opt);

        var basePath = opt.basePath || opt.site.basePath;
        var path = opt.path || 'index.html';

        if (basePath) {
            $('img[src]').each(function (i, el) {
                var img = $(el);
                var src = img.attr('src');

                if (!isAbsoluteURL(src)) {
                    var p = void 0;
                    if (src[0] === '/') {
                        src = src.substr(1);
                        p = (0, _path.join)(basePath, src);
                    } else {
                        p = (0, _path.join)(basePath, path, '..', src);
                    }

                    if (!(0, _fs.existsSync)(p)) {
                        console.error('Image at ' + p + ' is referenced in ' + path + ' but is missing!');
                        return;
                    }

                    if (!(img.attr('width') || img.attr('height'))) {
                        var size = sizeOf(p);

                        if (src.indexOf('@2x.') > 0) {
                            size.width /= 2;
                            size.height /= 2;
                        }
                        img.attr('width', size.width.toString());
                    }
                }

                var parent = img.parent('p');
                if (parent) {
                    if (!$(parent).text().trim()) {
                        $(parent).addClass('img-wrapper');
                    }
                }

                // console.log(dimensions.width, dimensions.height);
            });
        }
    };
}