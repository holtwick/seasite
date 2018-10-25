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

// https://github.com/mishoo/UglifyJS2

var UglifyJS = require('uglify-js')

var less = require('less')
var LessPluginCleanCSS = require('less-plugin-clean-css')

import {SeaSite} from './site'
import log from '../log/index'

let defaults = {}

export async function minifyLESSAsync(s: string) {
    let cleanCSSPlugin = new LessPluginCleanCSS({advanced: true})
    let r = await less.render(s, {
        plugins: [cleanCSSPlugin],
    })
    return r.css
}

if (!less.renderSync) {
    less.renderSync = function (input, options) {
        if (!options || typeof options != 'object') options = {}
        options.sync = true
        var css
        this.render(input, options, function (err, result) {
            if (err) throw err
            css = result.css
        })
        return css
    }
}

export function minifyLESS(s: string) {
    let cleanCSSPlugin = new LessPluginCleanCSS({advanced: true})
    return less.renderSync(s, {
        plugins: [cleanCSSPlugin],
    })
}

export function minifyJS(s: string) {
    var result = UglifyJS.minify(s)
    return result.code
}
