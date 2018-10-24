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

var UglifyJS = require("uglify-js");

import {SeaSite} from '../site/site'
import log from '../log'

let defaults = {
    jsopts: {},
    cssopts: {},
}

export function minify(site: SeaSite, opt: Object = {}) {
    opt = Object.assign({}, defaults, opt)

    // log.info(opt.pattern, opt.exclude)
    let sitemap = site
        .paths(opt.pattern, opt.exclude)
        .map(path => site.publicURL(path))



            var result = UglifyJS.minify(code);

    sitemap.sort()
    site.write('sitemap.txt', sitemap.join('\n'))

    if (!site.exists('robots.txt')) {
        site.write('robots.txt', `User-agent: *\nSitemap: ${site.publicURL('sitemap.txt')}`)
    }
}