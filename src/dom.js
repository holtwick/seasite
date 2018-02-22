// (C)opyright Dirk Holtwick, 2016-09-02 <dirk.holtwick@gmail.com>
// @jsx html
// @flow

const cheerio = require('cheerio')

import {jsx, HTML} from './jsx'
import {Plugin} from './plugins/plugin'

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

        $.applyPlugins = function (plugins: Array<Plugin>, ...opts) {
            for (let plugin of plugins) {
                plugin.work($, ...opts)
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
