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
import {example} from '../plugins/index'
import {dom, html, xml} from './dom'

describe('DOM', () => {

  it('should understand HTML', () => {
    let r = <div><b>Bold</b></div>
    let $ = dom(r)

    $.applyPlugins([
      example('test')
    ], {
      value: 123
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

  it('should decode URI for PHP', () => {
    const sample = '/buy-fallback?coupon=%3C?%20echo%20$_GET[%27coupon%27]);?%3E'
    let markup = sample.replace(/%3C\?(php)?(.*?)\?%3E/g, (m, p1, p2) => `<?php${decodeURIComponent(p2)}?>`)
    expect(markup).toBe('/buy-fallback?coupon=<?php echo $_GET[\'coupon\']);?>')
  })

  it('should decode HTML for PHP', () => {
    const sample = '<a href="?coupon=&lt;?php echo $_GET[&apos;coupon&apos;] ?? &apos;&apos;;?&gt;">Buy</a>'
    const markup = html(sample).bodyMarkup()
    expect(markup).toBe('<a href="?coupon=<?php echo $_GET[\'coupon\'] ?? \'\';?>">Buy</a>')
  })

  it('should not duplicate <br>', () => {
    const sample = <div>A <br/> B </div>
    expect(sample).toBe(`<div>A <br></br> B </div>`)
    let $ = html(sample)
    expect($.bodyMarkup()).toBe(`<div>A <br> B </div>`)
    $.reload('<div>A <br/> C </div>')
    expect($.bodyMarkup()).toBe(`<div>A <br> C </div>`)
    // $.applyPlugins([tidy()])
    // expect($.bodyMarkup()).toBe(`<div>A <br>\n C </div>\n`)

    $('div').html(<b>X<br/>Y</b>)
    expect($.bodyMarkup()).toBe(`<div><b>X<br>Y</b></div>`)
  })

  it('should understand different input types', () => {
    const sample = <div>lorem</div>
    expect(sample).toBe(`<div>lorem</div>`)
    expect(html(sample).bodyMarkup()).toBe(`<div>lorem</div>`)
    expect(html(Buffer.from(sample)).bodyMarkup()).toBe(`<div>lorem</div>`)
    expect(html(html(sample)).bodyMarkup()).toBe(`<div>lorem</div>`)
    expect(html(new Date()).bodyMarkup()).toBe(``)
  })

})