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

import {join} from 'path'
import {existsSync} from 'fs'

const sizeOf = require('image-size')

const OPT = {}

let cache = {}

function isAbsoluteURL(url: string) {
    return url.indexOf('http') === 0
}

export function img(gopt: Object = {}) {
    gopt = Object.assign({}, OPT, gopt)

    return ($: Function, opt: Object = {}) => {
        opt = Object.assign({}, gopt, opt)

        const basePath = opt.basePath || opt.site.basePath
        const path = opt.path || 'index.html'

        if (basePath) {
            $('img[src]').each((i, el) => {
                let img = $(el)
                let src = img.attr('src')

                if (!isAbsoluteURL(src)) {
                    let p
                    if (src[0] === '/') {
                        src = src.substr(1)
                        p = join(basePath, src)
                    } else {
                        p = join(basePath, path, '..', src)
                    }

                    if (!existsSync(p)) {
                        console.error(`Image at ${p} is referenced in ${path} but is missing!`)
                        return
                    }

                    if (!(img.attr('width') || img.attr('height'))) {
                        let size = sizeOf(p);

                        if (src.indexOf('@2x.') > 0) {
                            size.width /= 2
                            size.height /= 2
                        }
                        img.attr('width', size.width.toString())
                        console.log('[img]', src, p, size)
                    }
                }

                let parent = img.parent('p')
                if (parent) {
                    if (!$(parent).text().trim()) {
                        $(parent).addClass('img-wrapper')
                    }
                }

                // console.log(dimensions.width, dimensions.height);
            })
        }
    }

}