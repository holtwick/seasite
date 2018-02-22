// (C)opyright 2018-01-04 Dirk Holtwick, holtwick.it. All rights reserved.
// @flow
// @jsx jsx

// Support for Google Analytics integration, respecting do not track

import {Plugin} from './plugin'
import {jsx} from '../jsx'

export class ExamplePlugin implements Plugin {

    name: string

    constructor(value: string) {
        this.name = value || ''
    }

    work($:any, opts:Object={
        value: 0
    }) {
        $('head').append(<meta name={this.name} value={opts.value || 0}/>)
    }

}
