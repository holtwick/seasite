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

import {jsx, HTML, prependXMLIdentifier, unescapeHTML, escapeHTML} from './jsx'

const fs = require('fs')
const marked = require('marked')
const hljs = require('highlight.js')
const yaml = require('yamljs')

function buildOutline(headers, level = 1, opt = {
    maxLevel: 2,
    class: {
        '1': 'nav bs-docs-sidenav',
        '2': 'nav',
        '3': 'nav',
        '4': 'nav',
        '5': 'nav',
    },
}) {
    let list = ''
    while (headers && headers.length > 0) {
        if (!list) {
            list += `<ul class="${opt.class[level.toString()]}">`
        }
        let h = headers[0]
        if (h) {
            if (h.level === level) {
                list += `<li><a href="#${h.anchor}">${h.text}</a>`
                headers.shift()
                let hh = headers[0]
                if (hh && hh.level > level) {
                    list += buildOutline(headers, level + 1)
                }
                list += `</li>`
            }
            else if (h.level < level) {
                list += '</ul>\n'
                return list
            }
            else {
                if (level < opt.maxLevel) {
                    list += buildOutline(headers, level + 1)
                }
                else {
                    headers.shift()
                }
            }
        }
    }
    return list
}

export function parseMarkdown(content: string | Buffer, opt: Object = {
    outline: false,
}) {
    // Props

    // assert(content != null && content.length > 0 && typeof content === 'string', 'parseMarkdown expects content', content);
    let result = {}
    result.content = content.toString().replace(/^---([\s\S]*?)---/gi, function (_, propString) {
        result.props = yaml.parse(propString.trim())
        return ''
    })
    let props = result.props || {}
    result.props = props

    opt.outline = opt.outline || props.outline

    // https://github.com/chjj/marked

    let headers = []
    let ctr = 0

    let renderer = new marked.Renderer()
    renderer.heading = function (text, level) {
        let anchor = null // text.toLowerCase().replace(/[^\w]+/g, '-')
        text = text.replace(/{#([^}]+)}/, (m, a) => {
            anchor = a
            return ''
        })
        if (!props.title) {
            props.title = unescapeHTML(text)
            return ''
        }
        if (opt.outline) {
            anchor = anchor || 'outline-' + ++ctr
            headers.push({
                level: +level,
                anchor,
                text: text.replace(/<.*?>/g, '').trim()
            })
        }
        if (props.inc) {
            level = +level + +props.inc
        }
        if (anchor) {
            return `<h${level} id="${anchor}"><a name="${anchor}" class="anchor" href="#${anchor}">${text}</a></h${level}>`
        }
        return `<h${level}>${text}</h${level}>`
    }

    marked.setOptions({
        gfm: true, //  GitHub flavored markdown.
        highlight: function (code, lang) {
            // console.log(lang);
            return hljs.highlightAuto(code, [lang]).value
        },
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: props.sanitize == null ? false : props.sanitize,
        smartLists: true,
        smartypants: false,
        langPrefix: 'lang-',
        renderer,
    })
    result.html = marked(result.content)

    if (opt.outline) {
        // result.outline = headers
        // console.log(buildOutline(headers))
        result.outline = buildOutline(headers, headers[0].level)
    }

    // result.outPath = result.outPath.replace(/\.(md|markdown)$/i, '.html');
    return result
}

// export function readMarkdown(p) {
//     const md = fs.readFileSync(p, 'utf8')
//     return marked(md).toString()
// }
