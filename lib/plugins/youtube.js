'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.youtube = youtube;

var _jsx = require('../site/jsx');

var _path = require('path');

var _fs = require('fs');

var OPT = {
    videoTitle: 'Served by youtube.com'
}; /*
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

// @jsx jsx

function youtube() {
    var gopt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    gopt = Object.assign({}, OPT, gopt);

    return function ($) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        opt = Object.assign({}, gopt, opt);

        var basePath = opt.basePath || opt.site.basePath;
        var path = opt.path || 'index.html';

        if (basePath) {
            $('iframe[src]').each(function (i, el) {
                var iframe = $(el);
                var src = iframe.attr('src');
                var m = /^https:\/\/www.youtube.com\/embed\/(.*?)$/.exec(src);
                var key = m[1];
                if (key && key.length) {
                    var root = iframe;
                    var div = iframe.parent('div.embed-video-container,div.embed-responsive');
                    if (div.html()) {
                        root = div;
                    }
                    var staticLink = 'https://youtu.be/' + key;
                    var onClick = 'this.parentNode.innerHTML = \'<iframe src="https://www.youtube.com/embed/' + key + '?autoplay=1" frameBorder="0" allowFullScreen class="embed-responsive-item"></iframe>\'; return false;';
                    root.replaceWith((0, _jsx.jsx)(
                        'div',
                        { className: 'video-wrapper embed-video-container embed-responsive embed-responsive-16by9' },
                        (0, _jsx.jsx)(
                            'a',
                            { href: staticLink, onClick: onClick },
                            (0, _jsx.jsx)('img', { src: 'https://i.ytimg.com/vi/' + key + '/0.jpg', width: '100%',
                                className: 'youtube-placeholder embed-responsive-item' })
                        ),
                        (0, _jsx.jsx)(
                            'div',
                            { className: 'video-overlay-content' },
                            (0, _jsx.jsx)(
                                'div',
                                { className: 'video-overlay-inner' },
                                (0, _jsx.jsx)(
                                    'svg',
                                    { className: 'video-overlay-play-button', viewBox: '0 0 200 200', alt: 'Play video' },
                                    (0, _jsx.jsx)('circle', { cx: '100', cy: '100', r: '90', fill: 'none', 'stroke-width': '15', stroke: '#fff' }),
                                    (0, _jsx.jsx)('polygon', { points: '70, 55 70, 145 145, 100', fill: '#fff' })
                                ),
                                (0, _jsx.jsx)(
                                    'div',
                                    null,
                                    opt.videoTitle
                                )
                            )
                        )
                    ));
                }
            });
        }
    };
}