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

import {SeaSite} from '../index'
import log from '../log'
import {isDOM, isPattern, pathMatchesPatterns} from '../site'

function pathToHTMLPath(path) {
  return path.replace(/\..+?$/, '.html').replace(/\/-/, '/')
}

const defaults = {
  pattern: /.*/,
  plugins: []
}

export function handle(site: SeaSite, gopt: Object = {}): Array<Object> {

  let pages = []

  const plugins = gopt.plugins

  gopt = Object.assign({}, defaults, gopt)

  site.handle(gopt.pattern, ($, path) => {
    if (isPattern(gopt.exclude) && pathMatchesPatterns(path, gopt.exclude)) {
      return false // don't write
    }

    let opt = Object.assign({}, defaults, gopt, {
      site,
      path
    })

    if (isDOM($) && plugins && plugins.length) {
      $.applyPlugins(plugins, opt)
    }

    if (!opt.handler) {
      log.warn('[task.handle] Will not write', path)
      return false // don't write
    }

    if (opt.handler($, path) === false) {
      return false
    }

    pages.push(opt)
  })

  return pages
}

export async function handleAsync(site: SeaSite, gopt: Object = {}): Array<Object> {

  let pages = []

  const plugins = gopt.plugins

  gopt = Object.assign({}, defaults, gopt)

  await site.handleAsync(gopt.pattern, async ($, path) => {
    if (isPattern(gopt.exclude) && pathMatchesPatterns(path, gopt.exclude)) {
      return false // don't write
    }

    let opt = Object.assign({}, defaults, gopt, {
      site,
      path
    })

    if (isDOM($) && plugins && plugins.length) {
      await $.applyPluginsAsync(plugins, opt)
    }

    if (!opt.handler) {
      log.warn('[task.handle] Will not write', path)
      return false // don't write
    }

    if (opt.handler($, path) === false) {
      return false
    }

    pages.push(opt)
  })

  return pages
}



