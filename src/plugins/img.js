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

import { existsSync } from 'fs'
import { join } from 'path'
import log from '../log'
import { isAbsoluteURL } from '../site/relativeurls'
import sizeOf from 'image-size'

const OPT = {}

let cache = {}

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

        // Lazy loader by default https://css-tricks.com/native-lazy-loading/
        img.attr('loading', 'auto')

        if (src.indexOf('data:') === 0) {
          log.debug('[plugin.image] Skip data image:', src)
          return
        }

        let srcset = img.attr('srcset')
        if (srcset) {
          let images = srcset.split(',')
          let result = []
          for (let imgsrc of images) {
            let [src, scale] = imgsrc.trim().split(' ')

            let p
            if (src[0] === '/') {
              src = src.substr(1)
              p = join(basePath, src)
            } else {
              p = join(basePath, path, '..', src)
            }

            // Does it exist?
            if (!existsSync(p)) {
              log.warn(`[plugin.image] Image at ${p} is referenced in ${path} but is missing!`)
              continue
            }

            result.push(`${src} ${scale}`)
          }

          srcset = result.join(', ')
          // img.attr('srcset', srcset)
          // console.log('New src',result.join(', '))
        } else {

          if (!isAbsoluteURL(src)) {

            // Get generic path to file location
            let p
            if (src[0] === '/') {
              src = src.substr(1)
              p = join(basePath, src)
            } else {
              p = join(basePath, path, '..', src)
            }

            // Does it exist?
            if (!existsSync(p)) {
              log.warn(`[plugin.image] Image at ${p} is referenced in ${path} but is missing!`)
              return
            }

            // Is there a higher resolution available? Use that.
            if (src.indexOf('@2x.') <= 0) {
              let p2 = p.replace(/\.([a-z0-9]+)$/, '@2x.$1')
              if (existsSync(p2)) {
                src = img.attr('src')
                src = src.replace(/\.([a-z0-9]+)$/, '@2x.$1')
                img.attr('src', src)
                p = p2
              }
            }

            // Adjust the width and height for best experience
            if (!(img.attr('width') || img.attr('height'))) {
              let size = sizeOf(p)
              if (src.indexOf('@2x.') > 0) {
                size.width /= 2
                size.height /= 2
              }
              img.attr('width', size.width.toString())
              img.attr('height', size.height.toString())
            }
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
