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

import {jsx} from './jsx'
import {dom, xml} from './dom'

describe('JSX', () => {

    it('jsx', () => {
        let r = <div><b>Bold</b></div>
        expect(r).toBe('<div><b>Bold</b></div>')
    })

    it('link xml', () => {
        let markup = <div>
            <link>myLink</link>
            <link href="123"/>
        </div>
        expect(markup).toBe('<div><link>myLink</link><link href="123"></link></div>')

        expect(
            xml(markup).xml()
        ).toBe('<div><link>myLink</link><link href="123"/></div>')

        expect(
            dom(markup).html()
        ).toBe('<html><head></head><body><div><link>myLink<link href="123"></div></body></html>')

        expect(
            dom(markup)('body').html()
        ).toBe('<div><link>myLink<link href="123"></div>')
    })

    it('cdata', () => {
        let markup = <div>
            <cdata>
                {' This is < & > messed up! '}
            </cdata>
        </div>
        expect(markup).toBe('<div><![CDATA[ This is &lt; &amp; &gt; messed up! ]]></div>')

        expect(
            xml(markup).xml()
        ).toBe('<div><![CDATA[ This is &lt; &amp; &gt; messed up! ]]></div>')

        // Correct?
        expect(
            dom(markup)('body').html()
        ).toBe('<div><!--[CDATA[ This is &lt; &amp; &gt; messed up! ]]--></div>')
    })

    it('ns', () => {
        let markup = <div>
            <x__y x__a="b">
                Test
            </x__y>
        </div>
        expect(markup).toBe(
            '<div><x:y x:a="b">Test</x:y></div>'
        )

        expect(
            xml(markup).xml()
        ).toBe(
            '<div><x:y x:a="b">Test</x:y></div>'
        )

        // // Correct?
        // expect(
        //     dom(markup)('body').html()
        // ).toBe('<div><!--[CDATA[ This is &lt; &amp; &gt; messed up! ]]--></div>')
    })


})