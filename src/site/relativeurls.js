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

// (C)opyright Dirk Holtwick, 2016-10-28 <dirk.holtwick@gmail.com>

import * as url from 'url'

export function isAbsoluteURL(url: string) {
  return url.indexOf('http') === 0
}

export function urlRelative(fromURL, toURL) {
  try {
    // assert(fromURL[0] === '/', `Expected absolute URL ${fromURL}`);
    // assert(toURL[0] === '/', `Expected absolute URL ${toURL}`);

    let fromParts = fromURL.split('/')
    let toParts = toURL.split('/')
    // console.log(fromParts, toParts);

    // Find common root
    let indexCommon = 0
    for (let i = 0; i < fromParts.length - 1; i++) {
      if (toParts[i] === fromParts[i]) {
        indexCommon++
      } else {
        break
      }
    }
    fromParts = fromParts.slice(indexCommon)
    toParts = toParts.slice(indexCommon)
    // console.log(fromParts, toParts);

    // Moving up missing levels
    for (let i = 0; i < fromParts.length - 1; i++) {
      toParts.unshift('..')
    }

    return toParts.join('/')
  } catch (err) {
    //console.error('urlRelative', toURL, err.toString());
    return toURL
  }
}

const urlElements = [
  {tag: 'a', attr: 'href'},
  {tag: 'script', attr: 'src'},
  {tag: 'link', attr: 'href'},
  {tag: 'img', attr: 'src'}
]

export function translateLinks($, baseURL) {
  for (let info of urlElements) {
    $(`${info.tag}[${info.attr}]`).each((i, e) => {
      e = $(e)
      const href = e.attr(info.attr)
      if (/^(mailto|#|https?:)/.test(href)) {
        return
      }
      const toUrl = url.resolve('/', href)
      const fromUrl = url.resolve('/', baseURL)
      const newHref = urlRelative(fromUrl, toUrl)
      // console.log('from', href, 'to', newHref);
      // url = urlRelative(url.baseUrl || '/', url);
      e.attr(info.attr, newHref)
    })
  }
}

export function handleLinks($, handle) {
  for (let info of urlElements) {
    $(`${info.tag}[${info.attr}]`).each((i, e) => {
      e = $(e)
      const href = e.attr(info.attr)
      if (/^(mailto|#|https?:)/.test(href)) {
        return
      }
      let newHref = handle(href)
      if (newHref) {
        e.attr(info.attr, newHref)
      }

      if (info.tag === 'img') {
        let srcset = e.attr('srcset')
        if (srcset) {
          srcset = srcset.split(',').map(line => {
            let [href, scale] = line.trim().split(/[ \t]+/)
            return `${handle(href)} ${scale}`
          }).join(', ')
          e.attr('srcset', srcset)
        }
      }
    })
  }
}

// export function absoluteLinks($, baseURL = '/') {
//     if (baseURL[0] !== '/') {
//         baseURL = '/' + baseURL
//     }
//     handleLinks($, href => {
//         return url.resolve(baseURL, href)
//     })
// }