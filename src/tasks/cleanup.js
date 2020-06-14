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

// @flow
// @jsx jsx

import { SeaSite } from '../site/site'

let defaults = {
  patterns: [
    /\.md/,
    'template.html',
  ],
}

export function cleanup(site: SeaSite, opt: Object = {}) {
  opt = Object.assign({}, defaults, opt)

  for (let pattern of opt.patterns) {
    site.remove(pattern)
  }
}
