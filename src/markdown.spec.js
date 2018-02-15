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

Lorem **ipsum**
`)
        expect(r.props).toEqual({
            title: 'One World',
        })

        expect(r.html).toBe('<h1>This is a world</h1><p>Lorem <strong>ipsum</strong></p>\n')
    })

})