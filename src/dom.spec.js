// (C)opyright Dirk Holtwick, 2017-01-19 <dirk.holtwick@gmail.com>
// @jsx jsx

import {jsx} from './jsx'
import {dom} from './dom'
import {TestPlugin} from './plugins'

describe('DOM', () => {

    it('should understand HTML', () => {
        let r = <div><b>Bold</b></div>
        let $ = dom(r)

        $.applyPlugins([
            new TestPlugin('test'),
        ])

        expect($.html()).toBe('<html><head><meta name="test"></head><body><div><b>Bold</b></div></body></html>')
    })
})