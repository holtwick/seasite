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

import {jsx} from '../site/jsx'

import {join} from 'path'
import {existsSync} from 'fs'

const OPT = {
    videoTitle: 'Served by youtube.com',
}

export function youtube(gopt: Object = {}) {
    gopt = Object.assign({}, OPT, gopt)

    return ($: Function, opt: Object = {}) => {
        opt = Object.assign({}, gopt, opt)

        const basePath = opt.basePath || opt.site.basePath
        const path = opt.path || 'index.html'

        if (basePath) {
            $('iframe[src]').each((i, el) => {
                let img = $(el)
                let src = img.attr('src')
                let m = /^https:\/\/www.youtube.com\/embed\/(.*?)$/.exec(src)
                let key = m[1]
                if (key && key.length) {
                    let root = img.parent('div.embed-video-container') || img
                    // console.log('[youtube.yt]', key, root.html())
                    let staticLink = `https://youtu.be/${key}`
                    let onClick = `this.parentNode.innerHTML = '<iframe src="https://www.youtube.com/embed/${key}?autoplay=1" frameBorder="0" allowFullScreen class="embed-responsive-item"></iframe>'; return false;`
                    root.replaceWith(
                        <div className="video-wrapper embed-video-container embed-responsive embed-responsive-16by9">
                            <a href={staticLink} onClick={onClick}>
                                <img src={`https://i.ytimg.com/vi/${key}/maxresdefault.jpg`}
                                     className='youtube-placeholder'/>
                            </a>
                            <div className="video-overlay-content">
                                <div className="video-overlay-inner">
                                    <svg className="video-overlay-play-button" viewBox="0 0 200 200" alt="Play video">
                                        <circle cx="100" cy="100" r="90" fill="none" stroke-width="15" stroke="#fff"/>
                                        <polygon points="70, 55 70, 145 145, 100" fill="#fff"/>
                                    </svg>
                                    <div>{opt.videoTitle}</div>
                                </div>
                            </div>
                        </div>)
                }
            })
        }
    }

}