'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.markdown = markdown;

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
    pattern: /.*\.md$/,
    template: function template(site) {
        return (0, _index.jsx)(
            'div',
            null,
            (0, _index.jsx)('div', { id: 'content' })
        );
    },
    handle: function handle($, opt) {}
};

function markdown(site) {
    var gopt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var pages = [];
    gopt = Object.assign({}, defaults, gopt);

    var plugins = [_index.plugin.href(), _index.plugin.meta()];

    site.handle(gopt.pattern, function (content, path) {

        if ((0, _site.pathMatchesPatterns)(path, gopt.exclude)) {
            return false; // don't write
        }

        var md = (0, _index.parseMarkdown)(content, {
            bs4: gopt.bs4
        });
        var props = md.props;
        var html = md.html;

        var opt = Object.assign({}, defaults, gopt, props, {
            html: html,
            content: content,
            path: path,
            outline: md.outline
        });

        var $ = (0, _index.dom)(gopt.template(site, opt));

        opt.handle($, opt);

        $.applyPlugins(plugins, Object.assign({}, opt, {
            path: path
        }));

        opt.html = $.html();
        pages.push(opt);

        if (gopt.cleanup === true) {
            site.remove(path);
        }

        site.write(pathToHTMLPath(opt.path), opt.html);
    });

    return pages;
}