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

import { jsx, xml } from '../site'
import { SeaSite } from '../site/site'

let defaults = {
  exclude: [
    '404.html',
  ],
  pattern: /\.html?$/,
}

export function sitemap(site: SeaSite, opt: Object = {}) {
  opt = Object.assign({}, defaults, opt)

  // log.info(opt.pattern, opt.exclude)
  let urls = site
    .paths(opt.pattern, opt.exclude)
    .map(path => site.publicURL(path))

  urls.sort()
  site.write('sitemap.txt', urls.join('\n'))

  let sitemapXML = xml(<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>)
  for (let url of urls) {
    let atomEntry =
      <url>
        <loc>{url}</loc>
      </url>
    sitemapXML('urlset').append(atomEntry)
  }
  site.writeDOM(sitemapXML, 'sitemap.xml')

  if (!site.exists('robots.txt')) {
    site.write('robots.txt', `User-agent: *\nSitemap: ${site.publicURL('sitemap.xml')}`)
  }
}
