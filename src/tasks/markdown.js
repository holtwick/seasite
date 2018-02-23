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

import {HTML, parseMarkdown, plugin} from '../index'
import {dom} from '../dom'
import {jsx} from '../jsx'
import {SeaSite} from '../site'
import dateformat from 'dateformat'

function pathToHTMLPath(path) {
    return path.replace(/\..+?$/, '.html').replace(/\/-/, '/')
}

const defaults = {
    pattern: /.*\.md$/,
    template(site) {
        return <div>
            <div id="content"></div>
        </div>
    },
    handle($, opt) {

    },
}

export function markdown(site: SeaSite, gopt: Object = {}): Array<Object> {

    let pages = []
    gopt = Object.assign({}, defaults, gopt)

    const plugins = [
        plugin.href(),
        plugin.meta(),
    ]

    site.handle(gopt.pattern, (content, path) => {
        let md = parseMarkdown(content)
        let props = md.props
        let html = md.html

        let opt = Object.assign({}, defaults, gopt, props, {
            html,
            content,
            path,
            outline: md.outline,
        })

        // console.log('[markdown.]', opt)

        let $ = dom(gopt.template(site, opt))

        let group = props.group || 'blog'
        $(`li[data-group="${group}"]`).addClass('active')

        let related = (props.related || '').trim().split(',').map(v => v.trim()).filter(v => !!v)
        $('#content').html(<div>

            <h1 className="blog-post-title">{props.title}</h1>

            {group === 'blog' &&
            <p className="blog-post-meta">{dateformat(props.date, 'longDate')}</p>
            }

            {HTML(html)}

            {related.length > 0 &&
            <div className="blog-post-related">
                <h4>Related Posts</h4>
                <ul>
                    {related.map(r => <li><a href={`${r}.html`}>{r}</a></li>)}
                </ul>
            </div>

            }
        </div>)

        if (md.outline) {
            $('#sidebar').html(
                <nav id="outline" className="bs-docs-sidebar hidden-print hidden-sm hidden-xs" data-spy="affix"
                     data-offset-top="68">
                    {HTML(md.outline)}
                    <a href="#top" className="back-to-top"> Back to top </a>
                </nav>,
            )
            $('body').attr('data-spy', 'scroll').attr('data-target', '#outline')
            $('#content').addClass('doc')
        }
        else if (group === 'blog' || group === 'index') {
            let well = [], ct = 3
            for (let post of pages) {
                if (ct <= 0) break
                if (post.path !== path) {
                    well.push(<li>
                        {dateformat(post.date, 'longDate')}<br/>
                        <a href={site.url(pathToHTMLPath(post.path))}>
                            {post.title}
                        </a>
                    </li>)
                    --ct
                }
            }
            $('#recent-posts').html(well.join(''))
        }
        else {
            $('#recent-posts-container').remove()
        }

        $.applyPlugins(plugins, Object.assign({}, opt, {
            path,
        }))

        // absoluteLinks($, path)
        // $('title').text(`${WEBSITE_TITLE} - ${props.title}`)
        opt.html = $.html()
        pages.push(opt)

        site.write(pathToHTMLPath(opt.path), opt.html)
    })

    return pages
}