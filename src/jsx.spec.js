// (C)opyright Dirk Holtwick, 2017-01-19 <dirk.holtwick@gmail.com>
// @jsx jsx

import {jsx} from './jsx'

describe('JSX', () => {
    it('jsx', () => {
        let r = <div><b>Bold</b></div>
        expect(r).toBe('<div><b>Bold</b></div>')
    })
})