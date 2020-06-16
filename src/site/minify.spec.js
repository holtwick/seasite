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

import { minifyJS, minifyLESS, purgeCSS } from './minify'

describe('Minify', () => {

  it('should do LESS', () => {
    let r = minifyLESS('body { color: red } ')
    expect(r).toEqual('body{color:red}')
  })

  it('should do JS', () => {
    let r = minifyJS('var aa = 1+2', 'aa += 4')
    expect(r).toEqual('var aa=3;aa+=4;')
  })

  it('should purge CSS', async () => {
    let r = await purgeCSS('Hello <b>world</b>', 'b, u { color: red }\ni { color: blue }')
    expect(r).toEqual('b { color: red }')
  })

})
