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

import { purgeCSS } from '../site'
import { jsx } from '../site/jsx'

const defaults = {}

export function tidy(gopt: Object = {}) {
  gopt = Object.assign({}, defaults, gopt)

  return ($: Function, opt: Object = {}) => {
    let html = $.html()
    html = html.replace(/(<(meta|link|script|img|hr|br)[^>]*>)(\s*\n)*/gi, '$1\n')
    html = html.replace(/(<\/(p|h1|h2|h3|h4|h5|h6|blockquote|div|ul|ol|li|article|section|footer)>)(\s*\n)*/gi, '$1\n')
    $.reload(html)
  }

}

export function tidyCSS(gopt: Object = {}) {
  gopt = Object.assign({}, defaults, gopt)
  return async ($, opt) => {
    let styles = $('style[type="text/css"]')
    let css = []
    styles.each((i, el) => {
      css.push($(el).html())
    })
    styles.replaceWith('')
    let html = $.html()
    // $('head').append(`<style type="text/css">b{color:red}</style>`)
    let r = await purgeCSS(html, css.join('\n'))
    if (r) {
      // console.log('New CSS', r)
      $('head').append(`<style type="text/css">${r}</style>`)
    }
    // console.log(html.length, css.join('\n').length, r.length)
  }

}
