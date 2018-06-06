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

import {parseMarkdown} from './markdown'

describe('Markdown', () => {

    it('parses correctly', () => {
        let r = parseMarkdown('Hello **world**')
        expect(r).toEqual({
            'content': 'Hello **world**',
            'html': '<p>Hello <strong>world</strong></p>\n',
            'props': {},
        })
    })

    it('parses properties', () => {
        let r = parseMarkdown(`---
title: One World
---

# This is a world

\`\`\`js
alert(1)
alert(2)
\`\`\`        

Lorem **ipsum**
`)
        expect(r.props).toEqual({
            title: 'One World',
        })

        expect(r.html).toBe('<h1>This is a world</h1><pre><code class="lang-js">alert(1)\nalert(2)</code></pre>\n<p>Lorem <strong>ipsum</strong></p>\n')
    })

})