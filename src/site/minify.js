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

const UglifyJS = require('uglify-js')

const less = require('less')
const LessPluginCleanCSS = require('less-plugin-clean-css')

const { PurgeCSS } = require('purgecss')

import log from '../log'

export function stripComments(code: ?string): ?string {
  if (!code) return null
  return code.replace(/\/\*[\s\S]*?\*\//g, '')
}

export function minifyLESS(css: string, opt: Object = {}): ?string {
  let cleanCSSPlugin = new LessPluginCleanCSS({ advanced: true })
  let options = {
    ...opt,
    sync: true,
    syncImport: true,
    plugins: [cleanCSSPlugin],
  }
  var out = null
  less.render(css, options, function (err, result) {
    if (err) {
      log.error('LESS minification error: ' + err.toString())
      throw err
    }
    out = result.css
  })
  return stripComments(out)
}

export function minifyJS(...code: [string]): ?string {
  let codeString = code.join('\n')
  var result = UglifyJS.minify(codeString)
  if (result == null || result.error) {
    log.error('JS minification error: ' + result.error.toString())
    throw result.error
  }
  return stripComments(result.code)
}

//

export async function purgeCSS(html: string, css: string, opt: Object = {}): Promise<string> {
  const result = await new PurgeCSS().purge({
    content: [{
      raw: html,
    }],
    css: [{
      raw: css,
    }],
  })
  try {
    return result.map(r => r.css || '').join('\n')
  } catch (err) {
    log.error('Exception:', err)
  }
  return ''
}
