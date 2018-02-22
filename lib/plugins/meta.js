'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MetaPlugin = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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

// (C)opyright 2018-01-04 Dirk Holtwick, holtwick.it. All rights reserved.

// @jsx jsx

// Support for Google Analytics integration, respecting do not track

var _jsx = require('../jsx');

var _plugin = require('./plugin');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isAbsoluteURL(url) {
    return url.indexOf('http') === 0;
}

var MetaPlugin = exports.MetaPlugin = function () {
    function MetaPlugin() {
        _classCallCheck(this, MetaPlugin);
    }

    _createClass(MetaPlugin, [{
        key: 'work',
        value: function work($) {
            var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


            // Canonical
            if (opt.url) {
                if (!isAbsoluteURL(opt.url)) {
                    console.warn('Canonical URLs need to be absolute, including the host name, instead got:', opt.url);
                } else {
                    $('link[rel="canonical"]').remove();
                    $('meta[property="og:url"]').remove();
                    $('head').append((0, _jsx.jsx)('link', { rel: 'canonical', href: opt.url })).append((0, _jsx.jsx)('meta', { property: 'og:url', content: opt.url }));
                }
            }

            // Language
            if (!opt.lang) {
                $('html').attr('lang', opt.lang);
                // $('head').append(<link rel="alternate" hreflang="de" href="/help_de/index.html"/>)
            }

            // Title
            if (opt.title) {
                $('title').text(opt.title);
                $('meta[property="og:title"]').remove();
                $('head').append((0, _jsx.jsx)('meta', { property: 'og:title', content: opt.title }));
            }

            // Description
            if (opt.description) {
                $('meta[name="description"]').remove();
                $('meta[property="og:description"]').remove();
                $('head').append((0, _jsx.jsx)('meta', { name: 'description', property: 'og:description', content: opt.description }));
            }

            // Keywords
            if (opt.keywords) {
                if (Array.isArray(opt.keyword)) {
                    opt.keywords = opt.keywords.join(',');
                }
                $('meta[name="keywords"]').remove();
                $('meta[property="og:keywords"]').remove();
                $('head').append((0, _jsx.jsx)('meta', { name: 'keywords', property: 'og:keywords', content: opt.keywords }));
            }

            // Image
            if (opt.image) {
                if (!isAbsoluteURL(opt.image)) {
                    console.warn('Image URLs need to be absolute, including the host name, instead got:', opt.url);
                } else {
                    $('meta[property="og:image"]').remove();
                    $('head').append((0, _jsx.jsx)('meta', { property: 'og:image', content: opt.image }));
                    if (opt.title) {
                        $('head').append((0, _jsx.jsx)('meta', { property: 'og:image:alt', content: opt.title }));
                    }
                }
            }

            // Facebook
            // https://developers.facebook.com/tools/debug/
            // https://developers.facebook.com/docs/sharing/webmasters#markup
            if (opt.facebook) {
                $('meta[property="fb:app_id"]').remove();
                $('head').append((0, _jsx.jsx)('meta', { property: 'fb:app_id', content: opt.facebook }));
            }

            // Twitter
            // https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started
            if (opt.twitter) {
                if (opt.twitter[0] !== '@') opt.twitter = '@' + opt.twitter;
                $('meta[name="twitter:site"]').remove();
                $('head').append((0, _jsx.jsx)('meta', { name: 'twitter:creator', content: opt.twitter })).append((0, _jsx.jsx)('meta', { name: 'twitter:card', content: 'summary' }));
            }

            // Author

            // Video
            if (opt.video) {
                $('meta[property="og:video"]').remove();
                $('head').append((0, _jsx.jsx)('meta', { property: 'og:video', content: opt.video }));
            }

            // Generator, Type
            $('head').append((0, _jsx.jsx)('meta', { name: 'generator', content: 'SeaSite, https://github.com/holtwick/seasite/' })).append((0, _jsx.jsx)('meta', { property: 'og:type', content: 'website' }));
        }
    }]);

    return MetaPlugin;
}();