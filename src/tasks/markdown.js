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

import {parseMarkdown, plugin, jsx, dom, SeaSite} from '../index'

function pathToHTMLPath(path) {
    return path.replace(/\..+?$/, '.html').replace(/\/-/, '/')
}

const defaults = {
    pattern: /.*\.md$/,
    template(site) {
        return <div>
            <div id="content"/>
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

        let $ = dom(gopt.template(site, opt))

        opt.handle($, opt)

        $.applyPlugins(plugins, Object.assign({}, opt, {
            path,
        }))

        opt.html = $.html()
        pages.push(opt)

        if (gopt.cleanup === true) {
            site.remove(path)
        }

        site.write(pathToHTMLPath(opt.path), opt.html)
    })

    return pages
}