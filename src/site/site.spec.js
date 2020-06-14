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

import { filterByPatterns } from './site'

describe('Site', () => {

  const files = [
    'index.html',
    'readme.md',
    'php/index.html',
    'php/todo.php',
    'img/logo.png',
  ]

  it('should apply patterns correctly', () => {
    expect(filterByPatterns(files, 'unknown')).toEqual([])
    expect(filterByPatterns(files, 'index.html')).toEqual([
      'index.html',
    ])
    expect(filterByPatterns(files, /\.html/)).toEqual([
      'index.html',
      'php/index.html',
    ])
    expect(filterByPatterns(files, /\.html/, 'php')).toEqual([
      'index.html',
      'php/index.html',
    ])
    expect(filterByPatterns(files, /\.html/, 'php/')).toEqual([
      'index.html',
    ])
    expect(filterByPatterns(files, [/\.html/], ['php/'])).toEqual([
      'index.html',
    ])
    expect(filterByPatterns(files, ['php/'], [/html/])).toEqual([
      'php/todo.php',
    ])
  })

})
