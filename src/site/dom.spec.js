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
import {dom, xml, html} from './dom'
import {example} from '../plugins/index'

describe('DOM', () => {

    it('should understand HTML', () => {
        let r = <div><b>Bold</b></div>
        let $ = dom(r)

        $.applyPlugins([
            example('test'),
        ], {
            value: 123,
        })

        expect($.html()).toBe('<html><head><meta name="test" value="123"></head><body><div><b>Bold</b></div></body></html>')
    })

    it('should know about XML', () => {
        let x = xml(<div></div>)
        expect(x.xmlMode).toBe(true)
        expect(x.markup()).toBe('<?xml version="1.0" encoding="utf-8"?>\n<div/>')

        let h = html(<div></div>)
        expect(h.xmlMode).toBe(false)
        expect(h.markup()).toBe('<!doctype html>\n<html><head></head><body><div></div></body></html>')
    })

})