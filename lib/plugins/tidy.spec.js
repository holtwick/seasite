'use strict';

var _jsx = require('../site/jsx');

var _dom = require('../site/dom');

var _tidy = require('../plugins/tidy');

describe('pugin.tidy', function () {

    it('should add breaks', function () {
        var sample = (0, _jsx.jsx)(
            'div',
            null,
            'A ',
            (0, _jsx.jsx)('br', null),
            ' B '
        );
        var $ = (0, _dom.html)(sample);
        $.applyPlugins([(0, _tidy.tidy)()]);
        expect($.bodyMarkup()).toBe('<div>A <br>\n B </div>\n');
    });
}); /*
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

// (C)opyright Dirk Holtwick, 2017-01-19 <dirk.holtwick@gmail.com>
// @jsx jsx