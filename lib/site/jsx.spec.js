'use strict';

var _jsx = require('./jsx');

var _dom = require('./dom');

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

// (C)opyright Dirk Holtwick, 2017-01-19 <dirk.holtwick@gmail.com>
// @jsx jsx

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

    it('link xml', function () {
        var markup = (0, _jsx.jsx)(
            'div',
            null,
            (0, _jsx.jsx)(
                'link',
                null,
                'myLink'
            ),
            (0, _jsx.jsx)('link', { href: '123' })
        );
        expect(markup).toBe('<div><link>myLink</link><link href="123"></link></div>');

        expect((0, _dom.xml)(markup).xml()).toBe('<div><link>myLink</link><link href="123"/></div>');

        expect((0, _dom.dom)(markup).html()).toBe('<html><head></head><body><div><link>myLink<link href="123"></div></body></html>');

        expect((0, _dom.dom)(markup)('body').html()).toBe('<div><link>myLink<link href="123"></div>');
    });

    it('cdata', function () {
        var markup = (0, _jsx.jsx)(
            'div',
            null,
            (0, _jsx.jsx)(
                'cdata',
                null,
                ' This is < & > messed up! '
            )
        );
        expect(markup).toBe('<div><![CDATA[ This is &lt; &amp; &gt; messed up! ]]></div>');

        expect((0, _dom.xml)(markup).xml()).toBe('<div><![CDATA[ This is &lt; &amp; &gt; messed up! ]]></div>');

        // Correct?
        expect((0, _dom.dom)(markup)('body').html()).toBe('<div><!--[CDATA[ This is &lt; &amp; &gt; messed up! ]]--></div>');
    });

    it('ns', function () {
        var markup = (0, _jsx.jsx)(
            'div',
            null,
            (0, _jsx.jsx)(
                'x__y',
                { x__a: 'b' },
                'Test'
            )
        );
        expect(markup).toBe('<div><x:y x:a="b">Test</x:y></div>');

        expect((0, _dom.xml)(markup).xml()).toBe('<div><x:y x:a="b">Test</x:y></div>');

        // // Correct?
        // expect(
        //     dom(markup)('body').html()
        // ).toBe('<div><!--[CDATA[ This is &lt; &amp; &gt; messed up! ]]--></div>')
    });

    it('should accept DOM', function () {

        var markup = (0, _jsx.jsx)(
            'div',
            null,
            (0, _dom.xml)((0, _jsx.jsx)('hr', null))
        );

        expect(markup).toBe('<div><hr/></div>');

        expect((0, _dom.html)(markup).html()).toBe('<html><head></head><body><div><hr></div></body></html>');

        expect((0, _dom.xml)(markup).xml()).toBe('<div><hr/></div>');
    });

    it('should ignore script contents', function () {
        var sample = (0, _jsx.jsx)(
            'div',
            null,
            '\'Test\'',
            (0, _jsx.jsx)(
                'script',
                null,
                '\n                document.getElementById(\'disqus_thread\').style.display = \'block\'\n                '
            )
        );
        expect(sample).toBe('<div>&apos;Test&apos;<script>\n                document.getElementById(\'disqus_thread\').style.display = \'block\'\n                </script></div>');
    });
});