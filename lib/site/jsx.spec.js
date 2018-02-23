'use strict';

var _jsx = require('./jsx');

describe('JSX', function () {
    it('jsx', function () {
        var r = (0, _jsx.jsx)(
            'div',
            null,
            (0, _jsx.jsx)(
                'b',
                null,
                'Bold'
            )
        );
        expect(r).toBe('<div><b>Bold</b></div>');
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