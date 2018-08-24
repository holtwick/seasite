'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.tidy = tidy;
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

var defaults = {};

function tidy() {
    var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    gopt = Object.assign({}, defaults, gopt);

    return function ($) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var html = $.html();
        html = html.replace(/(<(meta|link|script|img|hr|br)[^>]*>)(\s*\n)*/gi, '$1\n');
        html = html.replace(/(<\/(p|h1|h2|h3|h4|h5|h6|blockquote|div|ul|ol|li|article|section|footer)>)(\s*\n)*/gi, '$1\n');
        $.reload(html);
    };
}