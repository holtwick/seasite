// (C)opyright Dirk Holtwick, 2017-01-19 <dirk.holtwick@gmail.com>
// @jsx jsx

import {jsx} from './jsx'
import {dom} from './dom'
import {ExamplePlugin} from './plugins'

describe('DOM', () => {

    it('should understand HTML', () => {
        let r = <div><b>Bold</b></div>
        let $ = dom(r)

        $.applyPlugins([
            new ExamplePlugin('test'),
        ], {
            value: 123
        })

        expect($.html()).toBe('<html><head><meta name="test" value="123"></head><body><div><b>Bold</b></div></body></html>')
    })
})