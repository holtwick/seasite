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

import { jsx } from '../site/jsx'
import dateformat from 'dateformat'
import { statSync } from 'fs'
import _ from 'lodash'
import { dom, parseMarkdown, SeaSite, xml } from '../index'
import { pathMatchesPatterns } from '../site'
import { matomoCampaignURL, matomoPixelImage } from '../plugins'

function pathToHTMLPath(path) {
  return path.replace(/\..+?$/, '.html').replace(/\/-/, '/')
}

let defaults = {
  folder: 'blog',
  pattern: null,
  handler: null,
  title: 'Blog',
  url: '',
  description: '',
  copyright: '',
  author: '',
  language: 'en-en',
  template(site) {
    return <div>
      <div id="content"></div>
    </div>
  },
}

export function blog(site: SeaSite, opt: Object = {}): Array<Object> {

  opt = Object.assign({}, defaults, opt)
  let entries = []

  if (!opt.pattern && opt.folder) {
    opt.pattern = new RegExp(opt.folder + '\/.*\.md$')
  }

  const { matomo } = opt
  let maxDate: ?Date

  // Collect post data
  site.handle(opt.pattern, (content, path) => {

    if (pathMatchesPatterns(path, opt.exclude)) {
      return
    }

    let md = parseMarkdown(content)
    let props = md.props
    let html = md.html
    let { title, date, hidden } = props
    if (hidden || path.indexOf('/-') > 0) {
      return
    }

    // Extract the date from the Markdown property string
    if (typeof date === 'string') {
      let m = /(\d\d\d\d)-(\d\d)-(\d\d)/.exec(date)
      if (m) {
        date = new Date(+m[1], +m[2] - 1, +m[3], 12, 0)
      }
    }

    // Extract the date from the filename, format: 2018-08-31-title
    if (!date) {
      let m = /(\d\d\d\d)-(\d\d)-(\d\d)/.exec(path)
      if (m) {
        date = new Date(+m[1], +m[2] - 1, +m[3], 12, 0)
      }
    }

    // Get date from file systemproperties
    if (!date) {
      const stat = statSync(site.path(path)) || {}
      date = stat.mtime
    }

    // Identify newest date
    try {
      if (!date || !maxDate || maxDate.getTime() < date.getTime()) {
        maxDate = date
      }
    } catch (e) {
      site.log.error(e.toString(), date.constructor.name)
    }

    entries.push({
      html,
      props,
      title,
      date,
      hidden,
      path,
      htmlPath: pathToHTMLPath(path),
      url: site.publicURL(pathToHTMLPath(path)),
    })
    return false
  })

  // Sort the posts
  entries = _.sortBy(entries, 'date').reverse()

  // RSS
  let atomContent = xml(
    <rss version="2.0" xmlns__atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>{opt.title}</title>
        <link>{opt.url}/</link>
        <description>{opt.description}</description>
        <language>{opt.language}</language>
        <copyright>{opt.copyright}</copyright>
        <pubDate>{dateformat(maxDate || new Date(), 'isoDateTime')}</pubDate>
      </channel>
    </rss>)
  for (let post of entries) {
    let link = site.publicURL(post.htmlPath)
    let html = post.html
    if (matomo) {
      link = matomoCampaignURL(link, {
        name: 'rss',
        kw: post.htmlPath,
      })
      html += matomoPixelImage({
        matomo,
        name: 'rss',
        kw: post.htmlPath,
        url: '/rss' + post.htmlPath,
      })
    }
    let atomEntry =
      <item>
        <title>{post.title}</title>
        <link>{link}</link>
        <pubDate>{dateformat(post.date, 'isoDateTime')}</pubDate>
        <author>{opt.author}</author>
        <description>{html}</description>
        <guid>{post.htmlPath}</guid>
      </item>
    atomContent('channel').append(atomEntry)
  }

  site.writeDOM(atomContent, `${opt.folder}/atom.xml`)
  site.writeDOM(atomContent, `/atom.xml`)

  // Blog Archive
  let $ = dom(opt.template(site))
  if ($) {
    let group = 'blog'
    $(`li[data-group="${group}"]`).addClass('active')
    $('#content').html(
      <div>
        <h1 className="blog-post-title">Blog</h1>
        <ul>
          {entries.map(post => <li>
            <a href={site.url(pathToHTMLPath(post.path))}>
              {post.title}
            </a>
            {/*({dateformat(post.date, 'longDate')})*/}
          </li>)}
        </ul>
      </div>,
    )
    $('title').text(opt.title)
    $('#recent-posts-container').remove()
    site.write(`${opt.folder}/index.html`, $.html())
  }

  return entries
}
