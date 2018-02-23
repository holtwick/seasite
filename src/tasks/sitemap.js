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

import {handleLinks} from '../index'
import {jsx} from '../jsx'
import {SeaSite} from '../site'

let defaults = {
    exclude: [
        '404.html',
    ],
    pattern: /\.html/,
    handler($, path) {
    },
}

export function sitemap(site: SeaSite, opt: Object = {}) {
    opt = Object.assign({}, defaults, opt)

    let sitemap = []
    site.handle(opt.pattern, ($, path) => {
        //  handleHeaders($)
        handleLinks($, href => href.replace(/\.html$/, ''))

        opt.handler($, path)

        let url = site.absoluteURL(path)
        if (opt.exclude.indexOf(path) === -1) {
            sitemap.push(url)
        }
    })
    sitemap.sort()
    site.write('sitemap.txt', sitemap.join('\n'))

    site.write('robots.txt', `User-agent: *\nSitemap: ${site.absoluteURL('sitemap.txt')}`)
}