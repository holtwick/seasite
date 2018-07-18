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

export function isDOM(obj: any): boolean {
    return obj && typeof obj === 'function' && typeof obj.html === 'function'
}

export function toString(obj: any): string {
    if (obj) {
        if (obj instanceof Buffer) {
            return toString('utf8')
        } else if (isDOM(obj)) {
            return obj.html()
        }
    }
    return (obj || '').toString()
}

export function dom(value: string | Buffer | Function, opt: Object = {
    normalizeWhitespace: true,
}): Function {

    if (value instanceof Buffer) {
        value = value.toString('utf8')
    }

    if (!isDOM(value)) {
        if (typeof value !== 'string') {
            value = ''
        }
        value = cheerio.load(value, opt)
    }

    // FLOW:2018-02-23
    let $: Function = value

    $.xmlMode = opt.xmlMode === true

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

    $.reload = function (html) {
        $.root().empty().html($.load(html).root())
    }

    $.markup = function () {
        if ($.xmlMode) {
            return '<?xml version="1.0" encoding="utf-8"?>\n' + $.xml()
        }
        let html = $.html()
        if (html.trim().toLowerCase().indexOf('<!doctype ') !== 0) {
            return '<!doctype html>\n' + html
        }
        return html
    }

    // Fix for cheerio bug
    // let xmlFn = $.xml
    // $.xml = function () {
    //     let content = xmlFn.call($)
    //     content = content.replace(/<\!--\[CDATA\[([\s\S]*?)\]\]-->/g, '<![CDATA[$1]]>')
    //     return content
    // }

    return $
}

export function xml(value: string | Buffer | Function) {
    return dom(value || '', {xmlMode: true})
}

export function html(value: string | Buffer | Function) {
    return dom(value || '')
}
