// (C)opyright 2018-01-04 Dirk Holtwick, holtwick.it. All rights reserved.
// @flow
// @jsx jsx

// Support for Google Analytics integration, respecting do not track

import {Plugin} from './plugin'
import {jsx} from '../jsx'

export class TestPlugin implements Plugin {

    value: string

    constructor(value: string) {
        this.value = value || ''
    }

    work($) {
        $('head').append(<meta name={this.value}/>)
    }

}
