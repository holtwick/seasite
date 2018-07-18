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
        let r = <div>
            <link>myLink</link>
            <link href="123"/>
        </div>
        expect(r).toBe('<div><link>myLink</link><link href="123"></link></div>')

        let x = xml(r).xml()
        expect(x).toBe('<div><link>myLink</link><link href="123"/></div>')

        let h = dom(r).html()
        expect(h).toBe('<html><head></head><body><div><link>myLink<link href="123"></div></body></html>')
    })
})