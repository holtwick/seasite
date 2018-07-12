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

// (C)opyright 2018-01-04 Dirk Holtwick, holtwick.it. All rights reserved.

import fs from 'fs'
import path from 'path'

const OPT = {}

export function localize(gopt: Object = {}) {
    gopt = Object.assign({}, OPT, gopt)

    return ($: Function, opt: Object = {}) => {
        opt = Object.assign({}, gopt, opt)

        const lang = opt.lang.toLowerCase()
        if (lang) {
            let stringsPath = path.join(process.cwd(), 'languages', `${lang}.json`)
            let strings = opt.strings || JSON.parse(fs.readFileSync(stringsPath, {encoding: 'utf8'}))

            let html = $.html()
            html = html.replace(/([>"'])(__?([^<"']+))/gi, (m, p, f, s) => {
                if (s && f !== '_blank') {
                    let sr = strings[s] || strings[s.trim()]
                    if (!sr && opt.missing) {
                        opt.missing[s] = s
                    }
                    return p + (sr || s)
                }
            })
            $.reload(html)
        }
    }

}
