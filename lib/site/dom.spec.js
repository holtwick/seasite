'use strict';

var _jsx = require('./jsx');

var _dom = require('./dom');

var _index = require('../plugins/index');

describe('DOM', function () {

    it('should understand HTML', function () {
        var r = (0, _jsx.jsx)(
            'div',
            null,
            (0, _jsx.jsx)(
                'b',
                null,
                'Bold'
            )
        );
        var $ = (0, _dom.dom)(r);

        $.applyPlugins([(0, _index.example)('test')], {
            value: 123
        });

        expect($.html()).toBe('<html><head><meta name="test" value="123"></head><body><div><b>Bold</b></div></body></html>');
    });

    it('should know about XML', function () {
        var x = (0, _dom.xml)((0, _jsx.jsx)('div', null));
        expect(x.xmlMode).toBe(true);
        expect(x.markup()).toBe('<?xml version="1.0" encoding="utf-8"?>\n<div/>');

        var h = (0, _dom.html)((0, _jsx.jsx)('div', null));
        expect(h.xmlMode).toBe(false);
        expect(h.markup()).toBe('<!doctype html>\n<html><head></head><body><div></div></body></html>');
    });

    it('should decode URI for PHP', function () {
        var sample = '/buy-fallback?coupon=%3C?%20echo%20$_GET[%27coupon%27]);?%3E';
        var markup = sample.replace(/%3C\?(php)?(.*?)\?%3E/g, function (m, p1, p2) {
            return '<?php' + decodeURIComponent(p2) + '?>';
        });
        expect(markup).toBe('/buy-fallback?coupon=<?php echo $_GET[\'coupon\']);?>');
    });

    it('should decode HTML for PHP', function () {
        var sample = '<a href="?coupon=&lt;?php echo $_GET[&apos;coupon&apos;] ?? &apos;&apos;;?&gt;">Buy</a>';
        var markup = (0, _dom.html)(sample).bodyMarkup();
        expect(markup).toBe('<a href="?coupon=<?php echo $_GET[\'coupon\'] ?? \'\';?>">Buy</a>');
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