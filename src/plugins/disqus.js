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

import {isAbsoluteURL} from '../site'
import {jsx} from '../site/jsx'

import assert from 'assert'

const OPT = {
    selector: '.disqus',
    disqusURL: null, // 'https://xxx.disqus.com/embed.js',
    privacyURL: '/privacy#comment',
}

export function disqus(gopt: Object = {}) {
    gopt = Object.assign({}, OPT, gopt)

    return ($: Function, opt: Object = {}) => {
        opt = Object.assign({}, gopt, opt)

        assert(opt.selector, '"selector" required')
        assert(opt.path, '"path" required')
        assert(isAbsoluteURL(opt.url), '"url" needs to be absolute')

        $(opt.selector).each((i, el) => {
            let containerElement = $(el)

            let id = opt.path.replace(/\..+?$/, '').replace(/\/-/, '/')
            let url = opt.url
            let html = <div>
                <div id="disqus_thread" style="display: none;">
                    <blockquote>
                        <p>
                            The comment functionality is provided by <a href="https://disqus.com">Disqus</a>. Learn
                            more about it in our <a href={opt.privacyURL}>Privacy Policy</a>.
                        </p>
                        <p>
                            <button onClick="showComments();return false;" className="btn btn-default">
                                Open Comments
                            </button>
                        </p>
                    </blockquote>
                </div>

                <script>{`
                document.getElementById('disqus_thread').style.display = 'block'
                var disqus_config = function () {
                    this.page.url = '${url}'
                    this.page.identifier = '${id}'
                }
                function showComments() {
                    document.getElementById('disqus_thread').innerHTML = 'Loading...';
                    (function () { // DON'T EDIT BELOW THIS LINE
                        var d = document, s = d.createElement('script')
                        s.src = '${opt.disqusURL}'
                        s.setAttribute('data-timestamp', +new Date());
                        (d.head || d.body).appendChild(s)
                    })()
                }
                `}</script>
            </div>

            containerElement.replaceWith(html)
        })
    }
}