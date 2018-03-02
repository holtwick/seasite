'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handle = handle;

var _index = require('../index');

var _site = require('../site');

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

function pathToHTMLPath(path) {
    return path.replace(/\..+?$/, '.html').replace(/\/-/, '/');
}

var defaults = {
    pattern: /.*/,
    plugins: []
};

function handle(site) {
    var gopt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var pages = [];

    var plugins = gopt.plugins;

    gopt = Object.assign({}, defaults, gopt);

    site.handle(gopt.pattern, function ($, path) {
        if ((0, _site.isPattern)(gopt.exclude) && (0, _site.pathMatchesPatterns)(path, gopt.exclude)) {
            return false; // don't write
        }

        var opt = Object.assign({}, defaults, gopt, {
            site: site,
            path: path
        });

        if ((0, _site.isDOM)($) && plugins && plugins.length) {
            $.applyPlugins(plugins, opt);
        }

        if (!opt.handler || opt.handler($, path) === false) {
            return false; // don't write
        }

        pages.push(opt);
    });

    return pages;
}