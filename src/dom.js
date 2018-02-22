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

// (C)opyright Dirk Holtwick, 2016-09-02 <dirk.holtwick@gmail.com>
// @jsx html
// @flow

const cheerio = require('cheerio')

import {jsx, HTML} from './jsx'

export function dom(value: any, opt:Object = {
    normalizeWhitespace: true
}): Function {

    if (typeof value === 'string') {
        value = cheerio.load(value, opt)
    }

    if (!(typeof value === 'function' && typeof value.html === 'function')) {
        value = null
    }

    if (value) {
        let $:Function = value

        $.applyPlugins = function (plugins: Array<Function>, ...opts) {
            for (let plugin of plugins) {
                plugin($, ...opts)
            }
        }

        $.decorate = function (selector, fn) {
            $(selector).each((i, e) => {
                e = $(e)
                e.replaceWith(fn(HTML(e.html())))
            })
        }

        return $
    }

    return cheerio.load('', opt)
}
