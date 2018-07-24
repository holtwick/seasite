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
import log from '../log'

const OPT = {}

export function localize(gopt: Object = {}) {
    gopt = Object.assign({}, OPT, gopt)

    var strings = {}

    function loadStrings(opt) {
        const lang = opt.lang.toLowerCase()
        log.assert(!!lang, '[plugin.localize] opt.lang required')

        if (lang) {
            let stringsPath = path.join(process.cwd(), 'languages', `${lang}.json`)

            try {
                strings = opt.strings || JSON.parse(fs.readFileSync(stringsPath, {encoding: 'utf8'})) || {}
            }
            catch (e) {
                log.warn('[plugin.localize] Error loading strings for', lang, '=>', e.toString())
                strings = {}
            }
        }
    }

    return ($: Function | string, opt: Object = {}) => {
        opt = Object.assign({}, gopt, opt)

        const lang = opt.lang.toLowerCase()
        log.assert(!!lang, '[plugin.localize] opt.lang required')

        if (lang) {
            loadStrings(opt)

            let translateString = (s: string): string => {
                let sr = strings[s] || strings[s.trim()]
                if (!sr && opt.missing) {
                    opt.missing[s.trim()] = s.trim()
                }
                return sr || s
            }

            if (typeof $ === 'string') {
                let s = $
                log.info('Translate', $)
                while (s.indexOf('_') === 0) {
                    s = s.substr(1)
                }
                return translateString(s)
            }

            let fn = (m, p, f, s) => {
                if (s && f !== '_blank') {
                    return p + translateString(s)
                }
            }

            let html = $.html()
            html = html.replace(/(>\s*)(__?([^<]+))/gm, fn)
            html = html.replace(/(")(__?([^"]+))/gm, fn)
            html = html.replace(/(')(__?([^']+))/gm, fn)
            html = html.replace(/(&apos;)(__?([^&]+))/gm, fn) // quoted when inside an attribute like onclick="setLang('_lang')"
            $.reload(html)

            // On element level
            $(`*[data-lang]:not([data-lang=${lang}])`).remove()
        }
    }

}
