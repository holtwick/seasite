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

import { SeaSite } from '../index'
import { handle, handleAsync } from './handle'

const defaults = {
  pattern: /\.html?$/,
  exclude: null,
}

export function html(site: SeaSite, gopt: Object = {}): Array<Object> {
  gopt = Object.assign({}, defaults, gopt)
  return handle(site, gopt)
}

export async function htmlAsync(site: SeaSite, gopt: Object = {}): Promise<Array<Object>> {
  gopt = Object.assign({}, defaults, gopt)
  return await handleAsync(site, gopt)
}
