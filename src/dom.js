// (C)opyright Dirk Holtwick, 2016-09-02 <dirk.holtwick@gmail.com>
// @jsx html
// @flow

const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const url = require('url')

import {jsx, HTML, prependXMLIdentifier} from './jsx'
import {absoluteLinks} from './relativeurls'
import {Plugin} from './plugins/plugin'

export function dom(value: any, opt:Object = {
    normalizeWhitespace: true
}): ?any {

    let $

    if (typeof value === 'string') {
        $ = cheerio.load(value, opt)
    }

    if (!$) {
        return null
    }


    $.applyPlugins = function (plugins:Array<Plugin>) {
        for (let plugin of plugins) {
            plugin.work($)
        }
    }

    return $
}
