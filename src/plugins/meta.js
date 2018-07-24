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
import {isAbsoluteURL} from '../site/relativeurls'

export function meta(gopt: Object = {}) {

    return ($: Function, opt: Object = {}) => {
        opt = Object.assign({}, gopt, opt)

        // Canonical
        if (opt.url) {
            if (!isAbsoluteURL(opt.url)) {
                console.warn('Canonical URLs need to be absolute, including the host name, instead got:', opt.url)
            } else {
                $('link[rel="canonical"]').remove()
                $('meta[property="og:url"]').remove()
                $('head')
                    .append(<link rel="canonical" href={opt.url}/>)
                    .append(<meta property="og:url" content={opt.url}/>)
            }
        }

        // Language
        if (opt.lang) {
            $('html').attr('lang', opt.lang)
            // $('head').append(<link rel="alternate" hreflang="de" href="/help_de/index.html"/>)
        }

        // Title
        if (opt.title) {
            $('title').text(opt.title)
            $('meta[property="og:title"]').remove()
            $('head')
                .append(<meta property="og:title" content={opt.title}/>)

        }

        // Description
        if (opt.description || opt.desc) {
            $('meta[name="description"]').remove()
            $('meta[property="og:description"]').remove()
            $('head').append(<meta name='description' property="og:description" content={opt.description || opt.desc}/>)
        }

        // Keywords
        if (opt.keywords) {
            if (Array.isArray(opt.keyword)) {
                opt.keywords = opt.keywords.join(',')
            }
            $('meta[name="keywords"]').remove()
            $('meta[property="og:keywords"]').remove()
            $('head').append(<meta name='keywords' property="og:keywords" content={opt.keywords}/>)
        }

        // Image
        if (opt.image) {
            if (!isAbsoluteURL(opt.image)) {
                console.warn('Image URLs need to be absolute, including the host name, instead got:', opt.url)
            } else {
                $('meta[property="og:image"]').remove()
                $('head').append(<meta property="og:image" content={opt.image}/>)
                if (opt.title) {
                    $('head').append(<meta property="og:image:alt" content={opt.title}/>)
                }
            }
        }

        // Facebook
        // https://developers.facebook.com/tools/debug/
        // https://developers.facebook.com/docs/sharing/webmasters#markup
        if (opt.facebook) {
            $('meta[property="fb:app_id"]').remove()
            $('head').append(<meta property="fb:app_id" content={opt.facebook}/>)
        }

        // Twitter
        // https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started
        if (opt.twitter) {
            if (opt.twitter[0] !== '@') opt.twitter = '@' + opt.twitter
            $('meta[name="twitter:site"]').remove()
            $('head')
                .append(<meta name="twitter:creator" content={opt.twitter}/>)
                .append(<meta name="twitter:card" content="summary"/>)
        }

        // Author

        // Video
        if (opt.video) {
            $('meta[property="og:video"]').remove()
            $('head').append(<meta property="og:video" content={opt.video}/>)
        }

        // Generator, Type
        {
            $('meta[name="generator"]').remove()
            $('meta[property="og:type"]').remove()
            $('head')
                .append(<meta name="generator" content="SeaSite, https://github.com/holtwick/seasite/"/>)
                .append(<meta property="og:type" content="website"/>)
        }

    }

}