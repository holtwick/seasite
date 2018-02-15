// (C)opyright Dirk Holtwick, 2016-10-28 <dirk.holtwick@gmail.com>

import * as url from 'url'

function urlRelative(fromURL, toURL) {
    try {
        // assert(fromURL[0] === '/', `Expected absolute URL ${fromURL}`);
        // assert(toURL[0] === '/', `Expected absolute URL ${toURL}`);

        let fromParts = fromURL.split('/')
        let toParts = toURL.split('/')
        // console.log(fromParts, toParts);

        // Find common root
        let indexCommon = 0
        for (let i = 0; i < fromParts.length - 1; i++) {
            if (toParts[i] === fromParts[i]) {
                indexCommon++
            } else {
                break
            }
        }
        fromParts = fromParts.slice(indexCommon)
        toParts = toParts.slice(indexCommon)
        // console.log(fromParts, toParts);

        // Moving up missing levels
        for (let i = 0; i < fromParts.length - 1; i++) {
            toParts.unshift('..')
        }

        return toParts.join('/')
    } catch (err) {
        //console.error('urlRelative', toURL, err.toString());
        return toURL
    }
}

const urlElements = [
    {tag: 'a', attr: 'href'},
    {tag: 'script', attr: 'src'},
    {tag: 'link', attr: 'href'},
    {tag: 'img', attr: 'src'},
]

export function translateLinks($, baseURL) {
    for (let info of urlElements) {
        $(`${info.tag}[${info.attr}]`).each((i, e) => {
            e = $(e)
            const href = e.attr(info.attr)
            if (/^(mailto|#|https?:)/.test(href)) {
                return
            }
            const toUrl = url.resolve('/', href)
            const fromUrl = url.resolve('/', baseURL)
            const newHref = urlRelative(fromUrl, toUrl)
            // console.log('from', href, 'to', newHref);
            // url = urlRelative(url.baseUrl || '/', url);
            e.attr(info.attr, newHref)
        })
    }
}

export function handleLinks($, handle) {
    for (let info of urlElements) {
        $(`${info.tag}[${info.attr}]`).each((i, e) => {
            e = $(e)
            const href = e.attr(info.attr)
            if (/^(mailto|#|https?:)/.test(href)) {
                return
            }
            let newHref = handle(href)
            if (newHref) {
                e.attr(info.attr, newHref)
            }
        })
    }
}

export function absoluteLinks($, baseURL = '/') {
    if (baseURL[0] !== '/') {
        baseURL = '/' + baseURL
    }
    handleLinks($, href => {
        return url.resolve(baseURL, href)
    })
}